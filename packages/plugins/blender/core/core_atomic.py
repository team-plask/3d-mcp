# Generated blender implementation for core atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal


def query(
    type: Optional[str] = None, properties: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Query entities based on criteria

    Args:
    type (str): Entity type to filter by
    properties (Dict[str, Any]): Property values to match (path -> value). Skip to get all entities of the type

    Returns:
    success (bool): Operation success status
    results (List[str]): IDs of matching entities
    """
    tool_name = "query"  # Define tool name for logging
    # Create params dict for logging
    params = {"type": type, "properties": properties}
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        results = []

        if type == "OBJECT" or type is None:
            candidates = bpy.data.objects
        elif type == "MATERIAL":
            candidates = bpy.data.materials
        elif type == "MESH":
            candidates = bpy.data.meshes
        else:
            candidates = bpy.data.objects  # Default to objects

        # Filter by properties if specified
        for obj in candidates:
            match = True

            if properties:
                for prop_path, expected_value in properties.items():
                    # Simple property path navigation (doesn't handle complex paths)
                    if (
                        not hasattr(obj, prop_path)
                        or getattr(obj, prop_path) != expected_value
                    ):
                        match = False
                        break

            if match:
                results.append(obj.name)

        return {"success": True, "results": results}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def clearSelection(domain: Optional[str] = None) -> Dict[str, Any]:
    """
    Clear current selection

    Args:
    domain (str): Optional domain to restrict clearing (e.g., 'mesh', 'animation')

    Returns:
    success (bool): Operation success status
    """
    tool_name = "clearSelection"  # Define tool name for logging
    params = {"domain": domain}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        if domain == "mesh" or domain is None:
            # Deselect all mesh elements
            if bpy.context.active_object and bpy.context.active_object.mode == "EDIT":
                bpy.ops.mesh.select_all(action="DESELECT")

        # Always deselect all objects in object mode
        bpy.ops.object.select_all(action="DESELECT")

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getChildren(
    id: str, recursive: Optional[bool] = None, typeFilter: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Get all children of an object

    Args:
    id (str): Parent object identifier
    recursive (bool): Whether to include all descendants
    typeFilter (List[str]): Filter by object types

    Returns:
    success (bool): Operation success status
    childIds (List[str]): Child object IDs
    """
    tool_name = "getChildren"  # Define tool name for logging
    params = {
        "id": id,
        "recursive": recursive,
        "typeFilter": typeFilter,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        parent_obj = bpy.data.objects.get(id)
        if not parent_obj:
            return {"success": False, "error": f"Parent object with ID {id} not found"}

        child_ids = []

        def collect_children(obj, recursive=False):
            for child in obj.children:
                # Apply type filter if specified
                if typeFilter and child.type not in typeFilter:
                    continue

                child_ids.append(child.name)

                # Recursively collect grandchildren if requested
                if recursive:
                    collect_children(child, recursive)

        collect_children(
            parent_obj, recursive if recursive is not None else False)

        return {"success": True, "childIds": child_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getSelection(domain: Optional[str] = None) -> Dict[str, Any]:
    """
    Get currently selected objects

    Args:
    domain (str): Optional domain to filter results (e.g., 'mesh', 'animation')

    Returns:
    success (bool): Operation success status
    selectedIds (List[str]): Currently selected object IDs
    """
    tool_name = "getSelection"  # Define tool name for logging
    params = {"domain": domain}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        selected_ids = []

        if (
            domain == "mesh"
            and bpy.context.active_object
            and bpy.context.active_object.mode == "EDIT"
        ):
            # Get selected mesh elements in edit mode
            # This is more complex and depends on what exactly we want to return
            # For now, just return the active object
            selected_ids.append(bpy.context.active_object.name)
        else:
            # Get selected objects in object mode
            for obj in bpy.context.selected_objects:
                selected_ids.append(obj.name)

        return {"success": True, "selectedIds": selected_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def undo() -> Dict[str, Any]:
    """
    Undo the last operation

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    operationName (str): Name of the undone operation
    """
    tool_name = "undo"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        bpy.ops.ed.undo()

        # Blender doesn't provide a way to get the name of the undone operation
        # so we return a generic message
        return {"success": True, "operationName": "Last Operation"}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def transform(translation: Optional[List[float]] = None, rotation: Optional[List[float]] = None, scale: Optional[List[float]] = None) -> Dict[str, Any]:
    """
    Apply transformations (translate, rotate, scale) to selected elements

    Args:
    translation (List[float]): Translation vector
    rotation (List[float]): Rotation vector (Euler angles)
    scale (List[float]): Scaling vector

    Returns:
    success (bool): Operation success status
    """
    tool_name = "transform"  # Define tool name for logging
    params = {"translation": translation, "rotation": rotation,
              "scale": scale}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        import bmesh
        import mathutils

        # Create transformation matrices
        translation_matrix = mathutils.Matrix.Translation(
            translation) if translation else mathutils.Matrix.Identity(4)
        rotation_matrix = mathutils.Euler(rotation, 'XYZ').to_matrix(
        ).to_4x4() if rotation else mathutils.Matrix.Identity(4)
        scale_matrix = mathutils.Matrix.Diagonal(
            scale + [1]) if scale else mathutils.Matrix.Identity(4)
        transformation_matrix = translation_matrix @ rotation_matrix @ scale_matrix

        # Check the mode and apply transformations accordingly
        obj = bpy.context.object
        if obj is None:
            raise RuntimeError("No active object found.")

        if obj.mode == 'EDIT':  # Edit mode (vertices or faces)
            bm = bmesh.from_edit_mesh(obj.data)

            # Get selected elements (vertices or faces)
            selected_verts = [v for v in bm.verts if v.select]
            selected_faces = [f for f in bm.faces if f.select]

            if selected_verts:
                # Calculate the median point of the selected vertices
                median_point = mathutils.Vector((0.0, 0.0, 0.0))
                for vert in selected_verts:
                    median_point += vert.co
                median_point /= len(selected_verts)

                # Apply transformations relative to the median point
                for vert in selected_verts:
                    local_co = vert.co - median_point
                    transformed_co = transformation_matrix @ local_co
                    vert.co = transformed_co + median_point

            elif selected_faces:
                # Apply transformations to face centers
                for face in selected_faces:
                    for vert in face.verts:
                        local_co = vert.co
                        transformed_co = transformation_matrix @ local_co
                        vert.co = transformed_co

            # Update the mesh to reflect changes
            bmesh.update_edit_mesh(obj.data)

        elif obj.mode == 'OBJECT':  # Object mode
            selected_objects = bpy.context.selected_objects
            if not selected_objects:
                raise RuntimeError("No objects selected.")

            for obj in selected_objects:
                # Apply transformation to the object's matrix
                obj.matrix_world = transformation_matrix @ obj.matrix_world

        else:
            raise RuntimeError("Unsupported mode for transformation.")

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def delete(type: Optional[Literal["vertex", "edge", "face", "only_faces", "only_edges_and_faces"]] = "face") -> Dict[str, Any]:
    """
    Deletes the current selection. Additional optional type can be provided to filter the deletion

    Args:
    type (Optional[Literal["vertex", "edge", "face", "only_faces", "only_edges_and_faces"]]): Type of elements to delete. Only relevant for geometry domain, when a mesh is being edited. Can be 'vertex', 'edge', 'face', 'only_faces' or 'only_edges_and_faces'

    Returns:
    success (bool): Operation success status
    """
    tool_name = "delete"  # Define tool name for logging
    params = {"type": type}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        if bpy.context.object.mode == 'EDIT':
            # Map the type to Blender's delete operation
            type_map = {
                "vertex": "VERT",
                "edge": "EDGE",
                "face": "FACE",
                "only_faces": "ONLY_FACE",
                "only_edges_and_faces": "EDGE_FACE",
            }

            if type not in type_map:
                raise ValueError(f"Invalid type: {type}")

            bpy.ops.ed.undo_push(message="Delete Operation")

            # Perform the delete operation
            bpy.ops.mesh.delete(type=type_map[type])

            return {"success": True}
        elif bpy.context.object.mode == 'OBJECT':
            bpy.ops.ed.undo_push(message="Delete Operation")

            # Use the object delete operator
            bpy.ops.object.delete()
            return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def setParentObjects(
    items: List[Dict[str, Any]], maintainWorldTransform: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Set parent for multiple objects

    Args:
    items (List[Dict[str, Any] with keys {"id": str, "parentId": str}]): Parent assignments to make
    maintainWorldTransform (bool): Whether to preserve world transforms after reparenting

    Returns:
    success (bool): Operation success status
    """
    tool_name = "setParentObjects"  # Define tool name for logging
    params = {
        "items": items,
        "maintainWorldTransform": maintainWorldTransform,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        for item in items:
            child_obj = bpy.data.objects.get(item["id"])
            parent_obj = bpy.data.objects.get(item["parentId"])

            if not child_obj or not parent_obj:
                continue

            # Save world transform if needed
            if maintainWorldTransform:
                # Store original world transform
                original_matrix_world = child_obj.matrix_world.copy()

            # Set the parent
            child_obj.parent = parent_obj

            # Restore world transform if needed
            if maintainWorldTransform:
                child_obj.matrix_world = original_matrix_world

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def redo() -> Dict[str, Any]:
    """
    Redo the previously undone operation

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    operationName (str): Name of the redone operation
    """
    tool_name = "redo"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        bpy.ops.ed.redo()

        # Blender doesn't provide a way to get the name of the redone operation
        # so we return a generic message
        return {"success": True, "operationName": "Last Undone Operation"}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def duplicate(
    id: str,
    newName: Optional[str] = None,
    duplicateChildren: Optional[bool] = None,
    duplicateDependencies: Optional[bool] = None,
) -> Dict[str, Any]:
    """
    Duplicate an entity

    Args:
    id (str): Source entity identifier
    newName (str): Name for the duplicated entity
    duplicateChildren (bool): Whether to duplicate children
    duplicateDependencies (bool): Whether to duplicate dependencies (materials, etc.)

    Returns:
    success (bool): Operation success status
    newId (str): ID of the duplicated entity
    childIds (List[str]): IDs of duplicated children if applicable
    """
    tool_name = "duplicate"  # Define tool name for logging
    params = {
        "id": id,
        "newName": newName,
        "duplicateChildren": duplicateChildren,
        "duplicateDependencies": duplicateDependencies,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        orig_obj = bpy.data.objects.get(id)
        if not orig_obj:
            return {"success": False, "error": f"Object with ID {id} not found"}

        # Deselect all objects
        bpy.ops.object.select_all(action="DESELECT")

        # Select only the object to duplicate
        orig_obj.select_set(True)
        bpy.context.view_layer.objects.active = orig_obj

        # Duplicate the object
        bpy.ops.object.duplicate(linked=not duplicateDependencies)

        # The duplicated object will be the active object
        new_obj = bpy.context.active_object

        # Rename if a new name was provided
        if newName:
            new_obj.name = newName

        # Get the IDs of duplicated children if applicable
        child_ids = []
        if duplicateChildren and new_obj.children:
            for child in new_obj.children:
                child_ids.append(child.name)

        return {"success": True, "newId": new_obj.name, "childIds": child_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def select(
    ids:  Optional[List[str]] = None,
    predicate: Optional[str] = None,
    mode: Optional[Literal["replace", "add", "remove", "toggle"]] = None,
    domain: Optional[Literal["object", "geometry", "material"]] = None,
    subtype: Optional[Literal["vertex, edge", "face"]] = None,
) -> Dict[str, Any]:
    """
    Select one or more objects

    Args:
    ids (List[str]): Optional object identifiers to select
    predicate (str): Optional predicate to filter objects
    mode (Literal["replace", "add", "remove", "toggle"]): Selection mode operation
    domain (str): Optional domain to restrict selection (e.g., 'mesh', 'animation')

    Returns:
    success (bool): Operation success status
    selectedIds (List[str]): All selected object IDs after operation
    """
    tool_name = "select"  # Define tool name for logging
    params = {
        "ids": ids,
        "predicate": predicate,
        "mode": mode,
        "domain": domain,
        "subtype": subtype,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Implement actual blender API calls
        selection_mode = mode if mode is not None else "replace"

        if domain == "geometry":
            import bmesh

            # Validate enum values for type
            if subtype not in ['vertex', 'edge', 'face']:
                raise ValueError(
                    f"Parameter 'subtype' must be one of ['vertex', 'edge', 'face'], got {subtype}")

            # Ensure we are in edit mode
            if bpy.context.object.mode != 'EDIT':
                raise RuntimeError(
                    "You must be in edit mode to select geometry.")

            # Get the active mesh
            obj = bpy.context.object
            mesh = bmesh.from_edit_mesh(obj.data)

            if subtype == "vertex":
                bpy.ops.mesh.select_mode(type='VERT')
            elif subtype == "edge":
                bpy.ops.mesh.select_mode(type='EDGE')
            elif subtype == "face":
                bpy.ops.mesh.select_mode(type='FACE')

            toggle = False
            if selection_mode == "replace":
                # Deselect all first
                bpy.ops.mesh.select_all(action='DESELECT')
                select = True
            elif selection_mode == "add":
                select = True
            elif selection_mode == "remove":
                select = False
            elif selection_mode == "toggle":
                toggle = True
                select = True
            else:
                raise ValueError(f"Invalid selection mode: {selection_mode}")

            if ids is None and predicate is not None:
                # Use the predicate to filter vertices, edges, or faces
                predicate_fn = eval(predicate)
                for elem in mesh.verts if subtype == "vertex" else mesh.edges if subtype == "edge" else mesh.faces:
                    if predicate_fn(elem):
                        elem.select_set(select and (
                            not toggle or not elem.select_get()))

            elif ids is not None:
                for id in ids:
                    index = int(id)
                    if subtype == "vertex":
                        mesh.verts[index].select_set(select and (
                            not toggle or not mesh.verts[index].select_get()))
                    elif subtype == "edge":
                        mesh.edges[index].select_set(select and (
                            not toggle or not mesh.edges[index].select_get()))
                    elif subtype == "face":
                        mesh.faces[index].select_set(select and (
                            not toggle or not mesh.faces[index].select_get()))
            else:
                raise ValueError(
                    "Either 'ids' or 'predicate' must be provided.")
            # Update the mesh to reflect changes
            bmesh.update_edit_mesh(obj.data)

            return {"success": True}

        # domain material or object

        if bpy.context.object.mode != 'OBJECT':
            raise RuntimeError(
                "You must be in object mode to select objects or materials.")

        # Handle replace mode by clearing current selection
        if selection_mode == "replace":
            bpy.ops.object.select_all(action="DESELECT")

        # Process each object
        if ids is None and predicate is not None:
            predicate_fn = eval(predicate)
            objects = [obj for obj in bpy.data.objects if predicate_fn(obj)]
        elif ids is not None:
            objects = [bpy.data.objects.get(obj_id) for obj_id in ids]
        else:
            raise ValueError(
                "Either 'ids' or 'predicate' must be provided.")

        for obj in objects:
            if not obj:
                continue

            if selection_mode == "replace" or selection_mode == "add":
                obj.select_set(True)
            elif selection_mode == "remove":
                obj.select_set(False)
            elif selection_mode == "toggle":
                obj.select_set(not obj.select_get())

        # Return all selected objects after operation
        selected_ids = [obj.name for obj in bpy.context.selected_objects]

        return {"success": True, "selectedIds": selected_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}
