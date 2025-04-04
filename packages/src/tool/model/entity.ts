import { z } from "zod";
import { _BaseEntity, _Tensor, _NodeBase } from "../core/entity";

/**
 * MeshModifier - Base interface for all mesh modifiers
 */
const _MeshModifier = z.object({
  type: z.string().describe("Modifier type"),
  enabled: z.boolean().default(true).describe("Whether the modifier is active"),
  order: z
    .number()
    .int()
    .default(0)
    .describe("Processing order for stacked modifiers"),
});

/**
 * SubdivisionModifier - Smooths a mesh using subdivision
 */
export const SubdivisionModifier = _MeshModifier.extend({
  type: z.literal("subdivision"),
  subdivisionLevel: z
    .number()
    .int()
    .nonnegative()
    .default(1)
    .describe("Current subdivision level"),
  scheme: z
    .enum(["catmull-clark", "loop", "bilinear"])
    .describe("Subdivision scheme"),
  creaseEdges: z
    .array(
      z.object({
        edgeId: z.string().describe("Edge identifier"),
        creaseWeight: z.number().min(0).max(10).describe("Crease weight"),
      })
    )
    .optional()
    .describe("Creased edges with weights"),
  boundaryInterpolation: z
    .enum(["none", "edges", "all"])
    .default("all")
    .describe("Boundary interpolation rule"),
});

/**
 * Mesh - Basic 3D geometry entity composed of vertices, edges, and faces
 */
export const Mesh = _NodeBase.extend({
  vertices: z
    .array(_Tensor.VEC3)
    .describe("Array of vertex positions [x, y, z]"),
  edges: z
    .array(z.array(z.number().int()).length(2))
    .describe("Array of edges defined by vertex indices"),
  faces: z.array(z.number().int()).describe("Vertex indices defining polygons"),
  // Commented out because modifiers can apply to broader types than only meshes
  // modifiers: z
  //   .array(
  //     z.discriminatedUnion("type", [
  //       SubdivisionModifier,
  //       // Add other modifier types here when needed
  //     ])
  //   )
  //   .optional()
  //   .describe("Mesh modifiers applied in order"),
});

/**
 * Vertex - Single point in 3D space with optional attributes
 */
export const Vertex = _BaseEntity.extend({
  meshId: z.string().describe("ID of the parent mesh"),
  position: _Tensor.VEC3.describe("Position [x, y, z]"),
  normal: _Tensor.VEC3.optional().describe("Normal vector [nx, ny, nz]"),
  uv: z.array(_Tensor.VEC2).optional().describe("UV coordinates by channel"),
  color: _Tensor.VEC4.optional().describe("Vertex color [r, g, b, a]"),
  weight: z
    .record(z.string(), z.number())
    .optional()
    .describe("Vertex weights by influence (bone ID -> weight)"),
  selected: z
    .boolean()
    .default(false)
    .describe("Selection state of the vertex"),
});

/**
 * Edge - Connection between two vertices
 */
export const Edge = _BaseEntity.extend({
  meshId: z.string().describe("ID of the parent mesh"),
  vertexIds: z
    .tuple([z.string(), z.string()])
    .describe("IDs of vertices defining the edge"),
  sharp: z
    .boolean()
    .default(false)
    .describe("Whether the edge is marked as sharp"),
  crease: z
    .number()
    .min(0)
    .max(1)
    .default(0)
    .describe("Crease weight for subdivision"),
  hidden: z.boolean().default(false).describe("Whether the edge is hidden"),
  selected: z.boolean().default(false).describe("Selection state of the edge"),
});

/**
 * Face - Polygon defined by multiple vertices
 */
export const Face = _BaseEntity.extend({
  meshId: z.string().describe("ID of the parent mesh"),
  vertexIds: z
    .array(z.string())
    .min(3)
    .describe("IDs of vertices defining the face"),
  normal: _Tensor.VEC3.optional().describe("Face normal [nx, ny, nz]"),
  materialId: z
    .string()
    .optional()
    .describe("Material ID for this specific face"),
  smoothingGroup: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Smoothing group identifier"),
  selected: z.boolean().default(false).describe("Selection state of the face"),
});

/**
 * UV Map - Texture coordinate mapping for a mesh
 */
export const UVMap = _BaseEntity.extend({
  meshId: z.string().describe("ID of the associated mesh"),
  channel: z.number().int().nonnegative().describe("UV channel index"),
  coordinates: z
    .array(
      z.object({
        vertexId: z.string().describe("Vertex identifier"),
        u: z.number().describe("U coordinate"),
        v: z.number().describe("V coordinate"),
      })
    )
    .describe("UV coordinates per vertex"),
});

/**
 * Material - Surface appearance properties
 */
export const Material = _BaseEntity.extend({
  normalScale: z.number().optional().describe("Normal map intensity"),
  textures: z
    .record(
      z.enum([
        "baseColor",
        "normal",
        "metallic",
        "roughness",
        "emissive",
        "ambientOcclusion",
        "height",
        "opacity",
      ]),
      z.string()
    )
    .optional()
    .describe("Material texture maps by type"),
});

/**
 * Object Group - Collection of objects for organization
 */
export const Group = _BaseEntity.extend({
  objectIds: z.array(z.string()).describe("IDs of objects in this group"),
  parentId: z.string().optional().describe("ID of parent group"),
  visible: z.boolean().default(true).describe("Visibility state of the group"),
  locked: z.boolean().default(false).describe("Lock state of the group"),
});

/**
 * NURBS Curve - Non-uniform rational B-spline curve
 */
export const Curve = _NodeBase.extend({
  degree: z.number().int().positive().describe("Degree of the curve"),
  controlPoints: z
    .array(
      z.object({
        position: _Tensor.VEC3.describe("Position [x, y, z]"),
        weight: z
          .number()
          .positive()
          .default(1)
          .describe("Control point weight"),
      })
    )
    .describe("Control points defining the curve"),
  knots: z.array(z.number()).describe("Knot vector"),
  closed: z.boolean().default(false).describe("Whether the curve is closed"),
});

// Export collected entities
export const ModelEntities = {
  Mesh,
  Vertex,
  Edge,
  Face,
  UVMap,
  Material,
  Group,
  Curve,
  SubdivisionModifier,
} as const;
