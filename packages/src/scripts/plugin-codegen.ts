import { join, dirname } from "path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
} from "fs";
import ts from "typescript";

// Plugin types and their respective directories and file extensions
const PLUGINS = [
  {
    name: "blender",
    dir: "plugins/blender",
    ext: "py",
    lang: "python",
  },
  {
    name: "unreal",
    dir: "plugins/unreal",
    ext: "cpp",
    lang: "cpp",
  },
  {
    name: "maya",
    dir: "plugins/maya",
    ext: "py",
    lang: "python",
  },
];

// Base directory for tool definitions
const TOOLS_DIR = join(
  process.cwd(),
  "packages",
  "src",
  "tool"
);

// Tool categories to scan
const TOOL_CATEGORIES = ["animation", "render"];

function ensureDirectoryExists(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function extractToolDefinitions(
  sourceCode: string
): { name: string; description: string; params: any }[] {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  const tools: {
    name: string;
    description: string;
    params: any;
  }[] = [];

  function visit(node: ts.Node) {
    if (
      ts.isPropertyAssignment(node) &&
      ts.isObjectLiteralExpression(node.parent) &&
      node.name &&
      ts.isIdentifier(node.name)
    ) {
      const toolName = node.name.text;
      let description = "";
      let params: any = {};

      // Extract description and parameters from the tool definition
      if (ts.isObjectLiteralExpression(node.initializer)) {
        node.initializer.properties.forEach((prop) => {
          if (
            ts.isPropertyAssignment(prop) &&
            ts.isIdentifier(prop.name)
          ) {
            if (
              prop.name.text === "description" &&
              ts.isStringLiteral(prop.initializer)
            ) {
              description = prop.initializer.text;
            }

            if (prop.name.text === "parameters") {
              // For parameters, we're just capturing their existence - full parsing would be complex
              params = { exists: true };
            }
          }
        });

        if (toolName && description) {
          tools.push({
            name: toolName,
            description,
            params,
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return tools;
}

// Generate Blender Python implementation
function generateBlenderImplementation(
  category: string,
  tools: {
    name: string;
    description: string;
    params: any;
  }[]
): string {
  return `# Generated Blender implementation for ${category} atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
import json
from mathutils import Vector, Quaternion, Matrix
from . import mcp_utils

class MCP${capitalizeFirstLetter(category)}Tools:
    """
    Blender implementation of the ${category} tools for MCP protocol
    """

    def __init__(self):
        self.register_tools()
    
    def register_tools(self):
        """Register all tools with the MCP handler"""
        ${tools
          .map(
            (tool) =>
              `mcp_utils.register_tool("${tool.name}", self.${tool.name})`
          )
          .join("\n        ")}
    
${tools
  .map(
    (tool) => `    def ${tool.name}(self, params):
        """
        ${tool.description}
        
        Args:
            params: Tool parameters from MCP
        
        Returns:
            Response dictionary with operation results
        """
        print(f"Executing ${tool.name} in Blender with params: {params}")
        
        try:
            # TODO: Implement actual Blender API calls
            # This is a placeholder implementation
            
            # For most operations, we'll need to:
            # 1. Get the current context and active objects
            # context = bpy.context
            # 2. Parse parameters into Blender-specific formats
            # 3. Execute the appropriate Blender operations
            # 4. Return a success response with any required data
            
            return {"success": True}
            
        except Exception as e:
            print(f"Error in ${tool.name}: {str(e)}")
            return {"success": False, "error": str(e)}
`
  )
  .join("\n\n")}

# Create an instance for direct use
${category}_tools = MCP${capitalizeFirstLetter(
    category
  )}Tools()
`;
}

// Generate Unreal Engine C++ implementation
function generateUnrealImplementation(
  category: string,
  tools: {
    name: string;
    description: string;
    params: any;
  }[]
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
  .map(
    (tool) => `    /**
     * ${tool.description}
     * @param Params - Tool parameters from MCP
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> ${tool.name}(const TSharedPtr<FJsonObject>& Params);`
  )
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
  .map(
    (
      tool
    ) => `TSharedPtr<FJsonObject> UMCP${capitalizeFirstLetter(
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
    {
        // TODO: Implement actual Unreal Engine API calls
        // This is a placeholder implementation
        
        // For most operations, we'll need to:
        // 1. Parse the JSON parameters into Unreal-specific formats
        // 2. Execute the appropriate Unreal operations
        // 3. Return a success response with any required data
        
        Response->SetBoolField("success", true);
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
}`
  )
  .join("\n\n")}
`;

  return { headerContent, cppContent };
}

// Generate Maya Python/MEL implementation
function generateMayaImplementation(
  category: string,
  tools: {
    name: string;
    description: string;
    params: any;
  }[]
): string {
  return `# Generated Maya implementation for ${category} atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import maya.cmds as cmds
import maya.mel as mel
import json
from . import mcp_maya_utils

class MCP${capitalizeFirstLetter(category)}Tools:
    """
    Maya implementation of the ${category} tools for MCP protocol
    """

    def __init__(self):
        self.register_tools()
    
    def register_tools(self):
        """Register all tools with the MCP handler"""
        ${tools
          .map(
            (tool) =>
              `mcp_maya_utils.register_tool("${tool.name}", self.${tool.name})`
          )
          .join("\n        ")}
    
${tools
  .map(
    (tool) => `    def ${tool.name}(self, params):
        """
        ${tool.description}
        
        Args:
            params: Tool parameters from MCP
        
        Returns:
            Response dictionary with operation results
        """
        print("Executing ${tool.name} in Maya with params: {}".format(params))
        
        try:
            # TODO: Implement actual Maya API calls
            # This is a placeholder implementation
            
            # For most operations, we'll need to:
            # 1. Parse parameters into Maya-specific formats
            # 2. Execute the appropriate Maya operations using cmds or mel
            # 3. Return a success response with any required data
            
            return {"success": True}
            
        except Exception as e:
            print("Error in ${tool.name}: {}".format(str(e)))
            return {"success": False, "error": str(e)}
`
  )
  .join("\n\n")}

# Create an instance for direct use
${category}_tools = MCP${capitalizeFirstLetter(
    category
  )}Tools()
`;
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function main() {
  // Add plugin directories to .gitignore if they don't exist
  let gitignore = readFileSync(
    join(process.cwd(), ".gitignore"),
    "utf8"
  );

  if (!gitignore.includes("plugins/")) {
    gitignore += "\n# Generated plugin code\nplugins/\n";
    writeFileSync(
      join(process.cwd(), ".gitignore"),
      gitignore
    );
    console.log("Added plugins/ to .gitignore");
  }

  for (const category of TOOL_CATEGORIES) {
    const toolModules = ["atomic"]; // Focus on atomic tools

    for (const toolModule of toolModules) {
      try {
        const toolPath = join(
          TOOLS_DIR,
          category,
          `${toolModule}.ts`
        );
        const toolContent = readFileSync(toolPath, "utf8");

        // Parse tools from the TypeScript source
        const tools = extractToolDefinitions(toolContent);

        if (tools.length === 0) {
          console.log(`No tools found in ${toolPath}`);
          continue;
        }

        console.log(
          `Found ${tools.length} tools in ${toolPath}`
        );

        // Generate implementations for each plugin
        for (const plugin of PLUGINS) {
          const pluginCategoryDir = join(
            process.cwd(),
            plugin.dir,
            category
          );
          ensureDirectoryExists(pluginCategoryDir);

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

            console.log(
              `Generated Unreal Engine files: ${headerPath} and ${cppPath}`
            );
          } else {
            // Blender and Maya use Python
            let implementation;

            if (plugin.name === "blender") {
              implementation =
                generateBlenderImplementation(
                  category,
                  tools
                );
            } else if (plugin.name === "maya") {
              implementation = generateMayaImplementation(
                category,
                tools
              );
            } else {
              continue;
            }

            const filePath = join(
              pluginCategoryDir,
              `${category}_${toolModule}.${plugin.ext}`
            );
            writeFileSync(filePath, implementation);
            console.log(
              `Generated ${plugin.name} file: ${filePath}`
            );
          }

          // Create utility files if they don't exist
          if (plugin.name === "blender") {
            const utilsPath = join(
              process.cwd(),
              plugin.dir,
              "mcp_utils.py"
            );
            if (!existsSync(utilsPath)) {
              const utilsContent = `# MCP utility functions for Blender
import bpy
import json

_registered_tools = {}

def register_tool(name, callback):
    """Register a tool with the MCP handler"""
    _registered_tools[name] = callback

def handle_mcp_request(request_json):
    """Handle an incoming MCP request"""
    try:
        request = json.loads(request_json)
        tool_name = request.get('toolName')
        parameters = request.get('parameters', {})
        
        if tool_name in _registered_tools:
            result = _registered_tools[tool_name](parameters)
            return json.dumps(result)
        else:
            return json.dumps({
                "success": False,
                "error": f"Unknown tool: {tool_name}"
            })
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": str(e)
        })
`;
              writeFileSync(utilsPath, utilsContent);
              console.log(
                `Generated utility file: ${utilsPath}`
              );
            }
          } else if (plugin.name === "maya") {
            const utilsPath = join(
              process.cwd(),
              plugin.dir,
              "mcp_maya_utils.py"
            );
            if (!existsSync(utilsPath)) {
              const utilsContent = `# MCP utility functions for Maya
import maya.cmds as cmds
import json

_registered_tools = {}

def register_tool(name, callback):
    """Register a tool with the MCP handler"""
    _registered_tools[name] = callback

def handle_mcp_request(request_json):
    """Handle an incoming MCP request"""
    try:
        request = json.loads(request_json)
        tool_name = request.get('toolName')
        parameters = request.get('parameters', {})
        
        if tool_name in _registered_tools:
            result = _registered_tools[tool_name](parameters)
            return json.dumps(result)
        else:
            return json.dumps({
                "success": False,
                "error": f"Unknown tool: {tool_name}"
            })
    except Exception as e:
        return json.dumps({
            "success": False,
            "error": str(e)
        })
`;
              writeFileSync(utilsPath, utilsContent);
              console.log(
                `Generated utility file: ${utilsPath}`
              );
            }
          } else if (plugin.name === "unreal") {
            // Create basic Unreal base classes if they don't exist
            const baseHeaderPath = join(
              process.cwd(),
              plugin.dir,
              "MCPToolsBase.h"
            );
            if (!existsSync(baseHeaderPath)) {
              const baseHeaderContent = `// MCP Base Tools for Unreal Engine
#pragma once

#include "CoreMinimal.h"
#include "UObject/NoExportTypes.h"
#include "Dom/JsonObject.h"
#include "MCPToolsBase.generated.h"

DECLARE_LOG_CATEGORY_EXTERN(LogMCPPlugin, Log, All);

/**
 * Base class for all MCP tool implementations
 */
UCLASS(Abstract)
class MCPPLUGIN_API UMCPToolsBase : public UObject
{
    GENERATED_BODY()

public:
    UMCPToolsBase() {}
    
    /**
     * Register all tools with the MCP handler
     */
    virtual void RegisterTools() {}
};
`;
              writeFileSync(
                baseHeaderPath,
                baseHeaderContent
              );
              console.log(
                `Generated Unreal base header: ${baseHeaderPath}`
              );
            }

            const handlerHeaderPath = join(
              process.cwd(),
              plugin.dir,
              "MCPProtocolHandler.h"
            );
            if (!existsSync(handlerHeaderPath)) {
              const handlerHeaderContent = `// MCP Protocol Handler for Unreal Engine
#pragma once

#include "CoreMinimal.h"
#include "Dom/JsonObject.h"

DECLARE_DELEGATE_RetVal_OneParam(TSharedPtr<FJsonObject>, FMCPToolDelegate, const TSharedPtr<FJsonObject>&);

/**
 * Handles MCP protocol communication
 */
class MCPPLUGIN_API FMCPProtocolHandler
{
public:
    static FMCPProtocolHandler& Get();
    
    void RegisterTool(const FString& Name, const FMCPToolDelegate& Callback);
    TSharedPtr<FJsonObject> HandleRequest(const FString& RequestJson);

private:
    TMap<FString, FMCPToolDelegate> RegisteredTools;
};
`;
              writeFileSync(
                handlerHeaderPath,
                handlerHeaderContent
              );
              console.log(
                `Generated Unreal protocol handler header: ${handlerHeaderPath}`
              );
            }

            const handlerCppPath = join(
              process.cwd(),
              plugin.dir,
              "MCPProtocolHandler.cpp"
            );
            if (!existsSync(handlerCppPath)) {
              const handlerCppContent = `// MCP Protocol Handler Implementation
#include "MCPProtocolHandler.h"
#include "JsonObjectConverter.h"

DEFINE_LOG_CATEGORY(LogMCPPlugin);

FMCPProtocolHandler& FMCPProtocolHandler::Get()
{
    static FMCPProtocolHandler Instance;
    return Instance;
}

void FMCPProtocolHandler::RegisterTool(const FString& Name, const FMCPToolDelegate& Callback)
{
    RegisteredTools.Add(Name, Callback);
    UE_LOG(LogMCPPlugin, Log, TEXT("Registered MCP tool: %s"), *Name);
}

TSharedPtr<FJsonObject> FMCPProtocolHandler::HandleRequest(const FString& RequestJson)
{
    TSharedPtr<FJsonObject> RequestObject = MakeShared<FJsonObject>();
    TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(RequestJson);
    
    if (!FJsonSerializer::Deserialize(Reader, RequestObject))
    {
        TSharedPtr<FJsonObject> ErrorResponse = MakeShared<FJsonObject>();
        ErrorResponse->SetBoolField("success", false);
        ErrorResponse->SetStringField("error", "Failed to parse request JSON");
        return ErrorResponse;
    }
    
    FString ToolName;
    if (!RequestObject->TryGetStringField("toolName", ToolName))
    {
        TSharedPtr<FJsonObject> ErrorResponse = MakeShared<FJsonObject>();
        ErrorResponse->SetBoolField("success", false);
        ErrorResponse->SetStringField("error", "Missing toolName in request");
        return ErrorResponse;
    }
    
    const FMCPToolDelegate* Callback = RegisteredTools.Find(ToolName);
    if (!Callback)
    {
        TSharedPtr<FJsonObject> ErrorResponse = MakeShared<FJsonObject>();
        ErrorResponse->SetBoolField("success", false);
        ErrorResponse->SetStringField("error", FString::Printf(TEXT("Unknown tool: %s"), *ToolName));
        return ErrorResponse;
    }
    
    TSharedPtr<FJsonObject> Parameters;
    RequestObject->TryGetObjectField("parameters", Parameters);
    if (!Parameters.IsValid())
    {
        Parameters = MakeShared<FJsonObject>();
    }
    
    return Callback->Execute(Parameters);
}
`;
              writeFileSync(
                handlerCppPath,
                handlerCppContent
              );
              console.log(
                `Generated Unreal protocol handler implementation: ${handlerCppPath}`
              );
            }
          }
        }
      } catch (err) {
        console.error(
          `Error processing ${category}/${toolModule}:`,
          err
        );
      }
    }
  }

  // Update package.json to include the codegen script
  const packageJsonPath = join(
    process.cwd(),
    "package.json"
  );
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, "utf8")
  );

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  if (!packageJson.scripts.codegen) {
    packageJson.scripts.codegen =
      "bun run scripts/plugin-codegen.ts";
    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
    console.log("Added codegen script to package.json");
  }

  if (!packageJson.devDependencies?.typescript) {
    if (!packageJson.devDependencies)
      packageJson.devDependencies = {};
    packageJson.devDependencies.typescript = "^5";
    writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
    console.log(
      "Added TypeScript dependency to package.json"
    );
    console.log(
      'Run "bun install" to install the required dependencies'
    );
  }

  console.log("\nCode generation completed successfully!");
  console.log(
    'Run "bun run codegen" to generate plugin code'
  );
}

main().catch(console.error);
