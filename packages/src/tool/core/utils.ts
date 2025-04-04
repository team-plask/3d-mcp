import { z } from "zod";
import { _OperationResponse } from "./entity";
import { entities } from "..";

type Domains = keyof typeof entities;
type EntitySchemas = (typeof entities)[Domains];

type CombinedCrudOperations<
  T extends Record<string, z.ZodTypeAny>
> = {
  [K in keyof T as `create${Capitalize<string & K>}s`]: {
    description: string;
    parameters: z.ZodObject<{
      items: z.ZodArray<T[K], "many">;
    }>;
    returns: z.ZodObject<{
      ids: z.ZodArray<z.ZodString>;
    }>;
  };
} & {
  [K in keyof T as `get${Capitalize<string & K>}s`]: {
    description: string;
    parameters: z.ZodObject<{
      ids: z.ZodArray<z.ZodString>;
    }>;
    returns: z.ZodObject<{
      ids: z.ZodArray<z.ZodString>;
    }>;
  };
} & {
  [K in keyof T as `list${Capitalize<string & K>}s`]: {
    description: string;
    parameters: z.ZodObject<{
      parentId: z.ZodTypeAny;
      filters: z.ZodTypeAny;
      limit: z.ZodTypeAny;
      offset: z.ZodTypeAny;
    }>;
    returns: z.ZodObject<{
      items: z.ZodArray<T[K], "many">;
      totalCount: z.ZodTypeAny;
    }>;
  };
} & {
  [K in keyof T as `update${Capitalize<string & K>}s`]: {
    description: string;
    parameters: z.ZodObject<{
      items: z.ZodArray<T[K], "many">;
    }>;
    returns: z.ZodObject<{
      success: z.ZodBoolean;
    }>;
  };
} & {
  [K in keyof T as `delete${Capitalize<string & K>}s`]: {
    description: string;
    parameters: z.ZodObject<{
      ids: z.ZodArray<z.ZodString>;
    }>;
    returns: z.ZodObject<{
      success: z.ZodBoolean;
    }>;
  };
};

function createCrudOperations<T extends EntitySchemas>(
  entities: Partial<T>
) {
  const operations = {} as CombinedCrudOperations<T>;

  Object.entries(entities).forEach(
    ([entityName, entitySchema]) => {
      const pascalCase = (entityName
        .charAt(0)
        .toUpperCase() + entityName.slice(1)) as keyof T;
      const pluralName = entityName.endsWith("y")
        ? `${entityName.slice(0, -1)}ies`
        : `${entityName}s`;

      // Create operation
      operations[`create${pascalCase}s`] = {
        description: `Create multiple ${pluralName}`,
        parameters: z.object({
          items: z
            .array(entitySchema.omit({ id: true }))
            .describe(`Array of ${pluralName} to create`),
        }),
        returns: _OperationResponse.extend({
          ids: z
            .array(z.string())
            .describe(`IDs of the created ${pluralName}`),
        }),
      };

      // Get operation
      operations[`get${pascalCase}s`] = {
        description: `Get multiple ${pluralName} by IDs`,
        parameters: z.object({
          ids: z
            .array(z.string())
            .describe(`${pascalCase} identifiers`),
        }),
        returns: _OperationResponse.extend({
          items: z
            .array(entitySchema)
            .describe(`Array of ${pluralName} objects`),
        }),
      };

      // List operation
      operations[`list${pascalCase}s`] = {
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
        returns: _OperationResponse.extend({
          items: z
            .array(entitySchema)
            .describe(`Array of ${pluralName} objects`),
          totalCount: z
            .number()
            .int()
            .nonnegative()
            .optional()
            .describe(`Total count for pagination`),
        }),
      };

      // Update operation
      operations[`update${pascalCase}s`] = {
        description: `Update multiple ${pluralName} in a single operation`,
        parameters: z.object({
          items: z
            .array(
              z
                .object({
                  ids: z
                    .array(z.string())
                    .describe(
                      `${pascalCase} identifiers to update`
                    ),
                })
                .merge(
                  entitySchema.partial().omit({ id: true })
                )
            )
            .describe(
              `Array of ${pluralName} to update with their IDs`
            ),
        }),
        returns: _OperationResponse,
      };

      // Delete operation
      operations[`delete${pascalCase}s`] = {
        description: `Delete multiple ${pluralName}`,
        parameters: z.object({
          ids: z
            .array(z.string())
            .describe(
              `${pascalCase} identifiers to delete`
            ),
        }),
        returns: _OperationResponse,
      };
    }
  );

  return operations as CombinedCrudOperations<T>;
}

export { createCrudOperations };
