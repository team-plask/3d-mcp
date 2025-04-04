import {
  parseExistingPythonFunctions,
  parseExistingUnrealFunctions,
} from "../utils/diff";

/**
 * Plugin configuration type definition
 */
export interface PluginConfig {
  name: string;
  dir: string;
  ext: string;
  lang: "python" | "cpp";
  utilsModule?: string;
  importStatements: string[];
  printFormat: string;
  errorFormat: string;
  parseFunction: (fileContent: string) => Set<string>;
}

/**
 * Plugin configurations
 */
export const PLUGINS: PluginConfig[] = [
  {
    name: "blender",
    dir: "plugins/blender",
    ext: "py",
    lang: "python",
    utilsModule: "mcp_utils",
    importStatements: ["import bpy"],
    printFormat:
      'print(f"Executing {tool_name} in Blender with params: {params}")',
    errorFormat: 'print(f"Error in {tool_name}: {str(e)}")',
    parseFunction: parseExistingPythonFunctions,
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
    parseFunction: parseExistingUnrealFunctions,
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
    parseFunction: parseExistingPythonFunctions,
  },
];

// Tool categories to scan
export const TOOL_CATEGORIES = ["animation", "render"];
