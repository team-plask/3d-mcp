import { z } from "zod";
import {
  InterpolationMethod,
  AnimationPlaybackAction,
  AnimationPathType,
  KeyframeOperationBase,
  KeyframeInput,
  OperationResponse,
} from "./type";
import { TensorType } from "../core/type";
import { createExecutableTools } from "../core/request";

const animationAtomicTools = {
  /**
   * Insert multiple keyframes in a batch operation
   */
  insertKeyframes: {
    description:
      "Insert multiple keyframes in a single batch operation",
    parameters: KeyframeOperationBase.extend({
      keyframes: z
        .array(KeyframeInput)
        .describe("Array of keyframes to insert"),
    }),
    returns: OperationResponse.extend({
      keyframeIndices: z
        .array(z.number())
        .describe("Indices of the inserted keyframes"),
    }),
  },

  /**
   * Remove keyframes from an animation channel
   */
  removeKeyframes: {
    description:
      "Remove a keyframe from an animation channel",
    parameters: KeyframeOperationBase.extend({
      keyframeIndex: z
        .array(z.number().int().nonnegative())
        .describe("Indexes of the keyframes to remove"),
    }),
    returns: OperationResponse,
  },

  /**
   * Create a new animation channel
   */
  createChannel: {
    description: "Create a new animation channel",
    parameters: z.object({
      clipId: z
        .string()
        .describe("Animation clip identifier"),
      nodeId: z.string().describe("Target node identifier"),
      path: AnimationPathType.describe(
        "Standard property path to animate"
      ),
      customPath: z
        .string()
        .optional()
        .describe("Custom property path if using 'custom'"),
      type: TensorType.describe(
        "Type of the animated property"
      ),
    }),
    returns: OperationResponse.extend({
      channelIndex: z
        .number()
        .describe("Index of the created channel"),
    }),
  },

  /**
   * Create a new animation clip
   */
  createClip: {
    description: "Create a new animation clip",
    parameters: z.object({
      name: z
        .string()
        .describe("Name of the animation clip"),
      duration: z
        .number()
        .nonnegative()
        .describe("Duration in seconds"),
      loop: z
        .boolean()
        .optional()
        .describe("Whether the animation should loop"),
    }),
    returns: OperationResponse.extend({
      clipId: z
        .string()
        .describe("Unique identifier for the created clip"),
    }),
  },

  /**
   * Update animation clip properties
   */
  updateClip: {
    description: "Update animation clip properties",
    parameters: z.object({
      clipId: z
        .string()
        .describe("Animation clip identifier"),
      name: z
        .string()
        .optional()
        .describe("New name for the clip"),
      duration: z
        .number()
        .nonnegative()
        .optional()
        .describe("New duration in seconds"),
      loop: z
        .boolean()
        .optional()
        .describe("Whether the animation should loop"),
      speed: z
        .number()
        .optional()
        .describe("Playback speed multiplier"),
    }),
    returns: OperationResponse,
  },

  /**
   * Control animation playback
   */
  playAnimation: {
    description: "Control animation playback",
    parameters: z.object({
      clipId: z
        .string()
        .describe("Animation clip identifier"),
      action: AnimationPlaybackAction.describe(
        "Playback control action"
      ),
      time: z
        .number()
        .nonnegative()
        .optional()
        .describe("Seek to specific time"),
      speed: z
        .number()
        .optional()
        .describe("Playback speed multiplier"),
    }),
    returns: OperationResponse.extend({
      currentTime: z
        .number()
        .optional()
        .describe("Current time after operation"),
    }),
  },

  /**
   * Evaluate animation at a specific time
   */
  evaluateAnimation: {
    description: "Evaluate animation at a specific time",
    parameters: z.object({
      clipId: z
        .string()
        .describe("Animation clip identifier"),
      time: z
        .number()
        .nonnegative()
        .describe("Time to evaluate at"),
    }),
    returns: OperationResponse.extend({
      snapshot: z
        .record(z.string(), z.any())
        .describe("Key-value pairs of animated properties"),
    }),
  },

  /**
   * Create a new animation layer for blending
   */
  createLayer: {
    description:
      "Create a new animation layer for blending",
    parameters: z.object({
      name: z
        .string()
        .describe("Name of the animation layer"),
      weight: z
        .number()
        .min(0)
        .max(1)
        .default(1)
        .describe("Blend weight of this layer"),
      additive: z
        .boolean()
        .default(false)
        .describe("Whether this layer is additive"),
    }),
    returns: OperationResponse.extend({
      layerId: z
        .string()
        .describe(
          "Unique identifier for the created layer"
        ),
    }),
  },

  /**
   * Set the blend weight of an animation layer
   */
  setLayerWeight: {
    description:
      "Set the blend weight of an animation layer",
    parameters: z.object({
      layerId: z.string().describe("Layer identifier"),
      weight: z
        .number()
        .min(0)
        .max(1)
        .describe("New weight value"),
    }),
    returns: OperationResponse,
  },

  /**
   * Import animation data from external source
   */
  importAnimation: {
    description:
      "Import animation data from external source",
    parameters: z.object({
      format: z
        .enum(["glb", "fbx", "bvh", "json"])
        .describe("Source format"),
      data: z
        .any()
        .describe("Animation data in the specified format"),
      targetMapping: z
        .record(z.string(), z.string())
        .optional()
        .describe(
          "Map source node names to scene node IDs"
        ),
    }),
    returns: OperationResponse.extend({
      clipIds: z
        .array(z.string())
        .describe("IDs of imported animation clips"),
    }),
  },

  /**
   * Add a clip to an animation layer
   */
  addClipToLayer: {
    description: "Add an animation clip to a layer",
    parameters: z.object({
      layerId: z.string().describe("Layer identifier"),
      clipId: z.string().describe("Clip identifier"),
    }),
    returns: OperationResponse,
  },

  /**
   * Remove a clip from an animation layer
   */
  removeClipFromLayer: {
    description: "Remove an animation clip from a layer",
    parameters: z.object({
      layerId: z.string().describe("Layer identifier"),
      clipId: z.string().describe("Clip identifier"),
    }),
    returns: OperationResponse,
  },
} as const;

export type AnimationTool =
  keyof typeof animationAtomicTools;

const animationAtomicToolsWithExecute =
  createExecutableTools(animationAtomicTools);

export { animationAtomicToolsWithExecute };
