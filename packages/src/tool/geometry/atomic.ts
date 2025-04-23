import { z } from "zod";
import { _OperationResponse } from "../core";
import { createExecutableTools } from "../core/request";
import { blNodeType } from "../../../scripts/generators/python/geo-node-types.generated";

// Define base port types
const PORT_TYPE = z
  .enum([
    "int",
    "float",
    "vec2",
    "vec3",
    "vec4",
    "bool",
    "string",
    "geometry",
    "material",
  ])
  .describe("Base data types for geometry nodes");

// Define port structure
const PORT = z.object({
  name: z.string().describe("Port name"),
  type: PORT_TYPE.describe("Port data type"),
  description: z
    .string()
    .optional()
    .describe("Description of what this port does"),
});

// Create a NodeDefinition type to document each node type
const NODE_DEFINITION = z.object({
  type: z.string().describe("Unique node type identifier"),
  description: z.string().describe("Description of what this node does"),
  inputs: z.array(PORT).describe("Available input ports"),
  outputs: z.array(PORT).describe("Available output ports"),
  properties: z.record(z.any()).optional().describe("Configurable properties"),
});

// Define node catalog
const NODE_CATALOG = {
  mesh_cube: {
    type: "mesh_cube",
    description: "Creates a cube mesh geometry",
    inputs: [],
    outputs: [
      {
        name: "geometry",
        type: "geometry",
        description: "The output cube geometry",
      },
    ],
    properties: {
      size: {
        type: "vec3",
        default: [1, 1, 1],
        description: "Width, height, depth of the cube",
      },
      verticesX: {
        type: "int",
        default: 2,
        description: "Number of vertices along X axis",
      },
      verticesY: {
        type: "int",
        default: 2,
        description: "Number of vertices along Y axis",
      },
      verticesZ: {
        type: "int",
        default: 2,
        description: "Number of vertices along Z axis",
      },
    },
  },
  mesh_cylinder: {
    type: "mesh_cylinder",
    description: "Creates a cylinder mesh geometry",
    inputs: [],
    outputs: [
      {
        name: "geometry",
        type: "geometry",
        description: "The output cylinder geometry",
      },
    ],
    properties: {
      vertices: {
        type: "int",
        default: 32,
        description: "Number of vertices around the circumference",
      },
      radius: {
        type: "float",
        default: 1,
        description: "Radius of the cylinder",
      },
      depth: {
        type: "float",
        default: 2,
        description: "Depth of the cylinder",
      },
    },
  },
  mesh_sphere: {
    type: "mesh_sphere",
    description: "Creates a sphere mesh geometry",
    inputs: [],
    outputs: [
      {
        name: "geometry",
        type: "geometry",
        description: "The output sphere geometry",
      },
    ],
    properties: {
      radius: {
        type: "float",
        default: 1,
        description: "Radius of the sphere",
      },
      rings: {
        type: "int",
        default: 16,
        description: "Number of horizontal divisions",
      },
      segments: {
        type: "int",
        default: 32,
        description: "Number of vertical divisions",
      },
    },
  },
  output: {
    type: "output",
    description: "Final output node for the geometry",
    inputs: [
      {
        name: "geometry",
        type: "geometry",
        description: "Input geometry to output",
      },
    ],
    outputs: [],
    properties: {},
  },
};

// const getNodeDefinition = (nodeType: keyof typeof NODE_CATALOG) => {
//   return NODE_CATALOG[nodeType] || null;
// };

const NODES = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("mesh_cube"),
    properties: z.object({
      size: z.array(z.number()).length(3).optional(),
      verticesX: z.number().optional(),
      verticesY: z.number().optional(),
      verticesZ: z.number().optional(),
    }),
  }),

  z.object({
    type: z.literal("mesh_cylinder"),
    properties: z.object({
      vertices: z.number().int().optional(),
      radius: z.number().optional(),
      depth: z.number().optional(),
    }),
  }),

  z.object({
    type: z.literal("mesh_sphere"),
    properties: z.object({
      radius: z.number().optional(),
      rings: z.number().int().optional(),
      segments: z.number().int().optional(),
    }),
  }),
  z.object({
    type: z.literal("output"),
    properties: z.object({
      geometry: z.string().optional(),
    }),
  }),
]);

