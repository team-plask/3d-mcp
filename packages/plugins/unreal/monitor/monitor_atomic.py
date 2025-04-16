# Unreal implementation for getCameraView with shading_mode support
# -----------------------------------------------------------------------------------
import unreal
import os
import math
import time
import pathlib
import shutil
from typing import Dict, Any, Optional, List, Union, Tuple, Literal

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
    unreal.log(f"Executing {tool_name} in Unreal Engine")
    
    try:
        # No parameters to validate
        
        # TODO: Implement actual unreal API calls
        # This is a placeholder implementation
        
        return {
            "success": True, # TODO: Implement  
                "scene_graph": None  
        }
        
    except Exception as e:
        unreal.log("Error in {0}: %s", tool_name, str(e))
        return {"success": False, "error": str(e)}

# ------------------------------------------------------------------
# 뷰 모드 매핑: Blender 명칭 -> Unreal ViewModeIndex
# ------------------------------------------------------------------
_SHADING_TO_VIEWMODE = {
    "WIREFRAME": unreal.ViewModeIndex.VMI_BRUSH_WIREFRAME,
    "SOLID":     unreal.ViewModeIndex.VMI_UNLIT,
    # "MATERIAL"와 "RENDERED" 모두 실제로는 'Lit' 모드로 취급
    "MATERIAL":  unreal.ViewModeIndex.VMI_LIT,
    "RENDERED":  unreal.ViewModeIndex.VMI_LIT,
}

# ------------------------------------------------------------------
# 씬 경계(중심, 최대치수) 계산
# ------------------------------------------------------------------
def _calculate_scene_bounds() -> Tuple[unreal.Vector, float]:
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    if not actors:
        return unreal.Vector(0, 0, 0), 500.0

    mins = unreal.Vector(float("inf"), float("inf"), float("inf"))
    maxs = unreal.Vector(float("-inf"), float("-inf"), float("-inf"))

    for a in actors:
        origin, extent = a.get_actor_bounds(True)
        mins = unreal.Vector.get_min(mins, origin - extent)
        maxs = unreal.Vector.get_max(maxs, origin + extent)

    center = (mins + maxs) * 0.5
    max_dim  = max(maxs.x - mins.x, maxs.y - mins.y, maxs.z - mins.z)
    return center, max_dim

# ------------------------------------------------------------------
# 임시 카메라 생성/삭제
# ------------------------------------------------------------------
def _spawn_temp_camera() -> unreal.CameraActor:
    return unreal.EditorLevelLibrary.spawn_actor_from_class(
        unreal.CameraActor, unreal.Vector(), unreal.Rotator()
    )

def _destroy_temp_camera(cam: unreal.CameraActor):
    unreal.EditorLevelLibrary.destroy_actor(cam)

# ------------------------------------------------------------------
# 카메라 파라미터 설정
# ------------------------------------------------------------------
def _setup_camera(cam: unreal.CameraActor,
                  view_cfg: Dict[str, Any],
                  center: unreal.Vector,
                  max_dim: float,
                  auto_fit: bool):
    comp = cam.camera_component

    # 투영 모드
    if view_cfg["perspective"] == "ORTHO":
        comp.projection_mode = unreal.CameraProjectionMode.ORTHOGRAPHIC
        comp.ortho_width     = max_dim * 2
    else:
        comp.projection_mode = unreal.CameraProjectionMode.PERSPECTIVE
        comp.field_of_view   = 90.0

    # 위치‧회전
    if "location" in view_cfg and view_cfg["location"] and not auto_fit:
        cam.set_actor_location(unreal.Vector(*view_cfg["location"]), False, True)
    else:
        # auto_fit=True 시 씬 중심을 기준으로 오프셋
        cam.set_actor_location(center + view_cfg["offset"](max_dim), False, True)

    # rotation(쿼터니언) 있으면 적용, 없으면 lookAt
    if "rotation" in view_cfg and isinstance(view_cfg["rotation"], (list, tuple)):
        q = unreal.Quat(*view_cfg["rotation"])
        cam.set_actor_rotation(q.rotator(), False)
    else:
        look = unreal.MathLibrary.find_look_at_rotation(cam.get_actor_location(), center)
        cam.set_actor_rotation(look, False)

    # 뷰포트에서 이 카메라를 파일럿(활성)
    unreal.get_editor_subsystem(unreal.LevelEditorSubsystem).pilot_level_actor(cam)

