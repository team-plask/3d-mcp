import { join } from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
  rmSync,
} from "fs";
import { capitalizeFirstLetter } from "./utils/string";
import {
  extractSchemas,
  SCHEMA_DIR,
} from "./extract-schemas";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Plugin configuration type definition
 */
interface PluginConfig {
  name: string;
  dir: string;
  ext: string;
  lang: "python" | "cpp";
  utilsModule?: string;
  importStatements: string[];
  printFormat: string;
  errorFormat: string;
}

/**
 * Plugin configurations
 */
const PLUGINS: PluginConfig[] = [
  {
    name: "blender",
    dir: "plugins/blender",
    ext: "py",
    lang: "python",
    utilsModule: "mcp_utils",
    importStatements: ["import json"],
    printFormat:
      'print(f"Executing {tool_name} in Blender with params: {params}")',
    errorFormat: 'print(f"Error in {tool_name}: {str(e)}")',
  },
  {
    name: "unreal",
    dir: "plugins/unreal",
    ext: "cpp",
    lang: "cpp",
    importStatements: [],
    printFormat:
      'UE_LOG(LogMCPPlugin, Display, TEXT("Executing {0} in Unreal Engine"))',
    errorFormat:
      'UE_LOG(LogMCPPlugin, Error, TEXT("Error in {0}: %s"), *FString(Exception.what()))',
  },
  {
    name: "maya",
    dir: "plugins/maya",
    ext: "py",
    lang: "python",
    utilsModule: "mcp_maya_utils",
    importStatements: [
      "import maya.cmds as cmds",
      "import maya.mel as mel",
      "import json",
    ],
    printFormat:
      'print(f"Executing {tool_name} in Maya with params: {params}")',
    errorFormat: 'print(f"Error in {tool_name}: {str(e)}")',
  },
];

// Tool categories to scan
const TOOL_CATEGORIES = ["animation", "render"];

// ============================================================================
// Helper Functions
// ============================================================================

function ensureDirectoryExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Clean up temporary schema files and directories
 */
function cleanupSchemas() {
  if (existsSync(SCHEMA_DIR)) {
    console.log(
      `Cleaning up temporary schema files in ${SCHEMA_DIR}`
    );
    rmSync(SCHEMA_DIR, { recursive: true, force: true });
    console.log("Schema files removed");
  }
}

/**
 * Load tool definitions from the extracted schema files
 */
function loadToolDefinitions(category: string): {
  name: string;
  description: string;
  parameters: any;
  returns: any;
}[] {
  const toolDir = join(SCHEMA_DIR, category);
  if (!existsSync(toolDir)) {
    console.warn(
      `Schema directory not found for ${category}. Run extract-schemas.ts first.`
    );
    return [];
  }

  const files = readdirSync(toolDir);
  const tools = [];

  for (const file of files) {
    // Only process JSON files
    if (!file.endsWith(".json")) continue;

    try {
      // Load and parse the unified schema file
      const toolSchema = JSON.parse(
        readFileSync(join(toolDir, file), "utf8")
      );

      tools.push({
        name: toolSchema.name,
        description: toolSchema.description || "",
        parameters: toolSchema.parameters,
        returns: toolSchema.returns,
      });
    } catch (err) {
      console.warn(
        `Could not parse schema for ${file}: ${err}`
      );
    }
  }

  return tools;
}

// ============================================================================
// Type Generation Functions
// ============================================================================

/**
 * Get appropriate type name for target language
 */
