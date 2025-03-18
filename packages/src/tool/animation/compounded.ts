import { z } from "zod";
import {
  AnimationPlaybackAction,
  AnimationPathType,
  KeyframeInput,
  OperationResponse,
} from "./type";
import { TensorType } from "../core/type";
import { animationAtomicToolsWithExecute } from "./atomic";
import { defineCompoundTool } from "../core/request";

// Define the createAnimationWithKeyframes schema
const createAnimationWithKeyframesParams = z.object({
  name: z.string(),
  duration: z.number().nonnegative(),
  loop: z.boolean().optional(),
  nodeId: z.string(),
  path: AnimationPathType,
  customPath: z.string().optional(),
  valueType: TensorType,
  keyframes: z.array(KeyframeInput),
  autoPlay: z.boolean().optional().default(false),
});

const createAnimationWithKeyframesReturns =
  OperationResponse.extend({
    clipId: z.string(),
    channelIndex: z.number(),
  });

// Define the blendAnimations schema
const blendAnimationsParams = z.object({
  fromClipId: z.string(),
  toClipId: z.string(),
  blendDuration: z.number().positive(),
  blendLayerName: z
    .string()
    .optional()
    .default("BlendedAnimation"),
});

const blendAnimationsReturns = OperationResponse.extend({
  layerId: z.string(),
});

const animationCompoundedTools = {
  /**
   * Create animation and immediately add keyframes
   */
  createAnimationWithKeyframes: defineCompoundTool({
    description:
      "Create a new animation and immediately add keyframes to it",
    parameters: createAnimationWithKeyframesParams,
    returns: createAnimationWithKeyframesReturns,
    execute: async (
      params
    ): Promise<
      z.infer<typeof createAnimationWithKeyframesReturns>
    > => {
      console.log(
        "Creating animation with keyframes",
        params
      );

      return {
        clipId: "",
        channelIndex: 0,
        success: false,
      };
    },
  }),

  /**
   * Blend between two animations over time
   */
  blendAnimations: defineCompoundTool({
    description:
      "Create a smooth transition blend between two animations",
    parameters: blendAnimationsParams,
    returns: blendAnimationsReturns,
    execute: async (
      params
    ): Promise<z.infer<typeof blendAnimationsReturns>> => {
      const { clipId, channelIndex } =
        await tool.createAnimationWithKeyframes.execute({
          name: params.blendLayerName,
          duration: params.blendDuration,
          loop: false,
          nodeId: "",
        });
      console.log(
        "Blending animations",
        params.fromClipId,
        params.toClipId,
        params.blendDuration
      );

      return {
        layerId: "",
        success: false,
      };
    },
  }),
} as const;

const tool = {
  ...animationAtomicToolsWithExecute,
  ...animationCompoundedTools,
};

export { animationCompoundedTools };
