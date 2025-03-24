import { z } from "zod";
import { createExecutableTools } from "./request";
import { OperationResponse, Tensor } from "./entity";

/**
 * Core atomic tools that provide fundamental operations applicable across domains
 */
const coreAtomicTools = {
  // Selection Operations
  select: {
    description: "Select one or more objects",
    parameters: z.object({
      ids: z
        .array(z.string())
        .describe("Object identifiers to select"),
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
        .describe(
          "All selected object IDs after operation"
        ),
    }),
  },

  clearSelection: {
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
  },

  getSelection: {
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
      selectedIds: z
        .array(z.string())
        .describe("Currently selected object IDs"),
    }),
  },

  batchTransform: {
    description:
      "Apply transformations to multiple objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            position: Tensor.VEC3.optional().describe(
              "New absolute position [x, y, z]"
            ),
            rotation: Tensor.QUAT.optional().describe(
              "New absolute rotation quaternion [x, y, z, w]"
            ),
            scale: Tensor.VEC3.optional().describe(
              "New absolute scale [x, y, z]"
            ),
            positionOffset: Tensor.VEC3.optional().describe(
              "Relative position offset to apply [dx, dy, dz]"
            ),
            rotationOffset: Tensor.QUAT.optional().describe(
              "Relative rotation to apply as quaternion [x, y, z, w]"
            ),
            scaleOffset: Tensor.VEC3.optional().describe(
              "Relative scale to apply [sx, sy, sz]"
            ),
            space: z
              .enum(["local", "world", "parent"])
              .default("world")
              .describe(
                "Coordinate space for the transformation"
              ),
          })
        )
        .describe("Transformations to apply"),
    }),
    returns: OperationResponse,
  },

  batchSetParent: {
    description: "Set parent for multiple objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            parentId: z
              .string()
              .nullable()
              .describe(
                "Parent object ID (null to unparent)"
              ),
          })
        )
        .describe("Parent assignments to make"),
      maintainWorldTransform: z
        .boolean()
        .default(true)
        .describe(
          "Whether to preserve world transforms after reparenting"
        ),
    }),
    returns: OperationResponse,
  },

  getChildren: {
    description: "Get all children of an object",
    parameters: z.object({
      id: z.string().describe("Parent object identifier"),
      recursive: z
        .boolean()
        .default(false)
        .describe("Whether to include all descendants"),
      typeFilter: z
        .array(z.string())
        .optional()
        .describe("Filter by object types"),
    }),
    returns: OperationResponse.extend({
      childIds: z
        .array(z.string())
        .describe("Child object IDs"),
    }),
  },

  batchSetProperty: {
    description: "Set properties on multiple objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            entries: z
              .array(
                z.object({
                  propertyPath: z
                    .array(z.string())
                    .describe("Property path to set"),
                  value: z.any().describe("Value to set"),
                })
              )
              .describe("Property entries to set"),
          })
        )
        .describe("Property assignments to make"),
    }),
    returns: OperationResponse,
  },

  batchGetProperty: {
    description:
      "Get property values from multiple objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            propertyPath: z
              .array(z.string())
              .describe(
                "List of property paths to retrieve"
              ),
          })
        )
        .describe("Property requests to make"),
      recursive: z
        .boolean()
        .default(false)
        .describe("Whether to include all descendants"),
    }),
    returns: OperationResponse.extend({
      values: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            propertyPath: z
              .string()
              .describe("Path to the property"),
            value: z.any().describe("Property value"),
          })
        )
        .describe("Property values retrieved"),
    }),
  },

  duplicate: {
    description: "Duplicate an entity",
    parameters: z.object({
      id: z.string().describe("Source entity identifier"),
      newName: z
        .string()
        .optional()
        .describe("Name for the duplicated entity"),
      duplicateChildren: z
        .boolean()
        .default(true)
        .describe("Whether to duplicate children"),
      duplicateDependencies: z
        .boolean()
        .default(false)
        .describe(
          "Whether to duplicate dependencies (materials, etc.)"
        ),
    }),
    returns: OperationResponse.extend({
      newId: z
        .string()
        .describe("ID of the duplicated entity"),
      childIds: z
        .array(z.string())
        .optional()
        .describe(
          "IDs of duplicated children if applicable"
        ),
    }),
  },

  // Query and filtering
  query: {
    description: "Query entities based on criteria",
    parameters: z.object({
      type: z
        .string()
        .optional()
        .describe("Entity type to filter by"),
      properties: z
        .record(z.string(), z.any())
        .optional()
        .describe(
          "Property values to match (path -> value)"
        ),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(z.string())
        .describe("IDs of matching entities"),
    }),
  },

  // State and undo/redo
  undo: {
    description: "Undo the last operation",
    parameters: z.object({}),
    returns: OperationResponse.extend({
      operationName: z
        .string()
        .optional()
        .describe("Name of the undone operation"),
    }),
  },

  redo: {
    description: "Redo the previously undone operation",
    parameters: z.object({}),
    returns: OperationResponse.extend({
      operationName: z
        .string()
        .optional()
        .describe("Name of the redone operation"),
    }),
  },
} as const;

export type CoreTool = keyof typeof coreAtomicTools;

const coreAtomicToolsWithExecute =
  createExecutableTools(coreAtomicTools);

export { coreAtomicToolsWithExecute };
