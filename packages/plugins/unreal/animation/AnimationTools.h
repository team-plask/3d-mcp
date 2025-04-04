// Generated Unreal Engine implementation for animation atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "AnimationTools.generated.h"

/**
 * Unreal Engine implementation of the animation tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPAnimationTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPAnimationTools();
    
    virtual void RegisterTools() override;

    /**
     * Create multiple Channels
     * * @param items - Array of Channels to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createChannels(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Channels in a single operation
     * * @param items - Array of Channels to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateChannels(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Channels
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listChannels(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Drivers by IDs
     * * @param ids - Driver identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getDrivers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Keyframes in a single operation
     * * @param items - Array of Keyframes to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateKeyframes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Layers by IDs
     * * @param ids - Layer identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getLayers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Clips
     * * @param ids - Clip identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteClips(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Keyframes by IDs
     * * @param ids - Keyframe identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getKeyframes(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Keyframes
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listKeyframes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Clips
     * * @param items - Array of Clips to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createClips(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Channels
     * * @param ids - Channel identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteChannels(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Drivers in a single operation
     * * @param items - Array of Drivers to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateDrivers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Keyframes
     * * @param items - Array of Keyframes to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createKeyframes(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Clips by IDs
     * * @param ids - Clip identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getClips(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Layers in a single operation
     * * @param items - Array of Layers to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateLayers(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Layers
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listLayers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Keyframes
     * * @param ids - Keyframe identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteKeyframes(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Clips
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listClips(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Drivers
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listDrivers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Drivers
     * * @param ids - Driver identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteDrivers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Clips in a single operation
     * * @param items - Array of Clips to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateClips(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Channels by IDs
     * * @param ids - Channel identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getChannels(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Layers
     * * @param items - Array of Layers to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createLayers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Layers
     * * @param ids - Layer identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteLayers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Drivers
     * * @param items - Array of Drivers to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createDrivers(const TSharedPtr<FJsonObject>& Params);
};
