from typing import Dict, Any, Optional, List, Union, Tuple, Literal
import bpy
node_tools = {
    "ShaderNodeValue": {
        "callback": None,
    },
    "ShaderNodeValToRGB": {
        "callback": None,
    },
    "ShaderNodeVectorCurve": {
        "callback": None,
    },
    "ShaderNodeRGBCurve": {
        "callback": None,
    },
    "ShaderNodeMapRange": {
        "callback": None,
    },
    "ShaderNodeClamp": {
        "callback": None,
    },
    "ShaderNodeMath": {
        "callback": None,
    },
    "ShaderNodeVectorMath": {
        "callback": None,
    },
    "ShaderNodeBlackbody": {
        "callback": None,
    },
    "ShaderNodeTexGradient": {
        "callback": None,
    },
    "ShaderNodeTexNoise": {
        "callback": None,
    },
    "ShaderNodeTexMagic": {
        "callback": None,
    },
    "ShaderNodeTexWave": {
        "callback": None,
    },
    "ShaderNodeTexVoronoi": {
        "callback": None,
    },
    "ShaderNodeTexChecker": {
        "callback": None,
    },
    "ShaderNodeTexBrick": {
        "callback": None,
    },
    "ShaderNodeVectorRotate": {
        "callback": None,
    },
    "ShaderNodeSeparateXYZ": {
        "callback": None,
    },
    "ShaderNodeCombineXYZ": {
        "callback": None,
    },
    "ShaderNodeTexWhiteNoise": {
        "callback": None,
    },
    "ShaderNodeFloatCurve": {
        "callback": None,
    },
    "ShaderNodeMix": {
        "callback": None,
    },
    "FunctionNodeAlignEulerToVector": {
        "callback": None,
    },
    "FunctionNodeAlignRotationToVector": {
        "callback": None,
    },
    "FunctionNodeAxesToRotation": {
        "callback": None,
    },
    "FunctionNodeAxisAngleToRotation": {
        "callback": None,
    },
    "FunctionNodeBooleanMath": {
        "callback": None,
    },
    "FunctionNodeCombineColor": {
        "callback": None,
    },
    "FunctionNodeCombineMatrix": {
        "callback": None,
    },
    "FunctionNodeQuaternionToRotation": {
        "callback": None,
    },
    "FunctionNodeCombineTransform": {
        "callback": None,
    },
    "FunctionNodeCompare": {
        "callback": None,
    },
    "FunctionNodeEulerToRotation": {
        "callback": None,
    },
    "FunctionNodeFloatToInt": {
        "callback": None,
    },
    "FunctionNodeInputBool": {
        "callback": None,
    },
    "FunctionNodeInputColor": {
        "callback": None,
    },
    "FunctionNodeInputInt": {
        "callback": None,
    },
    "FunctionNodeInputRotation": {
        "callback": None,
    },
    "FunctionNodeInputSpecialCharacters": {
        "callback": None,
    },
    "FunctionNodeInputString": {
        "callback": None,
    },
    "FunctionNodeInputVector": {
        "callback": None,
    },
    "FunctionNodeInvertMatrix": {
        "callback": None,
    },
    "FunctionNodeInvertRotation": {
        "callback": None,
    },
    "FunctionNodeMatrixMultiply": {
        "callback": None,
    },
    "FunctionNodeProjectPoint": {
        "callback": None,
    },
    "FunctionNodeRandomValue": {
        "callback": None,
    },
    "FunctionNodeReplaceString": {
        "callback": None,
    },
    "FunctionNodeRotateEuler": {
        "callback": None,
    },
    "FunctionNodeRotateRotation": {
        "callback": None,
    },
    "FunctionNodeRotateVector": {
        "callback": None,
    },
    "FunctionNodeRotationToAxisAngle": {
        "callback": None,
    },
    "FunctionNodeRotationToEuler": {
        "callback": None,
    },
    "FunctionNodeSeparateColor": {
        "callback": None,
    },
    "FunctionNodeSeparateMatrix": {
        "callback": None,
    },
    "FunctionNodeRotationToQuaternion": {
        "callback": None,
    },
    "FunctionNodeSeparateTransform": {
        "callback": None,
    },
    "FunctionNodeSliceString": {
        "callback": None,
    },
    "FunctionNodeStringLength": {
        "callback": None,
    },
    "FunctionNodeTransformDirection": {
        "callback": None,
    },
    "FunctionNodeTransformPoint": {
        "callback": None,
    },
    "FunctionNodeTransposeMatrix": {
        "callback": None,
    },
    "FunctionNodeValueToString": {
        "callback": None,
    },
    "GeometryNodeAccumulateField": {
        "callback": None,
    },
    "GeometryNodeAttributeDomainSize": {
        "callback": None,
    },
    "GeometryNodeAttributeStatistic": {
        "callback": None,
    },
    "GeometryNodeBake": {
        "callback": None,
    },
    "GeometryNodeBlurAttribute": {
        "callback": None,
    },
    "GeometryNodeBoundBox": {
        "callback": None,
    },
    "GeometryNodeCaptureAttribute": {
        "callback": None,
    },
    "GeometryNodeCollectionInfo": {
        "callback": None,
    },
    "GeometryNodeConvexHull": {
        "callback": None,
    },
    "GeometryNodeCurveEndpointSelection": {
        "callback": None,
    },
    "GeometryNodeCurveHandleTypeSelection": {
        "callback": None,
    },
    "GeometryNodeCurveLength": {
        "callback": None,
    },
    "GeometryNodeCurveArc": {
        "callback": None,
    },
    "GeometryNodeCurvePrimitiveBezierSegment": {
        "callback": None,
    },
    "GeometryNodeCurvePrimitiveCircle": {
        "callback": None,
    },
    "GeometryNodeCurvePrimitiveLine": {
        "callback": None,
    },
    "GeometryNodeCurveQuadraticBezier": {
        "callback": None,
    },
    "GeometryNodeCurvePrimitiveQuadrilateral": {
        "callback": None,
    },
    "GeometryNodeCurveSpiral": {
        "callback": None,
    },
    "GeometryNodeCurveStar": {
        "callback": None,
    },
    "GeometryNodeCurveSetHandles": {
        "callback": None,
    },
    "GeometryNodeSplineParameter": {
        "callback": None,
    },
    "GeometryNodeCurveSplineType": {
        "callback": None,
    },
    "GeometryNodeCurveToMesh": {
        "callback": None,
    },
    "GeometryNodeCurveToPoints": {
        "callback": None,
    },
    "GeometryNodeCurveOfPoint": {
        "callback": None,
    },
    "GeometryNodePointsOfCurve": {
        "callback": None,
    },
    "GeometryNodeDeformCurvesOnSurface": {
        "callback": None,
    },
    "GeometryNodeDeleteGeometry": {
        "callback": None,
    },
    "GeometryNodeDistributePointsInGrid": {
        "callback": None,
    },
    "GeometryNodeDistributePointsInVolume": {
        "callback": None,
    },
    "GeometryNodeDistributePointsOnFaces": {
        "callback": None,
    },
    "GeometryNodeDualMesh": {
        "callback": None,
    },
    "GeometryNodeDuplicateElements": {
        "callback": None,
    },
    "GeometryNodeEdgePathsToCurves": {
        "callback": None,
    },
    "GeometryNodeEdgePathsToSelection": {
        "callback": None,
    },
    "GeometryNodeEdgesToFaceGroups": {
        "callback": None,
    },
    "GeometryNodeFieldAtIndex": {
        "callback": None,
    },
    "GeometryNodeFieldOnDomain": {
        "callback": None,
    },
    "GeometryNodeExtrudeMesh": {
        "callback": None,
    },
    "GeometryNodeFillCurve": {
        "callback": None,
    },
    "GeometryNodeFilletCurve": {
        "callback": None,
    },
    "GeometryNodeFlipFaces": {
        "callback": None,
    },
    "GeometryNodeGeometryToInstance": {
        "callback": None,
    },
    "GeometryNodeGetNamedGrid": {
        "callback": None,
    },
    "GeometryNodeGridToMesh": {
        "callback": None,
    },
    "GeometryNodeImageInfo": {
        "callback": None,
    },
    "GeometryNodeImageTexture": {
        "callback": None,
    },
    "GeometryNodeInputImage": {
        "callback": None,
    },
    "GeometryNodeImportSTL": {
        "callback": None,
    },
    "GeometryNodeIndexOfNearest": {
        "callback": None,
    },
    "GeometryNodeIndexSwitch": {
        "callback": None,
    },
    "GeometryNodeInputActiveCamera": {
        "callback": None,
    },
    "GeometryNodeInputCurveHandlePositions": {
        "callback": None,
    },
    "GeometryNodeInputCurveTilt": {
        "callback": None,
    },
    "GeometryNodeInputEdgeSmooth": {
        "callback": None,
    },
    "GeometryNodeInputShadeSmooth": {
        "callback": None,
    },
    "GeometryNodeInputID": {
        "callback": None,
    },
    "GeometryNodeInputIndex": {
        "callback": None,
    },
    "GeometryNodeInputInstanceRotation": {
        "callback": None,
    },
    "GeometryNodeInputInstanceScale": {
        "callback": None,
    },
    "GeometryNodeInputMaterialIndex": {
        "callback": None,
    },
    "GeometryNodeInstanceTransform": {
        "callback": None,
    },
    "GeometryNodeInputMaterial": {
        "callback": None,
    },
    "GeometryNodeInputMeshEdgeAngle": {
        "callback": None,
    },
    "GeometryNodeInputMeshEdgeNeighbors": {
        "callback": None,
    },
    "GeometryNodeInputMeshEdgeVertices": {
        "callback": None,
    },
    "GeometryNodeInputMeshFaceArea": {
        "callback": None,
    },
    "GeometryNodeInputMeshFaceIsPlanar": {
        "callback": None,
    },
    "GeometryNodeInputMeshFaceNeighbors": {
        "callback": None,
    },
    "GeometryNodeInputMeshIsland": {
        "callback": None,
    },
    "GeometryNodeInputMeshVertexNeighbors": {
        "callback": None,
    },
    "GeometryNodeInputNamedAttribute": {
        "callback": None,
    },
    "GeometryNodeInputNamedLayerSelection": {
        "callback": None,
    },
    "GeometryNodeInputNormal": {
        "callback": None,
    },
    "GeometryNodeInputPosition": {
        "callback": None,
    },
    "GeometryNodeInputRadius": {
        "callback": None,
    },
    "GeometryNodeInputSceneTime": {
        "callback": None,
    },
    "GeometryNodeInputShortestEdgePaths": {
        "callback": None,
    },
    "GeometryNodeInputSplineCyclic": {
        "callback": None,
    },
    "GeometryNodeSplineLength": {
        "callback": None,
    },
    "GeometryNodeInputSplineResolution": {
        "callback": None,
    },
    "GeometryNodeInputTangent": {
        "callback": None,
    },
    "GeometryNodeInstanceOnPoints": {
        "callback": None,
    },
    "GeometryNodeInstancesToPoints": {
        "callback": None,
    },
    "GeometryNodeInterpolateCurves": {
        "callback": None,
    },
    "GeometryNodeIsViewport": {
        "callback": None,
    },
    "GeometryNodeJoinGeometry": {
        "callback": None,
    },
    "GeometryNodeMaterialSelection": {
        "callback": None,
    },
    "GeometryNodeMenuSwitch": {
        "callback": None,
    },
    "GeometryNodeMergeByDistance": {
        "callback": None,
    },
    "GeometryNodeMeshBoolean": {
        "callback": None,
    },
    "GeometryNodeMeshFaceSetBoundaries": {
        "callback": None,
    },
    "GeometryNodeMeshCircle": {
        "callback": None,
    },
    "GeometryNodeMeshCone": {
        "callback": None,
    },
    "GeometryNodeMeshCube": {
        "callback": None,
    },
    "GeometryNodeMeshCylinder": {
        "callback": None,
    },
    "GeometryNodeMeshGrid": {
        "callback": None,
    },
    "GeometryNodeMeshIcoSphere": {
        "callback": None,
    },
    "GeometryNodeMeshLine": {
        "callback": None,
    },
    "GeometryNodeMeshUVSphere": {
        "callback": None,
    },
    "GeometryNodeMeshToCurve": {
        "callback": None,
    },
    "GeometryNodeMeshToDensityGrid": {
        "callback": None,
    },
    "GeometryNodeMeshToPoints": {
        "callback": None,
    },
    "GeometryNodeMeshToSDFGrid": {
        "callback": None,
    },
    "GeometryNodeMeshToVolume": {
        "callback": None,
    },
    "GeometryNodeCornersOfEdge": {
        "callback": None,
    },
    "GeometryNodeCornersOfFace": {
        "callback": None,
    },
    "GeometryNodeCornersOfVertex": {
        "callback": None,
    },
    "GeometryNodeEdgesOfCorner": {
        "callback": None,
    },
    "GeometryNodeEdgesOfVertex": {
        "callback": None,
    },
    "GeometryNodeFaceOfCorner": {
        "callback": None,
    },
    "GeometryNodeOffsetCornerInFace": {
        "callback": None,
    },
    "GeometryNodeVertexOfCorner": {
        "callback": None,
    },
    "GeometryNodeObjectInfo": {
        "callback": None,
    },
    "GeometryNodeOffsetPointInCurve": {
        "callback": None,
    },
    "GeometryNodePointsToCurves": {
        "callback": None,
    },
    "GeometryNodePointsToSDFGrid": {
        "callback": None,
    },
    "GeometryNodePointsToVertices": {
        "callback": None,
    },
    "GeometryNodePointsToVolume": {
        "callback": None,
    },
    "GeometryNodePoints": {
        "callback": None,
    },
    "GeometryNodeProximity": {
        "callback": None,
    },
    "GeometryNodeRaycast": {
        "callback": None,
    },
    "GeometryNodeRealizeInstances": {
        "callback": None,
    },
    "GeometryNodeRemoveAttribute": {
        "callback": None,
    },
    "GeometryNodeReplaceMaterial": {
        "callback": None,
    },
    "GeometryNodeResampleCurve": {
        "callback": None,
    },
    "GeometryNodeReverseCurve": {
        "callback": None,
    },
    "GeometryNodeRotateInstances": {
        "callback": None,
    },
    "GeometryNodeSampleCurve": {
        "callback": None,
    },
    "GeometryNodeSampleGrid": {
        "callback": None,
    },
    "GeometryNodeSampleGridIndex": {
        "callback": None,
    },
    "GeometryNodeSampleIndex": {
        "callback": None,
    },
    "GeometryNodeSampleNearestSurface": {
        "callback": None,
    },
    "GeometryNodeSampleNearest": {
        "callback": None,
    },
    "GeometryNodeSampleUVSurface": {
        "callback": None,
    },
    "GeometryNodeScaleElements": {
        "callback": None,
    },
    "GeometryNodeScaleInstances": {
        "callback": None,
    },
    "GeometryNodeSDFGridBoolean": {
        "callback": None,
    },
    "GeometryNodeSelfObject": {
        "callback": None,
    },
    "GeometryNodeSeparateComponents": {
        "callback": None,
    },
    "GeometryNodeSeparateGeometry": {
        "callback": None,
    },
    "GeometryNodeSetCurveHandlePositions": {
        "callback": None,
    },
    "GeometryNodeSetCurveNormal": {
        "callback": None,
    },
    "GeometryNodeSetCurveRadius": {
        "callback": None,
    },
    "GeometryNodeSetCurveTilt": {
        "callback": None,
    },
    "GeometryNodeSetID": {
        "callback": None,
    },
    "GeometryNodeSetMaterialIndex": {
        "callback": None,
    },
    "GeometryNodeSetMaterial": {
        "callback": None,
    },
    "GeometryNodeSetPointRadius": {
        "callback": None,
    },
    "GeometryNodeSetPosition": {
        "callback": None,
    },
    "GeometryNodeSetShadeSmooth": {
        "callback": None,
    },
    "GeometryNodeSetSplineCyclic": {
        "callback": None,
    },
    "GeometryNodeSetSplineResolution": {
        "callback": None,
    },
    "GeometryNodeSetInstanceTransform": {
        "callback": None,
    },
    "GeometryNodeSortElements": {
        "callback": None,
    },
    "GeometryNodeSplitEdges": {
        "callback": None,
    },
    "GeometryNodeSplitToInstances": {
        "callback": None,
    },
    "GeometryNodeStoreNamedAttribute": {
        "callback": None,
    },
    "GeometryNodeStoreNamedGrid": {
        "callback": None,
    },
    "GeometryNodeStringJoin": {
        "callback": None,
    },
    "GeometryNodeStringToCurves": {
        "callback": None,
    },
    "GeometryNodeSubdivideCurve": {
        "callback": None,
    },
    "GeometryNodeSubdivideMesh": {
        "callback": None,
    },
    "GeometryNodeSubdivisionSurface": {
        "callback": None,
    },
    "GeometryNodeSwitch": {
        "callback": None,
    },
    "GeometryNodeTool3DCursor": {
        "callback": None,
    },
    "GeometryNodeToolFaceSet": {
        "callback": None,
    },
    "GeometryNodeToolMousePosition": {
        "callback": None,
    },
    "GeometryNodeToolSelection": {
        "callback": None,
    },
    "GeometryNodeToolActiveElement": {
        "callback": None,
    },
    "GeometryNodeToolSetFaceSet": {
        "callback": None,
    },
    "GeometryNodeToolSetSelection": {
        "callback": None,
    },
    "GeometryNodeViewportTransform": {
        "callback": None,
    },
    "GeometryNodeTransform": {
        "callback": None,
    },
    "GeometryNodeTranslateInstances": {
        "callback": None,
    },
    "GeometryNodeTriangulate": {
        "callback": None,
    },
    "GeometryNodeTrimCurve": {
        "callback": None,
    },
    "GeometryNodeUVPackIslands": {
        "callback": None,
    },
    "GeometryNodeUVUnwrap": {
        "callback": None,
    },
    "GeometryNodeViewer": {
        "callback": None,
    },
    "GeometryNodeVolumeCube": {
        "callback": None,
    },
    "GeometryNodeVolumeToMesh": {
        "callback": None,
    },
}


