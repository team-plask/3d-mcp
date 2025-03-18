import { z } from "zod";
import { createExecutableTools } from "../core/request";

const renderAtomicTools = {
  test: {
    description: "Test tool",
    parameters: z.object({}),
    returns: z
      .object({
        success: z.boolean(),
      })
      .optional(),
  },
} as const;

const renderAtomicToolsWithExecute = createExecutableTools(
  renderAtomicTools
);

export { renderAtomicToolsWithExecute };
