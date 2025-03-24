// Generated Unreal Engine implementation for core atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "CoreTools.generated.h"

/**
 * Unreal Engine implementation of the core tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPCoreTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPCoreTools();
    
    virtual void RegisterTools() override;

    /**
     * Set properties on multiple objects
     * * @param items - Property assignments to make (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> batchSetProperty(const TSharedPtr<FJsonObject>& Params);

    /**
     * Query entities based on criteria
     * * @param type - Entity type to filter by (FString)
     * @param properties - Property values to match (path -> value) (TSharedPtr<FJsonObject>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> query(const TSharedPtr<FJsonObject>& Params);

    /**
     * Clear current selection
     * * @param domain - Optional domain to restrict clearing (e.g., 'mesh', 'animation') (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> clearSelection(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get all children of an object
     * * @param id - Parent object identifier (FString)
     * @param recursive - Whether to include all descendants (bool)
     * @param typeFilter - Filter by object types (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getChildren(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get currently selected objects
     * * @param domain - Optional domain to filter results (e.g., 'mesh', 'animation') (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getSelection(const TSharedPtr<FJsonObject>& Params);

    /**
     * Undo the last operation
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> undo(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get property values from multiple objects
     * * @param items - Property requests to make (TArray<TSharedPtr<FJsonValue>>)
     * @param recursive - Whether to include all descendants (bool)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> batchGetProperty(const TSharedPtr<FJsonObject>& Params);

    /**
     * Apply transformations to multiple objects
     * * @param items - Transformations to apply (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> batchTransform(const TSharedPtr<FJsonObject>& Params);

    /**
     * Set parent for multiple objects
     * * @param items - Parent assignments to make (TArray<TSharedPtr<FJsonValue>>)
     * @param maintainWorldTransform - Whether to preserve world transforms after reparenting (bool)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> batchSetParent(const TSharedPtr<FJsonObject>& Params);

    /**
     * Redo the previously undone operation
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> redo(const TSharedPtr<FJsonObject>& Params);

    /**
     * Duplicate an entity
     * * @param id - Source entity identifier (FString)
     * @param newName - Name for the duplicated entity (FString)
     * @param duplicateChildren - Whether to duplicate children (bool)
     * @param duplicateDependencies - Whether to duplicate dependencies (materials, etc.) (bool)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> duplicate(const TSharedPtr<FJsonObject>& Params);

    /**
     * Select one or more objects
     * * @param ids - Object identifiers to select (TArray<TSharedPtr<FJsonValue>>)
     * @param mode - Selection mode operation (FString)
     * @param domain - Optional domain to restrict selection (e.g., 'mesh', 'animation') (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> select(const TSharedPtr<FJsonObject>& Params);
};
