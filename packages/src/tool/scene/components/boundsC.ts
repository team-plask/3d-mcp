import { z } from "zod";
import { Tensor } from "../../types/tensor";

/**
 * Bounds - Axis-aligned bounding box
 */
export const BoundsC = z
  .object({
    min: Tensor.VEC3.describe("Minimum point [x, y, z]"),
    max: Tensor.VEC3.describe("Maximum point [x, y, z]"),
    center: Tensor.VEC3.optional().describe("Center point [x, y, z]"),
    size: Tensor.VEC3.optional().describe(
      "Size dimensions [width, height, depth]"
    ),
  })
  .describe("Axis-aligned bounding box (AABB)");
