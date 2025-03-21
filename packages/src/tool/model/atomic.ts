import { z } from "zod";
import { createExecutableTools } from "../core/request";
import { OperationResponse } from "../core/entity";
import { createCrudOperations } from "../core/utils";
import { ModelEntities } from "./entity";
import { Tensor } from "../core/entity";

const entityCruds = createCrudOperations(ModelEntities);

/**
 * Modeling atomic tools with focus on domain-specific batch operations
 */
const modelAtomicTools = {
  ...entityCruds,

  // Mesh operations
  combineMeshes: {
    description:
      "Combine multiple meshes into a single mesh",
    parameters: z.object({
      meshIds: z
        .array(z.string())
        .min(2)
        .describe("IDs of meshes to combine"),
      name: z
        .string()
        .optional()
        .describe("Name for the combined mesh"),
      preserveSubMeshes: z
        .boolean()
        .default(false)
        .describe(
          "Whether to preserve material assignments as submeshes"
        ),
      worldSpace: z
        .boolean()
        .default(true)
        .describe(
          "Whether to combine in world space or local space"
        ),
    }),
    returns: OperationResponse.extend({
      combinedMeshId: z
        .string()
        .describe("ID of the newly created combined mesh"),
    }),
  },

  splitMeshes: {
    description: "Split meshes into separate objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            method: z
              .enum([
                "byMaterial",
                "byUnconnected",
                "bySelection",
              ])
              .describe("Splitting method"),
            namePattern: z
              .string()
              .optional()
              .default("{original}_part_{index}")
              .describe("Naming pattern for split results"),
          })
        )
        .describe("Meshes to split"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            originalMeshId: z
              .string()
              .describe("Original mesh ID"),
            resultMeshIds: z
              .array(z.string())
              .describe(
                "IDs of the newly created split meshes"
              ),
          })
        )
        .describe("Split results by mesh"),
    }),
  },

  // Vertex operations
  transformVertices: {
    description: "Transform multiple vertices",
    parameters: z.object({
      items: z
        .array(
          z.object({
            vertexId: z
              .string()
              .describe("Vertex identifier"),
            position: Tensor.VEC3.optional().describe(
              "New position [x, y, z]"
            ),
            offset: Tensor.VEC3.optional().describe(
              "Position offset to apply [dx, dy, dz]"
            ),
            normal: Tensor.VEC3.optional().describe(
              "New normal vector [nx, ny, nz]"
            ),
          })
        )
        .describe("Vertex transformations to apply"),
    }),
    returns: OperationResponse,
  },

  // Edge operations
  setEdgeCreases: {
    description: "Set crease weights for edges",
    parameters: z.object({
      items: z
        .array(
          z.object({
            edgeId: z.string().describe("Edge identifier"),
            creaseWeight: z
              .number()
              .min(0)
              .max(10)
              .describe("Crease weight value"),
          })
        )
        .describe("Edge crease operations"),
    }),
    returns: OperationResponse,
  },

  // Face operations
  extrudeFaces: {
    description: "Extrude faces",
    parameters: z.object({
      items: z
        .array(
          z.object({
            faceIds: z
              .array(z.string())
              .describe("Face identifiers"),
            distance: z
              .number()
              .describe("Extrusion distance"),
            direction: z
              .enum(["normal", "custom"])
              .default("normal")
              .describe("Extrusion direction method"),
            customDirection:
              Tensor.VEC3.optional().describe(
                "Custom direction vector when using 'custom' direction"
              ),
            createCaps: z
              .boolean()
              .default(true)
              .describe("Whether to create cap faces"),
            individualFaces: z
              .boolean()
              .default(false)
              .describe(
                "Whether to extrude faces individually"
              ),
          })
        )
        .describe("Face extrusion operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            faceIds: z
              .array(z.string())
              .describe("Original face identifiers"),
            newFaceIds: z
              .array(z.string())
              .describe("IDs of newly created faces"),
            newEdgeIds: z
              .array(z.string())
              .describe("IDs of newly created edges"),
          })
        )
        .describe("Extrusion results"),
    }),
  },

  // UVMap operations
  unwrapUVs: {
    description:
      "Generate UV coordinates using automatic unwrapping",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            method: z
              .enum([
                "angle",
                "conformal",
                "lscm",
                "abf",
                "sphere",
                "box",
                "cylinder",
              ])
              .default("angle")
              .describe("Unwrapping method"),
            channel: z
              .number()
              .int()
              .nonnegative()
              .default(0)
              .describe("Target UV channel"),
            packIslands: z
              .boolean()
              .default(true)
              .describe(
                "Whether to pack UV islands efficiently"
              ),
            normalizeUVs: z
              .boolean()
              .default(true)
              .describe(
                "Whether to normalize UVs to 0-1 range"
              ),
            margin: z
              .number()
              .min(0)
              .max(1)
              .default(0.01)
              .describe("Margin between UV islands"),
          })
        )
        .describe("UV unwrapping operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            uvMapId: z
              .string()
              .describe(
                "ID of the created or updated UV map"
              ),
          })
        )
        .describe("Unwrapping results"),
    }),
  },

  transformUVs: {
    description: "Transform UV coordinates for vertices",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            channel: z
              .number()
              .int()
              .nonnegative()
              .default(0)
              .describe("Target UV channel"),
            vertexTransforms: z
              .array(
                z.object({
                  vertexId: z
                    .string()
                    .describe("Vertex identifier"),
                  u: z
                    .number()
                    .optional()
                    .describe("New U coordinate"),
                  v: z
                    .number()
                    .optional()
                    .describe("New V coordinate"),
                  offsetU: z
                    .number()
                    .optional()
                    .describe("U offset to apply"),
                  offsetV: z
                    .number()
                    .optional()
                    .describe("V offset to apply"),
                })
              )
              .describe("Per-vertex UV transformations"),
          })
        )
        .describe("UV transformation operations"),
    }),
    returns: OperationResponse,
  },

  // Material operations
  assignMaterials: {
    description:
      "Assign materials to meshes or specific faces",
    parameters: z.object({
      items: z
        .array(
          z.object({
            materialId: z
              .string()
              .describe("Material identifier"),
            meshId: z.string().describe("Mesh identifier"),
            faceIds: z
              .array(z.string())
              .optional()
              .describe(
                "Specific face IDs (if omitted, applies to entire mesh)"
              ),
          })
        )
        .describe("Material assignments to make"),
    }),
    returns: OperationResponse,
  },

  // Group operations
  performGroupOperations: {
    description: "Perform operations on object groups",
    parameters: z.object({
      operation: z
        .enum(["add", "remove", "move", "nest"])
        .describe("Operation to perform"),
      items: z
        .array(
          z.object({
            groupId: z
              .string()
              .describe("Group identifier"),
            objectIds: z
              .array(z.string())
              .optional()
              .describe(
                "Object IDs for add/remove operations"
              ),
            targetGroupId: z
              .string()
              .optional()
              .describe(
                "Target group for move/nest operations"
              ),
          })
        )
        .describe("Group operations to perform"),
    }),
    returns: OperationResponse,
  },

  // Curve operations
  editCurveControlPoints: {
    description: "Edit control points of curves",
    parameters: z.object({
      items: z
        .array(
          z.object({
            curveId: z
              .string()
              .describe("Curve identifier"),
            controlPointIndex: z
              .number()
              .int()
              .nonnegative()
              .describe("Index of control point to edit"),
            position: Tensor.VEC3.optional().describe(
              "New position [x, y, z]"
            ),
            weight: z
              .number()
              .positive()
              .optional()
              .describe("New weight value"),
          })
        )
        .describe("Curve control point edits"),
    }),
    returns: OperationResponse,
  },

  // SubdivisionSurface operations
  setSubdivisionLevels: {
    description: "Set subdivision levels for surfaces",
    parameters: z.object({
      items: z
        .array(
          z.object({
            subdivisionSurfaceId: z
              .string()
              .describe("Subdivision surface identifier"),
            level: z
              .number()
              .int()
              .nonnegative()
              .describe("Subdivision level to set"),
          })
        )
        .describe("Subdivision level operations"),
    }),
    returns: OperationResponse,
  },

  // Topology operations
  triangulate: {
    description: "Convert n-gons to triangles",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            facesToTriangulate: z
              .array(z.string())
              .optional()
              .describe(
                "Specific face IDs to triangulate (if omitted, applies to all faces)"
              ),
            method: z
              .enum(["beauty", "delaunay", "fan"])
              .default("beauty")
              .describe("Triangulation method"),
            preserveBoundaries: z
              .boolean()
              .default(true)
              .describe(
                "Whether to preserve boundary edges"
              ),
          })
        )
        .describe("Triangulation operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            addedFaceIds: z
              .array(z.string())
              .describe("IDs of newly created faces"),
            removedFaceIds: z
              .array(z.string())
              .describe("IDs of removed faces"),
          })
        )
        .describe("Triangulation results"),
    }),
  },

  quadrangulate: {
    description: "Convert triangles to quads",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            facesToQuadrangulate: z
              .array(z.string())
              .optional()
              .describe(
                "Specific face IDs to quadrangulate (if omitted, applies to all faces)"
              ),
            maxAngleDeviation: z
              .number()
              .min(0)
              .max(180)
              .default(40)
              .describe(
                "Maximum angle deviation for merging triangles"
              ),
          })
        )
        .describe("Quadrangulation operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            addedFaceIds: z
              .array(z.string())
              .describe("IDs of newly created faces"),
            removedFaceIds: z
              .array(z.string())
              .describe("IDs of removed faces"),
          })
        )
        .describe("Quadrangulation results"),
    }),
  },

  // Mesh modification operations
  bevel: {
    description: "Bevel edges or vertices",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            edgeIds: z
              .array(z.string())
              .optional()
              .describe("Edge IDs to bevel"),
            vertexIds: z
              .array(z.string())
              .optional()
              .describe("Vertex IDs to bevel"),
            amount: z
              .number()
              .positive()
              .describe("Bevel amount"),
            segments: z
              .number()
              .int()
              .positive()
              .default(1)
              .describe("Number of bevel segments"),
            shape: z
              .number()
              .min(0)
              .max(1)
              .default(0.5)
              .describe("Profile shape factor"),
          })
        )
        .describe("Bevel operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            newFaceIds: z
              .array(z.string())
              .describe("IDs of newly created faces"),
            newEdgeIds: z
              .array(z.string())
              .describe("IDs of newly created edges"),
            newVertexIds: z
              .array(z.string())
              .describe("IDs of newly created vertices"),
          })
        )
        .describe("Bevel results"),
    }),
  },

  bridge: {
    description: "Create bridges between face loops",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            faceLoopA: z
              .array(z.string())
              .describe("First face loop"),
            faceLoopB: z
              .array(z.string())
              .describe("Second face loop"),
            twist: z
              .number()
              .int()
              .default(0)
              .describe(
                "Twist offset for bridge connections"
              ),
            smooth: z
              .boolean()
              .default(true)
              .describe("Whether to smooth the bridge"),
          })
        )
        .describe("Bridge operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            meshId: z.string().describe("Mesh identifier"),
            bridgeFaceIds: z
              .array(z.string())
              .describe("IDs of bridge faces"),
            bridgeEdgeIds: z
              .array(z.string())
              .describe("IDs of bridge edges"),
          })
        )
        .describe("Bridge results"),
    }),
  },

  // Import/Export operations
  importGeometry: {
    description: "Import geometry data sources",
    parameters: z.object({
      items: z
        .array(
          z.object({
            format: z
              .enum([
                "obj",
                "fbx",
                "stl",
                "gltf",
                "ply",
                "usd",
              ])
              .describe("Source format"),
            data: z
              .any()
              .describe(
                "Geometry data in the specified format"
              ),
            options: z
              .object({
                scale: z
                  .number()
                  .positive()
                  .optional()
                  .default(1)
                  .describe("Import scale factor"),
                calculateNormals: z
                  .boolean()
                  .optional()
                  .default(true)
                  .describe(
                    "Whether to calculate normals if missing"
                  ),
                importMaterials: z
                  .boolean()
                  .optional()
                  .default(true)
                  .describe("Whether to import materials"),
              })
              .optional()
              .describe("Import options"),
          })
        )
        .describe("Geometry sources to import"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            index: z
              .number()
              .int()
              .nonnegative()
              .describe(
                "Index in the original items array"
              ),
            meshIds: z
              .array(z.string())
              .describe("IDs of imported meshes"),
            materialIds: z
              .array(z.string())
              .optional()
              .describe(
                "IDs of imported materials if applicable"
              ),
          })
        )
        .describe("Import results"),
    }),
  },

  exportGeometry: {
    description:
      "Export geometry collections to external formats",
    parameters: z.object({
      items: z
        .array(
          z.object({
            meshIds: z
              .array(z.string())
              .describe("IDs of meshes to export"),
            format: z
              .enum([
                "obj",
                "fbx",
                "stl",
                "gltf",
                "ply",
                "usd",
              ])
              .describe("Target format"),
            options: z
              .object({
                scale: z
                  .number()
                  .positive()
                  .optional()
                  .default(1)
                  .describe("Export scale factor"),
                exportMaterials: z
                  .boolean()
                  .optional()
                  .default(true)
                  .describe("Whether to export materials"),
              })
              .optional()
              .describe("Export options"),
          })
        )
        .describe("Geometry export operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            index: z
              .number()
              .int()
              .nonnegative()
              .describe(
                "Index in the original items array"
              ),
            data: z
              .any()
              .describe("Exported geometry data"),
          })
        )
        .describe("Export results"),
    }),
  },
} as const;

export type ModelingTool = keyof typeof modelAtomicTools;

const modelAtomicToolsWithExecute = createExecutableTools(
  modelAtomicTools
);

export { modelAtomicToolsWithExecute };
