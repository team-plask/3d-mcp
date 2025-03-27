import { z } from "zod";

/**
 * Hierarchical object properties
 */
export const HierarchyC = z
  .object({
    parentId: z.string().optional().describe("Parent object ID"),
    childIds: z.array(z.string()).default([]).describe("Child object IDs"),
  })
  .describe("Hierarchical object properties");
