import { z } from "zod";
import { createExecutableTools } from "./request";
import { _OperationResponse, _Tensor } from "./entity";

/**
 * Core atomic tools that provide fundamental operations applicable across domains
 */
const coreAtomicTools = {
  // Selection Operations
  select: {
    description: "Set the current selection",
    parameters: z.object({
      ids: z
        .array(z.string())
        .describe(
          "Identifiers to select. Points to different kinds of structures, depending on the domain. Give an empty array to clear the selection."
        ),
      mode: z
        .enum(["replace", "add", "remove", "toggle"])
        .default("replace")
        .describe(
          "Selection mode operation, can be 'replace', 'add', 'remove' or 'toggle'. Default is 'replace'"
        ),
      domain: z
        .enum(["object", "geometry", "material"])
        .default("object")
        .optional()
        .describe(
          "Selection domain, can be 'object', 'geometry' or 'material'. Default is 'object'"
        ),
      subtype: z
        .enum(["vertex", "edge", "face"])
        .default("face")
        .optional()
        .describe(
          "Subtype for selection. Only relevant for geometry domain. Can be 'vertex', 'edge' or 'face'. Default is 'face'"
        ),
    }),
    returns: _OperationResponse.extend({
      selectedIds: z
        .array(z.string())
        .describe("All selected object IDs after operation"),
    }),
  },
  // getSelection: {
  //   description: "Get currently selected objects",
  //   parameters: z.object({
  //     domain: z
  //       .string()
  //       .optional()
  //       .describe(
  //         "Optional domain to filter results (e.g., 'mesh', 'animation')"
  //       ),
  //   }),
  //   returns: _OperationResponse.extend({
  //     selectedIds: z
  //       .array(z.string())
  //       .describe("Currently selected object IDs"),
  //   }),
  // },

  transform: {
    description:
      "Apply transformations (translate, rotate, scale) to selected elements",
    parameters: z.object({
      translation: z
        .array(z.number())
        .length(3)
        .optional()
        .describe("Translation vector"),
      rotation: z
        .array(z.number())
        .length(3)
        .optional()
        .describe("Rotation vector (Euler angles). Order is XYZ"),
      scale: z
        .array(z.number())
        .length(3)
        .optional()
        .describe("Scaling vector"),
      proportional: z
        .object({
          radius: z
            .number()
            .optional()
            .describe("Radius for proportional editing"),
        })
        .optional()
        .describe(
          "Proportional edition options. If not provided, proportional editing is disabled."
        ),
    }),
    returns: _OperationResponse,
  },
  delete: {
    description:
      "Deletes the current selection. Additional optional type can be provided to filter the deletion",
    parameters: z.object({
      type: z
        .enum(["vertex", "edge", "face", "only_faces", "only_edges_and_faces"])
        .optional()
        .default("face")
        .describe(
          "Type of elements to delete. Only relevant for geometry domain, when a mesh is being edited. Can be 'vertex', 'edge', 'face', 'only_faces' or 'only_edges_and_faces'"
        ),
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
