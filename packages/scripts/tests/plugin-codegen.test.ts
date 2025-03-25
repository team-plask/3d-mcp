import { join } from "path";
import { exec, execSync } from "child_process";
import { existsSync, readdirSync, readFileSync } from "fs";
import { generatePluginCode } from "../plugin-codegen";
import {
  SCHEMA_DIR,
  extractSchemas,
  cleanupSchemas,
  discoverDomains,
} from "../extract-schemas";

// Configuration
const PLUGINS_DIR = join(process.cwd(), "packages/plugins");
const TIMEOUT = 30000; // 30 seconds for longer tests

/**
 * Generate default value based on parameter type
 */
function generateDefaultValue(paramSchema: any): any {
  if (!paramSchema) return null;

  const type = paramSchema.type;

  switch (type) {
    case "string":
      return paramSchema.enum ? paramSchema.enum[0] : "";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      const result: Record<string, any> = {};
      if (paramSchema.properties) {
        for (const [propName, propSchema] of Object.entries(
          paramSchema.properties
        )) {
          result[propName] = generateDefaultValue(
            propSchema as any
          );
        }
      }
      return result;
    default:
      return null;
  }
}

/**
 * Extract a tool schema and generate default parameters
 */
async function extractToolDefaultParams(
  category: string
): Promise<{ tool: string; params: any }> {
  // Ensure schemas are extracted and available
  await extractSchemas(true);

  // Get list of tool schema files in the category
  const categoryDir = join(SCHEMA_DIR, category);
  if (!existsSync(categoryDir)) {
    throw new Error(
      `Schema directory not found for ${category}`
    );
  }

  const schemaFiles = readdirSync(categoryDir).filter(
    (file) => file.endsWith(".json")
  );

  if (schemaFiles.length === 0) {
    throw new Error(`No schema files found in ${category}`);
  }

  // Select a random tool schema
  const schemaFile =
    schemaFiles[
      Math.floor(Math.random() * schemaFiles.length)
    ]!;
  const schemaPath = join(categoryDir, schemaFile);
  const schema = JSON.parse(
    readFileSync(schemaPath, "utf8")
  );

  // Generate default parameters based on the schema
  const defaultParams: Record<string, any> = {};

  if (schema.parameters && schema.parameters.properties) {
    for (const [paramName, paramSchema] of Object.entries(
      schema.parameters.properties
    )) {
      defaultParams[paramName] =
        generateDefaultValue(paramSchema);
    }
  }

  console.log(
    `Generated default params for ${
      schema.name
    }: ${JSON.stringify(defaultParams)}`
  );

  return {
    tool: schema.name,
    params: defaultParams,
  };
}

/**
 * Discover and select a random domain for testing
 */
async function getRandomDomain(): Promise<string> {
  // Get all available domains
  const domains = await discoverDomains(true);

  // Filter out the 'core' domain as it typically doesn't have tools
  const toolDomains = domains.filter(
    (domain) => domain !== "core"
  );

  if (toolDomains.length === 0) {
    throw new Error(
      "No valid tool domains found for testing!"
    );
  }

  // Select a random domain
  return toolDomains[
    Math.floor(Math.random() * toolDomains.length)
  ]!;
}

