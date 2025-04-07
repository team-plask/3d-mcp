// Generated Unreal Engine implementation for monitor atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "MonitorTools.generated.h"

/**
 * Unreal Engine implementation of the monitor tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPMonitorTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPMonitorTools();
    
    virtual void RegisterTools() override;

    /**
     * Get top, front, right, and perspective views of the scene.
     * * @param shading_mode - Shading mode for the viewports (FString)
     * @param name_visibility_predicate -  Function that takes an object as input and returns a dict with display settings. See example below. (FString)
     * @param auto_adjust_camera - Automatically adjust camera to fit the scene (bool)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getQuadView(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for monitor atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "MonitorTools.generated.h"

/**
 * Unreal Engine implementation of the monitor tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPMonitorTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPMonitorTools();
    
    virtual void RegisterTools() override;

    /**
     * Get the scene graph of the current scene.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getSceneGraph(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for monitor atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "MonitorTools.generated.h"

/**
 * Unreal Engine implementation of the monitor tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPMonitorTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPMonitorTools();
    
    virtual void RegisterTools() override;

    /**
     * Get a customizable view of the 3D scene from any camera angle.
     * * @param shading_mode - Rendering style for the viewport (WIREFRAME: line rendering, SOLID: basic shading, MATERIAL: with materials, RENDERED: fully rendered) (FString)
     * @param name_visibility_predicate - Python lambda function that takes an object as input and returns display settings (e.g., 'lambda obj: {"show_name": obj.type == "MESH"}') (FString)
     * @param auto_adjust_camera - When true, automatically positions the camera to frame all scene objects (bool)
     * @param perspective - Predefined view angle (TOP/FRONT/RIGHT/PERSP) or custom camera configuration (TSharedPtr<FJsonValue>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getCameraView(const TSharedPtr<FJsonObject>& Params);
};