function getTypeForLanguage(
  schemaProp: any,
  lang: string
): string {
  if (!schemaProp)
    return lang === "python"
      ? "Any"
      : "TSharedPtr<FJsonValue>";

  const type = schemaProp.type;
  const isEnum = schemaProp.enum !== undefined;

  if (lang === "python") {
    if (isEnum) {
      return "str"; // Python enums are still strings when passed via JSON
    }

    switch (type) {
      case "string":
        return "str";
      case "number":
      case "integer":
        return type === "integer" ? "int" : "float";
      case "boolean":
        return "bool";
      case "array":
        // Try to detect array element type
        if (schemaProp.items) {
          const itemType = getTypeForLanguage(
            schemaProp.items,
            lang
          );
          return `List[${itemType}]`;
        }
        return "List[Any]";
      case "object":
        return "Dict[str, Any]";
      default:
        return "Any";
    }
  } else if (lang === "cpp") {
    if (isEnum) {
      return "FString"; // C++ enums are passed as strings via JSON
    }

    switch (type) {
      case "string":
        return "FString";
      case "number":
        return "double";
      case "integer":
        return "int32";
      case "boolean":
        return "bool";
      case "array":
        return "TArray<TSharedPtr<FJsonValue>>";
      case "object":
        return "TSharedPtr<FJsonObject>";
      default:
        return "TSharedPtr<FJsonValue>";
    }
  }

  return "any";
}

// ============================================================================
// Python Code Generation
// ============================================================================

/**
 * Generate properly formatted Python docstring
 */
function generatePythonDocstring(tool: any): string {
  const { description, parameters } = tool;

  const paramDocs = [];
  if (parameters && parameters.properties) {
    for (const [name, prop] of Object.entries(
      parameters.properties
    )) {
      const typeName = getTypeForLanguage(prop, "python");
      const paramDesc =
        (prop as any).description ||
        `The ${name} parameter`;
      paramDocs.push(
        `           ${name} (${typeName}): ${paramDesc}`
      );
    }
  }

  const returnProps = tool.returns?.properties || {};
  const returnDocs =
    Object.keys(returnProps).length > 0
      ? Object.entries(returnProps)
          .map(([name, prop]) => {
            const typeName = getTypeForLanguage(
              prop,
              "python"
            );
            const desc =
              (prop as any).description ||
              `The ${name} return value`;
            return `           ${name} (${typeName}): ${desc}`;
          })
          .join("\n")
      : "           Dict[str, Any]: Operation response with success status";

  return `
    """
    ${description}
    
    Args:
${
  paramDocs.length > 0
    ? paramDocs.join("\n")
    : "    params (Dict[str, Any]): Tool parameters"
}
        
    Returns:
${returnDocs}
    """`;
}

/**
 * Generate parameter validation code for Python with proper indentation
 */
function generatePythonParamValidation(
  schema: any
): string {
  if (!schema || !schema.properties) return "";

  const requiredProps = new Set<string>(
    schema.required || []
  );
  const validationBlocks = [];

  // First extract all required parameters
  if (requiredProps.size > 0) {
    const requiredChecks = [];
    for (const name of requiredProps) {
      const prop = schema.properties[name];
      const desc =
        (prop as any).description ||
        `The ${name} parameter`;

      requiredChecks.push(`
        # Required parameter: ${desc}
        if "${name}" not in params:
            raise ValueError(f"Required parameter '${name}' is missing")
        ${name} = params["${name}"]`);

      // Add enum validation if applicable
      if (prop.enum) {
        const validValues = JSON.stringify(prop.enum);
        requiredChecks.push(`
        # Validate enum values for ${name}
        if ${name} is not None and ${name} not in ${validValues}:
            raise ValueError(f"Parameter '${name}' out of enum range")`);
      }
    }
    validationBlocks.push(requiredChecks.join("\n\n"));
  }

  // Then extract all optional parameters
  const optionalParams = Object.entries(schema.properties)
    .filter(([name]) => !requiredProps.has(name))
    .map(([name, prop]) => {
      const desc =
        (prop as any).description ||
        `The ${name} parameter`;

      let block = `
        # Optional parameter: ${desc}
        ${name} = params.get("${name}")`;

      // Add enum validation if applicable
      if ((prop as any).enum) {
        const validValues = JSON.stringify(
          (prop as any).enum
        );
        block += `\n        
        # Validate enum values for ${name}
        if ${name} is not None and ${name} not in ${validValues}:
            raise ValueError(f"Parameter '${name}' must be one of ${validValues}, got ${name}")`;
      }

      return block;
    });

  if (optionalParams.length > 0) {
    validationBlocks.push(optionalParams.join("\n\n"));
  }

  return validationBlocks.join("\n\n");
}

