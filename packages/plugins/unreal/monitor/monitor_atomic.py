# Generated unreal implementation for monitor‑atomic tools
# 이 파일은 코드 생성 파이프라인에 의해 생성되었습니다. 직접 수정하지 마십시오.

import unreal
import os
import math
import time
import pathlib
import shutil
from typing import Dict, Any, Optional, List, Union, Tuple, Literal

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
    world = unreal.EditorLevelLibrary.get_editor_world()
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
        cam.set_actor_location(center + view_cfg["offset"](max_dim), False, True)

    if "rotation" in view_cfg and isinstance(view_cfg["rotation"], (list, tuple)):
        # quaternion → rotator
        q = unreal.Quat(*view_cfg["rotation"])
        cam.set_actor_rotation(q.rotator(), False)
    else:
        look = unreal.MathLibrary.find_look_at_rotation(cam.get_actor_location(), center)
        cam.set_actor_rotation(look, False)

    # 뷰포트 파일럿
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

        # 15초 타임아웃
        elif time.time() - start > 15.0:
            unreal.unregister_slate_post_tick_callback(handle)
            unreal.log_warning("스크린샷 작업 타임아웃")
            on_done(False)

    handle = unreal.register_slate_post_tick_callback(_tick)

# ------------------------------------------------------------------
# 메인 함수: getCameraView (Unreal)
# ------------------------------------------------------------------
def getCameraView(
    shading_mode: Optional[Literal["WIREFRAME", "RENDERED", "SOLID", "MATERIAL"]] = None,
    name_visibility_predicate: Optional[str] = None,   # Unreal 미지원 (무시)
    auto_adjust_camera: Optional[bool] = None,
    export_width: int = 960,
    export_height: int = 540,
    perspective: Optional[Union[str, Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    """
    Unreal Editor 뷰포트에서 원하는 각도의 스크린샷을 찍어 반환합니다.

    Args:
        shading_mode: 뷰 모드 (UE ViewModeIndex) - **현재 샘플은 미구현**.
        name_visibility_predicate: 객체명 표시 제어 - Unreal 에디터에서는 불가, 무시.
        auto_adjust_camera: True 시 씬 중심으로 카메라 자동 배치.
        export_width/height: 출력 해상도(px)
        perspective:
            - "TOP" / "FRONT" / "RIGHT" / "PERSP": 해당 뷰 한 장
            - "ALL" : 네 장 모두
            - dict {"type": "PERSP"|"ORTHO", "rotation": [w,x,y,z], "location":[x,y,z]}
              사용자 정의 카메라 한 장

    Returns:
        {"content": {"path": [파일경로...], "type": "image"}}
    """
    tool_name = "getCameraView"
    unreal.log(f"{tool_name} 실행, params: perspective={perspective}, auto_adjust={auto_adjust_camera}")

    try:
        if shading_mode is None:
            shading_mode = "WIREFRAME"
        if auto_adjust_camera is None:
            auto_adjust_camera = True
        if perspective is None:
            perspective = "FRONT"

        # ===== (1) 셰이딩 모드 처리 =====
        # ViewportClient.set_view_mode(ViewModeIndex) 사용 가능.
        # 예시는 생략. (UE 공식 문서: EditorViewportClient)

        # ===== (2) 파일 경로 =====
        desk = os.path.expanduser("~/Desktop")
        base = os.path.join(desk, "unreal_camera_view")

        # ===== (3) 씬 정보 & 카메라 준비 =====
        center, max_dim = _calculate_scene_bounds()
        cam = _spawn_temp_camera()

        # ===== (4) 뷰 정의 =====
        def _offset_top(md):   return unreal.Vector(0, 0, md * 1.2)
        def _offset_front(md): return unreal.Vector(-md * 1.2, 0, 0)
        def _offset_right(md): return unreal.Vector(0, md * 1.2, 0)
        def _offset_persp(md):
            n = math.sqrt(3)
            f = md * 1.5
            return unreal.Vector(-f/n, f/n, f/n)

        presets = {
            "TOP"  : {"perspective": "ORTHO", "offset": _offset_top , "rotation": None},
            "FRONT": {"perspective": "ORTHO", "offset": _offset_front, "rotation": None},
            "RIGHT": {"perspective": "ORTHO", "offset": _offset_right, "rotation": None},
            "PERSP": {"perspective": "PERSP", "offset": _offset_persp , "rotation": None},
        }

        if isinstance(perspective, dict):
            views = [("CUSTOM", {
                "perspective": perspective.get("type", "PERSP"),
                "offset"     : lambda _: unreal.Vector(),   # location 직접 지정
                "rotation"   : perspective.get("rotation"),
                "location"   : perspective.get("location")
            })]
        elif perspective == "ALL":
            views = list(presets.items())
        elif perspective in presets:
            views = [(perspective, presets[perspective])]
        else:
            raise ValueError(f"잘못된 perspective 값: {perspective}")

        # ===== (5) 비동기 파이프라인 =====
        image_paths: List[str] = []

        def _next():
            if not views:
                _destroy_temp_camera(cam)
                unreal.log("getCameraView 완료")
                return

            v_name, cfg = views.pop(0)
            _setup_camera(cam, cfg, center, max_dim, auto_adjust_camera)

            # 한 프레임 뒤에 캡처
            def _shoot(_):
                out_png = f"{base}_{v_name.lower()}.png"
                unreal.log(f"▶ {v_name} 스크린샷: {out_png}")

                _take_screenshot(out_png, export_width, export_height, cam,
                                 lambda ok: (image_paths.append(out_png) if ok else None) or _next())
                unreal.unregister_slate_post_tick_callback(h)

            h = unreal.register_slate_post_tick_callback(_shoot)

        _next()
        return {"content": {"path": image_paths, "type": "image"}}

    except Exception as e:
        unreal.log_error(f"{tool_name} 실패: {e}")
        return {"success": False, "error": str(e)}

# -------------------------------------------------------------------
# 주요 함수: getSceneGraph
# -------------------------------------------------------------------
def getSceneGraph() -> Dict[str, Any]:
    """
    현재 씬의 Scene Graph(액터 계층 구조)를 추출합니다.
    
    Returns:
        {"success": bool, "scene_graph": List[Dict[str, Any]]} 형태의 결과 반환.
        각 노드는 다음의 필드를 포함합니다:
          - id (str): 액터의 고유 이름
          - name (str): 액터 라벨
          - metadata (dict): 추가 메타데이터 (필요 시 확장)
          - position ([float, float, float]): 월드 공간 내 위치
          - rotation ([float, float, float]): 회전값 (pitch, yaw, roll)
          - scale ([float, float, float]): 스케일 값
          - parentId (str): 부모 액터의 이름 (없으면 빈 문자열)
          - childIds (List[str]): 자식 액터들의 이름 리스트
    """
    tool_name = "getSceneGraph"
    unreal.log("Executing {0} in Unreal Engine".format(tool_name))
    
    try:
        scene_graph = []
        actors = unreal.EditorLevelLibrary.get_all_level_actors()
        for actor in actors:
            actor_id = actor.get_name()
            actor_label = actor.get_actor_label()
            position = actor.get_actor_location()
            rotation = actor.get_actor_rotation()
            scale = actor.get_actor_scale3d()
            parent_actor = actor.get_attach_parent_actor()
            child_actors = actor.get_attached_actors()
            
            node = {
                "id": actor_id,
                "name": actor_label,
                "metadata": {},  # 필요에 따라 추가 메타데이터 추출 가능
                "position": [position.x, position.y, position.z],
                "rotation": [rotation.pitch, rotation.yaw, rotation.roll],
                "scale": [scale.x, scale.y, scale.z],
                "parentId": parent_actor.get_name() if parent_actor else "",
                "childIds": [child.get_name() for child in child_actors] if child_actors else []
            }
            scene_graph.append(node)
        return {"success": True, "scene_graph": scene_graph}
    
    except Exception as e:
        unreal.log("Error in {0}: {1}".format(tool_name, str(e)))
        return {"success": False, "error": str(e)}
