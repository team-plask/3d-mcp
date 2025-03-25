import { z } from "zod";
import { createExecutableTools } from "../core/request";
import { _OperationResponse } from "../core/entity";
import { createCrudOperations } from "../core/utils";
import { ModelEntities } from "./entity";
import { _Tensor } from "../core/entity";

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
    returns: _OperationResponse.extend({
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
    returns: _OperationResponse.extend({
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
            position: _Tensor.VEC3.optional().describe(
              "New position [x, y, z]"
            ),
            offset: _Tensor.VEC3.optional().describe(
              "Position offset to apply [dx, dy, dz]"
            ),
            normal: _Tensor.VEC3.optional().describe(
              "New normal vector [nx, ny, nz]"
            ),
          })
        )
        .describe("Vertex transformations to apply"),
    }),
    returns: _OperationResponse,
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
    returns: _OperationResponse,
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
              _Tensor.VEC3.optional().describe(
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
    returns: _OperationResponse.extend({
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
    returns: _OperationResponse.extend({
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
    returns: _OperationResponse,
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
    returns: _OperationResponse,
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
    returns: _OperationResponse.extend({
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
    returns: _OperationResponse.extend({
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
} as const;

export type ModelingTool = keyof typeof modelAtomicTools;

const modelAtomicToolsWithExecute = createExecutableTools(
  modelAtomicTools
);

export { modelAtomicToolsWithExecute };
