import * as THREE from 'three'
import type { Ref } from 'vue'
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
  cream: 0xf5f0e0,
  darkBrown: 0x1e0e06,
  bookCover: 0x5c3d1e,
  japanGreen: 0x6b8e7a,
  softwareBlue: 0x5c7a8b,
  disneyTan: 0x8b7a5c,
}

export function useThreeWorld(canvas: HTMLCanvasElement, activeLandmarkId: Ref<string | null>) {
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

  // ─── Lutheran Land ───────────────────────────────────────────────────────────
  // Land origin: world (0, 0, -30). Landmark positions below are JSON offsets
  // from that origin, matching content/landmarks/lutheran.json exactly.
  const LX = 0
  const LZ = -30

  // The Church — confessional-church — JSON (0, 0, -12)
  const churchGroup = new THREE.Group()

  const churchBase = new THREE.Mesh(
    new THREE.BoxGeometry(6, 3, 8),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  churchBase.position.y = 1.5
  churchBase.castShadow = true
  churchBase.receiveShadow = true
  churchGroup.add(churchBase)

  const churchUpper = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 6),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  churchUpper.position.y = 4.5
  churchUpper.castShadow = true
  churchGroup.add(churchUpper)

  const churchRoof = new THREE.Mesh(
    new THREE.ConeGeometry(4, 3, 4),
    new THREE.MeshLambertMaterial({ color: PALETTE.roof }),
  )
  churchRoof.rotation.y = Math.PI / 4
  churchRoof.position.y = 7.5
  churchRoof.castShadow = true
  churchGroup.add(churchRoof)

  churchGroup.position.set(LX + 0, 0, LZ + -12)
  scene.add(churchGroup)

  // Luther's Rose — luther-rose — JSON (10, 0, -6)
  // Floor medallion: cream disc with dark cross extruded above it
  const roseGroup = new THREE.Group()

  const roseDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.2, 0.2, 24),
    new THREE.MeshLambertMaterial({ color: PALETTE.cream }),
  )
  roseDisc.position.y = 0.1
  roseDisc.receiveShadow = true
  roseGroup.add(roseDisc)

  const crossV = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.25, 2.0),
    new THREE.MeshLambertMaterial({ color: PALETTE.darkBrown }),
  )
  crossV.position.y = 0.325
  roseGroup.add(crossV)

  const crossH = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.25, 0.35),
    new THREE.MeshLambertMaterial({ color: PALETTE.darkBrown }),
  )
  crossH.position.y = 0.325
  roseGroup.add(crossH)

  roseGroup.position.set(LX + 10, 0, LZ + -6)
  scene.add(roseGroup)

  // Book of Concord — book-of-concord — JSON (-10, 0, -6)
  // Standing book on a stone base — tall thin box, subordinate lectern form
  const bookGroup = new THREE.Group()

  const bookBase = new THREE.Mesh(
    new THREE.BoxGeometry(2.0, 0.3, 1.5),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  bookBase.position.y = 0.15
  bookBase.receiveShadow = true
  bookGroup.add(bookBase)

  const bookCover = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 3.5, 0.3),
    new THREE.MeshLambertMaterial({ color: PALETTE.bookCover }),
  )
  bookCover.position.y = 2.0
  bookCover.castShadow = true
  bookGroup.add(bookCover)

  bookGroup.position.set(LX + -10, 0, LZ + -6)
  scene.add(bookGroup)

  // Baptismal Font — baptismal-font — JSON (0, 0, -5)
  // Stone basin on pedestal, water surface inside
  const fontGroup = new THREE.Group()

  const fontPedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  fontPedestal.position.y = 0.6
  fontPedestal.castShadow = true
  fontPedestal.receiveShadow = true
  fontGroup.add(fontPedestal)

  const fontBasin = new THREE.Mesh(
    new THREE.CylinderGeometry(0.9, 0.7, 0.75, 8),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  fontBasin.position.y = 1.575
  fontBasin.castShadow = true
  fontGroup.add(fontBasin)

  const fontWater = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.05, 8),
    new THREE.MeshLambertMaterial({ color: PALETTE.water, transparent: true, opacity: 0.9 }),
  )
  fontWater.position.y = 1.975
  fontGroup.add(fontWater)

  fontGroup.position.set(LX + 0, 0, LZ + -5)
  scene.add(fontGroup)

  // Daily Vocation — vocation — JSON (8, 0, 0)
  // Low workbench cluster: bench top, four legs, toolbox, leaning handle
  const vocationGroup = new THREE.Group()

  const benchTop = new THREE.Mesh(
    new THREE.BoxGeometry(3.0, 0.2, 1.4),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  benchTop.position.y = 1.0
  benchTop.castShadow = true
  benchTop.receiveShadow = true
  vocationGroup.add(benchTop)

  for (const [bx, bz] of [[-1.3, -0.55], [1.3, -0.55], [-1.3, 0.55], [1.3, 0.55]] as [number, number][]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.9, 0.2),
      new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
    )
    leg.position.set(bx, 0.45, bz)
    vocationGroup.add(leg)
  }

  const toolbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.4, 0.6),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  toolbox.position.set(0.8, 1.3, 0)
  vocationGroup.add(toolbox)

  const toolHandle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 1.1, 6),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  toolHandle.position.set(-0.7, 1.55, 0)
  toolHandle.rotation.z = 0.3
  vocationGroup.add(toolHandle)

  vocationGroup.position.set(LX + 8, 0, LZ + 0)
  scene.add(vocationGroup)

  // The Missouri Synod — lcms — JSON (-8, 0, 0)
  // Denominational marker: stone post, plaza-tone sign board, roof-tone finial
  const lcmsGroup = new THREE.Group()

  const lcmsPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 3.8, 0.25),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  lcmsPost.position.y = 1.9
  lcmsPost.castShadow = true
  lcmsGroup.add(lcmsPost)

  const lcmsSign = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.4, 0.2),
    new THREE.MeshLambertMaterial({ color: PALETTE.plaza }),
  )
  lcmsSign.position.y = 3.9
  lcmsGroup.add(lcmsSign)

  const lcmsFinial = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.6, 4),
    new THREE.MeshLambertMaterial({ color: PALETTE.roof }),
  )
  lcmsFinial.rotation.y = Math.PI / 4
  lcmsFinial.position.y = 5.0
  lcmsGroup.add(lcmsFinial)

  lcmsGroup.position.set(LX + -8, 0, LZ + 0)
  scene.add(lcmsGroup)
  // ─────────────────────────────────────────────────────────────────────────────

  // ─── Lutheran Media Land ─────────────────────────────────────────────────────
  // NW spoke: x ≈ -50, z ≈ -50
  const lmTerrain = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  lmTerrain.rotation.x = -Math.PI / 2
  lmTerrain.position.set(-50, 0.02, -50)
  lmTerrain.receiveShadow = true
  scene.add(lmTerrain)

  const lmMarker = new THREE.Group()
  const lmPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 3.8, 0.25),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  lmPost.position.y = 1.9
  lmPost.castShadow = true
  lmMarker.add(lmPost)
  const lmSign = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.4, 0.2),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  lmSign.position.y = 3.9
  lmMarker.add(lmSign)
  const lmAntenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.15, 1.2, 6),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  lmAntenna.position.y = 5.5
  lmMarker.add(lmAntenna)
  lmMarker.position.set(-50, 0, -50)
  scene.add(lmMarker)

  // Synod Stories bulletin board — faces hub (rotation PI/4 points +Z face toward origin)
  const billboardGroup = new THREE.Group()
  const bPostMat = new THREE.MeshLambertMaterial({ color: PALETTE.stone })
  for (const bx of [-1.6, 1.6]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.0, 0.2), bPostMat)
    post.position.set(bx, 2.0, 0)
    post.castShadow = true
    billboardGroup.add(post)
  }
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 2.0, 0.15),
    new THREE.MeshLambertMaterial({ color: PALETTE.timber }),
  )
  board.position.y = 3.1
  billboardGroup.add(board)
  const topRail = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.2, 0.25),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  topRail.position.y = 4.2
  billboardGroup.add(topRail)
  billboardGroup.position.set(-42, 0, -42)
  billboardGroup.rotation.y = Math.PI / 4
  scene.add(billboardGroup)

  // ─── Japanese Land ───────────────────────────────────────────────────────────
  // NE spoke: x ≈ +50, z ≈ -50
  const japTerrain = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshLambertMaterial({ color: PALETTE.japanGreen }),
  )
  japTerrain.rotation.x = -Math.PI / 2
  japTerrain.position.set(50, 0.02, -50)
  japTerrain.receiveShadow = true
  scene.add(japTerrain)

  const japMarker = new THREE.Group()
  const japPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 3.8, 0.25),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  japPost.position.y = 1.9
  japPost.castShadow = true
  japMarker.add(japPost)
  const japSign = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.4, 0.2),
    new THREE.MeshLambertMaterial({ color: PALETTE.japanGreen }),
  )
  japSign.position.y = 3.9
  japMarker.add(japSign)
  const japFinial = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 0.7, 4),
    new THREE.MeshLambertMaterial({ color: PALETTE.roof }),
  )
  japFinial.rotation.y = Math.PI / 4
  japFinial.position.y = 5.0
  japMarker.add(japFinial)
  japMarker.position.set(50, 0, -50)
  scene.add(japMarker)

  // ─── Software Land ───────────────────────────────────────────────────────────
  // SW spoke: x ≈ -50, z ≈ +50
  const swTerrain = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshLambertMaterial({ color: PALETTE.softwareBlue }),
  )
  swTerrain.rotation.x = -Math.PI / 2
  swTerrain.position.set(-50, 0.02, 50)
  swTerrain.receiveShadow = true
  scene.add(swTerrain)

  const swMarker = new THREE.Group()
  const swPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 3.8, 0.25),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  swPost.position.y = 1.9
  swPost.castShadow = true
  swMarker.add(swPost)
  const swSign = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.4, 0.2),
    new THREE.MeshLambertMaterial({ color: PALETTE.softwareBlue }),
  )
  swSign.position.y = 3.9
  swMarker.add(swSign)
  const swFinial = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.4, 0.5),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  swFinial.position.y = 5.1
  swMarker.add(swFinial)
  swMarker.position.set(-50, 0, 50)
  scene.add(swMarker)

  // ─── Walt Disney Land ────────────────────────────────────────────────────────
  // SE spoke: x ≈ +50, z ≈ +50
  const wdTerrain = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshLambertMaterial({ color: PALETTE.disneyTan }),
  )
  wdTerrain.rotation.x = -Math.PI / 2
  wdTerrain.position.set(50, 0.02, 50)
  wdTerrain.receiveShadow = true
  scene.add(wdTerrain)

  const wdMarker = new THREE.Group()
  const wdPost = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 3.8, 0.25),
    new THREE.MeshLambertMaterial({ color: PALETTE.stone }),
  )
  wdPost.position.y = 1.9
  wdPost.castShadow = true
  wdMarker.add(wdPost)
  const wdSign = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.4, 0.2),
    new THREE.MeshLambertMaterial({ color: PALETTE.disneyTan }),
  )
  wdSign.position.y = 3.9
  wdMarker.add(wdSign)
  const wdFinial = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 1.0, 8),
    new THREE.MeshLambertMaterial({ color: PALETTE.roof }),
  )
  wdFinial.position.y = 5.4
  wdMarker.add(wdFinial)
  wdMarker.position.set(50, 0, 50)
  scene.add(wdMarker)
  // ─────────────────────────────────────────────────────────────────────────────

  // Proximity zones — ring on ground + character distance check
  const zones: { id: string; x: number; z: number; r2: number }[] = []
  const rings: { mesh: THREE.Mesh; phase: number }[] = []

  function addLandmarkZone(id: string, x: number, z: number) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.8, 2.5, 48),
      new THREE.MeshBasicMaterial({
        color: 0xe8c49a,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.set(x, 0.06, z)
    scene.add(ring)
    rings.push({ mesh: ring, phase: Math.random() * Math.PI * 2 })
    zones.push({ id, x, z, r2: 9 }) // 3-unit trigger radius
  }

  addLandmarkZone('synod-stories-billboard', -42, -42)
  addLandmarkZone('confessional-church', LX + 0, LZ + -12)
  addLandmarkZone('luther-rose', LX + 10, LZ + -6)
  addLandmarkZone('book-of-concord', LX + -10, LZ + -6)
  addLandmarkZone('baptismal-font', LX + 0, LZ + -5)
  addLandmarkZone('vocation', LX + 8, LZ + 0)
  addLandmarkZone('lcms', LX + -8, LZ + 0)

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
  let elapsed = 0
  let rafId: number

  function checkZones() {
    const { x, z } = controller.character.position
    let found: string | null = null
    let closestD2 = Infinity
    for (const zone of zones) {
      const dx = x - zone.x
      const dz = z - zone.z
      const d2 = dx * dx + dz * dz
      if (d2 < zone.r2 && d2 < closestD2) {
        found = zone.id
        closestD2 = d2
      }
    }
    if (found !== activeLandmarkId.value) activeLandmarkId.value = found
  }

  function animate() {
    rafId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    elapsed += delta
    controller.update(delta)
    checkZones()
    for (const { mesh, phase } of rings) {
      const pulse = Math.sin(elapsed * 1.8 + phase) * 0.5 + 0.5
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = 0.12 + pulse * 0.22
      const s = 0.96 + pulse * 0.08
      mesh.scale.set(s, s, 1)
    }
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
