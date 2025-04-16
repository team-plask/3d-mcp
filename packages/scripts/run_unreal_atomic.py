import sys
plugin_dir = "/Users/kminseong/3d-mcp/packages"
sys.path.append(plugin_dir)
# import packages.plugins.unreal.monitor.monitor_atomic_legacy as monitor_atomic_legacy
import packages.plugins.unreal.monitor.monitor_atomic as monitor_atomic
import importlib

# importlib.reload(monitor_atomic_legacy)
importlib.reload(monitor_atomic)

# 1) 4‑way 캡처
monitor_atomic.getCameraView(shading_mode="MATERIAL", perspective="ALL")

# 2) custom 캡처
# custom = {
#     "type": "PERSP",
#     "rotation": [0.9239, 0.0, 0.3827, 0.0],  # w,x,y,z
#     "location": [500, -600, 400]
# }
# monitor_atomic.getCameraView(shading_mode="SOLID",
#               perspective=custom,
#               export_width=1280,
#               export_height=720)