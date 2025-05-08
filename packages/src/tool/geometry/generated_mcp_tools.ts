// Auto-generated file. Do not edit manually.

import { z } from 'zod';
import { _OperationResponse } from '../core';

export default {
  // Auto-generated tools
addShaderNodeValue: {
  description: 'Adds a ShaderNodeValue node to the graph. Input numerical values to other nodes in the tree',
  parameters: z.object({
    "name": z.string().optional(),
    "Value": z.number().optional().describe(". Type : Float")
}),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeMapRange: {
  description: 'Adds a ShaderNodeMapRange node to the graph. Remap a value from a range to a target range',
  parameters: z.object({
    "name": z.string().optional(),
    "Value": z.number().optional().default(1).describe(". Type : Float"),
    "From__Min": z.number().optional().describe(". Type : Float"),
    "From__Max": z.number().optional().default(1).describe(". Type : Float"),
    "To__Min": z.number().optional().describe(". Type : Float"),
    "To__Max": z.number().optional().default(1).describe(". Type : Float"),
    "Steps": z.number().optional().default(4).describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "From\_Min\_FLOAT3": z.array(z.number()).optional().describe(". Type : Vector"),
    "To\_Min\_FLOAT3": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeMath: {
  description: 'Adds a ShaderNodeMath node to the graph. Perform math operations',
  parameters: z.object({
    "name": z.string().optional(),
    "Value": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value\_001": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value\_002": z.number().optional().default(0.5).describe(". Type : Float"),
    "operation": z.string().optional().default('ADD').describe("The operation to perform on the values. Can be one of the following: 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES'. Type : String")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeVectorMath: {
  description: 'Adds a ShaderNodeVectorMath node to the graph. Perform vector math operation',
  parameters: z.object({
    "name": z.string().optional(),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector\_001": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector\_002": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().default(1).describe(". Type : Float")
,
    "operation": z.enum(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREE']).describe("The operation to perform on the vectors. Can be one of the following: ADD, SUBTRACT,MULTIPLY,DIVIDE,MULTIPLY_ADD,POWER,LOGARITHM,SQRT,INVERSE_SQRT,ABSOLUTE,EXPONENT,MINIMUM,MAXIMUM,LESS_THAN,GREATER_THAN,SIGN,COMPARE,SMOOTH_MIN,SMOOTH_MAX,ROUND,FLOOR,CEIL,TRUNC,FRACT,MODULO,FLOORED_MODULO,WRAP,SNAP,PINGPONG,SINE,COSINE,TANGENT,ARCSINE,ARCCOSINE,ARCTANGENT,ARCTAN2,SINH,COSH,TANH,RADIANS,DEGREES").default("ADD")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeVectorRotate: {
  description: 'Adds a ShaderNodeVectorRotate node to the graph. Rotate a vector around a pivot point (center)',
  parameters: z.object({
    "name": z.string().optional(),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Center": z.array(z.number()).optional().describe("Point to rotate around. Type : Vector")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeSeparateXYZ: {
  description: 'Adds a ShaderNodeSeparateXYZ node to the graph. Split a vector into its X, Y, and Z components',
  parameters: z.object({
    "name": z.string().optional(),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeCombineXYZ: {
  description: 'Adds a ShaderNodeCombineXYZ node to the graph. Create a vector from X, Y, and Z components',
  parameters: z.object({
    "name": z.string().optional(),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeInputPosition: {
  description: 'Adds a GeometryNodeInputPosition node to the graph. Retrieve a vector indicating the location of each element',
  parameters: z.object({
    "name": z.string().optional(),


  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeMeshCone: {
  description: 'Adds a GeometryNodeMeshCone node to the graph. Generate a cone mesh. The cone is aligned with the Z axis and centered at the origin.',
  parameters: z.object({
    "name": z.string().optional(),
    "Vertices": z.number().int().optional().default(32).describe("Number of points on the circle at the top and bottom. Type : Int"),
    "Side__Segments": z.number().int().optional().default(1).describe("The number of edges running vertically along the side of the cone. Type : Int"),
    "Fill__Segments": z.number().int().optional().default(1).describe("Number of concentric rings used to fill the round face. Type : Int"),
    "Radius__Top": z.number().optional().describe("Radius of the top circle of the cone. Type : Float"),
    "Radius__Bottom": z.number().optional().default(1).describe("Radius of the bottom circle of the cone. Type : Float"),
    "Depth": z.number().optional().default(2).describe("Height of the generated cone. Type : Float")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeMeshCube: {
  description: 'Adds a GeometryNodeMeshCube node to the graph. Generate a cuboid mesh with variable side lengths and subdivisions',
  parameters: z.object({
    "name": z.string().optional(),
    "Vertices__X": z.number().int().optional().default(2).describe("Number of vertices for the X side of the shape. Type : Int"),
    "Vertices__Y": z.number().int().optional().default(2).describe("Number of vertices for the Y side of the shape. Type : Int"),
    "Vertices__Z": z.number().int().optional().default(2).describe("Number of vertices for the Z side of the shape. Type : Int")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeMeshCylinder: {
  description: 'Adds a GeometryNodeMeshCylinder node to the graph. Generate a cylinder mesh. The cylinder is aligned with the Z axis and centered at the origin.',
  parameters: z.object({
    "name": z.string().optional(),
    "Vertices": z.number().int().optional().default(32).describe("The number of vertices on the top and bottom circles. Type : Int"),
    "Side__Segments": z.number().int().optional().default(1).describe("The number of rectangular segments along each side. Type : Int"),
    "Fill__Segments": z.number().int().optional().default(1).describe("The number of concentric rings used to fill the round faces. Type : Int"),
    "Radius": z.number().optional().default(1).describe("The radius of the cylinder. Type : Float"),
    "Depth": z.number().optional().default(2).describe("The height of the cylinder. Type : Float")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeSetPosition: {
  description: 'Adds a GeometryNodeSetPosition node to the graph. Set the location of each point',
  parameters: z.object({
    "name": z.string().optional(),
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

};

