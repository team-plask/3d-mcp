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
     * Adds a new combine XYZ node to the current edited geometry.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeCombineXYZ(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new math node to the current edited geometry.
     * * @param operation - Math operation (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeMath(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new mesh cone node to the current edited geometry.
     * * @param Vertices - The Vertices parameter (int32)
     * @param Radius Top - The Radius Top parameter (double)
     * @param Radius Bottom - The Radius Bottom parameter (double)
     * @param Depth - The Depth parameter (double)
     * @param Side Segments - The Side Segments parameter (int32)
     * @param Fill Segments - The Fill Segments parameter (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeMeshCone(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new mesh cube node to the current edited geometry.
     * * @param Size - The Size parameter (TArray<TSharedPtr<FJsonValue>>)
     * @param Vertices X - The Vertices X parameter (int32)
     * @param Vertices Y - The Vertices Y parameter (int32)
     * @param Vertices Z - The Vertices Z parameter (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeMeshCube(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new mesh cylinder node to the current edited geometry.
     * * @param Vertices - The Vertices parameter (int32)
     * @param Radius - The Radius parameter (double)
     * @param Depth - The Depth parameter (double)
     * @param Side Segments - The Side Segments parameter (int32)
     * @param Fill Segments - The Fill Segments parameter (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeMeshCylinder(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new mesh sphere node to the current edited geometry.
     * * @param Radius - The Radius parameter (double)
     * @param Rings - The Rings parameter (int32)
     * @param Segments - The Segments parameter (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeMeshUVSphere(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new position input node to the current edited geometry.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodePositionInput(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new separate XYZ node to the current edited geometry.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeSeparateXYZ(const TSharedPtr<FJsonObject>& Params);

    /**
     * Adds a new set position node to the current edited geometry.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addNodeSetPosition(const TSharedPtr<FJsonObject>& Params);

    /**
     * Retrieves all input and output socket names for a node, and checks if input sockets can accept a default_value.
     * * @param nodeId - The node id to get information about, must exist in the node graph (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getNodeInputsOutputs(const TSharedPtr<FJsonObject>& Params);
};
