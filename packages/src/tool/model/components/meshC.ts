import { z } from "zod";

export const MeshC = z
  .object({
    vertices: z.array(z.number()).describe("List of vertices [x, y, z]"),
    normals: z
      .array(z.number())
      .optional()
      .describe("List of vertex normals [x, y, z]"),
    uvs: z
      .array(z.number())
      .optional()
      .describe("List of UV coordinates [u, v]"),
    indices: z
      .array(z.array(z.number()))
      .describe(
        "List of polygon indices. N-gons are supported, so each element of this array is an array of numbers representing the vertex indices of a polygon."
      ),
  })
  .describe("Geometry mesh data");
