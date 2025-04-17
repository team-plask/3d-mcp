# Generated blender implementation for monitor atomic tools
# This file is generated - DO NOT EDIT DIRECTLY

import bpy
from typing import Dict, Any, Optional, List, Union, Tuple, Literal, Callable
import mathutils
import os
import time
from pathlib import Path
import traceback
import subprocess
import sys

# try:
#     from PIL import Image
# except:
#     import sysconfig
#     import platform

#     python_exe = sys.executable  # This works on macOS/Linux/Windows

#     try:
#         subprocess.call([python_exe, "-m", "ensurepip"])
#         subprocess.call(
#             [python_exe, "-m", "pip", "install", "--upgrade", "pip"])
#         subprocess.call([python_exe, "-m", "pip", "install", "pillow"])
#     except Exception as install_error:
#         print(f"Failed to install Pillow: {install_error}")


def getSceneGraph() -> Dict[str, Any]:
    """
    Get the scene graph of the current scene.

    Args:
    No parameters

    Returns:
    success (bool): Operation success status
    scene_graph (Dict[str, Any] with keys {"name": str, "children": List[Dict[str, Any] with keys {"id": str, "name": str, "metadata": Dict[str, Any], "position": List[float], "rotation": List[float], "scale": List[float], "parentId": str, "childIds": List[str]}]}): Scene graph of the current scene
    """
    tool_name = "getSceneGraph"  # Define tool name for logging
    params = {}  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    try:

        def build_scene_graph(obj):
            return {
                "id": obj.name,
                "name": obj.name,
                "metadata": {
                    "type": obj.type,
                    "visible": obj.visible_get(),
                },
                "position": list(obj.location),
                "rotation": list(obj.rotation_euler),
                "scale": list(obj.scale),
                "parentId": obj.parent.name if obj.parent else None,
                "childIds": [child.name for child in obj.children],
            }

        scene_graph = {
            "name": bpy.context.scene.name,
            "children": [build_scene_graph(obj) for obj in bpy.context.scene.objects],
        }

        return {
            "success": True,
            "scene_graph": scene_graph,
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}


# === NEWLY GENERATED ===


