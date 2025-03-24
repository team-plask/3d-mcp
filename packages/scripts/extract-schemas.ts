import { join } from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readdirSync,
} from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";

// Import path to the tools directory
const TOOLS_DIR = join(
  process.cwd(),
  "packages",
  "src",
  "tool"
);

// Directory to save extracted schemas
export const SCHEMA_DIR = join(
  process.cwd(),
  "packages",
  "scripts",
  "schemas"
);

// Ensure schema directory exists
function ensureDirectoryExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Extract schema information for a tool category
 */
async function extractCategorySchemas(
  category: string,
  tools: Record<string, any>,
  silent: boolean = false
) {
  if (!silent)
    console.log(`Extracting schemas for ${category}...`);

  // Create category directory
  const categoryDir = join(SCHEMA_DIR, category);
  ensureDirectoryExists(categoryDir);

  // Process each tool in the category
  for (const [toolName, tool] of Object.entries(tools)) {
    if (!silent) console.log(`Processing ${toolName}...`);

    try {
      // Create a unified schema object for the tool
      const toolSchema: any = {
        name: toolName,
        description: tool.description || "",
        parameters: null,
        returns: null,
      };

      // Extract and convert parameters schema
      if (tool.parameters) {
        const parametersJsonSchema = zodToJsonSchema(
          tool.parameters,
          {
            $refStrategy: "none",
            errorMessages: true,
            target: "openApi3", // Include descriptions in the schema
          }
        );
        toolSchema.parameters = parametersJsonSchema;
      }

      // Extract and convert returns schema
      if (tool.returns) {
        const returnsJsonSchema = zodToJsonSchema(
          tool.returns,
          {
            $refStrategy: "none",
            errorMessages: true,
            target: "openApi3", // Include descriptions in the schema
          }
        );
        toolSchema.returns = returnsJsonSchema;
      }

      // Write the unified schema to a single JSON file
      writeFileSync(
        join(categoryDir, `${toolName}.json`),
        JSON.stringify(toolSchema, null, 2)
      );

      if (!silent)
        console.log(
          `Successfully extracted schemas for ${toolName}`
        );
    } catch (err) {
      console.error(
        `Error extracting schemas for ${toolName}:`,
        err
      );
    }
  }
}

/**
 * Discover all domain directories in the tools directory
 * and dynamically import their atomic tools
 */
export async function discoverDomains(
  silent: boolean = false
): Promise<string[]> {
  if (!existsSync(TOOLS_DIR)) {
    console.error(
      `Tools directory not found: ${TOOLS_DIR}`
    );
    return [];
  }

  const domains = readdirSync(TOOLS_DIR, {
    withFileTypes: true,
  })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (!silent) {
    console.log(
      `Discovered domains: ${domains.join(", ")}`
    );
  }

  return domains;
}

/**
 * Dynamically import atomic tools for a specific domain
 */
async function importDomainTools(
  domain: string,
  silent: boolean = false
): Promise<Record<string, any>> {
  try {
    const atomicPath = `../src/tool/${domain}/atomic`;
    const module = await import(atomicPath);

    // Try to get the domain's atomic tools with execute property
    // Different domains might use different naming conventions
    const toolsExport =
      module[`${domain}AtomicToolsWithExecute`] ||
      module[
        `${domain.replace(/s$/, "")}AtomicToolsWithExecute`
      ];

    if (
      toolsExport &&
      Object.keys(toolsExport).length > 0
    ) {
      if (!silent) {
        console.log(
          `Successfully imported atomic tools for ${domain}`
        );
      }
      return toolsExport;
    } else {
      if (!silent) {
        console.log(`No atomic tools found for ${domain}`);
      }
      return {};
    }
  } catch (e) {
    if (!silent) {
      console.log(
        `Could not import atomic tools for ${domain}: ${e}`
      );
    }
    return {};
  }
}

export async function extractSchemas(
  silent: boolean = false
) {
  // Ensure the schema directory exists
  ensureDirectoryExists(SCHEMA_DIR);

  // Discover all domains in the tools directory
  const domains = await discoverDomains(silent);
  const processedDomains: string[] = [];

  // Process each domain
  for (const domain of domains) {
    // Skip the 'core' domain as it typically contains base definitions
    // and not actual tools to be extracted
    if (domain === "core") continue;

    // Import tools for this domain
    const domainTools = await importDomainTools(
      domain,
      silent
    );

    // Extract schemas if tools were found
    if (Object.keys(domainTools).length > 0) {
      await extractCategorySchemas(
        domain,
        domainTools,
        silent
      );
      processedDomains.push(domain);
    }
  }

  if (!silent && processedDomains.length > 0) {
    console.log(
      `Schema extraction completed successfully for domains: ${processedDomains.join(
        ", "
      )}`
    );
  } else if (!silent) {
    console.log(
      "No domains processed. Check that tool directories contain atomic.ts files."
    );
  }

  return SCHEMA_DIR;
}

// Execute directly when this script is run
extractSchemas().catch(console.error);
