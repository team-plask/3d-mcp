import { z } from "zod";
import { OperationResponse } from "../../../types/utils";

// State and undo/redo
export const undoO = {
  description: "Undo the last operation",
  parameters: z.object({}),
  returns: OperationResponse.extend({
    operationName: z
      .string()
      .optional()
      .describe("Name of the undone operation"),
  }),
};

export const redoO = {
  description: "Redo the previously undone operation",
  parameters: z.object({}),
  returns: OperationResponse.extend({
    operationName: z
      .string()
      .optional()
      .describe("Name of the redone operation"),
  }),
};

export default { undoO, redoO };
