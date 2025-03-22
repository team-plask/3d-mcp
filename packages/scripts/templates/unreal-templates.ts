import type { PluginConfig } from "../config/pluginsConfig";
import { capitalizeFirstLetter } from "../utils/string";
import { getTypeForLanguage } from "../utils/types";

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

function generateUnrealServer(
  plugin: PluginConfig,
  categories: string[]
) {
  const headerContent = `// Generated Unreal Engine server implementation
// This file is generated - DO NOT EDIT DIRECTLY
`;
  const cppContent = `// Generated Unreal Engine server implementation
// This file is generated - DO NOT EDIT DIRECTLY
`;

  return { headerContent, cppContent };
}

export {
  generateUnrealImplementation,
  generateUnrealServer,
};
