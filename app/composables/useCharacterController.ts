import * as THREE from 'three'

const MOVE_SPEED = 6    // units per second
const CAM_RADIUS = 12   // distance from character to camera
const CAM_LOOK_UP = 0.8 // lookAt offset above character center

export function useCharacterController(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
) {
  // Capsule: radius 0.4, cylinder height 1.2 → total height 2.0
  // position.y = 1.0 keeps bottom flush with y=0 ground
  const geometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8)
  const material = new THREE.MeshLambertMaterial({ color: 0xe8c49a })
  const character = new THREE.Mesh(geometry, material)
  character.position.set(0, 1.0, 32)
  character.castShadow = true
  scene.add(character)

  // Key state
  const keys = new Set<string>()
  const onKeyDown = (e: KeyboardEvent) => keys.add(e.code)
  const onKeyUp = (e: KeyboardEvent) => keys.delete(e.code)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  // Camera spherical coordinates around character
  // yaw=0 → camera south of character, character faces north (towards cathedral)
  let yaw = 0
  let pitch = 0.35 // radians above horizontal

  const onMouseMove = (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) return
    yaw -= e.movementX * 0.002
    pitch = Math.max(0.1, Math.min(1.1, pitch + e.movementY * 0.002))
  }
  const onCanvasClick = () => canvas.requestPointerLock()
  canvas.addEventListener('click', onCanvasClick)
  window.addEventListener('mousemove', onMouseMove)

  const _moveDir = new THREE.Vector3()
  const _euler = new THREE.Euler(0, 0, 0, 'YXZ')

  function update(delta: number) {
    _moveDir.set(0, 0, 0)
    if (keys.has('KeyW') || keys.has('ArrowUp'))    _moveDir.z -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown'))  _moveDir.z += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft'))  _moveDir.x -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) _moveDir.x += 1

    if (_moveDir.lengthSq() > 0) {
      _moveDir.normalize()
      _euler.set(0, yaw, 0)
      _moveDir.applyEuler(_euler)
      character.position.addScaledVector(_moveDir, MOVE_SPEED * delta)
      character.position.y = 1.0 // flat ground lock
      // Rotate character to face movement direction
      // Convention matches GLTF characters exported from Blender/Mixamo (+Z forward at rest)
      character.rotation.y = Math.atan2(_moveDir.x, _moveDir.z)
    }

    // Camera orbit around character at yaw/pitch
    const cx = character.position.x + CAM_RADIUS * Math.sin(yaw) * Math.cos(pitch)
    const cy = character.position.y + CAM_RADIUS * Math.sin(pitch)
    const cz = character.position.z + CAM_RADIUS * Math.cos(yaw) * Math.cos(pitch)
    camera.position.set(cx, cy, cz)
    camera.lookAt(
      character.position.x,
      character.position.y + CAM_LOOK_UP,
      character.position.z,
    )
  }

  function dispose() {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    canvas.removeEventListener('click', onCanvasClick)
    window.removeEventListener('mousemove', onMouseMove)
    geometry.dispose()
    material.dispose()
    scene.remove(character)
  }

  return { character, update, dispose }
}
