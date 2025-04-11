import sys
plugin_dir = "/Users/kminseong/3d-mcp/packages"
sys.path.append(plugin_dir)
import plugins.unreal as MCP_unreal
import importlib

importlib.reload(MCP_unreal)

# ------------------------------------------------------
# MCP_unreal 아래 다른 모듈 수정 시 unreal editor 재시작 필요
# ------------------------------------------------------

MCP_unreal.stop_server()
MCP_unreal.start_server()
