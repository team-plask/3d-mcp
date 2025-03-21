import { z } from "zod";
import {
  OperationResponse,
  Color,
  Tensor,
} from "../core/entity";
import { defineCompoundTool } from "../core/request";
import { coreAtomicToolsWithExecute } from "../core/atomic";
import { rigAtomicToolsWithExecute } from "./atomic";

/**
 * Compound tools for rigging that build on atomic operations
 */
const rigCompoundedTools = {
  /**
   * Create rig controls for a set of joints
   */
  createControlsForJoints: defineCompoundTool({
    description:
      "Create animator-friendly controls for a set of joints",
    parameters: z.object({
      jointIds: z
        .array(z.string())
        .describe("IDs of joints to create controls for"),
      rigId: z.string().describe("ID of the rig"),
      controlShape: z
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
        .describe("Shape to use for controls"),
      controlSize: z
        .number()
        .positive()
        .default(1)
        .describe("Size multiplier for controls"),
      useColorHierarchy: z
        .boolean()
        .default(true)
        .describe(
          "Whether to color controls based on hierarchy depth"
        ),
      baseColor: Color.optional().describe(
        "Base color for controls (if not using hierarchy colors)"
      ),
      offsetMultiplier: z
        .number()
        .default(1.5)
        .describe(
          "Control offset distance as multiple of joint size"
        ),
      createGroupHierarchy: z
        .boolean()
        .default(true)
        .describe(
          "Whether to create a parallel group hierarchy for controls"
        ),
      customMeshId: z
        .string()
        .optional()
        .describe(
          "Custom mesh ID to use for control shape"
        ),
      namingPattern: z
        .string()
        .default("CTRL_{joint}")
        .describe(
          "Naming pattern for controls, using {joint} as placeholder"
        ),
    }),
    returns: OperationResponse.extend({
      controlIds: z
        .array(z.string())
        .describe("IDs of created control objects"),
      controlGroups: z
        .array(z.string())
        .optional()
        .describe(
          "IDs of created control groups if hierarchy was requested"
        ),
    }),
    execute: async (params) => {
      const {
        jointIds,
        rigId,
        controlShape,
        controlSize,
        useColorHierarchy,
        baseColor,
        offsetMultiplier,
        createGroupHierarchy,
        customMeshId,
        namingPattern,
      } = params;

      // Get joint information including hierarchy
      const jointData = await Promise.all(
        jointIds.map(async (id) => {
          const jointInfo = await tool.getProperty.execute({
            id,
            propertyPath: "name",
          });

          const parentResult =
            await tool.getProperty.execute({
              id,
              propertyPath: "parentId",
            });

          const positionResult =
            await tool.getProperty.execute({
              id,
              propertyPath: "position",
            });

          return {
            id,
            name: jointInfo.value,
            parentId: parentResult.value,
            position: positionResult.value,
          };
        })
      );

      // Determine hierarchy depth for each joint
      const depthMap = new Map();
      const determineDepth = (id) => {
        if (depthMap.has(id)) return depthMap.get(id);

        const joint = jointData.find((j) => j.id === id);
        if (
          !joint ||
          !joint.parentId ||
          !jointIds.includes(joint.parentId)
        ) {
          depthMap.set(id, 0);
          return 0;
        }

        const parentDepth = determineDepth(joint.parentId);
        const depth = parentDepth + 1;
        depthMap.set(id, depth);
        return depth;
      };

      jointIds.forEach((id) => determineDepth(id));

      // Create group hierarchy if requested
      const groupIds = [];
      let rootGroupId = null;

      if (createGroupHierarchy) {
        // Create a root group for all controls
        const rootGroupResult =
          await tool.createGroup.execute({
            name: `RIG_CONTROLS_${rigId}`,
          });

        rootGroupId = rootGroupResult.id;
        groupIds.push(rootGroupId);

        // Create groups matching joint hierarchy
        const groupByJointId = new Map();

        // Sort by depth to ensure parents are created before children
        const sortedJoints = [...jointData].sort(
          (a, b) => depthMap.get(a.id) - depthMap.get(b.id)
        );

        for (const joint of sortedJoints) {
          const groupName =
            namingPattern.replace("{joint}", joint.name) +
            "_GRP";

          // Determine parent group
          let parentId = rootGroupId;
          if (
            joint.parentId &&
            jointIds.includes(joint.parentId) &&
            groupByJointId.has(joint.parentId)
          ) {
            parentId = groupByJointId.get(joint.parentId);
          }

          const groupResult =
            await tool.createGroup.execute({
              name: groupName,
            });

          await tool.batchSetParent.execute({
            items: [{ id: groupResult.id, parentId }],
            maintainWorldTransform: true,
          });

          groupByJointId.set(joint.id, groupResult.id);
          groupIds.push(groupResult.id);
        }
      }

      // Create control for each joint
      const controlIds = [];
      const maxDepth = Math.max(
        ...Array.from(depthMap.values())
      );

      for (const joint of jointData) {
        const controlName = namingPattern.replace(
          "{joint}",
          joint.name
        );
        const depth = depthMap.get(joint.id);

        // Determine color based on hierarchy depth if requested
        let controlColor;
        if (useColorHierarchy && maxDepth > 0) {
          // Generate color gradient based on depth
          const t = depth / maxDepth;
          // Simple color gradient: red->yellow->green->cyan->blue
          if (t < 0.25) {
            controlColor = [1, t * 4, 0]; // Red to yellow
          } else if (t < 0.5) {
            controlColor = [1 - (t - 0.25) * 4, 1, 0]; // Yellow to green
          } else if (t < 0.75) {
            controlColor = [0, 1, (t - 0.5) * 4]; // Green to cyan
          } else {
            controlColor = [0, 1 - (t - 0.75) * 4, 1]; // Cyan to blue
          }
        } else {
          controlColor = baseColor || [0, 0.7, 1]; // Default blue-cyan
        }

        // Create control
        const createParams: any = {
          name: controlName,
          shape: controlShape,
          targetJointIds: [joint.id],
          color: controlColor,
          size: controlSize,
          spaceType: "object",
        };

        if (customMeshId && controlShape === "custom") {
          createParams.customMeshId = customMeshId;
        }

        const controlResult =
          await tool.createRigControls.execute(
            createParams
          );
        controlIds.push(controlResult.id);

        // Position control relative to joint
        const offset = offsetMultiplier; // Use offset multiplier
        await tool.batchTransform.execute({
          items: [
            {
              id: controlResult.id,
              position: joint.position.map((v, i) =>
                i === 1 ? v + offset : v
              ), // Offset in Y by default
              space: "world",
            },
          ],
        });

        // Add to group hierarchy if created
        if (createGroupHierarchy) {
          const parentGroupId =
            groupByJointId?.get(joint.id) || rootGroupId;
          await tool.batchSetParent.execute({
            items: [
              {
                id: controlResult.id,
                parentId: parentGroupId,
              },
            ],
            maintainWorldTransform: true,
          });
        }

        // Create constraint to connect control to joint
        await tool.createConstraint.execute({
          name: `${controlName}_constraint`,
          type: "parent",
          sourceId: controlResult.id,
          targetId: joint.id,
          influence: 1,
          maintainOffset: true,
          space: "world",
        });
      }

      return {
        success: true,
        controlIds,
        controlGroups: createGroupHierarchy
          ? groupIds
          : undefined,
      };
    },
  }),

  /**
   * Create an IK/FK switch setup for a limb chain
   */
  createIKFKSwitch: defineCompoundTool({
    description:
      "Create an IK/FK switching setup for a limb chain",
    parameters: z.object({
      jointIds: z
        .array(z.string())
        .min(3)
        .describe("Joint chain IDs (from root to tip)"),
      rigId: z.string().describe("ID of the rig"),
      switchName: z
        .string()
        .describe("Name for the IK/FK switch control"),
      ikControlShape: z
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
        .default("square")
        .describe("Shape for IK control"),
      fkControlShape: z
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
        .default("circle")
        .describe("Shape for FK controls"),
      ikColor: Color.optional()
        .default([1, 0.2, 0.2])
        .describe("Color for IK controls"),
      fkColor: Color.optional()
        .default([0.2, 0.4, 1])
        .describe("Color for FK controls"),
      createPoleVector: z
        .boolean()
        .default(true)
        .describe(
          "Whether to create a pole vector control"
        ),
      poleVectorDistance: z
        .number()
        .positive()
        .default(2)
        .describe("Distance for pole vector control"),
    }),
    returns: OperationResponse.extend({
      switchControlId: z
        .string()
        .describe("ID of the switch control"),
      ikControlId: z
        .string()
        .describe("ID of the IK control"),
      fkControlIds: z
        .array(z.string())
        .describe("IDs of FK controls"),
      poleVectorId: z
        .string()
        .optional()
        .describe(
          "ID of the pole vector control if created"
        ),
    }),
    execute: async (params) => {
      const {
        jointIds,
        rigId,
        switchName,
        ikControlShape,
        fkControlShape,
        ikColor,
        fkColor,
        createPoleVector,
        poleVectorDistance,
      } = params;

      if (jointIds.length < 3) {
        return {
          success: false,
          error:
            "Need at least 3 joints for an IK/FK setup",
        };
      }

      // Get joint information
      const jointData = await Promise.all(
        jointIds.map(async (id) => {
          const jointInfo = await tool.getProperty.execute({
            id,
            propertyPath: "name",
          });

          const positionResult =
            await tool.getProperty.execute({
              id,
              propertyPath: "position",
            });

          return {
            id,
            name: jointInfo.value,
            position: positionResult.value,
          };
        })
      );

      // Create container group
      const groupResult = await tool.createGroup.execute({
        name: `${switchName}_IKFK_GRP`,
      });

      // Create IK chain
      const ikChainResult =
        await tool.createIKChains.execute({
          name: `${switchName}_IK`,
          startId: jointIds[0],
          endId: jointIds[jointIds.length - 1],
          solverType: "analytic",
          enabled: true,
          influence: 0,
        });

      // Create IK control
      const ikControlResult =
        await tool.createRigControls.execute({
          name: `${switchName}_IK_CTRL`,
          shape: ikControlShape,
          targetJointIds: [jointIds[jointIds.length - 1]],
          color: ikColor,
          size: 1.2,
          spaceType: "world",
        });

      // Position IK control at the end effector
      const endEffectorPos =
        jointData[jointData.length - 1].position;
      await tool.batchTransform.execute({
        items: [
          {
            id: ikControlResult.id,
            position: endEffectorPos,
            space: "world",
          },
        ],
      });

      // Create pole vector if requested
      let poleVectorId = null;
      if (createPoleVector) {
        // Determine pole vector position
        // For simplicity, use middle joint position and offset perpendicular to the chain
        const midJoint = jointData[1];
        const startToEnd = [
          jointData[jointData.length - 1].position[0] -
            jointData[0].position[0],
          jointData[jointData.length - 1].position[1] -
            jointData[0].position[1],
          jointData[jointData.length - 1].position[2] -
            jointData[0].position[2],
        ];

        // Get a perpendicular vector (simple version)
        let perpendicular;
        if (
          Math.abs(startToEnd[0]) > Math.abs(startToEnd[1])
        ) {
          perpendicular = [
            -startToEnd[1],
            startToEnd[0],
            0,
          ];
        } else {
          perpendicular = [
            0,
            -startToEnd[2],
            startToEnd[1],
          ];
        }

        // Normalize and scale
        const length = Math.sqrt(
          perpendicular[0] * perpendicular[0] +
            perpendicular[1] * perpendicular[1] +
            perpendicular[2] * perpendicular[2]
        );

        const polePosition = [
          midJoint.position[0] +
            (perpendicular[0] / length) *
              poleVectorDistance,
          midJoint.position[1] +
            (perpendicular[1] / length) *
              poleVectorDistance,
          midJoint.position[2] +
            (perpendicular[2] / length) *
              poleVectorDistance,
        ];

        // Create pole vector control
        const poleResult =
          await tool.createRigControls.execute({
            name: `${switchName}_POLE_CTRL`,
            shape: "pyramid",
            color: ikColor,
            size: 0.8,
            spaceType: "world",
          });

        poleVectorId = poleResult.id;

        // Position pole vector
        await tool.batchTransform.execute({
          items: [
            {
              id: poleVectorId,
              position: polePosition,
              space: "world",
            },
          ],
        });

        // Connect pole vector to IK chain
        await tool.updateIKChains.execute({
          id: ikChainResult.id,
          poleTargetId: poleVectorId,
        });
      }

      // Create FK controls
      const fkControlIds = [];
      for (let i = 0; i < jointIds.length - 1; i++) {
        const joint = jointData[i]!;

        const fkControlResult =
          await tool.createRigControls.execute({
            name: `${joint.name}_FK_CTRL`,
            shape: fkControlShape,
            targetJointIds: [joint.id],
            color: fkColor,
            size: 1,
            spaceType: "object",
          });

        fkControlIds.push(fkControlResult.id);

        // Position at joint
        await tool.batchTransform.execute({
          items: [
            {
              id: fkControlResult.id,
              position: joint.position,
              space: "world",
            },
          ],
        });

        // Connect FK control to joint
        await tool.createConstraints.execute({
          name: `${joint.name}_FK_constraint`,
          type: "parent",
          sourceId: fkControlResult.id,
          targetId: joint.id,
          influence: 0, // Start with FK disabled
          maintainOffset: false,
          space: "world",
        });

        // If not the first joint, parent to previous control
        if (i > 0) {
          await tool.batchSetParent.execute({
            items: [
              {
                id: fkControlResult.id,
                parentId: fkControlIds[i - 1],
              },
            ],
            maintainWorldTransform: true,
          });
        }
      }

      // Create switch control
      const switchControlResult =
        await tool.createRigControls.execute({
          items: [
            {
              name: switchName,
              shape: "cube",
              color: [0.8, 0.8, 0.2],
              size: 0.5,
              spaceType: "world",
              channelControl: {
                // Only allow the tx channel for the switch value
                tx: true,
                ty: false,
                tz: false,
                rx: false,
                ry: false,
                rz: false,
                sx: false,
                sy: false,
                sz: false,
              },
            },
          ],
        });

      // Position switch control
      await tool.batchTransform.execute({
        items: [
          {
            id: switchControlResult.id,
            position: [
              jointData[0]!.position[0] + 2,
              jointData[0]!.position[1],
              jointData[0]!.position[2],
            ],
            scale: [1, 0.2, 0.2],
            space: "world",
          },
        ],
      });

      // Connect everything to the group
      await tool.batchSetParent.execute({
        items: [
          {
            id: switchControlResult.id,
            parentId: groupResult.id,
          },
          {
            id: ikControlResult.id,
            parentId: groupResult.id,
          },
          { id: fkControlIds[0], parentId: groupResult.id },
        ].concat(
          poleVectorId
            ? [
                {
                  id: poleVectorId,
                  parentId: groupResult.id,
                },
              ]
            : []
        ),
        maintainWorldTransform: true,
      });

      // Create driver expressions to control the switch
      // This would connect the switch control value to the IK/FK influence values

      // Create SDK relationship between switch and constraints
      // In a real implementation, these would connect through the 3D software's
      // native expression system, which would require specific atomic tools

      return {
        success: true,
        switchControlId: switchControlResult.id,
        ikControlId: ikControlResult.id,
        fkControlIds,
        poleVectorId: poleVectorId || undefined,
      };
    },
  }),
};

/**
 * Combined tools for execution in compound operations
 */
const tool = {
  ...coreAtomicToolsWithExecute,
  ...rigAtomicToolsWithExecute,
};

export { rigCompoundedTools };
