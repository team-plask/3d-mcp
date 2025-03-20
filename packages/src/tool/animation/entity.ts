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
  interpolationIn: InterpolationType.optional().describe(
    "Interpolation method entering this keyframe"
  ),
  interpolationOut: InterpolationType.optional().describe(
    "Interpolation method leaving this keyframe"
  ),
  tangentIn: Tensor.VEC2.optional().describe(
    "Incoming tangent handle (for bezier/hermite)"
  ),
  tangentOut: Tensor.VEC2.optional().describe(
    "Outgoing tangent handle (for bezier/hermite)"
  ),
  isBreakdown: z
    .boolean()
    .optional()
    .describe("Whether this is a breakdown keyframe"),
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
  muted: z
    .boolean()
    .default(false)
    .describe(
      "Whether this channel is temporarily disabled"
    ),
  locked: z
    .boolean()
    .default(false)
    .describe("Whether this channel is locked for editing"),
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
  solo: z
    .boolean()
    .default(false)
    .describe("Whether this layer is soloed"),
  muted: z
    .boolean()
    .default(false)
    .describe("Whether this layer is muted"),
  locked: z
    .boolean()
    .default(false)
    .describe("Whether this layer is locked for editing"),
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
 * Curve - Mathematical representation of an animation curve
 */
export const Curve = BaseEntity.extend({
  channelId: z
    .string()
    .describe("ID of the related animation channel"),
  interpolationType: InterpolationType.describe(
    "Default interpolation type"
  ),
  preInfinity: ExtrapolationType.describe(
    "Behavior before first keyframe"
  ),
  postInfinity: ExtrapolationType.describe(
    "Behavior after last keyframe"
  ),
  weightedTangents: z
    .boolean()
    .default(false)
    .describe("Whether tangents use weighting"),
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
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether this driver is active"),
});

/**
 * Skeletal rig structure for animation
 */
export const Rig = BaseEntity.extend({
  rootBoneId: z
    .string()
    .describe("ID of the root bone/joint"),
  boneIds: z
    .array(z.string())
    .describe("IDs of all bones/joints in this rig"),
});

/**
 * IK Chain - Inverse Kinematics system
 */
export const IKChain = BaseEntity.extend({
  startBoneId: z
    .string()
    .describe("ID of the start bone/joint"),
  endBoneId: z
    .string()
    .describe("ID of the end bone/joint"),
  targetId: z
    .string()
    .describe("ID of the target object/node"),
  poleVectorId: z
    .string()
    .optional()
    .describe(
      "ID of the pole vector object (for knee/elbow direction)"
    ),
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether this IK chain is active"),
  influence: z
    .number()
    .min(0)
    .max(1)
    .default(1)
    .describe("Strength of IK effect"),
});

// Export collected entities
export const AnimationEntities = {
  Keyframe,
  Channel,
  Clip,
  Layer,
  Curve,
  Driver,
  Rig,
  IKChain,
};
