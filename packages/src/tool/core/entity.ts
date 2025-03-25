import { z } from "zod";

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
 * Standard operation response
 */
export const _OperationResponse = z.object({
  success: z.boolean().describe("Operation success status"),
});

/**
 * Data types for tensor values, aligned with glTF
 */
export const _TensorType = z.enum([
  "SCALAR", // Single value
  "VEC2", // 2D vector
  "VEC3", // 3D vector
  "VEC4", // 4D vector
  "MAT2", // 2×2 matrix
  "MAT3", // 3×3 matrix
  "MAT4", // 4×4 matrix
  "QUAT", // Quaternion
]);

/**
 * Helper to create tensor validators with consistent typing
 */
const createTensor = <
  T extends z.infer<typeof _TensorType>
>(
  length: number,
  typeName: T
) =>
  z
    .array(z.number())
    .length(length)
    .describe(
      `${typeName} tensor with ${length} components`
    );

/**
 * Type-specific tensor validators
 */
export const _Tensor = {
  SCALAR: z.number(),
  VEC2: createTensor(2, "VEC2"),
  VEC3: createTensor(3, "VEC3"),
  VEC4: createTensor(4, "VEC4"),
  QUAT: createTensor(4, "QUAT"),
  MAT2: createTensor(4, "MAT2"),
  MAT3: createTensor(9, "MAT3"),
  MAT4: createTensor(16, "MAT4"),

  // Common value union for flexible APIs
  any: z
    .array(z.number())
    .describe(
      "Generic tensor value (scalar, vector, matrix, or object)"
    ),
};

/**
 * Common transformable object properties
 */
export const _Transformable = z.object({
  position: _Tensor.VEC3.default([0, 0, 0]).describe(
    "Position [x, y, z]"
  ),
  rotation: _Tensor.QUAT.default([0, 0, 0, 1]).describe(
    "Rotation quaternion [x, y, z, w]"
  ),
  scale: _Tensor.VEC3.default([1, 1, 1]).describe(
    "Scale [x, y, z]"
  ),
});

/**
 * Visual properties common to renderable entities
 */
export const _VisualProperties = z.object({
  visible: z
    .boolean()
    .default(true)
    .describe("Visibility state"),
  locked: z
    .boolean()
    .default(false)
    .describe("Editing lock state"),
  castShadow: z
    .boolean()
    .default(true)
    .describe("Whether the object casts shadows"),
  receiveShadow: z
    .boolean()
    .default(true)
    .describe("Whether the object receives shadows"),
  renderOrder: z
    .number()
    .int()
    .default(0)
    .describe("Render sorting order"),
});

/**
 * Hierarchical object properties
 */
export const _Hierarchical = z.object({
  parentId: z
    .string()
    .nullable()
    .default(null)
    .describe("Parent object ID"),
  childIds: z
    .array(z.string())
    .default([])
    .describe("Child object IDs"),
});

/**
 * Bounds - Axis-aligned bounding box
 */
export const _Bounds = z.object({
  min: _Tensor.VEC3.describe("Minimum point [x, y, z]"),
  max: _Tensor.VEC3.describe("Maximum point [x, y, z]"),
  center: _Tensor.VEC3.optional().describe(
    "Center point [x, y, z]"
  ),
  size: _Tensor.VEC3.optional().describe(
    "Size dimensions [width, height, depth]"
  ),
});

/**
 * Interpolation types for animation and curves
 */
export const _InterpolationType = z.enum([
  "linear", // Linear interpolation
  "step", // Discrete step function
  "bezier", // Cubic Bezier curve
  "hermite", // Hermite spline
  "catmull", // Catmull-Rom spline
  "constant", // No interpolation (hold value)
]);

/**
 * Extrapolation behaviors for curves
 */
export const _ExtrapolationType = z.enum([
  "constant", // Hold last/first value
  "linear", // Continue linear trend
  "cycle", // Repeat from beginning
  "cycleWithOffset", // Repeat with offset
  "oscillate", // Ping-pong back and forth
]);

/**
 * Node base definition for scene graph
 */
export const _NodeBase = _BaseEntity.extend({
  ..._Transformable.shape,
  ..._VisualProperties.shape,
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
  sourceId: z
    .string()
    .describe("Source object ID (the one that drives)"),
  targetId: z
    .string()
    .describe(
      "Target object ID (the one being constrained)"
    ),
  influence: z
    .number()
    .min(0)
    .max(1)
    .default(1)
    .describe("Constraint influence strength"),
  maintainOffset: z
    .boolean()
    .default(true)
    .describe("Whether to maintain initial offset"),
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
    .default("world")
    .describe("Space in which constraint operates"),
  customSpaceId: z
    .string()
    .optional()
    .describe("Custom space reference object ID"),
  active: z
    .boolean()
    .default(true)
    .describe("Whether constraint is active"),
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
        vertexIndex: z
          .number()
          .int()
          .nonnegative()
          .describe("Vertex index"),
        positionDelta: _Tensor.VEC3.describe(
          "Position offset"
        ),
        normalDelta: _Tensor.VEC3.optional().describe(
          "Normal vector offset"
        ),
        tangentDelta: _Tensor.VEC3.optional().describe(
          "Tangent vector offset"
        ),
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
  length: z
    .number()
    .nonnegative()
    .default(1)
    .describe("Length of the joint"),
});

/**
 * Pose - A stored set of transforms for joints/bones
 */
export const Pose = _BaseEntity.extend({
  transforms: z
    .record(z.string(), _Tensor.MAT4)
    .describe("Transforms by joint/bone ID (ID -> matrix)"),
  isBindPose: z
    .boolean()
    .default(false)
    .describe("Whether this is a bind/rest pose"),
});

export const CoreEntities = {
  _BaseEntity,
  _OperationResponse,
  _TensorType,
  _Tensor,
  _Transformable,
  _VisualProperties,
  _Hierarchical,
  _Bounds,
  _InterpolationType,
  _ExtrapolationType,
  _NodeBase,
  Constraint,
  BlendShape,
  Joint,
  Pose,
} as const;
