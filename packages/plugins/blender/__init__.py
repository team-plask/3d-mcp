# Generated blender MCP server
# This file is generated - DO NOT EDIT DIRECTLY

bl_info = {
    "name": "3D MCP",
    "author": "Plask",
    "version": (0, 3),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar > 3dMCP",
    "description": "Connect 3D Tools to LLM via MCP",
    "category": "Interface",
}

import bpy

import json
import inspect
import socket
import json
import sys
import os
import argparse
from typing import Dict, Any, Callable
import threading
import traceback

import time
import uuid
import queue

from .monitor import monitor_atomic
from .model import model_atomic
from .core import core_atomic
from .animation import animation_atomic
from .rig import rig_atomic


# Global variables - this will store tools
tools = {}

# Task queue for main thread execution
task_queue = queue.Queue()
results_store = {}  # Store task results by ID


def execute_on_main_thread(tool_name, params):
    """Schedule a tool execution on the main thread and wait for result"""
    task_id = str(uuid.uuid4())
    task = {"id": task_id, "tool": tool_name, "params": params, "completed": False}
    results_store[task_id] = {
        "completed": False,
        "result": None,
    }  # Initialize with proper structure
    task_queue.put(task)

    # Register timer if not already registered
    if not bpy.app.timers.is_registered(process_task_queue):
        bpy.app.timers.register(process_task_queue)

    # Wait for task completion
    try:
        while not results_store.get(task_id, {}).get("completed", False):
            time.sleep(0.1)
    except Exception as e:
        print(f"Error waiting for task completion: {str(e)}")
        return {"success": False, "error": f"Task execution error: {str(e)}"}

    # Get result and clean up
    result = results_store.get(task_id, {}).get(
        "result", {"success": False, "error": "No result found"}
    )
    del results_store[task_id]  # Clean up
    return result


def process_task_queue():
    """Process queued tasks on the main thread"""
    if task_queue.empty():
        return 0.1  # Check again in 0.1 seconds

    task = task_queue.get()
    tool_name = task["tool"]
    params = task["params"]
    task_id = task["id"]

    try:
        if tool_name in tools:
            result = tools[tool_name](**params)
        else:
            result = {"success": False, "error": f"Unknown tool: {tool_name}"}
    except Exception as e:
        print(f"Error executing {tool_name}: {str(e)}")
        traceback.print_exc()
        result = {"success": False, "error": str(e)}

    # Store result
    results_store[task_id] = {"completed": True, "result": result}

    return 0.1  # Check again in 0.1 seconds


def register_tool(name: str, func: Callable):
    """Register a tool function with the server"""
    print(f"Registering tool: {name}")
    tools[name] = func


def register_all_tools():
    """Register all available tool functions"""
    print("Registering all tools...")

    # Register any other tools as needed


def server_loop():
    """Main server loop running in a separate thread"""
    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((bpy.context.scene.mcp_host, bpy.context.scene.mcp_port))
        server_socket.listen(5)

        # Store socket in bpy.types for access from other functions
        bpy.types.mcp_server_socket = server_socket

        print(
            f"MCP Server started on {bpy.context.scene.mcp_host}:{bpy.context.scene.mcp_port}"
        )

        while bpy.context.scene.mcp_server_running:
            try:
                client_socket, address = server_socket.accept()
                print(f"Connection from {address}")
                handle_client(client_socket)
            except socket.timeout:
                continue
            except Exception as e:
                if bpy.context.scene.mcp_server_running:
                    print(f"Error accepting connection: {str(e)}")
    except Exception as e:
        print(f"Server error: {str(e)}")
    finally:
        if hasattr(bpy.types, "mcp_server_socket"):
            bpy.types.mcp_server_socket.close()
            del bpy.types.mcp_server_socket
            print("Server socket closed")


