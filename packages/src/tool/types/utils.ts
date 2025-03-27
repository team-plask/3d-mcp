import { z } from "zod";

/**
 * Standard operation response
 */
export const OperationResponse = z.object({
  success: z.boolean().describe("Operation success status"),
});
