# Generated unreal MCP server
# This file is generated - DO NOT EDIT DIRECTLY

try:
    import unreal
    HAS_APP_LIBS = True
except ImportError:
    print(f"Warning: Could not import unreal. Running in mock mode.")
    HAS_APP_LIBS = False

import json
import inspect
import socket
import sys
import os
import argparse
from typing import Dict, Any, Callable, List, Union, Optional, Literal, TypedDict, Tuple
import threading
import traceback

import time
import uuid
import queue

from .monitor import monitor_atomic
from .core import core_atomic
from .render import render_atomic
from .animation import animation_atomic
from .rig import rig_atomic
from .model import model_atomic


# Global variables - this will store tools
tools = {}

# Task queue for main thread execution
task_queue = queue.Queue()
results_store = {}  # Store task results by ID
server_running = False  # 서버 실행 상태
server_socket = None
server_thread = None
server_host = "127.0.0.1"
server_port = 8000


def execute_on_main_thread(tool_name, params):
    """Schedule a tool execution on the main thread and wait for result"""
    task_id = str(uuid.uuid4())
    task = {"id": task_id, "tool": tool_name, "params": params, "completed": False}
    results_store[task_id] = {
        "completed": False,
        "result": None,
    }  # Initialize with proper structure
    task_queue.put(task)

    # 작업 완료 대기
    start_time = time.time()
    timeout = 60.0  # 60초 타임아웃 설정

    # Wait for task completion
    try:
        while not results_store.get(task_id, {}).get("completed", False):
            time.sleep(0.1)
            if time.time() - start_time > timeout:
                return {"success": False, "error": "Task execution timed out"}
    except Exception as e:
        unreal.log_error(f"Error waiting for task completion: {str(e)}")
        return {"success": False, "error": f"Task execution error: {str(e)}"}

    # Get result and clean up
    result = results_store.get(task_id, {}).get(
        "result", {"success": False, "error": "No result found"}
    )
    del results_store[task_id]  # Clean up
    return result

# Unreal 메인 스레드에서 태스크 처리를 위한 타이머 설정
def is_task_processor_running():
    """태스크 프로세서가 실행 중인지 확인"""
    return unreal.EditorAssetLibrary.does_asset_exist('/Engine/MCP/TaskProcessor')

def start_task_processor():
    """메인 스레드에서 태스크 처리를 위한 타이머 시작"""
    unreal.register_slate_pre_tick_callback(process_task_queue)
    unreal.log("[MCP] Task processor started")

def process_task_queue(delta_time):
    """Process queued tasks on the main thread"""
    if task_queue.empty():
        return True  # 계속 타이머 유지

    try:
        task = task_queue.get(block=False)
        tool_name = task["tool"]
        params = task["params"]
        task_id = task["id"]
        
        try:
            if tool_name in tools:
                result = tools[tool_name](**params)
            else:
                result = {"success": False, "error": f"Unknown tool: {tool_name}"}
        except Exception as e:
            unreal.log_error(f"Error executing {tool_name}: {str(e)}")
            traceback.print_exc()
            result = {"success": False, "error": str(e)}
        
        # 결과 저장
        results_store[task_id] = {"completed": True, "result": result}
    except queue.Empty:
        pass  # 큐가 비었을 때 예외 처리
    
    return True  # 계속 타이머 유지

def register_tool(name: str, func: Callable):
    """도구 함수를 서버에 등록"""
    unreal.log(f"[MCP] Registering tool: {name}")
    tools[name] = func

def register_all_tools():
    """Register all available tool functions"""
    unreal.log("[MCP] Registering all tools...")

    # Register monitor tools
    for name, func in inspect.getmembers(monitor_atomic, inspect.isfunction):
        register_tool(name, func)

    # Register core tools
    for name, func in inspect.getmembers(core_atomic, inspect.isfunction):
        register_tool(name, func)

    # Register render tools
    for name, func in inspect.getmembers(render_atomic, inspect.isfunction):
        register_tool(name, func)

    # Register animation tools
    for name, func in inspect.getmembers(animation_atomic, inspect.isfunction):
        register_tool(name, func)

    # Register rig tools
    for name, func in inspect.getmembers(rig_atomic, inspect.isfunction):
        register_tool(name, func)

    # Register model tools
    for name, func in inspect.getmembers(model_atomic, inspect.isfunction):
        register_tool(name, func)


