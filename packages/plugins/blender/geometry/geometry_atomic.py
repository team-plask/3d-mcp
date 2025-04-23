# Generated blender implementation for geometry atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal


def addNodeBatch(nodes: Union[Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any], Dict[str, Any]]) -> Dict[str, Any]:
    """
    Adds a batch of nodes to the current edited geometry. The nodes are added in the order they are provided.

    Args:
    nodes (Union[Dict[str, Any] with keys {"type": Literal["ShaderNodeValue"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["ShaderNodeValToRGB"], "inputs": Dict[str, Any] with keys {"Fac": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeVectorCurve"], "inputs": Dict[str, Any] with keys {"Fac": str, "Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeRGBCurve"], "inputs": Dict[str, Any] with keys {"Fac": str, "Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeMapRange"], "inputs": Dict[str, Any] with keys {"Value": str, "From Min": str, "From Max": str, "To Min": str, "To Max": str, "Steps": str, "Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeClamp"], "inputs": Dict[str, Any] with keys {"Value": str, "Min": str, "Max": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeMath"], "inputs": Dict[str, Any] with keys {"Value": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeVectorMath"], "inputs": Dict[str, Any] with keys {"Vector": str, "Scale": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeBlackbody"], "inputs": Dict[str, Any] with keys {"Temperature": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexGradient"], "inputs": Dict[str, Any] with keys {"Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexNoise"], "inputs": Dict[str, Any] with keys {"Vector": str, "W": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexMagic"], "inputs": Dict[str, Any] with keys {"Vector": str, "Scale": str, "Distortion": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexWave"], "inputs": Dict[str, Any] with keys {"Vector": str, "Scale": str, "Distortion": str, "Detail": str, "Detail Scale": str, "Detail Roughness": str, "Phase Offset": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexVoronoi"], "inputs": Dict[str, Any] with keys {"Vector": str, "W": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexChecker"], "inputs": Dict[str, Any] with keys {"Vector": str, "Color1": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexBrick"], "inputs": Dict[str, Any] with keys {"Vector": str, "Color1": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeVectorRotate"], "inputs": Dict[str, Any] with keys {"Vector": str, "Center": str, "Axis": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeSeparateXYZ"], "inputs": Dict[str, Any] with keys {"Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeCombineXYZ"], "inputs": Dict[str, Any] with keys {"Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeTexWhiteNoise"], "inputs": Dict[str, Any] with keys {"Vector": str, "W": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeFloatCurve"], "inputs": Dict[str, Any] with keys {"Fac": str, "Vector": str}}, Dict[str, Any] with keys {"type": Literal["ShaderNodeMix"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeAlignEulerToVector"], "inputs": Dict[str, Any] with keys {"Rotation": str, "Factor": str, "Vector": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeAlignRotationToVector"], "inputs": Dict[str, Any] with keys {"Rotation": str, "Factor": str, "Vector": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeAxesToRotation"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeAxisAngleToRotation"], "inputs": Dict[str, Any] with keys {"Axis": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeBooleanMath"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeCombineColor"], "inputs": Dict[str, Any] with keys {"Red": str, "Green": str, "Blue": str, "Alpha": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeCombineMatrix"], "inputs": Dict[str, Any] with keys {"Column 1 Row 1": str, "Column 1 Row 2": str, "Column 1 Row 3": str, "Column 1 Row 4": str, "Column 2 Row 1": str, "Column 2 Row 2": str, "Column 2 Row 3": str, "Column 2 Row 4": str, "Column 3 Row 1": str, "Column 3 Row 2": str, "Column 3 Row 3": str, "Column 3 Row 4": str, "Column 4 Row 1": str, "Column 4 Row 2": str, "Column 4 Row 3": str, "Column 4 Row 4": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeQuaternionToRotation"], "inputs": Dict[str, Any] with keys {"W": str, "X": str, "Y": str, "Z": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeCombineTransform"], "inputs": Dict[str, Any] with keys {"Translation": str, "Rotation": str, "Scale": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeCompare"], "inputs": Dict[str, Any] with keys {"A": str, "B": str, "C": str, "Angle": str, "Epsilon": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeEulerToRotation"], "inputs": Dict[str, Any] with keys {"Euler": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeFloatToInt"], "inputs": Dict[str, Any] with keys {"Float": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputBool"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputColor"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputInt"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputRotation"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputSpecialCharacters"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputString"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInputVector"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInvertMatrix"], "inputs": Dict[str, Any] with keys {"Matrix": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeInvertRotation"], "inputs": Dict[str, Any] with keys {"Rotation": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeMatrixMultiply"], "inputs": Dict[str, Any] with keys {"Matrix": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeProjectPoint"], "inputs": Dict[str, Any] with keys {"Vector": str, "Transform": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRandomValue"], "inputs": Dict[str, Any] with keys {"Min": str, "Max": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeReplaceString"], "inputs": Dict[str, Any] with keys {"String": str, "Find": str, "Replace": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRotateEuler"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRotateRotation"], "inputs": Dict[str, Any] with keys {"Rotation": str, "Rotate By": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRotateVector"], "inputs": Dict[str, Any] with keys {"Vector": str, "Rotation": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRotationToAxisAngle"], "inputs": Dict[str, Any] with keys {"Rotation": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRotationToEuler"], "inputs": Dict[str, Any] with keys {"Rotation": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeSeparateColor"], "inputs": Dict[str, Any] with keys {"Color": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeSeparateMatrix"], "inputs": Dict[str, Any] with keys {"Matrix": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeRotationToQuaternion"], "inputs": Dict[str, Any] with keys {"Rotation": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeSeparateTransform"], "inputs": Dict[str, Any] with keys {"Transform": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeSliceString"], "inputs": Dict[str, Any] with keys {"String": str, "Position": str, "Length": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeStringLength"], "inputs": Dict[str, Any] with keys {"String": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeTransformDirection"], "inputs": Dict[str, Any] with keys {"Direction": str, "Transform": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeTransformPoint"], "inputs": Dict[str, Any] with keys {"Vector": str, "Transform": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeTransposeMatrix"], "inputs": Dict[str, Any] with keys {"Matrix": str}}, Dict[str, Any] with keys {"type": Literal["FunctionNodeValueToString"], "inputs": Dict[str, Any] with keys {"Value": str, "Decimals": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeAccumulateField"], "inputs": Dict[str, Any] with keys {"Value": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeAttributeDomainSize"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeAttributeStatistic"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeBake"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeBlurAttribute"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeBoundBox"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCaptureAttribute"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCollectionInfo"], "inputs": Dict[str, Any] with keys {"Collection": str, "Separate Children": str, "Reset Children": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeConvexHull"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveEndpointSelection"], "inputs": Dict[str, Any] with keys {"Start Size": str, "End Size": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveHandleTypeSelection"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveLength"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveArc"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurvePrimitiveBezierSegment"], "inputs": Dict[str, Any] with keys {"Resolution": str, "Start": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurvePrimitiveCircle"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurvePrimitiveLine"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveQuadraticBezier"], "inputs": Dict[str, Any] with keys {"Resolution": str, "Start": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurvePrimitiveQuadrilateral"], "inputs": Dict[str, Any] with keys {"Width": str, "Height": str, "Bottom Width": str, "Top Width": str, "Offset": str, "Bottom Height": str, "Top Height": str, "Point 1": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveSpiral"], "inputs": Dict[str, Any] with keys {"Resolution": str, "Rotations": str, "Start Radius": str, "End Radius": str, "Height": str, "Reverse": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveStar"], "inputs": Dict[str, Any] with keys {"Points": str, "Inner Radius": str, "Outer Radius": str, "Twist": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveSetHandles"], "inputs": Dict[str, Any] with keys {"Curve": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSplineParameter"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveSplineType"], "inputs": Dict[str, Any] with keys {"Curve": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveToMesh"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveToPoints"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCurveOfPoint"], "inputs": Dict[str, Any] with keys {"Point Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodePointsOfCurve"], "inputs": Dict[str, Any] with keys {"Curve Index": str, "Weights": str, "Sort Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDeformCurvesOnSurface"], "inputs": Dict[str, Any] with keys {"Curves": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDeleteGeometry"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDistributePointsInGrid"], "inputs": Dict[str, Any] with keys {"Grid": str, "Density": str, "Seed": str, "Spacing": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDistributePointsInVolume"], "inputs": Dict[str, Any] with keys {"Volume": str, "Density": str, "Seed": str, "Spacing": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDistributePointsOnFaces"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDualMesh"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Keep Boundaries": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeDuplicateElements"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Amount": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeEdgePathsToCurves"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Start Vertices": str, "Next Vertex Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeEdgePathsToSelection"], "inputs": Dict[str, Any] with keys {"Start Vertices": str, "Next Vertex Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeEdgesToFaceGroups"], "inputs": Dict[str, Any] with keys {"Boundary Edges": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeFieldAtIndex"], "inputs": Dict[str, Any] with keys {"Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeFieldOnDomain"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeExtrudeMesh"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str, "Offset": str, "Offset Scale": str, "Individual": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeFillCurve"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeFilletCurve"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeFlipFaces"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeGeometryToInstance"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeGetNamedGrid"], "inputs": Dict[str, Any] with keys {"Volume": str, "Name": str, "Remove": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeGridToMesh"], "inputs": Dict[str, Any] with keys {"Grid": str, "Threshold": str, "Adaptivity": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeImageInfo"], "inputs": Dict[str, Any] with keys {"Image": str, "Frame": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeImageTexture"], "inputs": Dict[str, Any] with keys {"Image": str, "Vector": str, "Frame": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputImage"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeImportSTL"], "inputs": Dict[str, Any] with keys {"Path": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeIndexOfNearest"], "inputs": Dict[str, Any] with keys {"Position": str, "Group ID": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeIndexSwitch"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputActiveCamera"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputCurveHandlePositions"], "inputs": Dict[str, Any] with keys {"Relative": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputCurveTilt"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputEdgeSmooth"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputShadeSmooth"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputID"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputIndex"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputInstanceRotation"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputInstanceScale"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMaterialIndex"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInstanceTransform"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMaterial"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshEdgeAngle"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshEdgeNeighbors"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshEdgeVertices"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshFaceArea"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshFaceIsPlanar"], "inputs": Dict[str, Any] with keys {"Threshold": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshFaceNeighbors"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshIsland"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputMeshVertexNeighbors"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputNamedAttribute"], "inputs": Dict[str, Any] with keys {"Name": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputNamedLayerSelection"], "inputs": Dict[str, Any] with keys {"Name": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputNormal"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputPosition"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputRadius"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputSceneTime"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputShortestEdgePaths"], "inputs": Dict[str, Any] with keys {"End Vertex": str, "Edge Cost": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputSplineCyclic"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSplineLength"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputSplineResolution"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInputTangent"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInstanceOnPoints"], "inputs": Dict[str, Any] with keys {"Points": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInstancesToPoints"], "inputs": Dict[str, Any] with keys {"Instances": str, "Selection": str, "Position": str, "Radius": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeInterpolateCurves"], "inputs": Dict[str, Any] with keys {"Guide Curves": str, "Guide Up": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeIsViewport"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeJoinGeometry"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMaterialSelection"], "inputs": Dict[str, Any] with keys {"Material": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMenuSwitch"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMergeByDistance"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshBoolean"], "inputs": Dict[str, Any] with keys {"Mesh 1": str, "Mesh 2": str, "Self Intersection": str, "Hole Tolerant": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshFaceSetBoundaries"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshCircle"], "inputs": Dict[str, Any] with keys {"Vertices": str, "Radius": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshCone"], "inputs": Dict[str, Any] with keys {"Vertices": str, "Side Segments": str, "Fill Segments": str, "Radius Top": str, "Radius Bottom": str, "Depth": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshCube"], "inputs": Dict[str, Any] with keys {"Size": str, "Vertices X": str, "Vertices Y": str, "Vertices Z": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshCylinder"], "inputs": Dict[str, Any] with keys {"Vertices": str, "Side Segments": str, "Fill Segments": str, "Radius": str, "Depth": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshGrid"], "inputs": Dict[str, Any] with keys {"Size X": str, "Size Y": str, "Vertices X": str, "Vertices Y": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshIcoSphere"], "inputs": Dict[str, Any] with keys {"Radius": str, "Subdivisions": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshLine"], "inputs": Dict[str, Any] with keys {"Count": str, "Resolution": str, "Start Location": str, "Offset": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshUVSphere"], "inputs": Dict[str, Any] with keys {"Segments": str, "Rings": str, "Radius": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshToCurve"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshToDensityGrid"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Density": str, "Voxel Size": str, "Gradient Width": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshToPoints"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str, "Position": str, "Radius": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshToSDFGrid"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Voxel Size": str, "Band Width": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeMeshToVolume"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Density": str, "Voxel Size": str, "Voxel Amount": str, "Interior Band Width": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCornersOfEdge"], "inputs": Dict[str, Any] with keys {"Edge Index": str, "Weights": str, "Sort Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCornersOfFace"], "inputs": Dict[str, Any] with keys {"Face Index": str, "Weights": str, "Sort Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeCornersOfVertex"], "inputs": Dict[str, Any] with keys {"Vertex Index": str, "Weights": str, "Sort Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeEdgesOfCorner"], "inputs": Dict[str, Any] with keys {"Corner Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeEdgesOfVertex"], "inputs": Dict[str, Any] with keys {"Vertex Index": str, "Weights": str, "Sort Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeFaceOfCorner"], "inputs": Dict[str, Any] with keys {"Corner Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeOffsetCornerInFace"], "inputs": Dict[str, Any] with keys {"Corner Index": str, "Offset": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeVertexOfCorner"], "inputs": Dict[str, Any] with keys {"Corner Index": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeObjectInfo"], "inputs": Dict[str, Any] with keys {"Object": str, "As Instance": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeOffsetPointInCurve"], "inputs": Dict[str, Any] with keys {"Point Index": str, "Offset": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodePointsToCurves"], "inputs": Dict[str, Any] with keys {"Points": str, "Curve Group ID": str, "Weight": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodePointsToSDFGrid"], "inputs": Dict[str, Any] with keys {"Points": str, "Radius": str, "Voxel Size": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodePointsToVertices"], "inputs": Dict[str, Any] with keys {"Points": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodePointsToVolume"], "inputs": Dict[str, Any] with keys {"Points": str, "Density": str, "Voxel Size": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodePoints"], "inputs": Dict[str, Any] with keys {"Count": str, "Position": str, "Radius": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeProximity"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeRaycast"], "inputs": Dict[str, Any] with keys {"Target Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeRealizeInstances"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Realize All": str, "Depth": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeRemoveAttribute"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Name": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeReplaceMaterial"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeResampleCurve"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeReverseCurve"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeRotateInstances"], "inputs": Dict[str, Any] with keys {"Instances": str, "Selection": str, "Rotation": str, "Pivot Point": str, "Local Space": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleCurve"], "inputs": Dict[str, Any] with keys {"Curves": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleGrid"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleGridIndex"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleIndex"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleNearestSurface"], "inputs": Dict[str, Any] with keys {"Mesh": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleNearest"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSampleUVSurface"], "inputs": Dict[str, Any] with keys {"Mesh": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeScaleElements"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Center": str, "Axis": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeScaleInstances"], "inputs": Dict[str, Any] with keys {"Instances": str, "Selection": str, "Scale": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSDFGridBoolean"], "inputs": Dict[str, Any] with keys {"Grid 1": str, "Grid 2": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSelfObject"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSeparateComponents"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSeparateGeometry"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetCurveHandlePositions"], "inputs": Dict[str, Any] with keys {"Curve": str, "Selection": str, "Position": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetCurveNormal"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetCurveRadius"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetCurveTilt"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetID"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "ID": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetMaterialIndex"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetMaterial"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetPointRadius"], "inputs": Dict[str, Any] with keys {"Points": str, "Selection": str, "Radius": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetPosition"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Position": str, "Offset": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetShadeSmooth"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Shade Smooth": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetSplineCyclic"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetSplineResolution"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSetInstanceTransform"], "inputs": Dict[str, Any] with keys {"Instances": str, "Selection": str, "Transform": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSortElements"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Group ID": str, "Sort Weight": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSplitEdges"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSplitToInstances"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeStoreNamedAttribute"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str, "Name": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeStoreNamedGrid"], "inputs": Dict[str, Any] with keys {"Volume": str, "Name": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeStringJoin"], "inputs": Dict[str, Any] with keys {"Delimiter": str, "Strings": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeStringToCurves"], "inputs": Dict[str, Any] with keys {"String": str, "Size": str, "Character Spacing": str, "Word Spacing": str, "Line Spacing": str, "Text Box Width": str, "Text Box Height": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSubdivideCurve"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSubdivideMesh"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Level": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSubdivisionSurface"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Level": str, "Edge Crease": str, "Vertex Crease": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeSwitch"], "inputs": Dict[str, Any] with keys {"Switch": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeTool3DCursor"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeToolFaceSet"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeToolMousePosition"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeToolSelection"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeToolActiveElement"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeToolSetFaceSet"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str, "Face Set": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeToolSetSelection"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Selection": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeViewportTransform"], "inputs": Dict[str, Any]}, Dict[str, Any] with keys {"type": Literal["GeometryNodeTransform"], "inputs": Dict[str, Any] with keys {"Geometry": str, "Translation": str, "Rotation": str, "Scale": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeTranslateInstances"], "inputs": Dict[str, Any] with keys {"Instances": str, "Selection": str, "Translation": str, "Local Space": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeTriangulate"], "inputs": Dict[str, Any] with keys {"Mesh": str, "Selection": str, "Minimum Vertices": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeTrimCurve"], "inputs": Dict[str, Any] with keys {"Curve": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeUVPackIslands"], "inputs": Dict[str, Any] with keys {"UV": str, "Selection": str, "Margin": str, "Rotate": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeUVUnwrap"], "inputs": Dict[str, Any] with keys {"Selection": str, "Seam": str, "Margin": str, "Fill Holes": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeViewer"], "inputs": Dict[str, Any] with keys {"Geometry": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeVolumeCube"], "inputs": Dict[str, Any] with keys {"Density": str, "Background": str, "Min": str, "Max": str, "Resolution X": str, "Resolution Y": str, "Resolution Z": str}}, Dict[str, Any] with keys {"type": Literal["GeometryNodeVolumeToMesh"], "inputs": Dict[str, Any] with keys {"Volume": str, "Voxel Size": str}}]): The nodes parameter

    Returns:
    success (bool): Operation success status
    nodeIds (List[str]): Created node identifiers
    """
    tool_name = "addNodeBatch"  # Define tool name for logging
    params = {"nodes": nodes}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        addNodeType(nodes.get('type'), nodes.get('inputs'))
        return {
            "success": True,  # TODO: Implement
            "nodeIds": None
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def addNodeMeshCube(Size: Optional[List[float]] = [1, 1, 1], Vertices_X: Optional[int] = 2, Vertices_Y: Optional[int] = 2, Vertices_Z: Optional[int] = 2) -> Dict[str, Any]:
    """
    Adds a new mesh cube node to the current edited geometry.

    Args:
    Size (List[float]): The Size parameter
    Vertices_X (int): The Vertices_X parameter
    Vertices_Y (int): The Vertices_Y parameter
    Vertices_Z (int): The Vertices_Z parameter

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeMeshCube"  # Define tool name for logging
    params = {"Size": Size, "Vertices_X": Vertices_X, "Vertices_Y": Vertices_Y,
              "Vertices_Z": Vertices_Z}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        node_result = addNodeType("GeometryNodeMeshCube", {
            "Size": Size,
            "Vertices_X": Vertices_X,
            "Vertices_Y": Vertices_Y,
            "Vertices_Z": Vertices_Z
        })

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def addNodeType(type: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:

    # Get the active object and its node tree
    obj = bpy.context.active_object
    if not obj or obj.type != 'MESH':
        raise ValueError(
            "Use startEditGeometry before using this function.")

    if not obj.modifiers:
        raise ValueError(
            "Invalid object. Use startEditGeometry before using this function")

    # Find the geometry nodes modifier
    geo_modifier = next(
        (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
    if not geo_modifier:
        raise ValueError(
            "Invalid object. Use startEditGeometry before using this function")

    # Get the node tree
    node_tree = geo_modifier.node_group
    if not node_tree:
        raise ValueError(
            "No node group found in the Geometry Nodes modifier.")
    # No parameters to validate
    new_node = node_tree.nodes.new(type=type)
    node_tree.nodes.update()
    if hasattr(bpy.ops.node, "na_batch_arrange"):
        # Ensure the Node Editor is active
        for area in bpy.context.screen.areas:
            if area.type == 'NODE_EDITOR':
                for region in area.regions:
                    if region.type == 'WINDOW':
                        with bpy.context.temp_override(area=area, region=region):
                            bpy.ops.node.na_batch_arrange()
    result = getNodeInputsOutputs(new_node.name)
    inputs, outputs = result["inputs"], result["outputs"]

    # Set properties
    if params is not None:
        for key, value in params.items():
            propName = key.replace("_", " ")
            input_socket = next(
                (inp for inp in new_node.inputs if inp.name == propName), None)
            if not input_socket:
                raise ValueError(
                    f"Input named '{property}' not found on node '{new_node.name}'.")
            try:
                if value is not None:
                    if isinstance(value, list):
                        value = tuple(value)
                    input_socket.default_value = value
            except Exception as e:
                raise ValueError(
                    f"Failed to set property '{property}' on node '{new_node.name}': {str(e)}")
    return {"nodeId": new_node.name, "inputs": inputs, "outputs": outputs, "node": new_node, "success": True}


def addNodeCombineXYZ() -> Dict[str, Any]:
    """
    Adds a new combine XYZ node to the current edited geometry.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeCombineXYZ"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        node_result = addNodeType("ShaderNodeCombineXYZ")
        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodeMath(operation: Literal['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES']) -> Dict[str, Any]:
    """
    Adds a new math node to the current edited geometry.

    Args:
    operation (Literal['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES']): Math operation

    Returns:
    Dict[str, bool]: Operation response with success status
    """
    tool_name = "addNodeMath"  # Define tool name for logging
    params = {"operation": operation}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        # Validate enum values for operation
        if operation is not None and operation not in ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES']:
            raise ValueError(
                f"Parameter 'operation' must be one of ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'MULTIPLY_ADD', 'POWER', 'LOGARITHM', 'SQRT', 'INVERSE_SQRT', 'ABSOLUTE', 'EXPONENT', 'MINIMUM', 'MAXIMUM', 'LESS_THAN', 'GREATER_THAN', 'SIGN', 'COMPARE', 'SMOOTH_MIN', 'SMOOTH_MAX', 'ROUND', 'FLOOR', 'CEIL', 'TRUNC', 'FRACT', 'MODULO', 'FLOORED_MODULO', 'WRAP', 'SNAP', 'PINGPONG', 'SINE', 'COSINE', 'TANGENT', 'ARCSINE', 'ARCCOSINE', 'ARCTANGENT', 'ARCTAN2', 'SINH', 'COSH', 'TANH', 'RADIANS', 'DEGREES'], got {operation}")

        node_result = addNodeType("ShaderNodeMath")
        node_result["node"].operation = operation

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodeMeshCone(Vertices: Optional[int] = None, Radius_Top: Optional[float] = None, Radius_Bottom: Optional[float] = None, Depth: Optional[float] = None, Side_Segments: Optional[int] = None, Fill_Segments: Optional[int] = None) -> Dict[str, Any]:
    """
    Adds a new mesh cone node to the current edited geometry.

    Args:
    Vertices (int): The Vertices parameter
    Radius_Top (float): The Radius_Top parameter
    Radius_Bottom (float): The Radius_Bottom parameter
    Depth (float): The Depth parameter
    Side_Segments (int): The Side_Segments parameter
    Fill_Segments (int): The Fill_Segments parameter

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeMeshCone"  # Define tool name for logging
    params = {"Vertices": Vertices, "Radius_Top": Radius_Top, "Radius_Bottom": Radius_Bottom, "Depth": Depth,
              # Create params dict for logging
              "Side_Segments": Side_Segments, "Fill_Segments": Fill_Segments}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        node_result = addNodeType("GeometryNodeMeshCone", {
                                  "Vertices": Vertices, "Radius_Top": Radius_Top, "Radius_Bottom": Radius_Bottom, "Depth": Depth, })

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodeMeshCylinder(Vertices: Optional[int] = None, Radius: Optional[float] = None, Depth: Optional[float] = None, Side_Segments: Optional[int] = None, Fill_Segments: Optional[int] = None) -> Dict[str, Any]:
    """
    Adds a new mesh cylinder node to the current edited geometry.

    Args:
    Vertices (int): The Vertices parameter
    Radius (float): The Radius parameter
    Depth (float): The Depth parameter
    Side_Segments (int): The Side_Segments parameter
    Fill_Segments (int): The Fill_Segments parameter

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeMeshCylinder"  # Define tool name for logging
    params = {"Vertices": Vertices, "Radius": Radius, "Depth": Depth, "Side_Segments": Side_Segments,
              "Fill_Segments": Fill_Segments}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        node_result = addNodeType("GeometryNodeMeshCylinder", {
                                  "Vertices": Vertices, "Radius": Radius, "Depth": Depth, "Side_Segments": Side_Segments, "Fill_Segments": Fill_Segments})

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodeMeshUVSphere(Radius: Optional[float] = None, Rings: Optional[int] = None, Segments: Optional[int] = None) -> Dict[str, Any]:
    """
    Adds a new mesh sphere node to the current edited geometry.

    Args:
    Radius (float): The Radius parameter
    Rings (int): The Rings parameter
    Segments (int): The Segments parameter

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeMeshUVSphere"  # Define tool name for logging
    # Create params dict for logging
    params = {"Radius": Radius, "Rings": Rings, "Segments": Segments}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        node_result = addNodeType("GeometryNodeMeshUVSphere", {
            "Radius": Radius, "Rings": Rings, "Segments": Segments})

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodePositionInput() -> Dict[str, Any]:
    """
    Adds a new position input node to the current edited geometry.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodePositionInput"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        node_result = addNodeType("GeometryNodeInputPosition")

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodeSeparateXYZ() -> Dict[str, Any]:
    """
    Adds a new separate XYZ node to the current edited geometry.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeSeparateXYZ"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        node_result = addNodeType("ShaderNodeSeparateXYZ")

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNodeSetPosition() -> Dict[str, Any]:
    """
    Adds a new set position node to the current edited geometry.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    nodeId (str): Created node identifier
    inputs (Dict[str, Any] with keys {"name": str, "type": str, "can_accept_default_value": bool}): Node inputs
    outputs (Dict[str, Any] with keys {"name": str, "type": str}): Node outputs
    """
    tool_name = "addNodeSetPosition"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        node_result = addNodeType("GeometryNodeSetPosition")

        return {
            "success": True,
            "nodeId": node_result["nodeId"],
            "inputs": node_result["inputs"],
            "outputs": node_result["outputs"]
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def setNodePropertyByIndex(nodeId: str, propertyIndex: int, value: Optional[Any] = None) -> Dict[str, Any]:
    """
    Sets a property of a node. For the available properties, use 'getNodeDefinition'.

    Args:
    nodeId (str): Node identifier
    propertyIndex (str): Property index
    value (Any): Property value

    Returns:
    success (bool): Operation success status
    """
    tool_name = "setNodePropertyByIndex"  # Define tool name for logging
    params = {"nodeId": nodeId, "property": propertyIndex,
              "value": value}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        from mathutils import Vector
        # Get the active object and its node tree
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError(
                "Use startEditGeometry before using this function.")

        # Find the geometry nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError(
                "Use startEditGeometry before using this function.")

        # Get the node tree
        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError(
                "Use startEditGeometry before using this function.")

        # Find the node by its ID
        node = node_tree.nodes.get(nodeId)
        if not node:
            raise ValueError(
                f"Node with ID '{nodeId}' not found in the node tree.")

        # Find the input named 'property' and set its default value
        # input_socket = next(
        #     (inp for inp in node.inputs if inp.name == property), None)
        input_socket = node.inputs[propertyIndex]
        if not input_socket:
            raise ValueError(
                f"Input'{propertyIndex}' not found on node '{nodeId}'.")

        # Set the default value of the input

        try:
            input_socket.default_value = eval(value)
        except Exception as e:
            raise ValueError(
                f"Failed to set property '{property}' on node '{nodeId}': {str(e)}")

        return {"success": True}
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def getNodeInputsOutputs(nodeId: str) -> Dict[str, Any]:
    """
    Retrieves all input and output socket names for a node, and checks if input sockets can accept a default_value.

    Args:
    nodeId (str): The node id to get information about, must exist in the node graph

    Returns:
    success (bool): Operation success status
    inputs (List[Dict[str, Any]]): List of input sockets with their names and default_value support
    outputs (List[str]): List of output socket names
    """
    tool_name = "getNodeSockets"  # Define tool name for logging
    params = {"nodeId": nodeId}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the active object and its node tree
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError(
                "Use startEditGeometry before using this function.")

        # Find the geometry nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError(
                "No Geometry Nodes modifier found on the active object.")

        # Get the node tree
        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError(
                "No node group found in the Geometry Nodes modifier.")

        # Find the node by its ID
        node = node_tree.nodes.get(nodeId)
        if not node:
            raise ValueError(
                f"Node with ID '{nodeId}' not found in the node tree.")

        # Retrieve input sockets
        inputs = []
        for input_socket in node.inputs:
            inputs.append({
                "name": input_socket.name,
                "type": input_socket.bl_label,
                "can_accept_default_value": hasattr(input_socket, "default_value")
            })

        # Retrieve output sockets
        outputs = []
        for output_socket in node.outputs:
            outputs.append({
                "name": output_socket.name,
                "type": output_socket.bl_label
            })

        return {
            "success": True,
            "inputs": inputs,
            "outputs": outputs,
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addNode(type: Literal["mesh_cube", "mesh_cylinder", "mesh_sphere", "output"]) -> Dict[str, Any]:
    """
    Adds a new node to the current edited geometry.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "addNode"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
     # Get the active object and its node tree
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError(
                "Use startEditGeometry before using this function.")

        if not obj.modifiers:
            raise ValueError(
                "Invalid object. Use startEditGeometry before using this function")

        # Find the geometry nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError(
                "Invalid object. Use startEditGeometry before using this function")

        # Get the node tree
        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError(
                "No node group found in the Geometry Nodes modifier.")

        new_node = node_tree.nodes.new(type=type)
        # If the node is a "NodeGroupOutput", create an input socket
        if type == "NodeGroupOutput":
            if "Mesh" not in new_node.inputs:
                node_tree.interface.new_socket(
                    name="Mesh", in_out='OUTPUT', socket_type='NodeSocketGeometry')

        node_tree.nodes.update()
        return {
            "success": True,
            "nodeId": new_node.name
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def connectNodes(fromNode: str, fromPort: str, toNode: str, toPort: str) -> Dict[str, Any]:
    """
    Connects two nodes in the current edited geometry.

    Args:
    from (str): Node identifier
    fromPort (str): Port name
    to (str): Node identifier
    toPort (str): Port name

    Returns:
    success (bool): Operation success status
    """
    tool_name = "connectNodes"  # Define tool name for logging
    params = {"from": fromNode, "fromPort": fromPort, "to": toNode,
              "toPort": toPort}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the active object and its node tree
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError(
                "Use startEditGeometry before using this function.")

        if not obj.modifiers:
            raise ValueError(
                "Invalid object. Use startEditGeometry before using this function")

        # Find the geometry nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError(
                "Invalid object. Use startEditGeometry before using this function")

        # Get the node tree
        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError(
                "Invalid object. Use startEditGeometry before using this function")

        # Find the source and target nodes
        source_node = node_tree.nodes.get(fromNode)
        target_node = node_tree.nodes.get(toNode)
        if not source_node:
            raise ValueError(f"Source node '{fromNode}' not found.")
        if not target_node:
            raise ValueError(f"Target node '{toNode}' not found.")

        # Find the output and input sockets
        source_socket = source_node.outputs.get(fromPort)
        target_socket = target_node.inputs.get(toPort) or target_node.inputs[0]
        if not source_socket:
            raise ValueError(
                f"Output port '{fromPort}' not found on node '{fromNode}'.")
        if not target_socket:
            raise ValueError(
                f"Input port '{toPort}' not found on node '{toNode}'.")

        # Create the link
        node_tree.links.new(source_socket, target_socket)

        if hasattr(bpy.ops.node, "na_batch_arrange"):
            # Ensure the Node Editor is active
            for area in bpy.context.screen.areas:
                if area.type == 'NODE_EDITOR':
                    for region in area.regions:
                        if region.type == 'WINDOW':
                            with bpy.context.temp_override(area=area, region=region):
                                bpy.ops.node.na_batch_arrange()

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def createGeometry(id: str) -> Dict[str, Any]:
    """
    Creates a new geometry object. Starting point for every geometry creation.

    Args:
    id (str): Object identifier. Must be unique.

    Returns:
    success (bool): Operation success status
    """
    tool_name = "createGeometry"  # Define tool name for logging
    params = {"id": id}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Check if a mesh with the given id already exists
        if id in bpy.data.meshes:
            raise ValueError(
                f"A geometry with the name '{id}' already exists.")

        # Create a new mesh object
        mesh = bpy.data.meshes.new(name=id)
        obj = bpy.data.objects.new(name=id, object_data=mesh)

        # Link the object to the current scene
        bpy.context.collection.objects.link(obj)

        # Set the object as active
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)

        # Add a Geometry Nodes modifier
        geo_modifier = obj.modifiers.new(name="GeometryNodes", type='NODES')

        # Create a new node group for the Geometry Nodes modifier
        node_group = bpy.data.node_groups.new(
            name=f"{id}_NodeGroup", type='GeometryNodeTree')
        geo_modifier.node_group = node_group

        new_node = node_group.nodes.new(type="NodeGroupOutput")
        # Create an input socket
        if "Mesh" not in new_node.inputs:
            node_group.interface.new_socket(
                name="Mesh", in_out='OUTPUT', socket_type='NodeSocketGeometry')

        return {
            "success": True,
        }
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def endEditGeometry() -> Dict[str, Any]:
    """
    Ends the current editing of the geometry of an object.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "endEditGeometry"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Deselect the active object and clear the active object
        bpy.ops.object.select_all(action='DESELECT')
        bpy.context.view_layer.objects.active = None

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


# def getNodeDefinition(nodeType: str) -> Dict[str, Any]:
#     """
#     Get detailed information about a specific node type including its inputs and outputs