/**
 * Generate common implementation for Python-based plugins
 */
function generatePythonImplementation(
  category: string,
  tools: any[],
  plugin: PluginConfig
): string {
  const toolsImplementation = tools
    .map((tool) => {
      const paramJsonSchema = tool.parameters;
      const returnJsonSchema = tool.returns;
      const toolName = tool.name;
      const docstring = generatePythonDocstring(tool);
      const paramValidation =
        generatePythonParamValidation(paramJsonSchema);

      // Determine return structure
      const returnProps = returnJsonSchema
        ? Object.keys(returnJsonSchema.properties || {})
        : ["success"];

      const returnStructure = returnProps
        .map((prop) => {
          if (prop === "success") return '"success": True';
          return `"${prop}": None  `;
        })
        .join(", # TODO: Implement  \n                ");

      return `def ${toolName}(params: Dict[str, Any]) -> Dict[str, Any]:
${docstring}
    tool_name = "${toolName}"  # Define tool name for logging
    ${plugin.printFormat}
    
    try:
${paramValidation || "        # No parameters to validate"}
        
        # TODO: Implement actual ${plugin.name} API calls
        # This is a placeholder implementation
        
        return {
            ${returnStructure}
        }
        
    except Exception as e:
        ${plugin.errorFormat}
        return {"success": False, "error": str(e)}`;
    })
    .join("\n\n");

  return `# Generated ${plugin.name} implementation for ${category} atomic tools
# This file is generated - DO NOT EDIT DIRECTLY


from typing import Dict, Any, Optional, List, Union, Tuple

${toolsImplementation}
`;
}

/**
 * Generate Python server component for plugin
 */
function generatePythonServer(
  plugin: PluginConfig,
  categories: string[]
): string {
  const imports = categories
    .map(
      (category) =>
        `from ${category} import ${category}_atomic`
    )
    .join("\n");

  const toolRegistrations = categories
    .map(
      (category) =>
        `    # Register ${category} tools\n    ${readdirSync(
          join(
            process.cwd(),
            "packages",
            plugin.dir,
            category
          )
        )
          .filter(
            (file) =>
              file.endsWith(".py") &&
              file.includes("_atomic")
          )
          .map((file) => {
            const moduleName = file.replace(".py", "");
            return `    for name, func in inspect.getmembers(${moduleName}, inspect.isfunction):\n            self.register_tool(name, func)`;
          })
          .join("\n")}`
    )
    .join("\n\n");

  // Wrap application-specific imports in try-except blocks
  const safeImportStatements = plugin.importStatements
    .map((imp) => {
      // Detect if this is an application-specific import
      if (
        imp.includes("bpy") ||
        imp.includes("maya.cmds") ||
        imp.includes("maya.mel") ||
        imp.includes("unreal")
      ) {
        return `try:
    ${imp}
    HAS_APP_LIBS = True
except ImportError:
    print(f"Warning: Could not import ${
      imp.split(" ")[1]
    }. Running in mock mode.")
    HAS_APP_LIBS = False`;
      }
      return imp;
    })
    .join("\n");

  return `# Generated ${plugin.name} MCP server
# This file is generated - DO NOT EDIT DIRECTLY

${safeImportStatements}
import inspect
import socket
import json
import sys
import os
import argparse
from typing import Dict, Any, Callable

# Add mock implementation for testing when application libraries aren't available
if 'HAS_APP_LIBS' not in globals():
    HAS_APP_LIBS = True

# Import all atomic tool modules
${imports}

class MCPServer:
    """
    Server component that receives MCP tool requests and routes them to appropriate functions
    """
    
    def __init__(self, host="localhost", port=8000):
        self.host = host
        self.port = port
        self.tools: Dict[str, Callable] = {}
        self.server_socket = None
        self.is_mock_mode = not HAS_APP_LIBS
        
        if self.is_mock_mode:
            print("WARNING: Running in mock mode - some functionality will be limited")
            # Register a test function for test connections
            self.register_tool("test", lambda _: {"success": True, "message": "Test connection successful (mock mode)"})
        
    def register_tool(self, name: str, func: Callable):
        """Register a tool function with the server"""
        print(f"Registering tool: {name}")
        self.tools[name] = func
        
    def register_all_tools(self):
        """Register all available tool functions"""
${toolRegistrations}
        print(f"Registered {len(self.tools)} tools")
        
    def start(self):
        """Start the MCP server"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            print(f"MCP Server started on {self.host}:{self.port}")
            
            while True:
                client_socket, address = self.server_socket.accept()
                print(f"Connection from {address}")
                self.handle_client(client_socket)
                
        except KeyboardInterrupt:
            print("Server shutting down...")
        finally:
            if self.server_socket:
                self.server_socket.close()
                
    def handle_client(self, client_socket):
        """Handle client connection and route requests to appropriate tool"""
        try:
            data = client_socket.recv(4096)
            if not data:
                return
                
            request = json.loads(data.decode('utf-8'))
            tool_name = request.get("tool")
            params = request.get("params", {})
            
            if tool_name in self.tools:
                print(f"Executing tool: {tool_name}")
                result = self.tools[tool_name](params)
                response = json.dumps(result).encode('utf-8')
            else:
                response = json.dumps({
                    "success": False,
                    "error": f"Unknown tool: {tool_name}"
                }).encode('utf-8')
                
            client_socket.send(response)
            
        except Exception as e:
            error_response = json.dumps({
                "success": False,
                "error": str(e)
            }).encode('utf-8')
            client_socket.send(error_response)
        finally:
            client_socket.close()

def main():
    """Main entry point to start the MCP server"""
    parser = argparse.ArgumentParser(description='Start the MCP server')
    parser.add_argument('--port', type=int, default=8000, help='Port to listen on')
    parser.add_argument('--host', type=str, default='localhost', help='Host to bind to')
    args = parser.parse_args()
    
    server = MCPServer(host=args.host, port=args.port)
    print(f"Starting MCP server on {args.host}:{args.port}")
    server.register_all_tools()
    server.start()

if __name__ == "__main__":
    main()
`;
}

