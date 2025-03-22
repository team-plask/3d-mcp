import { type IGenerator } from "./IGenerator";
import { type PluginConfig } from "../config/pluginsConfig";
import { join } from "path";
import {
  existsSync,
  readFileSync,
  writeFileSync,
} from "fs";
import {
  generateUnrealImplementation,
  generateUnrealServer,
} from "../templates/unreal-templates";
import { capitalizeFirstLetter } from "../utils/string";
import { ensureDirectoryExists } from "../utils/fs";

export class UnrealGenerator implements IGenerator {
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

    const headerPath = join(
      pluginCategoryDir,
      `${capitalizeFirstLetter(category)}Tools.h`
    );
    const cppPath = join(
      pluginCategoryDir,
      `${capitalizeFirstLetter(category)}Tools.cpp`
    );

    let existingHeaderFunctions = new Set<string>();
    let existingCppFunctions = new Set<string>();

    if (existsSync(headerPath)) {
      const oldHeader = readFileSync(headerPath, "utf8");
      existingHeaderFunctions =
        plugin.parseFunction(oldHeader);
    }

    if (existsSync(cppPath)) {
      const oldCpp = readFileSync(cppPath, "utf8");
      existingCppFunctions = plugin.parseFunction(oldCpp);
    }

    // Any function that shows up in either file is considered "already generated"
    const newTools = tools.filter(
      (tool) =>
        !existingHeaderFunctions.has(tool.name) &&
        !existingCppFunctions.has(tool.name)
    );

    if (newTools.length === 0) {
      console.log(
        `No new Unreal tools to generate for ${category}`
      );
      return;
    }

    // Generate only the new ones
    const { headerContent: newHeader, cppContent: newCpp } =
      generateUnrealImplementation(category, newTools);

    // Merge with old content
    let finalHeader = newHeader;
    let finalCpp = newCpp;

    if (existsSync(headerPath)) {
      const oldHeader = readFileSync(headerPath, "utf8");
      finalHeader =
        oldHeader +
        "\n// === NEWLY GENERATED ===\n" +
        newHeader;
    }

    if (existsSync(cppPath)) {
      const oldCpp = readFileSync(cppPath, "utf8");
      finalCpp =
        oldCpp + "\n// === NEWLY GENERATED ===\n" + newCpp;
    }

    writeFileSync(headerPath, finalHeader);
    writeFileSync(cppPath, finalCpp);
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

    const serverHeaderPath = join(
      serverDir,
      `${capitalizeFirstLetter(plugin.name)}Server.h`
    );
    const serverCppPath = join(
      serverDir,
      `${capitalizeFirstLetter(plugin.name)}Server.cpp`
    );

    const { headerContent, cppContent } =
      generateUnrealServer(plugin, categories);

    writeFileSync(serverHeaderPath, headerContent);
    writeFileSync(serverCppPath, cppContent);
  }
}
