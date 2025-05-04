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
    # defnode_pattern = re.compile(
    #     r'DefNode\((\w+),\s*(\w+),\s*[^,]*,\s*"[^"]*",\s*(\w+),\s*[^,]*,\s*"([^"]*)"'
    # )
    defnode_pattern = re.compile(
        r'DefNode\((\w+),\s*(\w+),\s*[^,]*,\s*"[^"]*",\s*(\w+),\s*[^,]*,\s*"((?:[^"\\]|\\.)*)"\)'
    )
    nodes = []
    with open(filepath, 'r', encoding='utf-8') as file:
        for line in file:
            match = defnode_pattern.search(line)
            if match:
                category, enum_name, struct_name, description = match.groups()
                if category + struct_name in NODE_LIST:
                    nodes.append((category, enum_name, struct_name, description))
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


def extract_ui_item_r_calls(file_content):
    """
    Extract all uiItemR calls from the file content and capture the third parameter.
    """
    ui_item_r_pattern = re.compile(
        # Match uiItemR and capture the 3rd parameter
        r'\s*uiItemR\([^,]+,\s*[^,]+,\s*"([^"]+)"',
        re.DOTALL
    )
    ui_item_r_calls = []
    for match in ui_item_r_pattern.finditer(file_content):
        third_param = match.group(1)  # Capture the third parameter
        ui_item_r_calls.append(third_param)
    return ui_item_r_calls


def extract_add_input_output_calls(function_string):
    """
    Extract all add_input calls from a function string and generate a dictionary
    with the type of input, name of the input, optional alias, default_value, and description.
    """
    add_input_pattern = re.compile(
        r'\w+\.add_input<([^>]+)>\("([^"]+)"(?:,\s*"([^"]+)")?\)'  # Match the add_input call
        r'(?:\s*\.\w+\([^)]*\))*;',                               # Match all chained calls until the semicolon
        re.DOTALL
    )
    add_output_pattern = re.compile(
    r'\w+\.add_output<([^>]+)>\("([^"]+)"(?:,\s*"([^"]+)")?\)'  # Match the add_input call
    r'(?:\s*\.\w+\([^)]*\))*;',                               # Match all chained calls until the semicolon
    re.DOTALL
    )

    inputs = []
    for match in add_input_pattern.finditer(function_string):
        full_call = match.group(0)  # The entire add_input block
        input_type = match.group(1)  # Type (e.g., decl::Float)
        input_name = match.group(2)  # Name (e.g., "Fac")
        input_alias = match.group(3) or ""  # Optional alias

        # Extract all chained calls
        chained_calls = re.findall(r'\.(\w+)\(([^)]*)\)', full_call)

        # Filter for default_value and description
        default_value = None
        description = None
        for call, args in chained_calls:
            if call == "default_value":
                default_value = args
            elif call == "description":
                description = args.strip('"')  # Remove quotes from description

        # Append the result
        inputs.append({
            "type": input_type,
            "name": input_name,
            "alias": input_alias,
            "default_value": default_value or "",
            "description": description or ""
        })
        
    outputs = []
    for match in add_input_pattern.finditer(function_string):
        full_call = match.group(0)  # The entire add_input block
        input_type = match.group(1)  # Type (e.g., decl::Float)
        input_name = match.group(2)  # Name (e.g., "Fac")
        input_alias = match.group(3) or ""  # Optional alias

        # Extract all chained calls
        chained_calls = re.findall(r'\.(\w+)\(([^)]*)\)', full_call)

        # Filter for default_value and description
        default_value = None
        description = None
        for call, args in chained_calls:
            if call == "default_value":
                default_value = args
            elif call == "description":
                description = args.strip('"')  # Remove quotes from description

        # Append the result
        outputs.append({
            "type": input_type,
            "name": input_name,
            "alias": input_alias,
            "default_value": default_value or "",
            "description": description or ""
        })
    return inputs, outputs


def extract_node_declare(filepath):
    """Extract the node_declare function from a file."""
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        match = re.search(
            r'static void \w+_declare\(.*?\)\s*{.*?}', content, re.DOTALL)
        if match:
            return match.group(0)
    return None


def extract_all(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()

        return content


def write_to_file(content):
    # Write the result to a JSON file
    output_json_path = 'output.json'
    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump(content, json_file, indent=4, ensure_ascii=False)


def main():
    # Path to the NOD_static_types.h file.
    nod_static_types_path = r"/Users/ben/git/blender/source/blender/nodes/NOD_static_types.h"
    # Base path to search for .cc files.
    base_path = r"/Users/ben/git/blender/source/blender"

    # Step 1: Parse DefNode entries.
    nodes = parse_defnode_entries(nod_static_types_path)

    # Step 2: Find matching files and extract node_declare functions.
    result = {}
    for category, enum_name, struct_name, description in nodes:
        print(f"Processing Node: {category}, {enum_name}, {struct_name}")
        matching_files = find_files_with_enum(base_path, enum_name)
        for filepath in matching_files:
            print(f"  Found in file: {filepath}")
            node_declare_code = extract_node_declare(filepath)
            inputs, outputs = extract_add_input_output_calls(node_declare_code)
            potential_params = extract_ui_item_r_calls(extract_all(filepath))
            if node_declare_code:
                # print(f"  node_declare function:\n{node_declare_code}\n")
                result[enum_name] = {
                    "category": category,
                    "enum_name": enum_name,
                    "struct_name": struct_name,
                    "description": description,
                    "inputs": inputs,
                    "outputs": outputs,
                    "potential_params": potential_params,
                }
                print(f"Node name extracted: {enum_name}")
                print(f"Node description extracted: {description}")
                print(
                    f"  Inputs extracted: {inputs}, Outputs extracted: {outputs}")
                print("  Potential parameters extracted:")
                for param in potential_params:
                    print(f"    {param}")
    write_to_file(result)
    print(f"Results written to output.json")


if __name__ == "__main__":
    main()
