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
}),
z.object({
  type: z.literal("ShaderNodeValToRGB"),
  inputs: z.object({
    "Fac": z.number().optional().default(0.5).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeVectorCurve"),
  inputs: z.object({
    "Fac": z.number().optional().describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeRGBCurve"),
  inputs: z.object({
    "Fac": z.number().optional().describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeMapRange"),
  inputs: z.object({
    "Value": z.number().optional().describe(". Type : Float"),
    "From Min": z.number().optional().describe(". Type : Float"),
    "From Max": z.number().optional().describe(". Type : Float"),
    "To Min": z.number().optional().describe(". Type : Float"),
    "To Max": z.number().optional().describe(". Type : Float"),
    "Steps": z.number().optional().describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "From_Min_FLOAT3": z.array(z.number()).optional().describe(". Type : Vector"),
    "From_Max_FLOAT3": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "To_Min_FLOAT3": z.array(z.number()).optional().describe(". Type : Vector"),
    "To_Max_FLOAT3": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "Steps_FLOAT3": z.array(z.number()).optional().default([4, 4, 4]).describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeClamp"),
  inputs: z.object({
    "Value": z.number().optional().default(1).describe(". Type : Float"),
    "Min": z.number().optional().default(0).describe(". Type : Float"),
    "Max": z.number().optional().default(1).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeMath"),
  inputs: z.object({
    "Value": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value_001": z.number().optional().default(0.5).describe(". Type : Float"),
    "Value_002": z.number().optional().default(0.5).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeVectorMath"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector_001": z.array(z.number()).optional().describe(". Type : Vector"),
    "Vector_002": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().default(1).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeBlackbody"),
  inputs: z.object({
    "Temperature": z.number().optional().default(1500).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexGradient"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexNoise"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "W": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexMagic"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().describe(". Type : Float"),
    "Distortion": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexWave"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.number().optional().describe(". Type : Float"),
    "Distortion": z.number().optional().describe(". Type : Float"),
    "Detail": z.number().optional().describe(". Type : Float"),
    "Detail Scale": z.number().optional().describe(". Type : Float"),
    "Detail Roughness": z.number().optional().describe(". Type : Float"),
    "Phase Offset": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexVoronoi"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "W": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexChecker"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexBrick"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeVectorRotate"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Center": z.array(z.number()).optional().describe("Point to rotate around. Type : Vector"),
    "Axis": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeSeparateXYZ"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeCombineXYZ"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeTexWhiteNoise"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "W": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeFloatCurve"),
  inputs: z.object({
    "Fac": z.number().optional().describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("ShaderNodeMix"),
  inputs: z.object({
    "Factor_Float": z.number().optional().default(0.5).describe(". Type : Float"),
    "Factor_Vector": z.array(z.number()).optional().default([0.5, 0.5, 0.5]).describe(". Type : Vector"),
    "A_Float": z.number().optional().describe(". Type : Float"),
    "B_Float": z.number().optional().describe(". Type : Float"),
    "A_Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "B_Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeAlignEulerToVector"),
  inputs: z.object({
    "Rotation": z.array(z.number()).optional().describe(". Type : Vector"),
    "Factor": z.number().optional().default(1).describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeAlignRotationToVector"),
  inputs: z.object({
    "Factor": z.number().optional().default(1).describe(". Type : Float"),
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeAxesToRotation"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeAxisAngleToRotation"),
  inputs: z.object({
    "Axis": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeBooleanMath"),
  inputs: z.object({
    "Boolean": z.boolean().optional().describe(". Type : Bool"),
    "Boolean_001": z.boolean().optional().describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
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
}),
z.object({
  type: z.literal("FunctionNodeCombineMatrix"),
  inputs: z.object({
    "Column 1 Row 1": z.number().optional().default(1).describe(". Type : Float"),
    "Column 1 Row 2": z.number().optional().describe(". Type : Float"),
    "Column 1 Row 3": z.number().optional().describe(". Type : Float"),
    "Column 1 Row 4": z.number().optional().describe(". Type : Float"),
    "Column 2 Row 1": z.number().optional().describe(". Type : Float"),
    "Column 2 Row 2": z.number().optional().default(1).describe(". Type : Float"),
    "Column 2 Row 3": z.number().optional().describe(". Type : Float"),
    "Column 2 Row 4": z.number().optional().describe(". Type : Float"),
    "Column 3 Row 1": z.number().optional().describe(". Type : Float"),
    "Column 3 Row 2": z.number().optional().describe(". Type : Float"),
    "Column 3 Row 3": z.number().optional().default(1).describe(". Type : Float"),
    "Column 3 Row 4": z.number().optional().describe(". Type : Float"),
    "Column 4 Row 1": z.number().optional().describe(". Type : Float"),
    "Column 4 Row 2": z.number().optional().describe(". Type : Float"),
    "Column 4 Row 3": z.number().optional().describe(". Type : Float"),
    "Column 4 Row 4": z.number().optional().default(1).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
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
}),
z.object({
  type: z.literal("FunctionNodeCombineTransform"),
  inputs: z.object({
    "Translation": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeCompare"),
  inputs: z.object({
    "A": z.number().optional().describe(". Type : Float"),
    "B": z.number().optional().describe(". Type : Float"),
    "A_INT": z.number().int().optional().describe(". Type : Int"),
    "B_INT": z.number().int().optional().describe(". Type : Int"),
    "A_VEC3": z.array(z.number()).optional().describe(". Type : Vector"),
    "B_VEC3": z.array(z.number()).optional().describe(". Type : Vector"),
    "A_STR": z.string().optional().describe(". Type : String"),
    "B_STR": z.string().optional().describe(". Type : String"),
    "C": z.number().optional().default(0.9).describe(". Type : Float"),
    "Angle": z.number().optional().default(0.0872665).describe(". Type : Float"),
    "Epsilon": z.number().optional().default(0.001).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeEulerToRotation"),
  inputs: z.object({
    "Euler": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeFloatToInt"),
  inputs: z.object({
    "Float": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputBool"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputColor"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputInt"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputRotation"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputSpecialCharacters"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputString"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInputVector"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInvertMatrix"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeInvertRotation"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeMatrixMultiply"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeProjectPoint"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRandomValue"),
  inputs: z.object({
    "Min": z.array(z.number()).optional().describe(". Type : Vector"),
    "Max": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeReplaceString"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String"),
    "Find": z.string().optional().describe("The string to find in the input string. Type : String"),
    "Replace": z.string().optional().describe("The string to replace each match with. Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRotateEuler"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRotateRotation"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRotateVector"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRotationToAxisAngle"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRotationToEuler"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeSeparateColor"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeSeparateMatrix"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeRotationToQuaternion"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeSeparateTransform"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeSliceString"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String"),
    "Position": z.number().int().optional().describe(". Type : Int"),
    "Length": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeStringLength"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeTransformDirection"),
  inputs: z.object({
    "Direction": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeTransformPoint"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeTransposeMatrix"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("FunctionNodeValueToString"),
  inputs: z.object({
    "Value": z.number().optional().describe(". Type : Float"),
    "Decimals": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeAccumulateField"),
  inputs: z.object({
    "Value": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeAttributeDomainSize"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeAttributeStatistic"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeBake"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeBlurAttribute"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeBoundBox"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCaptureAttribute"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCollectionInfo"),
  inputs: z.object({
    "Separate Children": z.boolean().optional().describe(". Type : Bool"),
    "Reset Children": z.boolean().optional().describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeConvexHull"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveEndpointSelection"),
  inputs: z.object({
    "Start Size": z.number().int().optional().describe(". Type : Int"),
    "End Size": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveHandleTypeSelection"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveLength"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveArc"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveBezierSegment"),
  inputs: z.object({
    "Resolution": z.number().int().optional().default(16).describe(". Type : Int"),
    "Start": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveCircle"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveLine"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveQuadraticBezier"),
  inputs: z.object({
    "Resolution": z.number().int().optional().default(16).describe(". Type : Int"),
    "Start": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurvePrimitiveQuadrilateral"),
  inputs: z.object({
    "Width": z.number().optional().default(2).describe(". Type : Float"),
    "Height": z.number().optional().default(2).describe(". Type : Float"),
    "Bottom Width": z.number().optional().default(4).describe(". Type : Float"),
    "Top Width": z.number().optional().default(2).describe(". Type : Float"),
    "Offset": z.number().optional().default(1).describe(". Type : Float"),
    "Bottom Height": z.number().optional().default(3).describe(". Type : Float"),
    "Top Height": z.number().optional().default(1).describe(". Type : Float"),
    "Point 1": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveSpiral"),
  inputs: z.object({
    "Resolution": z.number().int().optional().default(32).describe(". Type : Int"),
    "Rotations": z.number().optional().default(2).describe(". Type : Float"),
    "Start Radius": z.number().optional().default(1).describe(". Type : Float"),
    "End Radius": z.number().optional().default(2).describe(". Type : Float"),
    "Height": z.number().optional().default(2).describe(". Type : Float"),
    "Reverse": z.boolean().optional().describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveStar"),
  inputs: z.object({
    "Points": z.number().int().optional().default(8).describe(". Type : Int"),
    "Inner Radius": z.number().optional().default(1).describe(". Type : Float"),
    "Outer Radius": z.number().optional().default(2).describe(". Type : Float"),
    "Twist": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveSetHandles"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSplineParameter"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveSplineType"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveToMesh"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveToPoints"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCurveOfPoint"),
  inputs: z.object({
    "Point Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodePointsOfCurve"),
  inputs: z.object({
    "Curve Index": z.number().int().optional().describe(". Type : Int"),
    "Weights": z.number().optional().describe(". Type : Float"),
    "Sort Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDeformCurvesOnSurface"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDeleteGeometry"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDistributePointsInGrid"),
  inputs: z.object({
    "Grid": z.number().optional().describe(". Type : Float"),
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Seed": z.number().int().optional().describe(". Type : Int"),
    "Spacing": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDistributePointsInVolume"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Seed": z.number().int().optional().describe(". Type : Int"),
    "Spacing": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDistributePointsOnFaces"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDualMesh"),
  inputs: z.object({
    "Keep Boundaries": z.boolean().optional().default(false).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeDuplicateElements"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Amount": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeEdgePathsToCurves"),
  inputs: z.object({
    "Start Vertices": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Next Vertex Index": z.number().int().optional().default(-1).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeEdgePathsToSelection"),
  inputs: z.object({
    "Start Vertices": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Next Vertex Index": z.number().int().optional().default(-1).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeEdgesToFaceGroups"),
  inputs: z.object({
    "Boundary Edges": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeFieldAtIndex"),
  inputs: z.object({
    "Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeFieldOnDomain"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeExtrudeMesh"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset Scale": z.number().optional().default(1).describe(". Type : Float"),
    "Individual": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeFillCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeFilletCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeFlipFaces"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeGeometryToInstance"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeGetNamedGrid"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String"),
    "Remove": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeGridToMesh"),
  inputs: z.object({
    "Grid": z.number().optional().describe(". Type : Float"),
    "Threshold": z.number().optional().default(0.1).describe("Values larger than the threshold are inside the generated mesh. Type : Float"),
    "Adaptivity": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeImageInfo"),
  inputs: z.object({
    "Frame": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeImageTexture"),
  inputs: z.object({
    "Vector": z.array(z.number()).optional().describe(". Type : Vector"),
    "Frame": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputImage"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeImportSTL"),
  inputs: z.object({
    "Path": z.string().optional().default("").describe("Path to a STL file. Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeIndexOfNearest"),
  inputs: z.object({
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Group ID": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeIndexSwitch"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputActiveCamera"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputCurveHandlePositions"),
  inputs: z.object({
    "Relative": z.boolean().optional().default(false).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputCurveTilt"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputEdgeSmooth"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputShadeSmooth"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputID"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputIndex"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputInstanceRotation"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputInstanceScale"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMaterialIndex"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInstanceTransform"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMaterial"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshEdgeAngle"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshEdgeNeighbors"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshEdgeVertices"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshFaceArea"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshFaceIsPlanar"),
  inputs: z.object({
    "Threshold": z.number().optional().default(0.01).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshFaceNeighbors"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshIsland"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputMeshVertexNeighbors"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputNamedAttribute"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputNamedLayerSelection"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputNormal"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputPosition"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputRadius"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputSceneTime"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputShortestEdgePaths"),
  inputs: z.object({
    "End Vertex": z.boolean().optional().default(false).describe(". Type : Bool"),
    "Edge Cost": z.number().optional().default(1).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputSplineCyclic"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSplineLength"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputSplineResolution"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInputTangent"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInstanceOnPoints"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInstancesToPoints"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Radius": z.number().optional().default(0.05).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeInterpolateCurves"),
  inputs: z.object({
    "Guide Up": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeIsViewport"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeJoinGeometry"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMaterialSelection"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMenuSwitch"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMergeByDistance"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshBoolean"),
  inputs: z.object({
    "Self Intersection": z.boolean().optional().describe(". Type : Bool"),
    "Hole Tolerant": z.boolean().optional().describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshFaceSetBoundaries"),
  inputs: z.object({
    "Face Set": z.number().int().optional().default(0).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshCircle"),
  inputs: z.object({
    "Vertices": z.number().int().optional().default(32).describe(". Type : Int"),
    "Radius": z.number().optional().default(1).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshCone"),
  inputs: z.object({
    "Vertices": z.number().int().optional().default(32).describe(". Type : Int"),
    "Side Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Fill Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Radius Top": z.number().optional().describe(". Type : Float"),
    "Radius Bottom": z.number().optional().default(1).describe(". Type : Float"),
    "Depth": z.number().optional().default(2).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshCube"),
  inputs: z.object({
    "Size": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "Vertices X": z.number().int().optional().default(2).describe(". Type : Int"),
    "Vertices Y": z.number().int().optional().default(2).describe(". Type : Int"),
    "Vertices Z": z.number().int().optional().default(2).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshCylinder"),
  inputs: z.object({
    "Vertices": z.number().int().optional().default(32).describe(". Type : Int"),
    "Side Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Fill Segments": z.number().int().optional().default(1).describe(". Type : Int"),
    "Radius": z.number().optional().default(1).describe(". Type : Float"),
    "Depth": z.number().optional().default(2).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshGrid"),
  inputs: z.object({
    "Size X": z.number().optional().default(1).describe(". Type : Float"),
    "Size Y": z.number().optional().default(1).describe(". Type : Float"),
    "Vertices X": z.number().int().optional().default(3).describe(". Type : Int"),
    "Vertices Y": z.number().int().optional().default(3).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshIcoSphere"),
  inputs: z.object({
    "Radius": z.number().optional().default(1).describe(". Type : Float"),
    "Subdivisions": z.number().int().optional().default(1).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshLine"),
  inputs: z.object({
    "Count": z.number().int().optional().default(10).describe(". Type : Int"),
    "Resolution": z.number().optional().default(1).describe(". Type : Float"),
    "Start Location": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshUVSphere"),
  inputs: z.object({
    "Segments": z.number().int().optional().default(32).describe(". Type : Int"),
    "Rings": z.number().int().optional().default(16).describe(". Type : Int"),
    "Radius": z.number().optional().default(1).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshToCurve"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshToDensityGrid"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Voxel Size": z.number().optional().default(0.3).describe(". Type : Float"),
    "Gradient Width": z.number().optional().default(0.2).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshToPoints"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Radius": z.number().optional().default(0.05).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshToSDFGrid"),
  inputs: z.object({
    "Voxel Size": z.number().optional().default(0.3).describe(". Type : Float"),
    "Band Width": z.number().int().optional().default(3).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeMeshToVolume"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Voxel Size": z.number().optional().default(0.3).describe(". Type : Float"),
    "Voxel Amount": z.number().optional().default(64).describe(". Type : Float"),
    "Interior Band Width": z.number().optional().default(0.2).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCornersOfEdge"),
  inputs: z.object({
    "Edge Index": z.number().int().optional().describe(". Type : Int"),
    "Weights": z.number().optional().describe(". Type : Float"),
    "Sort Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCornersOfFace"),
  inputs: z.object({
    "Face Index": z.number().int().optional().describe(". Type : Int"),
    "Weights": z.number().optional().describe(". Type : Float"),
    "Sort Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeCornersOfVertex"),
  inputs: z.object({
    "Vertex Index": z.number().int().optional().describe(". Type : Int"),
    "Weights": z.number().optional().describe(". Type : Float"),
    "Sort Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeEdgesOfCorner"),
  inputs: z.object({
    "Corner Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeEdgesOfVertex"),
  inputs: z.object({
    "Vertex Index": z.number().int().optional().describe(". Type : Int"),
    "Weights": z.number().optional().describe(". Type : Float"),
    "Sort Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeFaceOfCorner"),
  inputs: z.object({
    "Corner Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeOffsetCornerInFace"),
  inputs: z.object({
    "Corner Index": z.number().int().optional().describe(". Type : Int"),
    "Offset": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeVertexOfCorner"),
  inputs: z.object({
    "Corner Index": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeObjectInfo"),
  inputs: z.object({
    "As Instance": z.boolean().optional().describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeOffsetPointInCurve"),
  inputs: z.object({
    "Point Index": z.number().int().optional().describe(". Type : Int"),
    "Offset": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodePointsToCurves"),
  inputs: z.object({
    "Curve Group ID": z.number().int().optional().describe(". Type : Int"),
    "Weight": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodePointsToSDFGrid"),
  inputs: z.object({
    "Radius": z.number().optional().default(0.5).describe(". Type : Float"),
    "Voxel Size": z.number().optional().default(0.3).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodePointsToVertices"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodePointsToVolume"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe(". Type : Float"),
    "Voxel Size": z.number().optional().default(0.3).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodePoints"),
  inputs: z.object({
    "Count": z.number().int().optional().default(1).describe(". Type : Int"),
    "Position": z.array(z.number()).optional().default([0, 0, 0]).describe(". Type : Vector"),
    "Radius": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeProximity"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeRaycast"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeRealizeInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Realize All": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Depth": z.number().int().optional().default(0).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeRemoveAttribute"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeReplaceMaterial"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeResampleCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeReverseCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeRotateInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Pivot Point": z.array(z.number()).optional().describe(". Type : Vector"),
    "Local Space": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleGrid"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleGridIndex"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleIndex"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleNearestSurface"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleNearest"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSampleUVSurface"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeScaleElements"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Scale": z.number().optional().default(1).describe(". Type : Float"),
    "Center": z.array(z.number()).optional().describe(". Type : Vector"),
    "Axis": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeScaleInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Scale": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSDFGridBoolean"),
  inputs: z.object({
    "Grid 1": z.number().optional().describe(". Type : Float"),
    "Grid 2": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSelfObject"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSeparateComponents"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSeparateGeometry"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetCurveHandlePositions"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetCurveNormal"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetCurveRadius"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetCurveTilt"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetID"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "ID": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetMaterialIndex"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetMaterial"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetPointRadius"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Radius": z.number().optional().default(0.05).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetPosition"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Position": z.array(z.number()).optional().describe(". Type : Vector"),
    "Offset": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetShadeSmooth"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Shade Smooth": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetSplineCyclic"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetSplineResolution"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSetInstanceTransform"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSortElements"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Group ID": z.number().int().optional().describe(". Type : Int"),
    "Sort Weight": z.number().optional().describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSplitEdges"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSplitToInstances"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeStoreNamedAttribute"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Name": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeStoreNamedGrid"),
  inputs: z.object({
    "Name": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeStringJoin"),
  inputs: z.object({
    "Delimiter": z.string().optional().describe(". Type : String"),
    "Strings": z.string().optional().describe(". Type : String")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeStringToCurves"),
  inputs: z.object({
    "String": z.string().optional().describe(". Type : String"),
    "Size": z.number().optional().default(1).describe(". Type : Float"),
    "Character Spacing": z.number().optional().default(1).describe(". Type : Float"),
    "Word Spacing": z.number().optional().default(1).describe(". Type : Float"),
    "Line Spacing": z.number().optional().default(1).describe(". Type : Float"),
    "Text Box Width": z.number().optional().default(0).describe(". Type : Float"),
    "Text Box Height": z.number().optional().default(0).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSubdivideCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSubdivideMesh"),
  inputs: z.object({
    "Level": z.number().int().optional().default(1).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSubdivisionSurface"),
  inputs: z.object({
    "Level": z.number().int().optional().default(1).describe(". Type : Int"),
    "Edge Crease": z.number().optional().default(0).describe(". Type : Float"),
    "Vertex Crease": z.number().optional().default(0).describe(". Type : Float")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeSwitch"),
  inputs: z.object({
    "Switch": z.boolean().optional().describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeTool3DCursor"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeToolFaceSet"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeToolMousePosition"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeToolSelection"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeToolActiveElement"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeToolSetFaceSet"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Face Set": z.number().int().optional().describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeToolSetSelection"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeViewportTransform"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeTransform"),
  inputs: z.object({
    "Translation": z.array(z.number()).optional().describe(". Type : Vector"),
    "Scale": z.array(z.number()).optional().describe(". Type : Vector")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeTranslateInstances"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Translation": z.array(z.number()).optional().describe(". Type : Vector"),
    "Local Space": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeTriangulate"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Minimum Vertices": z.number().int().optional().default(4).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeTrimCurve"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeUVPackIslands"),
  inputs: z.object({
    "UV": z.array(z.number()).optional().describe(". Type : Vector"),
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Margin": z.number().optional().default(0.001).describe(". Type : Float"),
    "Rotate": z.boolean().optional().default(true).describe("Rotate islands for best fit. Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeUVUnwrap"),
  inputs: z.object({
    "Selection": z.boolean().optional().default(true).describe(". Type : Bool"),
    "Seam": z.boolean().optional().describe(". Type : Bool"),
    "Margin": z.number().optional().default(0.001).describe(". Type : Float"),
    "Fill Holes": z.boolean().optional().default(true).describe(". Type : Bool")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeViewer"),
  inputs: z.object({

  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeVolumeCube"),
  inputs: z.object({
    "Density": z.number().optional().default(1).describe("Volume density per voxel. Type : Float"),
    "Background": z.number().optional().describe("Value for voxels outside of the cube. Type : Float"),
    "Min": z.array(z.number()).optional().default([-1, -1, -1]).describe(". Type : Vector"),
    "Max": z.array(z.number()).optional().default([1, 1, 1]).describe(". Type : Vector"),
    "Resolution X": z.number().int().optional().default(32).describe(". Type : Int"),
    "Resolution Y": z.number().int().optional().default(32).describe(". Type : Int"),
    "Resolution Z": z.number().int().optional().default(32).describe(". Type : Int")
  }),
  outputs: z.object({

})
}),
z.object({
  type: z.literal("GeometryNodeVolumeToMesh"),
  inputs: z.object({
    "Voxel Size": z.number().optional().default(0.3).describe(". Type : Float")
  }),
  outputs: z.object({

})
})
]);
