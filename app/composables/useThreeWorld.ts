import * as THREE from 'three'
import { useCharacterController } from './useCharacterController'

// Warm palette derived from the art style: earth tones, soft light
const PALETTE = {
  sky: 0x8fb8d4,
  fog: 0x8fb8d4,
  ground: 0x8b7355,
  plaza: 0xc4a882,
  stone: 0x9e9e8a,
  timber: 0x8b6914,
  roof: 0x4a3728,
  water: 0x4a7fa5,
  bridge: 0x7d6b55,
  ambientLight: 0xfff5e4,
  sunLight: 0xffd4a0,
}

export function useThreeWorld(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(PALETTE.sky)
  scene.fog = new THREE.FogExp2(PALETTE.fog, 0.008)

  // Camera — third-person starting position looking at the cathedral
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    500,
  )
  camera.position.set(0, 12, 35)
  camera.lookAt(0, 2, 0)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  // Lighting — warm sun from upper right, soft fill
  const ambient = new THREE.AmbientLight(PALETTE.ambientLight, 0.4)
  scene.add(ambient)

  const sun = new THREE.DirectionalLight(PALETTE.sunLight, 1.8)
  sun.position.set(40, 60, 30)
  sun.castShadow = true
  sun.shadow.mapSize.width = 2048
  sun.shadow.mapSize.height = 2048
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 300
  sun.shadow.camera.left = -80
  sun.shadow.camera.right = 80
  sun.shadow.camera.top = 80
  sun.shadow.camera.bottom = -80
  sun.shadow.bias = -0.001
  scene.add(sun)

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshLambertMaterial({ color: PALETTE.ground }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // Hub plaza — hexagonal, stone-colored
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 0.15, 6),
    new THREE.MeshLambertMaterial({ color: PALETTE.plaza }),
  )
  plaza.position.y = 0.08
  plaza.receiveShadow = true
  scene.add(plaza)

  // Cathedral — stone base + timber upper + split roof (placeholder geometry)
  const cathedralGroup = new THREE.Group()

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(10, 5, 14),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  base.position.y = 2.5
  base.castShadow = true
  base.receiveShadow = true
  cathedralGroup.add(base)

  const timberUpper = new THREE.Mesh(
    new THREE.BoxGeometry(7, 6, 11),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  timberUpper.position.y = 8
  timberUpper.castShadow = true
  cathedralGroup.add(timberUpper)

  // Western gable side of the split roof
  const gable = new THREE.Mesh(
    new THREE.ConeGeometry(6, 4, 4),
    new THREE.MeshLambertMaterial({ color: PALETTE.roof }),
  )
  gable.rotation.y = Math.PI / 4
  gable.position.y = 13
  gable.castShadow = true
  cathedralGroup.add(gable)

  // Japanese eave overhang hint on the gable — a shallow flared cap
  const eave = new THREE.Mesh(
    new THREE.CylinderGeometry(7.5, 6.5, 0.4, 4),
    new THREE.MeshLambertMaterial({ color: PALETTE.roof }),
  )
  eave.rotation.y = Math.PI / 4
  eave.position.y = 11.2
  eave.castShadow = true
  cathedralGroup.add(eave)

  scene.add(cathedralGroup)

  // Arrival water — pool south of the hub
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 28),
    new THREE.MeshLambertMaterial({
      color: PALETTE.water,
      transparent: true,
      opacity: 0.85,
    }),
  )
  water.rotation.x = -Math.PI / 2
  water.position.set(0, 0.05, 34)
  scene.add(water)

  // Stone bridge over the water
  const bridgeGroup = new THREE.Group()

  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.5, 10),
    new THREE.MeshLambertMaterial({ color: PALETTE.bridge }),
  )
  deck.position.y = 0.8
  deck.castShadow = true
  deck.receiveShadow = true
  bridgeGroup.add(deck)

  // Bridge railings
  for (const side of [-2.5, 2.5]) {
    const railing = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.8, 10),
      new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
    )
    railing.position.set(side, 1.4, 0)
    railing.castShadow = true
    bridgeGroup.add(railing)
  }

  bridgeGroup.position.set(0, 0, 34)
  scene.add(bridgeGroup)

  const controller = useCharacterController(scene, camera, canvas)

  // Resize handler
  function onResize() {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  }
  window.addEventListener('resize', onResize)

  // Render loop
  const clock = new THREE.Clock()
  let rafId: number
  function animate() {
    rafId = requestAnimationFrame(animate)
    controller.update(clock.getDelta())
    renderer.render(scene, camera)
  }
  animate()

  // Dispose — call on component unmount to prevent GPU memory leaks
  function dispose() {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', onResize)
    controller.dispose()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        }
        else {
          obj.material.dispose()
        }
      }
    })
    renderer.dispose()
  }

  return { scene, camera, renderer, dispose }
}