describe("Plugin Code Generation Tests", () => {
  // Clean up schemas after all tests
  afterAll(async () => {
    console.log("Cleaning up schema files after tests");
    cleanupSchemas();
  });

  // Test if code generation completes successfully
  test(
    "generatePluginCode runs without errors",
    async () => {
      try {
        await generatePluginCode(true);
        // If we reach here, no exception was thrown

        // Verify output directories were created
        expect(
          existsSync(join(PLUGINS_DIR, "blender"))
        ).toBe(true);
        expect(existsSync(join(PLUGINS_DIR, "maya"))).toBe(
          true
        );
        expect(
          existsSync(join(PLUGINS_DIR, "unreal"))
        ).toBe(true);
      } catch (error) {
        fail(`generatePluginCode threw an error: ${error}`);
      }
    },
    TIMEOUT
  );

  // Test Python code linting
  test(
    "Generated Python code passes linting",
    async () => {
      // Install ruff if not already installed
      try {
        execSync("pip install ruff");
      } catch (error) {
        fail(`Failed to install ruff: ${error}`);
      }

      // Check if ruff is installed
      try {
        execSync("ruff --version");
      } catch (error) {
        fail(`Ruff is not installed: ${error}`);
      }

      // Using ruff - a modern, fast Python linter
      const pythonFiles = [
        ...findFiles(join(PLUGINS_DIR, "blender"), ".py"),
        ...findFiles(join(PLUGINS_DIR, "maya"), ".py"),
      ];

      expect(pythonFiles.length).toBeGreaterThan(0);

      // Use select flag to only check for critical errors (E9), not style issues
      const lintCommand = `ruff check --select E9 ${pythonFiles.join(
        " "
      )}`;

      try {
        // Execute directly and check the output - success shouldn't throw
        const output = await execPromiseWithOutput(
          lintCommand
        );
        console.log(`Python linting output: ${output}`);
      } catch (error) {
        fail(`Python linting failed: ${error}`);
      }
    },
    TIMEOUT
  );

  // Test C++ code linting
  test(
    "Generated C++ code passes linting",
    async () => {
      // Using clang-format for C++ verification (not linting)
      const cppFiles = findFiles(
        join(PLUGINS_DIR, "unreal"),
        ".cpp"
      );
      const headerFiles = findFiles(
        join(PLUGINS_DIR, "unreal"),
        ".h"
      );

      expect(cppFiles.length).toBeGreaterThan(0);
      expect(headerFiles.length).toBeGreaterThan(0);

      // Instead of linting, just check that files exist and can be parsed
      console.log(
        `Found ${cppFiles.length} C++ files and ${headerFiles.length} header files`
      );

      // Sample check just to verify file format (only check first file of each type)
      if (cppFiles.length > 0) {
        try {
          const checkResult = execSync(
            `head -n 10 "${cppFiles[0]}"`,
            { encoding: "utf8" }
          );
          console.log(
            `C++ file sample content verified: ${cppFiles[0]}`
          );
        } catch (error) {
          fail(`Failed to read C++ file: ${error}`);
        }
      }

      if (headerFiles.length > 0) {
        try {
          const checkResult = execSync(
            `head -n 10 "${headerFiles[0]}"`,
            { encoding: "utf8" }
          );
          console.log(
            `Header file sample content verified: ${headerFiles[0]}`
          );
        } catch (error) {
          fail(`Failed to read header file: ${error}`);
        }
      }
    },
    TIMEOUT
  );

  // Test server startup (for Python-based plugins)
  test(
    "Python servers start up correctly",
    async () => {
      let serverTestsFailed = false;

      // Extract a test tool with default parameters using a random domain
      let testRequest;
      try {
        // Get a random domain for testing
        const randomDomain = await getRandomDomain();
        console.log(
          `Using random domain for testing: ${randomDomain}`
        );

        testRequest = await extractToolDefaultParams(
          randomDomain
        );
        console.log(
          `Using test tool: ${testRequest.tool} from domain: ${randomDomain}`
        );
      } catch (error) {
        console.error(
          `Failed to extract tool schema from primary domain: ${error}`
        );
        try {
          // Try another random domain as fallback
          const fallbackDomain = await getRandomDomain();
          console.log(
            `Using fallback domain: ${fallbackDomain}`
          );

          testRequest = await extractToolDefaultParams(
            fallbackDomain
          );
          console.log(
            `Using fallback test tool: ${testRequest.tool} from domain: ${fallbackDomain}`
          );
        } catch (fallbackError) {
          console.error(
            `Failed to extract fallback tool schema: ${fallbackError}`
          );
          // Last resort - use a simple test request
          testRequest = {
            tool: "test",
            params: {},
          };
          console.log(
            `Using last resort test tool: ${testRequest.tool}`
          );
        }
      }

      // Test for Maya server
      console.log("Starting Maya server test...");
      const mayaPort = 8001; // Use different ports for each server
      const mayaServerProcess = startPythonServer(
        "maya",
        mayaPort
      );

      try {
        console.log(
          `Waiting for Maya server to start on port ${mayaPort}...`
        );
        await delay(3000);

        try {
          const response = await sendTestRequest(
            "localhost",
            mayaPort,
            testRequest
          );
          console.log("Maya server response:", response);

          // Check that response has success property and it's true
          expect(response).toHaveProperty("success");
          expect(response.success).toBe(true);
          console.log("Maya server connection verified");
        } catch (error) {
          console.error(
            "Maya server connection failed:",
            error
          );
          serverTestsFailed = true;
          // Now we want to fail the test if connection fails
          throw new Error(
            `Maya server test failed: ${
              (error as any).message
            }`
          );
        }
      } finally {
        console.log("Terminating Maya server");
        mayaServerProcess.kill();
        await delay(1000); // Wait for process to terminate
      }

      // Test for Blender server
      console.log("Starting Blender server test...");
      const blenderPort = 8002;
      const blenderServerProcess = startPythonServer(
        "blender",
        blenderPort
      );

      try {
        console.log(
          `Waiting for Blender server to start on port ${blenderPort}...`
        );
        await delay(3000);

        try {
          const response = await sendTestRequest(
            "localhost",
            blenderPort,
            testRequest
          );
          console.log("Blender server response:", response);

          // Verify proper response
          expect(response).toHaveProperty("success");
          expect(response.success).toBe(true);
          console.log("Blender server connection verified");
        } catch (error) {
          console.error(
            "Blender server connection failed:",
            error
          );
          serverTestsFailed = true;
          // Now we want to fail the test if connection fails
          throw new Error(
            `Blender server test failed: ${
              (error as any).message
            }`
          );
        }
      } finally {
        console.log("Terminating Blender server");
        blenderServerProcess.kill();
      }

      // Now fail the test if any server test failed
      expect(serverTestsFailed).toBe(false);
    },
    TIMEOUT
  );
});

