# Generated blender implementation for geometry atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal
from collections import deque # Import deque for BFS


def setNodeProperty(nodeId: str, property: str, value: Optional[Any] = None) -> Dict[str, Any]:
    """
    Sets a property of a node. For the available properties, use 'getNodeDefinition'.

    Args:
    nodeId (str): Node identifier
    property (str): Property name
    value (Any): Property value

    Returns:
    success (bool): Operation success status
    """
    tool_name = "setNodeProperty"  # Define tool name for logging
    params = {"nodeId": nodeId, "property": property,
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
        input_socket = next(
            (inp for inp in node.inputs if inp.name == property), None)
        if not input_socket:
            raise ValueError(
                f"Input named '{property}' not found on node '{nodeId}'.")

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

        # Add default Group Input and Group Output nodes
        input_node = node_group.nodes.new(type='NodeGroupInput')
        output_node = node_group.nodes.new(type='NodeGroupOutput')

        # Position nodes for clarity
        input_node.location = (-200, 0)
        output_node.location = (200, 0)

        # Add Geometry sockets directly to the node group inputs/outputs (pre-Blender 3.0 style)
        node_group.inputs.new('NodeSocketGeometry', 'Geometry')
        node_group.outputs.new('NodeSocketGeometry', 'Geometry')

        # Connect the default geometry sockets between Group Input and Group Output
        # Ensure sockets exist before linking
        if input_node.outputs and output_node.inputs:
            node_group.links.new(input_node.outputs[0], output_node.inputs[0])
        else:
            print("Warning: Could not find sockets to link in createGeometry")

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
            "nodeTypes": ['GeometryNodeAccumulateField', 'GeometryNodeAttributeDomainSize', 'GeometryNodeAttributeStatistic', 'GeometryNodeBake', 'GeometryNodeBlurAttribute', 'GeometryNodeBoundBox', 'GeometryNodeCaptureAttribute', 'GeometryNodeCollectionInfo', 'GeometryNodeConvexHull', 'GeometryNodeCornersOfEdge', 'GeometryNodeCornersOfFace', 'GeometryNodeCornersOfVertex', 'GeometryNodeCurveArc', 'GeometryNodeCurveEndpointSelection', 'GeometryNodeCurveHandleTypeSelection', 'GeometryNodeCurveLength', 'GeometryNodeCurveOfPoint', 'GeometryNodeCurvePrimitiveBezierSegment', 'GeometryNodeCurvePrimitiveCircle', 'GeometryNodeCurvePrimitiveLine', 'GeometryNodeCurvePrimitiveQuadrilateral', 'GeometryNodeCurveQuadraticBezier', 'GeometryNodeCurveSetHandles', 'GeometryNodeCurveSpiral', 'GeometryNodeCurveSplineType', 'GeometryNodeCurveStar', 'GeometryNodeCurveToMesh', 'GeometryNodeCurveToPoints', 'GeometryNodeCurvesToGreasePencil', 'GeometryNodeCustomGroup', 'GeometryNodeDeformCurvesOnSurface', 'GeometryNodeDeleteGeometry', 'GeometryNodeDistributePointsInGrid', 'GeometryNodeDistributePointsInVolume', 'GeometryNodeDistributePointsOnFaces', 'GeometryNodeDualMesh', 'GeometryNodeDuplicateElements', 'GeometryNodeEdgePathsToCurves', 'GeometryNodeEdgePathsToSelection', 'GeometryNodeEdgesOfCorner', 'GeometryNodeEdgesOfVertex', 'GeometryNodeEdgesToFaceGroups', 'GeometryNodeExtrudeMesh', 'GeometryNodeFaceOfCorner', 'GeometryNodeFieldAtIndex', 'GeometryNodeFieldOnDomain', 'GeometryNodeFillCurve', 'GeometryNodeFilletCurve', 'GeometryNodeFlipFaces', 'GeometryNodeForeachGeometryElementInput', 'GeometryNodeForeachGeometryElementOutput', 'GeometryNodeGeometryToInstance', 'GeometryNodeGetNamedGrid', 'GeometryNodeGizmoDial', 'GeometryNodeGizmoLinear', 'GeometryNodeGizmoTransform', 'GeometryNodeGreasePencilToCurves', 'GeometryNodeGridToMesh', 'GeometryNodeGroup', 'GeometryNodeImageInfo', 'GeometryNodeImageTexture', 'GeometryNodeImportOBJ', 'GeometryNodeImportPLY', 'GeometryNodeImportSTL', 'GeometryNodeIndexOfNearest', 'GeometryNodeIndexSwitch', 'GeometryNodeInputActiveCamera', 'GeometryNodeInputCollection', 'GeometryNodeInputCurveHandlePositions', 'GeometryNodeInputCurveTilt', 'GeometryNodeInputEdgeSmooth', 'GeometryNodeInputID', 'GeometryNodeInputImage', 'GeometryNodeInputIndex', 'GeometryNodeInputInstanceRotation', 'GeometryNodeInputInstanceScale', 'GeometryNodeInputMaterial', 'GeometryNodeInputMaterialIndex', 'GeometryNodeInputMeshEdgeAngle', 'GeometryNodeInputMeshEdgeNeighbors', 'GeometryNodeInputMeshEdgeVertices', 'GeometryNodeInputMeshFaceArea', 'GeometryNodeInputMeshFaceIsPlanar', 'GeometryNodeInputMeshFaceNeighbors', 'GeometryNodeInputMeshIsland', 'GeometryNodeInputMeshVertexNeighbors', 'GeometryNodeInputNamedAttribute', 'GeometryNodeInputNamedLayerSelection', 'GeometryNodeInputNormal', 'GeometryNodeInputObject', 'GeometryNodeInputPosition', 'GeometryNodeInputRadius', 'GeometryNodeInputSceneTime', 'GeometryNodeInputShadeSmooth', 'GeometryNodeInputShortestEdgePaths', 'GeometryNodeInputSplineCyclic', 'GeometryNodeInputSplineResolution', 'GeometryNodeInputTangent', 'GeometryNodeInstanceOnPoints', 'GeometryNodeInstanceTransform', 'GeometryNodeInstancesToPoints', 'GeometryNodeInterpolateCurves', 'GeometryNodeIsViewport', 'GeometryNodeJoinGeometry', 'GeometryNodeMaterialSelection', 'GeometryNodeMenuSwitch', 'GeometryNodeMergeByDistance', 'GeometryNodeMergeLayers', 'GeometryNodeMeshBoolean', 'GeometryNodeMeshCircle', 'GeometryNodeMeshCone', 'GeometryNodeMeshCube', 'GeometryNodeMeshCylinder', 'GeometryNodeMeshFaceSetBoundaries', 'GeometryNodeMeshGrid', 'GeometryNodeMeshIcoSphere', 'GeometryNodeMeshLine', 'GeometryNodeMeshToCurve', 'GeometryNodeMeshToDensityGrid', 'GeometryNodeMeshToPoints', 'GeometryNodeMeshToSDFGrid', 'GeometryNodeMeshToVolume', 'GeometryNodeMeshUVSphere', 'GeometryNodeObjectInfo', 'GeometryNodeOffsetCornerInFace', 'GeometryNodeOffsetPointInCurve', 'GeometryNodePoints', 'GeometryNodePointsOfCurve', 'GeometryNodePointsToCurves', 'GeometryNodePointsToSDFGrid', 'GeometryNodePointsToVertices', 'GeometryNodePointsToVolume', 'GeometryNodeProximity', 'GeometryNodeRaycast', 'GeometryNodeRealizeInstances', 'GeometryNodeRemoveAttribute', 'GeometryNodeRepeatInput', 'GeometryNodeRepeatOutput', 'GeometryNodeReplaceMaterial', 'GeometryNodeResampleCurve', 'GeometryNodeReverseCurve', 'GeometryNodeRotateInstances', 'GeometryNodeSDFGridBoolean', 'GeometryNodeSampleCurve', 'GeometryNodeSampleGrid', 'GeometryNodeSampleGridIndex', 'GeometryNodeSampleIndex', 'GeometryNodeSampleNearest', 'GeometryNodeSampleNearestSurface', 'GeometryNodeSampleUVSurface', 'GeometryNodeScaleElements', 'GeometryNodeScaleInstances', 'GeometryNodeSelfObject', 'GeometryNodeSeparateComponents', 'GeometryNodeSeparateGeometry', 'GeometryNodeSetCurveHandlePositions', 'GeometryNodeSetCurveNormal', 'GeometryNodeSetCurveRadius', 'GeometryNodeSetCurveTilt', 'GeometryNodeSetGeometryName', 'GeometryNodeSetID', 'GeometryNodeSetInstanceTransform', 'GeometryNodeSetMaterial', 'GeometryNodeSetMaterialIndex', 'GeometryNodeSetPointRadius', 'GeometryNodeSetPosition', 'GeometryNodeSetShadeSmooth', 'GeometryNodeSetSplineCyclic', 'GeometryNodeSetSplineResolution', 'GeometryNodeSimulationInput', 'GeometryNodeSimulationOutput', 'GeometryNodeSortElements', 'GeometryNodeSplineLength', 'GeometryNodeSplineParameter', 'GeometryNodeSplitEdges', 'GeometryNodeSplitToInstances', 'GeometryNodeStoreNamedAttribute', 'GeometryNodeStoreNamedGrid', 'GeometryNodeStringJoin', 'GeometryNodeStringToCurves', 'GeometryNodeSubdivideCurve', 'GeometryNodeSubdivideMesh', 'GeometryNodeSubdivisionSurface', 'GeometryNodeSwitch', 'GeometryNodeTool3DCursor', 'GeometryNodeToolActiveElement', 'GeometryNodeToolFaceSet', 'GeometryNodeToolMousePosition', 'GeometryNodeToolSelection', 'GeometryNodeToolSetFaceSet', 'GeometryNodeToolSetSelection', 'GeometryNodeTransform', 'GeometryNodeTranslateInstances', 'GeometryNodeTriangulate', 'GeometryNodeTrimCurve', 'GeometryNodeUVPackIslands', 'GeometryNodeUVUnwrap', 'GeometryNodeVertexOfCorner', 'GeometryNodeViewer', 'GeometryNodeViewportTransform', 'GeometryNodeVolumeCube', 'GeometryNodeVolumeToMesh', 'GeometryNodeWarning', 'CompositorNodeAlphaOver', 'CompositorNodeAntiAliasing', 'CompositorNodeBilateralblur', 'CompositorNodeBlur', 'CompositorNodeBokehBlur', 'CompositorNodeBokehImage', 'CompositorNodeBoxMask', 'CompositorNodeBrightContrast', 'CompositorNodeChannelMatte', 'CompositorNodeChromaMatte', 'CompositorNodeColorBalance', 'CompositorNodeColorCorrection', 'CompositorNodeColorMatte', 'CompositorNodeColorSpill', 'CompositorNodeCombHSVA', 'CompositorNodeCombRGBA', 'CompositorNodeCombYCCA', 'CompositorNodeCombYUVA', 'CompositorNodeCombineColor', 'CompositorNodeCombineXYZ', 'CompositorNodeComposite', 'CompositorNodeConvertColorSpace', 'CompositorNodeCornerPin', 'CompositorNodeCrop', 'CompositorNodeCryptomatte', 'CompositorNodeCryptomatteV2', 'CompositorNodeCurveRGB', 'CompositorNodeCurveVec', 'CompositorNodeCustomGroup', 'CompositorNodeDBlur', 'CompositorNodeDefocus', 'CompositorNodeDenoise', 'CompositorNodeDespeckle', 'CompositorNodeDiffMatte', 'CompositorNodeDilateErode', 'CompositorNodeDisplace', 'CompositorNodeDistanceMatte', 'CompositorNodeDoubleEdgeMask', 'CompositorNodeEllipseMask', 'CompositorNodeExposure', 'CompositorNodeFilter', 'CompositorNodeFlip', 'CompositorNodeGamma', 'CompositorNodeGlare', 'CompositorNodeGroup', 'CompositorNodeHueCorrect', 'CompositorNodeHueSat', 'CompositorNodeIDMask', 'CompositorNodeImage', 'CompositorNodeInpaint', 'CompositorNodeInvert', 'CompositorNodeKeying', 'CompositorNodeKeyingScreen', 'CompositorNodeKuwahara', 'CompositorNodeLensdist', 'CompositorNodeLevels', 'CompositorNodeLumaMatte', 'CompositorNodeMapRange', 'CompositorNodeMapUV', 'CompositorNodeMapValue', 'CompositorNodeMask', 'CompositorNodeMath', 'CompositorNodeMixRGB', 'CompositorNodeMovieClip', 'CompositorNodeMovieDistortion', 'CompositorNodeNormal', 'CompositorNodeNormalize', 'CompositorNodeOutputFile', 'CompositorNodePixelate', 'CompositorNodePlaneTrackDeform', 'CompositorNodePosterize', 'CompositorNodePremulKey', 'CompositorNodeRGB', 'CompositorNodeRGBToBW', 'CompositorNodeRLayers', 'CompositorNodeRotate', 'CompositorNodeScale', 'CompositorNodeSceneTime', 'CompositorNodeSepHSVA', 'CompositorNodeSepRGBA', 'CompositorNodeSepYCCA', 'CompositorNodeSepYUVA', 'CompositorNodeSeparateColor', 'CompositorNodeSeparateXYZ', 'CompositorNodeSetAlpha', 'CompositorNodeSplit', 'CompositorNodeStabilize', 'CompositorNodeSunBeams', 'CompositorNodeSwitch', 'CompositorNodeSwitchView', 'CompositorNodeTexture', 'CompositorNodeTime', 'CompositorNodeTonemap', 'CompositorNodeTrackPos', 'CompositorNodeTransform', 'CompositorNodeTranslate', 'CompositorNodeValToRGB', 'CompositorNodeValue', 'CompositorNodeVecBlur', 'CompositorNodeViewer', 'CompositorNodeZcombine', 'FunctionNodeAlignEulerToVector', 'FunctionNodeAlignRotationToVector', 'FunctionNodeAxesToRotation', 'FunctionNodeAxisAngleToRotation', 'FunctionNodeBooleanMath', 'FunctionNodeCombineColor', 'FunctionNodeCombineMatrix', 'FunctionNodeCombineTransform', 'FunctionNodeCompare', 'FunctionNodeEulerToRotation', 'FunctionNodeFindInString', 'FunctionNodeFloatToInt', 'FunctionNodeHashValue', 'FunctionNodeInputBool', 'FunctionNodeInputColor', 'FunctionNodeInputInt', 'FunctionNodeInputRotation', 'FunctionNodeInputSpecialCharacters', 'FunctionNodeInputString', 'FunctionNodeInputVector', 'FunctionNodeIntegerMath', 'FunctionNodeInvertMatrix', 'FunctionNodeInvertRotation', 'FunctionNodeMatrixDeterminant', 'FunctionNodeMatrixMultiply', 'FunctionNodeProjectPoint', 'FunctionNodeQuaternionToRotation', 'FunctionNodeRandomValue', 'FunctionNodeReplaceString', 'FunctionNodeRotateEuler', 'FunctionNodeRotateRotation', 'FunctionNodeRotateVector', 'FunctionNodeRotationToAxisAngle', 'FunctionNodeRotationToEuler', 'FunctionNodeRotationToQuaternion', 'FunctionNodeSeparateColor', 'FunctionNodeSeparateMatrix', 'FunctionNodeSeparateTransform', 'FunctionNodeSliceString', 'FunctionNodeStringLength', 'FunctionNodeTransformDirection', 'FunctionNodeTransformPoint', 'FunctionNodeTransposeMatrix', 'FunctionNodeValueToString',
'ShaderNodeAddShader', 'ShaderNodeAmbientOcclusion', 'ShaderNodeAttribute', 'ShaderNodeBackground', 'ShaderNodeBevel', 'ShaderNodeBlackbody', 'ShaderNodeBrightContrast', 'ShaderNodeBsdfAnisotropic', 'ShaderNodeBsdfDiffuse', 'ShaderNodeBsdfGlass', 'ShaderNodeBsdfHair', 'ShaderNodeBsdfHairPrincipled', 'ShaderNodeBsdfMetallic', 'ShaderNodeBsdfPrincipled', 'ShaderNodeBsdfRayPortal', 'ShaderNodeBsdfRefraction', 'ShaderNodeBsdfSheen', 'ShaderNodeBsdfToon', 'ShaderNodeBsdfTranslucent', 'ShaderNodeBsdfTransparent', 'ShaderNodeBump', 'ShaderNodeCameraData', 'ShaderNodeClamp', 'ShaderNodeCombineColor', 'ShaderNodeCombineHSV', 'ShaderNodeCombineRGB', 'ShaderNodeCombineXYZ', 'ShaderNodeCustomGroup', 'ShaderNodeDisplacement', 'ShaderNodeEeveeSpecular', 'ShaderNodeEmission', 'ShaderNodeFloatCurve', 'ShaderNodeFresnel', 'ShaderNodeGamma', 'ShaderNodeGroup', 'ShaderNodeHairInfo', 'ShaderNodeHoldout', 'ShaderNodeHueSaturation', 'ShaderNodeInvert', 'ShaderNodeLayerWeight', 'ShaderNodeLightFalloff', 'ShaderNodeLightPath', 'ShaderNodeMapRange', 'ShaderNodeMapping', 'ShaderNodeMath', 'ShaderNodeMix', 'ShaderNodeMixRGB', 'ShaderNodeMixShader', 'ShaderNodeNewGeometry', 'ShaderNodeNormal', 'ShaderNodeNormalMap', 'ShaderNodeObjectInfo', 'ShaderNodeOutputAOV', 'ShaderNodeOutputLight', 'ShaderNodeOutputLineStyle', 'ShaderNodeOutputMaterial', 'ShaderNodeOutputWorld', 'ShaderNodeParticleInfo', 'ShaderNodePointInfo', 'ShaderNodeRGB', 'ShaderNodeRGBCurve', 'ShaderNodeRGBToBW', 'ShaderNodeScript', 'ShaderNodeSeparateColor', 'ShaderNodeSeparateHSV', 'ShaderNodeSeparateRGB', 'ShaderNodeSeparateXYZ', 'ShaderNodeShaderToRGB', 'ShaderNodeSqueeze', 'ShaderNodeSubsurfaceScattering', 'ShaderNodeTangent', 'ShaderNodeTexBrick', 'ShaderNodeTexChecker', 'ShaderNodeTexCoord', 'ShaderNodeTexEnvironment', 'ShaderNodeTexGabor', 'ShaderNodeTexGradient', 'ShaderNodeTexIES', 'ShaderNodeTexImage', 'ShaderNodeTexMagic', 'ShaderNodeTexNoise', 'ShaderNodeTexPointDensity', 'ShaderNodeTexSky', 'ShaderNodeTexVoronoi', 'ShaderNodeTexWave', 'ShaderNodeTexWhiteNoise', 'ShaderNodeUVAlongStroke', 'ShaderNodeUVMap', 'ShaderNodeValToRGB', 'ShaderNodeValue', 'ShaderNodeVectorCurve', 'ShaderNodeVectorDisplacement', 'ShaderNodeVectorMath', 'ShaderNodeVectorRotate', 'ShaderNodeVectorTransform', 'ShaderNodeVertexColor', 'ShaderNodeVolumeAbsorption', 'ShaderNodeVolumeInfo', 'ShaderNodeVolumePrincipled', 'ShaderNodeVolumeScatter', 'ShaderNodeWavelength', 'ShaderNodeWireframe']
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getNodeGraph() -> Dict[str, Any]:
    """
    Retrieves the complete node graph of the geometry currently being edited.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    nodes (List[Dict]): All nodes in the graph with their properties
    connections (List[Dict]): All connections between nodes
    """
    tool_name = "getNodeGraph"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the active object and its node tree
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError("Use startEditGeometry before using this function.")

        # Find the geometry nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError("No Geometry Nodes modifier found on the active object.")

        # Get the node tree
        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError("No node group found in the Geometry Nodes modifier.")

        # Collect all nodes
        nodes = []
        for node in node_tree.nodes:
            # Get node properties
            node_properties = {}
            # Collect all input socket default values
            for input_socket in node.inputs:
                if hasattr(input_socket, "default_value"):
                    # Convert various types to appropriate string representation
                    if hasattr(input_socket.default_value, "__len__") and not isinstance(input_socket.default_value, str):
                        # Handle vector/color values
                        node_properties[input_socket.name] = list(input_socket.default_value)
                    else:
                        # Handle scalar values
                        node_properties[input_socket.name] = input_socket.default_value

            # Add node information
            nodes.append({
                "id": node.name,
                "type": node.bl_idname,
                "name": node.label or node.name,
                "position": [node.location.x, node.location.y],
                "properties": node_properties
            })

        # Collect all connections
        connections = []
        for link in node_tree.links:
            connections.append({
                "fromNode": link.from_node.name,
                "fromPort": link.from_socket.name,
                "toNode": link.to_node.name,
                "toPort": link.to_socket.name
            })

        return {
            "success": True,
            "nodes": nodes,
            "connections": connections
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


def deleteNode(nodeId: str) -> Dict[str, Any]:
    """
    Deletes a node from the current edited geometry.

    Args:
    nodeId (str): Identifier of the node to delete

    Returns:
    success (bool): Operation success status
    """
    tool_name = "deleteNode"  # Define tool name for logging
    params = {"nodeId": nodeId}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the active object and its node tree
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError("Use startEditGeometry before using this function.")

        # Find the geometry nodes modifier
        geo_modifier = next(
            (mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError("No Geometry Nodes modifier found on the active object.")

        # Get the node tree
        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError("No node group found in the Geometry Nodes modifier.")

        # Find the node by its ID
        node_to_delete = node_tree.nodes.get(nodeId)
        if not node_to_delete:
            # If node not found, maybe it was already deleted, consider it success?
            # Or raise ValueError(f"Node with ID '{nodeId}' not found in the node tree.")
            print(f"Warning: Node with ID '{nodeId}' not found. Assuming it was already deleted.")
            return {"success": True}

        # Remove the node
        node_tree.nodes.remove(node_to_delete)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def arrangeNodes() -> Dict[str, Any]:
    """
    Arranges nodes horizontally based on their connections, flowing from left (inputs) to right (outputs).

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "arrangeNodes"
    params = {}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        obj = bpy.context.active_object
        if not obj or obj.type != 'MESH':
            raise ValueError("Use startEditGeometry before using this function.")

        geo_modifier = next((mod for mod in obj.modifiers if mod.type == 'NODES'), None)
        if not geo_modifier:
            raise ValueError("No Geometry Nodes modifier found.")

        node_tree = geo_modifier.node_group
        if not node_tree:
            raise ValueError("No node group found.")

        # --- Connection-Based Layout Logic ---
        node_spacing_x = 300  # Horizontal spacing
        node_spacing_y = 150  # Vertical spacing

        # Build graph representation (successors) and find initial nodes
        successors = {node.name: [] for node in node_tree.nodes}
        predecessor_count = {node.name: 0 for node in node_tree.nodes}
        node_map = {node.name: node for node in node_tree.nodes}

        for link in node_tree.links:
            from_node_id = link.from_node.name
            to_node_id = link.to_node.name
            if from_node_id in successors:
                 # Avoid duplicates if multiple sockets connect same nodes
                if to_node_id not in successors[from_node_id]:
                    successors[from_node_id].append(to_node_id)
            if to_node_id in predecessor_count:
                predecessor_count[to_node_id] += 1

        # Start BFS from nodes with no predecessors (or GroupInput)
        queue = deque()
        node_levels = {} # Store the calculated level for each node
        initial_level_nodes = []

        input_node = next((n for n in node_tree.nodes if n.type == 'NodeGroupInput'), None)
        output_node = next((n for n in node_tree.nodes if n.type == 'NodeGroupOutput'), None)

        if input_node and predecessor_count.get(input_node.name, 0) == 0:
            queue.append((input_node.name, 0))
            node_levels[input_node.name] = 0
            initial_level_nodes.append(input_node.name)
        else:
             # Find other nodes with no inputs as starting points
            for node_id, count in predecessor_count.items():
                 # Exclude output node initially if it has no inputs directly shown
                 if count == 0 and (not output_node or node_id != output_node.name):
                    if node_id not in node_levels: # Ensure not already added (like input_node)
                         queue.append((node_id, 0))
                         node_levels[node_id] = 0
                         initial_level_nodes.append(node_id)


        processed_links = set() # To handle multi-input nodes correctly in BFS level assignment

        # BFS to determine node levels
        while queue:
            current_id, level = queue.popleft()

            for successor_id in successors.get(current_id, []):
                 # Decrement predecessor count conceptually for this path
                 # Check if all paths to the successor have been processed to determine its level
                 # This simple BFS assigns level based on the *first* path found.
                 # A true topological sort might place nodes further right if they have longer dependency chains.
                 # For layout, this simpler approach is often sufficient.

                 # Check if link already processed to avoid re-adding
                 link_key = (current_id, successor_id)
                 if link_key not in processed_links:
                    processed_links.add(link_key)
                    # If successor not leveled or can be placed at a deeper level
                    if successor_id not in node_levels or level + 1 > node_levels[successor_id]:
                         node_levels[successor_id] = level + 1
                         queue.append((successor_id, level + 1))
                    # Else: already visited via a shorter or equal path

        # Group nodes by level
        levels = {}
        max_level = 0
        processed_nodes = set()
        for node_id, level in node_levels.items():
            if level not in levels:
                levels[level] = []
            levels[level].append(node_id)
            max_level = max(max_level, level)
            processed_nodes.add(node_id)


        # Position nodes level by level
        current_x = 0
        node_positions = {}

        sorted_levels = sorted(levels.keys())
        for level in sorted_levels:
            nodes_in_level = sorted(levels[level]) # Sort within level for consistency
            num_nodes = len(nodes_in_level)
            level_height = (num_nodes - 1) * node_spacing_y
            start_y = -level_height / 2 # Center vertically

            max_width_in_level = 0
            for i, node_id in enumerate(nodes_in_level):
                node = node_map.get(node_id)
                if node:
                    pos_y = start_y + i * node_spacing_y
                    node.location = (current_x, pos_y)
                    node_positions[node_id] = (current_x, pos_y)
                    max_width_in_level = max(max_width_in_level, node.width)

            current_x += max_width_in_level + node_spacing_x # Move x based on widest node + spacing

        # Position the output node
        output_pos_x = current_x
        if output_node:
            # Try to vertically align with its main input if possible
            output_y = 0
            output_predecessors = [link.from_node.name for link in node_tree.links if link.to_node == output_node]
            if output_predecessors:
                avg_y = 0
                count = 0
                for pred_id in output_predecessors:
                    if pred_id in node_positions:
                         avg_y += node_positions[pred_id][1]
                         count += 1
                if count > 0:
                     output_y = avg_y / count

            output_node.location = (output_pos_x, output_y)
            processed_nodes.add(output_node.name)
            current_x += output_node.width + node_spacing_x # Update current_x after placing output

        # Position any remaining orphan nodes (not reached by BFS, not output)
        orphan_nodes = [nid for nid in node_map if nid not in processed_nodes]
        start_y = 0 # Place orphans to the right
        for i, node_id in enumerate(sorted(orphan_nodes)):
             node = node_map.get(node_id)
             if node:
                  node.location = (current_x, start_y - i * node_spacing_y)


        node_tree.nodes.update()

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}
