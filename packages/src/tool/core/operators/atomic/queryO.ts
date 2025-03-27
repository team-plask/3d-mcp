import { z } from "zod";
import { OperationResponse } from "../../../types/utils";

export const queryByComponentsO = {
  description: "Query entities based on components and properties predicates",
  parameters: z.object({
    components: z.array(z.string()).describe("Components that the entity owns"),
    properties: z
      .array(z.record(z.string(), z.any()))
      .optional()
      .describe(
        "Property values to match (path -> value) for each component. Optional, only set a value is you want to filter by properties"
      ),
  }),
  returns: OperationResponse,
};

export default { queryByComponentsO };