def handle_client(client_socket):
    """Handle client connection and route requests to appropriate tool"""
    try:
        data = client_socket.recv(4096)
        if not data:
            return
        print(f"Received data: {data}")

        # Check if this is an HTTP request
        request_str = data.decode("utf-8", errors="ignore")

        if request_str.startswith("POST") or request_str.startswith("GET"):
            print("Received HTTP request, extracting JSON body")
            # Extract the JSON body from HTTP request (after the \r\n\r\n)
            body_start = request_str.find("\r\n\r\n") + 4
            if body_start > 4:  # Found the body separator
                json_body = request_str[body_start:]
                print(f"Extracted JSON body: {json_body}")
                request = json.loads(json_body)
            else:
                raise ValueError("Invalid HTTP request format, no body found")
        else:
            # Regular JSON request
            request = json.loads(request_str)

        print(f"Parsed request: {request}")
        tool_name = request.get("tool")
        params = request.get("params", {})

        # Execute on main thread and get result
        result = execute_on_main_thread(tool_name, params)
        response_data = json.dumps(result).encode("utf-8")

        # Check if we need to send HTTP response
        if request_str.startswith("POST") or request_str.startswith("GET"):
            response = (
                b"HTTP/1.1 200 OK\r\n"
                + b"Content-Type: application/json\r\n"
                + b"Access-Control-Allow-Origin: *\r\n"
                + b"Content-Length: "
                + str(len(response_data)).encode()
                + b"\r\n"
                + b"\r\n"
                + response_data
            )
        else:
            response = response_data

        client_socket.send(response)

    except Exception as e:
        print(f"Error handling client request: {str(e)}")
        traceback.print_exc()
        error_msg = {"success": False, "error": str(e)}
        response_data = json.dumps(error_msg).encode("utf-8")

        # Try to determine if this was an HTTP request
        try:
            request_str = data.decode("utf-8", errors="ignore")
            if request_str.startswith("POST") or request_str.startswith("GET"):
                response = (
                    b"HTTP/1.1 500 Internal Server Error\r\n"
                    + b"Content-Type: application/json\r\n"
                    + b"Access-Control-Allow-Origin: *\r\n"
                    + b"Content-Length: "
                    + str(len(response_data)).encode()
                    + b"\r\n"
                    + b"\r\n"
                    + response_data
                )
            else:
                response = response_data
        except:
            response = response_data

        client_socket.send(response)
    finally:
        client_socket.close()


def start_server(new_host="localhost", new_port=8000):
    """Start the MCP server"""
    scene = bpy.context.scene

    # Set host and port in scene properties
    scene.mcp_host = new_host
    scene.mcp_port = new_port

    if scene.mcp_server_running:
        print("Server is already running")
        return

    register_all_tools()

    scene.mcp_server_running = True

    # Create and start server thread
    server_thread = threading.Thread(target=server_loop)
    server_thread.daemon = True
    server_thread.start()

    # Store thread in bpy.types for access from other functions
    bpy.types.mcp_server_thread = server_thread

    print(f"MCP Server started on {scene.mcp_host}:{scene.mcp_port}")


def stop_server():
    """Stop the MCP server"""
    scene = bpy.context.scene

    if not scene.mcp_server_running:
        return

    scene.mcp_server_running = False

    # Close the socket to interrupt accept()
    if hasattr(bpy.types, "mcp_server_socket"):
        try:
            bpy.types.mcp_server_socket.close()
            del bpy.types.mcp_server_socket
        except:
            pass

    # Wait for the thread to finish
    if hasattr(bpy.types, "mcp_server_thread"):
        try:
            bpy.types.mcp_server_thread.join(timeout=1.0)
            del bpy.types.mcp_server_thread
        except:
            pass

    print("MCP Server stopped")


# -------------------------------------------------------------
# Blender UI Components
# -------------------------------------------------------------


