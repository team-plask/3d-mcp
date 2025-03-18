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
      /**
       * Array of keyframes to insert
       */
      keyframes: z.array(KeyframeInput),
    }),
    returns: OperationResponse.extend({
      /**
       * Indices of the inserted keyframes
       */
      keyframeIndices: z.array(z.number()),
    }),
  },

  /**
   * Remove keyframes from an animation channel
   */
  removeKeyframes: {
    description:
      "Remove a keyframe from an animation channel",
    parameters: KeyframeOperationBase.extend({
      /**
       * Indexes of the keyframes to remove
       */
      keyframeIndex: z.array(
        z.number().int().nonnegative()
      ),
    }),
    returns: OperationResponse,
  },

  /**
   * Create a new animation channel
   */
  createChannel: {
    description: "Create a new animation channel",
    parameters: z.object({
      /**
       * Animation clip identifier
       */
      clipId: z.string(),

      /**
       * Target node identifier
       */
      nodeId: z.string(),

      /**
       * Standard property path to animate
       */
      path: AnimationPathType,

      /**
       * Custom property path if using 'custom'
       */
      customPath: z.string().optional(),

      /**
       * Type of the animated property
       */
      type: TensorType,
    }),
    returns: OperationResponse.extend({
      /**
       * Index of the created channel
       */
      channelIndex: z.number(),
    }),
  },

  /**
   * Create a new animation clip
   */
  createClip: {
    description: "Create a new animation clip",
    parameters: z.object({
      /**
       * Name of the animation clip
       */
      name: z.string(),

      /**
       * Duration in seconds
       */
      duration: z.number().nonnegative(),

      /**
       * Whether the animation should loop
       */
      loop: z.boolean().optional(),
    }),
    returns: OperationResponse.extend({
      /**
       * Unique identifier for the created clip
       */
      clipId: z.string(),
    }),
  },

  /**
   * Update animation clip properties
   */
  updateClip: {
    description: "Update animation clip properties",
    parameters: z.object({
      /**
       * Animation clip identifier
       */
      clipId: z.string(),

      /**
       * New name for the clip
       */
      name: z.string().optional(),

      /**
       * New duration in seconds
       */
      duration: z.number().nonnegative().optional(),

      /**
       * Whether the animation should loop
       */
      loop: z.boolean().optional(),

      /**
       * Playback speed multiplier
       */
      speed: z.number().optional(),
    }),
    returns: OperationResponse,
  },

  /**
   * Control animation playback
   */
  playAnimation: {
    description: "Control animation playback",
    parameters: z.object({
      /**
       * Animation clip identifier
       */
      clipId: z.string(),

      /**
       * Playback control action
       */
      action: AnimationPlaybackAction,

      /**
       * Seek to specific time
       */
      time: z.number().nonnegative().optional(),

      /**
       * Playback speed multiplier
       */
      speed: z.number().optional(),
    }),
    returns: OperationResponse.extend({
      /**
       * Current time after operation
       */
      currentTime: z.number().optional(),
    }),
  },

  /**
   * Evaluate animation at a specific time
   */
  evaluateAnimation: {
    description: "Evaluate animation at a specific time",
    parameters: z.object({
      /**
       * Animation clip identifier
       */
      clipId: z.string(),

      /**
       * Time to evaluate at
       */
      time: z.number().nonnegative(),
    }),
    returns: OperationResponse.extend({
      /**
       * Key-value pairs of animated properties
       */
      snapshot: z.record(z.string(), z.any()),
    }),
  },

  /**
   * Create a new animation layer for blending
   */
  createLayer: {
    description:
      "Create a new animation layer for blending",
    parameters: z.object({
      /**
       * Name of the animation layer
       */
      name: z.string(),

      /**
       * Blend weight of this layer
       */
      weight: z.number().min(0).max(1).default(1),

      /**
       * Whether this layer is additive
       */
      additive: z.boolean().default(false),
    }),
    returns: OperationResponse.extend({
      /**
       * Unique identifier for the created layer
       */
      layerId: z.string(),
    }),
  },

  /**
   * Set the blend weight of an animation layer
   */
  setLayerWeight: {
    description:
      "Set the blend weight of an animation layer",
    parameters: z.object({
      /**
       * Layer identifier
       */
      layerId: z.string(),

      /**
       * New weight value
       */
      weight: z.number().min(0).max(1),
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
      /**
       * Source format
       */
      format: z.enum(["gltf", "fbx", "bvh", "json"]),

      /**
       * Animation data in the specified format
       */
      data: z.any(),

      /**
       * Map source node names to scene node IDs
       */
      targetMapping: z
        .record(z.string(), z.string())
        .optional(),
    }),
    returns: OperationResponse.extend({
      /**
       * IDs of imported animation clips
       */
      clipIds: z.array(z.string()),
    }),
  },

  /**
   * Add a clip to an animation layer
   */
  addClipToLayer: {
    description: "Add an animation clip to a layer",
    parameters: z.object({
      /**
       * Layer identifier
       */
      layerId: z.string(),

      /**
       * Clip identifier
       */
      clipId: z.string(),
    }),
    returns: OperationResponse,
  },

  /**
   * Remove a clip from an animation layer
   */
  removeClipFromLayer: {
    description: "Remove an animation clip from a layer",
    parameters: z.object({
      /**
       * Layer identifier
       */
      layerId: z.string(),

      /**
       * Clip identifier
       */
      clipId: z.string(),
    }),
    returns: OperationResponse,
  },
} as const;

export type AnimationTool =
  keyof typeof animationAtomicTools;

const animationAtomicToolsWithExecute =
  createExecutableTools(animationAtomicTools);

export { animationAtomicToolsWithExecute };
