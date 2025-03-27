import { z } from "zod";
import { Tensor } from "../types/tensor";

/**
 * Base entity definition all entities will extend
 */
export const _BaseEntity = z.object({
  id: z.string().describe("Unique identifier"),
  name: z.string().describe("Display name"),
  metadata: z
    .record(z.string(), z.any())
    .optional()
    .describe("Additional tool-specific metadata"),
});

/**
 * Visual properties common to renderable entities
 */
export const _VisualProperties = z.object({
  visible: z.boolean().default(true).describe("Visibility state"),
  locked: z.boolean().default(false).describe("Editing lock state"),
  castShadow: z
    .boolean()
    .default(true)
    .describe("Whether the object casts shadows"),
  receiveShadow: z
    .boolean()
    .default(true)
    .describe("Whether the object receives shadows"),
  renderOrder: z.number().int().default(0).describe("Render sorting order"),
});

/**
 * Node base definition for scene graph
 */
export const _NodeBase = _BaseEntity.extend({
  ..._Transformable.shape,
  ..._Hierarchical.shape,
});

/**
 * Constraint - Restriction on object movement (common across domains)
 */
export const Constraint = _BaseEntity.extend({
  type: z
    .enum([
      "point",
      "aim",
      "orientation",
      "parent",
      "pole",
      "ik",
      "spring",
      "path",
      "scaleTo",
      "lookAt",
    ])
    .describe("Constraint type"),
  sourceId: z.string().describe("Source object ID (the one that drives)"),
  targetId: z.string().describe("Target object ID (the one being constrained)"),
  influence: z.number().min(0).max(1).describe("Constraint influence strength"),
  maintainOffset: z.boolean().describe("Whether to maintain initial offset"),
  skipRotation: z
    .array(z.enum(["x", "y", "z"]))
    .optional()
    .describe("Rotation axes to skip"),
  skipTranslation: z
    .array(z.enum(["x", "y", "z"]))
    .optional()
    .describe("Translation axes to skip"),
  skipScale: z
    .array(z.enum(["x", "y", "z"]))
    .optional()
    .describe("Scale axes to skip"),
  space: z
    .enum(["world", "local", "custom"])
    .describe("Space in which constraint operates"),
  customSpaceId: z
    .string()
    .optional()
    .describe("Custom space reference object ID"),
  active: z.boolean().describe("Whether constraint is active"),
});

/**
 * BlendShape - Per-vertex mesh deformation (used in both modeling and animation)
 */
export const BlendShape = _BaseEntity.extend({
  meshId: z.string().describe("ID of the target mesh"),
  weight: z
    .number()
    .min(0)
    .max(1)
    .default(0)
    .describe("Current blend shape weight"),
  deltas: z
    .array(
      z.object({
        vertexIndex: z.number().int().nonnegative().describe("Vertex index"),
        positionDelta: _Tensor.VEC3.describe("Position offset"),
        normalDelta: _Tensor.VEC3.optional().describe("Normal vector offset"),
        tangentDelta: _Tensor.VEC3.optional().describe("Tangent vector offset"),
      })
    )
    .describe("Per-vertex deformation deltas"),
  combineMethod: z
    .enum(["average", "additive"])
    .default("additive")
    .describe("How this shape combines with others"),
});

/**
 * Joint - Base joint/bone definition for skeletal systems
 */
export const Joint = _NodeBase.extend({
  length: z.number().nonnegative().default(1).describe("Length of the joint"),
});

/**
 * Pose - A stored set of transforms for joints/bones
 */
export const Pose = _BaseEntity.extend({
  transforms: z
    .record(z.string(), Tensor.MAT4)
    .describe("Transforms by joint/bone ID (ID -> matrix)"),
  isBindPose: z
    .boolean()
    .default(false)
    .describe("Whether this is a bind/rest pose"),
});

export const CoreEntities = {
  _BaseEntity,
  _OperationResponse,
  _VisualProperties,
  _NodeBase,
  Constraint,
  BlendShape,
  Joint,
  Pose,
} as const;
