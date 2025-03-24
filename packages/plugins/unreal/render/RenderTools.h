// Generated Unreal Engine implementation for render atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "RenderTools.generated.h"

/**
 * Unreal Engine implementation of the render tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPRenderTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPRenderTools();
    
    virtual void RegisterTools() override;

    /**
     * Test tool
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> test(const TSharedPtr<FJsonObject>& Params);
};
