import { z } from "zod";

/**
 * Scene object properties
 */
export const SceneObjectC = z
  .object({
    selectable: z.boolean().default(true).describe("Object selectable status"),
    visible: z.boolean().default(true).describe("Object visibility status"),
    duplicable: z.boolean().default(true).describe("Object duplicable status"),
  })
  .describe("Scene object properties");
