import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, ContactShadows, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

const MODEL_URL = '/models/powerthru-sleeve.glb'
/** Draco decoder, self-hosted from three/examples/jsm/libs/draco/gltf. */
const DRACO_PATH = '/draco/'

/* Authored in metres (the sleeve is 360mm long), Y-up after export, with its
   long axis on Z. It is re-centred from its bounding box at load and turned a
   quarter so the sleeve runs across the frame with the module on top. */
const BASE_SCALE = 3.2
const QUARTER_TURN = Math.PI / 2

/** The four sensing systems, keyed to real mesh names inside the GLB. */
export type SensorKey = 'semg' | 'imu' | 'gsr' | 'temp'

export const SENSORS: {
  key: SensorKey
  label: string
  sub: string
  meshes: string[]
}[] = [
  { key: 'semg', label: 'Muscle', sub: 'sEMG', meshes: ['PTS_sEMG_A', 'PTS_sEMG_B', 'PTS_Ref'] },
  { key: 'imu', label: 'Movement', sub: 'IMU', meshes: ['PTS_Module'] },
  { key: 'gsr', label: 'Sweat', sub: 'GSR', meshes: ['PTS_GSR_A', 'PTS_GSR_B'] },
  { key: 'temp', label: 'Temperature', sub: 'Skin temp', meshes: ['PTS_Module'] },
]

/* The teardown: the sensing stack lifts off the sleeve in layers, in the
   order it is built — skin-side electrodes lowest, then the cradle, then the
   module with everything printed on or set into it. Values are metres of
   lift in model space. */
const MODULE_PARTS = ['PTS_Module', 'PTS_LightBar', 'PTS_Logo_Mark', 'PTS_Logo_Bar', 'PTS_USBC_Cavity', 'PTS_USBC_Tongue']
const LIFT: Record<string, number> = {
  ...Object.fromEntries(MODULE_PARTS.map((n) => [n, 0.062])),
  PTS_Cradle: 0.034,
  PTS_sEMG_A: 0.016,
  PTS_sEMG_B: 0.016,
  PTS_Ref: 0.016,
  PTS_GSR_A: 0.016,
  PTS_GSR_B: 0.016,
}

/** Soft goods: given a fabric sheen so the near-black knit reads on a dark set. */
const FABRIC = /Knit|Mesh_Carbon|Obsidian/

/* ------------------------------------------------------------------ *
 * Camera choreography.
 *
 * Rather than spinning the product on a turntable, the camera travels a
 * continuous arc around a still object — the way a product film is shot.
 * Each key is a "shot"; the scroll position eases between them.
 *   az   azimuth around the product (radians)
 *   el   elevation above the horizon
 *   dist camera distance
 *   tilt how far the assembly is tipped so its sensing face reads
 *   roll a few degrees of camera roll through the transitions
 * ------------------------------------------------------------------ */
type Shot = {
  t: number
  az: number
  el: number
  dist: number
  /** vertical focal length — animating it alongside dist gives a lens change */
  fov: number
  /** lateral framing: slides the product off dead-centre, rule-of-thirds style */
  shift: number
  tgtY: number
  tilt: number
  roll: number
  /** per-beat exposure, so the set gets darker and brighter with the story */
  expo: number
  /** where the lens is aimed: 0 = the whole sleeve, 1 = the sensor module */
  focus: number
}

