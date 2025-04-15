// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "GeometryTools.generated.h"

/**
 * Unreal Engine implementation of the geometry tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPGeometryTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPGeometryTools();
    
    virtual void RegisterTools() override;

    /**
     * Creates a new geometry object.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createGeometry(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "GeometryTools.generated.h"

/**
 * Unreal Engine implementation of the geometry tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPGeometryTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPGeometryTools();
    
    virtual void RegisterTools() override;

    /**
     * Adds a new node to the current edited geometry.
     * * @param Params - Tool parameters from MCP
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNode(const TSharedPtr<FJsonObject>& Params);

    /**
     * Connects two nodes in the current edited geometry.
     * * @param from - Node identifier (FString)
     * @param fromPort - Port name (FString)
     * @param to - Node identifier (FString)
     * @param toPort - Port name (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> connectNodes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Ends the current editing of the geometry of an object.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> endEditGeometry(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get detailed information about a specific node type including its inputs and outputs
     * * @param nodeType - The node type to get information about (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getNodeDefinition(const TSharedPtr<FJsonObject>& Params);

    /**
     * Returns all available node types that can be added to a geometry
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getNodeTypes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Starts editing the geometry of an object.
     * * @param id - Object identifier (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> startEditGeometry(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
// Generated Unreal Engine implementation for geometry atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "GeometryTools.generated.h"

/**
 * Unreal Engine implementation of the geometry tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPGeometryTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPGeometryTools();
    
    virtual void RegisterTools() override;

    /**
     * Sets a property of a node. For the available properties, use 'getNodeDefinition'.
     * * @param nodeId - Node identifier (FString)
     * @param property - Property name (FString)
     * @param value - Property value (TSharedPtr<FJsonValue>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setNodeProperty(const TSharedPtr<FJsonObject>& Params);
};
