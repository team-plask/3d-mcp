import os
import re
import json
NODE_LIST = [
    "GeometryNodeAttributeStatistic",
    "GeometryNodeAttributeDomainSize",
    "GeometryNodeBlurAttribute",
    "GeometryNodeCaptureAttribute",
    "GeometryNodeRemoveAttribute",
    "GeometryNodeStoreNamedAttribute",
    "ShaderNodeBlackbody",
    "ShaderNodeValToRGB",
    "ShaderNodeRGBCurve",
    "FunctionNodeCombineColor",
    "ShaderNodeMix",
    "FunctionNodeSeparateColor",
    "GeometryNodeInputCurveHandlePositions",
    "GeometryNodeCurveLength",
    "GeometryNodeInputTangent",
    "GeometryNodeInputCurveTilt",
    "GeometryNodeCurveEndpointSelection",
    "GeometryNodeCurveHandleTypeSelection",
    "GeometryNodeInputSplineCyclic",
    "GeometryNodeSplineLength",
    "GeometryNodeSplineParameter",
    "GeometryNodeInputSplineResolution",
    "GeometryNodeSampleCurve",
    "GeometryNodeSetCurveNormal",
    "GeometryNodeSetCurveRadius",
    "GeometryNodeSetCurveTilt",
    "GeometryNodeSetCurveHandlePositions",
    "GeometryNodeCurveSetHandles",
    "GeometryNodeSetSplineCyclic",
    "GeometryNodeSetSplineResolution",
    "GeometryNodeCurveSplineType",
    "GeometryNodeCurveToMesh",
    "GeometryNodeCurveToPoints",
    "GeometryNodeDeformCurvesOnSurface",
    "GeometryNodeFillCurve",
    "GeometryNodeFilletCurve",
    "GeometryNodeInterpolateCurves",
    "GeometryNodeResampleCurve",
    "GeometryNodeReverseCurve",
    "GeometryNodeSubdivideCurve",
    "GeometryNodeTrimCurve",
    "GeometryNodeCurveArc",
    "GeometryNodeCurvePrimitiveBezierSegment",
    "GeometryNodeCurvePrimitiveCircle",
    "GeometryNodeCurvePrimitiveLine",
    "GeometryNodeCurveSpiral",
    "GeometryNodeCurveQuadraticBezier",
    "GeometryNodeCurvePrimitiveQuadrilateral",
    "GeometryNodeCurveStar",
    "GeometryNodeCurveOfPoint",
    "GeometryNodeOffsetPointInCurve",
    "GeometryNodePointsOfCurve",
    "GeometryNodeGeometryToInstance",
    "GeometryNodeJoinGeometry",
    "GeometryNodeInputID",
    "GeometryNodeInputIndex",
    "GeometryNodeInputNamedAttribute",
    "GeometryNodeInputNormal",
    "GeometryNodeInputPosition",
    "GeometryNodeInputRadius",
    "GeometryNodeToolSelection",
    "GeometryNodeToolActiveElement",
    "GeometryNodeSetID",
    "GeometryNodeSetPosition",
    "GeometryNodeToolSetSelection",
    "GeometryNodeBake",
    "GeometryNodeBoundBox",
    "GeometryNodeConvexHull",
    "GeometryNodeDeleteGeometry",
    "GeometryNodeDuplicateElements",
    "GeometryNodeMergeByDistance",
    "GeometryNodeSortElements",
    "GeometryNodeTransform",
    "GeometryNodeSeparateComponents",
    "GeometryNodeSeparateGeometry",
    "GeometryNodeSplitToInstances",
    "GeometryNodeProximity",
    "GeometryNodeIndexOfNearest",
    "GeometryNodeRaycast",
    "GeometryNodeSampleIndex",
    "GeometryNodeSampleNearest",
    "FunctionNodeInputBool",
    "FunctionNodeInputColor",
    "GeometryNodeInputImage",
    "FunctionNodeInputInt",
    "GeometryNodeInputMaterial",
    "FunctionNodeInputRotation",
    "FunctionNodeInputString",
    "ShaderNodeValue",
    "FunctionNodeInputVector",
    "NodeGroupInput",
    "GeometryNodeTool3DCursor",
    "GeometryNodeInputActiveCamera",
    "GeometryNodeCollectionInfo",
    "GeometryNodeImageInfo",
    "GeometryNodeIsViewport",
    "GeometryNodeInputNamedLayerSelection",
    "GeometryNodeToolMousePosition",
    "GeometryNodeObjectInfo",
    "GeometryNodeInputSceneTime",
    "GeometryNodeSelfObject",
    "GeometryNodeViewportTransform",
    "GeometryNodeInstanceOnPoints",
    "GeometryNodeInstancesToPoints",
    "GeometryNodeRealizeInstances",
    "GeometryNodeRotateInstances",
    "GeometryNodeScaleInstances",
    "GeometryNodeTranslateInstances",
    "GeometryNodeSetInstanceTransform",
    "GeometryNodeInstanceTransform",
    "GeometryNodeInputInstanceRotation",
    "GeometryNodeInputInstanceScale",
    "GeometryNodeReplaceMaterial",
    "GeometryNodeInputMaterialIndex",
    "GeometryNodeMaterialSelection",
    "GeometryNodeSetMaterial",
    "GeometryNodeSetMaterialIndex",
    "GeometryNodeInputMeshEdgeAngle",
    "GeometryNodeInputMeshEdgeNeighbors",
    "GeometryNodeInputMeshEdgeVertices",
    "GeometryNodeEdgesToFaceGroups",
    "GeometryNodeInputMeshFaceArea",
    "GeometryNodeMeshFaceSetBoundaries",
    "GeometryNodeInputMeshFaceNeighbors",
    "GeometryNodeToolFaceSet",
    "GeometryNodeInputMeshFaceIsPlanar",
    "GeometryNodeInputShadeSmooth",
    "GeometryNodeInputEdgeSmooth",
    "GeometryNodeInputMeshIsland",
    "GeometryNodeInputShortestEdgePaths",
    "GeometryNodeInputMeshVertexNeighbors",
    "GeometryNodeSampleNearestSurface",
    "GeometryNodeSampleUVSurface",
    "GeometryNodeToolSetFaceSet",
    "GeometryNodeSetShadeSmooth",
    "GeometryNodeDualMesh",
    "GeometryNodeEdgePathsToCurves",
    "GeometryNodeEdgePathsToSelection",
    "GeometryNodeExtrudeMesh",
    "GeometryNodeFlipFaces",
    "GeometryNodeMeshBoolean",
    "GeometryNodeMeshToCurve",
    "GeometryNodeMeshToDensityGrid",
    "GeometryNodeMeshToPoints",
    "GeometryNodeMeshToSDFGrid",
    "GeometryNodeMeshToVolume",
    "GeometryNodeScaleElements",
    "GeometryNodeSplitEdges",
    "GeometryNodeSubdivideMesh",
    "GeometryNodeSubdivisionSurface",
    "GeometryNodeTriangulate",
    "GeometryNodeMeshCone",
    "GeometryNodeMeshCube",
    "GeometryNodeMeshCylinder",
    "GeometryNodeMeshGrid",
    "GeometryNodeMeshIcoSphere",
    "GeometryNodeMeshCircle",
    "GeometryNodeMeshLine",
    "GeometryNodeMeshUVSphere",
    "GeometryNodeImportSTL",
    "GeometryNodeCornersOfEdge",
    "GeometryNodeCornersOfFace",
    "GeometryNodeCornersOfVertex",
    "GeometryNodeEdgesOfCorner",
    "GeometryNodeEdgesOfVertex",
    "GeometryNodeFaceOfCorner",
    "GeometryNodeOffsetCornerInFace",
    "GeometryNodeVertexOfCorner",
    "NodeGroupOutput",
    "GeometryNodeViewer",
    "GeometryNodeDistributePointsInVolume",
    "GeometryNodeDistributePointsInGrid",
    "GeometryNodeDistributePointsOnFaces",
    "GeometryNodePoints",
    "GeometryNodePointsToCurves",
    "GeometryNodePointsToSDFGrid",
    "GeometryNodePointsToVertices",
    "GeometryNodePointsToVolume",
    "GeometryNodeSetPointRadius",
    "GeometryNodeStringJoin",
    "FunctionNodeReplaceString",
    "FunctionNodeSliceString",
    "FunctionNodeStringLength",
    "GeometryNodeStringToCurves",
    "FunctionNodeValueToString",
    "FunctionNodeInputSpecialCharacters",
    "ShaderNodeTexBrick",
    "ShaderNodeTexChecker",
    "ShaderNodeTexGradient",
    "GeometryNodeImageTexture",
    "ShaderNodeTexMagic",
    "ShaderNodeTexNoise",
    "ShaderNodeTexVoronoi",
    "ShaderNodeTexWave",
    "ShaderNodeTexWhiteNoise",
    "GeometryNodeIndexSwitch",
    "GeometryNodeMenuSwitch",
    "FunctionNodeRandomValue",
    "GeometryNodeSwitch",
    "FunctionNodeAlignEulerToVector",
    "FunctionNodeRotateEuler",
    "GeometryNodeAccumulateField",
    "GeometryNodeFieldAtIndex",
    "GeometryNodeFieldOnDomain",
    "FunctionNodeAlignRotationToVector",
    "FunctionNodeAxesToRotation",
    "FunctionNodeAxisAngleToRotation",
    "FunctionNodeEulerToRotation",
    "FunctionNodeInvertRotation",
    "FunctionNodeRotateRotation",
    "FunctionNodeRotateVector",
    "FunctionNodeRotationToAxisAngle",
    "FunctionNodeRotationToEuler",
    "FunctionNodeRotationToQuaternion",
    "FunctionNodeQuaternionToRotation",
    "FunctionNodeCombineMatrix",
    "FunctionNodeCombineTransform",
    "FunctionNodeInvertMatrix",
    "FunctionNodeMatrixMultiply",
    "FunctionNodeProjectPoint",
    "FunctionNodeSeparateMatrix",
    "FunctionNodeSeparateTransform",
    "FunctionNodeTransformDirection",
    "FunctionNodeTransformPoint",
    "FunctionNodeTransposeMatrix",
    "FunctionNodeBooleanMath",
    "ShaderNodeClamp",
    "FunctionNodeCompare",
    "ShaderNodeFloatCurve",
    "FunctionNodeFloatToInt",
    "ShaderNodeMapRange",
    "ShaderNodeMath",
    "ShaderNodeMix",
    "GeometryNodeUVPackIslands",
    "GeometryNodeUVUnwrap",
    "ShaderNodeVectorCurve",
    "ShaderNodeVectorMath",
    "ShaderNodeVectorRotate",
    "ShaderNodeCombineXYZ",
    "ShaderNodeMix",
    "ShaderNodeSeparateXYZ",
    "GeometryNodeGetNamedGrid",
    "GeometryNodeStoreNamedGrid",
    "GeometryNodeSampleGrid",
    "GeometryNodeSampleGridIndex",
    "GeometryNodeVolumeToMesh",
    "GeometryNodeGridToMesh",
    "GeometryNodeSDFGridBoolean",
    "GeometryNodeVolumeCube",
]