const SHOTS: Shot[] = [
  // distant, long lens — the whole sleeve held still across the frame
  { t: 0.0, az: -0.5, el: 0.3, dist: 4.6, fov: 22, shift: 0.0, tgtY: 0.0, tilt: 0.36, roll: 0.0, expo: 0.92, focus: 0.0 },
  // the push begins, drifting toward the module
  { t: 0.14, az: -0.16, el: 0.16, dist: 3.4, fov: 26, shift: 0.16, tgtY: 0.0, tilt: 0.32, roll: -0.015, expo: 1.0, focus: 0.3 },
  // a low tracking pass along the knit, lens opening up
  { t: 0.3, az: 0.46, el: 0.05, dist: 2.3, fov: 33, shift: -0.18, tgtY: -0.02, tilt: 0.3, roll: 0.026, expo: 1.06, focus: 0.55 },
  // macro: high over the module as the sensing stack lifts away
  { t: 0.46, az: 0.98, el: 0.62, dist: 1.5, fov: 37, shift: 0.12, tgtY: 0.04, tilt: 0.58, roll: -0.01, expo: 1.14, focus: 1.0 },
  // rising away while the layers hang separated
  { t: 0.62, az: 1.28, el: 0.4, dist: 2.35, fov: 30, shift: -0.14, tgtY: 0.03, tilt: 0.52, roll: 0.018, expo: 1.08, focus: 0.75 },
  // reassembly, settling back
  { t: 0.8, az: 2.36, el: 0.2, dist: 3.5, fov: 25, shift: 0.12, tgtY: 0.0, tilt: 0.42, roll: -0.02, expo: 1.0, focus: 0.3 },
  // long lens again, pulled back to a hero frame
  { t: 1.0, az: 3.12, el: 0.26, dist: 4.4, fov: 22, shift: 0.0, tgtY: 0.0, tilt: 0.36, roll: 0.0, expo: 0.95, focus: 0.0 },
]

const _camDir = new THREE.Vector3()
const _right = new THREE.Vector3()
const _worldUp = new THREE.Vector3(0, 1, 0)
const _tiltAxis = new THREE.Vector3()
const _tiltQuat = new THREE.Quaternion()

const smoothstep = (x: number) => x * x * (3 - 2 * x)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/** Normalised progress across a sub-range of the overall scroll. */
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))

