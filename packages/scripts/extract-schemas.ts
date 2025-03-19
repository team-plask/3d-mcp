import { join } from "path";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";

// Import the animation atomic tools
import { animationAtomicToolsWithExecute } from "../src/tool/animation/atomic";

// Try to import any other tool categories defined in the project
let renderTools: Record<string, any> = {};
try {
  const renderToolsModule = await import(
    "../src/tool/render/atomic"
  );
  renderTools =
    renderToolsModule.renderAtomicToolsWithExecute || {};
} catch (e) {
  console.log("No render tools found, skipping...");
}

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

export async function extractSchemas(
  silent: boolean = false
) {
  // Ensure the schema directory exists
  ensureDirectoryExists(SCHEMA_DIR);

  // Extract schemas for animation tools
  await extractCategorySchemas(
    "animation",
    animationAtomicToolsWithExecute,
    silent
  );

  // Extract schemas for render tools (if available)
  if (Object.keys(renderTools).length > 0) {
    await extractCategorySchemas(
      "render",
      renderTools,
      silent
    );
  }

  if (!silent)
    console.log(
      "Schema extraction completed successfully!"
    );
  return SCHEMA_DIR;
}

// Execute directly when this script is run
extractSchemas().catch(console.error);
