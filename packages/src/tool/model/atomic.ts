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
  // ...entityCruds,

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
      geometryData: z
        .object({
          vertices: z
            .array(_Tensor.VEC3)
            .describe("Array of vertex positions [x, y, z]. Z is up"),
          edges: z
            .array(z.array(z.number().int()).length(2))
            .describe("Array of edges defined by vertex indices"),
          faces: z
            .array(z.number().int())
            .describe("Vertex indices defining polygons"),
        })
        .describe("Geometry data"),
    }),
  },

  setGeometry: {
    description: "Set geometry data for the current edited mesh",
    parameters: z.object({
      geometryData: z
        .object({
          vertices: z
            .array(_Tensor.VEC3)
            .describe("Array of vertex positions [x, y, z]. Z is up"),
          edges: z
            .array(z.array(z.number().int()).length(2))
            .describe("Array of edges defined by vertex indices"),
          faces: z
            .array(z.number().int())
            .describe("Vertex indices defining polygons"),
        })
        .describe("Geometry data"),
    }),
    returns: _OperationResponse,
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
      type: z.enum(["vertex", "edge", "face"]),
    }),
    returns: _OperationResponse,
  },
  deleteGeometry: {
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
  extrudeAlongNormals: {
    description: "Extrude selected faces along their normals",
    parameters: z.object({
      distance: z.number().describe("Extrusion distance"),
    }),
    returns: _OperationResponse,
  },
  bevel: {
    description: "Bevel selected edges or vertices",
    parameters: z.object({
      amount: z.number().describe("Bevel amount"),
      type: z.enum(["vertex", "edge"]),
    }),
    returns: _OperationResponse,
  },
  // transform: {
  //   description:
  //     "Apply transformations (translate, rotate, scale) to selected elements",
  //   parameters: z.object({
  //     translation: z
  //       .array(z.number())
  //       .length(3)
  //       .optional()
  //       .describe("Translation vector"),
  //     rotation: z
  //       .array(z.number())
  //       .length(3)
  //       .optional()
  //       .describe("Rotation vector (Euler angles)"),
  //     scale: z
  //       .array(z.number())
  //       .length(3)
  //       .optional()
  //       .describe("Scaling vector"),
  //   }),
  //   returns: _OperationResponse,
  // },
  edgeSlide: {
    description: "Slide selected edges along their adjacent edges",
    parameters: z.object({
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
  createFaceOrEdge: {
    description:
      "Create a face or an edge from selected vertices or edges. Wether a face or an edge is created depends on how many vertices or edges are selected.",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  addSubsurfModifierLevel: {
    description:
      "Add a subsurface modifier to the selected mesh and set its level",
    parameters: z.object({
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
    description: "Split meshes into separate meshes",
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
  createMeshFromPrimitive: {
    description:
      "Add primitive shapes (object) to the scene. \
    All primitives are centered at the origin and aligned with the world axes (z is up) \
      + sphere : the radius of the sphere is 1, and has 32 subdivisions. \
      + cube : the cube is 1x1x1. \
      + cylinder : the radius of the cylinder is 1, and has 32 subdivisions, its height axis is Z. \
      + plane : the plane is 1x1, and is just a quad. Its normal is the Z axis  ",
    parameters: z.object({
      type: z
        .enum(["sphere", "cube", "cylinder", "plane"])
        .describe("Type of primitive to add"),
    }),
    returns: _OperationResponse,
  },
  deleteObject: {
    description: "Delete an object from the scene",
    parameters: z.object({
      id: z.string().describe("ID of the object to delete"),
    }),
    returns: _OperationResponse,
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

  getMaterials: {
    description: "Get materials for the current edited mesh",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      materials: z
        .array(
          z.object({
            id: z.string().describe("Material identifier"),
            name: z.string().describe("Material name"),
          })
        )
        .describe("List of materials"),
    }),
  },
  setMaterialParameters: {
    description: "Set all parameters of a BSDF material",
    parameters: z.object({
      materialId: z.string().describe("Material identifier"),
      parameters: z
        .object({
          baseColor: z
            .array(z.number())
            .length(3)
            .optional()
            .describe("Base color (RGB)"),
          metallic: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe("Metallic factor"),
          roughness: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe("Roughness factor"),
          transmission: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe("Transmission factor"),
          transmissionRoughness: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe("Transmission roughness factor"),
          emission: z
            .array(z.number())
            .length(3)
            .optional()
            .describe("Emission color (RGB)"),
          alpha: z
            .number()
            .min(0)
            .max(1)
            .optional()
            .describe("Alpha transparency"),
        })
        .describe("Parameters to tweak"),
    }),
    returns: _OperationResponse,
  },
  // Light operations
  createLight: {
    description: "Create a light source (object) in the scene",
    parameters: z.object({
      type: z.enum(["point", "sun", "spot", "area"]).describe("Light type"),
      color: z
        .array(z.number())
        .length(3)
        .optional()
        .describe("Light color (RGB)"),
      intensity: z.number().min(0).optional().describe("Light intensity"),
      position: z
        .array(z.number())
        .length(3)
        .optional()
        .describe("Light position"),
      direction: z
        .array(z.number())
        .length(3)
        .optional()
        .describe("Light direction"),
      width: z
        .number()
        .optional()
        .describe("Width of the light (for area lights)"),
      height: z
        .number()
        .optional()
        .describe("Height of the light (for area lights)"),
    }),
    returns: _OperationResponse,
  },
} as const;

export type ModelingTool = keyof typeof modelAtomicTools;

const modelAtomicToolsWithExecute = createExecutableTools(modelAtomicTools);

export { modelAtomicToolsWithExecute };
