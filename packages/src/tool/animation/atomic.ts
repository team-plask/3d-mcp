import { z } from "zod";
import { createExecutableTools } from "../core/request";
import { OperationResponse } from "../core/entity";
import { createCrudOperations } from "../core/utils";
import { AnimationEntities } from "./entity";

const entityCruds = createCrudOperations(AnimationEntities);

/**
 * Animation atomic tools organized by entity type with batch support
 */
const animationAtomicTools = {
  ...entityCruds,

  // Keyframe operations

  insertKeyframes: {
    description:
      "Insert multiple keyframes in a single batch operation",
    parameters: z.object({
      channelId: z.string().describe("Channel identifier"),
      keyframes: z
        .array(
          AnimationEntities.Keyframe.omit({ id: true })
        )
        .describe("Array of keyframes to insert"),
    }),
    returns: OperationResponse.extend({
      keyframeIds: z
        .array(z.string())
        .describe("IDs of the inserted keyframes"),
    }),
  },

  bakeKeyframes: {
    description: "Bake procedural animation to keyframes",
    parameters: z.object({
      channelId: z
        .string()
        .describe("Target channel identifier"),
      startTime: z
        .number()
        .describe("Start time for baking"),
      endTime: z.number().describe("End time for baking"),
      frameRate: z
        .number()
        .positive()
        .describe("Sampling rate in frames per second"),
    }),
    returns: OperationResponse.extend({
      keyframeIds: z
        .array(z.string())
        .describe("IDs of created keyframes"),
      keyframeCount: z
        .number()
        .describe("Number of keyframes created"),
    }),
  },

  transformKeyframes: {
    description:
      "Transform multiple keyframes with scale, offset, or other operations",
    parameters: z.object({
      channelId: z.string().describe("Channel identifier"),
      keyframeIds: z
        .array(z.string())
        .describe("IDs of keyframes to transform"),
      operation: z
        .enum(["scale", "offset", "mirror", "noise"])
        .describe("Transform operation type"),
      timeParams: z
        .object({
          scale: z
            .number()
            .positive()
            .optional()
            .describe("Time scaling factor"),
          offset: z
            .number()
            .optional()
            .describe("Time offset to apply"),
        })
        .optional()
        .describe("Time transformation parameters"),
      valueParams: z
        .object({
          scale: z
            .union([z.number(), z.array(z.number())])
            .optional()
            .describe("Value scaling factor"),
          offset: z
            .union([z.number(), z.array(z.number())])
            .optional()
            .describe("Value offset to apply"),
          noiseAmplitude: z
            .number()
            .optional()
            .describe(
              "Noise amplitude for random variations"
            ),
        })
        .optional()
        .describe("Value transformation parameters"),
    }),
    returns: OperationResponse,
  },

  // Channel operations

  batchChannelSetMute: {
    description:
      "Mute or unmute multiple animation channels",
    parameters: z.object({
      items: z
        .array(
          z.object({
            channelId: z
              .string()
              .describe("Channel identifier"),
            muted: z
              .boolean()
              .describe("Whether to mute the channel"),
          })
        )
        .describe("Channels to update"),
    }),
    returns: OperationResponse,
  },

  batchChannelSetSolo: {
    description:
      "Solo or unsolo multiple animation channels",
    parameters: z.object({
      items: z
        .array(
          z.object({
            channelId: z
              .string()
              .describe("Channel identifier"),
            solo: z
              .boolean()
              .describe("Whether to solo the channel"),
          })
        )
        .describe("Channels to update"),
    }),
    returns: OperationResponse,
  },

  // Clip operations

  trimClip: {
    description:
      "Trim an animation clip to a specific time range",
    parameters: z.object({
      clipId: z.string().describe("Clip identifier"),
      startTime: z
        .number()
        .nonnegative()
        .describe("New start time"),
      endTime: z
        .number()
        .positive()
        .describe("New end time"),
    }),
    returns: OperationResponse,
  },

  batchClipTrim: {
    description:
      "Trim multiple animation clips in a single operation",
    parameters: z.object({
      items: z
        .array(
          z.object({
            clipId: z.string().describe("Clip identifier"),
            startTime: z
              .number()
              .nonnegative()
              .describe("New start time"),
            endTime: z
              .number()
              .positive()
              .describe("New end time"),
          })
        )
        .describe("Clips to trim"),
    }),
    returns: OperationResponse,
  },

  splitClip: {
    description:
      "Split a clip into two separate clips at the specified time",
    parameters: z.object({
      clipId: z.string().describe("Source clip identifier"),
      splitTime: z
        .number()
        .positive()
        .describe("Time to split the clip at"),
    }),
    returns: OperationResponse.extend({
      newClipId: z
        .string()
        .describe(
          "ID of the newly created clip from the split"
        ),
    }),
  },

  mergeClips: {
    description: "Merge multiple clips into a single clip",
    parameters: z.object({
      clipIds: z
        .array(z.string())
        .min(2)
        .describe("IDs of clips to merge"),
      name: z
        .string()
        .optional()
        .describe("Name for the merged clip"),
      blendTime: z
        .number()
        .nonnegative()
        .optional()
        .describe("Time to blend between clips"),
    }),
    returns: OperationResponse.extend({
      mergedClipId: z
        .string()
        .describe("ID of the newly created merged clip"),
    }),
  },

  batchClipPlayback: {
    description:
      "Control playback for multiple clips simultaneously",
    parameters: z.object({
      items: z
        .array(
          z.object({
            clipId: z.string().describe("Clip identifier"),
            action: z
              .enum(["play", "pause", "stop", "seek"])
              .describe("Playback action"),
            time: z
              .number()
              .optional()
              .describe("Seek time if using 'seek' action"),
          })
        )
        .describe("Clip playback operations"),
    }),
    returns: OperationResponse,
  },

  // Layer operations

  batchLayerSetWeight: {
    description:
      "Set weights for multiple animation layers at once",
    parameters: z.object({
      items: z
        .array(
          z.object({
            layerId: z
              .string()
              .describe("Layer identifier"),
            weight: z
              .number()
              .min(0)
              .max(1)
              .describe("New weight value"),
          })
        )
        .describe("Layer weights to update"),
    }),
    returns: OperationResponse,
  },

  batchClipLayerOperation: {
    description:
      "Perform operations on clips and layers in batch",
    parameters: z.object({
      operation: z
        .enum(["add", "remove", "reorder"])
        .describe("Operation to perform"),
      items: z
        .array(
          z.object({
            layerId: z
              .string()
              .describe("Layer identifier"),
            clipId: z.string().describe("Clip identifier"),
            timeOffset: z
              .number()
              .optional()
              .describe(
                "Time offset for the clip (for add operation)"
              ),
            order: z
              .number()
              .int()
              .nonnegative()
              .optional()
              .describe(
                "New order index (for reorder operation)"
              ),
          })
        )
        .describe("Clip-layer operations to perform"),
    }),
    returns: OperationResponse,
  },

  // Curve operations
  batchCurveSmooth: {
    description:
      "Smooth multiple animation curves in a single operation",
    parameters: z.object({
      items: z
        .array(
          z.object({
            curveId: z
              .string()
              .describe("Curve identifier"),
            strength: z
              .number()
              .min(0)
              .max(1)
              .default(0.5)
              .describe("Smoothing strength"),
            preserveKeyframes: z
              .array(z.number())
              .optional()
              .describe(
                "Indices of keyframes to preserve exactly"
              ),
          })
        )
        .describe("Curves to smooth"),
    }),
    returns: OperationResponse,
  },

  batchCurveSetInterpolation: {
    description:
      "Set interpolation modes for multiple curves or segments",
    parameters: z.object({
      items: z
        .array(
          z.object({
            curveId: z
              .string()
              .describe("Curve identifier"),
            mode: z
              .enum([
                "linear",
                "bezier",
                "constant",
                "hermite",
              ])
              .describe("Interpolation mode"),
            startKeyframeIndex: z
              .number()
              .int()
              .nonnegative()
              .optional()
              .describe(
                "Start keyframe index for segment (applies to all if omitted)"
              ),
            endKeyframeIndex: z
              .number()
              .int()
              .nonnegative()
              .optional()
              .describe(
                "End keyframe index for segment (applies to all if omitted)"
              ),
          })
        )
        .describe("Curve interpolation operations"),
    }),
    returns: OperationResponse,
  },

  // Driver operations
  batchDriverEvaluate: {
    description:
      "Evaluate multiple drivers with specific values",
    parameters: z.object({
      items: z
        .array(
          z.object({
            driverId: z
              .string()
              .describe("Driver identifier"),
            variables: z
              .record(z.string(), z.any())
              .optional()
              .describe(
                "Custom variable values for evaluation"
              ),
          })
        )
        .describe("Drivers to evaluate"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            driverId: z
              .string()
              .describe("Driver identifier"),
            result: z
              .any()
              .describe("Result of the driver evaluation"),
          })
        )
        .describe("Evaluation results"),
    }),
  },

  // Rig operations

  batchRigSelectBones: {
    description: "Select bones across multiple rigs",
    parameters: z.object({
      selectionSets: z
        .array(
          z.object({
            rigId: z.string().describe("Rig identifier"),
            boneIds: z
              .array(z.string())
              .describe("Bone identifiers to select"),
          })
        )
        .describe("Bone selections by rig"),
    }),
    returns: OperationResponse,
  },

  // IK Chain operations

  batchIkChainSolve: {
    description:
      "Solve multiple IK chains in a single operation",
    parameters: z.object({
      items: z
        .array(
          z.object({
            ikChainId: z
              .string()
              .describe("IK chain identifier"),
            targetPosition: z
              .array(z.number())
              .length(3)
              .optional()
              .describe("Target position override"),
            targetRotation: z
              .array(z.number())
              .length(4)
              .optional()
              .describe(
                "Target rotation override (quaternion)"
              ),
            poleVectorPosition: z
              .array(z.number())
              .length(3)
              .optional()
              .describe("Pole vector position override"),
          })
        )
        .describe("IK chains to solve"),
    }),
    returns: OperationResponse,
  },

  batchIkChainSetInfluence: {
    description: "Set influence for multiple IK chains",
    parameters: z.object({
      items: z
        .array(
          z.object({
            ikChainId: z
              .string()
              .describe("IK chain identifier"),
            influence: z
              .number()
              .min(0)
              .max(1)
              .describe("Influence value"),
          })
        )
        .describe("IK chain influences to update"),
    }),
    returns: OperationResponse,
  },

  // Import/Export operations
  batchImportAnimation: {
    description:
      "Import multiple animation data sources in a single operation",
    parameters: z.object({
      items: z
        .array(
          z.object({
            format: z
              .enum(["glb", "fbx", "bvh", "json"])
              .describe("Source format"),
            data: z
              .any()
              .describe(
                "Animation data in the specified format"
              ),
            targetMapping: z
              .record(z.string(), z.string())
              .optional()
              .describe(
                "Map source node names to scene node IDs"
              ),
          })
        )
        .describe("Animation sources to import"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            index: z
              .number()
              .int()
              .nonnegative()
              .describe(
                "Index in the original items array"
              ),
            clipIds: z
              .array(z.string())
              .describe("IDs of imported animation clips"),
          })
        )
        .describe("Import results"),
    }),
  },

  batchExportAnimation: {
    description:
      "Export multiple animation collections to external formats",
    parameters: z.object({
      items: z
        .array(
          z.object({
            clipIds: z
              .array(z.string())
              .describe("IDs of clips to export"),
            format: z
              .enum(["glb", "fbx", "bvh", "json"])
              .describe("Target format"),
            options: z
              .record(z.string(), z.any())
              .optional()
              .describe("Format-specific export options"),
          })
        )
        .describe("Animation export operations"),
    }),
    returns: OperationResponse.extend({
      results: z
        .array(
          z.object({
            index: z
              .number()
              .int()
              .nonnegative()
              .describe(
                "Index in the original items array"
              ),
            data: z
              .any()
              .describe("Exported animation data"),
          })
        )
        .describe("Export results"),
    }),
  },
} as const;

export type AnimationTool =
  keyof typeof animationAtomicTools;

const animationAtomicToolsWithExecute =
  createExecutableTools(animationAtomicTools);

export { animationAtomicToolsWithExecute };
