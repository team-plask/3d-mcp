import { z } from "zod";
import { OperationResponse } from "../../../types/utils";

export const SelectOC = {
  description: "Select one or more objects",
  parameters: z.object({
    ids: z.array(z.string()).describe("Object identifiers to select"),
    mode: z
      .enum(["replace", "add", "remove", "toggle"])
      .default("replace")
      .describe("Selection mode operation"),
    domain: z
      .string()
      .optional()
      .describe(
        "Optional domain to restrict selection (e.g., 'mesh', 'animation')"
      ),
  }),
  returns: OperationResponse.extend({
    selectedIds: z
      .array(z.string())
      .describe("All selected object IDs after operation"),
  }),
};
