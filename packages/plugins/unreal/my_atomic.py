# plugins/unreal/my_atomic.py

import unreal

def my_first_tool(param1: str, param2: int):
    """예시 함수: Unreal에서 log를 찍고 결과 반환"""
    unreal.log(f"[MCP] my_first_tool called with param1={param1}, param2={param2}")
    return {"success": True, "result": f"Printed {param1} and {param2}"}

def my_second_tool(path: str):
    """예시 함수: 특정 애셋 로드 혹은 다른 로직"""
    unreal.log(f"[MCP] Loading asset from {path} ...")
    # 여기서 Unreal Python API를 통해 애셋 불러오기, 에디터 액션 등 수행 가능
    # ...
    return {"success": True, "loaded_asset": path}
