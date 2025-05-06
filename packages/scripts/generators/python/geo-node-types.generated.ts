import { z } from "zod";

// Auto-generated file. Do not edit manually.

export const blNodeType = z.union([
z.object({
  type: z.literal("ShaderNodeValue"),
  inputs: z.object({


  }),
  outputs: z.object({
    "Value": z.number().optional().describe(". Type : Float")
})
}).describe("Input numerical values to other nodes in the tree"),
z.object({
  type: z.literal("ShaderNodeValToRGB"),
  inputs: z.object({
    "Fac": z.number().optional().default(0.5).describe("          'The value used to map onto the color gradient. 0.0 results in the leftmost color, '          'while 1.0 results in the rightmost. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Map values to colors with the use of a gradient"),
z.object({
  type: z.literal("ShaderNodeVectorCurve"),
  inputs: z.object({
    "Fac": z.number().optional().default(1).describe("Amount of influence the node exerts on the output vector. Type : Float"),
    "Vector": z.array(z.number()).optional().describe("      'Vector which would be mapped to the curve. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Map input vector components with curves"),
z.object({
  type: z.literal("ShaderNodeRGBCurve"),
  inputs: z.object({
    "Fac": z.number().optional().default(1).describe("Amount of influence the node exerts on the output vector. Type : Float"),
    "Vector": z.array(z.number()).optional().describe("      'Vector which would be mapped to the curve. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Apply color corrections for each color channel"),
z.object({
  type: z.literal("ShaderNodeMapRange"),
  inputs: z.object({
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
  outputs: z.object({

})
}).describe("Remap a value from a range to a target range"),
z.object({
  type: z.literal("ShaderNodeClamp"),
  inputs: z.object({
    "Value": z.number().optional().default(1).describe(". Type : Float"),
    "Min": z.number().optional().default(0).describe(". Type : Float"),
    "Max": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Clamp a value between a minimum and a maximum"),
z.object({
  type: z.literal("ShaderNodeMath"),
  inputs: z.object({
    "Value": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value\_001": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value\_002": z.number().optional().default(0.5).describe(". Type : Float"),
    "operation": z.string().optional().default('ADD').describe("The operation to perform on the values. Can be one of the following: 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES'. Type : String")

  }),
  outputs: z.object({

})
}).describe("Perform math operations"),
z.object({
  type: z.literal("ShaderNodeVectorMath"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector\_001": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector\_002": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().default(1).describe(". Type : Float")
,
    "operation": z.enum(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREE']).describe("The operation to perform on the vectors. Can be one of the following: ADD, SUBTRACT,MULTIPLY,DIVIDE,MULTIPLY_ADD,POWER,LOGARITHM,SQRT,INVERSE_SQRT,ABSOLUTE,EXPONENT,MINIMUM,MAXIMUM,LESS_THAN,GREATER_THAN,SIGN,COMPARE,SMOOTH_MIN,SMOOTH_MAX,ROUND,FLOOR,CEIL,TRUNC,FRACT,MODULO,FLOORED_MODULO,WRAP,SNAP,PINGPONG,SINE,COSINE,TANGENT,ARCSINE,ARCCOSINE,ARCTANGENT,ARCTAN2,SINH,COSH,TANH,RADIANS,DEGREES").default("ADD")
  }),
  outputs: z.object({

})
}).describe("Perform vector math operation"),
z.object({
  type: z.literal("ShaderNodeBlackbody"),
  inputs: z.object({
    "Temperature": z.number().optional().default(1500).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Convert a blackbody temperature to an RGB value"),
z.object({
  type: z.literal("ShaderNodeTexGradient"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Generate interpolated color and intensity values based on the input vector"),
z.object({
  type: z.literal("ShaderNodeTexNoise"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Generate fractal Perlin noise"),
z.object({
  type: z.literal("ShaderNodeTexMagic"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().default(5).describe("      'Scale of the texture. Type : Float"),
    "Distortion": z.number().optional().default(1).describe("Amount of distortion. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a psychedelic color texture"),
z.object({
  type: z.literal("ShaderNodeTexWave"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().default(5).describe("      'Overall texture scale. Type : Float"),
    "Distortion": z.number().optional().default(0).describe("Amount of distortion of the wave. Type : Float"),
    "Detail": z.number().optional().default(2).describe("      'Amount of distortion noise detail. Type : Float"),
    "Detail__Scale": z.number().optional().default(1).describe("Scale of distortion noise. Type : Float"),
    "Detail__Roughness": z.number().optional().default(0.5).describe("Blend between a smoother noise pattern, and rougher with sharper peaks. Type : Float"),
    "Phase__Offset": z.number().optional().default(0).describe("          'Position of the wave along the Bands Direction.\n'          'This can be used as an input for more control over the distortion. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate procedural bands or rings with noise"),
z.object({
  type: z.literal("ShaderNodeTexVoronoi"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Generate Worley noise based on the distance to random points. Typically used to generate textures such as stones, water, or biological cells"),
z.object({
  type: z.literal("ShaderNodeTexChecker"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Generate a checkerboard texture"),
z.object({
  type: z.literal("ShaderNodeTexBrick"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Generate a procedural texture producing bricks"),
z.object({
  type: z.literal("ShaderNodeVectorRotate"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Center": z.array(z.number()).optional().describe("Point to rotate around. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Rotate a vector around a pivot point (center)"),
z.object({
  type: z.literal("ShaderNodeSeparateXYZ"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Split a vector into its X, Y, and Z components"),
z.object({
  type: z.literal("ShaderNodeCombineXYZ"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Create a vector from X, Y, and Z components"),
z.object({
  type: z.literal("ShaderNodeTexWhiteNoise"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Return a random value or color based on an input seed"),
z.object({
  type: z.literal("ShaderNodeFloatCurve"),
  inputs: z.object({
    "Fac": z.number().optional().default(1).describe("Amount of influence the node exerts on the output vector. Type : Float"),
    "Vector": z.array(z.number()).optional().describe("      'Vector which would be mapped to the curve. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Map an input float to a curve and outputs a float value"),
z.object({
  type: z.literal("ShaderNodeMix"),
  inputs: z.object({
    "Factor\_Float": z.number().optional().default(0.5).describe("Amount of mixing between the A and B inputs. Type : Float"),
    "A\_Float": z.number().optional().describe("Value of the first floating number input. Type : Float"),
    "B\_Float": z.number().optional().describe("Value of the second floating number input. Type : Float"),
    "A\_Vector": z.array(z.number()).optional().describe("Value of the first vector input. Type : Vector"),
    "B\_Vector": z.array(z.number()).optional().describe("Value of the second vector input. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Mix values by a factor"),
z.object({
  type: z.literal("FunctionNodeAlignEulerToVector"),
  inputs: z.object({
    "Rotation": z.array(z.number()).optional().describe(". Type : Vector"),
    "Factor": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeAlignRotationToVector"),
  inputs: z.object({
    "Factor": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeAxesToRotation"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Create a rotation from a primary and (ideally orthogonal) secondary axis"),
z.object({
  type: z.literal("FunctionNodeAxisAngleToRotation"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeBooleanMath"),
  inputs: z.object({
    "Boolean": z.boolean().optional().describe(". Type : Bool"),
    "Boolean\_001": z.boolean().optional().describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeCombineColor"),
  inputs: z.object({
    "Red": z.number().optional().default(0).describe(". Type : Float"),
    "Green": z.number().optional().default(0).describe(". Type : Float"),
    "Blue": z.number().optional().default(0).describe(". Type : Float"),
    "Alpha": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeCombineMatrix"),
  inputs: z.object({
    "Column__1__Row__1": z.number().optional().default(1).describe(". Type : Float"),
    "Column__1__Row__2": z.number().optional().describe(". Type : Float"),
    "Column__1__Row__3": z.number().optional().describe(". Type : Float"),
    "Column__1__Row__4": z.number().optional().describe(". Type : Float"),
    "Column__2__Row__1": z.number().optional().describe(". Type : Float"),
    "Column__2__Row__2": z.number().optional().default(1).describe(". Type : Float"),
    "Column__2__Row__3": z.number().optional().describe(". Type : Float"),
    "Column__2__Row__4": z.number().optional().describe(". Type : Float"),
    "Column__3__Row__1": z.number().optional().describe(". Type : Float"),
    "Column__3__Row__2": z.number().optional().describe(". Type : Float"),
    "Column__3__Row__3": z.number().optional().default(1).describe(". Type : Float"),
    "Column__3__Row__4": z.number().optional().describe(". Type : Float"),
    "Column__4__Row__1": z.number().optional().describe(". Type : Float"),
    "Column__4__Row__2": z.number().optional().describe(". Type : Float"),
    "Column__4__Row__3": z.number().optional().describe(". Type : Float"),
    "Column__4__Row__4": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Construct a 4x4 matrix from its individual values"),
z.object({
  type: z.literal("FunctionNodeQuaternionToRotation"),
  inputs: z.object({
    "W": z.number().optional().default(1).describe(". Type : Float"),
    "X": z.number().optional().default(0).describe(". Type : Float"),
    "Y": z.number().optional().default(0).describe(". Type : Float"),
    "Z": z.number().optional().default(0).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeCombineTransform"),
  inputs: z.object({
    "Translation": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeCompare"),
  inputs: z.object({
    "A": z.number().optional().describe(". Type : Float"),
    "B": z.number().optional().describe(". Type : Float"),
    "A\_INT": z.number().int().optional().describe(". Type : Int"),
    "B\_INT": z.number().int().optional().describe(". Type : Int"),
    "A\_VEC3": z.array(z.number()).optional().describe(". Type : Vector"),
    "B\_VEC3": z.array(z.number()).optional().describe(". Type : Vector"),
    "A\_STR": z.string().optional().describe(". Type : String"),
    "B\_STR": z.string().optional().describe(". Type : String"),
    "C": z.number().optional().default(0.9).describe(". Type : Float"),
    "Angle": z.number().optional().default(0.0872665).describe(". Type : Float"),
    "Epsilon": z.number().optional().default(0.001).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeEulerToRotation"),
  inputs: z.object({
    "Euler": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeFloatToInt"),
  inputs: z.object({
    "Float": z.number().optional().describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputBool"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputColor"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputInt"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputRotation"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputSpecialCharacters"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputString"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInputVector"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInvertMatrix"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeInvertRotation"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeMatrixMultiply"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeProjectPoint"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Project a point using a matrix, using location, rotation, scale, and perspective divide"),
z.object({
  type: z.literal("FunctionNodeRandomValue"),
  inputs: z.object({
    "Min": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeReplaceString"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String"),
    "Find": z.string().optional().describe("The string to find in the input string. Type : String"),
    "Replace": z.string().optional().describe("The string to replace each match with. Type : String")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeRotateEuler"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeRotateRotation"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeRotateVector"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeRotationToAxisAngle"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeRotationToEuler"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeSeparateColor"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeSeparateMatrix"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Split a 4x4 matrix into its individual values"),
z.object({
  type: z.literal("FunctionNodeRotationToQuaternion"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeSeparateTransform"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeSliceString"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String"),
    "Position": z.number().int().optional().describe(". Type : Int"),
    "Length": z.number().int().optional().default(10).describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeStringLength"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeTransformDirection"),
  inputs: z.object({
    "Direction": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeTransformPoint"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeTransposeMatrix"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("FunctionNodeValueToString"),
  inputs: z.object({
    "Value": z.number().optional().describe(". Type : Float"),
    "Decimals": z.number().int().optional().describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("GeometryNodeAccumulateField"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Add the values of an evaluated field together and output the running total for each element"),
z.object({
  type: z.literal("GeometryNodeAttributeDomainSize"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the number of elements in a geometry for each attribute domain"),
z.object({
  type: z.literal("GeometryNodeAttributeStatistic"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Calculate statistics about a data set from a field evaluated on a geometry"),
z.object({
  type: z.literal("GeometryNodeBake"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Cache the incoming data so that it can be used without recomputation"),
z.object({
  type: z.literal("GeometryNodeBlurAttribute"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Mix attribute values of neighboring elements"),
z.object({
  type: z.literal("GeometryNodeBoundBox"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Calculate the limits of a geometry's positions and generate a box mesh with those dimensions"),
z.object({
  type: z.literal("GeometryNodeCaptureAttribute"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Store the result of a field on a geometry and output the data as a node socket. Allows remembering or interpolating data as the geometry changes, such as positions before deformation"),
z.object({
  type: z.literal("GeometryNodeCollectionInfo"),
  inputs: z.object({
    "Separate__Children": z.boolean().optional().describe("          'Output each child of the collection as a separate instance, sorted alphabetically. Type : Bool"),
    "Reset__Children": z.boolean().optional().describe("          'Reset the transforms of every child instance in the output. Only used when Separate '          'Children is enabled. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Retrieve geometry instances from a collection"),
z.object({
  type: z.literal("GeometryNodeConvexHull"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Create a mesh that encloses all points in the input geometry with the smallest number of points"),
z.object({
  type: z.literal("GeometryNodeCurveEndpointSelection"),
  inputs: z.object({
    "Start__Size": z.number().int().optional().default(1).describe("The amount of points to select from the start of each spline. Type : Int"),
    "End__Size": z.number().int().optional().default(1).describe("The amount of points to select from the end of each spline. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Provide a selection for an arbitrary number of endpoints in each spline"),
z.object({
  type: z.literal("GeometryNodeCurveHandleTypeSelection"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Provide a selection based on the handle types of Bézier control points"),
z.object({
  type: z.literal("GeometryNodeCurveLength"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the length of all splines added together"),
z.object({
  type: z.literal("GeometryNodeCurveArc"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a poly spline arc"),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveBezierSegment"),
  inputs: z.object({
    "Resolution": z.number().int().optional().default(16).describe("The number of evaluated points on the curve. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate a 2D Bézier spline from the given control points and handles"),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveCircle"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a poly spline circle"),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveLine"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a poly spline line with two points"),
z.object({
  type: z.literal("GeometryNodeCurveQuadraticBezier"),
  inputs: z.object({
    "Resolution": z.number().int().optional().default(16).describe("The number of edges on the curve. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate a poly spline in a parabola shape with control points positions"),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveQuadrilateral"),
  inputs: z.object({
    "Width": z.number().optional().default(2).describe("The X axis size of the shape. Type : Float"),
    "Height": z.number().optional().default(2).describe("The Y axis size of the shape. Type : Float"),
    "Bottom__Width": z.number().optional().default(4).describe("The X axis size of the shape. Type : Float"),
    "Top__Width": z.number().optional().default(2).describe("The X axis size of the shape. Type : Float"),
    "Offset": z.number().optional().default(1).describe("          'For Parallelogram, the relative X difference between the top and bottom edges. For '          'Trapezoid, the amount to move the top edge in the positive X axis. Type : Float"),
    "Bottom__Height": z.number().optional().default(3).describe("The distance between the bottom point and the X axis. Type : Float"),
    "Top__Height": z.number().optional().default(1).describe("The distance between the top point and the X axis. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a polygon with four points"),
z.object({
  type: z.literal("GeometryNodeCurveSpiral"),
  inputs: z.object({
    "Resolution": z.number().int().optional().default(32).describe("Number of points in one rotation of the spiral. Type : Int"),
    "Rotations": z.number().optional().default(2).describe("Number of times the spiral makes a full rotation. Type : Float"),
    "Start__Radius": z.number().optional().default(1).describe("Horizontal Distance from the Z axis at the start of the spiral. Type : Float"),
    "End__Radius": z.number().optional().default(2).describe("Horizontal Distance from the Z axis at the end of the spiral. Type : Float"),
    "Height": z.number().optional().default(2).describe("The height perpendicular to the base of the spiral. Type : Float"),
    "Reverse": z.boolean().optional().describe("      'Switch the direction from clockwise to counterclockwise. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Generate a poly spline in a spiral shape"),
z.object({
  type: z.literal("GeometryNodeCurveStar"),
  inputs: z.object({
    "Points": z.number().int().optional().default(8).describe("Number of points on each of the circles. Type : Int"),
    "Inner__Radius": z.number().optional().default(1).describe("Radius of the inner circle; can be larger than outer radius. Type : Float"),
    "Outer__Radius": z.number().optional().default(2).describe("Radius of the outer circle; can be smaller than inner radius. Type : Float"),
    "Twist": z.number().optional().describe("The counterclockwise rotation of the inner set of points. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a poly spline in a star pattern by connecting alternating points of two circles"),
z.object({
  type: z.literal("GeometryNodeCurveSetHandles"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Set the handle type for the control points of a Bézier curve"),
z.object({
  type: z.literal("GeometryNodeSplineParameter"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve how far along each spline a control point is"),
z.object({
  type: z.literal("GeometryNodeCurveSplineType"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Change the type of curves"),
z.object({
  type: z.literal("GeometryNodeCurveToMesh"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Convert curves into a mesh, optionally with a custom profile shape defined by curves"),
z.object({
  type: z.literal("GeometryNodeCurveToPoints"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a point cloud by sampling positions along curves"),
z.object({
  type: z.literal("GeometryNodeCurveOfPoint"),
  inputs: z.object({
    "Point__Index": z.number().int().optional().describe("The control point to retrieve data from. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve the curve a control point is part of"),
z.object({
  type: z.literal("GeometryNodePointsOfCurve"),
  inputs: z.object({
    "Curve__Index": z.number().int().optional().describe("The curve to retrieve data from. Defaults to the curve from the context. Type : Int"),
    "Weights": z.number().optional().describe("      'Values used to sort the curve's points. Uses indices by default. Type : Float"),
    "Sort__Index": z.number().int().optional().describe("Which of the sorted points to output. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve a point index within a curve"),
z.object({
  type: z.literal("GeometryNodeDeformCurvesOnSurface"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Translate and rotate curves based on changes between the object's original and evaluated surface mesh"),
z.object({
  type: z.literal("GeometryNodeDeleteGeometry"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe("The parts of the geometry to be deleted. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Remove selected elements of a geometry"),
z.object({
  type: z.literal("GeometryNodeDistributePointsInGrid"),
  inputs: z.object({
    "Grid": z.number().optional().describe(". Type : Float"),
    "Density": z.number().optional().default(1).describe("          'When combined with each voxel's value, determines the number of points to sample per '          'unit volume. Type : Float"),
    "Seed": z.number().int().optional().describe("      'Seed used by the random number generator to generate random points. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate points inside a volume grid"),
z.object({
  type: z.literal("GeometryNodeDistributePointsInVolume"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe("Number of points to sample per unit volume. Type : Float"),
    "Seed": z.number().int().optional().describe("      'Seed used by the random number generator to generate random points. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate points inside a volume"),
z.object({
  type: z.literal("GeometryNodeDistributePointsOnFaces"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate points spread out on the surface of a mesh"),
z.object({
  type: z.literal("GeometryNodeDualMesh"),
  inputs: z.object({
    "Keep__Boundaries": z.boolean().optional().default(false).describe("          'Keep non-manifold boundaries of the input mesh in place by avoiding the dual '          'transformation there. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Convert Faces into vertices and vertices into faces"),
z.object({
  type: z.literal("GeometryNodeDuplicateElements"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Amount": z.number().int().optional().default(1).describe("      'The number of duplicates to create for each element. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate an arbitrary number copies of each selected input element"),
z.object({
  type: z.literal("GeometryNodeEdgePathsToCurves"),
  inputs: z.object({
    "Start__Vertices": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Next__Vertex__Index": z.number().int().optional().default(-1).describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Output curves following paths across mesh edges"),
z.object({
  type: z.literal("GeometryNodeEdgePathsToSelection"),
  inputs: z.object({
    "Start__Vertices": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Next__Vertex__Index": z.number().int().optional().default(-1).describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Output a selection of edges by following paths across mesh edges"),
z.object({
  type: z.literal("GeometryNodeEdgesToFaceGroups"),
  inputs: z.object({
    "Boundary__Edges": z.boolean().optional().default(true).describe("Edges used to split faces into separate groups. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Group faces into regions surrounded by the selected boundary edges"),
z.object({
  type: z.literal("GeometryNodeFieldAtIndex"),
  inputs: z.object({
    "Index": z.number().int().optional().describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve data of other elements in the context's geometry"),
z.object({
  type: z.literal("GeometryNodeFieldOnDomain"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve values from a field on a different domain besides the domain from the context"),
z.object({
  type: z.literal("GeometryNodeExtrudeMesh"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset__Scale": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate new vertices, edges, or faces from selected elements and move them based on an offset while keeping them connected by their boundary"),
z.object({
  type: z.literal("GeometryNodeFillCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a mesh on the XY plane with faces on the inside of input curves"),
z.object({
  type: z.literal("GeometryNodeFilletCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Round corners by generating circular arcs on each control point"),
z.object({
  type: z.literal("GeometryNodeFlipFaces"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Reverse the order of the vertices and edges of selected faces, flipping their normal direction"),
z.object({
  type: z.literal("GeometryNodeGeometryToInstance"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Convert each input geometry into an instance, which can be much faster than the Join Geometry node when the inputs are large"),
z.object({
  type: z.literal("GeometryNodeGetNamedGrid"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String"),
    "Remove": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Get volume grid from a volume geometry with the specified name"),
z.object({
  type: z.literal("GeometryNodeGridToMesh"),
  inputs: z.object({
    "Grid": z.number().optional().describe(". Type : Float"),
    "Threshold": z.number().optional().default(0.1).describe("Values larger than the threshold are inside the generated mesh. Type : Float"),
    "Adaptivity": z.number().optional().describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a mesh on the \"surface\" of a volume grid"),
z.object({
  type: z.literal("GeometryNodeImageInfo"),
  inputs: z.object({
    "Frame": z.number().int().optional().describe("      'Which frame to use for videos. Note that different frames in videos can '      'have different resolutions. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve information about an image"),
z.object({
  type: z.literal("GeometryNodeImageTexture"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe("Texture coordinates from 0 to 1. Type : Vector"),
    "Frame": z.number().int().optional().describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Sample values from an image texture"),
z.object({
  type: z.literal("GeometryNodeInputImage"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Input image"),
z.object({
  type: z.literal("GeometryNodeImportSTL"),
  inputs: z.object({
    "Path": z.string().optional().default("").describe("Path to a STL file. Type : String")

  }),
  outputs: z.object({

})
}).describe("Import a mesh from an STL file"),
z.object({
  type: z.literal("GeometryNodeIndexOfNearest"),
  inputs: z.object({
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Group__ID": z.number().int().optional().describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Find the nearest element in a group. Similar to the \"Sample Nearest\" node"),
z.object({
  type: z.literal("GeometryNodeIndexSwitch"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Choose between an arbitrary number of values with an index"),
z.object({
  type: z.literal("GeometryNodeInputActiveCamera"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the scene's active camera"),
z.object({
  type: z.literal("GeometryNodeInputCurveHandlePositions"),
  inputs: z.object({
    "Relative": z.boolean().optional().default(false).describe("          'Output the handle positions relative to the corresponding control point '          'instead of in the local space of the geometry. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Retrieve the position of each Bézier control point's handles"),
z.object({
  type: z.literal("GeometryNodeInputCurveTilt"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the angle at each control point used to twist the curve's normal around its tangent"),
z.object({
  type: z.literal("GeometryNodeInputEdgeSmooth"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve whether each edge is marked for smooth or split normals"),
z.object({
  type: z.literal("GeometryNodeInputShadeSmooth"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve whether each face is marked for smooth or sharp normals"),
z.object({
  type: z.literal("GeometryNodeInputID"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve a stable random identifier value from the \"id\" attribute on the point domain, or the index if the attribute does not exist"),
z.object({
  type: z.literal("GeometryNodeInputIndex"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve an integer value indicating the position of each element in the list, starting at zero"),
z.object({
  type: z.literal("GeometryNodeInputInstanceRotation"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the rotation of each instance in the geometry"),
z.object({
  type: z.literal("GeometryNodeInputInstanceScale"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the scale of each instance in the geometry"),
z.object({
  type: z.literal("GeometryNodeInputMaterialIndex"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the index of the material used for each element in the geometry's list of materials"),
z.object({
  type: z.literal("GeometryNodeInstanceTransform"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the full transformation of each instance in the geometry"),
z.object({
  type: z.literal("GeometryNodeInputMaterial"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Output a single material"),
z.object({
  type: z.literal("GeometryNodeInputMeshEdgeAngle"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Calculate the surface area of each face in a mesh"),
z.object({
  type: z.literal("GeometryNodeInputMeshEdgeNeighbors"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the number of faces that use each edge as one of their sides"),
z.object({
  type: z.literal("GeometryNodeInputMeshEdgeVertices"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve topology information relating to each edge of a mesh"),
z.object({
  type: z.literal("GeometryNodeInputMeshFaceArea"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Calculate the surface area of a mesh's faces"),
z.object({
  type: z.literal("GeometryNodeInputMeshFaceIsPlanar"),
  inputs: z.object({
    "Threshold": z.number().optional().default(0.01).describe("          'The distance a point can be from the surface before the face is no longer '          'considered planar. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Retrieve whether all triangles in a face are on the same plane, i.e. whether they have the same normal"),
z.object({
  type: z.literal("GeometryNodeInputMeshFaceNeighbors"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve topology information relating to each face of a mesh"),
z.object({
  type: z.literal("GeometryNodeInputMeshIsland"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve information about separate connected regions in a mesh"),
z.object({
  type: z.literal("GeometryNodeInputMeshVertexNeighbors"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve topology information relating to each vertex of a mesh"),
z.object({
  type: z.literal("GeometryNodeInputNamedAttribute"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe("Retrieve the data of a specified attribute"),
z.object({
  type: z.literal("GeometryNodeInputNamedLayerSelection"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe("Output a selection of a grease pencil layer"),
z.object({
  type: z.literal("GeometryNodeInputNormal"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve a unit length vector indicating the direction pointing away from the geometry at each element"),
z.object({
  type: z.literal("GeometryNodeInputPosition"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve a vector indicating the location of each element"),
z.object({
  type: z.literal("GeometryNodeInputRadius"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the radius at each point on curve or point cloud geometry"),
z.object({
  type: z.literal("GeometryNodeInputSceneTime"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the current time in the scene's animation in units of seconds or frames"),
z.object({
  type: z.literal("GeometryNodeInputShortestEdgePaths"),
  inputs: z.object({
    "End__Vertex": z.boolean().optional().default(false).describe(". Type : Bool"),
    "Edge__Cost": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Find the shortest paths along mesh edges to selected end vertices, with customizable cost per edge"),
z.object({
  type: z.literal("GeometryNodeInputSplineCyclic"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve whether each spline endpoint connects to the beginning"),
z.object({
  type: z.literal("GeometryNodeSplineLength"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the total length of each spline, as a distance or as a number of points"),
z.object({
  type: z.literal("GeometryNodeInputSplineResolution"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the number of evaluated points that will be generated for every control point on curves"),
z.object({
  type: z.literal("GeometryNodeInputTangent"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the direction of curves at each control point"),
z.object({
  type: z.literal("GeometryNodeInstanceOnPoints"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a reference to geometry at each of the input points, without duplicating its underlying data"),
z.object({
  type: z.literal("GeometryNodeInstancesToPoints"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Radius": z.number().optional().default(0.05).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate points at the origins of instances.\nNote: Nested instances are not affected by this node"),
z.object({
  type: z.literal("GeometryNodeInterpolateCurves"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate new curves on points by interpolating between existing curves"),
z.object({
  type: z.literal("GeometryNodeIsViewport"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve whether the nodes are being evaluated for the viewport rather than the final render"),
z.object({
  type: z.literal("GeometryNodeJoinGeometry"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Merge separately generated geometries into a single one"),
z.object({
  type: z.literal("GeometryNodeMaterialSelection"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Provide a selection of faces that use the specified material"),
z.object({
  type: z.literal("GeometryNodeMenuSwitch"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Select from multiple inputs by name"),
z.object({
  type: z.literal("GeometryNodeMergeByDistance"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Merge vertices or points within a given distance"),
z.object({
  type: z.literal("GeometryNodeMeshBoolean"),
  inputs: z.object({
    "Self__Intersection": z.boolean().optional().describe(". Type : Bool"),
    "Hole__Tolerant": z.boolean().optional().describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Cut, subtract, or join multiple mesh inputs"),
z.object({
  type: z.literal("GeometryNodeMeshFaceSetBoundaries"),
  inputs: z.object({
    "Face__Set": z.number().int().optional().default(0).describe("          'An identifier for the group of each face. All contiguous faces with the '          'same value are in the same region. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Find edges on the boundaries between groups of faces with the same ID value"),
z.object({
  type: z.literal("GeometryNodeMeshCircle"),
  inputs: z.object({
    "Vertices": z.number().int().optional().default(32).describe("Number of vertices on the circle. Type : Int"),
    "Radius": z.number().optional().default(1).describe("Distance of the vertices from the origin. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a circular ring of edges"),
z.object({
  type: z.literal("GeometryNodeMeshCone"),
  inputs: z.object({
    "Vertices": z.number().int().optional().default(32).describe("Number of points on the circle at the top and bottom. Type : Int"),
    "Side__Segments": z.number().int().optional().default(1).describe("The number of edges running vertically along the side of the cone. Type : Int"),
    "Fill__Segments": z.number().int().optional().default(1).describe("Number of concentric rings used to fill the round face. Type : Int"),
    "Radius__Top": z.number().optional().describe("Radius of the top circle of the cone. Type : Float"),
    "Radius__Bottom": z.number().optional().default(1).describe("Radius of the bottom circle of the cone. Type : Float"),
    "Depth": z.number().optional().default(2).describe("Height of the generated cone. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a cone mesh. The cone is aligned with the Z axis and centered at the origin."),
z.object({
  type: z.literal("GeometryNodeMeshCube"),
  inputs: z.object({
    "Vertices__X": z.number().int().optional().default(2).describe("Number of vertices for the X side of the shape. Type : Int"),
    "Vertices__Y": z.number().int().optional().default(2).describe("Number of vertices for the Y side of the shape. Type : Int"),
    "Vertices__Z": z.number().int().optional().default(2).describe("Number of vertices for the Z side of the shape. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate a cuboid mesh with variable side lengths and subdivisions"),
z.object({
  type: z.literal("GeometryNodeMeshCylinder"),
  inputs: z.object({
    "Vertices": z.number().int().optional().default(32).describe("The number of vertices on the top and bottom circles. Type : Int"),
    "Side__Segments": z.number().int().optional().default(1).describe("The number of rectangular segments along each side. Type : Int"),
    "Fill__Segments": z.number().int().optional().default(1).describe("The number of concentric rings used to fill the round faces. Type : Int"),
    "Radius": z.number().optional().default(1).describe("The radius of the cylinder. Type : Float"),
    "Depth": z.number().optional().default(2).describe("The height of the cylinder. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a cylinder mesh. The cylinder is aligned with the Z axis and centered at the origin."),
z.object({
  type: z.literal("GeometryNodeMeshGrid"),
  inputs: z.object({
    "Size__X": z.number().optional().default(1).describe("Side length of the plane in the X direction. Type : Float"),
    "Size__Y": z.number().optional().default(1).describe("Side length of the plane in the Y direction. Type : Float"),
    "Vertices__X": z.number().int().optional().default(3).describe("Number of vertices in the X direction. Type : Int"),
    "Vertices__Y": z.number().int().optional().default(3).describe("Number of vertices in the Y direction. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate a planar mesh on the XY plane"),
z.object({
  type: z.literal("GeometryNodeMeshIcoSphere"),
  inputs: z.object({
    "Radius": z.number().optional().default(1).describe("Distance from the generated points to the origin. Type : Float"),
    "Subdivisions": z.number().int().optional().default(1).describe("Number of subdivisions on top of the basic icosahedron. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate a spherical mesh that consists of equally sized triangles"),
z.object({
  type: z.literal("GeometryNodeMeshLine"),
  inputs: z.object({
    "Count": z.number().int().optional().default(10).describe("      'Number of vertices on the line. Type : Int"),
    "Resolution": z.number().optional().default(1).describe("Length of each individual edge. Type : Float"),
    "Start__Location": z.array(z.number()).optional().describe("Position of the first vertex. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Generate vertices in a line and connect them with edges"),
z.object({
  type: z.literal("GeometryNodeMeshUVSphere"),
  inputs: z.object({
    "Segments": z.number().int().optional().default(32).describe("Horizontal resolution of the sphere. Type : Int"),
    "Rings": z.number().int().optional().default(16).describe("      'The number of horizontal rings. Type : Int"),
    "Radius": z.number().optional().default(1).describe("Distance from the generated points to the origin. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a spherical mesh with quads, except for triangles at the top and bottom"),
z.object({
  type: z.literal("GeometryNodeMeshToCurve"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Generate a curve from a mesh"),
z.object({
  type: z.literal("GeometryNodeMeshToDensityGrid"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Voxel__Size": z.number().optional().default(0.3).describe(". Type : Float"),
    "Gradient__Width": z.number().optional().default(0.2).describe("Width of the gradient inside of the mesh. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Create a filled volume grid from a mesh"),
z.object({
  type: z.literal("GeometryNodeMeshToPoints"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Radius": z.number().optional().default(0.05).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a point cloud from a mesh's vertices"),
z.object({
  type: z.literal("GeometryNodeMeshToSDFGrid"),
  inputs: z.object({
    "Voxel__Size": z.number().optional().default(0.3).describe(". Type : Float"),
    "Band__Width": z.number().int().optional().default(3).describe("Width of the active voxel surface, in voxels. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Create a signed distance volume grid from a mesh"),
z.object({
  type: z.literal("GeometryNodeMeshToVolume"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Voxel__Size": z.number().optional().default(0.3).describe(". Type : Float"),
    "Voxel__Amount": z.number().optional().default(64).describe(". Type : Float"),
    "Interior__Band__Width": z.number().optional().default(0.2).describe("Width of the gradient inside of the mesh. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Create a fog volume with the shape of the input mesh's surface"),
z.object({
  type: z.literal("GeometryNodeCornersOfEdge"),
  inputs: z.object({
    "Edge__Index": z.number().int().optional().describe("The edge to retrieve data from. Defaults to the edge from the context. Type : Int"),
    "Weights": z.number().optional().describe("      'Values that sort the corners attached to the edge. Type : Float"),
    "Sort__Index": z.number().int().optional().describe("Which of the sorted corners to output. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve face corners connected to edges"),
z.object({
  type: z.literal("GeometryNodeCornersOfFace"),
  inputs: z.object({
    "Face__Index": z.number().int().optional().describe("The face to retrieve data from. Defaults to the face from the context. Type : Int"),
    "Weights": z.number().optional().describe("      'Values used to sort the face's corners. Uses indices by default. Type : Float"),
    "Sort__Index": z.number().int().optional().describe("Which of the sorted corners to output. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve corners that make up a face"),
z.object({
  type: z.literal("GeometryNodeCornersOfVertex"),
  inputs: z.object({
    "Vertex__Index": z.number().int().optional().describe("The vertex to retrieve data from. Defaults to the vertex from the context. Type : Int"),
    "Weights": z.number().optional().describe("      'Values used to sort corners attached to the vertex. Uses indices by default. Type : Float"),
    "Sort__Index": z.number().int().optional().describe("Which of the sorted corners to output. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve face corners connected to vertices"),
z.object({
  type: z.literal("GeometryNodeEdgesOfCorner"),
  inputs: z.object({
    "Corner__Index": z.number().int().optional().describe("The corner to retrieve data from. Defaults to the corner from the context. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve the edges on both sides of a face corner"),
z.object({
  type: z.literal("GeometryNodeEdgesOfVertex"),
  inputs: z.object({
    "Vertex__Index": z.number().int().optional().describe("The vertex to retrieve data from. Defaults to the vertex from the context. Type : Int"),
    "Weights": z.number().optional().describe("      'Values used to sort the edges connected to the vertex. Uses indices by default. Type : Float"),
    "Sort__Index": z.number().int().optional().describe("Which of the sorted edges to output. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve the edges connected to each vertex"),
z.object({
  type: z.literal("GeometryNodeFaceOfCorner"),
  inputs: z.object({
    "Corner__Index": z.number().int().optional().describe("The corner to retrieve data from. Defaults to the corner from the context. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve the face each face corner is part of"),
z.object({
  type: z.literal("GeometryNodeOffsetCornerInFace"),
  inputs: z.object({
    "Corner__Index": z.number().int().optional().describe("The corner to retrieve data from. Defaults to the corner from the context. Type : Int"),
    "Offset": z.number().int().optional().describe("      'The number of corners to move around the face before finding the result, '      'circling around the start of the face if necessary. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve corners in the same face as another"),
z.object({
  type: z.literal("GeometryNodeVertexOfCorner"),
  inputs: z.object({
    "Corner__Index": z.number().int().optional().describe("The corner to retrieve data from. Defaults to the corner from the context. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Retrieve the vertex each face corner is attached to"),
z.object({
  type: z.literal("GeometryNodeObjectInfo"),
  inputs: z.object({
    "As__Instance": z.boolean().optional().describe("          'Output the entire object as single instance. '          'This allows instancing non-geometry object types. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Retrieve information from an object"),
z.object({
  type: z.literal("GeometryNodeOffsetPointInCurve"),
  inputs: z.object({
    "Point__Index": z.number().int().optional().describe("The index of the control point to evaluate. Defaults to the current index. Type : Int"),
    "Offset": z.number().int().optional().describe("      'The number of control points along the curve to traverse. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Offset a control point index within its curve"),
z.object({
  type: z.literal("GeometryNodePointsToCurves"),
  inputs: z.object({
    "Curve__Group__ID": z.number().int().optional().describe("          'A curve is created for every distinct group ID. All points with the same ID are put '          'into the same curve. Type : Int"),
    "Weight": z.number().optional().describe("      'Determines the order of points in each curve. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Split all points to curve by its group ID and reorder by weight"),
z.object({
  type: z.literal("GeometryNodePointsToSDFGrid"),
  inputs: z.object({
    "Radius": z.number().optional().default(0.5).describe(". Type : Float"),
    "Voxel__Size": z.number().optional().default(0.3).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Create a signed distance volume grid from points"),
z.object({
  type: z.literal("GeometryNodePointsToVertices"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Generate a mesh vertex for each point cloud point"),
z.object({
  type: z.literal("GeometryNodePointsToVolume"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a fog volume sphere around every point"),
z.object({
  type: z.literal("GeometryNodePoints"),
  inputs: z.object({
    "Count": z.number().int().optional().default(1).describe("      'The number of points to create. Type : Int"),
    "Radius": z.number().optional().default(0.1).describe("The radii of the new points. Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a point cloud with positions and radii defined by fields"),
z.object({
  type: z.literal("GeometryNodeProximity"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Compute the closest location on the target geometry"),
z.object({
  type: z.literal("GeometryNodeRaycast"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Cast rays from the context geometry onto a target geometry, and retrieve information from each hit point"),
z.object({
  type: z.literal("GeometryNodeRealizeInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe("Which top-level instances to realize. Type : Bool"),
    "Realize__All": z.boolean().optional().default(true).describe("          'Realize all levels of nested instances for a top-level instances. Overrides the value '          'of the Depth input. Type : Bool"),
    "Depth": z.number().int().optional().default(0).describe("      'Number of levels of nested instances to realize for each top-level instance. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Convert instances into real geometry data"),
z.object({
  type: z.literal("GeometryNodeRemoveAttribute"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe("Delete an attribute with a specified name from a geometry. Typically used to optimize performance"),
z.object({
  type: z.literal("GeometryNodeReplaceMaterial"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Swap one material with another"),
z.object({
  type: z.literal("GeometryNodeResampleCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a poly spline for each input spline"),
z.object({
  type: z.literal("GeometryNodeReverseCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Change the direction of curves by swapping their start and end data"),
z.object({
  type: z.literal("GeometryNodeRotateInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Pivot__Point": z.array(z.number()).optional().describe(". Type : Vector"),
    "Local__Space": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Rotate geometry instances in local or global space"),
z.object({
  type: z.literal("GeometryNodeSampleCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve data from a point on a curve at a certain distance from its start"),
z.object({
  type: z.literal("GeometryNodeSampleGrid"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe(""),
z.object({
  type: z.literal("GeometryNodeSampleGridIndex"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve volume grid values at specific voxels"),
z.object({
  type: z.literal("GeometryNodeSampleIndex"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve values from specific geometry elements"),
z.object({
  type: z.literal("GeometryNodeSampleNearestSurface"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Calculate the interpolated value of a mesh attribute on the closest point of its surface"),
z.object({
  type: z.literal("GeometryNodeSampleNearest"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Find the element of a geometry closest to a position. Similar to the \"Index of Nearest\" node"),
z.object({
  type: z.literal("GeometryNodeSampleUVSurface"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Calculate the interpolated values of a mesh attribute at a UV coordinate"),
z.object({
  type: z.literal("GeometryNodeScaleElements"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Scale": z.number().optional().default(1).describe(". Type : Float"),
    "Center": z.array(z.number()).optional().describe("          'Origin of the scaling for each element. If multiple elements are connected, their '          'center is averaged. Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Scale groups of connected edges and faces"),
z.object({
  type: z.literal("GeometryNodeScaleInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Scale geometry instances in local or global space"),
z.object({
  type: z.literal("GeometryNodeSDFGridBoolean"),
  inputs: z.object({
    "Grid__1": z.number().optional().describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Cut, subtract, or join multiple SDF volume grid inputs"),
z.object({
  type: z.literal("GeometryNodeSelfObject"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the object that contains the geometry nodes modifier currently being executed"),
z.object({
  type: z.literal("GeometryNodeSeparateComponents"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Split a geometry into a separate output for each type of data in the geometry"),
z.object({
  type: z.literal("GeometryNodeSeparateGeometry"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe("The parts of the geometry that go into the first output. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Split a geometry into two geometry outputs based on a selection"),
z.object({
  type: z.literal("GeometryNodeSetCurveHandlePositions"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Set the positions for the handles of Bézier curves"),
z.object({
  type: z.literal("GeometryNodeSetCurveNormal"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Set the evaluation mode for curve normals"),
z.object({
  type: z.literal("GeometryNodeSetCurveRadius"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Set the radius of the curve at each control point"),
z.object({
  type: z.literal("GeometryNodeSetCurveTilt"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Set the tilt angle at each curve control point"),
z.object({
  type: z.literal("GeometryNodeSetID"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "ID": z.number().int().optional().describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Set the id attribute on the input geometry, mainly used internally for randomizing"),
z.object({
  type: z.literal("GeometryNodeSetMaterialIndex"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Set the material index for each selected geometry element"),
z.object({
  type: z.literal("GeometryNodeSetMaterial"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Assign a material to geometry elements"),
z.object({
  type: z.literal("GeometryNodeSetPointRadius"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Radius": z.number().optional().default(0.05).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Set the display size of point cloud points"),
z.object({
  type: z.literal("GeometryNodeSetPosition"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Set the location of each point"),
z.object({
  type: z.literal("GeometryNodeSetShadeSmooth"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Shade__Smooth": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Control the smoothness of mesh normals around each face by changing the \"shade smooth\" attribute"),
z.object({
  type: z.literal("GeometryNodeSetSplineCyclic"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Control whether each spline loops back on itself by changing the \"cyclic\" attribute"),
z.object({
  type: z.literal("GeometryNodeSetSplineResolution"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Control how many evaluated points should be generated on every curve segment"),
z.object({
  type: z.literal("GeometryNodeSetInstanceTransform"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Set the transformation matrix of every instance"),
z.object({
  type: z.literal("GeometryNodeSortElements"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Group__ID": z.number().int().optional().describe(". Type : Int"),
    "Sort__Weight": z.number().optional().describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Rearrange geometry elements, changing their indices"),
z.object({
  type: z.literal("GeometryNodeSplitEdges"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Duplicate mesh edges and break connections with the surrounding faces"),
z.object({
  type: z.literal("GeometryNodeSplitToInstances"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Create separate geometries containing the elements from the same group"),
z.object({
  type: z.literal("GeometryNodeStoreNamedAttribute"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Name": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe("Store the result of a field on a geometry as an attribute with the specified name"),
z.object({
  type: z.literal("GeometryNodeStoreNamedGrid"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe("Store grid data in a volume geometry with the specified name"),
z.object({
  type: z.literal("GeometryNodeStringJoin"),
  inputs: z.object({
    "Delimiter": z.string().optional().describe(". Type : String"),
    "Strings": z.string().optional().describe(". Type : String")

  }),
  outputs: z.object({

})
}).describe("Combine any number of input strings"),
z.object({
  type: z.literal("GeometryNodeStringToCurves"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String"),
    "Size": z.number().optional().default(1).describe(". Type : Float"),
    "Character__Spacing": z.number().optional().default(1).describe(". Type : Float"),
    "Word__Spacing": z.number().optional().default(1).describe(". Type : Float"),
    "Line__Spacing": z.number().optional().default(1).describe(". Type : Float"),
    "Text__Box__Width": z.number().optional().default(0).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Generate a paragraph of text with a specific font, using a curve instance to store each character"),
z.object({
  type: z.literal("GeometryNodeSubdivideCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Dividing each curve segment into a specified number of pieces"),
z.object({
  type: z.literal("GeometryNodeSubdivideMesh"),
  inputs: z.object({
    "Level": z.number().int().optional().default(1).describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Divide mesh faces into smaller ones without changing the shape or volume, using linear interpolation to place the new vertices"),
z.object({
  type: z.literal("GeometryNodeSubdivisionSurface"),
  inputs: z.object({
    "Level": z.number().int().optional().default(1).describe(". Type : Int"),
    "Edge__Crease": z.number().optional().default(0).describe(". Type : Float"),
    "Vertex__Crease": z.number().optional().default(0).describe(". Type : Float")

  }),
  outputs: z.object({

})
}).describe("Divide mesh faces to form a smooth surface, using the Catmull-Clark subdivision method"),
z.object({
  type: z.literal("GeometryNodeSwitch"),
  inputs: z.object({
    "Switch": z.boolean().optional().describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Switch between two inputs"),
z.object({
  type: z.literal("GeometryNodeTool3DCursor"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("The scene's 3D cursor location and rotation"),
z.object({
  type: z.literal("GeometryNodeToolFaceSet"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Each face's sculpt face set value"),
z.object({
  type: z.literal("GeometryNodeToolMousePosition"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the position of the mouse cursor"),
z.object({
  type: z.literal("GeometryNodeToolSelection"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("User selection of the edited geometry, for tool execution"),
z.object({
  type: z.literal("GeometryNodeToolActiveElement"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Active element indices of the edited geometry, for tool execution"),
z.object({
  type: z.literal("GeometryNodeToolSetFaceSet"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Face__Set": z.number().int().optional().describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Set sculpt face set values for faces"),
z.object({
  type: z.literal("GeometryNodeToolSetSelection"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Set selection of the edited geometry, for tool execution"),
z.object({
  type: z.literal("GeometryNodeViewportTransform"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Retrieve the view direction and location of the 3D viewport"),
z.object({
  type: z.literal("GeometryNodeTransform"),
  inputs: z.object({
    "Translation": z.array(z.number()).optional().describe(". Type : Vector")

  }),
  outputs: z.object({

})
}).describe("Translate, rotate or scale the geometry"),
z.object({
  type: z.literal("GeometryNodeTranslateInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Translation": z.array(z.number()).optional().describe(". Type : Vector"),
    "Local__Space": z.boolean().optional().default(true).describe(". Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Move top-level geometry instances in local or global space"),
z.object({
  type: z.literal("GeometryNodeTriangulate"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Minimum__Vertices": z.number().int().optional().default(4).describe(". Type : Int")

  }),
  outputs: z.object({

})
}).describe("Convert all faces in a mesh to triangular faces"),
z.object({
  type: z.literal("GeometryNodeTrimCurve"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Shorten curves by removing portions at the start or end"),
z.object({
  type: z.literal("GeometryNodeUVPackIslands"),
  inputs: z.object({
    "UV": z.array(z.number()).optional().describe(". Type : Vector"),
    "Selection": z.boolean().optional().default(true).describe("Faces to consider when packing islands. Type : Bool"),
    "Margin": z.number().optional().default(0.001).describe("      'Space between islands. Type : Float"),
    "Rotate": z.boolean().optional().default(true).describe("Rotate islands for best fit. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Scale islands of a UV map and move them so they fill the UV space as much as possible"),
z.object({
  type: z.literal("GeometryNodeUVUnwrap"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe("Faces to participate in the unwrap operation. Type : Bool"),
    "Seam": z.boolean().optional().describe("      'Edges to mark where the mesh is \'cut\' for the purposes of unwrapping. Type : Bool"),
    "Margin": z.number().optional().default(0.001).describe("      'Space between islands. Type : Float"),
    "Fill__Holes": z.boolean().optional().default(true).describe("          'Virtually fill holes in mesh before unwrapping, to better avoid overlaps '          'and preserve symmetry. Type : Bool")

  }),
  outputs: z.object({

})
}).describe("Generate a UV map based on seam edges"),
z.object({
  type: z.literal("GeometryNodeViewer"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Display the input data in the Spreadsheet Editor"),
z.object({
  type: z.literal("GeometryNodeVolumeCube"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe("Volume density per voxel. Type : Float"),
    "Background": z.number().optional().describe("Value for voxels outside of the cube. Type : Float"),
    "Resolution__X": z.number().int().optional().default(32).describe("Number of voxels in the X axis. Type : Int"),
    "Resolution__Y": z.number().int().optional().default(32).describe("Number of voxels in the Y axis. Type : Int"),
    "Resolution__Z": z.number().int().optional().default(32).describe("Number of voxels in the Z axis. Type : Int")

  }),
  outputs: z.object({

})
}).describe("Generate a dense volume with a field that controls the density at each grid voxel based on its position"),
z.object({
  type: z.literal("GeometryNodeVolumeToMesh"),
  inputs: z.object({


  }),
  outputs: z.object({

})
}).describe("Generate a mesh on the \"surface\" of a volume")
]);