#     Args:
#     nodeType (str): The node type to get information about

#     Returns:
#     success (bool): Operation success status
#     nodeDefinition (Dict[str, Any] with keys {"type": str, "description": str, "inputs": List[Dict[str, Any] with keys {"name": str, "type": Literal["int", "float", "vec2", "vec3", "vec4", "bool", "string", "geometry", "material"], "description": str}], "outputs": List[Dict[str, Any] with keys {"name": str, "type": Literal["int", "float", "vec2", "vec3", "vec4", "bool", "string", "geometry", "material"], "description": str}], "properties": Dict[str, Any]}): The nodeDefinition return value
#     """
#     tool_name = "getNodeDefinition"  # Define tool name for logging
#     params = {"nodeType": nodeType}  # Create params dict for logging
#     print(f"Executing {tool_name} in Blender with params: {params}")

# # Node catalog as a Python dictionary
#     NODE_CATALOG = {
#         "mesh_cube": {
#             "type": "mesh_cube",
#             "description": "Creates a cube mesh geometry",
#             "inputs": [],
#             "outputs": [
#                 {
#                     "name": "Mesh",
#                     "type": "geometry",
#                     "description": "The output cube geometry",
#                 },
#             ],
#             "properties": {
#                 "Size": {
#                     "type": "vec3",
#                     "default": "(1, 1, 1)",
#                     "description": "Width, height, depth of the cube, format (X, Y, Z)",
#                 },
#                 "Vertices X": {
#                     "type": "int",
#                     "default": "2",
#                     "description": "Number of vertices along X axis",
#                 },
#                 "Vertices Y": {
#                     "type": "int",
#                     "default": "2",
#                     "description": "Number of vertices along Y axis",
#                 },
#                 "Vertices Z": {
#                     "type": "int",
#                     "default": "2",
#                     "description": "Number of vertices along Z axis",
#                 },
#             },
#         },
#         "mesh_cylinder": {
#             "type": "mesh_cylinder",
#             "description": "Creates a cylinder mesh geometry",
#             "inputs": [],
#             "outputs": [
#                 {
#                     "name": "Mesh",
#                     "type": "geometry",
#                     "description": "The output cylinder geometry",
#                 },
#             ],
#             "properties": {
#                 "vertices": {
#                     "type": "int",
#                     "default": "32",
#                     "description": "Number of vertices around the circumference",
#                 },
#                 "radius": {
#                     "type": "float",
#                     "default": "1",
#                     "description": "Radius of the cylinder",
#                 },
#                 "depth": {
#                     "type": "float",
#                     "default": "2",
#                     "description": "Depth of the cylinder",
#                 },
#             },
#         },
#         "mesh_sphere": {
#             "type": "mesh_sphere",
#             "description": "Creates a sphere mesh geometry",
#             "inputs": [],
#             "outputs": [
#                 {
#                     "name": "Mesh",
#                     "type": "geometry",
#                     "description": "The output sphere geometry",
#                 },
#             ],
#             "properties": {
#                 "radius": {
#                     "type": "float",
#                     "default": "1",
#                     "description": "Radius of the sphere",
#                 },
#                 "rings": {
#                     "type": "int",
#                     "default": "16",
#                     "description": "Number of horizontal divisions",
#                 },
#                 "segments": {
#                     "type": "int",
#                     "default": "32",
#                     "description": "Number of vertical divisions",
#                 },
#             },
#         },
#         "output": {
#             "type": "output",
#             "description": "Final output node for the geometry",
#             "inputs": [
#                 {
#                     "name": "Mesh",
#                     "type": "geometry",
#                     "description": "Input geometry to output",
#                 },
#             ],
#             "outputs": [],
#             "properties": {},
#         },
#     }

