import { z } from "zod";

/**
 * Data types for tensor values, aligned with glTF
 */
export const TensorType = z.enum([
  "SCALAR", // Single value
  "VEC2", // 2D vector
  "VEC3", // 3D vector
  "VEC4", // 4D vector
  "MAT2", // 2x2 matrix
  "MAT3", // 3x3 matrix
  "MAT4", // 4x4 matrix
  "QUAT", // Quaternion (extension)
]);
export type TensorType = z.infer<typeof TensorType>;

/**
 * Helper function to create tensor validators with correct typing
 */
const createTensorValidator = <
  T extends z.infer<typeof TensorType>
>(
  length: number,
  typeName: T
) =>
  z
    .array(z.number())
    .length(length)
    .refine((v) => v.length === length, {
      message: `Expected ${typeName} (length: ${length})`,
    });

/**
 * Validators for different tensor types
 */
export const tensorValidators = {
  SCALAR: z.number(),
  VEC2: createTensorValidator(2, "VEC2"),
  VEC3: createTensorValidator(3, "VEC3"),
  VEC4: createTensorValidator(4, "VEC4"),
  QUAT: createTensorValidator(4, "QUAT"),
  MAT2: createTensorValidator(4, "MAT2"),
  MAT3: createTensorValidator(9, "MAT3"),
  MAT4: createTensorValidator(16, "MAT4"),
};

/**
 * Union of all tensor validators
 */
export const tensorUnion = z.union([
  tensorValidators.SCALAR,
  tensorValidators.VEC2,
  tensorValidators.VEC3,
  tensorValidators.VEC4,
  tensorValidators.QUAT,
  tensorValidators.MAT2,
  tensorValidators.MAT3,
  tensorValidators.MAT4,
]);

export type TensorValue = z.infer<typeof tensorUnion>;

/**
 * Alpha blending modes aligned with glTF
 */
export const AlphaMode = z.enum([
  "OPAQUE",
  "MASK",
  "BLEND",
]);
export type AlphaMode = z.infer<typeof AlphaMode>;

/**
 * 3D transformation components aligned with glTF
 */
export const Transform = z.object({
  /**
   * Position vector [x, y, z]
   */
  translation: tensorValidators.VEC3.default([0, 0, 0]),

  /**
   * Rotation quaternion [x, y, z, w]
   */
  rotation: tensorValidators.QUAT.default([0, 0, 0, 1]),

  /**
   * Scale vector [x, y, z]
   */
  scale: tensorValidators.VEC3.default([1, 1, 1]),

  /**
   * Optional 4x4 transformation matrix
   */
  matrix: tensorValidators.MAT4.optional(),
});
export type Transform = z.infer<typeof Transform>;

/**
 * Axis-aligned bounding box
 */
export const Bounds = z.object({
  /**
   * Minimum corner point
   */
  min: tensorValidators.VEC3,

  /**
   * Maximum corner point
   */
  max: tensorValidators.VEC3,
});
export type Bounds = z.infer<typeof Bounds>;

/**
 * Material definition aligned with basic glTF concepts
 */
export const Material = z.object({
  /**
   * Unique identifier
   */
  id: z.string(),

  /**
   * Human-readable name
   */
  name: z.string().optional(),

  /**
   * Base color factor (RGBA)
   */
  baseColorFactor: tensorValidators.VEC4.default([
    1, 1, 1, 1,
  ]),

  /**
   * Base color texture reference
   */
  baseColorTexture: z.string().optional(),

  /**
   * Metallic factor (0-1)
   */
  metallicFactor: z.number().min(0).max(1).default(0),

  /**
   * Roughness factor (0-1)
   */
  roughnessFactor: z.number().min(0).max(1).default(1),

  /**
   * Normal map texture reference
   */
  normalTexture: z.string().optional(),

  /**
   * Emissive factor (RGB)
   */
  emissiveFactor: tensorValidators.VEC3.default([0, 0, 0]),

  /**
   * Emissive texture reference
   */
  emissiveTexture: z.string().optional(),

  /**
   * Alpha rendering mode
   */
  alphaMode: AlphaMode.default("OPAQUE"),

  /**
   * Alpha cutoff threshold
   */
  alphaCutoff: z.number().min(0).max(1).default(0.5),

  /**
   * Whether material is rendered on both sides
   */
  doubleSided: z.boolean().default(false),
});
export type Material = z.infer<typeof Material>;

/**
 * Scene node definition
 */
export const SceneNode = z.object({
  /**
   * Unique identifier
   */
  id: z.string(),

  /**
   * Human-readable name
   */
  name: z.string().default(""),

  /**
   * Transformation properties
   */
  transform: Transform.default({}),

  /**
   * Visibility flag
   */
  visible: z.boolean().default(true),

  /**
   * Parent node ID
   */
  parent: z.string().nullable().default(null),

  /**
   * Child node IDs
   */
  children: z.array(z.string()).default([]),

  /**
   * Associated mesh ID
   */
  mesh: z.string().optional(),

  /**
   * Associated material ID
   */
  material: z.string().optional(),

  /**
   * Associated camera ID
   */
  camera: z.string().optional(),

  /**
   * Associated light ID
   */
  light: z.string().optional(),

  /**
   * Custom properties
   */
  extras: z.record(z.unknown()).optional(),
});
export type SceneNode = z.infer<typeof SceneNode>;
