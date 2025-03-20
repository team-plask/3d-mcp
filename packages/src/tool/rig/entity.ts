import { z } from "zod";
import {
  BaseEntity,
  Tensor,
  NodeBase,
  Color,
  Pose,
} from "../core/entity";

/**
 * Rig - Complete skeleton structure containing multiple joints
 */
export const Rig = BaseEntity.extend({
  rootJointId: z.string().describe("ID of the root joint"),
  bindPoseId: z
    .string()
    .describe("ID of the bind pose for this rig"),
  joints: z
    .array(z.string())
    .describe("IDs of all joints in the skeleton"),
  influenceLimit: z
    .number()
    .int()
    .positive()
    .default(4)
    .describe("Maximum number of influences per vertex"),
  worldUpVector: Tensor.VEC3.default([0, 1, 0]).describe(
    "World up vector for orientation reference"
  ),
  autoIkEnabled: z
    .boolean()
    .default(false)
    .describe("Whether automatic IK solving is enabled"),
  drawSettings: z
    .object({
      jointColor: Color.optional().describe(
        "Color for joint display"
      ),
      boneColor: Color.optional().describe(
        "Color for bone display"
      ),
      jointSize: z
        .number()
        .positive()
        .optional()
        .describe("Display size for joints"),
      xRayEnabled: z
        .boolean()
        .default(false)
        .describe("Whether to show through geometry"),
    })
    .optional()
    .describe("Visual display settings for the rig"),
});

/**
 * Skin - Binding between mesh vertices and skeleton
 */
export const Skin = BaseEntity.extend({
  meshId: z
    .string()
    .describe("ID of the mesh being skinned"),
  rigId: z
    .string()
    .describe("ID of the rig controlling this skin"),
  influences: z
    .array(
      z.object({
        vertexIndex: z
          .number()
          .int()
          .nonnegative()
          .describe("Vertex index"),
        weights: z
          .record(z.string(), z.number())
          .describe(
            "Joint influences by ID (joint ID -> weight)"
          ),
      })
    )
    .describe("Skinning weights per vertex"),
  maxInfluenceCount: z
    .number()
    .int()
    .positive()
    .default(4)
    .describe("Maximum influences per vertex"),
  normalizeWeights: z
    .boolean()
    .default(true)
    .describe(
      "Whether weights are automatically normalized"
    ),
  dualQuaternionEnabled: z
    .boolean()
    .default(false)
    .describe(
      "Whether dual quaternion skinning is used (vs linear)"
    ),
  falloffRadius: z
    .number()
    .positive()
    .optional()
    .describe("Falloff radius for automatic weighting"),
});

/**
 * RigControl - Animator-friendly manipulation handle
 */
export const RigControl = NodeBase.extend({
  targetJointIds: z
    .array(z.string())
    .describe("Joint IDs that this control manipulates"),
  color: Color.optional().describe("Display color"),
  size: z
    .number()
    .positive()
    .default(1)
    .describe("Display size"),
  shape: z
    .enum([
      "cube",
      "sphere",
      "circle",
      "square",
      "arrow",
      "cross",
      "pyramid",
      "diamond",
      "custom",
    ])
    .default("cube")
    .describe("Control shape"),
  customMeshId: z
    .string()
    .optional()
    .describe("Mesh ID for custom shape"),
  spaceType: z
    .enum(["object", "world", "parent", "joint"])
    .default("object")
    .describe("Coordinate space"),
  offsetMatrix: Tensor.MAT4.optional().describe(
    "Offset transformation from target"
  ),
  channelControl: z
    .record(
      z.enum([
        "tx",
        "ty",
        "tz",
        "rx",
        "ry",
        "rz",
        "sx",
        "sy",
        "sz",
      ]),
      z.boolean()
    )
    .optional()
    .describe("Which channels this control affects"),
  displayType: z
    .enum(["normal", "reference", "template"])
    .default("normal")
    .describe("Display classification"),
});

/**
 * BindPose - Stored skeletal pose for rigging
 */
export const BindPose = Pose.extend({
  rigId: z.string().describe("ID of the associated rig"),
  isDefault: z
    .boolean()
    .default(false)
    .describe("Whether this is the default bind pose"),
});

/**
 * BlendShapeGroup - Collection of blend shapes that can be controlled together
 */
export const BlendShapeGroup = BaseEntity.extend({
  blendShapeIds: z
    .array(z.string())
    .describe("IDs of blend shapes in this group"),
  targetWeights: z
    .record(z.string(), z.number())
    .describe("Target weights by blend shape ID"),
  driver: z
    .object({
      inputInterval: z
        .tuple([z.number(), z.number()])
        .default([0, 1])
        .describe("Input value range [min, max]"),
      evaluationType: z
        .enum(["linear", "stepped", "spline"])
        .default("linear")
        .describe("Evaluation method"),
      remapEnabled: z
        .boolean()
        .default(false)
        .describe("Whether to remap input values"),
      tangents: z
        .array(Tensor.VEC2)
        .optional()
        .describe("Tangent values for spline evaluation"),
    })
    .optional()
    .describe("Optional driving configuration"),
  isInbetween: z
    .boolean()
    .default(false)
    .describe(
      "Whether this represents an inbetween blend shape"
    ),
});

/**
 * SplineIK - Spline-based inverse kinematics system
 */
export const SplineIK = BaseEntity.extend({
  curveId: z
    .string()
    .describe("ID of the controlling curve"),
  startJointId: z.string().describe("Start joint ID"),
  endJointId: z.string().describe("End joint ID"),
  count: z
    .number()
    .int()
    .positive()
    .describe("Number of joints to affect"),
  stretchEnabled: z
    .boolean()
    .default(true)
    .describe("Allow stretching"),
  autoRotateEnabled: z
    .boolean()
    .default(true)
    .describe("Auto-orient joints along curve"),
  upVector: Tensor.VEC3.default([0, 1, 0]).describe(
    "Up vector for orientation"
  ),
  forwardAxis: z
    .enum(["x", "y", "z", "-x", "-y", "-z"])
    .default("x")
    .describe("Forward axis along joints"),
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether spline IK is enabled"),
});

/**
 * JointLimits - Range of motion constraints for a joint
 */
export const JointLimits = BaseEntity.extend({
  jointId: z.string().describe("ID of the joint"),
  rotationLimits: z
    .object({
      x: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe(
          "X rotation limits [min, max] in degrees"
        ),
      y: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe(
          "Y rotation limits [min, max] in degrees"
        ),
      z: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe(
          "Z rotation limits [min, max] in degrees"
        ),
    })
    .describe("Rotation limits by axis"),
  translationLimits: z
    .object({
      x: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe("X translation limits [min, max]"),
      y: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe("Y translation limits [min, max]"),
      z: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe("Z translation limits [min, max]"),
    })
    .describe("Translation limits by axis"),
  scaleLimits: z
    .object({
      x: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe("X scale limits [min, max]"),
      y: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe("Y scale limits [min, max]"),
      z: z
        .tuple([z.number(), z.number()])
        .optional()
        .describe("Z scale limits [min, max]"),
    })
    .describe("Scale limits by axis"),
  enabled: z
    .boolean()
    .default(true)
    .describe("Whether joint limits are enabled"),
});