# ------------------------------------------------------------------
# 스크린샷 요청 → 실제 파일로 이동
# ------------------------------------------------------------------
def _take_screenshot(abs_path: str,
                     w: int,
                     h: int,
                     cam: unreal.CameraActor,
                     on_done):

    filename = pathlib.Path(abs_path).name
    task = unreal.AutomationLibrary.take_high_res_screenshot(w, h, filename, camera=cam)
    start = time.time()

    def _tick(_):
        nonlocal start
        if task.is_task_done():
            unreal.unregister_slate_post_tick_callback(handle)
            try:
                src = os.path.join(unreal.Paths.screen_shot_dir(), filename)
                shutil.move(src, abs_path)
                on_done(True)
            except Exception as e:
                unreal.log_warning(f"파일 이동 실패: {e}")
                on_done(False)
        elif time.time() - start > 15.0:
            # 15초 타임아웃
            unreal.unregister_slate_post_tick_callback(handle)
            unreal.log_warning("스크린샷 작업 타임아웃")
            on_done(False)

    handle = unreal.register_slate_post_tick_callback(_tick)

# ------------------------------------------------------------------
# Unreal Editor Viewport에 Shading Mode 적용
# ------------------------------------------------------------------
def _apply_shading_mode(mode: str):
    """
    AutomationLibrary를 사용하여 활성 에디터 뷰포트의 뷰 모드를 변경합니다.
    """
    if mode not in _SHADING_TO_VIEWMODE:
        raise ValueError(f"지원하지 않는 쉐이딩 모드: {mode}")

    view_mode_index = _SHADING_TO_VIEWMODE[mode]

    try:
        unreal.AutomationLibrary.set_editor_viewport_view_mode(view_mode_index)
        unreal.log(f"AutomationLibrary를 통해 활성 뷰포트 뷰 모드를 '{mode}' (인덱스: {view_mode_index}) 로 설정 시도.")
    except Exception as e:
        unreal.log_warning(f"set_editor_viewport_view_mode 함수 호출 중 오류 발생: {e}")
        unreal.log_warning("활성 뷰포트의 뷰 모드를 변경하지 못했을 수 있습니다.")

