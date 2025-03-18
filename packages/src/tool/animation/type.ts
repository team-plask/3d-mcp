import { z } from "zod";
import { tensorUnion, TensorType } from "../core/type";

/**
 * Animation interpolation methods aligned with glTF standard
 */
export const InterpolationMethod = z.enum([
  "LINEAR",
  "STEP",
  "CUBICSPLINE",
]);
export type InterpolationMethod = z.infer<
  typeof InterpolationMethod
>;

/**
 * Animation playback state enum
 */
export const AnimationPlaybackState = z.enum([
  "PLAYING",
  "PAUSED",
  "STOPPED",
]);
export type AnimationPlaybackState = z.infer<
  typeof AnimationPlaybackState
>;

/**
 * Animation playback action enum
 */
export const AnimationPlaybackAction = z.enum([
  "PLAY",
  "PAUSE",
  "STOP",
  "RESET",
]);
export type AnimationPlaybackAction = z.infer<
  typeof AnimationPlaybackAction
>;

/**
 * Animation path types matching glTF specification
 */
export const AnimationPathType = z.enum([
  "translation",
  "rotation",
  "scale",
  "weights",
  "custom",
]);
export type AnimationPathType = z.infer<
  typeof AnimationPathType
>;

/**
 * Definition of a single keyframe in an animation channel
 */
export const KeyframeType = z.object({
  /**
   * Time in seconds for this keyframe
   */
  time: z.number().nonnegative(),

  /**
   * Value at this keyframe
   */
  value: tensorUnion,

  /**
   * In-tangent vector for cubic spline interpolation
   */
  inTangent: tensorUnion.optional(),

  /**
   * Out-tangent vector for cubic spline interpolation
   */
  outTangent: tensorUnion.optional(),

  /**
   * Interpolation method for this keyframe to the next
   */
  interpolation: InterpolationMethod.default("LINEAR"),
});
export type KeyframeType = z.infer<typeof KeyframeType>;

/**
 * Extended keyframe type that includes tensor type information
 */
export const KeyframeTypeWithType = KeyframeType.extend({
  /**
   * Data type of the keyframe value
   */
  type: TensorType,
});
export type KeyframeTypeWithType = z.infer<
  typeof KeyframeTypeWithType
>;

/**
 * Property path for targeting node properties
 */
export const PropertyPath = z.string();
export type PropertyPath = z.infer<typeof PropertyPath>;

/**
 * Target of an animation channel
 */
export const AnimationChannelTarget = z.object({
  /**
   * ID of the node being animated
   */
  nodeId: z.string(),

  /**
   * Path to the target property on the node
   */
  path: AnimationPathType,

  /**
   * Custom property path when using the 'custom' path type
   */
  customPath: z.string().optional(),
});
export type AnimationChannelTarget = z.infer<
  typeof AnimationChannelTarget
>;

/**
 * Single animation channel targeting one property
 */
export const AnimationChannel = z.object({
  /**
   * Target of this animation channel
   */
  target: AnimationChannelTarget,

  /**
   * Data type of the animated values
   */
  type: TensorType,

  /**
   * Array of keyframes in this channel
   */
  keyframes: z.array(KeyframeType),

  /**
   * Whether this channel is enabled
   */
  enabled: z.boolean().default(true),
});
export type AnimationChannel = z.infer<
  typeof AnimationChannel
>;

// For backward compatibility
export const AnimationTrack = AnimationChannel;
export type AnimationTrack = z.infer<typeof AnimationTrack>;

/**
 * Animation clip containing multiple channels
 */
export const AnimationClip = z.object({
  /**
   * Unique identifier for this clip
   */
  id: z.string(),

  /**
   * Human-readable name
   */
  name: z.string(),

  /**
   * Duration in seconds
   */
  duration: z.number().nonnegative(),

  /**
   * Animation channels in this clip
   */
  channels: z.array(AnimationChannel),

  /**
   * Whether this clip should loop
   */
  loop: z.boolean().default(false),

  /**
   * Playback speed multiplier
   */
  speed: z.number().default(1.0),

  /**
   * Current playback state
   */
  state: AnimationPlaybackState.default("STOPPED"),

  /**
   * Current playback time in seconds
   */
  currentTime: z.number().nonnegative().default(0),
});
export type AnimationClip = z.infer<typeof AnimationClip>;

/**
 * Animation layer for blending multiple animations
 */
export const AnimationLayer = z.object({
  /**
   * Unique identifier for this layer
   */
  id: z.string(),

  /**
   * Human-readable name
   */
  name: z.string(),

  /**
   * Blend weight (0-1)
   */
  weight: z.number().min(0).max(1).default(1),

  /**
   * Clips in this layer
   */
  clips: z.array(AnimationClip),

  /**
   * Whether values from this layer are additive
   */
  additive: z.boolean().default(false),

  /**
   * Whether this layer is active
   */
  enabled: z.boolean().default(true),
});
export type AnimationLayer = z.infer<typeof AnimationLayer>;

/**
 * Complete animation system
 */
export const AnimationSystem = z.object({
  /**
   * All animation layers
   */
  layers: z.array(AnimationLayer).default([]),

  /**
   * Global playback time
   */
  currentTime: z.number().nonnegative().default(0),

  /**
   * Whether animations are currently playing
   */
  playing: z.boolean().default(false),

  /**
   * ID of the default animation clip
   */
  defaultClip: z.string().optional(),

  /**
   * Global playback speed multiplier
   */
  globalSpeed: z.number().default(1.0),
});
export type AnimationSystem = z.infer<
  typeof AnimationSystem
>;

/**
 * Legacy animation type for backward compatibility
 */
export const AnimationType = z.object({
  /**
   * Data type of the animated values
   */
  type: TensorType,

  /**
   * Array of keyframes
   */
  keyframes: z.array(KeyframeType),
});
export type AnimationType = z.infer<typeof AnimationType>;

/**
 * Common parameters for keyframe operations
 */
export const KeyframeOperationBase = z.object({
  /**
   * Animation clip identifier
   */
  clipId: z.string(),

  /**
   * Index of the animation channel
   */
  channelIndex: z.number().int().nonnegative(),
});
export type KeyframeOperationBase = z.infer<
  typeof KeyframeOperationBase
>;

/**
 * Single keyframe definition for API operations
 */
export const KeyframeInput = z.object({
  /**
   * Time in seconds
   */
  time: z.number().nonnegative(),

  /**
   * Value at the keyframe
   */
  value: tensorUnion,

  /**
   * Optional in-tangent vector for CUBICSPLINE
   */
  inTangent: tensorUnion.optional(),

  /**
   * Optional out-tangent vector for CUBICSPLINE
   */
  outTangent: tensorUnion.optional(),

  /**
   * Interpolation method
   */
  interpolation: InterpolationMethod.optional(),
});
export type KeyframeInput = z.infer<typeof KeyframeInput>;

/**
 * Animation tool response base type
 */
export const OperationResponse = z.object({
  /**
   * Operation success status
   */
  success: z.boolean(),
});
export type OperationResponse = z.infer<
  typeof OperationResponse
>;