const geometryAtomicTools = {
  createGeometry: {
    description:
      "Creates a new geometry object. Starting point for every geometry creation. \
      The geometry is built using a node graph. \
      The node graph output is already added in the node graph, and its id is 'Group Output'. \
      Its input port 'Mesh' is the output of the geometry.",
    parameters: z.object({
      id: z.string().describe("Object identifier. Must be unique."),
    }),
    returns: _OperationResponse,
  },
  startEditGeometry: {
    description: "Starts editing the geometry of an object.",
    parameters: z.object({
      id: z.string().describe("Object identifier"),
    }),
    returns: _OperationResponse,
  },
  endEditGeometry: {
    description: "Ends the current editing of the geometry of an object.",
    parameters: z.object({}),
    returns: _OperationResponse,
  },
  // addNode: {
  //   description:
  //     "Adds a new node to the current edited geometry. Use 'getNodeTypes' to get the available node types.",
  //   parameters: z.object({
  //     type: z.string().describe("Node type"),
  //   }),
  //   returns: _OperationResponse.extend({
  //     nodeId: z.string().describe("Created node identifier"),
  //   }),
  // },
  addNodeMeshCube: {
    description: "Adds a new mesh cube node to the current edited geometry.",
    parameters: z.object({
      Size: z.array(z.number()).length(3).default([1, 1, 1]).optional(),
      Vertices_X: z.number().int().default(2).optional(),
      Vertices_Y: z.number().int().default(2).optional(),
      Vertices_Z: z.number().int().default(2).optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodeMeshCylinder: {
    description:
      "Adds a new mesh cylinder node to the current edited geometry.",
    parameters: z.object({
      Vertices: z.number().int().default(32).optional(),
      Radius: z.number().default(1).optional(),
      Depth: z.number().default(2).optional(),
      Side_Segments: z.number().int().default(1).optional(),
      Fill_Segments: z.number().int().default(1).optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodeMeshUVSphere: {
    description: "Adds a new mesh sphere node to the current edited geometry.",
    parameters: z.object({
      Radius: z.number().default(1).optional(),
      Rings: z.number().int().default(16).optional(),
      Segments: z.number().int().default(32).optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodeMeshCone: {
    description: "Adds a new mesh cone node to the current edited geometry.",
    parameters: z.object({
      Vertices: z.number().int().default(32).optional(),
      Radius_Top: z.number().default(0).optional(),
      Radius_Bottom: z.number().default(1).optional(),
      Depth: z.number().default(2).optional(),
      Side_Segments: z.number().int().default(1).optional(),
      Fill_Segments: z.number().int().default(1).optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodeSetPosition: {
    description: "Adds a new set position node to the current edited geometry.",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodePositionInput: {
    description:
      "Adds a new position input node to the current edited geometry.",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodeMath: {
    description: "Adds a new math node to the current edited geometry.",
    parameters: z.object({
      operation: z
        .enum([
          "ADD",
          "SUBTRACT",
          "MULTIPLY",
          "DIVIDE",
          "MULTIPLY_ADD",
          "POWER",
          "LOGARITHM",
          "SQRT",
          "INVERSE_SQRT",
          "ABSOLUTE",
          "EXPONENT",
          "MINIMUM",
          "MAXIMUM",
          "LESS_THAN",
          "GREATER_THAN",
          "SIGN",
          "COMPARE",
          "SMOOTH_MIN",
          "SMOOTH_MAX",
          "ROUND",
          "FLOOR",
          "CEIL",
          "TRUNC",
          "FRACT",
          "MODULO",
          "FLOORED_MODULO",
          "WRAP",
          "SNAP",
          "PINGPONG",
          "SINE",
          "COSINE",
          "TANGENT",
          "ARCSINE",
          "ARCCOSINE",
          "ARCTANGENT",
          "ARCTAN2",
          "SINH",
          "COSH",
          "TANH",
          "RADIANS",
          "DEGREES",
        ])
        .describe("Math operation"),
    }),
    returns: _OperationResponse,
  },
  addNodeSeparateXYZ: {
    description: "Adds a new separate XYZ node to the current edited geometry.",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  addNodeCombineXYZ: {
    description: "Adds a new combine XYZ node to the current edited geometry.",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  setNodePropertyByIndex: {
    description:
      "Sets an input default value of a node. For the available inputs and their type, use 'getNodeInputsOutputs'. Note that vectors are written Vector(x, y, z)",
    parameters: z.object({
      nodeId: z.string().describe("Node identifier"),
      propertyIndex: z
        .number()
        .describe("Index of the property in the list of inputs"),
      value: z.string().describe("Property value"),
    }),
    returns: _OperationResponse,
  },
  getNodeTypes: {
    description:
      "Returns all available node types that can be added to a geometry",
    parameters: z.object({}),
    returns: _OperationResponse.extend({
      nodeTypes: z.array(z.string()),
    }),
  },
  getNodeInputsOutputs: {
    description:
      "Retrieves all input and output socket names for a node, and checks if input sockets can accept a default_value.",
    parameters: z.object({
      nodeId: z
        .string()
        .describe(
          "The node id to get information about, must exist in the node graph"
        ),
    }),
    returns: _OperationResponse.extend({
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({
          name: z.string(),
          type: z.string(),
        })
        .describe("Node outputs"),
    }),
  },
  connectNodes: {
    description: "Connects two nodes in the current edited geometry.",
    parameters: z.object({
      fromNode: z.string().describe("Node identifier"),
      fromPort: z.string().describe("Port name"),
      toNode: z.string().describe("Node identifier"),
      toPort: z.string().describe("Port name"),
    }),
    returns: _OperationResponse,
  },
  addNodeBatch: {
    description:
      "Adds a batch of nodes to the current edited geometry. The nodes are added in the order they are provided.",
    parameters: z.object({
      nodes: blNodeType!,
    }),
    returns: _OperationResponse.extend({
      nodeIds: z.array(z.string()).describe("Created node identifiers"),
    }),
  },
} as const;

export type GeometryTool = keyof typeof geometryAtomicTools;

const geometryAtomicToolsWithExecute =
  createExecutableTools(geometryAtomicTools);

export { geometryAtomicToolsWithExecute };

const NODE_LIST = [
  { name: "GeometryNodeAttributeStatistic" },
  { name: "GeometryNodeAttributeDomainSize" },
  { name: "GeometryNodeBlurAttribute" },
  { name: "GeometryNodeCaptureAttribute" },
  { name: "GeometryNodeRemoveAttribute" },
  { name: "GeometryNodeStoreNamedAttribute" },
  { name: "ShaderNodeBlackbody" },
  { name: "ShaderNodeValToRGB" },
  { name: "ShaderNodeRGBCurve" },
  { name: "FunctionNodeCombineColor" },
  { name: "ShaderNodeMix" },
  { name: "FunctionNodeSeparateColor" },
  { name: "GeometryNodeInputCurveHandlePositions" },
  { name: "GeometryNodeCurveLength" },
  { name: "GeometryNodeInputTangent" },
  { name: "GeometryNodeInputCurveTilt" },
  { name: "GeometryNodeCurveEndpointSelection" },
  { name: "GeometryNodeCurveHandleTypeSelection" },
  { name: "GeometryNodeInputSplineCyclic" },
  { name: "GeometryNodeSplineLength" },
  { name: "GeometryNodeSplineParameter" },
  { name: "GeometryNodeInputSplineResolution" },
  { name: "GeometryNodeSampleCurve" },
  { name: "GeometryNodeSetCurveNormal" },
  { name: "GeometryNodeSetCurveRadius" },
  { name: "GeometryNodeSetCurveTilt" },
  { name: "GeometryNodeSetCurveHandlePositions" },
  { name: "GeometryNodeCurveSetHandles" },
  { name: "GeometryNodeSetSplineCyclic" },
  { name: "GeometryNodeSetSplineResolution" },
  { name: "GeometryNodeCurveSplineType" },
  { name: "GeometryNodeCurveToMesh" },
  { name: "GeometryNodeCurveToPoints" },
  { name: "GeometryNodeDeformCurvesOnSurface" },
  { name: "GeometryNodeFillCurve" },
  { name: "GeometryNodeFilletCurve" },
  { name: "GeometryNodeInterpolateCurves" },
  { name: "GeometryNodeResampleCurve" },
  { name: "GeometryNodeReverseCurve" },
  { name: "GeometryNodeSubdivideCurve" },
  { name: "GeometryNodeTrimCurve" },
  { name: "GeometryNodeCurveArc" },
  { name: "GeometryNodeCurvePrimitiveBezierSegment" },
  { name: "GeometryNodeCurvePrimitiveCircle" },
  { name: "GeometryNodeCurvePrimitiveLine" },
  { name: "GeometryNodeCurveSpiral" },
  { name: "GeometryNodeCurveQuadraticBezier" },
  { name: "GeometryNodeCurvePrimitiveQuadrilateral" },
  { name: "GeometryNodeCurveStar" },
  { name: "GeometryNodeCurveOfPoint" },
  { name: "GeometryNodeOffsetPointInCurve" },
  { name: "GeometryNodePointsOfCurve" },
  { name: "GeometryNodeGeometryToInstance" },
  { name: "GeometryNodeJoinGeometry" },
  { name: "GeometryNodeInputID" },
  { name: "GeometryNodeInputIndex" },
  { name: "GeometryNodeInputNamedAttribute" },
  { name: "GeometryNodeInputNormal" },
  { name: "GeometryNodeInputPosition" },
  { name: "GeometryNodeInputRadius" },
  { name: "GeometryNodeToolSelection" },
  { name: "GeometryNodeToolActiveElement" },
  { name: "GeometryNodeSetID" },
  { name: "GeometryNodeSetPosition" },
  { name: "GeometryNodeToolSetSelection" },
  { name: "GeometryNodeBake" },
  { name: "GeometryNodeBoundBox" },
  { name: "GeometryNodeConvexHull" },
  { name: "GeometryNodeDeleteGeometry" },
  { name: "GeometryNodeDuplicateElements" },
  { name: "GeometryNodeMergeByDistance" },
  { name: "GeometryNodeSortElements" },
  { name: "GeometryNodeTransform" },
  { name: "GeometryNodeSeparateComponents" },
  { name: "GeometryNodeSeparateGeometry" },
  { name: "GeometryNodeSplitToInstances" },
  { name: "GeometryNodeProximity" },
  { name: "GeometryNodeIndexOfNearest" },
  { name: "GeometryNodeRaycast" },
  { name: "GeometryNodeSampleIndex" },
  { name: "GeometryNodeSampleNearest" },
  { name: "FunctionNodeInputBool" },
  { name: "FunctionNodeInputColor" },
  { name: "GeometryNodeInputImage" },
  { name: "FunctionNodeInputInt" },
  { name: "GeometryNodeInputMaterial" },
  { name: "FunctionNodeInputRotation" },
  { name: "FunctionNodeInputString" },
  { name: "ShaderNodeValue" },
  { name: "FunctionNodeInputVector" },
  { name: "NodeGroupInput" },
  { name: "GeometryNodeTool3DCursor" },
  { name: "GeometryNodeInputActiveCamera" },
  { name: "GeometryNodeCollectionInfo" },
  { name: "GeometryNodeImageInfo" },
  { name: "GeometryNodeIsViewport" },
  { name: "GeometryNodeInputNamedLayerSelection" },
  { name: "GeometryNodeToolMousePosition" },
  { name: "GeometryNodeObjectInfo" },
  { name: "GeometryNodeInputSceneTime" },
  { name: "GeometryNodeSelfObject" },
  { name: "GeometryNodeViewportTransform" },
  { name: "GeometryNodeInstanceOnPoints" },
  { name: "GeometryNodeInstancesToPoints" },
  { name: "GeometryNodeRealizeInstances" },
  { name: "GeometryNodeRotateInstances" },
  { name: "GeometryNodeScaleInstances" },
  { name: "GeometryNodeTranslateInstances" },
  { name: "GeometryNodeSetInstanceTransform" },
  { name: "GeometryNodeInstanceTransform" },
  { name: "GeometryNodeInputInstanceRotation" },
  { name: "GeometryNodeInputInstanceScale" },
  { name: "GeometryNodeReplaceMaterial" },
  { name: "GeometryNodeInputMaterialIndex" },
  { name: "GeometryNodeMaterialSelection" },
  { name: "GeometryNodeSetMaterial" },
  { name: "GeometryNodeSetMaterialIndex" },
  { name: "GeometryNodeInputMeshEdgeAngle" },
  { name: "GeometryNodeInputMeshEdgeNeighbors" },
  { name: "GeometryNodeInputMeshEdgeVertices" },
  { name: "GeometryNodeEdgesToFaceGroups" },
  { name: "GeometryNodeInputMeshFaceArea" },
  { name: "GeometryNodeMeshFaceSetBoundaries" },
  { name: "GeometryNodeInputMeshFaceNeighbors" },
  { name: "GeometryNodeToolFaceSet" },
  { name: "GeometryNodeInputMeshFaceIsPlanar" },
  { name: "GeometryNodeInputShadeSmooth" },
  { name: "GeometryNodeInputEdgeSmooth" },
  { name: "GeometryNodeInputMeshIsland" },
  { name: "GeometryNodeInputShortestEdgePaths" },
  { name: "GeometryNodeInputMeshVertexNeighbors" },
  { name: "GeometryNodeSampleNearestSurface" },
  { name: "GeometryNodeSampleUVSurface" },
  { name: "GeometryNodeToolSetFaceSet" },
  { name: "GeometryNodeSetShadeSmooth" },
  { name: "GeometryNodeDualMesh" },
  { name: "GeometryNodeEdgePathsToCurves" },
  { name: "GeometryNodeEdgePathsToSelection" },
  { name: "GeometryNodeExtrudeMesh" },
  { name: "GeometryNodeFlipFaces" },
  { name: "GeometryNodeMeshBoolean" },
  { name: "GeometryNodeMeshToCurve" },
  { name: "GeometryNodeMeshToDensityGrid" },
  { name: "GeometryNodeMeshToPoints" },
  { name: "GeometryNodeMeshToSDFGrid" },
  { name: "GeometryNodeMeshToVolume" },
  { name: "GeometryNodeScaleElements" },
  { name: "GeometryNodeSplitEdges" },
  { name: "GeometryNodeSubdivideMesh" },
  { name: "GeometryNodeSubdivisionSurface" },
  { name: "GeometryNodeTriangulate" },
  { name: "GeometryNodeMeshCone" },
  { name: "GeometryNodeMeshCube" },
  { name: "GeometryNodeMeshCylinder" },
  { name: "GeometryNodeMeshGrid" },
  { name: "GeometryNodeMeshIcoSphere" },
  { name: "GeometryNodeMeshCircle" },
  { name: "GeometryNodeMeshLine" },
  { name: "GeometryNodeMeshUVSphere" },
  { name: "GeometryNodeImportSTL" },
  { name: "GeometryNodeCornersOfEdge" },
  { name: "GeometryNodeCornersOfFace" },
  { name: "GeometryNodeCornersOfVertex" },
  { name: "GeometryNodeEdgesOfCorner" },
  { name: "GeometryNodeEdgesOfVertex" },
  { name: "GeometryNodeFaceOfCorner" },
  { name: "GeometryNodeOffsetCornerInFace" },
  { name: "GeometryNodeVertexOfCorner" },
  { name: "NodeGroupOutput" },
  { name: "GeometryNodeViewer" },
  { name: "GeometryNodeDistributePointsInVolume" },
  { name: "GeometryNodeDistributePointsInGrid" },
  { name: "GeometryNodeDistributePointsOnFaces" },
  { name: "GeometryNodePoints" },
  { name: "GeometryNodePointsToCurves" },
  { name: "GeometryNodePointsToSDFGrid" },
  { name: "GeometryNodePointsToVertices" },
  { name: "GeometryNodePointsToVolume" },
  { name: "GeometryNodeSetPointRadius" },
  { name: "GeometryNodeStringJoin" },
  { name: "FunctionNodeReplaceString" },
  { name: "FunctionNodeSliceString" },
  { name: "FunctionNodeStringLength" },
  { name: "GeometryNodeStringToCurves" },
  { name: "FunctionNodeValueToString" },
  { name: "FunctionNodeInputSpecialCharacters" },
  { name: "ShaderNodeTexBrick" },
  { name: "ShaderNodeTexChecker" },
  { name: "ShaderNodeTexGradient" },
  { name: "GeometryNodeImageTexture" },
  { name: "ShaderNodeTexMagic" },
  { name: "ShaderNodeTexNoise" },
  { name: "ShaderNodeTexVoronoi" },
  { name: "ShaderNodeTexWave" },
  { name: "ShaderNodeTexWhiteNoise" },
  { name: "GeometryNodeIndexSwitch" },
  { name: "GeometryNodeMenuSwitch" },
  { name: "FunctionNodeRandomValue" },
  { name: "GeometryNodeSwitch" },
  { name: "FunctionNodeAlignEulerToVector" },
  { name: "FunctionNodeRotateEuler" },
  { name: "GeometryNodeAccumulateField" },
  { name: "GeometryNodeFieldAtIndex" },
  { name: "GeometryNodeFieldOnDomain" },
  { name: "FunctionNodeAlignRotationToVector" },
  { name: "FunctionNodeAxesToRotation" },
  { name: "FunctionNodeAxisAngleToRotation" },
  { name: "FunctionNodeEulerToRotation" },
  { name: "FunctionNodeInvertRotation" },
  { name: "FunctionNodeRotateRotation" },
  { name: "FunctionNodeRotateVector" },
  { name: "FunctionNodeRotationToAxisAngle" },
  { name: "FunctionNodeRotationToEuler" },
  { name: "FunctionNodeRotationToQuaternion" },
  { name: "FunctionNodeQuaternionToRotation" },
  { name: "FunctionNodeCombineMatrix" },
  { name: "FunctionNodeCombineTransform" },
  { name: "FunctionNodeInvertMatrix" },
  { name: "FunctionNodeMatrixMultiply" },
  { name: "FunctionNodeProjectPoint" },
  { name: "FunctionNodeSeparateMatrix" },
  { name: "FunctionNodeSeparateTransform" },
  { name: "FunctionNodeTransformDirection" },
  { name: "FunctionNodeTransformPoint" },
  { name: "FunctionNodeTransposeMatrix" },
  { name: "FunctionNodeBooleanMath" },
  { name: "ShaderNodeClamp" },
  { name: "FunctionNodeCompare" },
  { name: "ShaderNodeFloatCurve" },
  { name: "FunctionNodeFloatToInt" },
  { name: "ShaderNodeMapRange" },
  { name: "ShaderNodeMath" },
  { name: "ShaderNodeMix" },
  { name: "GeometryNodeUVPackIslands" },
  { name: "GeometryNodeUVUnwrap" },
  { name: "ShaderNodeVectorCurve" },
  { name: "ShaderNodeVectorMath" },
  { name: "ShaderNodeVectorRotate" },
  { name: "ShaderNodeCombineXYZ" },
  { name: "ShaderNodeMix" },
  { name: "ShaderNodeSeparateXYZ" },
  { name: "GeometryNodeGetNamedGrid" },
  { name: "GeometryNodeStoreNamedGrid" },
  { name: "GeometryNodeSampleGrid" },
  { name: "GeometryNodeSampleGridIndex" },
  { name: "GeometryNodeVolumeToMesh" },
  { name: "GeometryNodeGridToMesh" },
  { name: "GeometryNodeSDFGridBoolean" },
  { name: "GeometryNodeVolumeCube" },
];
