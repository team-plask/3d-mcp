import { z } from "zod";

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
    .describe(`${typeName} tensor with ${length} components`);

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
    .array(z.number())
    .describe("Generic tensor value (scalar, vector, matrix, or object)"),
};
