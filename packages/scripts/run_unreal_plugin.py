import sys
plugin_dir = "/Users/kminseong/3d-mcp/packages"
sys.path.append(plugin_dir)
import plugins.unreal as MCP_unreal
import plugins.unreal.monitor.monitor_atomic as monitor_atomic
import importlib

importlib.reload(monitor_atomic)
# importlib.reload(MCP_unreal)
# MCP_unreal.stop_server()
# MCP_unreal.start_server()

monitor_atomic.getQuadView()  