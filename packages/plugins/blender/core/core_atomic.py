# Generated blender implementation for core atomic tools
# This file is generated - DO NOT EDIT DIRECTLY


from typing import Dict, Any, Optional, List, Union, Tuple
import bpy
import uuid
import mathutils


def batchSetProperty(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Set properties on multiple objects

    Args:
    items (List[Dict[str, Any]]): Property assignments to make

    Returns:
    success (bool): Operation success status
    """
    tool_name = "batchSetProperty"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        for item in items:
            if "id" not in item or "entries" not in item:
                raise ValueError(f"Each item must have 'id' and 'entries' fields")

            obj_id = item["id"]
            obj = None

            # Try to find the object by id/name
            for blender_obj in bpy.data.objects:
                if (
                    blender_obj.name == obj_id
                    or getattr(blender_obj, "mcp_id", "") == obj_id
                ):
                    obj = blender_obj
                    break

            if obj is None:
                print(f"Warning: Object with id {obj_id} not found")
                continue

            # Set properties
            for entry in item["entries"]:
                prop_path = entry["propertyPath"]
                value = entry["value"]

                # Navigate property path
                current = obj
                for i, path_part in enumerate(prop_path[:-1]):
                    if hasattr(current, path_part):
                        current = getattr(current, path_part)
                    else:
                        print(
                            f"Warning: Property path {'.'.join(prop_path[:i+1])} not found on object {obj_id}"
                        )
                        break

                # Set the final property if we navigated successfully
                if i == len(prop_path) - 2:  # We reached the second-to-last element
                    final_prop = prop_path[-1]
                    try:
                        setattr(current, final_prop, value)
                    except Exception as e:
                        print(
                            f"Warning: Could not set property {'.'.join(prop_path)}: {str(e)}"
                        )

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def query(
    type: Optional[str] = None, properties: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Query entities based on criteria

    Args:
    type (str): Entity type to filter by
    properties (Dict[str, Any]): Property values to match (path -> value)

    Returns:
    success (bool): Operation success status
    results (List[str]): IDs of matching entities
    """
    tool_name = "query"  # Define tool name for logging
    params = {"type": type, "properties": properties}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        results = []

        # Determine which collection to search based on type
        collection = None
        if type is None or type.lower() == "object":
            collection = bpy.data.objects
        elif type.lower() == "material":
            collection = bpy.data.materials
        elif type.lower() == "mesh":
            collection = bpy.data.meshes
        elif type.lower() == "armature":
            collection = [obj for obj in bpy.data.objects if obj.type == "ARMATURE"]
        else:
            # Default to objects if type is not recognized
            collection = bpy.data.objects

        # Filter collection by properties
        for item in collection:
            matches = True

            if properties:
                for prop_path, value in properties.items():
                    # Split property path into parts
                    parts = prop_path.split(".")

                    # Navigate property path
                    current = item
                    for part in parts:
                        if hasattr(current, part):
                            current = getattr(current, part)
                        else:
                            matches = False
                            break

                    # Compare value
                    if matches and current != value:
                        matches = False

            if matches:
                # Use MCP ID if available, otherwise use name
                item_id = getattr(item, "mcp_id", item.name)
                results.append(item_id)

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
        # In Blender, selection is context-dependent
        # For objects in 3D view
        if domain is None or domain.lower() == "object" or domain.lower() == "model":
            for obj in bpy.context.selected_objects:
                obj.select_set(False)

        # For mesh elements (in edit mode)
        elif domain.lower() == "mesh":
            if bpy.context.mode == "EDIT_MESH":
                bpy.ops.mesh.select_all(action="DESELECT")

        # For armature elements (in edit mode)
        elif domain.lower() == "armature" or domain.lower() == "rig":
            if bpy.context.mode == "EDIT_ARMATURE":
                bpy.ops.armature.select_all(action="DESELECT")

        # For animation keyframes
        elif domain.lower() == "animation":
            if bpy.context.mode == "DOPESHEET_EDITOR":
                bpy.ops.action.select_all(action="DESELECT")

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
        # Default value for recursive
        if recursive is None:
            recursive = False

        # Find the parent object
        parent_obj = None
        for obj in bpy.data.objects:
            if obj.name == id or getattr(obj, "mcp_id", "") == id:
                parent_obj = obj
                break

        if parent_obj is None:
            return {"success": False, "error": f"Object with id {id} not found"}

        child_ids = []

        # Helper function to collect children recursively
        def collect_children(obj, is_recursive=False):
            for child in obj.children:
                # Apply type filter if specified
                if typeFilter and child.type.lower() not in [
                    t.lower() for t in typeFilter
                ]:
                    continue

                # Use MCP ID if available, otherwise use name
                child_id = getattr(child, "mcp_id", child.name)
                child_ids.append(child_id)

                # Recurse if needed
                if is_recursive:
                    collect_children(child, is_recursive)

        # Collect children
        collect_children(parent_obj, recursive)

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
        selected_ids = []

        # Selection of objects in the 3D view
        if domain is None or domain.lower() == "object" or domain.lower() == "model":
            for obj in bpy.context.selected_objects:
                # Use MCP ID if available, otherwise use name
                obj_id = getattr(obj, "mcp_id", obj.name)
                selected_ids.append(obj_id)

        # Selection in mesh edit mode
        elif domain.lower() == "mesh" and bpy.context.mode == "EDIT_MESH":
            import bmesh

            if bpy.context.active_object and bpy.context.active_object.type == "MESH":
                me = bpy.context.active_object.data
                bm = bmesh.from_edit_mesh(me)

                # Get selected vertices
                for v in bm.verts:
                    if v.select:
                        selected_ids.append(
                            f"{bpy.context.active_object.name}_v{v.index}"
                        )

                # Get selected edges
                for e in bm.edges:
                    if e.select:
                        selected_ids.append(
                            f"{bpy.context.active_object.name}_e{e.index}"
                        )

                # Get selected faces
                for f in bm.faces:
                    if f.select:
                        selected_ids.append(
                            f"{bpy.context.active_object.name}_f{f.index}"
                        )

        # Selection in armature edit mode
        elif (
            domain.lower() == "armature" or domain.lower() == "rig"
        ) and bpy.context.mode == "EDIT_ARMATURE":
            if (
                bpy.context.active_object
                and bpy.context.active_object.type == "ARMATURE"
            ):
                armature = bpy.context.active_object.data
                for bone in armature.edit_bones:
                    if bone.select:
                        selected_ids.append(
                            f"{bpy.context.active_object.name}_{bone.name}"
                        )

        # Selection in animation editor
        elif domain.lower() == "animation":
            # This is more complex and depends on the specific animation context
            # Basic implementation for keyframes in the active action
            if (
                bpy.context.object
                and bpy.context.object.animation_data
                and bpy.context.object.animation_data.action
            ):
                action = bpy.context.object.animation_data.action
                for fcurve in action.fcurves:
                    for keyframe in fcurve.keyframe_points:
                        if keyframe.select_control_point:
                            selected_ids.append(
                                f"{action.name}_fc{fcurve.array_index}_k{int(keyframe.co.x)}"
                            )

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
        # Get the current undo steps to determine what operation will be undone
        undo_steps = bpy.context.preferences.edit.undo_steps
        undo_memory_limit = bpy.context.preferences.edit.undo_memory_limit

        # Note: Blender doesn't have a direct API to get the name of the operation being undone
        # This is a limitation we need to work with

        # Execute undo operation
        bpy.ops.ed.undo()

        return {
            "success": True,
            "operationName": "Unknown Operation",  # Blender API limitation
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def batchGetProperty(
    items: List[Dict[str, Any]], recursive: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Get property values from multiple objects

    Args:
    items (List[Dict[str, Any]]): Property requests to make
    recursive (bool): Whether to include all descendants

    Returns:
    success (bool): Operation success status
    values (List[Dict[str, Any]]): Property values retrieved
    """
    tool_name = "batchGetProperty"  # Define tool name for logging
    params = {"items": items, "recursive": recursive}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        if recursive is None:
            recursive = False

        values = []

        for item in items:
            if "id" not in item or "propertyPath" not in item:
                raise ValueError(f"Each item must have 'id' and 'propertyPath' fields")

            obj_id = item["id"]
            prop_paths = item["propertyPath"]

            # Find the object by id/name
            obj = None
            for blender_obj in bpy.data.objects:
                if (
                    blender_obj.name == obj_id
                    or getattr(blender_obj, "mcp_id", "") == obj_id
                ):
                    obj = blender_obj
                    break

            if obj is None:
                print(f"Warning: Object with id {obj_id} not found")
                continue

            # Process this object
            for prop_path in prop_paths:
                # Navigate property path
                current = obj
                path_parts = (
                    prop_path if isinstance(prop_path, list) else prop_path.split(".")
                )
                valid_path = True

                for part in path_parts:
                    if hasattr(current, part):
                        current = getattr(current, part)
                    else:
                        valid_path = False
                        print(
                            f"Warning: Property path {prop_path} not found on object {obj_id}"
                        )
                        break

                if valid_path:
                    # Convert to serializable format if needed
                    if isinstance(current, mathutils.Vector):
                        current = list(current)
                    elif isinstance(current, mathutils.Matrix):
                        current = [list(row) for row in current]
                    elif isinstance(current, mathutils.Quaternion):
                        current = [current.x, current.y, current.z, current.w]

                    values.append(
                        {
                            "id": obj_id,
                            "propertyPath": (
                                prop_path
                                if isinstance(prop_path, str)
                                else ".".join(prop_path)
                            ),
                            "value": current,
                        }
                    )

            # Process children if recursive
            if recursive:

                def process_children(parent_obj):
                    for child in parent_obj.children:
                        child_id = getattr(child, "mcp_id", child.name)

                        # Process the same property paths on each child
                        for prop_path in prop_paths:
                            current = child
                            path_parts = (
                                prop_path
                                if isinstance(prop_path, list)
                                else prop_path.split(".")
                            )
                            valid_path = True

                            for part in path_parts:
                                if hasattr(current, part):
                                    current = getattr(current, part)
                                else:
                                    valid_path = False
                                    break

                            if valid_path:
                                # Convert to serializable format if needed
                                if isinstance(current, mathutils.Vector):
                                    current = list(current)
                                elif isinstance(current, mathutils.Matrix):
                                    current = [list(row) for row in current]
                                elif isinstance(current, mathutils.Quaternion):
                                    current = [
                                        current.x,
                                        current.y,
                                        current.z,
                                        current.w,
                                    ]

                                values.append(
                                    {
                                        "id": child_id,
                                        "propertyPath": (
                                            prop_path
                                            if isinstance(prop_path, str)
                                            else ".".join(prop_path)
                                        ),
                                        "value": current,
                                    }
                                )

                        # Recurse to this child's children
                        process_children(child)

                # Start processing children
                process_children(obj)

        return {"success": True, "values": values}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def batchTransform(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Apply transformations to multiple objects

    Args:
    items (List[Dict[str, Any]]): Transformations to apply

    Returns:
    success (bool): Operation success status
    """
    tool_name = "batchTransform"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        for item in items:
            if "id" not in item:
                raise ValueError(f"Each item must have 'id' field")

            obj_id = item["id"]

            # Find the object by id/name
            obj = None
            for blender_obj in bpy.data.objects:
                if (
                    blender_obj.name == obj_id
                    or getattr(blender_obj, "mcp_id", "") == obj_id
                ):
                    obj = blender_obj
                    break

            if obj is None:
                print(f"Warning: Object with id {obj_id} not found")
                continue

            # Get space
            space = item.get("space", "world")

            # Apply absolute transforms if specified
            if "position" in item:
                pos = item["position"]
                if space == "world":
                    obj.location = mathutils.Vector(pos)
                elif space == "local":
                    if obj.parent:
                        # Convert from local to world
                        parent_matrix_inv = obj.parent.matrix_world.inverted()
                        world_pos = obj.parent.matrix_world @ mathutils.Vector(pos)
                        obj.location = world_pos
                    else:
                        obj.location = mathutils.Vector(pos)

            if "rotation" in item:
                rot = item["rotation"]
                if len(rot) == 4:  # Quaternion
                    quat = mathutils.Quaternion(
                        (rot[3], rot[0], rot[1], rot[2])
                    )  # w, x, y, z
                    if space == "world":
                        obj.rotation_mode = "QUATERNION"
                        obj.rotation_quaternion = quat
                    elif space == "local":
                        obj.rotation_mode = "QUATERNION"
                        if obj.parent:
                            # This is an approximation for local rotation
                            parent_rot = obj.parent.rotation_quaternion
                            obj.rotation_quaternion = parent_rot @ quat
                        else:
                            obj.rotation_quaternion = quat

            if "scale" in item:
                scale = item["scale"]
                obj.scale = mathutils.Vector(scale)

            # Apply relative transforms if specified
            if "positionOffset" in item:
                offset = mathutils.Vector(item["positionOffset"])
                if space == "world":
                    obj.location += offset
                elif space == "local":
                    # Apply offset in local space
                    local_matrix = obj.matrix_local.to_3x3()
                    obj.location += local_matrix @ offset

            if "rotationOffset" in item:
                rot_offset = item["rotationOffset"]
                if len(rot_offset) == 4:  # Quaternion
                    quat_offset = mathutils.Quaternion(
                        (rot_offset[3], rot_offset[0], rot_offset[1], rot_offset[2])
                    )
                    obj.rotation_mode = "QUATERNION"
                    if space == "world":
                        obj.rotation_quaternion = obj.rotation_quaternion @ quat_offset
                    elif space == "local":
                        obj.rotation_quaternion = quat_offset @ obj.rotation_quaternion

            if "scaleOffset" in item:
                scale_offset = mathutils.Vector(item["scaleOffset"])
                obj.scale = mathutils.Vector(
                    [obj.scale[i] * scale_offset[i] for i in range(3)]
                )

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def batchSetParent(
    items: List[Dict[str, Any]], maintainWorldTransform: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Set parent for multiple objects

    Args:
    items (List[Dict[str, Any]]): Parent assignments to make
    maintainWorldTransform (bool): Whether to preserve world transforms after reparenting

    Returns:
    success (bool): Operation success status
    """
    tool_name = "batchSetParent"  # Define tool name for logging
    params = {
        "items": items,
        "maintainWorldTransform": maintainWorldTransform,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        if maintainWorldTransform is None:
            maintainWorldTransform = True

        # Store original state to restore selection
        original_active = bpy.context.view_layer.objects.active
        original_selected = [obj for obj in bpy.context.selected_objects]

        for item in items:
            if "id" not in item or "parentId" not in item:
                raise ValueError(f"Each item must have 'id' and 'parentId' fields")

            child_id = item["id"]
            parent_id = item["parentId"]

            # Find the child object
            child = None
            for obj in bpy.data.objects:
                if obj.name == child_id or getattr(obj, "mcp_id", "") == child_id:
                    child = obj
                    break

            if child is None:
                print(f"Warning: Child object with id {child_id} not found")
                continue

            # If parentId is null, unparent the object
            if parent_id is None:
                # Clear parent
                if maintainWorldTransform:
                    # Clear parent keeping transformation
                    child.parent = None
                    child.matrix_parent_inverse = mathutils.Matrix()
                else:
                    # Store world matrix to restore after unparenting
                    world_matrix = child.matrix_world.copy()
                    child.parent = None
                    child.matrix_world = world_matrix
                continue

            # Find the parent object
            parent = None
            for obj in bpy.data.objects:
                if obj.name == parent_id or getattr(obj, "mcp_id", "") == parent_id:
                    parent = obj
                    break

            if parent is None:
                print(f"Warning: Parent object with id {parent_id} not found")
                continue

            # Set parent
            if maintainWorldTransform:
                # Remember current world transform
                world_matrix = child.matrix_world.copy()

                # Set parent
                child.parent = parent

                # Adjust matrix_parent_inverse to maintain world transform
                child.matrix_parent_inverse = parent.matrix_world.inverted()
            else:
                # Just set parent without maintaining world transform
                child.parent = parent
                child.matrix_parent_inverse = mathutils.Matrix()

        # Restore original selection state
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = original_active
        for obj in original_selected:
            obj.select_set(True)

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
        # Execute redo operation
        bpy.ops.ed.redo()

        # Note: Like with undo, Blender doesn't provide a way to get the operation name
        return {
            "success": True,
            "operationName": "Unknown Operation",  # Blender API limitation
        }

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
        # Default values
        if duplicateChildren is None:
            duplicateChildren = True
        if duplicateDependencies is None:
            duplicateDependencies = False

        # Find the source object
        source_obj = None
        for obj in bpy.data.objects:
            if obj.name == id or getattr(obj, "mcp_id", "") == id:
                source_obj = obj
                break

        if source_obj is None:
            return {"success": False, "error": f"Object with id {id} not found"}

        # Store original selection and active object
        original_active = bpy.context.view_layer.objects.active
        original_selected = [obj for obj in bpy.context.selected_objects]

        # Clear selection and select only the source object
        bpy.ops.object.select_all(action="DESELECT")
        source_obj.select_set(True)
        bpy.context.view_layer.objects.active = source_obj

        # If we're duplicating children, make sure we're in object mode
        if duplicateChildren:
            if bpy.context.mode != "OBJECT":
                bpy.ops.object.mode_set(mode="OBJECT")
            (
                bpy.ops.object.duplicate_move_linked()
                if not duplicateDependencies
                else bpy.ops.object.duplicate_move()
            )
        else:
            # Duplicate just the object without its children
            duplicate_obj = source_obj.copy()
            if duplicateDependencies:
                # Duplicate mesh/material data as well
                if hasattr(source_obj, "data") and source_obj.data:
                    duplicate_obj.data = source_obj.data.copy()
            bpy.context.collection.objects.link(duplicate_obj)

        # Get the newly created duplicate (it's now the active/selected object)
        new_obj = bpy.context.view_layer.objects.active

        # Generate new MCP ID
        new_mcp_id = str(uuid.uuid4())
        setattr(new_obj, "mcp_id", new_mcp_id)

        # Change name if requested
        if newName:
            new_obj.name = newName

        # Get children IDs if applicable
        child_ids = []
        if duplicateChildren:
            for child in new_obj.children:
                child_mcp_id = str(uuid.uuid4())
                setattr(child, "mcp_id", child_mcp_id)
                child_ids.append(child_mcp_id)

        # Restore original selection
        bpy.ops.object.select_all(action="DESELECT")
        bpy.context.view_layer.objects.active = original_active
        for obj in original_selected:
            obj.select_set(True)

        return {
            "success": True,
            "newId": new_mcp_id,
            "childIds": child_ids if duplicateChildren else None,
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def select(
    ids: List[str], mode: Optional[str] = None, domain: Optional[str] = None
) -> Dict[str, Any]:
    """
    Select one or more objects

    Args:
    ids (List[str]): Object identifiers to select
    mode (str): Selection mode operation
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
        # Validate enum values for mode
        if mode is None:
            mode = "replace"
        elif mode not in ["replace", "add", "remove", "toggle"]:
            raise ValueError(
                f"Parameter 'mode' must be one of ['replace','add','remove','toggle'], got {mode}"
            )

        # Handle selection based on domain
        if domain is None or domain.lower() == "object" or domain.lower() == "model":
            # If mode is 'replace', deselect all objects first
            if mode == "replace":
                bpy.ops.object.select_all(action="DESELECT")

            # Find and select/deselect the specified objects
            for obj_id in ids:
                found = False
                for obj in bpy.data.objects:
                    if obj.name == obj_id or getattr(obj, "mcp_id", "") == obj_id:
                        if mode == "add" or mode == "replace":
                            obj.select_set(True)
                        elif mode == "remove":
                            obj.select_set(False)
                        elif mode == "toggle":
                            obj.select_set(not obj.select_get())
                        found = True
                        break

                if not found:
                    print(f"Warning: Object with id {obj_id} not found")

        # Handle mesh element selection (vertices, edges, faces)
        elif domain.lower() == "mesh" and bpy.context.mode == "EDIT_MESH":
            import bmesh

            if bpy.context.active_object and bpy.context.active_object.type == "MESH":
                me = bpy.context.active_object.data
                bm = bmesh.from_edit_mesh(me)

                # If mode is 'replace', deselect all elements first
                if mode == "replace":
                    for v in bm.verts:
                        v.select = False
                    for e in bm.edges:
                        e.select = False
                    for f in bm.faces:
                        f.select = False

                # Parse IDs and select elements
                for elem_id in ids:
                    parts = elem_id.split("_")
                    if len(parts) < 2:
                        continue

                    obj_name = parts[0]
                    elem_type = parts[1][0]  # 'v', 'e', or 'f'
                    try:
                        elem_index = int(parts[1][1:])
                    except ValueError:
                        continue

                    # Only process elements of the active object
                    if obj_name != bpy.context.active_object.name:
                        continue

                    # Select the element
                    if elem_type == "v" and elem_index < len(bm.verts):
                        if mode == "add" or mode == "replace":
                            bm.verts[elem_index].select = True
                        elif mode == "remove":
                            bm.verts[elem_index].select = False
                        elif mode == "toggle":
                            bm.verts[elem_index].select = not bm.verts[
                                elem_index
                            ].select
                    elif elem_type == "e" and elem_index < len(bm.edges):
                        if mode == "add" or mode == "replace":
                            bm.edges[elem_index].select = True
                        elif mode == "remove":
                            bm.edges[elem_index].select = False
                        elif mode == "toggle":
                            bm.edges[elem_index].select = not bm.edges[
                                elem_index
                            ].select
                    elif elem_type == "f" and elem_index < len(bm.faces):
                        if mode == "add" or mode == "replace":
                            bm.faces[elem_index].select = True
                        elif mode == "remove":
                            bm.faces[elem_index].select = False
                        elif mode == "toggle":
                            bm.faces[elem_index].select = not bm.faces[
                                elem_index
                            ].select

                # Update the mesh
                bmesh.update_edit_mesh(me)

        # Handle armature selection
        elif (
            domain.lower() == "armature" or domain.lower() == "rig"
        ) and bpy.context.mode == "EDIT_ARMATURE":
            armature = bpy.context.active_object.data

            # If mode is 'replace', deselect all bones first
            if mode == "replace":
                for bone in armature.edit_bones:
                    bone.select = False
                    bone.select_head = False
                    bone.select_tail = False

            # Select the specified bones
            for bone_id in ids:
                parts = bone_id.split("_")
                if len(parts) < 2:
                    continue

                armature_name = parts[0]
                bone_name = "_".join(parts[1:])

                # Only process bones of the active armature
                if armature_name != bpy.context.active_object.name:
                    continue

                # Find and select the bone
                if bone_name in armature.edit_bones:
                    bone = armature.edit_bones[bone_name]
                    if mode == "add" or mode == "replace":
                        bone.select = True
                    elif mode == "remove":
                        bone.select = False
                    elif mode == "toggle":
                        bone.select = not bone.select

        # Get all selected objects after the operation
        selected_ids = []

        # For object selection
        if domain is None or domain.lower() == "object" or domain.lower() == "model":
            for obj in bpy.context.selected_objects:
                obj_id = getattr(obj, "mcp_id", obj.name)
                selected_ids.append(obj_id)

        # For mesh element selection
        elif domain.lower() == "mesh" and bpy.context.mode == "EDIT_MESH":
            import bmesh

            if bpy.context.active_object and bpy.context.active_object.type == "MESH":
                me = bpy.context.active_object.data
                bm = bmesh.from_edit_mesh(me)
                obj_name = bpy.context.active_object.name

                for v in bm.verts:
                    if v.select:
                        selected_ids.append(f"{obj_name}_v{v.index}")

                for e in bm.edges:
                    if e.select:
                        selected_ids.append(f"{obj_name}_e{e.index}")

                for f in bm.faces:
                    if f.select:
                        selected_ids.append(f"{obj_name}_f{f.index}")

        # For armature selection
        elif (
            domain.lower() == "armature" or domain.lower() == "rig"
        ) and bpy.context.mode == "EDIT_ARMATURE":
            if (
                bpy.context.active_object
                and bpy.context.active_object.type == "ARMATURE"
            ):
                armature = bpy.context.active_object.data
                obj_name = bpy.context.active_object.name

                for bone in armature.edit_bones:
                    if bone.select:
                        selected_ids.append(f"{obj_name}_{bone.name}")

        return {"success": True, "selectedIds": selected_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


# === NEWLY GENERATED ===
