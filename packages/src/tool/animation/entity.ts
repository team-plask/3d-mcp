import { z } from "zod";
import {
  BaseEntity,
  TensorType,
  Tensor,
  InterpolationType,
  ExtrapolationType,
} from "../core/entity";

/**
 * Keyframe - A single point in time with a value and interpolation metadata
 */
export const Keyframe = BaseEntity.extend({
  time: z.number().describe("Time position in seconds"),
  value: Tensor.any.describe("Value at this keyframe"),
  channelId: z
    .string()
    .describe("ID of the channel this keyframe belongs to"),
  tangentIn: Tensor.VEC2.optional().describe(
    "Incoming tangent handle (for bezier/hermite)"
  ),
  tangentOut: Tensor.VEC2.optional().describe(
    "Outgoing tangent handle (for bezier/hermite)"
  ),
});

/**
 * Channel - A property track that contains keyframes
 */
export const Channel = BaseEntity.extend({
  path: z
    .string()
    .describe("Property path this channel animates"),
  type: TensorType.describe(
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
  extrapolationPre: ExtrapolationType.default(
    "constant"
  ).describe("Behavior before first keyframe"),
  extrapolationPost: ExtrapolationType.default(
    "constant"
  ).describe("Behavior after last keyframe"),
});

/**
 * Clip - A complete animation sequence containing multiple channels
 */
export const Clip = BaseEntity.extend({
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
export const Layer = BaseEntity.extend({
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
export const Driver = BaseEntity.extend({
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