def getCameraView(
    shading_mode: Optional[str] = None,
    name_visibility_predicate: Optional[str] = None,
    auto_adjust_camera: Optional[bool] = None,
    export_width: int = 960,
    export_height: int = 540,
    perspective: Optional[Union[str, Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Get a customizable view of the 3D scene from any camera angle.

    Args:
    shading_mode (str): Rendering style for the viewport (WIREFRAME: line rendering, SOLID: basic shading, MATERIAL: with materials, RENDERED: fully rendered)
    name_visibility_predicate (str): Python lambda function that takes an object as input and returns display settings (e.g., 'lambda obj: {"show_name": obj.type == "MESH"}')
    auto_adjust_camera (bool): When true, automatically positions the camera to frame all scene objects
    export_width (int): Width of the exported image in pixels
    export_height (int): Height of the exported image in pixels
    perspective (str or dict): Predefined view angle (TOP/FRONT/RIGHT/PERSP) or custom camera configuration

    Returns:
    success (bool): Operation success status
    image_path (List[str]): File paths to the generated image
    """
    tool_name = "getCameraView"  # Define tool name for logging
    params = {
        "shading_mode": shading_mode,
        "name_visibility_predicate": name_visibility_predicate,
        "auto_adjust_camera": auto_adjust_camera,
        "export_width": export_width,
        "export_height": export_height,
        "perspective": perspective,
    }  # Create params dict for logging
    print(f"Executing {tool_name} in Blender with params: {params}")

    def create_view_screenshots(
        base_filepath=None,
        shading_mode="WIREFRAME",
        auto_adjust_camera=True,
        export_width=960,
        export_height=540,
        name_visibility_predicate=None,
        perspective="FRONT",
    ):
        """
        Create a screenshot from the specified perspective view.
        The screenshot will be taken in fullscreen mode with consistent size.

        Args:
            base_filepath (str, optional): Base path for saving the screenshot.
            shading_mode (str, optional): The shading mode to use for the viewport.
            auto_adjust_camera (bool, optional): Whether to automatically adjust the camera for better framing.
            export_width (int, optional): Width of the exported image in pixels.
            export_height (int, optional): Height of the exported image in pixels.
            name_visibility_predicate (callable, optional): Function that takes an object as input and returns display settings.
            perspective (str or dict, optional): Specific view perspective or custom camera parameters.
        """
        # Default filepath
        if not base_filepath:
            home = Path.home()
            base_filepath = home / "Downloads" / "blender_view"
        else:
            base_filepath = Path(base_filepath)

        # Default name visibility predicate
        if name_visibility_predicate is None:
            # Default behavior: don't show any names
            def name_visibility_predicate(obj):
                return {"show_name": False}

        # Store original state
        original_state = store_original_state()

        try:
            # Apply name visibility settings based on predicate
            apply_name_visibility(name_visibility_predicate)

            # Create temporary screen and configure 3D view
            temp_screen_name = "Temp_View_Layout"
            setup_temp_screen(temp_screen_name)

            # Set render resolution
            bpy.context.scene.render.resolution_x = export_width
            bpy.context.scene.render.resolution_y = export_height
            bpy.context.scene.render.resolution_percentage = 10

            # Take screenshots
            image_paths = take_view_screenshots(
                base_filepath,
                temp_screen_name,
                shading_mode,
                auto_adjust_camera,
                perspective,
            )
            return image_paths

        except Exception as ex:
            print("=== EXCEPTION OCCURRED ===")
            traceback.print_exc()
            return []

        finally:
            # Restore original state
            restore_original_state(original_state)

    def store_original_state() -> Dict[str, Any]:
        """Store the original state of the Blender scene for later restoration."""
        original_state = {
            "object_settings": {},
            "mode": bpy.context.mode if hasattr(bpy.context, "mode") else "OBJECT",
        }

        # Safely get screen name
        if hasattr(bpy.context, "screen") and bpy.context.screen is not None:
            original_state["screen_name"] = bpy.context.screen.name
        else:
            # Get the first window's screen as a fallback
            if len(bpy.data.screens) > 0:
                original_state["screen_name"] = bpy.data.screens[0].name
            else:
                original_state["screen_name"] = None

        # Safely get window
        if hasattr(bpy.context, "window") and bpy.context.window is not None:
            original_state["window"] = bpy.context.window
        else:
            if (
                hasattr(bpy.context, "window_manager")
                and len(bpy.context.window_manager.windows) > 0
            ):
                original_state["window"] = bpy.context.window_manager.windows[0]
            else:
                original_state["window"] = None

        # Store object display settings
        for obj in bpy.context.scene.objects:
            obj_settings = {"show_name": obj.show_name}

            # Store armature-specific settings
            if obj.type == "ARMATURE":
                obj_settings.update(
                    {
                        "show_names": obj.data.show_names,
                        "display_type": obj.data.display_type,
                    }
                )

            original_state["object_settings"][obj.name] = obj_settings

        return original_state

    def restore_original_state(original_state: Dict[str, Any]):
        """Restore the original state of the Blender scene."""
        # Ensure we're in object mode when restoring settings
        if bpy.context.mode != "OBJECT":
            bpy.ops.object.mode_set(mode="OBJECT")

        # Restore object settings
        for obj_name, settings in original_state["object_settings"].items():
            obj = bpy.data.objects.get(obj_name)
            if obj:
                obj.show_name = settings["show_name"]

                # Restore armature-specific settings
                if obj.type == "ARMATURE" and "show_names" in settings:
                    obj.data.show_names = settings["show_names"]
                    obj.data.display_type = settings["display_type"]

        # Restore original screen
        try:
            # Get a valid window to use for screen switching
            window = original_state.get("window")
            if window is None or not hasattr(bpy.context, "window"):
                if (
                    hasattr(bpy.context, "window_manager")
                    and len(bpy.context.window_manager.windows) > 0
                ):
                    window = bpy.context.window_manager.windows[0]
                else:
                    print("No valid window found to restore screen")
                    return

            # Switch back to the original screen if possible
            screen_name = original_state.get("screen_name")
            if screen_name and screen_name in bpy.data.screens:
                window.screen = bpy.data.screens[screen_name]

            # Delete the temporary screen
            if "Temp_View_Layout" in bpy.data.screens:
                try:
                    window.screen = bpy.data.screens["Temp_View_Layout"]
                    bpy.ops.screen.delete()
                except Exception as e:
                    print(f"Could not delete temporary screen: {e}")
                    print("You may need to delete it manually.")

            print("Original layout restored")
        except Exception as e:
            print(f"Error restoring original layout: {e}")
            print("You may need to manually restore your desired layout")

    def apply_name_visibility(predicate: Callable):
        """Apply name visibility settings based on the predicate function."""
        for obj in bpy.context.scene.objects:
            # Get visibility settings from predicate
            settings = predicate(obj)

            # Apply basic object name visibility
            if "show_name" in settings:
                obj.show_name = settings["show_name"]

            # Apply armature-specific settings
            if obj.type == "ARMATURE":
                # Show bone names
                if "show_bones" in settings and settings["show_bones"]:
                    obj.data.show_names = True
                    obj.data.display_type = "STICK"  # Better for seeing bone names

                    # Select and activate the armature for better display
                    bpy.ops.object.select_all(action="DESELECT")
                    obj.select_set(True)
                    bpy.context.view_layer.objects.active = obj

                    # Toggle pose mode to ensure bone visibility
                    bpy.ops.object.mode_set(mode="POSE")
                    bpy.ops.object.mode_set(mode="OBJECT")
                elif "show_bones" in settings and not settings["show_bones"]:
                    obj.data.show_names = False

    def setup_temp_screen(temp_screen_name: str) -> None:
        """Set up a temporary screen for taking screenshots."""
        original_window = bpy.context.window

        # Delete existing temp screen if it exists
        for screen in bpy.data.screens:
            if screen.name == temp_screen_name:
                context_override = {"window": original_window}
                try:
                    with bpy.context.temp_override(**context_override):
                        bpy.context.window.screen = screen
                        bpy.ops.screen.delete()
                except (AttributeError, TypeError):
                    bpy.context.window.screen = screen
                    bpy.ops.screen.delete(context_override)

        # Create new screen
        bpy.ops.screen.new()
        temp_screen = bpy.context.screen
        temp_screen.name = temp_screen_name

        # Find or create 3D view area
        main_3d_view = None
        for area in temp_screen.areas:
            if area.type == "VIEW_3D":
                main_3d_view = area
                break

        if not main_3d_view:
            largest_area = max(temp_screen.areas,
                               key=lambda a: a.width * a.height)
            largest_area.type = "VIEW_3D"
            main_3d_view = largest_area

    def calculate_scene_bounds() -> Tuple[mathutils.Vector, mathutils.Vector]:
        """Calculate bounds of all visible objects for auto-fit."""
        min_co = mathutils.Vector((float("inf"), float("inf"), float("inf")))
        max_co = mathutils.Vector(
            (float("-inf"), float("-inf"), float("-inf")))

        has_objects = False

        for obj in bpy.context.view_layer.objects:
            if obj.visible_get() and obj.type in {
                "MESH",
                "CURVE",
                "SURFACE",
                "META",
                "FONT",
                "ARMATURE",
                "LATTICE",
            }:
                has_objects = True

                # Get world matrix
                matrix_world = obj.matrix_world

                if obj.type == "MESH" and len(obj.data.vertices) > 0:
                    for vertex in obj.data.vertices:
                        world_co = matrix_world @ vertex.co
                        min_co.x = min(min_co.x, world_co.x)
                        min_co.y = min(min_co.y, world_co.y)
                        min_co.z = min(min_co.z, world_co.z)
                        max_co.x = max(max_co.x, world_co.x)
                        max_co.y = max(max_co.y, world_co.y)
                        max_co.z = max(max_co.z, world_co.z)
                elif obj.type == "ARMATURE":
                    # For armatures, include all bones
                    for bone in obj.data.bones:
                        head_world = matrix_world @ bone.head_local
                        tail_world = matrix_world @ bone.tail_local

                        # Check head and tail positions
                        for pos in [head_world, tail_world]:
                            min_co.x = min(min_co.x, pos.x)
                            min_co.y = min(min_co.y, pos.y)
                            min_co.z = min(min_co.z, pos.z)
                            max_co.x = max(max_co.x, pos.x)
                            max_co.y = max(max_co.y, pos.y)
                            max_co.z = max(max_co.z, pos.z)
                else:
                    # For non-mesh objects, use bounding box
                    bbox_corners = [
                        matrix_world @ mathutils.Vector(corner)
                        for corner in obj.bound_box
                    ]
                    for corner in bbox_corners:
                        min_co.x = min(min_co.x, corner.x)
                        min_co.y = min(min_co.y, corner.y)
                        min_co.z = min(min_co.z, corner.z)
                        max_co.x = max(max_co.x, corner.x)
                        max_co.y = max(max_co.y, corner.y)
                        max_co.z = max(max_co.z, corner.z)

        if not has_objects:
            # Default values if no objects are found
            min_co = mathutils.Vector((-5.0, -5.0, -5.0))
            max_co = mathutils.Vector((5.0, 5.0, 5.0))

        # Calculate center and dimensions
        center = (min_co + max_co) / 2
        dimensions = max_co - min_co

        # Ensure minimum size to avoid empty/tiny bounds
        min_size = 1.0
        for i in range(3):
            if dimensions[i] < min_size:
                dimensions[i] = min_size

        return center, dimensions

    def configure_3d_view(area, shading_mode: str, show_names: bool = False) -> None:
        """Configure a 3D view with the specified settings."""
        valid_shading_modes = ["WIREFRAME", "SOLID", "MATERIAL", "RENDERED"]
        if shading_mode not in valid_shading_modes:
            raise ValueError(
                f"Invalid shading mode: {shading_mode}. Must be one of {valid_shading_modes}."
            )

        for space in area.spaces:
            if space.type == "VIEW_3D":
                # Set shading mode
                space.shading.type = shading_mode

                # Settings for better name display
                if show_names:
                    space.overlay.show_overlays = True
                    space.overlay.show_text = True

                    if hasattr(space.overlay, "show_extras"):
                        space.overlay.show_extras = True

                    if hasattr(space.overlay, "show_relationship_lines"):
                        space.overlay.show_relationship_lines = True

                    if hasattr(space.overlay, "show_bones"):
                        space.overlay.show_bones = True

                    if hasattr(space.overlay, "show_bone_names"):
                        space.overlay.show_bone_names = True

    def take_view_screenshots(
        base_filepath: Union[str, Path],
        temp_screen_name: str,
        shading_mode: str,
        auto_adjust_camera: bool,
        perspective: Union[str, Dict[str, Any]],
    ) -> List[str]:
        """Take a screenshot based on the specified perspective."""
        original_window = bpy.context.window

        # Find the 3D view area
        main_3d_view = None
        for area in bpy.context.screen.areas:
            if area.type == "VIEW_3D":
                main_3d_view = area
                configure_3d_view(area, shading_mode, show_names=True)
                break

        if not main_3d_view:
            raise ValueError("No 3D view area found.")

        # Maximize the 3D view
        with bpy.context.temp_override(window=original_window, area=main_3d_view):
            bpy.ops.screen.screen_full_area()

            # Calculate scene bounds
            scene_center, scene_dimensions = calculate_scene_bounds()
            max_dimension = max(
                scene_dimensions.x, scene_dimensions.y, scene_dimensions.z
            )

            # Define standard view configurations
            view_configs = {
                "TOP": {
                    "perspective": "ORTHO",
                    # Quaternion for top view
                    "rotation": (1.0, 0.0, 0.0, 0.0),
                    "dimension_func": lambda d: max(d.x, d.y),
                    "filename": f"{base_filepath}_top.png",
                },
                "FRONT": {
                    "perspective": "ORTHO",
                    "rotation": (
                        0.7071068,
                        0.7071068,
                        0.0,
                        0.0,
                    ),  # Quaternion for front view
                    "dimension_func": lambda d: max(d.x, d.z),
                    "filename": f"{base_filepath}_front.png",
                },
                "RIGHT": {
                    "perspective": "ORTHO",
                    # Quaternion for right view
                    "rotation": (0.5, 0.5, 0.5, 0.5),
                    "dimension_func": lambda d: max(d.y, d.z),
                    "filename": f"{base_filepath}_right.png",
                },
                "PERSP": {
                    "perspective": "PERSP",
                    # Default perspective
                    "rotation": (0.8205, 0.4306, 0.1714, 0.3312),
                    "dimension_func": lambda d: max(d.x, d.y, d.z),
                    "filename": f"{base_filepath}_persp.png",
                },
            }

            # Determine which views to render
            views_to_render = []

            if isinstance(perspective, dict):
                # Custom perspective configuration
                custom_view = {
                    "perspective": perspective.get("type", "PERSP"),
                    "rotation": tuple(perspective.get("rotation")),
                    "location": perspective.get("location"),
                    "dimension_func": lambda d: max(d.x, d.y, d.z),
                    "filename": f"{base_filepath}_custom.png",
                }
                views_to_render = [("CUSTOM", custom_view)]
            elif perspective == "ALL":
                views_to_render = list(view_configs.items())
            elif perspective in view_configs:
                views_to_render = [(perspective, view_configs[perspective])]
            else:
                raise ValueError(f"Invalid perspective: {perspective}")

            # Take screenshots for each selected view
            image_paths = []

            for view_name, config in views_to_render:
                for area in bpy.context.screen.areas:
                    if area.type == "VIEW_3D":
                        space = area.spaces[0]
                        region_3d = space.region_3d

                        # Configure the view
                        region_3d.view_perspective = config["perspective"]
                        region_3d.view_rotation = mathutils.Quaternion(
                            config["rotation"]
                        )

                        if auto_adjust_camera:
                            # Set view location based on config or use scene_center
                            if "location" in config and config["location"] is not None:
                                region_3d.view_location = mathutils.Vector(
                                    config["location"]
                                )
                            else:
                                region_3d.view_location = scene_center

                            if region_3d.view_perspective == "ORTHO":
                                padding = 1.2
                                region_3d.view_distance = 0
                                region_3d.view_camera_zoom = 0

                                # Use the dimension function from the config
                                if "dimension_func" in config:
                                    ortho_dimension = config["dimension_func"](
                                        scene_dimensions
                                    )
                                    region_3d.view_distance = max_dimension * padding
                                else:
                                    region_3d.view_distance = max_dimension * padding
                            else:
                                padding = 1.5
                                region_3d.view_distance = max_dimension * padding
                                region_3d.view_camera_zoom = 0
                        else:
                            region_3d.view_distance = 7.0
                            region_3d.view_location = (0.0, 0.0, 0.0)

                        # Force redraw and wait for UI update
                        bpy.ops.wm.redraw_timer(
                            type="DRAW_WIN_SWAP", iterations=1)
                        bpy.context.view_layer.update()
                        time.sleep(0.3)

                        # Get the filename from config or generate one
                        view_filename = config.get(
                            "filename", f"{base_filepath}_{view_name.lower()}.png"
                        )
                        print(f"Taking {view_name} view screenshot...")

                        context_override = {
                            "window": original_window, "area": area}

                        try:
                            with bpy.context.temp_override(**context_override):
                                bpy.ops.screen.screenshot_area("EXEC_DEFAULT",
                                                               filepath=str(view_filename), show_multiview=True
                                                               )
                                pass
                        except (AttributeError, TypeError):
                            bpy.ops.screen.screenshot_area(
                                context_override,
                                filepath=str(view_filename),
                                show_multiview=True,
                            )

                        print(f"Screenshot saved to: {view_filename}")

                        # Resize the image to half its size
                        try:
                            # Create resized filename
                            filename_parts = os.path.splitext(view_filename)
                            resized_filename = (
                                f"{filename_parts[0]}_resized{filename_parts[1]}"
                            )

                            # Open and resize the image
                            from PIL import Image

                            img = Image.open(view_filename)
                            width, height = img.size
                            resized_img = img.resize(
                                (width // 2, height // 2), Image.Resampling.LANCZOS
                            )
                            resized_img.save(resized_filename)

                            # Replace the original file with the resized one
                            os.replace(resized_filename, view_filename)

                            print(
                                f"Image resized to half resolution: {view_filename}")
                            image_paths.append(view_filename)
                        except Exception as e:
                            print(f"Error resizing image: {e}")
                            # If resizing fails, use the original image
                            image_paths.append(view_filename)

                        time.sleep(0.2)
                        break

            # Exit fullscreen mode
            try:
                for area in bpy.context.screen.areas:
                    if area.type == "VIEW_3D":
                        context_override = {
                            "window": original_window, "area": area}
                        try:
                            with bpy.context.temp_override(**context_override):
                                bpy.ops.screen.screen_full_area()
                        except (AttributeError, TypeError):
                            bpy.ops.screen.screen_full_area(context_override)
                        break
            except Exception as e:
                print(f"Error exiting fullscreen: {e}")

            return image_paths

    try:
        # Validate enum values for shading_mode
        if shading_mode is not None and shading_mode not in [
            "WIREFRAME",
            "RENDERED",
            "SOLID",
            "MATERIAL",
        ]:
            raise ValueError(
                f"Parameter 'shading_mode' must be one of ['WIREFRAME','RENDERED','SOLID','MATERIAL'], got {shading_mode}"
            )

        # Set default values
        if shading_mode is None:
            shading_mode = "WIREFRAME"
        if auto_adjust_camera is None:
            auto_adjust_camera = True
        if perspective is None:
            perspective = "FRONT"  # Changed default from "ALL" to "FRONT"

        # Use Desktop directory instead of temp directory
        desktop_dir = os.path.expanduser("~/Desktop")
        base_filepath = os.path.join(
            desktop_dir, "blender_camera_view"
        )  # Updated filename base
        print(f"Saving camera view image to: {base_filepath}_*.png")

        # Parse name_visibility_predicate if provided
        visibility_func = None
        if name_visibility_predicate:
            try:
                # Try to evaluate the string as Python code
                visibility_func = eval(
                    f"lambda obj: {name_visibility_predicate}")
            except Exception as e:
                print(
                    f"Error evaluating name_visibility_predicate: {name_visibility_predicate} - {str(e)}"
                )
                print("Using default visibility settings")

        # Create view screenshots
        image_paths = create_view_screenshots(
            base_filepath=base_filepath,
            shading_mode=shading_mode,
            auto_adjust_camera=auto_adjust_camera,
            export_width=export_width,
            export_height=export_height,
            name_visibility_predicate=visibility_func,
            perspective=perspective,
        )

        # Verify files exist
        existing_paths = [path for path in image_paths if os.path.exists(path)]

        if not existing_paths:
            raise FileNotFoundError("No screenshot files were generated")

        return {
            "content": {
                "path": existing_paths,
                "type": "image",
            }
        }

    except Exception as e:
        print(f"Error in {tool_name}: {str(e)}")
        return {"success": False, "error": str(e)}
