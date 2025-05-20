// Auto-generated file. Do not edit manually.

import { z } from "zod";
import { _OperationResponse } from "../core";

export default {
  // Auto-generated tools
  addShaderNodeValue: {
    description:
      "Adds a ShaderNodeValue node to the graph. Input numerical values to other nodes in the tree",
    parameters: z.object({
      name: z.string().optional(),
      Value: z.number().optional().describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeValToRGB: {
    description:
      "Adds a ShaderNodeValToRGB node to the graph. Map values to colors with the use of a gradient",
    parameters: z.object({
      name: z.string().optional(),
      Fac: z
        .number()
        .optional()
        .default(0.5)
        .describe(
          "          'The value used to map onto the color gradient. 0.0 results in the leftmost color, '          'while 1.0 results in the rightmost. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeVectorCurve: {
    description:
      "Adds a ShaderNodeVectorCurve node to the graph. Map input vector components with curves",
    parameters: z.object({
      name: z.string().optional(),
      Fac: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Amount of influence the node exerts on the output vector. Type : Float"
        ),
      Vector: z
        .array(z.number())
        .optional()
        .describe(
          "      'Vector which would be mapped to the curve. Type : Vector"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeRGBCurve: {
    description:
      "Adds a ShaderNodeRGBCurve node to the graph. Apply color corrections for each color channel",
    parameters: z.object({
      name: z.string().optional(),
      Fac: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Amount of influence the node exerts on the output vector. Type : Float"
        ),
      Vector: z
        .array(z.number())
        .optional()
        .describe(
          "      'Vector which would be mapped to the curve. Type : Vector"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeMapRange: {
    description:
      "Adds a ShaderNodeMapRange node to the graph. Remap a value from a range to a target range",
    parameters: z.object({
      name: z.string().optional(),
      Value: z.number().optional().default(1).describe(". Type : Float"),
      From__Min: z.number().optional().describe(". Type : Float"),
      From__Max: z.number().optional().default(1).describe(". Type : Float"),
      To__Min: z.number().optional().describe(". Type : Float"),
      To__Max: z.number().optional().default(1).describe(". Type : Float"),
      Steps: z.number().optional().default(4).describe(". Type : Float"),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
      "From_Min_FLOAT3": z
        .array(z.number())
        .optional()
        .describe(". Type : Vector"),
      "To_Min_FLOAT3": z
        .array(z.number())
        .optional()
        .describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeClamp: {
    description:
      "Adds a ShaderNodeClamp node to the graph. Clamp a value between a minimum and a maximum",
    parameters: z.object({
      name: z.string().optional(),
      Value: z.number().optional().default(1).describe(". Type : Float"),
      Min: z.number().optional().default(0).describe(". Type : Float"),
      Max: z.number().optional().default(1).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeMath: {
    description:
      "Adds a ShaderNodeMath node to the graph. Perform math operations",
    parameters: z.object({
      name: z.string().optional(),
      Value: z.number().optional().default(0.5).describe(". Type : Float"),
      "Value_001": z
        .number()
        .optional()
        .default(0.5)
        .describe(". Type : Float"),
      "Value_002": z
        .number()
        .optional()
        .default(0.5)
        .describe(". Type : Float"),
      operation: z
        .string()
        .optional()
        .default("ADD")
        .describe(
          "The operation to perform on the values. Can be one of the following: 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES'. Type : String"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeVectorMath: {
    description:
      "Adds a ShaderNodeVectorMath node to the graph. Perform vector math operation",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
      "Vector_001": z.array(z.number()).optional().describe(". Type : Vector"),
      "Vector_002": z.array(z.number()).optional().describe(". Type : Vector"),
      Scale: z.number().optional().default(1).describe(". Type : Float"),
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
          "DEGREE",
        ])
        .describe(
          "The operation to perform on the vectors. Can be one of the following: ADD, SUBTRACT,MULTIPLY,DIVIDE,MULTIPLY_ADD,POWER,LOGARITHM,SQRT,INVERSE_SQRT,ABSOLUTE,EXPONENT,MINIMUM,MAXIMUM,LESS_THAN,GREATER_THAN,SIGN,COMPARE,SMOOTH_MIN,SMOOTH_MAX,ROUND,FLOOR,CEIL,TRUNC,FRACT,MODULO,FLOORED_MODULO,WRAP,SNAP,PINGPONG,SINE,COSINE,TANGENT,ARCSINE,ARCCOSINE,ARCTANGENT,ARCTAN2,SINH,COSH,TANH,RADIANS,DEGREES"
        )
        .default("ADD"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeBlackbody: {
    description:
      "Adds a ShaderNodeBlackbody node to the graph. Convert a blackbody temperature to an RGB value",
    parameters: z.object({
      name: z.string().optional(),
      Temperature: z
        .number()
        .optional()
        .default(1500)
        .describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexGradient: {
    description:
      "Adds a ShaderNodeTexGradient node to the graph. Generate interpolated color and intensity values based on the input vector",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexNoise: {
    description:
      "Adds a ShaderNodeTexNoise node to the graph. Generate fractal Perlin noise",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexMagic: {
    description:
      "Adds a ShaderNodeTexMagic node to the graph. Generate a psychedelic color texture",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
      Scale: z
        .number()
        .optional()
        .default(5)
        .describe("      'Scale of the texture. Type : Float"),
      Distortion: z
        .number()
        .optional()
        .default(1)
        .describe("Amount of distortion. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexWave: {
    description:
      "Adds a ShaderNodeTexWave node to the graph. Generate procedural bands or rings with noise",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
      Scale: z
        .number()
        .optional()
        .default(5)
        .describe("      'Overall texture scale. Type : Float"),
      Distortion: z
        .number()
        .optional()
        .default(0)
        .describe("Amount of distortion of the wave. Type : Float"),
      Detail: z
        .number()
        .optional()
        .default(2)
        .describe("      'Amount of distortion noise detail. Type : Float"),
      Detail__Scale: z
        .number()
        .optional()
        .default(1)
        .describe("Scale of distortion noise. Type : Float"),
      Detail__Roughness: z
        .number()
        .optional()
        .default(0.5)
        .describe(
          "Blend between a smoother noise pattern, and rougher with sharper peaks. Type : Float"
        ),
      Phase__Offset: z
        .number()
        .optional()
        .default(0)
        .describe(
          "          'Position of the wave along the Bands Direction.\n'          'This can be used as an input for more control over the distortion. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexVoronoi: {
    description:
      "Adds a ShaderNodeTexVoronoi node to the graph. Generate Worley noise based on the distance to random points. Typically used to generate textures such as stones, water, or biological cells",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexChecker: {
    description:
      "Adds a ShaderNodeTexChecker node to the graph. Generate a checkerboard texture",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexBrick: {
    description:
      "Adds a ShaderNodeTexBrick node to the graph. Generate a procedural texture producing bricks",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeVectorRotate: {
    description:
      "Adds a ShaderNodeVectorRotate node to the graph. Rotate a vector around a pivot point (center)",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
      Center: z
        .array(z.number())
        .optional()
        .describe("Point to rotate around. Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeSeparateXYZ: {
    description:
      "Adds a ShaderNodeSeparateXYZ node to the graph. Split a vector into its X, Y, and Z components",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeCombineXYZ: {
    description:
      "Adds a ShaderNodeCombineXYZ node to the graph. Create a vector from X, Y, and Z components",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeTexWhiteNoise: {
    description:
      "Adds a ShaderNodeTexWhiteNoise node to the graph. Return a random value or color based on an input seed",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeFloatCurve: {
    description:
      "Adds a ShaderNodeFloatCurve node to the graph. Map an input float to a curve and outputs a float value",
    parameters: z.object({
      name: z.string().optional(),
      Fac: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Amount of influence the node exerts on the output vector. Type : Float"
        ),
      Vector: z
        .array(z.number())
        .optional()
        .describe(
          "      'Vector which would be mapped to the curve. Type : Vector"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addShaderNodeMix: {
    description:
      "Adds a ShaderNodeMix node to the graph. Mix values by a factor",
    parameters: z.object({
      name: z.string().optional(),
      "Factor_Float": z
        .number()
        .optional()
        .default(0.5)
        .describe("Amount of mixing between the A and B inputs. Type : Float"),
      "A_Float": z
        .number()
        .optional()
        .describe("Value of the first floating number input. Type : Float"),
      "B_Float": z
        .number()
        .optional()
        .describe("Value of the second floating number input. Type : Float"),
      "A_Vector": z
        .array(z.number())
        .optional()
        .describe("Value of the first vector input. Type : Vector"),
      "B_Vector": z
        .array(z.number())
        .optional()
        .describe("Value of the second vector input. Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addFunctionNodeAlignEulerToVector: {
    description:
      "Adds a FunctionNodeAlignEulerToVector node to the graph. Create a rotation from a primary and (ideally orthogonal) secondary axis",
    parameters: z.object({
      name: z.string().optional(),
      Rotation: z.array(z.number()).optional().describe(". Type : Vector"),
      Factor: z.number().optional().default(1).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addFunctionNodeAxisAngleToRotation: {
    description:
      "Adds a FunctionNodeAxisAngleToRotation node to the graph. Construct a 4x4 matrix from its individual values",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addFunctionNodeQuaternionToRotation: {
    description:
      "Adds a FunctionNodeQuaternionToRotation node to the graph. Project a point using a matrix, using location, rotation, scale, and perspective divide",
    parameters: z.object({
      name: z.string().optional(),
      W: z.number().optional().default(1).describe(". Type : Float"),
      X: z.number().optional().default(0).describe(". Type : Float"),
      Y: z.number().optional().default(0).describe(". Type : Float"),
      Z: z.number().optional().default(0).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addFunctionNodeRandomValue: {
    description:
      "Adds a FunctionNodeRandomValue node to the graph. Split a 4x4 matrix into its individual values",
    parameters: z.object({
      name: z.string().optional(),
      Min: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addFunctionNodeRotationToQuaternion: {
    description:
      "Adds a FunctionNodeRotationToQuaternion node to the graph. Add the values of an evaluated field together and output the running total for each element",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeAttributeDomainSize: {
    description:
      "Adds a GeometryNodeAttributeDomainSize node to the graph. Retrieve the number of elements in a geometry for each attribute domain",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeAttributeStatistic: {
    description:
      "Adds a GeometryNodeAttributeStatistic node to the graph. Calculate statistics about a data set from a field evaluated on a geometry",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeBake: {
    description:
      "Adds a GeometryNodeBake node to the graph. Cache the incoming data so that it can be used without recomputation",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeBlurAttribute: {
    description:
      "Adds a GeometryNodeBlurAttribute node to the graph. Mix attribute values of neighboring elements",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeBoundBox: {
    description:
      "Adds a GeometryNodeBoundBox node to the graph. Calculate the limits of a geometry's positions and generate a box mesh with those dimensions",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCaptureAttribute: {
    description:
      "Adds a GeometryNodeCaptureAttribute node to the graph. Store the result of a field on a geometry and output the data as a node socket. Allows remembering or interpolating data as the geometry changes, such as positions before deformation",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCollectionInfo: {
    description:
      "Adds a GeometryNodeCollectionInfo node to the graph. Retrieve geometry instances from a collection",
    parameters: z.object({
      name: z.string().optional(),
      Separate__Children: z
        .boolean()
        .optional()
        .describe(
          "          'Output each child of the collection as a separate instance, sorted alphabetically. Type : Bool"
        ),
      Reset__Children: z
        .boolean()
        .optional()
        .describe(
          "          'Reset the transforms of every child instance in the output. Only used when Separate '          'Children is enabled. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeConvexHull: {
    description:
      "Adds a GeometryNodeConvexHull node to the graph. Create a mesh that encloses all points in the input geometry with the smallest number of points",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveEndpointSelection: {
    description:
      "Adds a GeometryNodeCurveEndpointSelection node to the graph. Provide a selection for an arbitrary number of endpoints in each spline",
    parameters: z.object({
      name: z.string().optional(),
      Start__Size: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "The amount of points to select from the start of each spline. Type : Int"
        ),
      End__Size: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "The amount of points to select from the end of each spline. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveHandleTypeSelection: {
    description:
      "Adds a GeometryNodeCurveHandleTypeSelection node to the graph. Provide a selection based on the handle types of Bézier control points",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveLength: {
    description:
      "Adds a GeometryNodeCurveLength node to the graph. Retrieve the length of all splines added together",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveArc: {
    description:
      "Adds a GeometryNodeCurveArc node to the graph. Generate a poly spline arc",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurvePrimitiveBezierSegment: {
    description:
      "Adds a GeometryNodeCurvePrimitiveBezierSegment node to the graph. Generate a 2D Bézier spline from the given control points and handles",
    parameters: z.object({
      name: z.string().optional(),
      Resolution: z
        .number()
        .int()
        .optional()
        .default(16)
        .describe("The number of evaluated points on the curve. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurvePrimitiveCircle: {
    description:
      "Adds a GeometryNodeCurvePrimitiveCircle node to the graph. Generate a poly spline circle",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurvePrimitiveLine: {
    description:
      "Adds a GeometryNodeCurvePrimitiveLine node to the graph. Generate a poly spline line with two points",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveQuadraticBezier: {
    description:
      "Adds a GeometryNodeCurveQuadraticBezier node to the graph. Generate a poly spline in a parabola shape with control points positions",
    parameters: z.object({
      name: z.string().optional(),
      Resolution: z
        .number()
        .int()
        .optional()
        .default(16)
        .describe("The number of edges on the curve. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurvePrimitiveQuadrilateral: {
    description:
      "Adds a GeometryNodeCurvePrimitiveQuadrilateral node to the graph. Generate a polygon with four points",
    parameters: z.object({
      name: z.string().optional(),
      Width: z
        .number()
        .optional()
        .default(2)
        .describe("The X axis size of the shape. Type : Float"),
      Height: z
        .number()
        .optional()
        .default(2)
        .describe("The Y axis size of the shape. Type : Float"),
      Bottom__Width: z
        .number()
        .optional()
        .default(4)
        .describe("The X axis size of the shape. Type : Float"),
      Top__Width: z
        .number()
        .optional()
        .default(2)
        .describe("The X axis size of the shape. Type : Float"),
      Offset: z
        .number()
        .optional()
        .default(1)
        .describe(
          "          'For Parallelogram, the relative X difference between the top and bottom edges. For '          'Trapezoid, the amount to move the top edge in the positive X axis. Type : Float"
        ),
      Bottom__Height: z
        .number()
        .optional()
        .default(3)
        .describe(
          "The distance between the bottom point and the X axis. Type : Float"
        ),
      Top__Height: z
        .number()
        .optional()
        .default(1)
        .describe(
          "The distance between the top point and the X axis. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveSpiral: {
    description:
      "Adds a GeometryNodeCurveSpiral node to the graph. Generate a poly spline in a spiral shape",
    parameters: z.object({
      name: z.string().optional(),
      Resolution: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe("Number of points in one rotation of the spiral. Type : Int"),
      Rotations: z
        .number()
        .optional()
        .default(2)
        .describe(
          "Number of times the spiral makes a full rotation. Type : Float"
        ),
      Start__Radius: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Horizontal Distance from the Z axis at the start of the spiral. Type : Float"
        ),
      End__Radius: z
        .number()
        .optional()
        .default(2)
        .describe(
          "Horizontal Distance from the Z axis at the end of the spiral. Type : Float"
        ),
      Height: z
        .number()
        .optional()
        .default(2)
        .describe(
          "The height perpendicular to the base of the spiral. Type : Float"
        ),
      Reverse: z
        .boolean()
        .optional()
        .describe(
          "      'Switch the direction from clockwise to counterclockwise. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveStar: {
    description:
      "Adds a GeometryNodeCurveStar node to the graph. Generate a poly spline in a star pattern by connecting alternating points of two circles",
    parameters: z.object({
      name: z.string().optional(),
      Points: z
        .number()
        .int()
        .optional()
        .default(8)
        .describe("Number of points on each of the circles. Type : Int"),
      Inner__Radius: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Radius of the inner circle; can be larger than outer radius. Type : Float"
        ),
      Outer__Radius: z
        .number()
        .optional()
        .default(2)
        .describe(
          "Radius of the outer circle; can be smaller than inner radius. Type : Float"
        ),
      Twist: z
        .number()
        .optional()
        .describe(
          "The counterclockwise rotation of the inner set of points. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveSetHandles: {
    description:
      "Adds a GeometryNodeCurveSetHandles node to the graph. Set the handle type for the control points of a Bézier curve",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSplineParameter: {
    description:
      "Adds a GeometryNodeSplineParameter node to the graph. Retrieve how far along each spline a control point is",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveSplineType: {
    description:
      "Adds a GeometryNodeCurveSplineType node to the graph. Change the type of curves",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveToMesh: {
    description:
      "Adds a GeometryNodeCurveToMesh node to the graph. Convert curves into a mesh, optionally with a custom profile shape defined by curves",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveToPoints: {
    description:
      "Adds a GeometryNodeCurveToPoints node to the graph. Generate a point cloud by sampling positions along curves",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCurveOfPoint: {
    description:
      "Adds a GeometryNodeCurveOfPoint node to the graph. Retrieve the curve a control point is part of",
    parameters: z.object({
      name: z.string().optional(),
      Point__Index: z
        .number()
        .int()
        .optional()
        .describe("The control point to retrieve data from. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodePointsOfCurve: {
    description:
      "Adds a GeometryNodePointsOfCurve node to the graph. Retrieve a point index within a curve",
    parameters: z.object({
      name: z.string().optional(),
      Curve__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The curve to retrieve data from. Defaults to the curve from the context. Type : Int"
        ),
      Weights: z
        .number()
        .optional()
        .describe(
          "      'Values used to sort the curve's points. Uses indices by default. Type : Float"
        ),
      Sort__Index: z
        .number()
        .int()
        .optional()
        .describe("Which of the sorted points to output. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDeformCurvesOnSurface: {
    description:
      "Adds a GeometryNodeDeformCurvesOnSurface node to the graph. Translate and rotate curves based on changes between the object's original and evaluated surface mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDeleteGeometry: {
    description:
      "Adds a GeometryNodeDeleteGeometry node to the graph. Remove selected elements of a geometry",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z
        .boolean()
        .optional()
        .default(true)
        .describe("The parts of the geometry to be deleted. Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDistributePointsInGrid: {
    description:
      "Adds a GeometryNodeDistributePointsInGrid node to the graph. Generate points inside a volume grid",
    parameters: z.object({
      name: z.string().optional(),
      Grid: z.number().optional().describe(". Type : Float"),
      Density: z
        .number()
        .optional()
        .default(1)
        .describe(
          "          'When combined with each voxel's value, determines the number of points to sample per '          'unit volume. Type : Float"
        ),
      Seed: z
        .number()
        .int()
        .optional()
        .describe(
          "      'Seed used by the random number generator to generate random points. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDistributePointsInVolume: {
    description:
      "Adds a GeometryNodeDistributePointsInVolume node to the graph. Generate points inside a volume",
    parameters: z.object({
      name: z.string().optional(),
      Density: z
        .number()
        .optional()
        .default(1)
        .describe("Number of points to sample per unit volume. Type : Float"),
      Seed: z
        .number()
        .int()
        .optional()
        .describe(
          "      'Seed used by the random number generator to generate random points. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDistributePointsOnFaces: {
    description:
      "Adds a GeometryNodeDistributePointsOnFaces node to the graph. Generate points spread out on the surface of a mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDualMesh: {
    description:
      "Adds a GeometryNodeDualMesh node to the graph. Convert Faces into vertices and vertices into faces",
    parameters: z.object({
      name: z.string().optional(),
      Keep__Boundaries: z
        .boolean()
        .optional()
        .default(false)
        .describe(
          "          'Keep non-manifold boundaries of the input mesh in place by avoiding the dual '          'transformation there. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeDuplicateElements: {
    description:
      "Adds a GeometryNodeDuplicateElements node to the graph. Generate an arbitrary number copies of each selected input element",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Amount: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "      'The number of duplicates to create for each element. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeEdgePathsToCurves: {
    description:
      "Adds a GeometryNodeEdgePathsToCurves node to the graph. Output curves following paths across mesh edges",
    parameters: z.object({
      name: z.string().optional(),
      Start__Vertices: z
        .boolean()
        .optional()
        .default(true)
        .describe(". Type : Bool"),
      Next__Vertex__Index: z
        .number()
        .int()
        .optional()
        .default(-1)
        .describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeEdgePathsToSelection: {
    description:
      "Adds a GeometryNodeEdgePathsToSelection node to the graph. Output a selection of edges by following paths across mesh edges",
    parameters: z.object({
      name: z.string().optional(),
      Start__Vertices: z
        .boolean()
        .optional()
        .default(true)
        .describe(". Type : Bool"),
      Next__Vertex__Index: z
        .number()
        .int()
        .optional()
        .default(-1)
        .describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeEdgesToFaceGroups: {
    description:
      "Adds a GeometryNodeEdgesToFaceGroups node to the graph. Group faces into regions surrounded by the selected boundary edges",
    parameters: z.object({
      name: z.string().optional(),
      Boundary__Edges: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "Edges used to split faces into separate groups. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeFieldAtIndex: {
    description:
      "Adds a GeometryNodeFieldAtIndex node to the graph. Retrieve data of other elements in the context's geometry",
    parameters: z.object({
      name: z.string().optional(),
      Index: z.number().int().optional().describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeFieldOnDomain: {
    description:
      "Adds a GeometryNodeFieldOnDomain node to the graph. Retrieve values from a field on a different domain besides the domain from the context",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeExtrudeMesh: {
    description:
      "Adds a GeometryNodeExtrudeMesh node to the graph. Generate new vertices, edges, or faces from selected elements and move them based on an offset while keeping them connected by their boundary",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Offset: z.array(z.number()).optional().describe(". Type : Vector"),
      Offset__Scale: z
        .number()
        .optional()
        .default(1)
        .describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeFillCurve: {
    description:
      "Adds a GeometryNodeFillCurve node to the graph. Generate a mesh on the XY plane with faces on the inside of input curves",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeFilletCurve: {
    description:
      "Adds a GeometryNodeFilletCurve node to the graph. Round corners by generating circular arcs on each control point",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeFlipFaces: {
    description:
      "Adds a GeometryNodeFlipFaces node to the graph. Reverse the order of the vertices and edges of selected faces, flipping their normal direction",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeGeometryToInstance: {
    description:
      "Adds a GeometryNodeGeometryToInstance node to the graph. Convert each input geometry into an instance, which can be much faster than the Join Geometry node when the inputs are large",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeGetNamedGrid: {
    description:
      "Adds a GeometryNodeGetNamedGrid node to the graph. Get volume grid from a volume geometry with the specified name",
    parameters: z.object({
      name: z.string().optional(),
      Name: z.string().optional().describe(". Type : String"),
      Remove: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeGridToMesh: {
    description:
      "Adds a GeometryNodeGridToMesh node to the graph. Retrieve information about an image",
    parameters: z.object({
      name: z.string().optional(),
      Grid: z.number().optional().describe(". Type : Float"),
      Threshold: z
        .number()
        .optional()
        .default(0.1)
        .describe(
          "Values larger than the threshold are inside the generated mesh. Type : Float"
        ),
      Adaptivity: z.number().optional().describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeImageTexture: {
    description:
      "Adds a GeometryNodeImageTexture node to the graph. Sample values from an image texture",
    parameters: z.object({
      name: z.string().optional(),
      Vector: z
        .array(z.number())
        .optional()
        .describe("Texture coordinates from 0 to 1. Type : Vector"),
      Frame: z.number().int().optional().describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputImage: {
    description: "Adds a GeometryNodeInputImage node to the graph. Input image",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeImportSTL: {
    description:
      "Adds a GeometryNodeImportSTL node to the graph. Import a mesh from an STL file",
    parameters: z.object({
      name: z.string().optional(),
      Path: z
        .string()
        .optional()
        .default("")
        .describe("Path to a STL file. Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeIndexOfNearest: {
    description:
      "Adds a GeometryNodeIndexOfNearest node to the graph. Choose between an arbitrary number of values with an index",
    parameters: z.object({
      name: z.string().optional(),
      Position: z.array(z.number()).optional().describe(". Type : Vector"),
      Group__ID: z.number().int().optional().describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputActiveCamera: {
    description:
      "Adds a GeometryNodeInputActiveCamera node to the graph. Retrieve the scene's active camera",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputCurveHandlePositions: {
    description:
      "Adds a GeometryNodeInputCurveHandlePositions node to the graph. Retrieve the position of each Bézier control point's handles",
    parameters: z.object({
      name: z.string().optional(),
      Relative: z
        .boolean()
        .optional()
        .default(false)
        .describe(
          "          'Output the handle positions relative to the corresponding control point '          'instead of in the local space of the geometry. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputCurveTilt: {
    description:
      "Adds a GeometryNodeInputCurveTilt node to the graph. Retrieve the angle at each control point used to twist the curve's normal around its tangent",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputEdgeSmooth: {
    description:
      "Adds a GeometryNodeInputEdgeSmooth node to the graph. Retrieve whether each edge is marked for smooth or split normals",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputShadeSmooth: {
    description:
      "Adds a GeometryNodeInputShadeSmooth node to the graph. Retrieve whether each face is marked for smooth or sharp normals",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputID: {
    description:
      "Adds a GeometryNodeInputID node to the graph. Retrieve an integer value indicating the position of each element in the list, starting at zero",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputInstanceRotation: {
    description:
      "Adds a GeometryNodeInputInstanceRotation node to the graph. Retrieve the rotation of each instance in the geometry",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputInstanceScale: {
    description:
      "Adds a GeometryNodeInputInstanceScale node to the graph. Retrieve the scale of each instance in the geometry",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMaterialIndex: {
    description:
      "Adds a GeometryNodeInputMaterialIndex node to the graph. Retrieve the index of the material used for each element in the geometry's list of materials",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInstanceTransform: {
    description:
      "Adds a GeometryNodeInstanceTransform node to the graph. Retrieve the full transformation of each instance in the geometry",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMaterial: {
    description:
      "Adds a GeometryNodeInputMaterial node to the graph. Output a single material",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshEdgeAngle: {
    description:
      "Adds a GeometryNodeInputMeshEdgeAngle node to the graph. Calculate the surface area of each face in a mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshEdgeNeighbors: {
    description:
      "Adds a GeometryNodeInputMeshEdgeNeighbors node to the graph. Retrieve the number of faces that use each edge as one of their sides",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshEdgeVertices: {
    description:
      "Adds a GeometryNodeInputMeshEdgeVertices node to the graph. Retrieve topology information relating to each edge of a mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshFaceArea: {
    description:
      "Adds a GeometryNodeInputMeshFaceArea node to the graph. Calculate the surface area of a mesh's faces",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshFaceIsPlanar: {
    description:
      "Adds a GeometryNodeInputMeshFaceIsPlanar node to the graph. Retrieve whether all triangles in a face are on the same plane, i.e. whether they have the same normal",
    parameters: z.object({
      name: z.string().optional(),
      Threshold: z
        .number()
        .optional()
        .default(0.01)
        .describe(
          "          'The distance a point can be from the surface before the face is no longer '          'considered planar. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshFaceNeighbors: {
    description:
      "Adds a GeometryNodeInputMeshFaceNeighbors node to the graph. Retrieve topology information relating to each face of a mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshIsland: {
    description:
      "Adds a GeometryNodeInputMeshIsland node to the graph. Retrieve information about separate connected regions in a mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputMeshVertexNeighbors: {
    description:
      "Adds a GeometryNodeInputMeshVertexNeighbors node to the graph. Retrieve topology information relating to each vertex of a mesh",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputNamedAttribute: {
    description:
      "Adds a GeometryNodeInputNamedAttribute node to the graph. Retrieve the data of a specified attribute",
    parameters: z.object({
      name: z.string().optional(),
      Name: z.string().optional().describe(". Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputNamedLayerSelection: {
    description:
      "Adds a GeometryNodeInputNamedLayerSelection node to the graph. Output a selection of a grease pencil layer",
    parameters: z.object({
      name: z.string().optional(),
      Name: z.string().optional().describe(". Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputNormal: {
    description:
      "Adds a GeometryNodeInputNormal node to the graph. Retrieve a unit length vector indicating the direction pointing away from the geometry at each element",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputPosition: {
    description:
      "Adds a GeometryNodeInputPosition node to the graph. Retrieve a vector indicating the location of each element",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputRadius: {
    description:
      "Adds a GeometryNodeInputRadius node to the graph. Retrieve the radius at each point on curve or point cloud geometry",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputSceneTime: {
    description:
      "Adds a GeometryNodeInputSceneTime node to the graph. Retrieve the current time in the scene's animation in units of seconds or frames",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputShortestEdgePaths: {
    description:
      "Adds a GeometryNodeInputShortestEdgePaths node to the graph. Find the shortest paths along mesh edges to selected end vertices, with customizable cost per edge",
    parameters: z.object({
      name: z.string().optional(),
      End__Vertex: z
        .boolean()
        .optional()
        .default(false)
        .describe(". Type : Bool"),
      Edge__Cost: z.number().optional().default(1).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputSplineCyclic: {
    description:
      "Adds a GeometryNodeInputSplineCyclic node to the graph. Retrieve whether each spline endpoint connects to the beginning",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSplineLength: {
    description:
      "Adds a GeometryNodeSplineLength node to the graph. Retrieve the total length of each spline, as a distance or as a number of points",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputSplineResolution: {
    description:
      "Adds a GeometryNodeInputSplineResolution node to the graph. Retrieve the number of evaluated points that will be generated for every control point on curves",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInputTangent: {
    description:
      "Adds a GeometryNodeInputTangent node to the graph. Retrieve the direction of curves at each control point",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInstanceOnPoints: {
    description:
      "Adds a GeometryNodeInstanceOnPoints node to the graph. Generate a reference to geometry at each of the input points, without duplicating its underlying data",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInstancesToPoints: {
    description:
      "Adds a GeometryNodeInstancesToPoints node to the graph. Generate points at the origins of instances.\nNote: Nested instances are not affected by this node",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Position: z.array(z.number()).optional().describe(". Type : Vector"),
      Radius: z.number().optional().default(0.05).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeInterpolateCurves: {
    description:
      "Adds a GeometryNodeInterpolateCurves node to the graph. Generate new curves on points by interpolating between existing curves",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeIsViewport: {
    description:
      "Adds a GeometryNodeIsViewport node to the graph. Retrieve whether the nodes are being evaluated for the viewport rather than the final render",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeJoinGeometry: {
    description:
      "Adds a GeometryNodeJoinGeometry node to the graph. Merge separately generated geometries into a single one",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMaterialSelection: {
    description:
      "Adds a GeometryNodeMaterialSelection node to the graph. Provide a selection of faces that use the specified material",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMenuSwitch: {
    description:
      "Adds a GeometryNodeMenuSwitch node to the graph. Select from multiple inputs by name",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMergeByDistance: {
    description:
      "Adds a GeometryNodeMergeByDistance node to the graph. Merge vertices or points within a given distance",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshBoolean: {
    description:
      "Adds a GeometryNodeMeshBoolean node to the graph. Cut, subtract, or join multiple mesh inputs",
    parameters: z.object({
      name: z.string().optional(),
      Self__Intersection: z.boolean().optional().describe(". Type : Bool"),
      Hole__Tolerant: z.boolean().optional().describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshFaceSetBoundaries: {
    description:
      "Adds a GeometryNodeMeshFaceSetBoundaries node to the graph. Find edges on the boundaries between groups of faces with the same ID value",
    parameters: z.object({
      name: z.string().optional(),
      Face__Set: z
        .number()
        .int()
        .optional()
        .default(0)
        .describe(
          "          'An identifier for the group of each face. All contiguous faces with the '          'same value are in the same region. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshCircle: {
    description:
      "Adds a GeometryNodeMeshCircle node to the graph. Generate a circular ring of edges",
    parameters: z.object({
      name: z.string().optional(),
      Vertices: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe("Number of vertices on the circle. Type : Int"),
      Radius: z
        .number()
        .optional()
        .default(1)
        .describe("Distance of the vertices from the origin. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshCone: {
    description:
      "Adds a GeometryNodeMeshCone node to the graph. Generate a cone mesh. The cone is aligned with the Z axis and centered at the origin.",
    parameters: z.object({
      name: z.string().optional(),
      Vertices: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe(
          "Number of points on the circle at the top and bottom. Type : Int"
        ),
      Side__Segments: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "The number of edges running vertically along the side of the cone. Type : Int"
        ),
      Fill__Segments: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "Number of concentric rings used to fill the round face. Type : Int"
        ),
      Radius__Top: z
        .number()
        .optional()
        .describe("Radius of the top circle of the cone. Type : Float"),
      Radius__Bottom: z
        .number()
        .optional()
        .default(1)
        .describe("Radius of the bottom circle of the cone. Type : Float"),
      Depth: z
        .number()
        .optional()
        .default(2)
        .describe("Height of the generated cone. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshCube: {
    description:
      "Adds a GeometryNodeMeshCube node to the graph. Generate a cuboid mesh with variable side lengths and subdivisions",
    parameters: z.object({
      name: z.string().optional(),
      Vertices__X: z
        .number()
        .int()
        .optional()
        .default(2)
        .describe("Number of vertices for the X side of the shape. Type : Int"),
      Vertices__Y: z
        .number()
        .int()
        .optional()
        .default(2)
        .describe("Number of vertices for the Y side of the shape. Type : Int"),
      Vertices__Z: z
        .number()
        .int()
        .optional()
        .default(2)
        .describe("Number of vertices for the Z side of the shape. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshCylinder: {
    description:
      "Adds a GeometryNodeMeshCylinder node to the graph. Generate a cylinder mesh. The cylinder is aligned with the Z axis and centered at the origin.",
    parameters: z.object({
      name: z.string().optional(),
      Vertices: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe(
          "The number of vertices on the top and bottom circles. Type : Int"
        ),
      Side__Segments: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "The number of rectangular segments along each side. Type : Int"
        ),
      Fill__Segments: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "The number of concentric rings used to fill the round faces. Type : Int"
        ),
      Radius: z
        .number()
        .optional()
        .default(1)
        .describe("The radius of the cylinder. Type : Float"),
      Depth: z
        .number()
        .optional()
        .default(2)
        .describe("The height of the cylinder. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshGrid: {
    description:
      "Adds a GeometryNodeMeshGrid node to the graph. Generate a planar mesh on the XY plane",
    parameters: z.object({
      name: z.string().optional(),
      Size__X: z
        .number()
        .optional()
        .default(1)
        .describe("Side length of the plane in the X direction. Type : Float"),
      Size__Y: z
        .number()
        .optional()
        .default(1)
        .describe("Side length of the plane in the Y direction. Type : Float"),
      Vertices__X: z
        .number()
        .int()
        .optional()
        .default(3)
        .describe("Number of vertices in the X direction. Type : Int"),
      Vertices__Y: z
        .number()
        .int()
        .optional()
        .default(3)
        .describe("Number of vertices in the Y direction. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshIcoSphere: {
    description:
      "Adds a GeometryNodeMeshIcoSphere node to the graph. Generate a spherical mesh that consists of equally sized triangles",
    parameters: z.object({
      name: z.string().optional(),
      Radius: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Distance from the generated points to the origin. Type : Float"
        ),
      Subdivisions: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe(
          "Number of subdivisions on top of the basic icosahedron. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshLine: {
    description:
      "Adds a GeometryNodeMeshLine node to the graph. Generate vertices in a line and connect them with edges",
    parameters: z.object({
      name: z.string().optional(),
      Count: z
        .number()
        .int()
        .optional()
        .default(10)
        .describe("      'Number of vertices on the line. Type : Int"),
      Resolution: z
        .number()
        .optional()
        .default(1)
        .describe("Length of each individual edge. Type : Float"),
      Start__Location: z
        .array(z.number())
        .optional()
        .describe("Position of the first vertex. Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshUVSphere: {
    description:
      "Adds a GeometryNodeMeshUVSphere node to the graph. Generate a spherical mesh with quads, except for triangles at the top and bottom",
    parameters: z.object({
      name: z.string().optional(),
      Segments: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe("Horizontal resolution of the sphere. Type : Int"),
      Rings: z
        .number()
        .int()
        .optional()
        .default(16)
        .describe("      'The number of horizontal rings. Type : Int"),
      Radius: z
        .number()
        .optional()
        .default(1)
        .describe(
          "Distance from the generated points to the origin. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshToCurve: {
    description:
      "Adds a GeometryNodeMeshToCurve node to the graph. Generate a curve from a mesh",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshToDensityGrid: {
    description:
      "Adds a GeometryNodeMeshToDensityGrid node to the graph. Create a filled volume grid from a mesh",
    parameters: z.object({
      name: z.string().optional(),
      Density: z.number().optional().default(1).describe(". Type : Float"),
      Voxel__Size: z
        .number()
        .optional()
        .default(0.3)
        .describe(". Type : Float"),
      Gradient__Width: z
        .number()
        .optional()
        .default(0.2)
        .describe("Width of the gradient inside of the mesh. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshToPoints: {
    description:
      "Adds a GeometryNodeMeshToPoints node to the graph. Generate a point cloud from a mesh's vertices",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Position: z.array(z.number()).optional().describe(". Type : Vector"),
      Radius: z.number().optional().default(0.05).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshToSDFGrid: {
    description:
      "Adds a GeometryNodeMeshToSDFGrid node to the graph. Create a signed distance volume grid from a mesh",
    parameters: z.object({
      name: z.string().optional(),
      Voxel__Size: z
        .number()
        .optional()
        .default(0.3)
        .describe(". Type : Float"),
      Band__Width: z
        .number()
        .int()
        .optional()
        .default(3)
        .describe("Width of the active voxel surface, in voxels. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeMeshToVolume: {
    description:
      "Adds a GeometryNodeMeshToVolume node to the graph. Create a fog volume with the shape of the input mesh's surface",
    parameters: z.object({
      name: z.string().optional(),
      Density: z.number().optional().default(1).describe(". Type : Float"),
      Voxel__Size: z
        .number()
        .optional()
        .default(0.3)
        .describe(". Type : Float"),
      Voxel__Amount: z
        .number()
        .optional()
        .default(64)
        .describe(". Type : Float"),
      Interior__Band__Width: z
        .number()
        .optional()
        .default(0.2)
        .describe("Width of the gradient inside of the mesh. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCornersOfEdge: {
    description:
      "Adds a GeometryNodeCornersOfEdge node to the graph. Retrieve face corners connected to edges",
    parameters: z.object({
      name: z.string().optional(),
      Edge__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The edge to retrieve data from. Defaults to the edge from the context. Type : Int"
        ),
      Weights: z
        .number()
        .optional()
        .describe(
          "      'Values that sort the corners attached to the edge. Type : Float"
        ),
      Sort__Index: z
        .number()
        .int()
        .optional()
        .describe("Which of the sorted corners to output. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCornersOfFace: {
    description:
      "Adds a GeometryNodeCornersOfFace node to the graph. Retrieve corners that make up a face",
    parameters: z.object({
      name: z.string().optional(),
      Face__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The face to retrieve data from. Defaults to the face from the context. Type : Int"
        ),
      Weights: z
        .number()
        .optional()
        .describe(
          "      'Values used to sort the face's corners. Uses indices by default. Type : Float"
        ),
      Sort__Index: z
        .number()
        .int()
        .optional()
        .describe("Which of the sorted corners to output. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeCornersOfVertex: {
    description:
      "Adds a GeometryNodeCornersOfVertex node to the graph. Retrieve face corners connected to vertices",
    parameters: z.object({
      name: z.string().optional(),
      Vertex__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The vertex to retrieve data from. Defaults to the vertex from the context. Type : Int"
        ),
      Weights: z
        .number()
        .optional()
        .describe(
          "      'Values used to sort corners attached to the vertex. Uses indices by default. Type : Float"
        ),
      Sort__Index: z
        .number()
        .int()
        .optional()
        .describe("Which of the sorted corners to output. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeEdgesOfCorner: {
    description:
      "Adds a GeometryNodeEdgesOfCorner node to the graph. Retrieve the edges on both sides of a face corner",
    parameters: z.object({
      name: z.string().optional(),
      Corner__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The corner to retrieve data from. Defaults to the corner from the context. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeEdgesOfVertex: {
    description:
      "Adds a GeometryNodeEdgesOfVertex node to the graph. Retrieve the edges connected to each vertex",
    parameters: z.object({
      name: z.string().optional(),
      Vertex__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The vertex to retrieve data from. Defaults to the vertex from the context. Type : Int"
        ),
      Weights: z
        .number()
        .optional()
        .describe(
          "      'Values used to sort the edges connected to the vertex. Uses indices by default. Type : Float"
        ),
      Sort__Index: z
        .number()
        .int()
        .optional()
        .describe("Which of the sorted edges to output. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeFaceOfCorner: {
    description:
      "Adds a GeometryNodeFaceOfCorner node to the graph. Retrieve the face each face corner is part of",
    parameters: z.object({
      name: z.string().optional(),
      Corner__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The corner to retrieve data from. Defaults to the corner from the context. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeOffsetCornerInFace: {
    description:
      "Adds a GeometryNodeOffsetCornerInFace node to the graph. Retrieve corners in the same face as another",
    parameters: z.object({
      name: z.string().optional(),
      Corner__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The corner to retrieve data from. Defaults to the corner from the context. Type : Int"
        ),
      Offset: z
        .number()
        .int()
        .optional()
        .describe(
          "      'The number of corners to move around the face before finding the result, '      'circling around the start of the face if necessary. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeVertexOfCorner: {
    description:
      "Adds a GeometryNodeVertexOfCorner node to the graph. Retrieve the vertex each face corner is attached to",
    parameters: z.object({
      name: z.string().optional(),
      Corner__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The corner to retrieve data from. Defaults to the corner from the context. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeObjectInfo: {
    description:
      "Adds a GeometryNodeObjectInfo node to the graph. Retrieve information from an object",
    parameters: z.object({
      name: z.string().optional(),
      As__Instance: z
        .boolean()
        .optional()
        .describe(
          "          'Output the entire object as single instance. '          'This allows instancing non-geometry object types. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeOffsetPointInCurve: {
    description:
      "Adds a GeometryNodeOffsetPointInCurve node to the graph. Offset a control point index within its curve",
    parameters: z.object({
      name: z.string().optional(),
      Point__Index: z
        .number()
        .int()
        .optional()
        .describe(
          "The index of the control point to evaluate. Defaults to the current index. Type : Int"
        ),
      Offset: z
        .number()
        .int()
        .optional()
        .describe(
          "      'The number of control points along the curve to traverse. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodePointsToCurves: {
    description:
      "Adds a GeometryNodePointsToCurves node to the graph. Split all points to curve by its group ID and reorder by weight",
    parameters: z.object({
      name: z.string().optional(),
      Curve__Group__ID: z
        .number()
        .int()
        .optional()
        .describe(
          "          'A curve is created for every distinct group ID. All points with the same ID are put '          'into the same curve. Type : Int"
        ),
      Weight: z
        .number()
        .optional()
        .describe(
          "      'Determines the order of points in each curve. Type : Float"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodePointsToSDFGrid: {
    description:
      "Adds a GeometryNodePointsToSDFGrid node to the graph. Create a signed distance volume grid from points",
    parameters: z.object({
      name: z.string().optional(),
      Radius: z.number().optional().default(0.5).describe(". Type : Float"),
      Voxel__Size: z
        .number()
        .optional()
        .default(0.3)
        .describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodePointsToVertices: {
    description:
      "Adds a GeometryNodePointsToVertices node to the graph. Generate a mesh vertex for each point cloud point",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodePointsToVolume: {
    description:
      "Adds a GeometryNodePointsToVolume node to the graph. Generate a fog volume sphere around every point",
    parameters: z.object({
      name: z.string().optional(),
      Density: z.number().optional().default(1).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodePoints: {
    description:
      "Adds a GeometryNodePoints node to the graph. Generate a point cloud with positions and radii defined by fields",
    parameters: z.object({
      name: z.string().optional(),
      Count: z
        .number()
        .int()
        .optional()
        .default(1)
        .describe("      'The number of points to create. Type : Int"),
      Radius: z
        .number()
        .optional()
        .default(0.1)
        .describe("The radii of the new points. Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeProximity: {
    description:
      "Adds a GeometryNodeProximity node to the graph. Compute the closest location on the target geometry",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeRaycast: {
    description:
      "Adds a GeometryNodeRaycast node to the graph. Cast rays from the context geometry onto a target geometry, and retrieve information from each hit point",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeRealizeInstances: {
    description:
      "Adds a GeometryNodeRealizeInstances node to the graph. Convert instances into real geometry data",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z
        .boolean()
        .optional()
        .default(true)
        .describe("Which top-level instances to realize. Type : Bool"),
      Realize__All: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "          'Realize all levels of nested instances for a top-level instances. Overrides the value '          'of the Depth input. Type : Bool"
        ),
      Depth: z
        .number()
        .int()
        .optional()
        .default(0)
        .describe(
          "      'Number of levels of nested instances to realize for each top-level instance. Type : Int"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeRemoveAttribute: {
    description:
      "Adds a GeometryNodeRemoveAttribute node to the graph. Delete an attribute with a specified name from a geometry. Typically used to optimize performance",
    parameters: z.object({
      name: z.string().optional(),
      Name: z.string().optional().describe(". Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeReplaceMaterial: {
    description:
      "Adds a GeometryNodeReplaceMaterial node to the graph. Swap one material with another",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeResampleCurve: {
    description:
      "Adds a GeometryNodeResampleCurve node to the graph. Generate a poly spline for each input spline",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeReverseCurve: {
    description:
      "Adds a GeometryNodeReverseCurve node to the graph. Change the direction of curves by swapping their start and end data",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeRotateInstances: {
    description:
      "Adds a GeometryNodeRotateInstances node to the graph. Rotate geometry instances in local or global space",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Pivot__Point: z.array(z.number()).optional().describe(". Type : Vector"),
      Local__Space: z
        .boolean()
        .optional()
        .default(true)
        .describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSampleCurve: {
    description:
      "Adds a GeometryNodeSampleCurve node to the graph. Retrieve data from a point on a curve at a certain distance from its start",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSampleGrid: {
    description:
      "Adds a GeometryNodeSampleGrid node to the graph. Retrieve volume grid values at specific voxels",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSampleIndex: {
    description:
      "Adds a GeometryNodeSampleIndex node to the graph. Retrieve values from specific geometry elements",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSampleNearestSurface: {
    description:
      "Adds a GeometryNodeSampleNearestSurface node to the graph. Calculate the interpolated value of a mesh attribute on the closest point of its surface",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSampleNearest: {
    description:
      "Adds a GeometryNodeSampleNearest node to the graph. Calculate the interpolated values of a mesh attribute at a UV coordinate",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeScaleElements: {
    description:
      "Adds a GeometryNodeScaleElements node to the graph. Scale groups of connected edges and faces",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Scale: z.number().optional().default(1).describe(". Type : Float"),
      Center: z
        .array(z.number())
        .optional()
        .describe(
          "          'Origin of the scaling for each element. If multiple elements are connected, their '          'center is averaged. Type : Vector"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeScaleInstances: {
    description:
      "Adds a GeometryNodeScaleInstances node to the graph. Scale geometry instances in local or global space",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSDFGridBoolean: {
    description:
      "Adds a GeometryNodeSDFGridBoolean node to the graph. Cut, subtract, or join multiple SDF volume grid inputs",
    parameters: z.object({
      name: z.string().optional(),
      Grid__1: z.number().optional().describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSelfObject: {
    description:
      "Adds a GeometryNodeSelfObject node to the graph. Retrieve the object that contains the geometry nodes modifier currently being executed",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSeparateComponents: {
    description:
      "Adds a GeometryNodeSeparateComponents node to the graph. Split a geometry into a separate output for each type of data in the geometry",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSeparateGeometry: {
    description:
      "Adds a GeometryNodeSeparateGeometry node to the graph. Split a geometry into two geometry outputs based on a selection",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "The parts of the geometry that go into the first output. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetCurveHandlePositions: {
    description:
      "Adds a GeometryNodeSetCurveHandlePositions node to the graph. Set the positions for the handles of Bézier curves",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetCurveNormal: {
    description:
      "Adds a GeometryNodeSetCurveNormal node to the graph. Set the evaluation mode for curve normals",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetCurveRadius: {
    description:
      "Adds a GeometryNodeSetCurveRadius node to the graph. Set the radius of the curve at each control point",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetCurveTilt: {
    description:
      "Adds a GeometryNodeSetCurveTilt node to the graph. Set the tilt angle at each curve control point",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetID: {
    description:
      "Adds a GeometryNodeSetID node to the graph. Set the id attribute on the input geometry, mainly used internally for randomizing",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      ID: z.number().int().optional().describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetMaterialIndex: {
    description:
      "Adds a GeometryNodeSetMaterialIndex node to the graph. Set the material index for each selected geometry element",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetMaterial: {
    description:
      "Adds a GeometryNodeSetMaterial node to the graph. Assign a material to geometry elements",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetPointRadius: {
    description:
      "Adds a GeometryNodeSetPointRadius node to the graph. Set the display size of point cloud points",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Radius: z.number().optional().default(0.05).describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetPosition: {
    description:
      "Adds a GeometryNodeSetPosition node to the graph. Set the location of each point",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Position: z.array(z.number()).optional().describe(". Type : Vector"),
      Offset: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetShadeSmooth: {
    description:
      "Adds a GeometryNodeSetShadeSmooth node to the graph. Control how many evaluated points should be generated on every curve segment",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Shade__Smooth: z
        .boolean()
        .optional()
        .default(true)
        .describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSetInstanceTransform: {
    description:
      "Adds a GeometryNodeSetInstanceTransform node to the graph. Set the transformation matrix of every instance",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSortElements: {
    description:
      "Adds a GeometryNodeSortElements node to the graph. Rearrange geometry elements, changing their indices",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Group__ID: z.number().int().optional().describe(". Type : Int"),
      Sort__Weight: z.number().optional().describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSplitEdges: {
    description:
      "Adds a GeometryNodeSplitEdges node to the graph. Duplicate mesh edges and break connections with the surrounding faces",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSplitToInstances: {
    description:
      "Adds a GeometryNodeSplitToInstances node to the graph. Create separate geometries containing the elements from the same group",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeStoreNamedAttribute: {
    description:
      "Adds a GeometryNodeStoreNamedAttribute node to the graph. Store the result of a field on a geometry as an attribute with the specified name",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Name: z.string().optional().describe(". Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeStoreNamedGrid: {
    description:
      "Adds a GeometryNodeStoreNamedGrid node to the graph. Store grid data in a volume geometry with the specified name",
    parameters: z.object({
      name: z.string().optional(),
      Name: z.string().optional().describe(". Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeStringJoin: {
    description:
      "Adds a GeometryNodeStringJoin node to the graph. Combine any number of input strings",
    parameters: z.object({
      name: z.string().optional(),
      Delimiter: z.string().optional().describe(". Type : String"),
      Strings: z.string().optional().describe(". Type : String"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeStringToCurves: {
    description:
      "Adds a GeometryNodeStringToCurves node to the graph. Generate a paragraph of text with a specific font, using a curve instance to store each character",
    parameters: z.object({
      name: z.string().optional(),
      String: z.string().optional().describe(". Type : String"),
      Size: z.number().optional().default(1).describe(". Type : Float"),
      Character__Spacing: z
        .number()
        .optional()
        .default(1)
        .describe(". Type : Float"),
      Word__Spacing: z
        .number()
        .optional()
        .default(1)
        .describe(". Type : Float"),
      Line__Spacing: z
        .number()
        .optional()
        .default(1)
        .describe(". Type : Float"),
      Text__Box__Width: z
        .number()
        .optional()
        .default(0)
        .describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSubdivideCurve: {
    description:
      "Adds a GeometryNodeSubdivideCurve node to the graph. Dividing each curve segment into a specified number of pieces",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSubdivideMesh: {
    description:
      "Adds a GeometryNodeSubdivideMesh node to the graph. Divide mesh faces into smaller ones without changing the shape or volume, using linear interpolation to place the new vertices",
    parameters: z.object({
      name: z.string().optional(),
      Level: z.number().int().optional().default(1).describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSubdivisionSurface: {
    description:
      "Adds a GeometryNodeSubdivisionSurface node to the graph. Divide mesh faces to form a smooth surface, using the Catmull-Clark subdivision method",
    parameters: z.object({
      name: z.string().optional(),
      Level: z.number().int().optional().default(1).describe(". Type : Int"),
      Edge__Crease: z.number().optional().default(0).describe(". Type : Float"),
      Vertex__Crease: z
        .number()
        .optional()
        .default(0)
        .describe(". Type : Float"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeSwitch: {
    description:
      "Adds a GeometryNodeSwitch node to the graph. Switch between two inputs",
    parameters: z.object({
      name: z.string().optional(),
      Switch: z.boolean().optional().describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeTool3DCursor: {
    description:
      "Adds a GeometryNodeTool3DCursor node to the graph. The scene's 3D cursor location and rotation",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeToolFaceSet: {
    description:
      "Adds a GeometryNodeToolFaceSet node to the graph. Each face's sculpt face set value",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeToolMousePosition: {
    description:
      "Adds a GeometryNodeToolMousePosition node to the graph. Retrieve the position of the mouse cursor",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeToolSelection: {
    description:
      "Adds a GeometryNodeToolSelection node to the graph. User selection of the edited geometry, for tool execution",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeToolActiveElement: {
    description:
      "Adds a GeometryNodeToolActiveElement node to the graph. Active element indices of the edited geometry, for tool execution",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeToolSetFaceSet: {
    description:
      "Adds a GeometryNodeToolSetFaceSet node to the graph. Set sculpt face set values for faces",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Face__Set: z.number().int().optional().describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeToolSetSelection: {
    description:
      "Adds a GeometryNodeToolSetSelection node to the graph. Set selection of the edited geometry, for tool execution",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeViewportTransform: {
    description:
      "Adds a GeometryNodeViewportTransform node to the graph. Retrieve the view direction and location of the 3D viewport",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeTransform: {
    description:
      "Adds a GeometryNodeTransform node to the graph. Translate, rotate or scale the geometry",
    parameters: z.object({
      name: z.string().optional(),
      Translation: z.array(z.number()).optional().describe(". Type : Vector"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeTranslateInstances: {
    description:
      "Adds a GeometryNodeTranslateInstances node to the graph. Move top-level geometry instances in local or global space",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Translation: z.array(z.number()).optional().describe(". Type : Vector"),
      Local__Space: z
        .boolean()
        .optional()
        .default(true)
        .describe(". Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeTriangulate: {
    description:
      "Adds a GeometryNodeTriangulate node to the graph. Convert all faces in a mesh to triangular faces",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z.boolean().optional().default(true).describe(". Type : Bool"),
      Minimum__Vertices: z
        .number()
        .int()
        .optional()
        .default(4)
        .describe(". Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeTrimCurve: {
    description:
      "Adds a GeometryNodeTrimCurve node to the graph. Shorten curves by removing portions at the start or end",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeUVPackIslands: {
    description:
      "Adds a GeometryNodeUVPackIslands node to the graph. Scale islands of a UV map and move them so they fill the UV space as much as possible",
    parameters: z.object({
      name: z.string().optional(),
      UV: z.array(z.number()).optional().describe(". Type : Vector"),
      Selection: z
        .boolean()
        .optional()
        .default(true)
        .describe("Faces to consider when packing islands. Type : Bool"),
      Margin: z
        .number()
        .optional()
        .default(0.001)
        .describe("      'Space between islands. Type : Float"),
      Rotate: z
        .boolean()
        .optional()
        .default(true)
        .describe("Rotate islands for best fit. Type : Bool"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeUVUnwrap: {
    description:
      "Adds a GeometryNodeUVUnwrap node to the graph. Generate a UV map based on seam edges",
    parameters: z.object({
      name: z.string().optional(),
      Selection: z
        .boolean()
        .optional()
        .default(true)
        .describe("Faces to participate in the unwrap operation. Type : Bool"),
      Seam: z
        .boolean()
        .optional()
        .describe(
          "      'Edges to mark where the mesh is 'cut' for the purposes of unwrapping. Type : Bool"
        ),
      Margin: z
        .number()
        .optional()
        .default(0.001)
        .describe("      'Space between islands. Type : Float"),
      Fill__Holes: z
        .boolean()
        .optional()
        .default(true)
        .describe(
          "          'Virtually fill holes in mesh before unwrapping, to better avoid overlaps '          'and preserve symmetry. Type : Bool"
        ),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeViewer: {
    description:
      "Adds a GeometryNodeViewer node to the graph. Display the input data in the Spreadsheet Editor",
    parameters: z.object({
      name: z.string().optional(),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },

  addGeometryNodeVolumeCube: {
    description:
      "Adds a GeometryNodeVolumeCube node to the graph. Generate a dense volume with a field that controls the density at each grid voxel based on its position",
    parameters: z.object({
      name: z.string().optional(),
      Density: z
        .number()
        .optional()
        .default(1)
        .describe("Volume density per voxel. Type : Float"),
      Background: z
        .number()
        .optional()
        .describe("Value for voxels outside of the cube. Type : Float"),
      Resolution__X: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe("Number of voxels in the X axis. Type : Int"),
      Resolution__Y: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe("Number of voxels in the Y axis. Type : Int"),
      Resolution__Z: z
        .number()
        .int()
        .optional()
        .default(32)
        .describe("Number of voxels in the Z axis. Type : Int"),
    }),
    returns: _OperationResponse.extend({
      nodeId: z.string(),
      inputs: z
        .object({
          name: z.string(),
          type: z.string(),
          can_accept_default_value: z.boolean(),
        })
        .describe("Node inputs"),
      outputs: z
        .object({ name: z.string(), type: z.string() })
        .describe("Node outputs"),
    }),
  },
};
