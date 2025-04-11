# Generated blender implementation for model atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal


def setGeometry(geometryData: Dict[str, Any]) -> Dict[str, Any]:
    """
    Set geometry data for the current edited mesh

    Args:
    geometryData (Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str], "vertices": List[List[float]], "edges": List[List[int]], "faces": List[int]}): Geometry data

    Returns:
    success (bool): Operation success status
    """
    tool_name = "setGeometry"  # Define tool name for logging
    params = {"geometryData": geometryData}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        import bmesh

        # Get the active object
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        # Ensure we are in edit mode
        if bpy.context.object.mode != 'EDIT':
            bpy.ops.object.mode_set(mode='EDIT')

        # Access the mesh data in edit mode
        bm = bmesh.from_edit_mesh(obj.data)

        # Clear existing geometry
        bm.clear()

        # Add vertices
        vertex_map = []
        for vertex in geometryData["vertices"]:
            vertex_map.append(bm.verts.new(vertex))

        bm.verts.ensure_lookup_table()

        # Add edges
        for edge in geometryData["edges"]:
            bm.edges.new((vertex_map[edge[0]], vertex_map[edge[1]]))

        # Add faces
        for face in geometryData["faces"]:
            bm.faces.new([vertex_map[idx] for idx in face])

        # Update the mesh to reflect changes
        bmesh.update_edit_mesh(obj.data)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def createLight(type: Literal["point", "sun", "spot", "area"], color: Optional[List[float]] = None, intensity: Optional[float] = None, position: List[float] = [0, 0, 0], direction: List[float] = [1, 0, 0], width: float = 1, height: float = 1) -> Dict[str, Any]:
    """
    Create a light source (object) in the scene

    Args:
    type (Literal["point", "directional", "spot"]): Light type
    color (List[float]): Light color (RGB)
    intensity (float): Light intensity
    position (List[float]): Light position
    direction (List[float]): Light direction

    Returns:
    success (bool): Operation success status
    """
    tool_name = "createLight"  # Define tool name for logging
    params = {"type": type, "color": color, "intensity": intensity,
              "position": position, "direction": direction}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Validate enum values for type
        if type not in ['point', 'sun', 'spot', 'area']:
            raise ValueError(
                f"Parameter 'type' must be one of  ['point', 'sun', 'spot', 'area'], got {type}")

        # Create the light object
        light_data = bpy.data.lights.new(
            name=f"{type}_light", type=type.upper())
        light_object = bpy.data.objects.new(
            name=f"{type}_light_object", object_data=light_data)

        # Set light properties
        if color:
            light_data.color = color
        if intensity:
            light_data.energy = intensity

        # Set light position
        light_object.location = position

        # Add the light to the scene
        bpy.context.collection.objects.link(light_object)

        # Set light direction for directional and spot lights
        if type in ["sun", "spot"]:
            light_object.rotation_euler = bpy.mathutils.Vector(
                direction).to_track_quat('Z', 'Y').to_euler()

        if type == "area":
            light_data.shape = 'RECTANGLE'
            light_data.size = width
            light_data.size_y = height

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def deleteObject(id: str) -> Dict[str, Any]:
    """
    Delete an object from the scene

    Args:
    meshId (str): ID of the deleteObject to delete

    Returns:
    success (bool): Operation success status
    """
    tool_name = "deleteObject"  # Define tool name for logging
    params = {"id": id}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the object by its name (meshId)
        obj = bpy.data.objects.get(id)
        if obj is None:
            raise ValueError(f"Object with ID '{id}' not found.")

        # Select the object to delete
        bpy.ops.object.select_all(action='DESELECT')  # Deselect all objects
        obj.select_set(True)  # Select the target object
        bpy.context.view_layer.objects.active = obj  # Set it as the active object

        # Use the delete operator
        bpy.ops.object.delete()

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def unwrapUVs(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate UV coordinates using automatic unwrapping

    Args:
    items (List[Dict[str, Any] with keys {"meshId": str, "method": Literal["angle", "conformal", "lscm", "abf", "sphere", "box", "cylinder"], "channel": int, "packIslands": bool, "normalizeUVs": bool, "margin": float}]): UV unwrapping operations

    Returns:
    success (bool): Operation success status
    results (List[Dict[str, Any] with keys {"meshId": str, "uvMapId": str}]): Unwrapping results
    """
    tool_name = "unwrapUVs"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # TODO: Implement actual blender API calls
        # This is a placeholder implementation

        return {
            "success": True,  # TODO: Implement
            "results": None
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def setMaterialParameters(materialId: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
    """
    Set all parameters of a BSDF material

    Args:
    materialId (str): Material identifier
    parameters (Dict[str, Any] with keys {"baseColor": List[float], "metallic": float, "roughness": float, "transmission": float, "transmissionRoughness": float, "emission": List[float], "alpha": float}): Parameters to tweak

    Returns:
    success (bool): Operation success status
    """
    tool_name = "setMaterialParameters"  # Define tool name for logging
    # Create params dict for logging
    params = {"materialId": materialId, "parameters": parameters}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the material by its name
        material = bpy.data.materials.get(materialId)
        if not material:
            raise ValueError(f"Material '{materialId}' not found.")

        # Ensure the material uses nodes
        if not material.use_nodes:
            raise RuntimeError(f"Material '{materialId}' does not use nodes.")

        # Find the Principled BSDF node
        principled_node = None
        for node in material.node_tree.nodes:
            if node.type == 'BSDF_PRINCIPLED':
                principled_node = node
                break

        if not principled_node:
            raise RuntimeError(
                f"Principled BSDF node not found in material '{materialId}'.")

        # Apply the parameters to the Principled BSDF node
        map_names = {
            "baseColor": "Base Color",
            "metallic": "Metallic",
            "roughness": "Roughness",
            "alpha": "Alpha",
            "emission": "Emission Color",

        }
        for key, value in parameters.items():
            named_key = map_names.get(key, key)
            if named_key in principled_node.inputs:
                input_socket = principled_node.inputs[named_key]
                if isinstance(value, list) and len(value) == 3:  # For RGB values
                    input_socket.default_value[:3] = value
                else:
                    input_socket.default_value = value
            else:
                print(
                    f"Warning: Parameter '{key}' is not valid for Principled BSDF.")

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def extrudeAlongNormals(distance: float) -> Dict[str, Any]:
    """
    Extrude selected faces along their normals

    Args:
    distance (float): Extrusion distance

    Returns:
    success (bool): Operation success status
    """
    tool_name = "extrudeAlongNormals"  # Define tool name for logging
    params = {"distance": distance}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Ensure we are in edit mode
        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError("You must be in edit mode to extrude geometry.")

        bpy.ops.ed.undo_push(message="Extrude Along Normals Operation")

        # Perform the extrusion
        bpy.ops.mesh.extrude_region_shrink_fatten(
            TRANSFORM_OT_shrink_fatten={"value": distance})

        return {
            "success": True
        }
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def bevel(amount: float, type: Literal["edge", "vertex"]) -> Dict[str, Any]:
    """
    Bevel selected edges or vertices

    Args:
    amount (float): Bevel amount

    Returns:
    success (bool): Operation success status
    """
    tool_name = "bevel"  # Define tool name for logging
    params = {"amount": amount, "type": type}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Validate enum values for type
        if type is not None and type not in ['edge', 'vertex']:
            raise ValueError(
                f"Parameter 'type' must be one of ['edge','vertex'], got {type}")

        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to perform a bevel operation.")

        type_map = {
            "vertex": "VERTICES",
            "edge": "EDGES",
        }

        bpy.ops.ed.undo_push(message="Bevel Operation")

        bpy.ops.mesh.bevel(
            offset=amount,
            affect=type_map[type],
            release_confirm=True
        )

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def createMeshFromPrimitive(type: Literal["sphere", "cube", "cylinder", "plane"]) -> Dict[str, Any]:
    """
    Add primitive shapes to the scene

    Args:
    type (Literal["sphere", "cube", "cylinder", "plane"]): Type of primitive to add

    Returns:
    success (bool): Operation success status
    """
    tool_name = "createMeshFromPrimitive"  # Define tool name for logging
    params = {"type": type}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        # Validate enum values for type
        if type is not None and type not in ['sphere', 'cube', 'cylinder', 'plane']:
            raise ValueError(
                f"Parameter 'type' must be one of ['sphere','cube','cylinder','plane'], got {type}")

        # Add the specified primitive to the scene
        if type == "sphere":
            bpy.ops.mesh.primitive_uv_sphere_add()
        elif type == "cube":
            bpy.ops.mesh.primitive_cube_add()
        elif type == "cylinder":
            bpy.ops.mesh.primitive_cylinder_add()
        elif type == "plane":
            bpy.ops.mesh.primitive_plane_add()

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def addSubsurfModifierLevel(level: int) -> Dict[str, Any]:
    """
    Add a subsurface modifier to a mesh and set its level

    Args:
    level (int): Subdivision level

    Returns:
    success (bool): Operation success status
    """
    tool_name = "addSubsurfModifierLevel"  # Define tool name for logging
    # Create params dict for logging
    params = {"level": level}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the object by its name (meshId)
        obj = bpy.context.object
        if obj is None:
            raise RuntimeError(f"No selected object.")

        # Ensure the object is a mesh
        if obj.type != 'MESH':
            raise RuntimeError(f"Selected object is not a mesh.")

        # Add a subsurface modifier if it doesn't already exist
        modifier = obj.modifiers.get("Subsurf")
        if modifier is None:
            modifier = obj.modifiers.new(name="Subsurf", type='SUBSURF')

        # Set the subdivision level
        modifier.levels = level
        modifier.render_levels = level

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def bridgeEdgeLoops() -> Dict[str, Any]:
    """
    Bridge two selected edge loops to create faces

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "bridgeEdgeLoops"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        import bmesh
        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to bridge edge loops.")

        # Access the mesh data in edit mode
        bm = bmesh.from_edit_mesh(obj.data)

        # Get selected edges
        selected_edges = [edge for edge in bm.edges if edge.select]
        if len(selected_edges) < 2:
            raise RuntimeError(
                "At least two edge loops must be selected to bridge.")

        # Perform the bridge edge loops operation
        bpy.ops.ed.undo_push(message="Bridge Edge Loops Operation")
        bpy.ops.mesh.bridge_edge_loops()

        # Update the mesh to reflect changes
        bmesh.update_edit_mesh(obj.data)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def createEdge() -> Dict[str, Any]:
    """
    Create an edge between two selected vertices

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "createEdge"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # TODO: Implement actual blender API calls
        # This is a placeholder implementation

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def createEdgeLoop(edgeId: str) -> Dict[str, Any]:
    """
    Create an edge loop on a mesh

    Args:
    edgeId (str): ID of the edge to create a loop from

    Returns:
    success (bool): Operation success status
    """
    tool_name = "createEdgeLoop"  # Define tool name for logging
    params = {"edgeId": edgeId}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        import bmesh

        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to create an edge loop.")

        # Access the mesh data in edit mode
        bm = bmesh.from_edit_mesh(obj.data)

        # Find the edge by its index
        edge_index = int(edgeId)
        if edge_index < 0 or edge_index >= len(bm.edges):
            raise ValueError(f"Invalid edge ID: {edgeId}")

        # Deselect all edges and select the target edge
        for edge in bm.edges:
            edge.select_set(False)
        bm.edges[edge_index].select_set(True)

        # Update the mesh to reflect the selection
        bmesh.update_edit_mesh(obj.data)

        # Override the context for the operator
        override_context = bpy.context.copy()
        for area in bpy.context.screen.areas:
            if area.type == 'VIEW_3D':
                override_context['area'] = area
                for region in area.regions:
                    if region.type == 'WINDOW':
                        override_context['region'] = region
                        break
                break
        bpy.ops.ed.undo_push(message="Create edge loop Operation")

        with bpy.context.temp_override(**override_context):
            bpy.ops.mesh.loopcut_slide(MESH_OT_loopcut={"number_cuts": 1,
                                                        "smoothness": 0, "falloff": 'INVERSE_SQUARE',
                                                        "object_index": 0, "edge_index": edge_index},)
            # # Update the mesh to reflect changes
            # bmesh.update_edit_mesh(obj.data)
        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def createFaceOrEdge() -> Dict[str, Any]:
    """
    Create a face from selected vertices or edges

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "createFace"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to create a face or edge.")

        # Use Blender's operator to create a face or edge
        bpy.ops.ed.undo_push(message="Create Face or Edge Operation")
        bpy.ops.mesh.edge_face_add()

        return {"success": True}
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def edgeSlide(factor: float) -> Dict[str, Any]:
    """
    Slide selected edges along their adjacent edges

    Args:
    factor (float): Sliding factor (-1 to 1)

    Returns:
    success (bool): Operation success status
    """
    tool_name = "edgeSlide"  # Define tool name for logging
    # Create params dict for logging
    params = {"factor": factor}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        import bmesh

        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to perform an edge slide operation.")

        # Perform the edge slide operation
        bpy.ops.ed.undo_push(message="Edge Slide Operation")
        override_context = bpy.context.copy()
        for area in bpy.context.screen.areas:
            if area.type == 'VIEW_3D':
                override_context['area'] = area
                for region in area.regions:
                    if region.type == 'WINDOW':
                        override_context['region'] = region
                        break
                break
        with bpy.context.temp_override(**override_context):
            bpy.ops.transform.edge_slide(value=factor)

        # Update the mesh to reflect changes
        bmesh.update_edit_mesh(obj.data)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def selectEdgeLoop(edgeId: str) -> Dict[str, Any]:
    """
    Select an edge loop

    Args:
    edgeId (str): ID of an edge in the loop

    Returns:
    success (bool): Operation success status
    """
    tool_name = "selectEdgeLoop"  # Define tool name for logging
    params = {"edgeId": edgeId}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        import bmesh

        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to select an edge loop.")

        # Access the mesh data in edit mode
        bm = bmesh.from_edit_mesh(obj.data)

        # Find the edge by its index
        edge_index = int(edgeId)
        if edge_index < 0 or edge_index >= len(bm.edges):
            raise ValueError(f"Invalid edge ID: {edgeId}")

        # Deselect all edges and select the target edge
        for edge in bm.edges:
            edge.select_set(False)
        bm.edges[edge_index].select_set(True)

        # Use Blender's operator to select the edge loop
        bpy.ops.ed.undo_push(message="Select Edge Loop Operation")
        override_context = bpy.context.copy()
        for area in bpy.context.screen.areas:
            if area.type == 'VIEW_3D':
                override_context['area'] = area
                for region in area.regions:
                    if region.type == 'WINDOW':
                        override_context['region'] = region
                        break
                break
        with bpy.context.temp_override(**override_context):
            bpy.ops.mesh.loop_multi_select()

        # Update the mesh to reflect the selection
        bmesh.update_edit_mesh(obj.data)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def selectEdgeRing(edgeId: str) -> Dict[str, Any]:
    """
    Select an edge ring

    Args:
    edgeId (str): ID of an edge in the ring

    Returns:
    success (bool): Operation success status
    """
    tool_name = "selectEdgeRing"  # Define tool name for logging
    params = {"edgeId": edgeId}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        import bmesh

        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to select an edge ring.")

        # Access the mesh data in edit mode
        bm = bmesh.from_edit_mesh(obj.data)

        # Find the edge by its index
        edge_index = int(edgeId)
        if edge_index < 0 or edge_index >= len(bm.edges):
            raise ValueError(f"Invalid edge ID: {edgeId}")

        # Deselect all edges and select the target edge
        for edge in bm.edges:
            edge.select_set(False)
        bm.edges[edge_index].select_set(True)

        # Use Blender's operator to select the edge ring
        bpy.ops.ed.undo_push(message="Select Edge Ring Operation")
        bpy.ops.mesh.edgering_select()

        # Update the mesh to reflect the selection
        bmesh.update_edit_mesh(obj.data)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def inset(amount: float) -> Dict[str, Any]:
    """
    Inset selected faces

    Args:
    amount (float): Inset amount

    Returns:
    success (bool): Operation success status
    """
    tool_name = "inset"  # Define tool name for logging
    params = {"amount": amount}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        import bmesh

        # Ensure we are in edit mode
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to perform an inset operation.")

        bm = bmesh.from_edit_mesh(obj.data)

        bpy.ops.ed.undo_push(message="Inset Operation")

        # Perform the inset operation
        bpy.ops.mesh.inset(thickness=amount, release_confirm=False)

        # Update the mesh to reflect changes
        # bmesh.update_edit_mesh(obj.data)

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def getGeometry() -> Dict[str, Any]:
    """
    Get geometry data for the current edited mesh

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    geometryData (Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str], "vertices": List[List[float]], "edges": List[List[int]], "faces": List[int]}): Geometry data
    """
    tool_name = "getGeometry"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        import bmesh

        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to retrieve geometry data.")

        bm = bmesh.from_edit_mesh(obj.data)
        vertices = [[v.co.x, v.co.y, v.co.z] for v in bm.verts]
        edges = [[e.verts[0].index, e.verts[1].index] for e in bm.edges]
        faces = [[v.index for v in f.verts] for f in bm.faces]

        return {
            "success": True,
            "geometryData": {
                "vertices": vertices,
                "edges": edges,
                "faces": faces,
            },
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def dissolve(type: Literal["vertex", "edge", "face"]) -> Dict[str, Any]:
    """
    Dissolve selected vertices, edges, or faces

    Args:
    ids (List[str]): IDs of structures to dissolve
    type (Literal["vertex", "edge", "face"]): The type parameter

    Returns:
    success (bool): Operation success status
    """
    tool_name = "dissolve"  # Define tool name for logging
    params = {"type": type}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Ensure we are in edit mode
        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You have to start editing the mesh to dissolve geometry.")

        # Perform the dissolve operation based on the type
        if type == "vertex":
            bpy.ops.mesh.dissolve_verts()
        elif type == "edge":
            bpy.ops.mesh.dissolve_edges()
        elif type == "face":
            bpy.ops.mesh.dissolve_faces()
        else:
            raise ValueError(f"Invalid type: {type}")

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def editStart(meshIds: List[str]) -> Dict[str, Any]:
    """
    Starts a modeling operation

    Args:
    meshIds (List[str]): The meshIds parameter

    Returns:
    success (bool): Operation success status
    """
    tool_name = "editStart"  # Define tool name for logging
    params = {"meshIds": meshIds}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Deselect all objects first
        bpy.ops.object.select_all(action='DESELECT')

        # Select the objects by their IDs
        for obj in bpy.data.objects:
            if obj.name in meshIds:
                obj.select_set(True)

        # Set the active object to the first one in the list and enter edit mode
        if meshIds:
            bpy.context.view_layer.objects.active = bpy.data.objects[meshIds[0]]
            bpy.ops.object.mode_set(mode='EDIT')

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def editStop() -> Dict[str, Any]:
    """
    Stops a modeling operation

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    """
    tool_name = "editStop"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Exit edit mode
        bpy.ops.object.mode_set(mode='OBJECT')

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def extrude(offset: List[float]) -> Dict[str, Any]:
    """
    Extrude selected vertices, edges, or faces

    Args:
    offset (List[float]): Extrusion offset vector

    Returns:
    success (bool): Operation success status
    """
    tool_name = "extrude"  # Define tool name for logging
    params = {"offset": offset}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Ensure we are in edit mode
        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError("You must be in edit mode to extrude geometry.")

        bpy.ops.ed.undo_push(message="Extrude Operation")

        # Perform the extrusion
        bpy.ops.mesh.extrude_region_move(
            TRANSFORM_OT_translate={"value": (offset[0], offset[1], offset[2])})

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def setMode(mode: Literal["vertex", "edge", "face"]) -> Dict[str, Any]:
    """
    Sets the current geometry structure to edit (vertex, edge, face)

    Args:
    mode (Literal["vertex", "edge", "face"]): The mode parameter

    Returns:
    success (bool): Operation success status
    """
    tool_name = "setMode"  # Define tool name for logging
    params = {"mode": mode}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        # Validate enum values for mode
        if mode not in ['vertex', 'edge', 'face']:
            raise ValueError(
                f"Parameter 'mode' must be one of ['vertex', 'edge', 'face'], got {mode}")

        # Map mode to Blender's selection mode
        mode_map = {
            'vertex': 'VERT',
            'edge': 'EDGE',
            'face': 'FACE'
        }
        bpy.ops.mesh.select_mode(type=mode_map[mode])

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def subdivide(count: Optional[int] = None) -> Dict[str, Any]:
    """
    Subdivide selected edges or faces

    Args:
    count (int): Number of subdivisions

    Returns:
    success (bool): Operation success status
    """
    tool_name = "subdivide"  # Define tool name for logging
    params = {"count": count}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Ensure we are in edit mode
        if bpy.context.object.mode != 'EDIT':
            raise RuntimeError(
                "You must be in edit mode to subdivide geometry.")

        bpy.ops.ed.undo_push(message="Subdivide Operation")

        # Perform the subdivision
        bpy.ops.mesh.subdivide(number_cuts=count or 1)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===


def deleteMaterials(ids: List[str]) -> Dict[str, Any]:
    """
    Delete multiple Materials

    Args:
    ids (List[str]): Material identifiers to delete

    Returns:
    success (bool): Operation success status
    """
    tool_name = "deleteMaterials"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # TODO: Implement actual blender API calls
        # This is a placeholder implementation

        return {
            "success": True
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def splitMeshes(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Split meshes into separate objects

    Args:
    items (List[Dict[str, Any] with keys {"meshId": str, "method": Literal["byMaterial", "byUnconnected", "bySelection"], "namePattern": str}]): Meshes to split

    Returns:
    success (bool): Operation success status
    results (List[Dict[str, Any] with keys {"originalMeshId": str, "resultMeshIds": List[str]}]): Split results by mesh
    """
    tool_name = "splitMeshes"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # TODO: Implement actual blender API calls
        # This is a placeholder implementation

        return {
            "success": True,  # TODO: Implement
            "results": None
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getMaterials() -> Dict[str, Any]:
    """
    Get materials for the current edited mesh

    Args:

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str}}]): Array of Materials objects
    """
    tool_name = "getMaterials"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Get the active object
        obj = bpy.context.object
        if obj is None or obj.type != 'MESH':
            raise RuntimeError("No active mesh object found.")

        # Retrieve materials from the object
        materials = []
        for index, material in enumerate(obj.data.materials):
            if material:
                materials.append({"id": str(index), "name": material.name})

        return {
            "success": True,
            "items": materials
        }
    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def combineMeshes(meshIds: List[str], name: Optional[str] = None, preserveSubMeshes: Optional[bool] = None, worldSpace: Optional[bool] = None) -> Dict[str, Any]:
    """
    Combine multiple meshes into a single mesh

    Args:
    meshIds (List[str]): IDs of meshes to combine
    name (str): Name for the combined mesh
    preserveSubMeshes (bool): Whether to preserve material assignments as submeshes
    worldSpace (bool): Whether to combine in world space or local space

    Returns:
    success (bool): Operation success status
    combinedMeshId (str): ID of the newly created combined mesh
    """
    tool_name = "combineMeshes"  # Define tool name for logging
    params = {"meshIds": meshIds, "name": name, "preserveSubMeshes": preserveSubMeshes,
              "worldSpace": worldSpace}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # TODO: Implement actual blender API calls
        # This is a placeholder implementation

        return {
            "success": True,  # TODO: Implement
            "combinedMeshId": None
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}

 # === NEWLY GENERATED ===
