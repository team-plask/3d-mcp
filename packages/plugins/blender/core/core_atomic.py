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


def transformObjects(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Apply transformations to multiple objects

    Args:
    items (List[Dict[str, Any] with keys {"id": str, "position": List[float], "rotation": List[float], "scale": List[float], "positionOffset": List[float], "rotationOffset": List[float], "scaleOffset": List[float], "space": Literal["local", "world", "parent"]}]): Transformations to apply

    Returns:
    success (bool): Operation success status
    """
    tool_name = "transformObjects"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        for item in items:
            obj = bpy.data.objects.get(item["id"])
            if not obj:
                continue

            # Handle different coordinate spaces
            space = item.get("space", "world")

            # Set absolute transforms
            if "position" in item and item["position"] is not None:
                if space == "world":
                    obj.location = item["position"]
                elif space == "local" or space == "parent":
                    obj.location = item["position"]

            if "rotation" in item and item["rotation"] is not None:
                if space == "world":
                    obj.rotation_euler = item["rotation"]
                elif space == "local" or space == "parent":
                    obj.rotation_euler = item["rotation"]

            if "scale" in item and item["scale"] is not None:
                obj.scale = item["scale"]

            # Apply offsets
            if "positionOffset" in item and item["positionOffset"] is not None:
                for i in range(min(len(obj.location), len(item["positionOffset"]))):
                    obj.location[i] += item["positionOffset"][i]

            if "rotationOffset" in item and item["rotationOffset"] is not None:
                for i in range(
                    min(len(obj.rotation_euler), len(item["rotationOffset"]))
                ):
                    obj.rotation_euler[i] += item["rotationOffset"][i]

            if "scaleOffset" in item and item["scaleOffset"] is not None:
                for i in range(min(len(obj.scale), len(item["scaleOffset"]))):
                    obj.scale[i] += item["scaleOffset"][i]

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
    ids: List[str],
    mode: Optional[Literal["replace", "add", "remove", "toggle"]] = None,
    domain: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Select one or more objects

    Args:
    ids (List[str]): Object identifiers to select
    mode (Literal["replace", "add", "remove", "toggle"]): Selection mode operation
    domain (str): Optional domain to restrict selection (e.g., 'mesh', 'animation')

    Returns:
    success (bool): Operation success status
    selectedIds (List[str]): All selected object IDs after operation
    """
    tool_name = "select"  # Define tool name for logging
    params = {
        "ids": ids,
        "mode": mode,
        "domain": domain,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # Validation already done

        # Implement actual blender API calls
        selection_mode = mode if mode is not None else "replace"

        # Handle replace mode by clearing current selection
        if selection_mode == "replace":
            bpy.ops.object.select_all(action="DESELECT")

        # Process each object
        for obj_id in ids:
            obj = bpy.data.objects.get(obj_id)
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
