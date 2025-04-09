# Generated unreal implementation for monitor atomic tools
# 이 파일은 코드 생성 파이프라인에 의해 생성되었습니다. 직접 수정하지 마십시오.

import unreal
import os
import time
import math
from typing import Dict, Any, Optional, List, Union, Tuple, Literal

# -------------------------------------------------------------------
# 헬퍼 함수: 씬 경계(중심 및 최대 치수)를 계산
# -------------------------------------------------------------------
def calculate_scene_bounds() -> Tuple[unreal.Vector, float]:
    """
    씬 내 모든 액터들의 바운딩 박스를 고려하여 씬의 중심과 최대 치수를 계산합니다.
    만약 액터가 없으면 기본값(center=(0,0,0), max_dimension=500)을 반환합니다.
    """
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    if not actors:
        return unreal.Vector(0, 0, 0), 500.0

    min_x = float('inf')
    min_y = float('inf')
    min_z = float('inf')
    max_x = float('-inf')
    max_y = float('-inf')
    max_z = float('-inf')

    for actor in actors:
        # get_actor_bounds(include_non_colliding: bool) 반환값: (origin, box_extent)
        origin, extent = actor.get_actor_bounds(True)
        ax_min = origin - extent
        ax_max = origin + extent

        min_x = min(min_x, ax_min.x)
        min_y = min(min_y, ax_min.y)
        min_z = min(min_z, ax_min.z)
        max_x = max(max_x, ax_max.x)
        max_y = max(max_y, ax_max.y)
        max_z = max(max_z, ax_max.z)

    center = unreal.Vector((min_x + max_x) / 2, (min_y + max_y) / 2, (min_z + max_z) / 2)
    dimension = unreal.Vector(max_x - min_x, max_y - min_y, max_z - min_z)
    max_dimension = max(dimension.x, dimension.y, dimension.z)
    return center, max_dimension

# -------------------------------------------------------------------
# 헬퍼 함수: 임시 카메라 액터 생성/삭제
# -------------------------------------------------------------------
def spawn_temp_camera() -> unreal.CameraActor:
    """
    임시 카메라 액터를 생성하여 반환합니다.
    """
    world = unreal.EditorLevelLibrary.get_editor_world()
    camera = unreal.EditorLevelLibrary.spawn_actor_from_class(unreal.CameraActor, unreal.Vector(0, 0, 0), unreal.Rotator(0, 0, 0))
    return camera

def destroy_temp_camera(camera: unreal.CameraActor) -> None:
    """
    생성한 임시 카메라 액터를 삭제합니다.
    """
    unreal.EditorLevelLibrary.destroy_actor(camera)

# -------------------------------------------------------------------
# 헬퍼 함수: 카메라 뷰 설정 (뷰 이름에 따라 위치 및 회전 지정)
# -------------------------------------------------------------------
def set_camera_view(camera: unreal.CameraActor, view_name: str, center: unreal.Vector, max_dimension: float) -> None:
    """
    view_name에 따라 카메라 액터의 위치·회전을 설정하고,
    해당 카메라를 활성 뷰포트에서 '파일럿(pilot)' 하여 실제 캡처가 가능하도록 전환합니다.
    """
    # 카메라 컴포넌트 가져오기
    camera_component = camera.camera_component()  # 또는 get_component_by_class(unreal.CameraComponent)
    if not camera_component:
        return
    
    # 위치/회전 설정 (기존 로직)
    offset = unreal.Vector(0, 0, max_dimension)
    is_ortho = True

    if view_name == "TOP":
        offset = unreal.Vector(0, 0, max_dimension * 1.2)
    elif view_name == "FRONT":
        offset = unreal.Vector(-max_dimension * 1.2, 0, 0)
    elif view_name == "RIGHT":
        offset = unreal.Vector(0, max_dimension * 1.2, 0)
    elif view_name == "PERSP":
        is_ortho = False  # 퍼스펙티브 모드 사용
        norm = math.sqrt(3)
        factor = max_dimension * 1.5
        offset = unreal.Vector((-1 / norm) * factor, (1 / norm) * factor, (1 / norm) * factor)
    
    camera.set_actor_location(center + offset, False, True)
    look_at_rotation = unreal.MathLibrary.find_look_at_rotation(center + offset, center)
    camera.set_actor_rotation(look_at_rotation, False)

    # 에디터에서 pilot
    level_editor_subsys = unreal.LevelEditorSubsystem()
    level_editor_subsys.pilot_level_actor(camera)

    # Orthographic 또는 Perspective 설정
    if is_ortho:
        camera_component.set_editor_property("projection_mode", unreal.CameraProjectionMode.ORTHOGRAPHIC)
        # 필요하다면 Ortho Width도 설정해야 "얼마나 넓게" 보이는지 조절 가능
        camera_component.set_editor_property("ortho_width", max_dimension * 2.0)  # 취향에 맞게 조절
    else:
        camera_component.set_editor_property("projection_mode", unreal.CameraProjectionMode.PERSPECTIVE)
    