class MCP_PT_Panel(bpy.types.Panel):
    """MCP Server Panel"""

    bl_label = "3D MCP Server"
    bl_idname = "MCP_PT_Panel"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "3dMCP"

    def draw(self, context):
        layout = self.layout
        scene = context.scene

        layout.prop(scene, "mcp_port")
        layout.prop(scene, "mcp_host")

        if not scene.mcp_server_running:
            layout.operator("mcp.start_server", text="Start MCP Server")
        else:
            layout.operator("mcp.stop_server", text="Stop MCP Server")
            layout.label(text=f"Running on {scene.mcp_host}:{scene.mcp_port}")


class MCP_OT_StartServer(bpy.types.Operator):
    """Start the MCP Server"""

    bl_idname = "mcp.start_server"
    bl_label = "Start MCP Server"

    def execute(self, context):
        start_server(context.scene.mcp_host, context.scene.mcp_port)
        return {"FINISHED"}


class MCP_OT_StopServer(bpy.types.Operator):
    """Stop the MCP Server"""

    bl_idname = "mcp.stop_server"
    bl_label = "Stop MCP Server"

    def execute(self, context):
        stop_server()
        return {"FINISHED"}


def register():
    """Register the Blender addon"""
    global tools

    bpy.types.Scene.mcp_port = bpy.props.IntProperty(
        name="Port",
        description="Port for the MCP server",
        default=8000,
        min=1024,
        max=65535,
    )

    bpy.types.Scene.mcp_host = bpy.props.StringProperty(
        name="Host", description="Host for the MCP server", default="localhost"
    )

    bpy.types.Scene.mcp_server_running = bpy.props.BoolProperty(
        name="Server Running", default=False
    )

    bpy.utils.register_class(MCP_PT_Panel)
    bpy.utils.register_class(MCP_OT_StartServer)
    bpy.utils.register_class(MCP_OT_StopServer)

    # Register monitor tools
    for name, func in inspect.getmembers(monitor_atomic, inspect.isfunction):
        print(f"Registering tool: {name}")
        register_tool(name, func)
    # Register model tools
    for name, func in inspect.getmembers(model_atomic, inspect.isfunction):
        print(f"Registering tool: {name}")
        register_tool(name, func)
    # Register core tools
    for name, func in inspect.getmembers(core_atomic, inspect.isfunction):
        print(f"Registering tool: {name}")
        register_tool(name, func)
    # Register animation tools
    for name, func in inspect.getmembers(animation_atomic, inspect.isfunction):
        print(f"Registering tool: {name}")
        register_tool(name, func)
    # Register rig tools
    for name, func in inspect.getmembers(rig_atomic, inspect.isfunction):
        print(f"Registering tool: {name}")
        register_tool(name, func)

    print("3D MCP addon registered")


def unregister():
    """Unregister the Blender addon"""
    # Stop server if running
    if bpy.context.scene.mcp_server_running:
        stop_server()

    bpy.utils.unregister_class(MCP_PT_Panel)
    bpy.utils.unregister_class(MCP_OT_StartServer)
    bpy.utils.unregister_class(MCP_OT_StopServer)

    del bpy.types.Scene.mcp_port
    del bpy.types.Scene.mcp_host
    del bpy.types.Scene.mcp_server_running

    # Clean up any remaining server resources
    if hasattr(bpy.types, "mcp_server_socket"):
        try:
            bpy.types.mcp_server_socket.close()
            del bpy.types.mcp_server_socket
        except:
            pass

    if hasattr(bpy.types, "mcp_server_thread"):
        del bpy.types.mcp_server_thread

    print("3D MCP addon unregistered")


def main():
    """Main entry point to start the MCP server in standalone mode"""
    parser = argparse.ArgumentParser(description="Start the MCP server")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on")
    parser.add_argument("--host", type=str, default="localhost", help="Host to bind to")
    args = parser.parse_args()

    register_all_tools()
    start_server(args.host, args.port)

    try:
        # Keep the main thread alive
        while bpy.context.scene.mcp_server_running:
            import time

            time.sleep(1)
    except KeyboardInterrupt:
        print("Keyboard interrupt received, shutting down...")
        stop_server()