def node_add(tool: str, **kwargs):
    """
    Adds a node of the specified type to the current geometry node tree.

    Args:
        type (str): The type of the node to add.
        **kwargs: Additional parameters for the node.

    Returns:
        None
    """
    print(f"Adding node of type: {type} with parameters: {kwargs}")
    try:
        result = addNodeType(type=tool[3:], params=kwargs)
        return {"success": True, "nodeId": result["nodeId"]}
    except Exception as e:
        return {"success": False, "error": str(e)}


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
    # result = getNodeInputsOutputs(new_node.name)
    # inputs, outputs = result["inputs"], result["outputs"]

    # Set properties
    if params is not None:
        for key, value in params.items():
            if value is None or value == []:
                continue
            propName = key.replace("\\_", "_").replace("__", " ")
            if isinstance(value, list):
                value = tuple(value)
            # Try first if the property is on the node
            if hasattr(new_node, propName):
                try:
                    setattr(new_node, propName, value)
                    if (propName == "name"):
                        new_node.label = value
                    continue
                except Exception as e:
                    pass
            # then try to set it on the inputs or outputs
            input_socket = next(
                (inp for inp in new_node.inputs if inp.identifier == propName), None)
            if input_socket:
                try:
                    input_socket.default_value = value
                    continue
                except Exception as e:
                    pass
            output_socket = next(
                (out for out in new_node.outputs if out.identifier == propName), None)
            if output_socket:
                # If the property is not found on the node, check the outputs
                # and set the default value if it exists
                try:
                    output_socket.default_value = value
                    continue
                except Exception as e:
                    pass
            raise ValueError(
                f"Input named '{property}' not found on node '{new_node.name}'.")
    return {"nodeId": new_node.name, "node": new_node, "success": True}
