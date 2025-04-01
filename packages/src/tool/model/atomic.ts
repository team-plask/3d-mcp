import { z } from "zod";
import { createExecutableTools } from "../core/request";
import { _OperationResponse } from "../core/entity";
import { createCrudOperations } from "../core/utils";
import { Mesh, ModelEntities } from "./entity";
import { _Tensor } from "../core/entity";

const entityCruds = createCrudOperations(ModelEntities);

/**
 * Modeling atomic tools with focus on domain-specific batch operations
 */
const modelAtomicTools = {
  ...entityCruds,

  // General operations
  editStart: {
    description: "Starts a modeling operation",
    parameters: z.object({
      meshIds: z.array(z.string()),
    }),
    returns: _OperationResponse,
  },
  editStop: {
    description: "Stops a modeling operation",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  getGeometry: {
    description: "Get geometry data for the current edited mesh",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      geometryData: Mesh.describe("Geometry data"),
    }),
  },

  // Edit mesh operations

  // Selection operations
  setSelect: {
    description: "Select or deselect vertices, edges, or faces",
    parameters: z.object({
      ids: z.array(z.string()).describe("IDs of structures to select"),
      type: z.enum(["vertex", "edge", "face"]),
      mode: z
        .enum(["replace", "add", "remove"])
        .default("replace")
        .describe("Selection mode"),
    }),
    returns: _OperationResponse,
  },
  getSelect: {
    description: "Get selected vertices, edges, or faces",
    parameters: z.object({
      type: z.enum(["vertex", "edge", "face"]),
    }),
    returns: _OperationResponse.extend({
      selectedIds: z.array(z.string()).describe("IDs of selected structures"),
      type: z.enum(["vertex", "edge", "face"]),
    }),
  },

  // Structure operations
  setMode: {
    description:
      "Sets the current geometry structure to edit (vertex, edge, face)",
    parameters: z.object({
      mode: z.enum(["vertex", "edge", "face"]),
    }),
    returns: _OperationResponse,
  },
  dissolve: {
    description: "Dissolve selected vertices, edges, or faces",
    parameters: z.object({
      ids: z.array(z.string()).describe("IDs of structures to dissolve"),
      type: z.enum(["vertex", "edge", "face"]),
    }),
    returns: _OperationResponse,
  },
  delete: {
    description: "Delete selected vertices, edges, or faces",
    parameters: z.object({
      type: z.enum(["vertex", "edge", "face"]),
    }),
    returns: _OperationResponse,
  },
  deleteOnlyFaces: {
    description: "Delete only selected faces, keeping edges and vertices",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  deleteOnlyEdgesAndFaces: {
    description: "Delete only selected edges and faces, keeping vertices",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  subdivide: {
    description: "Subdivide selected edges or faces",
    parameters: z.object({
      count: z.number().describe("Number of subdivisions"),
    }),
    returns: _OperationResponse,
  },

  // Operators
  inset: {
    description: "Inset selected faces",
    parameters: z.object({
      amount: z.number().describe("Inset amount"),
    }),
    returns: _OperationResponse,
  },
  extrude: {
    description: "Extrude selected vertices, edges, or faces",
    parameters: z.object({
      offset: _Tensor.VEC3.describe("Extrusion offset vector"),
    }),
    returns: _OperationResponse,
  },
  bevel: {
    description: "Bevel selected edges or vertices",
    parameters: z.object({
      amount: z.number().describe("Bevel amount"),
    }),
    returns: _OperationResponse,
  },
  transform: {
    description:
      "Apply transformations (translate, rotate, scale) to selected elements",
    parameters: z.object({
      translation: _Tensor.VEC3.optional().describe("Translation vector"),
      rotation: _Tensor.VEC3.optional().describe(
        "Rotation vector (Euler angles)"
      ),
      scale: _Tensor.VEC3.optional().describe("Scaling vector"),
    }),
    returns: _OperationResponse,
  },
  edgeSlide: {
    description: "Slide selected edges along their adjacent edges",
    parameters: z.object({
      edgeId: z.string().describe("IDs of edge to slide along"),
      factor: z.number().describe("Sliding factor (-1 to 1)"),
    }),
    returns: _OperationResponse,
  },
  createEdgeLoop: {
    description: "Create an edge loop on a mesh",
    parameters: z.object({
      edgeId: z.string().describe("ID of the edge to create a loop from"),
    }),
    returns: _OperationResponse,
  },
  selectEdgeLoop: {
    description: "Select an edge loop",
    parameters: z.object({
      edgeId: z.string().describe("ID of an edge in the loop"),
    }),
    returns: _OperationResponse,
  },
  selectEdgeRing: {
    description: "Select an edge ring",
    parameters: z.object({
      edgeId: z.string().describe("ID of an edge in the ring"),
    }),
    returns: _OperationResponse,
  },
  bridgeEdgeLoops: {
    description: "Bridge two selected edge loops to create faces",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  createFace: {
    description: "Create a face from selected vertices or edges",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  createEdge: {
    description: "Create an edge between two selected vertices",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  addPrimitives: {
    description: "Add primitive shapes to the scene",
    parameters: z.object({
      type: z
        .enum(["sphere", "cube", "cylinder", "plane"])
        .describe("Type of primitive to add"),
    }),
    returns: _OperationResponse,
  },
  addSubsurfModifierLevel: {
    description: "Add a subsurface modifier to a mesh and set its level",
    parameters: z.object({
      meshId: z.string().describe("ID of the mesh to modify"),
      level: z.number().int().min(1).max(6).describe("Subdivision level"),
    }),
    returns: _OperationResponse,
  },

  // Mesh operations
  combineMeshes: {
    description: "Combine multiple meshes into a single mesh",
    parameters: z.object({
      meshIds: z.array(z.string()).min(2).describe("IDs of meshes to combine"),
      name: z.string().optional().describe("Name for the combined mesh"),
      preserveSubMeshes: z
        .boolean()
        .default(false)
        .describe("Whether to preserve material assignments as submeshes"),
      worldSpace: z
        .boolean()
        .default(true)
        .describe("Whether to combine in world space or local space"),
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
              .enum(["byMaterial", "byUnconnected", "bySelection"])
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
            originalMeshId: z.string().describe("Original mesh ID"),
            resultMeshIds: z
              .array(z.string())
              .describe("IDs of the newly created split meshes"),
          })
        )
        .describe("Split results by mesh"),
    }),
  },

  // UVMap operations
  unwrapUVs: {
    description: "Generate UV coordinates using automatic unwrapping",
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
              .describe("Whether to pack UV islands efficiently"),
            normalizeUVs: z
              .boolean()
              .default(true)
              .describe("Whether to normalize UVs to 0-1 range"),
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
            uvMapId: z.string().describe("ID of the created or updated UV map"),
          })
        )
        .describe("Unwrapping results"),
    }),
  },

  // transformUVs: {
  //   description: "Transform UV coordinates for vertices",
  //   parameters: z.object({
  //     items: z
  //       .array(
  //         z.object({
  //           meshId: z.string().describe("Mesh identifier"),
  //           channel: z
  //             .number()
  //             .int()
  //             .nonnegative()
  //             .default(0)
  //             .describe("Target UV channel"),
  //           vertexTransforms: z
  //             .array(
  //               z.object({
  //                 vertexId: z.string().describe("Vertex identifier"),
  //                 u: z.number().optional().describe("New U coordinate"),
  //                 v: z.number().optional().describe("New V coordinate"),
  //                 offsetU: z.number().optional().describe("U offset to apply"),
  //                 offsetV: z.number().optional().describe("V offset to apply"),
  //               })
  //             )
  //             .describe("Per-vertex UV transformations"),
  //         })
  //       )
  //       .describe("UV transformation operations"),
  //   }),
  //   returns: _OperationResponse,
  // },

  // Material operations
  assignMaterials: {
    description: "Assign materials to meshes or specific faces",
    parameters: z.object({
      items: z
        .array(
          z.object({
            materialId: z.string().describe("Material identifier"),
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
} as const;

export type ModelingTool = keyof typeof modelAtomicTools;

const modelAtomicToolsWithExecute = createExecutableTools(modelAtomicTools);

export { modelAtomicToolsWithExecute };
