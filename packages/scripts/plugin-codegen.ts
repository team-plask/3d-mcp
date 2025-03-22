import { join } from "path";
import {
  existsSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import {
  extractSchemas,
  SCHEMA_DIR,
} from "./extract-schemas";
import {
  PLUGINS,
  TOOL_CATEGORIES,
} from "./config/pluginsConfig";
import { type IGenerator } from "./generators/IGenerator";
import { PythonGenerator } from "./generators/python-generator";
import { UnrealGenerator } from "./generators/unreal-generator";
import { ensureDirectoryExists } from "./utils/fs";

// ============================================================================
// Generators Map
// ============================================================================

/**
 * Map of language to generator instance
 */
const generatorMap: Record<string, IGenerator> = {
  python: new PythonGenerator(),
  cpp: new UnrealGenerator(),
};

// ============================================================================
// Helper Functions
// ============================================================================

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
        // Get the appropriate generator based on plugin language
        const generator = generatorMap[plugin.lang];
        if (!generator) {
          console.warn(
            `No generator available for ${plugin.lang}. Skipping ${plugin.name}`
          );
          continue;
        }

        // Generate implementation for this plugin and category
        generator.generateImplementation(
          plugin,
          category,
          tools
        );
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
    try {
      const generator = generatorMap[
        plugin.lang
      ] as PythonGenerator;
      generator.generateServer(plugin, TOOL_CATEGORIES);
    } catch (err) {
      console.error(
        `Error generating server for ${plugin.name}:`,
        err
      );
    }
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
