import { z } from "zod";
import { OperationResponse } from "./entity";

/**
 * Factory function to generate CRUD operations for any entity
 * Includes both single and batch operations for efficiency
 */
function createCrudOperations<T extends z.ZodType>(
  entityName: string,
  entitySchema: T,
  additionalOperations: Record<string, any> = {}
) {
  const pascalCase =
    entityName.charAt(0).toUpperCase() +
    entityName.slice(1);
  const pluralName = entityName.endsWith("y")
    ? `${entityName.slice(0, -1)}ies`
    : `${entityName}s`;

  // Standard CRUD operations with batch support
  const operations = {
    [`create${pascalCase}s`]: {
      description: `Create multiple ${pluralName}`,
      parameters: z.object({
        items: z
          .array(entitySchema.omit({ id: true }))
          .describe(`Array of ${pluralName} to create`),
      }),
      returns: OperationResponse.extend({
        [`${entityName}Ids`]: z
          .array(z.string())
          .describe(`IDs of the created ${pluralName}`),
      }),
    },

    [`get${pascalCase}s`]: {
      description: `Get multiple ${pluralName} by IDs`,
      parameters: z.object({
        [`${entityName}Ids`]: z
          .array(z.string())
          .describe(`${pascalCase} identifiers`),
      }),
      returns: OperationResponse.extend({
        [pluralName]: z
          .array(entitySchema)
          .describe(`The requested ${pluralName} data`),
      }),
    },

    [`list${pascalCase}s`]: {
      description: `List all ${pluralName}`,
      parameters: z.object({
        parentId: z
          .string()
          .optional()
          .describe(`Optional parent ID to filter by`),
        filters: z
          .record(z.string(), z.any())
          .optional()
          .describe(`Optional filters to apply`),
        limit: z
          .number()
          .int()
          .positive()
          .optional()
          .describe(`Maximum number of results`),
        offset: z
          .number()
          .int()
          .nonnegative()
          .optional()
          .describe(`Starting offset for pagination`),
      }),
      returns: OperationResponse.extend({
        [pluralName]: z
          .array(entitySchema)
          .describe(`List of ${pluralName}`),
        totalCount: z
          .number()
          .int()
          .nonnegative()
          .optional()
          .describe(`Total count for pagination`),
      }),
    },

    [`update${pascalCase}s`]: {
      description: `Update multiple ${pluralName} in a single operation`,
      parameters: z.object({
        items: z
          .array(
            z
              .object({
                [`${entityName}Id`]: z
                  .string()
                  .describe(`${pascalCase} identifier`),
              })
              .merge(
                entitySchema.partial().omit({ id: true })
              )
          )
          .describe(
            `Array of ${pluralName} to update with their IDs`
          ),
      }),
      returns: OperationResponse,
    },

    [`delete${pascalCase}s`]: {
      description: `Delete multiple ${pluralName}`,
      parameters: z.object({
        [`${entityName}Ids`]: z
          .array(z.string())
          .describe(`${pascalCase} identifiers to delete`),
      }),
      returns: OperationResponse,
    },
  };

  // Merge with additional operations
  return { ...operations, ...additionalOperations };
}

export { createCrudOperations };
