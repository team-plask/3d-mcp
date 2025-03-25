// Generated Unreal Engine implementation for model atomic tools
// This file is generated - DO NOT EDIT DIRECTLY

#pragma once

#include "CoreMinimal.h"
#include "MCPToolsBase.h"
#include "ModelTools.generated.h"

/**
 * Unreal Engine implementation of the model tools for MCP protocol
 */
UCLASS()
class MCPPLUGIN_API UMCPModelTools : public UMCPToolsBase
{
    GENERATED_BODY()

public:
    UMCPModelTools();
    
    virtual void RegisterTools() override;

    /**
     * Create multiple Edges
     * * @param items - Array of Edges to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createEdges(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Groups by IDs
     * * @param ids - Group identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getGroups(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create bridges between face loops
     * * @param items - Bridge operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> bridge(const TSharedPtr<FJsonObject>& Params);

    /**
     * Set crease weights for edges
     * * @param items - Edge crease operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setEdgeCreases(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Meshs by IDs
     * * @param ids - Mesh identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getMeshs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Materials
     * * @param ids - Material identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteMaterials(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple SubdivisionModifiers by IDs
     * * @param ids - SubdivisionModifier identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Curves
     * * @param items - Array of Curves to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createCurves(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Faces by IDs
     * * @param ids - Face identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Curves
     * * @param ids - Curve identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteCurves(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Curves in a single operation
     * * @param items - Array of Curves to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateCurves(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Curves
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listCurves(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Faces
     * * @param items - Array of Faces to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Extrude faces
     * * @param items - Face extrusion operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> extrudeFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Meshs
     * * @param items - Array of Meshs to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createMeshs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Edges by IDs
     * * @param ids - Edge identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getEdges(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Meshs
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listMeshs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Meshs in a single operation
     * * @param items - Array of Meshs to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateMeshs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Transform UV coordinates for vertices
     * * @param items - UV transformation operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> transformUVs(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all UVMaps
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listUVMaps(const TSharedPtr<FJsonObject>& Params);

    /**
     * Split meshes into separate objects
     * * @param items - Meshes to split (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> splitMeshes(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Faces
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Vertexs by IDs
     * * @param ids - Vertex identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getVertexs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Assign materials to meshes or specific faces
     * * @param items - Material assignments to make (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> assignMaterials(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Faces in a single operation
     * * @param items - Array of Faces to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple UVMaps in a single operation
     * * @param items - Array of UVMaps to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateUVMaps(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Materials
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listMaterials(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple UVMaps
     * * @param ids - UVMap identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteUVMaps(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Materials
     * * @param items - Array of Materials to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createMaterials(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple UVMaps
     * * @param items - Array of UVMaps to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createUVMaps(const TSharedPtr<FJsonObject>& Params);

    /**
     * Transform multiple vertices
     * * @param items - Vertex transformations to apply (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> transformVertices(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Edges in a single operation
     * * @param items - Array of Edges to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateEdges(const TSharedPtr<FJsonObject>& Params);

    /**
     * Generate UV coordinates using automatic unwrapping
     * * @param items - UV unwrapping operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> unwrapUVs(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Edges
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listEdges(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Groups
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listGroups(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all Vertexs
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listVertexs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Vertexs
     * * @param ids - Vertex identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteVertexs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Materials in a single operation
     * * @param items - Array of Materials to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateMaterials(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Groups in a single operation
     * * @param items - Array of Groups to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateGroups(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple SubdivisionModifiers
     * * @param items - Array of SubdivisionModifiers to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Vertexs
     * * @param items - Array of Vertexs to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createVertexs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Curves by IDs
     * * @param ids - Curve identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getCurves(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple SubdivisionModifiers
     * * @param ids - SubdivisionModifier identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple Materials by IDs
     * * @param ids - Material identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getMaterials(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Groups
     * * @param ids - Group identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteGroups(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create multiple Groups
     * * @param items - Array of Groups to create (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createGroups(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple SubdivisionModifiers in a single operation
     * * @param items - Array of SubdivisionModifiers to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Faces
     * * @param ids - Face identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get multiple UVMaps by IDs
     * * @param ids - UVMap identifiers (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getUVMaps(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Meshs
     * * @param ids - Mesh identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteMeshs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Bevel edges or vertices
     * * @param items - Bevel operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> bevel(const TSharedPtr<FJsonObject>& Params);

    /**
     * List all SubdivisionModifiers
     * * @param parentId - Optional parent ID to filter by (FString)
     * @param filters - Optional filters to apply (TSharedPtr<FJsonObject>)
     * @param limit - Maximum number of results (int32)
     * @param offset - Starting offset for pagination (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> listSubdivisionModifiers(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete multiple Edges
     * * @param ids - Edge identifiers to delete (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteEdges(const TSharedPtr<FJsonObject>& Params);

    /**
     * Update multiple Vertexs in a single operation
     * * @param items - Array of Vertexs to update with their IDs (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> updateVertexs(const TSharedPtr<FJsonObject>& Params);

    /**
     * Combine multiple meshes into a single mesh
     * * @param meshIds - IDs of meshes to combine (TArray<TSharedPtr<FJsonValue>>)
     * @param name - Name for the combined mesh (FString)
     * @param preserveSubMeshes - Whether to preserve material assignments as submeshes (bool)
     * @param worldSpace - Whether to combine in world space or local space (bool)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> combineMeshes(const TSharedPtr<FJsonObject>& Params);
};
