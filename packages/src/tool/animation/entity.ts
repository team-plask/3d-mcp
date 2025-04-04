import { z } from "zod";
import {
  _BaseEntity,
  _TensorType,
  _Tensor,
  _InterpolationType,
  _ExtrapolationType,
} from "../core/entity";

/**
 * Keyframe - A single point in time with a value and interpolation metadata
 */
export const Keyframe = _BaseEntity.extend({
  time: z.number().describe("Time position in seconds"),
  value: _Tensor.any.describe("Value at this keyframe"),
  channelId: z
    .string()
    .describe("ID of the channel this keyframe belongs to"),
  tangentIn: _Tensor.VEC2.optional().describe(
    "Incoming tangent handle (for bezier/hermite)"
  ),
  tangentOut: _Tensor.VEC2.optional().describe(
    "Outgoing tangent handle (for bezier/hermite)"
  ),
});

/**
 * Channel - A property track that contains keyframes
 */
export const Channel = _BaseEntity.extend({
  path: z
    .string()
    .describe("Property path this channel animates"),
  type: _TensorType.describe(
    "Data type of the animated property"
  ),
  nodeId: z
    .string()
    .describe("ID of the node this channel affects"),
  clipId: z
    .string()
    .describe("ID of the parent animation clip"),
  defaultValue: z
    .any()
    .optional()
    .describe("Default value when no keyframes present"),
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether this channel is active"),
  extrapolationPre: _ExtrapolationType
    .default("constant")
    .describe("Behavior before first keyframe"),
  extrapolationPost: _ExtrapolationType
    .default("constant")
    .describe("Behavior after last keyframe"),
});

/**
 * Clip - A complete animation sequence containing multiple channels
 */
export const Clip = _BaseEntity.extend({
  duration: z
    .number()
    .nonnegative()
    .describe("Duration in seconds"),
  frameRate: z
    .number()
    .positive()
    .default(24)
    .describe("Frame rate in frames per second"),
  startTime: z
    .number()
    .default(0)
    .describe("Start time in seconds"),
  loop: z
    .boolean()
    .default(false)
    .describe("Whether the clip should loop"),
  speed: z
    .number()
    .default(1)
    .describe("Playback speed multiplier"),
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether this clip is enabled"),
});

/**
 * Layer - Container for blending multiple animation clips
 */
export const Layer = _BaseEntity.extend({
  weight: z
    .number()
    .min(0)
    .max(1)
    .default(1)
    .describe("Blend weight influence"),
  additive: z
    .boolean()
    .default(false)
    .describe("Whether this layer adds to base pose"),
  parentId: z
    .string()
    .optional()
    .describe("Parent layer if in a hierarchy"),
  clipIds: z
    .array(z.string())
    .default([])
    .describe("IDs of clips in this layer"),
});

/**
 * Driver - Procedural animation logic that drives property values
 */
export const Driver = _BaseEntity.extend({
  targetNodeId: z.string().describe("Node to drive"),
  targetPath: z
    .string()
    .describe("Property path on target to drive"),
  expression: z
    .string()
    .describe("Mathematical expression or code"),
  variables: z
    .array(
      z.object({
        name: z
          .string()
          .describe("Variable name in expression"),
        sourceNodeId: z
          .string()
          .describe("Node ID to read from"),
        sourcePath: z
          .string()
          .describe("Property path to read from"),
        transform: z
          .string()
          .optional()
          .describe("Transform to apply to input"),
      })
    )
    .default([])
    .describe("Input variables for the expression"),
});

// Export collected entities
export const AnimationEntities = {
  Keyframe,
  Channel,
  Clip,
  Layer,
  Driver,
} as const;
