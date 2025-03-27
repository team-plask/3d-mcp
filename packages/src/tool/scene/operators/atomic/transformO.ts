import { z } from "zod";
import { OperationResponse } from "../../../types/utils";
import { TransformC } from "../../components/transformC";

export const transformO = {
  description:
    "Applies a transformation to entities having a transform component",
  parameters: z.object({
    targets: z
      .array(z.string())
      .describe("Array of entities having a transform component"),
    value: TransformC.partial().describe("Transformations to apply"),
    deltaMode: z
      .boolean()
      .optional()
      .describe("If true, value is treated as a delta"),
    space: z
      .enum(["local", "world", "parent"])
      .default("world")
      .describe("Coordinate space for the transformation"),
  }),
  returns: OperationResponse.extend({
    results: z.array(z.string()).describe("IDs of matching entities"),
  }),
};

export default { transformO };
