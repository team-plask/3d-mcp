import { type IGenerator } from "./IGenerator";
import { type PluginConfig } from "../config/pluginsConfig";
import { join } from "path";
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "fs";
import {
  generatePythonImplementation,
  generatePythonServer,
} from "../templates/python-templates";
import { ensureDirectoryExists } from "../utils/fs";

export class PythonGenerator implements IGenerator {
  generateImplementation(
    plugin: PluginConfig,
    category: string,
    tools: any[]
  ): void {
    const pluginCategoryDir = join(
      process.cwd(),
      "packages",
      plugin.dir,
      category
    );
    ensureDirectoryExists(pluginCategoryDir);

    const filePath = join(
      pluginCategoryDir,
      `${category}_atomic.${plugin.ext}`
    );

    let existingFunctions = new Set<string>();
    let oldContent = "";

    if (existsSync(filePath)) {
      oldContent = readFileSync(filePath, "utf8");
      // Parse out any existing function names
      existingFunctions = plugin.parseFunction(oldContent);

      // Remove import statements from the old content
      const importRegex = /import .+|from .+ import .+/g;
      oldContent = oldContent
        .replace(importRegex, "")
        .replace(
          /# Generated .+|# This file is generated - DO NOT EDIT DIRECTLY/g,
          ""
        );
    }

    // Filter out any tools that already exist
    const newTools = tools.filter(
      (tool) => !existingFunctions.has(tool.name)
    );

    if (newTools.length === 0) {
      console.log(
        `No new Python tools to generate for ${category} in ${plugin.name}`
      );
      return;
    }

    // Generate only for the new tools
    const newImplementation = generatePythonImplementation(
      category,
      newTools,
      plugin
    );

    // Merge with existing content
    const separator = "\n\n # === NEWLY GENERATED ===";
    const finalContent =
      newImplementation +
      separator +
      oldContent +
      (oldContent.trim() ? "\n\n" : "");

    writeFileSync(filePath, finalContent);
  }

  generateServer(
    plugin: PluginConfig,
    categories: string[]
  ): void {
    const serverDir = join(
      process.cwd(),
      "packages",
      plugin.dir
    );
    ensureDirectoryExists(serverDir);

    const serverContent = generatePythonServer(
      plugin,
      categories
    );
    const serverPath = join(
      serverDir,
      `mcp_server.${plugin.ext}`
    );

    writeFileSync(serverPath, serverContent);
  }
}
