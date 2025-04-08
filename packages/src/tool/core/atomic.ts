import { z } from "zod";
import { createExecutableTools } from "./request";
import { _OperationResponse, _Tensor } from "./entity";

/**
 * Core atomic tools that provide fundamental operations applicable across domains
 */
const coreAtomicTools = {
  // Selection Operations
  select: {
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
    returns: _OperationResponse.extend({
      selectedIds: z
        .array(z.string())
        .describe("All selected object IDs after operation"),
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
    returns: _OperationResponse,
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
    returns: _OperationResponse.extend({
      selectedIds: z
        .array(z.string())
        .describe("Currently selected object IDs"),
    }),
  },

  transformObjects: {
    description: "Apply transformations to multiple objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            position: _Tensor.VEC3.optional().describe(
              "New absolute position [x, y, z]"
            ),
            rotation: _Tensor.QUAT.optional().describe(
              "New absolute rotation quaternion [x, y, z, w]"
            ),
            scale: _Tensor.VEC3.optional().describe(
              "New absolute scale [x, y, z]"
            ),
            positionOffset: _Tensor.VEC3.optional().describe(
              "Relative position offset to apply [dx, dy, dz]"
            ),
            rotationOffset: _Tensor.QUAT.optional().describe(
              "Relative rotation to apply as quaternion [x, y, z, w]"
            ),
            scaleOffset: _Tensor.VEC3.optional().describe(
              "Relative scale to apply [sx, sy, sz]"
            ),
            space: z
              .enum(["local", "world", "parent"])
              .default("world")
              .describe("Coordinate space for the transformation"),
          })
        )
        .describe("Transformations to apply"),
    }),
    returns: _OperationResponse,
  },

  setParentObjects: {
    description: "Set parent for multiple objects",
    parameters: z.object({
      items: z
        .array(
          z.object({
            id: z.string().describe("Object identifier"),
            parentId: z
              .string()
              .nullable()
              .describe("Parent object ID (null to unparent)"),
          })
        )
        .describe("Parent assignments to make"),
      maintainWorldTransform: z
        .boolean()
        .default(true)
        .describe("Whether to preserve world transforms after reparenting"),
    }),
    returns: _OperationResponse,
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
    returns: _OperationResponse.extend({
      childIds: z.array(z.string()).describe("Child object IDs"),
    }),
  },

  duplicate: {
    description: "Duplicate an object",
    parameters: z.object({
      id: z.string().describe("Source object identifier"),
      newName: z.string().optional().describe("Name for the duplicated object"),
      duplicateChildren: z
        .boolean()
        .default(true)
        .describe("Whether to duplicate children"),
      duplicateDependencies: z
        .boolean()
        .default(false)
        .describe("Whether to duplicate dependencies (materials, etc.)"),
    }),
    returns: _OperationResponse.extend({
      newId: z.string().describe("ID of the duplicated object"),
      childIds: z
        .array(z.string())
        .optional()
        .describe("IDs of duplicated children if applicable"),
    }),
  },

  // Query and filtering
  query: {
    description: "Query entities based on criteria",
    parameters: z.object({
      type: z.string().optional().describe("Entity type to filter by"),
      properties: z
        .record(z.string(), z.any())
        .optional()
        .describe(
          "Property values to match (path -> value). Skip to get all entities of the type"
        ),
    }),
    returns: _OperationResponse.extend({
      results: z.array(z.string()).describe("IDs of matching entities"),
    }),
  },

  // State and undo/redo
  undo: {
    description: "Undo the last operation",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      operationName: z
        .string()
        .optional()
        .describe("Name of the undone operation"),
    }),
  },

  redo: {
    description: "Redo the previously undone operation",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      operationName: z
        .string()
        .optional()
        .describe("Name of the redone operation"),
    }),
  },
} as const;

export type CoreTool = keyof typeof coreAtomicTools;

const coreAtomicToolsWithExecute = createExecutableTools(coreAtomicTools);

export { coreAtomicToolsWithExecute };
