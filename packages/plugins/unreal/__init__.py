# plugins/unreal/__init__.py
# Generated Unreal MCP server
# This file is an example - adapt as needed

import unreal
import socket
import threading
import json
import time
import traceback

# 만약 다른 atomic 함수 파일들을 만든 경우, 여기서 import
from . import my_atomic
from . import other_atomic

# 전역 상태
_server_running = False
_server_socket = None
_server_thread = None

# 툴 함수들을 담을 딕셔너리
tools = {}

def register_tool(name, func):
    """툴 함수를 등록"""
    unreal.log(f"[MCP] Registering tool: {name}")
    tools[name] = func

def register_all_tools():
    """my_atomic.py, other_atomic.py 등에 정의된 함수들을 등록"""
    unreal.log("[MCP] Registering all tools...")

    # 예: my_atomic 내부 함수를 전부 찾아 등록한다거나, 필요한 것만 선택 등록
    register_tool("my_first_tool", my_atomic.my_first_tool)
    register_tool("my_second_tool", my_atomic.my_second_tool)

    # other_atomic 도 마찬가지
    # register_tool("other_tool", other_atomic.do_something)

def handle_client(client_socket):
    """클라이언트 요청을 받아서 JSON 해석 후 tools에 등록된 함수를 호출"""
    try:
        data = client_socket.recv(4096)
        if not data:
            return
        unreal.log(f"[MCP] Received data: {data}")
        
        request_str = data.decode("utf-8", errors="ignore")
        
        # HTTP 요청이면 body 파싱, 아니면 바로 JSON 파싱
        if request_str.startswith("POST") or request_str.startswith("GET"):
            body_start = request_str.find("\r\n\r\n") + 4
            if body_start > 4:
                json_body = request_str[body_start:]
                request = json.loads(json_body)
            else:
                raise ValueError("Invalid HTTP request format, no body found")
        else:
            request = json.loads(request_str)

        unreal.log(f"[MCP] Parsed request: {request_str}")
        tool_name = request.get("tool", "")
        params = request.get("params", {})

        # 툴 실행
        if tool_name in tools:
            result = tools[tool_name](**params)
        else:
            result = {"success": False, "error": f"Unknown tool '{tool_name}'"}

        # 결과를 JSON으로 보내기
        response_data = json.dumps(result).encode("utf-8")

        # HTTP 요청이었으면 간단한 헤더 붙이기
        if request_str.startswith("POST") or request_str.startswith("GET"):
            response = (
                b"HTTP/1.1 200 OK\r\n"
                b"Content-Type: application/json\r\n"
                b"Access-Control-Allow-Origin: *\r\n"
                b"Content-Length: " + str(len(response_data)).encode() + b"\r\n"
                b"\r\n" +
                response_data
            )
        else:
            response = response_data

        client_socket.send(response)

    except Exception as e:
        unreal.log_error(f"[MCP] Error in handle_client: {str(e)}")
        traceback.print_exc()
        error_msg = {"success": False, "error": str(e)}
        response_data = json.dumps(error_msg).encode("utf-8")
        client_socket.send(response_data)
    finally:
        client_socket.close()

def server_loop(host, port):
    """서버 메인 루프"""
    global _server_running, _server_socket
    unreal.log(f"[MCP] Server loop started on {host}:{port}")

    try:
        _server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        _server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        _server_socket.bind((host, port))
        _server_socket.listen(5)
        _server_socket.settimeout(1.0)  # accept() 타임아웃

        while _server_running:
            try:
                client_sock, addr = _server_socket.accept()
                unreal.log(f"[MCP] Connection from {addr}")
                # 클라이언트마다 스레드를 따로 두는 간단한 방식
                client_thread = threading.Thread(
                    target=handle_client, args=(client_sock,)
                )
                client_thread.daemon = True
                client_thread.start()

            except socket.timeout:
                # 1초마다 accept 재시도. _server_running이 False가 되면 루프종료
                pass

    except Exception as e:
        unreal.log_error(f"[MCP] Server error: {str(e)}")
        traceback.print_exc()
    finally:
        if _server_socket:
            _server_socket.close()
            _server_socket = None
        unreal.log("[MCP] Server loop ended.")

def start_server(host="127.0.0.1", port=8000):
    """MCP 서버 시작 함수"""
    global _server_running, _server_thread
    if _server_running:
        unreal.log_warning("[MCP] Server is already running.")
        return

    # 툴 등록
    register_all_tools()

    _server_running = True
    _server_thread = threading.Thread(target=server_loop, args=(host, port))
    _server_thread.daemon = True
    _server_thread.start()

    unreal.log(f"[MCP] Server started at {host}:{port}")

def stop_server():
    """MCP 서버 중지 함수"""
    global _server_running, _server_socket, _server_thread

    if not _server_running:
        unreal.log_warning("[MCP] Server is not running.")
        return

    _server_running = False

    # 접속이 막혀 있으면 일단 소켓을 닫아 accept()를 깨움
    if _server_socket:
        _server_socket.close()
        _server_socket = None

    # 서버 스레드를 기다림
    if _server_thread:
        _server_thread.join(timeout=2.0)
        _server_thread = None

    unreal.log("[MCP] Server stopped.")

# Unreal이 이 스크립트를 처음 import 할 때 자동으로 뭔가 할 수도 있지만,
# 보통은 Editor Utility Blueprint나 Python 콘솔 등에서 start_server(), stop_server() 등을 호출해주는 식으로 사용.