def server_loop():
    """Main server loop running in a separate thread"""
    global server_socket
    
    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((server_host, server_port))
        server_socket.listen(5)
        server_socket.settimeout(1.0)  # 1초 타임아웃 설정
        
        unreal.log("[MCP] Server loop started")
        
        while server_running:
            try:
                client_socket, addr = server_socket.accept()
                unreal.log(f"[MCP] Connection from {addr}")
                # 클라이언트 요청 처리를 위한 스레드 시작
                client_thread = threading.Thread(target=handle_client, args=(client_socket,))
                client_thread.daemon = True
                client_thread.start()
            except socket.timeout:
                # 타임아웃 발생 시 서버 상태 확인하고 계속 실행
                continue
    except Exception as e:
        unreal.log_error(f"[MCP] Server error: {str(e)}")
        traceback.print_exc()
    finally:
        if server_socket:
            server_socket.close()
            server_socket = None
        unreal.log("[MCP] Server loop ended")


def handle_client(client_socket):
    """Handle client connection and route requests to appropriate tool"""
    try:
        data = client_socket.recv(4096)
        if not data:
            return
        
        unreal.log(f"[MCP] Received data: {len(data)} bytes")
        
        # HTTP 요청인지 확인
        request_str = data.decode("utf-8", errors="ignore")
        
        if request_str.startswith("POST") or request_str.startswith("GET"):
            # HTTP 요청 파싱
            body_start = request_str.find("\r\n\r\n") + 4
            if body_start > 4:
                json_body = request_str[body_start:]
                request = json.loads(json_body)
            else:
                raise ValueError("Invalid HTTP request format")
        else:
            # 직접 JSON 파싱
            request = json.loads(request_str)
        
        unreal.log(f"[MCP] Parsed request for tool: {request.get('tool', 'unknown')}")
        tool_name = request.get("tool")
        params = request.get("params", {})
        
        # 메인 스레드에서 실행하고 결과 가져오기
        result = execute_on_main_thread(tool_name, params)
        response_data = json.dumps(result).encode("utf-8")
        
        # HTTP 응답 형식으로 보내기
        if request_str.startswith("POST") or request_str.startswith("GET"):
            response = (
                b"HTTP/1.1 200 OK\r\n"
                b"Content-Type: application/json\r\n"
                b"Access-Control-Allow-Origin: *\r\n"
                b"Content-Length: " + str(len(response_data)).encode() + b"\r\n"
                b"\r\n" +
                response_data
            )
            client_socket.send(response)
        else:
            client_socket.send(response_data)
    
    except Exception as e:
        unreal.log_error(f"[MCP] Client handling error: {str(e)}")
        traceback.print_exc()
        
        # 오류 응답 보내기
        error_response = json.dumps({"success": False, "error": str(e)}).encode("utf-8")
        
        try:
            if request_str and (request_str.startswith("POST") or request_str.startswith("GET")):
                response = (
                    b"HTTP/1.1 500 Internal Server Error\r\n"
                    b"Content-Type: application/json\r\n"
                    b"Content-Length: " + str(len(error_response)).encode() + b"\r\n"
                    b"\r\n" +
                    error_response
                )
                client_socket.send(response)
            else:
                client_socket.send(error_response)
        except:
            pass  # 응답 전송 실패 무시
    finally:
        client_socket.close()



def start_server(host="127.0.0.1", port=8000):
    """Start the MCP server"""
    global server_running, server_thread, server_host, server_port
    
    if server_running:
        unreal.log_warning("[MCP] Server is already running")
        return
    
    server_host = host
    server_port = port
    
    # 도구 등록
    register_all_tools()
    
    server_running = True

    # 초기화
    initialize_plugin()
    
    # 서버 스레드 생성 및 시작
    server_thread = threading.Thread(target=server_loop)
    server_thread.daemon = True
    server_thread.start()
    
    unreal.log(f"[MCP] Server started on {host}:{port}")


def stop_server():
    """Stop the MCP server"""
    global server_running, server_socket, server_thread
    
    if not server_running:
        unreal.log_warning("[MCP] Server is not running")
        return
    
    server_running = False
    
    # 소켓 닫기
    if server_socket:
        server_socket.close()
        server_socket = None
    
    # 스레드 종료 대기
    if server_thread:
        server_thread.join(timeout=2.0)
        server_thread = None
    
    unreal.log("[MCP] Server stopped")

# 언리얼 에디터 플러그인 초기화 시 자동으로 실행 (옵션)
def initialize_plugin():
    """플러그인 초기화 시 호출되는 함수"""
    unreal.log("[MCP] Initializing 3D-MCP Unreal plugin")
    # Register timer if not already registered
    if not is_task_processor_running():
        start_task_processor()
    # 여기에 필요한 초기화 코드 추가

# 언리얼 에디터 플러그인 종료 시 자동으로 실행 (옵션)
def shutdown_plugin():
    """플러그인 종료 시 호출되는 함수"""
    if server_running:
        stop_server()
    unreal.log("[MCP] Shutting down 3D-MCP Unreal plugin")
    # 여기에 필요한 정리 코드 추가