# -------------------------------------------------------------------
# 헬퍼 함수: 스크린샷 캡쳐
# -------------------------------------------------------------------
def take_view_screenshot(screenshot_filename: str, export_width: int, export_height: int) -> None:
    """
    AutomationLibrary의 고해상도 스크린샷 캡쳐 함수를 호출하여 지정한 파일 이름으로 저장합니다.
    
    Args:
        screenshot_filename: 저장할 파일 전체 경로 (예: "C:/Users/username/Desktop/unreal_quad_view_top.png")
        export_width: 캡쳐할 이미지의 가로 해상도
        export_height: 캡쳐할 이미지의 세로 해상도
    """
    # 1) 스크린샷 요청
    unreal.AutomationLibrary.take_high_res_screenshot(export_width, export_height, screenshot_filename)
    
    # 2) 파일 생성을 기다리는 루프 (최대 10초)
    start_time = time.time()
    timeout_sec = 10.0
    while not os.path.exists(screenshot_filename):
        # 0.2초 간격으로 확인
        time.sleep(0.2)
        if time.time() - start_time > timeout_sec:
            unreal.log_warning(f"Screenshot file not found within {timeout_sec} seconds: {screenshot_filename}")
            break
    # 이 시점에서 파일이 생성되었거나(성공) 혹은 10초 지남(실패 가능성)

# -------------------------------------------------------------------
# 주요 함수: getQuadView
# -------------------------------------------------------------------
def getQuadView(
    shading_mode: Optional[Literal["WIREFRAME", "RENDERED", "SOLID", "MATERIAL"]] = None,
    name_visibility_predicate: Optional[str] = None,
    auto_adjust_camera: Optional[bool] = None,
    export_width: int = 1920,
    export_height: int = 1080,
) -> Dict[str, Any]:
    """
    Unreal Engine에서 씬의 TOP, FRONT, RIGHT, PERSP 뷰의 스크린샷을 생성합니다.
    
    Args:
        shading_mode (Literal["WIREFRAME", "RENDERED", "SOLID", "MATERIAL"]): 뷰포트의 셰이딩 모드
        name_visibility_predicate (str): 객체의 표시 설정을 위한 함수 문자열 (현재 Unreal에서는 지원되지 않음)
        auto_adjust_camera (bool): 카메라 자동 조정 여부
        export_width (int): 캡쳐 이미지의 가로 해상도
        export_height (int): 캡쳐 이미지의 세로 해상도
        
    Returns:
        {"success": bool, "image_path": List[str]} 형태의 결과 반환
    """
    tool_name = "getQuadView"  # 툴 이름 설정 (로그용)
    params = {
        "shading_mode": shading_mode,
        "name_visibility_predicate": name_visibility_predicate,
        "auto_adjust_camera": auto_adjust_camera,
        "export_width": export_width,
        "export_height": export_height,
    }
    unreal.log("Executing {0} in Unreal Engine with params: {1}".format(tool_name, params))
    
    try:
        # 셰이딩 모드 파라미터 검증
        if shading_mode is not None and shading_mode not in ['WIREFRAME', 'RENDERED', 'SOLID', 'MATERIAL']:
            raise ValueError("Parameter 'shading_mode' must be one of ['WIREFRAME','RENDERED','SOLID','MATERIAL'], got {}".format(shading_mode))
        
        # 기본값 설정
        if shading_mode is None:
            shading_mode = "WIREFRAME"
        if auto_adjust_camera is None:
            auto_adjust_camera = True

        # Unreal에서는 Blender와 달리 객체 이름 표시 제어 기능이 없으므로 단순 로그 처리
        if name_visibility_predicate:
            unreal.log("name_visibility_predicate is provided but not supported in Unreal Engine. Ignoring.")
        
        # 저장 경로 설정: Desktop 디렉터리 아래에 unreal_quad_view_*.png 형태
        desktop_dir = os.path.expanduser("~/Desktop")
        base_filepath = os.path.join(desktop_dir, "unreal_quad_view")
        unreal.log("Saving quad view images to: {}_*.png".format(base_filepath))
        
        # 씬의 중심과 최대 치수 계산
        scene_center, max_dimension = calculate_scene_bounds()
        
        # 임시 카메라 생성
        camera = spawn_temp_camera()
        
        view_names = ["TOP", "FRONT", "RIGHT", "PERSP"]
        image_paths = []
        
        for view in view_names:
            # 각 뷰별로 카메라의 위치와 회전 조정
            set_camera_view(camera, view, scene_center, max_dimension)
            
            # auto_adjust_camera 옵션에 따라 추가 조정이 필요하면 이곳에서 구현 (현재는 카메라 위치와 회전만 적용)
            
            # 카메라 이동 후 UI 업데이트를 위해 잠시 대기
            time.sleep(5)
            
            # 스크린샷 파일 이름 생성
            screenshot_filename = "{}_{}.png".format(base_filepath, view.lower())
            unreal.log("Taking screenshot for {0} view: {1}".format(view, screenshot_filename))
            
            # 스크린샷 캡쳐
            take_view_screenshot(screenshot_filename, export_width, export_height)
            
            # 캡쳐 후 잠시 대기 (스크린샷 저장 시간 고려)
            # time.sleep(10)
            
            image_paths.append(screenshot_filename)
        
        # 임시 카메라 삭제
        destroy_temp_camera(camera)
        
        # 생성된 파일 확인 (비동기 처리일 수 있으므로 시간이 걸릴 수 있음)
        existing_paths = [path for path in image_paths if os.path.exists(path)]
        if not existing_paths:
            raise FileNotFoundError("No screenshot files were generated")
        
        return {"success": True, "image_path": existing_paths}
        
    except Exception as e:
        unreal.log("Error in {0}: {1}".format(tool_name, str(e)))
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
