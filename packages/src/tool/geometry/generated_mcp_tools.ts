// Auto-generated file. Do not edit manually.

import { z } from 'zod';
import { _OperationResponse } from '../core';

export default {
  // Auto-generated tools
addShaderNodeValue: {
  description: 'Adds a ShaderNodeValue node to the graph.',
  parameters: z.object({
    "Value": z.number().optional().describe(". Type : Float")
}),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeMapRange: {
  description: 'Adds a ShaderNodeMapRange node to the graph.',
  parameters: z.object({
    "Value": z.number().optional().describe(". Type : Float"),
    "From__Min": z.number().optional().describe(". Type : Float"),
    "From__Max": z.number().optional().describe(". Type : Float"),
    "To__Min": z.number().optional().describe(". Type : Float"),
    "To__Max": z.number().optional().describe(". Type : Float"),
    "Steps": z.number().optional().describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "From\_Min\_FLOAT3": z.array(z.number()).optional().describe(". Type : Vector"),
    "From\_Max\_FLOAT3": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "To\_Min\_FLOAT3": z.array(z.number()).optional().describe(". Type : Vector"),
    "To\_Max\_FLOAT3": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "Steps\_FLOAT3": z.array(z.number()).optional().default([4, 4, 4]).describe(". Type : Vector")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeMath: {
  description: 'Adds a ShaderNodeMath node to the graph.',
  parameters: z.object({
    "Value": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value\_001": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value\_002": z.number().optional().default(0.5).describe(". Type : Float"),
    "operation": z.string().optional().default('ADD').describe("The operation to perform on the values. Can be one of the following: 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES'. Type : String")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeVectorMath: {
  description: 'Adds a ShaderNodeVectorMath node to the graph.',
  parameters: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector\_001": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector\_002": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().default(1).describe(". Type : Float"),
    "operation": z.string().optional().default('ADD').describe("The operation to perform on the vectors. Can be one of the following: ADD, SUBTRACT,MULTIPLY,DIVIDE,MULTIPLY_ADD,POWER,LOGARITHM,SQRT,INVERSE_SQRT,ABSOLUTE,EXPONENT,MINIMUM,MAXIMUM,LESS_THAN,GREATER_THAN,SIGN,COMPARE,SMOOTH_MIN,SMOOTH_MAX,ROUND,FLOOR,CEIL,TRUNC,FRACT,MODULO,FLOORED_MODULO,WRAP,SNAP,PINGPONG,SINE,COSINE,TANGENT,ARCSINE,ARCCOSINE,ARCTANGENT,ARCTAN2,SINH,COSH,TANH,RADIANS,DEGREES. Type : String")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeVectorRotate: {
  description: 'Adds a ShaderNodeVectorRotate node to the graph.',
  parameters: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Center": z.array(z.number()).optional().describe("Point to rotate around. Type : Vector"),
    "Axis": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeSeparateXYZ: {
  description: 'Adds a ShaderNodeSeparateXYZ node to the graph.',
  parameters: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addShaderNodeCombineXYZ: {
  description: 'Adds a ShaderNodeCombineXYZ node to the graph.',
  parameters: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeInputPosition: {
  description: 'Adds a GeometryNodeInputPosition node to the graph.',
  parameters: z.object({

  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeMeshCone: {
  description: 'Adds a GeometryNodeMeshCone node to the graph.',
  parameters: z.object({
    "Vertices": z.number().int().optional().default(32).describe(". Type : Int"),
    "Side__Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Fill__Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Radius__Top": z.number().optional().describe(". Type : Float"),
    "Radius__Bottom": z.number().optional().default(1).describe(". Type : Float"),
    "Depth": z.number().optional().default(2).describe(". Type : Float")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeMeshCube: {
  description: 'Adds a GeometryNodeMeshCube node to the graph.',
  parameters: z.object({
    "Size": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "Vertices__X": z.number().int().optional().default(2).describe(". Type : Int"),
    "Vertices__Y": z.number().int().optional().default(2).describe(". Type : Int"),
    "Vertices__Z": z.number().int().optional().default(2).describe(". Type : Int")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeMeshCylinder: {
  description: 'Adds a GeometryNodeMeshCylinder node to the graph.',
  parameters: z.object({
    "Vertices": z.number().int().optional().default(32).describe(". Type : Int"),
    "Side__Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Fill__Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Radius": z.number().optional().default(1).describe(". Type : Float"),
    "Depth": z.number().optional().default(2).describe(". Type : Float")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

addGeometryNodeSetPosition: {
  description: 'Adds a GeometryNodeSetPosition node to the graph.',
  parameters: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  returns: _OperationResponse.extend({ nodeId: z.string() }),
},

};

