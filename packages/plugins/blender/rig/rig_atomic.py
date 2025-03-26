# Generated blender implementation for rig atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

from typing import Dict, Any, Optional, List, Union, Tuple, Literal
import bpy


def createJoints(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Create multiple Joints

    Args:
    items (List[Dict[str, Any] with keys {"name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str], "length": float}]): Array of Joints to create

    Returns:
    success (bool): Operation success status
    ids (List[str]): IDs of the created Joints
    """
    tool_name = "createJoints"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        created_ids = []

        # Get or create armature object
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            # Create new armature
            armature_data = bpy.data.armatures.new("Armature")
            armature = bpy.data.objects.new("Armature", armature_data)
            bpy.context.collection.objects.link(armature)
            print(f"Created new armature object: {armature.name}")
        else:
            print(f"Using existing armature: {armature.name}")

        # Ensure armature is selected and active
        bpy.ops.object.select_all(action="DESELECT")
        armature.select_set(True)
        bpy.context.view_layer.objects.active = armature

        # Enter edit mode to create bones
        bpy.ops.object.mode_set(mode="EDIT")
        print(f"Entered edit mode for armature")

        # Track created bones for parent relationships
        created_bones = {}

        for item in items:
            bone_name = item.get("name", f"bone_{len(created_ids)}")
            print(f"Creating bone: {bone_name}")

            try:
                # Create new bone
                bone = armature.data.edit_bones.new(bone_name)

                if bone is None:
                    print(f"Error: Failed to create bone {bone_name}")
                    continue

                # Set position (head of bone)
                position = item.get("position", [0, 0, 0])
                bone.head = (position[0], position[1], position[2])
                print(f"Set bone head to {bone.head}")

                # Set length and calculate tail position
                if "length" in item and item["length"] > 0:
                    length = item["length"]
                    # Default direction is along local Y axis
                    bone.tail = (bone.head[0], bone.head[1] + length, bone.head[2])
                else:
                    # Default bone length if not specified
                    bone.tail = (bone.head[0], bone.head[1] + 0.1, bone.head[2])

                print(f"Set bone tail to {bone.tail}")

                # Store bone for parent relationships
                created_bones[bone_name] = bone
                created_ids.append(bone_name)

            except Exception as bone_error:
                print(f"Error creating bone {bone_name}: {str(bone_error)}")

        # Set parent relationships after all bones are created
        for item in items:
            if "parentId" not in item or not item["parentId"]:
                continue

            child_name = item.get("name")
            parent_name = item["parentId"]

            if not child_name or not parent_name:
                continue

            child_bone = created_bones.get(child_name) or armature.data.edit_bones.get(
                child_name
            )
            parent_bone = created_bones.get(
                parent_name
            ) or armature.data.edit_bones.get(parent_name)

            if child_bone and parent_bone:
                print(f"Setting parent: {child_name} -> {parent_name}")
                child_bone.parent = parent_bone
            else:
                print(
                    f"Warning: Could not set parent relationship for {child_name} -> {parent_name}"
                )

        # Exit edit mode to apply changes
        bpy.ops.object.mode_set(mode="OBJECT")
        print(f"Exited edit mode, created {len(created_ids)} bones")

        return {"success": True, "ids": created_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def deleteJoints(ids: List[str]) -> Dict[str, Any]:
    """
    Delete multiple Joints

    Args:
    ids (List[str]): Joint identifiers to delete

    Returns:
    success (bool): Operation success status
    """
    tool_name = "deleteJoints"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": False, "error": "No armature found"}

        # Select and make armature active
        bpy.context.view_layer.objects.active = armature
        armature.select_set(True)

        # Enter edit mode to delete bones
        bpy.ops.object.mode_set(mode="EDIT")

        for bone_id in ids:
            bone = armature.data.edit_bones.get(bone_id)
            if bone:
                armature.data.edit_bones.remove(bone)

        # Exit edit mode to apply changes
        bpy.ops.object.mode_set(mode="OBJECT")

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def updateJoints(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Update multiple Joints in a single operation

    Args:
    items (List[Dict[str, Any] with keys {"ids": List[str], "name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str], "length": float}]): Array of Joints to update with their IDs

    Returns:
    success (bool): Operation success status
    """
    tool_name = "updateJoints"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": False, "error": "No armature found"}

        # Select and make armature active
        bpy.context.view_layer.objects.active = armature
        armature.select_set(True)

        # Enter edit mode for bone position updates
        bpy.ops.object.mode_set(mode="EDIT")

        for item in items:
            if "id" not in item:
                continue

            bone_id = item["id"]
            bone = armature.data.edit_bones.get(bone_id)

            if not bone:
                continue

            # Update name
            if "name" in item:
                bone.name = item["name"]

            # Update position
            if "position" in item:
                # Store the tail-head vector to maintain bone orientation
                tail_vec = (
                    bone.tail[0] - bone.head[0],
                    bone.tail[1] - bone.head[1],
                    bone.tail[2] - bone.head[2],
                )

                # Update head position
                bone.head = tuple(item["position"])

                # Update tail to maintain original offset
                bone.tail = (
                    bone.head[0] + tail_vec[0],
                    bone.head[1] + tail_vec[1],
                    bone.head[2] + tail_vec[2],
                )

            # Update length
            if "length" in item:
                direction = (
                    bone.tail[0] - bone.head[0],
                    bone.tail[1] - bone.head[1],
                    bone.tail[2] - bone.head[2],
                )

                # Normalize the direction vector
                magnitude = (
                    direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2
                ) ** 0.5
                if magnitude > 0:
                    norm_direction = (
                        direction[0] / magnitude,
                        direction[1] / magnitude,
                        direction[2] / magnitude,
                    )

                    # Set new tail based on normalized direction and new length
                    bone.tail = (
                        bone.head[0] + norm_direction[0] * item["length"],
                        bone.head[1] + norm_direction[1] * item["length"],
                        bone.head[2] + norm_direction[2] * item["length"],
                    )

            # Update parent relationship
            if "parentId" in item:
                parent_bone = armature.data.edit_bones.get(item["parentId"])
                if parent_bone:
                    bone.parent = parent_bone
                else:
                    bone.parent = None

        # Exit edit mode to apply changes
        bpy.ops.object.mode_set(mode="OBJECT")

        # Apply rotation and scale if needed (in object mode)
        if any("rotation" in item or "scale" in item for item in items):
            bpy.ops.object.mode_set(mode="POSE")

            for item in items:
                if "id" not in item:
                    continue

                bone_id = item["id"]
                pose_bone = armature.pose.bones.get(bone_id)

                if not pose_bone:
                    continue

                # Update rotation
                if "rotation" in item:
                    pose_bone.rotation_mode = "XYZ"  # Set rotation mode to Euler
                    rot = item["rotation"]
                    pose_bone.rotation_euler = (rot[0], rot[1], rot[2])

                # Update scale
                if "scale" in item:
                    scale = item["scale"]
                    pose_bone.scale = (scale[0], scale[1], scale[2])

            bpy.ops.object.mode_set(mode="OBJECT")

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def listJoints(
    parentId: Optional[str] = None,
    filters: Optional[Dict[str, Any]] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
) -> Dict[str, Any]:
    """
    List all Joints

    Args:
    parentId (str): Optional parent ID to filter by
    filters (Dict[str, Any]): Optional filters to apply
    limit (int): Maximum number of results
    offset (int): Starting offset for pagination

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str], "length": float}]): Array of Joints objects
    totalCount (int): Total count for pagination
    """
    tool_name = "listJoints"  # Define tool name for logging
    params = {
        "parentId": parentId,
        "filters": filters,
        "limit": limit,
        "offset": offset,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": True, "items": [], "totalCount": 0}

        # Get all bones from the armature
        all_bones = armature.data.bones

        # Filter by parent if specified
        filtered_bones = []
        for bone in all_bones:
            if parentId is not None:
                if bone.parent and bone.parent.name == parentId:
                    filtered_bones.append(bone)
            else:
                filtered_bones.append(bone)

        # Apply additional filters if specified
        if filters:
            # Example: filter by name
            if "name" in filters:
                filtered_bones = [
                    b for b in filtered_bones if filters["name"] in b.name
                ]

        # Total count before pagination
        total_count = len(filtered_bones)

        # Apply pagination
        if offset is not None:
            filtered_bones = filtered_bones[offset:]

        if limit is not None:
            filtered_bones = filtered_bones[:limit]

        # Format the results
        items = []
        for bone in filtered_bones:
            # Get pose bone for rotation and scale
            pose_bone = armature.pose.bones.get(bone.name)

            item = {
                "id": bone.name,
                "name": bone.name,
                "metadata": {},  # No metadata in default Blender bones
                "position": list(bone.head_local),
                "rotation": list(pose_bone.rotation_euler) if pose_bone else [0, 0, 0],
                "scale": list(pose_bone.scale) if pose_bone else [1, 1, 1],
                "parentId": bone.parent.name if bone.parent else None,
                "childIds": [child.name for child in bone.children],
                "length": bone.length,
            }
            items.append(item)

        return {"success": True, "items": items, "totalCount": total_count}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def listConstraints(
    parentId: Optional[str] = None,
    filters: Optional[Dict[str, Any]] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
) -> Dict[str, Any]:
    """
    List all Constraints

    Args:
    parentId (str): Optional parent ID to filter by
    filters (Dict[str, Any]): Optional filters to apply
    limit (int): Maximum number of results
    offset (int): Starting offset for pagination

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "type": Literal["point", "aim", "orientation", "parent", "pole", "ik", "spring", "path", "scaleTo", "lookAt"], "sourceId": str, "targetId": str, "influence": float, "maintainOffset": bool, "skipRotation": List[Literal["x", "y", "z"]], "skipTranslation": List[Literal["x", "y", "z"]], "skipScale": List[Literal["x", "y", "z"]], "space": Literal["world", "local", "custom"], "customSpaceId": str, "active": bool}]): Array of Constraints objects
    totalCount (int): Total count for pagination
    """
    tool_name = "listConstraints"  # Define tool name for logging
    params = {
        "parentId": parentId,
        "filters": filters,
        "limit": limit,
        "offset": offset,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": True, "items": [], "totalCount": 0}

        # Get all pose bones to access constraints
        pose_bones = armature.pose.bones

        all_constraints = []

        # Collect constraints from each pose bone
        for pose_bone in pose_bones:
            # Skip if we're filtering by parent and this is not the parent
            if parentId is not None and pose_bone.name != parentId:
                continue

            for constraint in pose_bone.constraints:
                # Build basic constraint info
                constraint_info = {
                    "id": f"{pose_bone.name}_{constraint.name}",  # Create a unique ID
                    "name": constraint.name,
                    "sourceId": pose_bone.name,
                    "metadata": {},
                    "influence": constraint.influence,
                    "active": constraint.enabled,
                }

                # Map constraint types to our standard types
                if constraint.type == "COPY_LOCATION":
                    constraint_info["type"] = "point"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    constraint_info["skipTranslation"] = [
                        "x" if not constraint.use_x else None,
                        "y" if not constraint.use_y else None,
                        "z" if not constraint.use_z else None,
                    ]
                    constraint_info["skipTranslation"] = [
                        x for x in constraint_info["skipTranslation"] if x is not None
                    ]
                    constraint_info["space"] = (
                        "world" if constraint.target_space == "WORLD" else "local"
                    )

                elif constraint.type == "COPY_ROTATION":
                    constraint_info["type"] = "orientation"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    constraint_info["skipRotation"] = [
                        "x" if not constraint.use_x else None,
                        "y" if not constraint.use_y else None,
                        "z" if not constraint.use_z else None,
                    ]
                    constraint_info["skipRotation"] = [
                        x for x in constraint_info["skipRotation"] if x is not None
                    ]
                    constraint_info["space"] = (
                        "world" if constraint.target_space == "WORLD" else "local"
                    )

                elif constraint.type == "COPY_SCALE":
                    constraint_info["type"] = "scaleTo"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    constraint_info["skipScale"] = [
                        "x" if not constraint.use_x else None,
                        "y" if not constraint.use_y else None,
                        "z" if not constraint.use_z else None,
                    ]
                    constraint_info["skipScale"] = [
                        x for x in constraint_info["skipScale"] if x is not None
                    ]
                    constraint_info["space"] = (
                        "world" if constraint.target_space == "WORLD" else "local"
                    )

                elif constraint.type == "TRACK_TO":
                    constraint_info["type"] = "lookAt"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    constraint_info["space"] = (
                        "world" if constraint.target_space == "WORLD" else "local"
                    )

                elif constraint.type == "IK":
                    constraint_info["type"] = "ik"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    # IK specific properties if needed

                elif constraint.type == "DAMPED_TRACK":
                    constraint_info["type"] = "aim"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    constraint_info["space"] = (
                        "world" if constraint.target_space == "WORLD" else "local"
                    )

                elif constraint.type == "CHILD_OF":
                    constraint_info["type"] = "parent"
                    constraint_info["targetId"] = (
                        constraint.target.name if constraint.target else None
                    )
                    constraint_info["maintainOffset"] = (
                        True  # Child Of in Blender maintains offset by default
                    )

                else:
                    # For unsupported constraint types, use a generic mapping
                    constraint_info["type"] = "point"  # Default type
                    constraint_info["targetId"] = (
                        constraint.target.name
                        if hasattr(constraint, "target") and constraint.target
                        else None
                    )

                # Add standard properties that all constraints should have
                constraint_info["skipRotation"] = constraint_info.get(
                    "skipRotation", []
                )
                constraint_info["skipTranslation"] = constraint_info.get(
                    "skipTranslation", []
                )
                constraint_info["skipScale"] = constraint_info.get("skipScale", [])
                constraint_info["maintainOffset"] = constraint_info.get(
                    "maintainOffset", False
                )
                constraint_info["customSpaceId"] = (
                    None  # Blender does not have this concept in the same way
                )

                all_constraints.append(constraint_info)

        # Apply additional filters if specified
        if filters:
            filtered_constraints = []
            for constraint in all_constraints:
                include = True
                for key, value in filters.items():
                    if key in constraint and constraint[key] != value:
                        include = False
                        break
                if include:
                    filtered_constraints.append(constraint)
            all_constraints = filtered_constraints

        # Total count before pagination
        total_count = len(all_constraints)

        # Apply pagination
        if offset is not None:
            all_constraints = all_constraints[offset:]

        if limit is not None:
            all_constraints = all_constraints[:limit]

        return {"success": True, "items": all_constraints, "totalCount": total_count}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def updateConstraints(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Update multiple Constraints in a single operation

    Args:
    items (List[Dict[str, Any] with keys {"ids": List[str], "name": str, "metadata": Dict[str, Any], "type": Literal["point", "aim", "orientation", "parent", "pole", "ik", "spring", "path", "scaleTo", "lookAt"], "sourceId": str, "targetId": str, "influence": float, "maintainOffset": bool, "skipRotation": List[Literal["x", "y", "z"]], "skipTranslation": List[Literal["x", "y", "z"]], "skipScale": List[Literal["x", "y", "z"]], "space": Literal["world", "local", "custom"], "customSpaceId": str, "active": bool}]): Array of Constraints to update with their IDs

    Returns:
    success (bool): Operation success status
    """
    tool_name = "updateConstraints"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": False, "error": "No armature found"}

        # The constraint ID format is assumed to be {bone_name}_{constraint_name}
        for item in items:
            if "id" not in item:
                continue

            # Parse the ID to get bone name and constraint name
            parts = item["id"].split("_", 1)
            if len(parts) != 2:
                continue

            bone_name, constraint_name = parts

            # Get the pose bone and constraint
            pose_bone = armature.pose.bones.get(bone_name)
            if not pose_bone:
                continue

            constraint = None
            for c in pose_bone.constraints:
                if c.name == constraint_name:
                    constraint = c
                    break

            if not constraint:
                continue

            # Update constraint properties
            if "name" in item:
                constraint.name = item["name"]

            if "influence" in item:
                constraint.influence = item["influence"]

            if "active" in item:
                constraint.enabled = item["active"]

            if "targetId" in item:
                target_obj = None
                # Target could be a bone or an object
                if constraint.target and constraint.target.type == "ARMATURE":
                    constraint.subtarget = item["targetId"]  # For bone targets
                else:
                    target_obj = bpy.data.objects.get(item["targetId"])
                    if target_obj:
                        constraint.target = target_obj

            # Handle skip properties based on constraint type
            if constraint.type == "COPY_LOCATION" and "skipTranslation" in item:
                skip_translation = item["skipTranslation"]
                constraint.use_x = "x" not in skip_translation
                constraint.use_y = "y" not in skip_translation
                constraint.use_z = "z" not in skip_translation

            elif constraint.type == "COPY_ROTATION" and "skipRotation" in item:
                skip_rotation = item["skipRotation"]
                constraint.use_x = "x" not in skip_rotation
                constraint.use_y = "y" not in skip_rotation
                constraint.use_z = "z" not in skip_rotation

            elif constraint.type == "COPY_SCALE" and "skipScale" in item:
                skip_scale = item["skipScale"]
                constraint.use_x = "x" not in skip_scale
                constraint.use_y = "y" not in skip_scale
                constraint.use_z = "z" not in skip_scale

            if "space" in item:
                space_value = "WORLD" if item["space"] == "world" else "LOCAL"
                if hasattr(constraint, "target_space"):
                    constraint.target_space = space_value
                if hasattr(constraint, "owner_space"):
                    constraint.owner_space = space_value

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def updateBlendShapes(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Update multiple BlendShapes in a single operation

    Args:
    items (List[Dict[str, Any] with keys {"ids": List[str], "name": str, "metadata": Dict[str, Any], "meshId": str, "weight": float, "deltas": List[Dict[str, Any] with keys {"vertexIndex": int, "positionDelta": List[float], "normalDelta": List[float], "tangentDelta": List[float]}], "combineMethod": Literal["average", "additive"]}]): Array of BlendShapes to update with their IDs

    Returns:
    success (bool): Operation success status
    """
    tool_name = "updateBlendShapes"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        for item in items:
            if "id" not in item:
                continue

            shape_key_id = item["id"]

            # In Blender, shape keys belong to mesh objects
            for obj in bpy.data.objects:
                if obj.type == "MESH" and obj.data.shape_keys:
                    for key_block in obj.data.shape_keys.key_blocks:
                        # Skip the reference key (Basis)
                        if key_block.name == "Basis":
                            continue

                        if key_block.name == shape_key_id:
                            # Update shape key name
                            if "name" in item:
                                key_block.name = item["name"]

                            # Update weight/value
                            if "weight" in item:
                                key_block.value = item["weight"]

                            # Update mesh deltas (vertex positions)
                            if "deltas" in item:
                                # This is more complex in Blender and may require custom code
                                # For now, we'll just indicate that it's not fully implemented
                                print(
                                    f"Warning: Updating shape key deltas not fully implemented"
                                )

                                # Basic approach (incomplete):
                                for delta in item["deltas"]:
                                    if (
                                        "vertexIndex" in delta
                                        and "positionDelta" in delta
                                    ):
                                        idx = delta["vertexIndex"]
                                        pos_delta = delta["positionDelta"]

                                        # This is a simplified approach - would need more work for production
                                        if idx < len(key_block.data):
                                            basis_co = (
                                                obj.data.shape_keys.reference_key.data[
                                                    idx
                                                ].co
                                            )
                                            new_co = (
                                                basis_co[0] + pos_delta[0],
                                                basis_co[1] + pos_delta[1],
                                                basis_co[2] + pos_delta[2],
                                            )
                                            key_block.data[idx].co = new_co

                            break

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getJoints(ids: List[str]) -> Dict[str, Any]:
    """
    Get multiple Joints by IDs

    Args:
    ids (List[str]): Joint identifiers

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str], "length": float}]): Array of Joints objects
    """
    tool_name = "getJoints"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": True, "items": []}

        # Collect requested bones
        items = []
        for bone_id in ids:
            bone = armature.data.bones.get(bone_id)
            if bone:
                pose_bone = armature.pose.bones.get(bone_id)

                item = {
                    "id": bone.name,
                    "name": bone.name,
                    "metadata": {},
                    "position": list(bone.head_local),
                    "rotation": (
                        list(pose_bone.rotation_euler) if pose_bone else [0, 0, 0]
                    ),
                    "scale": list(pose_bone.scale) if pose_bone else [1, 1, 1],
                    "parentId": bone.parent.name if bone.parent else None,
                    "childIds": [child.name for child in bone.children],
                    "length": bone.length,
                }
                items.append(item)

        return {"success": True, "items": items}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def listBlendShapes(
    parentId: Optional[str] = None,
    filters: Optional[Dict[str, Any]] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
) -> Dict[str, Any]:
    """
    List all BlendShapes

    Args:
    parentId (str): Optional parent ID to filter by
    filters (Dict[str, Any]): Optional filters to apply
    limit (int): Maximum number of results
    offset (int): Starting offset for pagination

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "meshId": str, "weight": float, "deltas": List[Dict[str, Any] with keys {"vertexIndex": int, "positionDelta": List[float], "normalDelta": List[float], "tangentDelta": List[float]}], "combineMethod": Literal["average", "additive"]}]): Array of BlendShapes objects
    totalCount (int): Total count for pagination
    """
    tool_name = "listBlendShapes"  # Define tool name for logging
    params = {
        "parentId": parentId,
        "filters": filters,
        "limit": limit,
        "offset": offset,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        all_shape_keys = []

        # Collect shape keys from all mesh objects
        for obj in bpy.data.objects:
            if obj.type == "MESH" and obj.data.shape_keys:
                # If parent ID is specified, only include shape keys from that mesh
                if parentId is not None and obj.name != parentId:
                    continue

                for key_block in obj.data.shape_keys.key_blocks:
                    # Skip the reference key (Basis)
                    if key_block.name == "Basis":
                        continue

                    # Create the shape key entry
                    shape_key_info = {
                        "id": key_block.name,
                        "name": key_block.name,
                        "metadata": {},
                        "meshId": obj.name,
                        "weight": key_block.value,
                        "combineMethod": "additive",  # Blender uses additive blending by default
                    }

                    # Calculating deltas would require comparing to basis shape
                    # This is a complex operation that would need to be customized per-project
                    shape_key_info["deltas"] = []

                    all_shape_keys.append(shape_key_info)

        # Apply additional filters if specified
        if filters:
            filtered_shape_keys = []
            for shape_key in all_shape_keys:
                include = True
                for key, value in filters.items():
                    if key in shape_key and shape_key[key] != value:
                        include = False
                        break
                if include:
                    filtered_shape_keys.append(shape_key)
            all_shape_keys = filtered_shape_keys

        # Total count before pagination
        total_count = len(all_shape_keys)

        # Apply pagination
        if offset is not None:
            all_shape_keys = all_shape_keys[offset:]

        if limit is not None:
            all_shape_keys = all_shape_keys[:limit]

        return {"success": True, "items": all_shape_keys, "totalCount": total_count}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getConstraints(ids: List[str]) -> Dict[str, Any]:
    """
    Get multiple Constraints by IDs

    Args:
    ids (List[str]): Constraint identifiers

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "type": Literal["point", "aim", "orientation", "parent", "pole", "ik", "spring", "path", "scaleTo", "lookAt"], "sourceId": str, "targetId": str, "influence": float, "maintainOffset": bool, "skipRotation": List[Literal["x", "y", "z"]], "skipTranslation": List[Literal["x", "y", "z"]], "skipScale": List[Literal["x", "y", "z"]], "space": Literal["world", "local", "custom"], "customSpaceId": str, "active": bool}]): Array of Constraints objects
    """
    tool_name = "getConstraints"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": True, "items": []}

        # Collect constraints that match the requested IDs
        items = []

        # The constraint ID format is assumed to be {bone_name}_{constraint_name}
        for constraint_id in ids:
            parts = constraint_id.split("_", 1)
            if len(parts) != 2:
                continue

            bone_name, constraint_name = parts

            pose_bone = armature.pose.bones.get(bone_name)
            if not pose_bone:
                continue

            for constraint in pose_bone.constraints:
                if constraint.name == constraint_name:
                    # Build constraint info object
                    constraint_info = {
                        "id": constraint_id,
                        "name": constraint.name,
                        "sourceId": pose_bone.name,
                        "metadata": {},
                        "influence": constraint.influence,
                        "active": constraint.enabled,
                    }

                    # Set type and other properties based on Blender constraint type
                    if constraint.type == "COPY_LOCATION":
                        constraint_info["type"] = "point"
                        constraint_info["targetId"] = (
                            constraint.target.name if constraint.target else None
                        )
                        constraint_info["skipTranslation"] = [
                            "x" if not constraint.use_x else None,
                            "y" if not constraint.use_y else None,
                            "z" if not constraint.use_z else None,
                        ]
                        constraint_info["skipTranslation"] = [
                            x
                            for x in constraint_info["skipTranslation"]
                            if x is not None
                        ]
                        constraint_info["space"] = (
                            "world" if constraint.target_space == "WORLD" else "local"
                        )

                    elif constraint.type == "COPY_ROTATION":
                        constraint_info["type"] = "orientation"
                        constraint_info["targetId"] = (
                            constraint.target.name if constraint.target else None
                        )
                        constraint_info["skipRotation"] = [
                            "x" if not constraint.use_x else None,
                            "y" if not constraint.use_y else None,
                            "z" if not constraint.use_z else None,
                        ]
                        constraint_info["skipRotation"] = [
                            x for x in constraint_info["skipRotation"] if x is not None
                        ]
                        constraint_info["space"] = (
                            "world" if constraint.target_space == "WORLD" else "local"
                        )

                    # Add more constraint type mappings as needed...

                    # Add standard properties that all constraints should have
                    constraint_info["skipRotation"] = constraint_info.get(
                        "skipRotation", []
                    )
                    constraint_info["skipTranslation"] = constraint_info.get(
                        "skipTranslation", []
                    )
                    constraint_info["skipScale"] = constraint_info.get("skipScale", [])
                    constraint_info["maintainOffset"] = constraint_info.get(
                        "maintainOffset", False
                    )
                    constraint_info["customSpaceId"] = None
                    constraint_info["type"] = constraint_info.get(
                        "type", "point"
                    )  # Default type

                    items.append(constraint_info)
                    break

        return {"success": True, "items": items}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def createBlendShapes(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Create multiple BlendShapes

    Args:
    items (List[Dict[str, Any] with keys {"name": str, "metadata": Dict[str, Any], "meshId": str, "weight": float, "deltas": List[Dict[str, Any] with keys {"vertexIndex": int, "positionDelta": List[float], "normalDelta": List[float], "tangentDelta": List[float]}], "combineMethod": Literal["average", "additive"]}]): Array of BlendShapes to create

    Returns:
    success (bool): Operation success status
    ids (List[str]): IDs of the created BlendShapes
    """
    tool_name = "createBlendShapes"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        created_ids = []

        for item in items:
            if "meshId" not in item:
                continue

            mesh_obj = bpy.data.objects.get(item["meshId"])
            if not mesh_obj or mesh_obj.type != "MESH":
                continue

            # Create a shape key if it doesn't exist
            if not mesh_obj.data.shape_keys:
                # Create the basis key
                mesh_obj.shape_key_add(name="Basis")

            # Add the new shape key
            shape_key = mesh_obj.shape_key_add(name=item["name"])
            created_ids.append(shape_key.name)

            # Set the weight/value
            if "weight" in item:
                shape_key.value = item["weight"]

            # Apply deltas if specified
            if "deltas" in item:
                for delta in item["deltas"]:
                    if "vertexIndex" in delta and "positionDelta" in delta:
                        idx = delta["vertexIndex"]
                        pos_delta = delta["positionDelta"]

                        if idx < len(shape_key.data):
                            basis_co = mesh_obj.data.shape_keys.reference_key.data[
                                idx
                            ].co
                            new_co = (
                                basis_co[0] + pos_delta[0],
                                basis_co[1] + pos_delta[1],
                                basis_co[2] + pos_delta[2],
                            )
                            shape_key.data[idx].co = new_co

        return {"success": True, "ids": created_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def deleteBlendShapes(ids: List[str]) -> Dict[str, Any]:
    """
    Delete multiple BlendShapes

    Args:
    ids (List[str]): BlendShape identifiers to delete

    Returns:
    success (bool): Operation success status
    """
    tool_name = "deleteBlendShapes"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        for obj in bpy.data.objects:
            if obj.type == "MESH" and obj.data.shape_keys:
                for key_block in obj.data.shape_keys.key_blocks:
                    if key_block.name in ids:
                        # Cannot delete the Basis shape key
                        if key_block.name == "Basis":
                            continue

                        # Remove the shape key
                        obj.shape_key_remove(key_block)

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def createConstraints(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Create multiple Constraints

    Args:
    items (List[Dict[str, Any] with keys {"name": str, "metadata": Dict[str, Any], "type": Literal["point", "aim", "orientation", "parent", "pole", "ik", "spring", "path", "scaleTo", "lookAt"], "sourceId": str, "targetId": str, "influence": float, "maintainOffset": bool, "skipRotation": List[Literal["x", "y", "z"]], "skipTranslation": List[Literal["x", "y", "z"]], "skipScale": List[Literal["x", "y", "z"]], "space": Literal["world", "local", "custom"], "customSpaceId": str, "active": bool}]): Array of Constraints to create

    Returns:
    success (bool): Operation success status
    ids (List[str]): IDs of the created Constraints
    """
    tool_name = "createConstraints"  # Define tool name for logging
    params = {"items": items}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": False, "error": "No armature found"}

        created_ids = []

        for item in items:
            if "sourceId" not in item or "type" not in item:
                continue

            # Get the pose bone that will receive the constraint
            pose_bone = armature.pose.bones.get(item["sourceId"])
            if not pose_bone:
                continue

            constraint = None
            constraint_name = item.get("name", f"{item['type']}_constraint")

            # Map MCP constraint type to Blender constraint type
            if item["type"] == "point":
                constraint = pose_bone.constraints.new("COPY_LOCATION")
            elif item["type"] == "orientation":
                constraint = pose_bone.constraints.new("COPY_ROTATION")
            elif item["type"] == "parent":
                constraint = pose_bone.constraints.new("CHILD_OF")
            elif item["type"] == "aim":
                constraint = pose_bone.constraints.new("DAMPED_TRACK")
            elif item["type"] == "pole":
                # Pole vector is usually part of IK in Blender
                constraint = pose_bone.constraints.new("IK")
            elif item["type"] == "ik":
                constraint = pose_bone.constraints.new("IK")
            elif item["type"] == "lookAt":
                constraint = pose_bone.constraints.new("TRACK_TO")
            elif item["type"] == "scaleTo":
                constraint = pose_bone.constraints.new("COPY_SCALE")
            else:
                # Default to a location constraint for unknown types
                constraint = pose_bone.constraints.new("COPY_LOCATION")

            if constraint:
                # Set constraint name
                constraint.name = constraint_name

                # Create a unique ID for the constraint
                constraint_id = f"{pose_bone.name}_{constraint.name}"
                created_ids.append(constraint_id)

                # Set target object or bone
                if "targetId" in item:
                    target_found = False

                    # Check if target is a bone in the armature
                    if armature.data.bones.get(item["targetId"]):
                        constraint.target = armature
                        constraint.subtarget = item["targetId"]
                        target_found = True
                    else:
                        # Otherwise, look for an object with that name
                        target_obj = bpy.data.objects.get(item["targetId"])
                        if target_obj:
                            constraint.target = target_obj
                            target_found = True

                # Set influence
                if "influence" in item:
                    constraint.influence = item["influence"]

                # Set whether it's enabled
                if "active" in item:
                    constraint.enabled = item["active"]

                # Set coordinate space
                space_value = (
                    "WORLD" if item.get("space", "world") == "world" else "LOCAL"
                )
                if hasattr(constraint, "target_space"):
                    constraint.target_space = space_value
                if hasattr(constraint, "owner_space"):
                    constraint.owner_space = space_value

                # Handle skip axes for transformations
                if constraint.type in ["COPY_LOCATION", "COPY_ROTATION", "COPY_SCALE"]:
                    skip_property = None
                    use_x = use_y = use_z = True

                    if constraint.type == "COPY_LOCATION" and "skipTranslation" in item:
                        skip_property = item["skipTranslation"]
                    elif constraint.type == "COPY_ROTATION" and "skipRotation" in item:
                        skip_property = item["skipRotation"]
                    elif constraint.type == "COPY_SCALE" and "skipScale" in item:
                        skip_property = item["skipScale"]

                    if skip_property:
                        use_x = "x" not in skip_property
                        use_y = "y" not in skip_property
                        use_z = "z" not in skip_property

                    constraint.use_x = use_x
                    constraint.use_y = use_y
                    constraint.use_z = use_z

                # Set maintain offset (if supported)
                if hasattr(constraint, "use_offset") and "maintainOffset" in item:
                    constraint.use_offset = item["maintainOffset"]

        return {"success": True, "ids": created_ids}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def deleteConstraints(ids: List[str]) -> Dict[str, Any]:
    """
    Delete multiple Constraints

    Args:
    ids (List[str]): Constraint identifiers to delete

    Returns:
    success (bool): Operation success status
    """
    tool_name = "deleteConstraints"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        armature = None
        for obj in bpy.data.objects:
            if obj.type == "ARMATURE":
                armature = obj
                break

        if not armature:
            return {"success": False, "error": "No armature found"}

        # The constraint ID format is assumed to be {bone_name}_{constraint_name}
        for constraint_id in ids:
            parts = constraint_id.split("_", 1)
            if len(parts) != 2:
                continue

            bone_name, constraint_name = parts

            # Get the pose bone and remove the constraint
            pose_bone = armature.pose.bones.get(bone_name)
            if not pose_bone:
                continue

            for constraint in pose_bone.constraints:
                if constraint.name == constraint_name:
                    pose_bone.constraints.remove(constraint)
                    break

        return {"success": True}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


def getBlendShapes(ids: List[str]) -> Dict[str, Any]:
    """
    Get multiple BlendShapes by IDs

    Args:
    ids (List[str]): BlendShape identifiers

    Returns:
    success (bool): Operation success status
    items (List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "meshId": str, "weight": float, "deltas": List[Dict[str, Any] with keys {"vertexIndex": int, "positionDelta": List[float], "normalDelta": List[float], "tangentDelta": List[float]}], "combineMethod": Literal["average", "additive"]}]): Array of BlendShapes objects
    """
    tool_name = "getBlendShapes"  # Define tool name for logging
    params = {"ids": ids}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:
        # No parameters to validate

        # Implement actual blender API calls
        items = []

        # Look for shape keys in all mesh objects
        for obj in bpy.data.objects:
            if obj.type == "MESH" and obj.data.shape_keys:
                for key_block in obj.data.shape_keys.key_blocks:
                    if key_block.name in ids:
                        # Create the shape key entry
                        shape_key_info = {
                            "id": key_block.name,
                            "name": key_block.name,
                            "metadata": {},
                            "meshId": obj.name,
                            "weight": key_block.value,
                            "combineMethod": "additive",  # Blender uses additive blending by default
                        }

                        # Calculating deltas would require comparing to basis shape
                        # This is a complex operation that would need to be customized per-project
                        shape_key_info["deltas"] = []

                        items.append(shape_key_info)

        return {"success": True, "items": items}

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


# === NEWLY GENERATED ===