def parse_defnode_entries(filepath):
    """Parse DefNode entries from the NOD_static_types.h file."""
    defnode_pattern = re.compile(
        r'DefNode\((\w+),\s*(\w+),\s*[^,]*,\s*"[^"]*",\s*(\w+),'
    )
    nodes = []
    with open(filepath, 'r', encoding='utf-8') as file:
        for line in file:
            match = defnode_pattern.search(line)
            if match:
                category, enum_name, struct_name = match.groups()
                if category + struct_name in NODE_LIST:
                    nodes.append((category, enum_name, struct_name))
    return nodes


def find_files_with_enum(base_path, enum_name):
    """Find files containing the specified enum in geo_node_type_base calls."""
    matching_files = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.endswith('.cc'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    if re.search(rf'(?:fn_node_type_base|geo_node_type_base|sh_fn_node_type_base)\([^,]*,\s*{enum_name}\s*,', f.read()):
                        matching_files.append(filepath)
    return matching_files


def extract_add_input_calls(function_string):
    """
    Extract all add_input calls from a function string and generate a dictionary
    with the type of input, name of the input, and optional description.
    """
    add_input_pattern = re.compile(
        r'\w+\.add_input<([^>]+)>\("([^"]+)"\)(?:.*?\.description\("([^"]+)"\))?'
    )
    inputs = []
    for match in add_input_pattern.finditer(function_string):
        input_type, input_name, description = match.groups()
        inputs.append({
            "type": input_type,
            "name": input_name,
            "description": description or ""
        })
    return inputs


def extract_node_declare(filepath):
    """Extract the node_declare function from a file."""
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        match = re.search(
            r'static void \w+_declare\(.*?\)\s*{.*?}', content, re.DOTALL)
        if match:
            return match.group(0)
    return None


def write_to_file(content):
    # Write the result to a JSON file
    output_json_path = 'output.json'
    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump(content, json_file, indent=4, ensure_ascii=False)


def main():
    # Path to the NOD_static_types.h file.
    nod_static_types_path = r"e:\blender-source\source\blender\nodes\NOD_static_types.h"
    # Base path to search for .cc files.
    base_path = r"e:\blender-source"

    # Step 1: Parse DefNode entries.
    nodes = parse_defnode_entries(nod_static_types_path)

    # Step 2: Find matching files and extract node_declare functions.
    result = {}
    for category, enum_name, struct_name in nodes:
        print(f"Processing Node: {category}, {enum_name}, {struct_name}")
        matching_files = find_files_with_enum(base_path, enum_name)
        for filepath in matching_files:
            print(f"  Found in file: {filepath}")
            node_declare_code = extract_node_declare(filepath)
            inputs = extract_add_input_calls(node_declare_code)
            if node_declare_code:
                print(f"  node_declare function:\n{node_declare_code}\n")
                result[enum_name] = {
                    "category": category,
                    "enum_name": enum_name,
                    "struct_name": struct_name,
                    "inputs": inputs,
                }
    write_to_file(result)
    print(f"Results written to output.json")


if __name__ == "__main__":
    main()
