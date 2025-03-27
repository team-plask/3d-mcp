import { set, z } from "zod";
import { OperationResponse } from "../../../types/utils";

export const setPropertyO = {
  description: "Set properties on multiple objects",
  parameters: z.object({
    items: z
      .array(
        z.object({
          id: z.string().describe("Object identifier"),
          entries: z
            .array(
              z.object({
                propertyPath: z
                  .array(z.string())
                  .describe("Property path to set"),
                value: z.any().describe("Value to set"),
              })
            )
            .describe("Property entries to set"),
        })
      )
      .describe("Property assignments to make"),
  }),
  returns: OperationResponse,
};

export const getPropertyO = {
  description: "Get property values from multiple objects",
  parameters: z.object({
    items: z
      .array(
        z.object({
          id: z.string().describe("Object identifier"),
          propertyPath: z
            .array(z.string())
            .describe("List of property paths to retrieve"),
        })
      )
      .describe("Property requests to make"),
    recursive: z
      .boolean()
      .default(false)
      .describe("Whether to include all descendants"),
  }),
  returns: OperationResponse.extend({
    values: z
      .array(
        z.object({
          id: z.string().describe("Object identifier"),
          propertyPath: z.string().describe("Path to the property"),
          value: z.any().describe("Property value"),
        })
      )
      .describe("Property values retrieved"),
  }),
};

export const duplicateO = {
  description: "Duplicate an entity",
  parameters: z.object({
    id: z.string().describe("Source entity identifier"),
    newName: z.string().optional().describe("Name for the duplicated entity"),
    duplicateChildren: z
      .boolean()
      .default(true)
      .describe("Whether to duplicate children"),
    duplicateDependencies: z
      .boolean()
      .default(false)
      .describe("Whether to duplicate dependencies (materials, etc.)"),
  }),
  returns: OperationResponse.extend({
    newId: z.string().describe("ID of the duplicated entity"),
    childIds: z
      .array(z.string())
      .optional()
      .describe("IDs of duplicated children if applicable"),
  }),
};

export default { setPropertyO, getPropertyO, duplicateO };
