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

// === NEWLY GENERATED ===
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
     * Delete selected vertices, edges, or faces
     * * @param ids - IDs of structures to delete (TArray<TSharedPtr<FJsonValue>>)
     * @param type - The type parameter (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> delete(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete only selected edges, keeping vertices
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteOnlyEdges(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete only selected faces, keeping edges and vertices
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteOnlyFaces(const TSharedPtr<FJsonObject>& Params);

    /**
     * Dissolve selected vertices, edges, or faces
     * * @param ids - IDs of structures to dissolve (TArray<TSharedPtr<FJsonValue>>)
     * @param type - The type parameter (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> dissolve(const TSharedPtr<FJsonObject>& Params);

    /**
     * Starts a modeling operation
     * * @param meshIds - The meshIds parameter (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> editStart(const TSharedPtr<FJsonObject>& Params);

    /**
     * Stops a modeling operation
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> editStop(const TSharedPtr<FJsonObject>& Params);

    /**
     * Extrude selected vertices, edges, or faces
     * * @param offset - Extrusion offset vector (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> extrude(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get selected geometry structures
     * * @param type - The type parameter (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getSelect(const TSharedPtr<FJsonObject>& Params);

    /**
     * Inset selected faces
     * * @param items - Inset operations (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> inset(const TSharedPtr<FJsonObject>& Params);

    /**
     * Sets the current geometry structure to edit (vertex, edge, face)
     * * @param mode - The mode parameter (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setMode(const TSharedPtr<FJsonObject>& Params);

    /**
     * Select or deselect geometry structures
     * * @param ids - IDs of structures to select (TArray<TSharedPtr<FJsonValue>>)
     * @param type - The type parameter (FString)
     * @param mode - Selection mode (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setSelect(const TSharedPtr<FJsonObject>& Params);

    /**
     * Subdivide selected edges or faces
     * * @param count - Number of subdivisions (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> subdivide(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Get geometry data for the current edited mesh
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getGeometry(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Delete only selected edges and faces, keeping vertices
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteOnlyEdgesAndFaces(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Add primitive shapes to the scene
     * * @param type - Type of primitive to add (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addPrimitives(const TSharedPtr<FJsonObject>& Params);

    /**
     * Add a subsurface modifier to a mesh and set its level
     * * @param meshId - ID of the mesh to modify (FString)
     * @param level - Subdivision level (int32)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> addSubsurfModifierLevel(const TSharedPtr<FJsonObject>& Params);

    /**
     * Bridge two selected edge loops to create faces
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> bridgeEdgeLoops(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create an edge between two selected vertices
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createEdge(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create an edge loop on a mesh
     * * @param edgeId - ID of the edge to create a loop from (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createEdgeLoop(const TSharedPtr<FJsonObject>& Params);

    /**
     * Create a face from selected vertices or edges
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createFace(const TSharedPtr<FJsonObject>& Params);

    /**
     * Slide selected edges along their adjacent edges
     * * @param edgeId - IDs of edge to slide along (FString)
     * @param factor - Sliding factor (-1 to 1) (double)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> edgeSlide(const TSharedPtr<FJsonObject>& Params);

    /**
     * Select an edge loop
     * * @param edgeId - ID of an edge in the loop (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> selectEdgeLoop(const TSharedPtr<FJsonObject>& Params);

    /**
     * Select an edge ring
     * * @param edgeId - ID of an edge in the ring (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> selectEdgeRing(const TSharedPtr<FJsonObject>& Params);

    /**
     * Apply transformations (translate, rotate, scale) to selected elements
     * * @param translation - Translation vector (TArray<TSharedPtr<FJsonValue>>)
     * @param rotation - Rotation vector (Euler angles) (TArray<TSharedPtr<FJsonValue>>)
     * @param scale - Scaling vector (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> transform(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Extrude selected faces along their normals
     * * @param distance - Extrusion distance (double)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> extrudeAlongNormals(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Create a face or an edge from selected vertices or edges. Wether a face or an edge is created depends on how many vertices or edges are selected.
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createFaceOrEdge(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Set all parameters of a BSDF material
     * * @param materialId - Material identifier (FString)
     * @param parameters - Parameters to tweak (TSharedPtr<FJsonObject>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setMaterialParameters(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Add primitive shapes to the scene
     * * @param type - Type of primitive to add (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createMeshFromPrimitive(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete selected vertices, edges, or faces
     * * @param type - The type parameter (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteGeometry(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete a mesh from the scene
     * * @param meshId - ID of the mesh to delete (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteMesh(const TSharedPtr<FJsonObject>& Params);

    /**
     * Get selected vertices, edges, or faces
     * * @param type - The type parameter (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getSelectedGeometry(const TSharedPtr<FJsonObject>& Params);

    /**
     * Select or deselect vertices, edges, or faces
     * * @param ids - IDs of structures to select (TArray<TSharedPtr<FJsonValue>>)
     * @param type - The type parameter (FString)
     * @param mode - Selection mode (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setSelectedGeometry(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Create a light source (object) in the scene
     * * @param type - Light type (FString)
     * @param color - Light color (RGB) (TArray<TSharedPtr<FJsonValue>>)
     * @param intensity - Light intensity (double)
     * @param position - Light position (TArray<TSharedPtr<FJsonValue>>)
     * @param direction - Light direction (TArray<TSharedPtr<FJsonValue>>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> createLight(const TSharedPtr<FJsonObject>& Params);

    /**
     * Delete an object from the scene
     * * @param id - ID of the object to delete (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> deleteObject(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Set geometry data for the current edited mesh
     * * @param geometryData - Geometry data (TSharedPtr<FJsonObject>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setGeometry(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Set geometry data for the current edited mesh
     * * @param geometryData - Geometry data (TSharedPtr<FJsonObject>)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setGeometryde(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Get geometry data for the current edited mesh
     * 
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> getGeometryse(const TSharedPtr<FJsonObject>& Params);
};

// === NEWLY GENERATED ===
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
     * Apply a modifier to the current edited mesh
     * * @param id - Modifier identifier (FString)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> applyModifier(const TSharedPtr<FJsonObject>& Params);

    /**
     * Set proportional editing mode
     * * @param enabled - Enable or disable proportional editing (bool)
     * @param falloff - Falloff type (FString)
     * @param radius - Proportional editing radius (double)
     * @return Response object with operation results
     */
    UFUNCTION()
    TSharedPtr<FJsonObject> setProportionalEditing(const TSharedPtr<FJsonObject>& Params);
};