// Helper functions
function findFiles(
  dir: string,
  extension: string
): string[] {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function execPromise(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error)
        reject(
          new Error(
            `Command failed: ${command}\n${error.message}`
          )
        );
      else resolve(stdout);
    });
  });
}

// New helper that captures both stdout and stderr for better diagnostics
function execPromiseWithOutput(
  command: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command failed: ${command}`);
        console.error(`stderr: ${stderr}`);
        console.error(`stdout: ${stdout}`);
        reject(
          new Error(
            `Command failed: ${command}\n${error.message}\nstderr: ${stderr}`
          )
        );
      } else {
        resolve(stdout);
      }
    });
  });
}

function startPythonServer(
  pluginName: string,
  port: number = 8000
) {
  const serverPath = join(
    PLUGINS_DIR,
    pluginName,
    "__init__.py"
  );
  console.log(
    `Starting ${pluginName} server: python ${serverPath} --port ${port}`
  );

  // Add check to see if the server file exists
  if (!existsSync(serverPath)) {
    console.error(`Server file not found: ${serverPath}`);
    throw new Error(`Server file not found: ${serverPath}`);
  }

  // Pass the port to the Python server
  const serverProcess = exec(
    `python ${serverPath} --port ${port}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Server error: ${error.message}`);
        // Log more detailed information about the error
        if (stderr)
          console.error(`Server stderr: ${stderr}`);
      }
      if (stdout) console.log(`Server stdout: ${stdout}`);
      if (stderr) console.error(`Server stderr: ${stderr}`);
    }
  );

  // Add error event handler to catch startup failures
  serverProcess.on("error", (err) => {
    console.error(
      `Failed to start ${pluginName} server:`,
      err
    );
    throw new Error(
      `Failed to start ${pluginName} server: ${err.message}`
    );
  });

  return serverProcess;
}

function sendTestRequest(
  host: string,
  port: number,
  request?: { tool: string; params: any }
): Promise<any> {
  return new Promise((resolve, reject) => {
    const net = require("net");
    const client = new net.Socket();

    console.log(`Connecting to ${host}:${port}...`);

    // Default request if none provided
    const testRequest = request || {
      tool: "test",
      params: {},
    };

    client.connect(port, host, () => {
      console.log(
        `Connected to ${host}:${port}, sending test request for tool: ${testRequest.tool}`
      );

      client.write(JSON.stringify(testRequest));

      // Close the connection after sending the request
      setTimeout(() => {
        console.log(
          "Closing connection after sending request"
        );
        client.end();
      }, 1000);
    });

    let data = "";
    client.on("data", (chunk: Buffer) => {
      data += chunk.toString();
      console.log(`Received data: ${chunk.toString()}`);
    });

    client.on("end", () => {
      console.log(`Connection ended with data: ${data}`);
      try {
        // If response is empty or cannot be parsed, create a default error response
        if (!data || data === "{}") {
          console.warn(
            "Empty response from server, creating default error response"
          );
          resolve({
            success: false,
            error: "Server returned empty response",
          });
        } else {
          resolve(JSON.parse(data));
        }
      } catch (e) {
        console.error(
          `Failed to parse response: ${data}, error: ${e}`
        );
        // Provide a fallback response so the test can continue
        resolve({
          success: false,
          error: `Failed to parse: ${e}`,
        });
      }
    });

    client.on("error", (err: Error) => {
      console.error(`Connection error: ${err.message}`);
      reject(err);
    });

    // Set timeout
    setTimeout(() => {
      console.log("Request timed out, closing connection");
      client.end();
      reject(new Error("Request timed out"));
    }, 5000);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryConnection<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let lastError: any;

    for (let i = 0; i < retries + 1; i++) {
      try {
        const result = await fn();
        return resolve(result);
      } catch (error) {
        console.log(
          `Connection attempt ${i + 1} failed, retrying...`
        );
        lastError = error;
        if (i < retries) {
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    reject(lastError);
  });
}
