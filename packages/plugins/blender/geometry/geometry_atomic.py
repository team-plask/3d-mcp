# Generated blender implementation for geometry atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal


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
