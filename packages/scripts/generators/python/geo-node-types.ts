import * as fs from "fs";
import { z } from "zod";

// Read the JSON file
const jsonFilePath = "output.json";
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

// Parse the JSON and generate the Zod type
const allTypes = Object.entries(jsonData).map(([key, value]: [string, any]) => {
  return z.object({
    type: z.literal(`${value.category}${value.struct_name}`),
    inputs: z.array(
      z.object({
        type: z.string().transform((t) => t.replace("decl::", "")),
        description: z.string(),
        name: z.string(),
      })
    ),
  });
});
export const zodSchema =
  allTypes.length > 1
    ? z.union(
        allTypes as [
          (typeof allTypes)[0],
          (typeof allTypes)[1],
          ...typeof allTypes
        ]
      )
    : allTypes.length === 1
    ? allTypes[0]
    : z.never(); // Handle the case where there are no types
