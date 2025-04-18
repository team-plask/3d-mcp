import { z } from "zod";
import { _OperationResponse } from "../core";
import { createExecutableTools } from "../core/request";

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
      "Creates a new geometry object. Starting point for every geometry creation.",
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
  addNode: {
    description:
      "Adds a new node to the current edited geometry. Use 'getNodeTypes' to get the available node types.",
    parameters: z.object({
      type: z.string().describe("Node type"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string().describe("Created node identifier"),
    }),
  },
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
        .enum(["Arctan2", "Multiply", "Add", "Sine"])
        .describe("Math operation"),
    }),
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
  setNodeProperty: {
    description:
      "Sets an input default value of a node. For the available inputs and their type, use 'getNodeInputsOutputs'. Note that vectors are written Vector(x, y, z)",
    parameters: z.object({
      nodeId: z.string().describe("Node identifier"),
      property: z.string().describe("Property name"),
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
} as const;

export type GeometryTool = keyof typeof geometryAtomicTools;

const geometryAtomicToolsWithExecute =
  createExecutableTools(geometryAtomicTools);

export { geometryAtomicToolsWithExecute };
