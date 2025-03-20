import { z } from "zod";

/**
 * Base entity definition all entities will extend
 */
export const BaseEntity = z.object({
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
export const OperationResponse = z.object({
  success: z.boolean().describe("Operation success status"),
});

/**
 * Data types for tensor values, aligned with glTF
 */
export const TensorType = z.enum([
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
const createTensor = <T extends z.infer<typeof TensorType>>(
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
export const Tensor = {
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
    .union([
      z.number(),
      z.array(z.number()).min(2).max(16),
      z.record(z.string(), z.number()),
    ])
    .describe(
      "Generic tensor value (scalar, vector, matrix, or object)"
    ),
};

/**
 * Common transformable object properties
 */
export const Transformable = z.object({
  position: Tensor.VEC3.default([0, 0, 0]).describe(
    "Position [x, y, z]"
  ),
  rotation: Tensor.QUAT.default([0, 0, 0, 1]).describe(
    "Rotation quaternion [x, y, z, w]"
  ),
  scale: Tensor.VEC3.default([1, 1, 1]).describe(
    "Scale [x, y, z]"
  ),
});

/**
 * Visual properties common to renderable entities
 */
export const VisualProperties = z.object({
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
export const Hierarchical = z.object({
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
export const Bounds = z.object({
  min: Tensor.VEC3.describe("Minimum point [x, y, z]"),
  max: Tensor.VEC3.describe("Maximum point [x, y, z]"),
  center: Tensor.VEC3.optional().describe(
    "Center point [x, y, z]"
  ),
  size: Tensor.VEC3.optional().describe(
    "Size dimensions [width, height, depth]"
  ),
});

/**
 * Color value with different representation options
 */
export const Color = z.union([
  Tensor.VEC3.describe(
    "RGB color [r, g, b] with values 0-1"
  ),
  Tensor.VEC4.describe(
    "RGBA color [r, g, b, a] with values 0-1"
  ),
  z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i)
    .describe("Hex color string (e.g. #FF0000)"),
  z
    .string()
    .regex(/^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$/)
    .describe("RGB string (e.g. rgb(255, 0, 0))"),
]);

/**
 * Interpolation types for animation and curves
 */
export const InterpolationType = z.enum([
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
export const ExtrapolationType = z.enum([
  "constant", // Hold last/first value
  "linear", // Continue linear trend
  "cycle", // Repeat from beginning
  "cycleWithOffset", // Repeat with offset
  "oscillate", // Ping-pong back and forth
]);

/**
 * Material base definition with common properties
 */
export const MaterialBase = BaseEntity.extend({
  type: z
    .enum([
      "standard",
      "pbr",
      "lambert",
      "phong",
      "toon",
      "custom",
    ])
    .describe("Material type/shader model"),
  baseColor: Tensor.VEC4.default([1, 1, 1, 1]).describe(
    "Base color [r, g, b, a]"
  ),
  opacity: z
    .number()
    .min(0)
    .max(1)
    .default(1)
    .describe("Opacity factor"),
  alphaMode: z
    .enum(["OPAQUE", "MASK", "BLEND"])
    .default("OPAQUE")
    .describe("Alpha rendering mode"),
  alphaCutoff: z
    .number()
    .min(0)
    .max(1)
    .default(0.5)
    .describe("Alpha cutoff threshold"),
  doubleSided: z
    .boolean()
    .default(false)
    .describe("Whether material is rendered on both sides"),
});

/**
 * Node base definition for scene graph
 */
export const NodeBase = BaseEntity.extend({
  ...Transformable.shape,
  ...VisualProperties.shape,
  ...Hierarchical.shape,
});

/**
 * Constraint - Restriction on object movement (common across domains)
 */
export const Constraint = BaseEntity.extend({
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
 * IKChain - Inverse Kinematics system (used in both rigging and animation)
 */
export const IKChain = BaseEntity.extend({
  startId: z.string().describe("Start joint/bone ID"),
  endId: z.string().describe("End joint/bone ID"),
  solverType: z
    .enum(["ccd", "fabrik", "analytic", "spring"])
    .default("ccd")
    .describe("IK solver algorithm"),
  poleTargetId: z
    .string()
    .optional()
    .describe(
      "Pole vector target ID (for orientating the chain)"
    ),
  poleAngle: z
    .number()
    .default(0)
    .describe("Rotation around pole vector in degrees"),
  iterations: z
    .number()
    .int()
    .positive()
    .default(10)
    .describe("Solver iteration count"),
  tolerance: z
    .number()
    .positive()
    .default(0.001)
    .describe("Solver distance tolerance"),
  maintainRotation: z
    .boolean()
    .default(false)
    .describe("Whether to maintain end effector rotation"),
  stretchEnabled: z
    .boolean()
    .default(false)
    .describe(
      "Whether the chain can stretch beyond natural limits"
    ),
  maxStretchRatio: z
    .number()
    .min(1)
    .default(1.5)
    .describe("Maximum stretch ratio"),
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether IK chain is enabled"),
  influence: z
    .number()
    .min(0)
    .max(1)
    .default(1)
    .describe("Influence strength"),
});

/**
 * BlendShape - Per-vertex mesh deformation (used in both modeling and animation)
 */
export const BlendShape = BaseEntity.extend({
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
        positionDelta: Tensor.VEC3.describe(
          "Position offset"
        ),
        normalDelta: Tensor.VEC3.optional().describe(
          "Normal vector offset"
        ),
        tangentDelta: Tensor.VEC3.optional().describe(
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
export const Joint = NodeBase.extend({
  length: z
    .number()
    .nonnegative()
    .default(1)
    .describe("Length of the joint"),
  orientation: Tensor.QUAT.default([0, 0, 0, 1]).describe(
    "Local orientation for the joint"
  ),
  preferredRotationAxis: Tensor.VEC3.optional().describe(
    "Preferred axis for rotation (for resolving rotation ambiguity)"
  ),
});

/**
 * Pose - A stored set of transforms for joints/bones
 */
export const Pose = BaseEntity.extend({
  transforms: z
    .record(z.string(), Tensor.MAT4)
    .describe("Transforms by joint/bone ID (ID -> matrix)"),
  isBindPose: z
    .boolean()
    .default(false)
    .describe("Whether this is a bind/rest pose"),
});
