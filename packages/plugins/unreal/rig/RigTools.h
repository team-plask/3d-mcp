// Generated Unreal Engine implementation for rig atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "RigTools.generated.h"

/**
 * Unreal Engine implementation of the rig tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPRigTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPRigTools();
    
    virtual void RegisterTools() override;

    /**
     * Create multiple Joints
     * * @param items - Array of Joints to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createJoints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Joints
     * * @param ids - Joint identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteJoints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Joints in a single operation
     * * @param items - Array of Joints to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateJoints(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Joints
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listJoints(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Constraints
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listConstraints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Constraints in a single operation
     * * @param items - Array of Constraints to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateConstraints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple BlendShapes in a single operation
     * * @param items - Array of BlendShapes to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateBlendShapes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Joints by IDs
     * * @param ids - Joint identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getJoints(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all BlendShapes
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listBlendShapes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Constraints by IDs
     * * @param ids - Constraint identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getConstraints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple BlendShapes
     * * @param items - Array of BlendShapes to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createBlendShapes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple BlendShapes
     * * @param ids - BlendShape identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteBlendShapes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Constraints
     * * @param items - Array of Constraints to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createConstraints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Constraints
     * * @param ids - Constraint identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteConstraints(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple BlendShapes by IDs
     * * @param ids - BlendShape identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getBlendShapes(const TSharedPtr<FJsonObject>& Params);
};
