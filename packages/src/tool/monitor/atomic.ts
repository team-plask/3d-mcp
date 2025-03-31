import { _NodeBase, _OperationResponse } from "../core";
import { createExecutableTools } from "../core/request";
import { z } from "zod";
const monitorAtomicTools = {
  getQuadView: {
    description: "Get top, front, right, and perspective views of the scene.",
    parameters: z.object({
      shading_mode: z
        .enum(["WIREFRAME", "RENDERED", "SOLID", "MATERIAL"])
        .default("WIREFRAME")
        .describe("Shading mode for the viewports"),
      name_visibility_predicate: z
        .string()
        .optional()
        .describe(
          ` Function that takes an object as input and returns a dict with display settings. See example below.`
        ),
      auto_adjust_camera: z
        .boolean()
        .default(true)
        .describe("Automatically adjust camera to fit the scene"),
    }),
    returns: _OperationResponse.extend({
      image_path: z
        .array(z.string())
        .describe("Paths to the images of the quad view"),
    }),
  },
  getSceneGraph: {
    description: "Get the scene graph of the current scene.",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      scene_graph: z
        .object({
          name: z.string(),
          children: z.array(_NodeBase),
        })
        .describe("Scene graph of the current scene"),
    }),
  },
} as const;

export type MonitorAtomicTool = typeof monitorAtomicTools;
const monitorAtomicToolsWithExecute = createExecutableTools(monitorAtomicTools);

export { monitorAtomicToolsWithExecute };
