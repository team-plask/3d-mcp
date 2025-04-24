import { _NodeBase, _OperationResponse } from "../core";
import { createExecutableTools } from "../core/request";
import { z } from "zod";
const monitorAtomicTools = {
  // getCameraView: {
  //   description:
  //     "Get a customizable view of the 3D scene from any camera angle.",
  //   parameters: z.object({
  //     shading_mode: z
  //       .enum([
  //         "WIREFRAME",
  //         "RENDERED",
  //         "SOLID",
  //         "MATERIAL",
  //       ])
  //       .default("WIREFRAME")
  //       .describe(
  //         "Rendering style for the viewport (WIREFRAME: line rendering, SOLID: basic shading, MATERIAL: with materials, RENDERED: fully rendered)"
  //       ),
  //     name_visibility_predicate: z
  //       .string()
  //       .optional()
  //       .describe(
  //         'Python lambda function that takes an object as input and returns display settings (e.g., \'lambda obj: {"show_name": obj.type == "MESH"}\')'
  //       ),
  //     auto_adjust_camera: z
  //       .boolean()
  //       .default(true)
  //       .describe(
  //         "When true, automatically positions the camera to frame all scene objects"
  //       ),
  //     perspective: z
  //       .union([
  //         z.enum(["TOP", "FRONT", "RIGHT", "PERSP"]),
  //         z.object({
  //           type: z.enum(["PERSP", "ORTHO"]),
  //           rotation: z
  //             .array(z.number())
  //             .length(4)
  //             .describe(
  //               "Camera rotation as quaternion (w,x,y,z)"
  //             ),
  //           location: z
  //             .array(z.number())
  //             .length(3)
  //             .optional()
  //             .describe(
  //               "Camera position as (x,y,z) coordinates"
  //             ),
  //         }),
  //       ])
  //       .default("FRONT")
  //       .describe(
  //         "Predefined view angle (TOP/FRONT/RIGHT/PERSP) or custom camera configuration"
  //       ),
  //   }),
  //   returns: _OperationResponse.extend({
  //     image_path: z
  //       .array(z.string())
  //       .describe("File paths to the generated image"),
  //   }),
  // },
  getSceneGraph: {
    description:
      "Get the scene graph of the current scene.",
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
const monitorAtomicToolsWithExecute = createExecutableTools(
  monitorAtomicTools
);

export { monitorAtomicToolsWithExecute };
