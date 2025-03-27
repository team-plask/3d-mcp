import { z } from "zod";
import { OperationResponse } from "../../../types/utils";

export const setSelectionO = {
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

export const clearSelectionO = {
  description: "Clear current selection",
  parameters: z.object({
    domain: z
      .string()
      .optional()
      .describe(
        "Optional domain to restrict clearing (e.g., 'mesh', 'animation')"
      ),
  }),
  returns: OperationResponse,
};

export const getSelectionO = {
  description: "Get currently selected objects",
  parameters: z.object({
    domain: z
      .string()
      .optional()
      .describe(
        "Optional domain to filter results (e.g., 'mesh', 'animation')"
      ),
  }),
  returns: OperationResponse.extend({
    selectedIds: z.array(z.string()).describe("Currently selected object IDs"),
  }),
};

export default { setSelectionO, clearSelectionO, getSelectionO };
