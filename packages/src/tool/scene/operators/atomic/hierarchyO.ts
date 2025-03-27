import { z } from "zod";
import { OperationResponse } from "../../../types/utils";

export const setParentO = {
  description: "Set parent for multiple objects",
  parameters: z.object({
    items: z
      .array(
        z.object({
          id: z.string().describe("Object identifier"),
          parentId: z
            .string()
            .nullable()
            .describe("Parent object ID (null to unparent)"),
        })
      )
      .describe("Parent assignments to make"),
    maintainWorldTransform: z
      .boolean()
      .default(true)
      .describe("Whether to preserve world transforms after reparenting"),
  }),
  returns: OperationResponse,
};

export const getChildrenO = {
  description: "Get all children of an object",
  parameters: z.object({
    id: z.string().describe("Parent object identifier"),
    recursive: z
      .boolean()
      .default(false)
      .describe("Whether to include all descendants"),
    typeFilter: z
      .array(z.string())
      .optional()
      .describe("Filter by object types"),
  }),
  returns: OperationResponse.extend({
    childIds: z.array(z.string()).describe("Child object IDs"),
  }),
};

export default { setParentO, getChildrenO };
