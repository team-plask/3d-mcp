# Generated blender implementation for geometry atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal


def addNodeMeshCube(Size: Optional[List[float]] = None, Vertices_X: Optional[int] = None, Vertices_Y: Optional[int] = None, Vertices_Z: Optional[int] = None) -> Dict[str, Any]:
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


def addNodeMath(operation: Literal["Arctan2", "Multiply", "Add", "Sine"]) -> Dict[str, Any]:
    """
    Adds a new math node to the current edited geometry.

    Args:
    operation (Literal["Arctan2", "Multiply", "Add", "Sine"]): Math operation

    Returns:
    Dict[str, bool]: Operation response with success status
    """
    tool_name = "addNodeMath"  # Define tool name for logging
    params = {"operation": operation}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        # Validate enum values for operation
        if operation is not None and operation not in ['Arctan2', 'Multiply', 'Add', 'Sine']:
            raise ValueError(
                f"Parameter 'operation' must be one of ['Arctan2','Multiply','Add','Sine'], got {operation}")

        node_result = addNodeType("ShaderNodeMath")
        node_result["node"].operation = operation.upper()

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