# ------------------------------------------------------------------
# 메인 함수: getCameraView (Unreal)
# ------------------------------------------------------------------
def getCameraView(
        shading_mode: Optional[Literal["WIREFRAME", "RENDERED", "SOLID", "MATERIAL"]] = None,
        name_visibility_predicate: Optional[str] = None,
        auto_adjust_camera: Optional[bool] = None,
        perspective: Optional[Union[Literal["TOP", "FRONT", "RIGHT", "PERSP", "ALL"], Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Unreal에서 원하는 카메라(각도/투영)로 캡처하고, 블렌더의 WIREFRAME/SOLID/MATERIAL/RENDERED 유사 모드 지원.
    
    Args:
        shading_mode: "WIREFRAME", "SOLID", "MATERIAL", "RENDERED" 등
        name_visibility_predicate: UE에서는 미구현 (무시)
        auto_adjust_camera: True 시 씬 중심/크기에 맞춰 카메라 위치를 오프셋
        perspective: "TOP"/"FRONT"/"RIGHT"/"PERSP"/"ALL" 또는 사용자 dict {"type":"PERSP"|"ORTHO","rotation":[...],"location":[...]}
    Returns:
        {"content": {"path": [스크린샷 경로...], "type": "image"}}
    """
    tool_name = "getCameraView"
    unreal.log(f"Executing {tool_name} in Unreal Engine with shading_mode={shading_mode}, perspective={perspective}")

    export_width = 960
    export_height = 540

    try:
        # 파라미터 기본값
        if shading_mode is None:
            shading_mode = "WIREFRAME"
        if auto_adjust_camera is None:
            auto_adjust_camera = True
        if perspective is None:
            perspective = "FRONT"

        # (1) 쉐이딩 모드 설정 -> 여기서는 제거하고 _next 안으로 이동

        # (2) 기본 스크린샷 파일 경로
        desk = os.path.expanduser("~/Desktop")
        base = os.path.join(desk, "unreal_camera_view")

        # (3) 씬 정보 & 카메라 생성
        center, max_dim = _calculate_scene_bounds()
        cam = _spawn_temp_camera()

        # (4) 시점 정의 (TOP/FRONT/RIGHT/PERSP)
        def _offset_top(md):   return unreal.Vector(0, 0, md * 1.2)
        def _offset_front(md): return unreal.Vector(-md * 1.2, 0, 0)
        def _offset_right(md): return unreal.Vector(0, md * 1.2, 0)
        def _offset_persp(md):
            n = math.sqrt(3)
            f = md * 1.5
            return unreal.Vector(-f/n, f/n, f/n)

        presets = {
            "TOP"  : {"perspective": "ORTHO", "offset": _offset_top,   "rotation": None},
            "FRONT": {"perspective": "ORTHO", "offset": _offset_front, "rotation": None},
            "RIGHT": {"perspective": "ORTHO", "offset": _offset_right, "rotation": None},
            "PERSP": {"perspective": "PERSP", "offset": _offset_persp, "rotation": None},
        }

        # (4-1) perspective 파라미터 처리
        if isinstance(perspective, dict):
            # 사용자 커스텀
            views = [("CUSTOM", {
                "perspective": perspective.get("type", "PERSP"),
                "offset": lambda _: unreal.Vector(),  # location 직접 지정
                "rotation": perspective.get("rotation"),
                "location": perspective.get("location"),
            })]
        elif perspective == "ALL":
            views = list(presets.items())  # TOP, FRONT, RIGHT, PERSP 4장
        elif perspective in presets:
            views = [(perspective, presets[perspective])]
        else:
            raise ValueError(f"잘못된 perspective 값: {perspective}")

        # (5) 비동기 파이프라인으로 스크린샷
        image_paths: List[str] = []

        def _next():
            if not views:
                # 모든 시점을 처리했으면 카메라 제거 후 종료
                _destroy_temp_camera(cam)
                unreal.log(f"{tool_name} 완료")
                return

            v_name, cfg = views.pop(0)
            _setup_camera(cam, cfg, center, max_dim, auto_adjust_camera)

            # ==================================================
            # 수정 지점: 스크린샷 콜백 등록 *전에* 쉐이딩 모드 적용
            # ==================================================
            try:
                _apply_shading_mode(shading_mode) # 현재 view에 대한 shading mode 적용 시도
            except ValueError as e:
                unreal.log_error(f"쉐이딩 모드 적용 실패: {e}")
                # 실패 시 처리를 원하면 여기에 추가 (예: 다음 view로 넘어가기 또는 전체 중단)
                _destroy_temp_camera(cam) # 에러 발생 시 카메라 정리
                # 실패 정보 반환 로직 추가 필요
                return # 현재 view 처리 중단

            # 다음 틱에 스크린샷을 찍도록 _shoot 함수를 콜백으로 등록
            def _shoot(_):
                filename = f"{base}_{v_name.lower()}.png"
                unreal.log(f"▶ {v_name} view screenshot → {filename}")

                _take_screenshot(filename, export_width, export_height, cam,
                                 lambda ok: (image_paths.append(filename) if ok else None) or _next()) # 스크린샷 후 다음 view 처리
                unreal.unregister_slate_post_tick_callback(h) # ★★★ 중요: 콜백 실행 후 자신을 해제

            h = unreal.register_slate_post_tick_callback(_shoot) # 콜백 등록

        _next() # 첫 번째 view 처리 시작

        # 반환 형식(Blender 버전과 유사하게 content/path 제공)
        return {"content": {"path": image_paths, "type": "image"}}

    except Exception as e:
        unreal.log_error(f"{tool_name} 실패: {e}")
        if 'cam' in locals() and cam and unreal.EditorLevelLibrary.is_valid_actor(cam):
             _destroy_temp_camera(cam)
        return {"success": False, "error": str(e)}