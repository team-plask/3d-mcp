import { z } from "zod";

/**
 * Common transformable object properties
 */
export const TransformC = z
  .object({
    position: z.array(z.number()).describe("Position in 3D space [x, y, z]"),
    rotation: z
      .array(z.number())
      .describe("Rotation quaternion in 3D space [x, y, z, w]"),
    scale: z.array(z.number()).describe("Scale factors in 3D space [x, y, z]"),
  })
  .describe("Common transformable object properties");