/** Eased interpolation between the two shots bracketing `p`. */
function sampleShot(p: number): Omit<Shot, 't'> {
  let i = 0
  while (i < SHOTS.length - 2 && p > SHOTS[i + 1].t) i++
  const a = SHOTS[i]
  const b = SHOTS[i + 1]
  const k = smoothstep(clamp01((p - a.t) / (b.t - a.t)))
  const mix = (x: number, y: number) => x + (y - x) * k
  return {
    az: mix(a.az, b.az),
    el: mix(a.el, b.el),
    dist: mix(a.dist, b.dist),
    fov: mix(a.fov, b.fov),
    shift: mix(a.shift, b.shift),
    tgtY: mix(a.tgtY, b.tgtY),
    tilt: mix(a.tilt, b.tilt),
    roll: mix(a.roll, b.roll),
    expo: mix(a.expo, b.expo),
    focus: mix(a.focus, b.focus),
  }
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex w-32 flex-col items-center gap-3">
        <div className="h-px w-full overflow-hidden bg-carbon-600">
          <div className="h-full bg-pulse transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <span className="label">{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

type PartState = { mesh: THREE.Object3D; home: THREE.Vector3; lift: number }

const _focusWorld = new THREE.Vector3()

function Stage({
  progress,
  compact,
  zoom,
}: {
  progress: MotionValue<number>
  compact: boolean
  zoom: number
}) {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH)
  const group = useRef<THREE.Group>(null)
  const keyLight = useRef<THREE.DirectionalLight>(null)
  const rimLight = useRef<THREE.DirectionalLight>(null)

  const { model, parts, offset, moduleCentre } = useMemo(() => {
    const c = scene.clone(true)

    // Centre the assembly on its own bounds, so the orbit pivots on the product.
    const box = new THREE.Box3().setFromObject(c)
    const offset = box.getCenter(new THREE.Vector3()).negate()

    // Where the module sits, so the lens can be pulled onto it for close-ups.
    const moduleBox = new THREE.Box3()
    c.traverse((o) => {
      if (MODULE_PARTS.includes(o.name)) moduleBox.expandByObject(o)
    })
    const moduleCentre = moduleBox.isEmpty()
      ? new THREE.Vector3()
      : moduleBox.getCenter(new THREE.Vector3()).add(offset).applyAxisAngle(_worldUp, QUARTER_TURN)

    const parts: PartState[] = []
    c.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      const src = m.material as THREE.MeshStandardMaterial
      if (src) {
        let mat: THREE.MeshStandardMaterial
        if (FABRIC.test(src.name)) {
          // Knit, mesh and rubber trims: a cloth sheen picks out the weave and
          // gives the silhouette a soft edge glow instead of a black hole.
          // Copy the standard props across, then restore the physical defines
          // that MeshStandardMaterial.copy overwrites (sheen needs them).
          const fab = new THREE.MeshPhysicalMaterial()
          THREE.MeshStandardMaterial.prototype.copy.call(fab, src)
          fab.defines = { STANDARD: '', PHYSICAL: '' }
          fab.color.multiplyScalar(3.2)
          fab.sheen = 1
          fab.sheenRoughness = 0.42
          fab.sheenColor = new THREE.Color('#6E757E')
          fab.side = THREE.DoubleSide
          mat = fab
        } else {
          mat = src.clone()
        }
        mat.envMapIntensity = 0.95
        m.material = mat
      }
      const lift = LIFT[m.name] ?? 0
      parts.push({ mesh: m, home: m.position.clone(), lift })
    })
    return { model: c, parts, offset, moduleCentre }
  }, [scene])

  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const p = progress.get()
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.1)
    const shot = sampleShot(p)

    /* A slow, bounded sway keeps the frame alive even where the scroll value
       is parked (hero, reserve). It must stay bounded: an open-ended drift
       accumulates with time on the page and eventually swings the camera
       round to look straight down the sleeve. */
    const az = shot.az + Math.sin(t * 0.16) * 0.26
    const el = shot.el + Math.sin(t * 0.35) * 0.018
    const dist = (shot.dist + Math.sin(t * 0.23) * 0.03) * (compact ? 1.22 : 1)

    // Spherical orbit around the product.
    const cosEl = Math.cos(el)
    desired.current.set(Math.sin(az) * cosEl * dist, Math.sin(el) * dist + shot.tgtY, Math.cos(az) * cosEl * dist)

    const cam = state.camera as THREE.PerspectiveCamera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, desired.current.x, 3.2, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, desired.current.y, 3.2, dt)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, desired.current.z, 3.2, dt)

    /* Focal length rides with the move. Pushing in while the lens widens is
       the dolly-zoom that reads as "cinematic" rather than a plain orbit. */
    const fov = compact ? shot.fov * 1.08 : shot.fov
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, fov, 3, dt)
      cam.updateProjectionMatrix()
    }

    /* Slide the aim sideways along the camera's own right vector so the
       product sits off dead-centre — the copy column gets room to breathe. */
    cam.getWorldDirection(_camDir)
    _right.crossVectors(_camDir, _worldUp).normalize()
    // Aim point: the whole sleeve, the module, or somewhere on the way between.
    _focusWorld.set(0, 0, 0)
    if (group.current) {
      _focusWorld.copy(moduleCentre).applyMatrix4(group.current.matrixWorld)
      _focusWorld.multiplyScalar(shot.focus)
    }
    _focusWorld.y += shot.tgtY
    _focusWorld.addScaledVector(_right, shot.shift * (compact ? 0.35 : 1))
    target.current.x = THREE.MathUtils.damp(target.current.x, _focusWorld.x, 3, dt)
    target.current.y = THREE.MathUtils.damp(target.current.y, _focusWorld.y, 3, dt)
    target.current.z = THREE.MathUtils.damp(target.current.z, _focusWorld.z, 3, dt)
    cam.lookAt(target.current)
    cam.rotateZ(shot.roll)

    // exposure shifts the mood beat to beat
    state.gl.toneMappingExposure = THREE.MathUtils.damp(state.gl.toneMappingExposure, shot.expo, 2.4, dt)

    /* The key rides with the camera — as on a real set, the crew moves the
       key with the dolly so the subject never falls into silhouette. It is
       offset up and to the right, and breathes slightly for a live highlight. */
    if (keyLight.current) {
      const swing = Math.sin(t * 0.3) * 0.7
      keyLight.current.position
        .copy(cam.position)
        .addScaledVector(_right, 1.7 + swing)
        .addScaledVector(_worldUp, 2.4)
    }
    /* The rim runs its own slow arc, so a cool edge sweeps the product
       independently of the camera move. */
    if (rimLight.current) {
      const ra = -t * 0.19 + 2.2
      rimLight.current.position.set(Math.sin(ra) * 4.5, 1.1, Math.cos(ra) * 4.5)
    }

    if (group.current) {
      const g = group.current
      /* Tip the assembly about the axis running across the camera's view, not
         the world X axis — otherwise the pitch turns into a screen-space roll
         once the camera arcs round the side and the product looks toppled. */
      _tiltAxis.set(Math.cos(az), 0, -Math.sin(az))
      _tiltQuat.setFromAxisAngle(_tiltAxis, shot.tilt)
      g.quaternion.slerp(_tiltQuat, 1 - Math.exp(-2.6 * dt))
      g.position.y = Math.sin(t * 0.55) * 0.024
      const s = BASE_SCALE * zoom * (1 + range(p, 0.86, 1) * 0.05)
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x || s, s, 3, dt))
    }

    // Exploded view: separates 0.42→0.62, holds, reassembles 0.74→0.88.
    const out = range(p, 0.42, 0.62)
    const back = range(p, 0.74, 0.88)
    const eased = smoothstep(out * (1 - back))
    for (const part of parts) {
      if (part.lift) part.mesh.position.y = part.home.y + part.lift * eased
    }
  })

  return (
    <>
      <ambientLight intensity={0.58} />
      <directionalLight ref={keyLight} position={[3, 4, 3]} intensity={2.5} color="#FFFFFF" />
      <directionalLight ref={rimLight} position={[-3, 1.2, -2]} intensity={0.7} color="#3BE0CF" />
      <directionalLight position={[-1.5, -1.2, 1.5]} intensity={0.5} color="#0B6CFF" />
      <spotLight position={[0, 5, 1]} angle={0.6} penumbra={1} intensity={0.9} color="#FFFFFF" />

      <group ref={group} scale={BASE_SCALE * zoom}>
        {/* a quarter turn lays the sleeve across the frame, module on top */}
        <group rotation={[0, QUARTER_TURN, 0]}>
          <primitive object={model} position={offset} />
        </group>
      </group>
    </>
  )
}

