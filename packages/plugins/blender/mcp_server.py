# Generated blender MCP server
# This file is generated - DO NOT EDIT DIRECTLY

import json
import inspect
import socket
import json
import sys
import os
import argparse
from typing import Dict, Any, Callable

# Add mock implementation for testing when application libraries aren't available
if 'HAS_APP_LIBS' not in globals():
    HAS_APP_LIBS = True

# Import all atomic tool modules
from monitor import monitor_atomic
from core import core_atomic
from render import render_atomic
from animation import animation_atomic
from rig import rig_atomic
from model import model_atomic

class MCPServer:
    """
    Server component that receives MCP tool requests and routes them to appropriate functions
    """
    
    def __init__(self, host="localhost", port=8000):
        self.host = host
        self.port = port
        self.tools: Dict[str, Callable] = {}
        self.server_socket = None
        self.is_mock_mode = not HAS_APP_LIBS
        
        if self.is_mock_mode:
            print("WARNING: Running in mock mode - some functionality will be limited")
            # Register a test function for test connections
            self.register_tool("test", lambda _: {"success": True, "message": "Test connection successful (mock mode)"})
        
    def register_tool(self, name: str, func: Callable):
        """Register a tool function with the server"""
        print(f"Registering tool: {name}")
        self.tools[name] = func
        
    def register_all_tools(self):
        """Register all available tool functions"""
    # Register monitor tools
        for name, func in inspect.getmembers(monitor_atomic, inspect.isfunction):
            self.register_tool(name, func)

    # Register core tools
        for name, func in inspect.getmembers(core_atomic, inspect.isfunction):
            self.register_tool(name, func)

    # Register render tools
        for name, func in inspect.getmembers(render_atomic, inspect.isfunction):
            self.register_tool(name, func)

    # Register animation tools
        for name, func in inspect.getmembers(animation_atomic, inspect.isfunction):
            self.register_tool(name, func)

    # Register rig tools
        for name, func in inspect.getmembers(rig_atomic, inspect.isfunction):
            self.register_tool(name, func)

    # Register model tools
        for name, func in inspect.getmembers(model_atomic, inspect.isfunction):
            self.register_tool(name, func)
        print(f"Registered {len(self.tools)} tools")
        
    def start(self):
        """Start the MCP server"""
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            print(f"MCP Server started on {self.host}:{self.port}")
            
            while True:
                client_socket, address = self.server_socket.accept()
                print(f"Connection from {address}")
                self.handle_client(client_socket)
                
        except KeyboardInterrupt:
            print("Server shutting down...")
        finally:
            if self.server_socket:
                self.server_socket.close()
                
    def handle_client(self, client_socket):
        """Handle client connection and route requests to appropriate tool"""
        try:
            data = client_socket.recv(4096)
            if not data:
                return
            print(f"Received data: {data}")
            
            # Check if this is an HTTP request
            request_str = data.decode('utf-8', errors='ignore')
            
            if request_str.startswith('POST') or request_str.startswith('GET'):
                print("Received HTTP request, extracting JSON body")
                # Extract the JSON body from HTTP request (after the \r\n\r\n)
                body_start = request_str.find('\r\n\r\n') + 4
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
            
            if tool_name in self.tools:
                print(f"Executing tool: {tool_name}")
                # Unpack dictionary params into keyword arguments
                result = self.tools[tool_name](**params)
                response_data = json.dumps(result).encode("utf-8")
                
                # Check if we need to send HTTP response
                if request_str.startswith('POST') or request_str.startswith('GET'):
                    response = (
                        b"HTTP/1.1 200 OK\r\n" +
                        b"Content-Type: application/json\r\n" +
                        b"Access-Control-Allow-Origin: *\r\n" +
                        b"Content-Length: " + str(len(response_data)).encode() + b"\r\n" +
                        b"\r\n" +
                        response_data
                    )
                else:
                    response = response_data
            else:
                error_msg = {"success": False, "error": f"Unknown tool: {tool_name}"}
                response_data = json.dumps(error_msg).encode("utf-8")
                
                # Check if we need to send HTTP response
                if request_str.startswith('POST') or request_str.startswith('GET'):
                    response = (
                        b"HTTP/1.1 404 Not Found\r\n" +
                        b"Content-Type: application/json\r\n" +
                        b"Access-Control-Allow-Origin: *\r\n" +
                        b"Content-Length: " + str(len(response_data)).encode() + b"\r\n" +
                        b"\r\n" +
                        response_data
                    )
                else:
                    response = response_data
                
            client_socket.send(response)
            
        except Exception as e:
            print(f"Error handling client request: {str(e)}")
            error_msg = {"success": False, "error": str(e)}
            response_data = json.dumps(error_msg).encode("utf-8")
            
            # Try to determine if this was an HTTP request
            try:
                request_str = data.decode('utf-8', errors='ignore')
                if request_str.startswith('POST') or request_str.startswith('GET'):
                    response = (
                        b"HTTP/1.1 500 Internal Server Error\r\n" +
                        b"Content-Type: application/json\r\n" +
                        b"Access-Control-Allow-Origin: *\r\n" +
                        b"Content-Length: " + str(len(response_data)).encode() + b"\r\n" +
                        b"\r\n" +
                        response_data
                    )
                else:
                    response = response_data
            except:
                response = response_data
                
            client_socket.send(response)
        finally:
            client_socket.close()

def main():
    """Main entry point to start the MCP server"""
    parser = argparse.ArgumentParser(description='Start the MCP server')
    parser.add_argument('--port', type=int, default=8000, help='Port to listen on')
    parser.add_argument('--host', type=str, default='localhost', help='Host to bind to')
    args = parser.parse_args()
    
    server = MCPServer(host=args.host, port=args.port)
    print(f"Starting MCP server on {args.host}:{args.port}")
    server.register_all_tools()
    server.start()

if __name__ == "__main__":
    main()