// ============================================================================
// C++ Code Generation
// ============================================================================

/**
 * Generate Unreal Engine C++ implementation
 */
function generateUnrealImplementation(
  category: string,
  tools: any[]
) {
  // Header file
  const headerContent = `// Generated Unreal Engine implementation for ${category} atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "${capitalizeFirstLetter(
    category
  )}Tools.generated.h"

/**
 * Unreal Engine implementation of the ${category} tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCP${capitalizeFirstLetter(
    category
  )}Tools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCP${capitalizeFirstLetter(category)}Tools();
    
    virtual void RegisterTools() override;

${tools
  .map((tool) => {
    const paramJsonSchema = tool.parameters;
    return `    /**
     * ${tool.description}
     * ${
       paramJsonSchema && paramJsonSchema.properties
         ? Object.entries(paramJsonSchema.properties)
             .map(([param, prop]: [string, any]) => {
               return `* @param ${param} - ${
                 prop.description ||
                 `The ${param} parameter`
               } (${getTypeForLanguage(prop, "cpp")})`;
             })
             .join("\n     ")
         : "* @param Params - Tool parameters from MCP"
     }
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> ${
      tool.name
    }(const TSharedPtr<FJsonObject>& Params);`;
  })
  .join("\n\n")}
};
`;

  // Implementation file
  const cppContent = `// Generated Unreal Engine implementation for ${category} atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#include "${capitalizeFirstLetter(category)}Tools.h"
#include "MCPProtocolHandler.h"
#include "JsonUtilities.h"

UMCP${capitalizeFirstLetter(
    category
  )}Tools::UMCP${capitalizeFirstLetter(category)}Tools()
{
    RegisterTools();
}

void UMCP${capitalizeFirstLetter(
    category
  )}Tools::RegisterTools()
{
${tools
  .map(
    (tool) =>
      `    FMCPProtocolHandler::Get().RegisterTool("${
        tool.name
      }", FMCPToolDelegate::CreateUObject(this, &UMCP${capitalizeFirstLetter(
        category
      )}Tools::${tool.name}));`
  )
  .join("\n")}
}

${tools
  .map((tool) => {
    const paramJsonSchema = tool.parameters;
    const returnJsonSchema = tool.returns;

    // Generate parameter extraction with validation
    const paramExtraction =
      paramJsonSchema && paramJsonSchema.properties
        ? Object.entries(paramJsonSchema.properties)
            .map(([param, prop]: [string, any]) => {
              const type = getTypeForLanguage(prop, "cpp");
              const required = (
                paramJsonSchema.required || []
              ).includes(param);

              // Check for required parameter first
              let extraction = required
                ? `        // Check required parameter ${param}
        if (!Params->HasField("${param}")) {
            UE_LOG(LogMCPPlugin, Error, TEXT("Required parameter ${param} is missing"));
            Response->SetBoolField("success", false);
            Response->SetStringField("error", "Required parameter ${param} is missing");
            return Response;
        }`
                : "";

              // Extract the parameter value
              if (type === "FString") {
                extraction += `
        // Extract ${param} (${type})
        FString ${param};
        if (Params->TryGetStringField("${param}", ${param})) {`;
              } else if (type === "bool") {
                extraction += `
        // Extract ${param} (${type})  
        bool ${param} = false;
        if (Params->TryGetBoolField("${param}", ${param})) {`;
              } else if (
                type === "double" ||
                type === "int32"
              ) {
                extraction += `
        // Extract ${param} (${type})
        ${
          type === "double" ? "double" : "int32"
        } ${param} = 0;
        if (Params->TryGetNumberField("${param}", ${param})) {`;
              } else {
                extraction += `
        // Extract complex parameter ${param} 
        const TSharedPtr<FJsonValue>* ${param}Value = nullptr;
        if (Params->TryGetField("${param}", ${param}Value)) {`;
              }

              // Add enum validation if applicable
              if (prop.enum && type === "FString") {
                extraction += `
            // Validate enum value for ${param}
            static const TArray<FString> Valid${param}Values = {${prop.enum
                  .map((v: string) => `TEXT("${v}")`)
                  .join(", ")}};
            if (!Valid${param}Values.Contains(${param})) {
                UE_LOG(LogMCPPlugin, Error, TEXT("Invalid ${param} value: %s"), *${param});
                Response->SetBoolField("success", false);
                Response->SetStringField("error", "Invalid ${param} value");
                return Response;
            }`;
              }

              extraction += `
        }`;

              return extraction;
            })
            .join("\n")
        : "        // No parameters to extract";

    // Generate return value setting
    const returnSettings =
      returnJsonSchema && returnJsonSchema.properties
        ? Object.entries(returnJsonSchema.properties)
            .filter(([prop]) => prop !== "success") // success is handled separately
            .map(([prop, schema]: [string, any]) => {
              const type = getTypeForLanguage(
                schema,
                "cpp"
              );
              if (type === "FString") {
                return `Response->SetStringField("${prop}", TEXT("TODO")); // TODO: Set actual ${prop} value`;
              } else if (type === "bool") {
                return `Response->SetBoolField("${prop}", true); // TODO: Set actual ${prop} value`;
              } else if (
                type === "double" ||
                type === "int32"
              ) {
                return `Response->SetNumberField("${prop}", 0); // TODO: Set actual ${prop} value`;
              } else {
                return `// TODO: Set complex ${prop} value`;
              }
            })
            .join("\n        ")
        : "";

    return `TSharedPtr<FJsonObject> UMCP${capitalizeFirstLetter(
      category
    )}Tools::${
      tool.name
    }(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogMCPPlugin, Display, TEXT("Executing ${
      tool.name
    } in Unreal Engine"));
    
    TSharedPtr<FJsonObject> Response = MakeShared<FJsonObject>();
    
    try
    {${paramExtraction}
        
        // TODO: Implement actual Unreal Engine API calls for ${
          tool.name
        }
        // This is a placeholder implementation
        
        Response->SetBoolField("success", true);
        ${returnSettings}
    }
    catch (const std::exception& Exception)
    {
        UE_LOG(LogMCPPlugin, Error, TEXT("Error in ${
          tool.name
        }: %s"), *FString(Exception.what()));
        Response->SetBoolField("success", false);
        Response->SetStringField("error", Exception.what());
    }
    
    return Response;
}`;
  })
  .join("\n\n")}
`;

  return { headerContent, cppContent };
}

// ============================================================================
// Main Function and Execution
// ============================================================================

export async function generatePluginCode(
  temporarySchemas: boolean = true
) {
  console.log("Starting plugin code generation...");

  // Generate schemas if not already present or always if temporary
  if (temporarySchemas || !existsSync(SCHEMA_DIR)) {
    console.log("Extracting schemas...");
    // Use silent mode to avoid duplicate logs
    await extractSchemas(true);
    console.log("Schemas extracted successfully");
  }

  // Add plugin directories to .gitignore if they don't exist
  try {
    const gitignorePath = join(process.cwd(), ".gitignore");
    if (existsSync(gitignorePath)) {
      let gitignore = readFileSync(gitignorePath, "utf8");

      if (!gitignore.includes("packages/plugins/")) {
        gitignore +=
          "\n# Generated plugin code\npackages/plugins/\n";
        writeFileSync(gitignorePath, gitignore);
        console.log(
          "Added packages/plugins/ to .gitignore"
        );
      }
    }
  } catch (err) {
    console.warn("Could not update .gitignore:", err);
  }

  // Check if schema directory exists
  if (!existsSync(SCHEMA_DIR)) {
    console.error(
      "Schema directory not found. Please run extract-schemas.ts first."
    );
    console.log(
      "Run: bun run packages/scripts/extract-schemas.ts"
    );
    return;
  }

  // Process each tool category
  for (const category of TOOL_CATEGORIES) {
    // Load tools from the extracted schema files
    const tools = loadToolDefinitions(category);

    if (tools.length === 0) {
      console.log(`No tool schemas found for ${category}`);
      continue;
    }

    // Generate implementations for each plugin
    for (const plugin of PLUGINS) {
      const pluginCategoryDir = join(
        process.cwd(),
        "packages",
        plugin.dir,
        category
      );
      ensureDirectoryExists(pluginCategoryDir);

      try {
        if (plugin.name === "unreal") {
          // Unreal Engine requires header and cpp files
          const { headerContent, cppContent } =
            generateUnrealImplementation(category, tools);

          const headerPath = join(
            pluginCategoryDir,
            `${capitalizeFirstLetter(category)}Tools.h`
          );
          const cppPath = join(
            pluginCategoryDir,
            `${capitalizeFirstLetter(category)}Tools.cpp`
          );

          writeFileSync(headerPath, headerContent);
          writeFileSync(cppPath, cppContent);
        } else if (plugin.lang === "python") {
          // Python-based plugins (Blender, Maya)
          const implementation =
            generatePythonImplementation(
              category,
              tools,
              plugin
            );
          const filePath = join(
            pluginCategoryDir,
            `${category}_atomic.${plugin.ext}`
          );
          writeFileSync(filePath, implementation);
        }
      } catch (err) {
        console.error(
          `Error generating ${plugin.name} implementation for ${category}:`,
          err
        );
      }
    }
  }

  // Generate server components for each plugin
  for (const plugin of PLUGINS) {
    if (plugin.lang === "python") {
      const serverDir = join(
        process.cwd(),
        "packages",
        plugin.dir
      );
      const serverContent = generatePythonServer(
        plugin,
        TOOL_CATEGORIES
      );
      const serverPath = join(
        serverDir,
        `mcp_server.${plugin.ext}`
      );

      writeFileSync(serverPath, serverContent);
    }
    // TODO: Add server component generation for Unreal if needed
  }

  // Clean up temporary schema files if requested
  if (temporarySchemas) {
    cleanupSchemas();
  }
}

// Execute the main function directly
generatePluginCode(true).catch((err) => {
  console.error("Code generation failed:", err);
  process.exit(1);
});
