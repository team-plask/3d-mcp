import { z } from "zod";
import {
  BaseEntity,
  Tensor,
  NodeBase,
  MaterialBase,
} from "../core/entity";

/**
 * Mesh - Basic 3D geometry entity composed of vertices, edges, and faces
 */
export const Mesh = NodeBase.extend({
  vertices: z
    .array(Tensor.VEC3)
    .describe("Array of vertex positions [x, y, z]"),
  normals: z
    .array(Tensor.VEC3)
    .optional()
    .describe("Array of normal vectors [nx, ny, nz]"),
  tangents: z
    .array(Tensor.VEC4)
    .optional()
    .describe(
      "Array of tangent vectors [tx, ty, tz, handedness]"
    ),
  uvs: z
    .array(Tensor.VEC2)
    .optional()
    .describe("Array of UV coordinates [u, v]"),
  colors: z
    .array(Tensor.VEC4)
    .optional()
    .describe("Array of vertex colors [r, g, b, a]"),
  indices: z
    .array(z.number().int())
    .describe("Vertex indices defining triangles"),
  materialId: z
    .string()
    .optional()
    .describe("ID of material applied to this mesh"),
});

/**
 * Vertex - Single point in 3D space with optional attributes
 */
export const Vertex = BaseEntity.extend({
  meshId: z.string().describe("ID of the parent mesh"),
  position: Tensor.VEC3.describe("Position [x, y, z]"),
  normal: Tensor.VEC3.optional().describe(
    "Normal vector [nx, ny, nz]"
  ),
  uv: z
    .array(Tensor.VEC2)
    .optional()
    .describe("UV coordinates by channel"),
  color: Tensor.VEC4.optional().describe(
    "Vertex color [r, g, b, a]"
  ),
  weight: z
    .record(z.string(), z.number())
    .optional()
    .describe(
      "Vertex weights by influence (bone ID -> weight)"
    ),
  selected: z
    .boolean()
    .default(false)
    .describe("Selection state of the vertex"),
});

/**
 * Edge - Connection between two vertices
 */
export const Edge = BaseEntity.extend({
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
  hidden: z
    .boolean()
    .default(false)
    .describe("Whether the edge is hidden"),
  selected: z
    .boolean()
    .default(false)
    .describe("Selection state of the edge"),
});

/**
 * Face - Polygon defined by multiple vertices
 */
export const Face = BaseEntity.extend({
  meshId: z.string().describe("ID of the parent mesh"),
  vertexIds: z
    .array(z.string())
    .min(3)
    .describe("IDs of vertices defining the face"),
  normal: Tensor.VEC3.optional().describe(
    "Face normal [nx, ny, nz]"
  ),
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
  selected: z
    .boolean()
    .default(false)
    .describe("Selection state of the face"),
});

/**
 * UV Map - Texture coordinate mapping for a mesh
 */
export const UVMap = BaseEntity.extend({
  meshId: z.string().describe("ID of the associated mesh"),
  channel: z
    .number()
    .int()
    .nonnegative()
    .describe("UV channel index"),
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
export const Material = MaterialBase.extend({
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
  emissive: Tensor.VEC3.optional().describe(
    "Emissive color [r, g, b]"
  ),
  emissiveIntensity: z
    .number()
    .nonnegative()
    .optional()
    .describe("Emissive intensity multiplier"),
  normalScale: z
    .number()
    .optional()
    .describe("Normal map intensity"),
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
  shaderParameters: z
    .record(z.string(), z.any())
    .optional()
    .describe("Additional shader-specific parameters"),
});

/**
 * Object Group - Collection of objects for organization
 */
export const Group = BaseEntity.extend({
  objectIds: z
    .array(z.string())
    .describe("IDs of objects in this group"),
  parentId: z
    .string()
    .optional()
    .describe("ID of parent group"),
  visible: z
    .boolean()
    .default(true)
    .describe("Visibility state of the group"),
  locked: z
    .boolean()
    .default(false)
    .describe("Lock state of the group"),
});

/**
 * NURBS Curve - Non-uniform rational B-spline curve
 */
export const Curve = NodeBase.extend({
  degree: z
    .number()
    .int()
    .positive()
    .describe("Degree of the curve"),
  controlPoints: z
    .array(
      z.object({
        position: Tensor.VEC3.describe(
          "Position [x, y, z]"
        ),
        weight: z
          .number()
          .positive()
          .default(1)
          .describe("Control point weight"),
      })
    )
    .describe("Control points defining the curve"),
  knots: z.array(z.number()).describe("Knot vector"),
  closed: z
    .boolean()
    .default(false)
    .describe("Whether the curve is closed"),
});

/**
 * SubdivisionSurface - Smooth subdivision surface
 */
export const SubdivisionSurface = BaseEntity.extend({
  baseMeshId: z.string().describe("ID of the base mesh"),
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
        creaseWeight: z
          .number()
          .min(0)
          .max(10)
          .describe("Crease weight"),
      })
    )
    .optional()
    .describe("Creased edges with weights"),
  boundaryInterpolation: z
    .enum(["none", "edges", "all"])
    .default("all")
    .describe("Boundary interpolation rule"),
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
  SubdivisionSurface,
} as const;