export default function StoryScene({
  progress,
  className = '',
  zoom = 1,
}: {
  progress: MotionValue<number>
  className?: string
  /** Multiplies the assembly scale — lets tighter containers fill the frame. */
  zoom?: number
}) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [quality, setQuality] = useState<'high' | 'low'>('high')

  useEffect(() => {
    // Mobile gets a lighter scene: lower dpr, smaller env map, no contact shadows.
    const mq = window.matchMedia('(max-width: 768px)')
    const apply = () => setQuality(mq.matches ? 'low' : 'high')
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const node = host.current
    if (!node) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    /* No `relative` here: callers pass their own positioning (the story passes
       `absolute inset-0`, and Tailwind's .relative would override it, knocking
       the canvas into flow). Every call site already sits in a positioned box,
       so the vignette below anchors correctly regardless. */
    <div ref={host} className={className}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={quality === 'low' ? [1, 2] : [1, 2.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.6, 3.6], fov: 28 }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.06
        }}
      >
        {/* atmospheric falloff gives the dark set some depth */}
        <fog attach="fog" args={['#0A0B0D', 5.2, 11]} />

        <Suspense fallback={<Loader />}>
          <Stage progress={progress} compact={quality === 'low'} zoom={zoom} />
          {/* studio environment built in-scene: reflections with no external HDR */}
          <Environment resolution={quality === 'low' ? 256 : 512}>
            <Lightformer form="rect" intensity={4.2} color="#FFFFFF" position={[0, 3, 2]} scale={[7, 3, 1]} rotation={[-Math.PI / 3, 0, 0]} />
            <Lightformer form="rect" intensity={0.35} color="#3BE0CF" position={[-4, 0.5, -2]} scale={[4, 4, 1]} rotation={[0, Math.PI / 2.4, 0]} />
            <Lightformer form="rect" intensity={0.95} color="#0B6CFF" position={[4, -1, 1]} scale={[4, 3, 1]} rotation={[0, -Math.PI / 2.6, 0]} />
            <Lightformer form="ring" intensity={1.6} color="#FFFFFF" position={[0, -2, 3]} scale={3} />
          </Environment>
          {quality === 'high' && (
            <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={5} blur={2.8} far={2} color="#000000" />
          )}
        </Suspense>

      </Canvas>

      {/* lens vignette — keeps the eye on the product */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(10,11,13,0.4) 100%)' }}
      />
    </div>
  )
}

useGLTF.preload(MODEL_URL, DRACO_PATH)