#     try:
#         # Validate the nodeType
#         if nodeType not in NODE_CATALOG:
#             raise ValueError(f"Node type '{nodeType}' is not recognized.")

#         # Retrieve the node definition
#         node_definition = NODE_CATALOG[nodeType]

#         return {
#             "success": True,
#             "nodeDefinition": node_definition,
#         }

#     except Exception as e:
#         print(f"Error in {tool_name}: {str(e)}")
#         return {"success": False, "error": str(e)}


def getNodeTypes() -> Dict[str, Any]:
    """
    Returns all available node types that can be added to a geometry

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    nodeTypes (List[str]): The nodeTypes return value
    """
    tool_name = "getNodeTypes"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        return {
            "success": True,
            "nodeTypes": ['GeometryNodeMeshCube', 'GeometryNodeDistributePointsInVolume', 'GeometryNodeDistributePointsOnFaces', 'GeometryNodePoints', 'GeometryNodePointsToCurves', 'GeometryNodePointsToVertices', 'GeometryNodePointsToVolume', 'GeometryNodeSetPointRadius', 'GeometryNodeSetShadeSmooth', 'GeometryNodeSampleNearestSurface', 'GeometryNodeSampleUVSurface', 'GeometryNodeInputMeshEdgeAngle', 'GeometryNodeInputMeshEdgeNeighbors', 'GeometryNodeInputMeshEdgeVertices', 'GeometryNodeEdgesToFaceGroups', 'GeometryNodeInputMeshFaceArea', 'GeometryNodeMeshFaceSetBoundaries', 'GeometryNodeInputMeshFaceNeighbors', 'GeometryNodeInputMeshFaceIsPlanar', 'GeometryNodeInputShadeSmooth', 'GeometryNodeInputEdgeSmooth', 'GeometryNodeInputMeshIsland', 'GeometryNodeInputShortestEdgePaths', 'GeometryNodeInputMeshVertexNeighbors', 'GeometryNodeMeshCone', 'GeometryNodeMeshCylinder', 'GeometryNodeMeshGrid', 'GeometryNodeMeshIcoSphere', 'GeometryNodeMeshCircle', 'GeometryNodeMeshLine', 'GeometryNodeMeshUVSphere', 'GeometryNodeGeometryToInstance', 'GeometryNodeJoinGeometry', 'GeometryNodeSetGeometryName', 'GeometryNodeSetID', 'GeometryNodeSetPosition', 'GeometryNodeDualMesh', 'GeometryNodeEdgePathsToCurves', 'GeometryNodeEdgePathsToSelection', 'GeometryNodeExtrudeMesh', 'GeometryNodeFlipFaces', 'GeometryNodeMeshBoolean', 'GeometryNodeMeshToCurve', 'GeometryNodeMeshToPoints', 'GeometryNodeMeshToVolume', 'GeometryNodeScaleElements', 'GeometryNodeSplitEdges', 'GeometryNodeSubdivideMesh', 'GeometryNodeSubdivisionSurface', 'GeometryNodeTriangulate', 'GeometryNodeIndexSwitch', 'GeometryNodeMenuSwitch', 'GeometryNodeSwitch', 'GeometryNodeViewer', 'GeometryNodeWarning', 'GeometryNodeInstanceOnPoints', 'GeometryNodeInstancesToPoints', 'GeometryNodeRealizeInstances', 'GeometryNodeRotateInstances', 'GeometryNodeScaleInstances', 'GeometryNodeTranslateInstances', 'GeometryNodeSetInstanceTransform', 'GeometryNodeInstanceTransform', 'GeometryNodeInputInstanceRotation', 'GeometryNodeInputInstanceScale']
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def startEditGeometry(id: str) -> Dict[str, Any]:
    """
    Starts editing the geometry of an object.

    Args:
    id (str): Object identifier

    Returns:
    success (bool): Operation success status
    """
    tool_name = "startEditGeometry"  # Define tool name for logging
    params = {"id": id}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Check if the mesh with the given id exists
        obj = bpy.data.objects.get(id)
        if not obj:
            raise ValueError(f"Object with id '{id}' does not exist.")

        # Check if the object has a Geometry Nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError(
                f"Object '{id}' does not have a Geometry Nodes modifier. Make sure it was created with \"createGeometry\"")

        # Check if the object is already selected and active
        if bpy.context.view_layer.objects.active == obj and obj.select_get():
            return {"success": True}

        # Select and set the object as active
        bpy.ops.object.select_all(action='DESELECT')  # Deselect all objects
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj

        return {"success": True}
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===

 # Function template for adding a node
