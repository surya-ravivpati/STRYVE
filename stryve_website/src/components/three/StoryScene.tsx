import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, ContactShadows, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

const MODEL_URL = '/models/stryve-wearable.glb'

/* Authored in metres (157mm across), Y-up after export. Bbox centre sits at
   y = -0.0574, so the assembly is lifted back to the origin before scaling. */
const MODEL_CENTER_Y = -0.0574
const BASE_SCALE = 5.0

/** The four sensing systems, keyed to real mesh names inside the GLB. */
export type SensorKey = 'semg' | 'imu' | 'gsr' | 'temp'

export const SENSORS: {
  key: SensorKey
  label: string
  sub: string
  meshes: string[]
  anchor: [number, number, number]
}[] = [
  { key: 'semg', label: 'Muscle', sub: 'sEMG', meshes: ['semg_electrode_pad'], anchor: [0.068, -0.039, 0] },
  { key: 'imu', label: 'Movement', sub: 'IMU', meshes: ['imu_sensor_pod'], anchor: [-0.068, -0.039, 0] },
  { key: 'gsr', label: 'Sweat', sub: 'GSR', meshes: ['gsr_electrode_pad_a', 'gsr_electrode_pad_b'], anchor: [-0.07, -0.088, 0] },
  { key: 'temp', label: 'Temperature', sub: 'Skin temp', meshes: ['temperature_sensor_mount'], anchor: [0.071, -0.074, 0] },
]

const SENSOR_MESHES = new Set(SENSORS.flatMap((s) => s.meshes))

/** Branding geometry rides with the part it is printed on, so the wordmark
    never detaches from the body or strap during the exploded view. */
const LOGO_HOST: Record<string, string> = {
  VIZ_Logo_Wrap_Strap: 'wearable_strap',
  VIZ_Logo_Wrap_Body: 'main_enclosure_base',
  VIZ_Logo_Decal: 'main_enclosure_lid',
}

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
type Shot = { t: number; az: number; el: number; dist: number; tgtY: number; tilt: number; roll: number }

const SHOTS: Shot[] = [
  { t: 0.0, az: -0.5, el: 0.17, dist: 3.62, tgtY: 0.0, tilt: 0.42, roll: 0.0 },
  { t: 0.2, az: -0.08, el: 0.1, dist: 3.14, tgtY: 0.0, tilt: 0.34, roll: -0.014 },
  { t: 0.42, az: 0.72, el: 0.05, dist: 2.82, tgtY: -0.04, tilt: 0.56, roll: 0.022 },
  { t: 0.58, az: 1.24, el: 0.32, dist: 3.02, tgtY: 0.02, tilt: 0.62, roll: 0.0 },
  { t: 0.76, az: 2.02, el: 0.23, dist: 3.2, tgtY: 0.0, tilt: 0.46, roll: -0.02 },
  { t: 1.0, az: 2.84, el: 0.15, dist: 3.62, tgtY: 0.0, tilt: 0.38, roll: 0.0 },
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
  return {
    az: a.az + (b.az - a.az) * k,
    el: a.el + (b.el - a.el) * k,
    dist: a.dist + (b.dist - a.dist) * k,
    tgtY: a.tgtY + (b.tgtY - a.tgtY) * k,
    tilt: a.tilt + (b.tilt - a.tilt) * k,
    roll: a.roll + (b.roll - a.roll) * k,
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

type PartState = { mesh: THREE.Object3D; home: THREE.Vector3; dir: THREE.Vector3 }

function Stage({
  progress,
  compact,
  zoom,
}: {
  progress: MotionValue<number>
  compact: boolean
  zoom: number
}) {
  const { scene } = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const keyLight = useRef<THREE.DirectionalLight>(null)
  const rimLight = useRef<THREE.DirectionalLight>(null)

  const { model, parts } = useMemo(() => {
    const c = scene.clone(true)
    const centre = new THREE.Vector3(0, MODEL_CENTER_Y, 0)

    // First pass: every mesh's outward direction from the assembly centre.
    const dirs = new Map<string, THREE.Vector3>()
    c.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      const world = new THREE.Vector3()
      m.getWorldPosition(world)
      const d = world.clone().sub(centre)
      if (d.lengthSq() < 1e-6) d.set(0, 1, 0)
      dirs.set(m.name, d.normalize())
    })

    const parts: PartState[] = []
    c.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      if (m.material) {
        m.material = (m.material as THREE.Material).clone()
        const mat = m.material as THREE.MeshStandardMaterial
        mat.envMapIntensity = 0.95
        // Lift the brand mark so it reads as printed colour, not dark plastic.
        if (/Logo/i.test(mat.name)) {
          mat.color.setHex(0xff421d)
          mat.emissive = new THREE.Color(0xff421d)
          mat.emissiveIntensity = 0.32
          mat.roughness = 0.45
        }
      }

      // Branding inherits the travel of the part it is printed on.
      const host = LOGO_HOST[m.name]
      const dir = (host ? dirs.get(host) : dirs.get(m.name))!.clone()
      const travels = host ? SENSOR_MESHES.has(host) : SENSOR_MESHES.has(m.name)
      dir.multiplyScalar(travels ? 0.078 : 0.02)

      parts.push({ mesh: m, home: m.position.clone(), dir })
    })
    return { model: c, parts }
  }, [scene])

  const target = useRef(new THREE.Vector3())
  const desired = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const p = progress.get()
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.1)
    const shot = sampleShot(p)

    /* A slow continuous drift keeps the frame alive even where the scroll
       value is parked (hero, reserve) — the shot still leads the movement. */
    const az = shot.az + t * 0.055
    const el = shot.el + Math.sin(t * 0.35) * 0.018
    const dist = (shot.dist + Math.sin(t * 0.23) * 0.03) * (compact ? 1.5 : 1)

    // Spherical orbit around the product.
    const cosEl = Math.cos(el)
    desired.current.set(Math.sin(az) * cosEl * dist, Math.sin(el) * dist + shot.tgtY, Math.cos(az) * cosEl * dist)

    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, desired.current.x, 3.2, dt)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, desired.current.y, 3.2, dt)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, desired.current.z, 3.2, dt)

    target.current.set(0, THREE.MathUtils.damp(target.current.y, shot.tgtY, 3, dt), 0)
    cam.lookAt(target.current)
    cam.rotateZ(shot.roll)

    /* The key rides with the camera — as on a real set, the crew moves the
       key with the dolly so the subject never falls into silhouette. It is
       offset up and to the right, and breathes slightly for a live highlight. */
    if (keyLight.current) {
      cam.getWorldDirection(_camDir)
      _right.crossVectors(_camDir, _worldUp).normalize()
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
      part.mesh.position.set(
        part.home.x + part.dir.x * eased,
        part.home.y + part.dir.y * eased,
        part.home.z + part.dir.z * eased,
      )
    }
  })

  return (
    <>
      <ambientLight intensity={0.58} />
      <directionalLight ref={keyLight} position={[3, 4, 3]} intensity={2.5} color="#FFFFFF" />
      <directionalLight ref={rimLight} position={[-3, 1.2, -2]} intensity={0.7} color="#3BE0CF" />
      <directionalLight position={[-1.5, -1.2, 1.5]} intensity={0.5} color="#FF421D" />
      <spotLight position={[0, 5, 1]} angle={0.6} penumbra={1} intensity={0.9} color="#FFFFFF" />

      <group ref={group} scale={BASE_SCALE * zoom}>
        <primitive object={model} position={[0, -MODEL_CENTER_Y, 0]} />
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
        dpr={quality === 'low' ? [1, 1.4] : [1, 1.9]}
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
          <Environment resolution={quality === 'low' ? 128 : 256}>
            <Lightformer form="rect" intensity={4.2} color="#FFFFFF" position={[0, 3, 2]} scale={[7, 3, 1]} rotation={[-Math.PI / 3, 0, 0]} />
            <Lightformer form="rect" intensity={0.35} color="#3BE0CF" position={[-4, 0.5, -2]} scale={[4, 4, 1]} rotation={[0, Math.PI / 2.4, 0]} />
            <Lightformer form="rect" intensity={0.95} color="#FF421D" position={[4, -1, 1]} scale={[4, 3, 1]} rotation={[0, -Math.PI / 2.6, 0]} />
            <Lightformer form="ring" intensity={1.6} color="#FFFFFF" position={[0, -2, 3]} scale={3} />
          </Environment>
          {quality === 'high' && (
            <ContactShadows position={[0, -0.72, 0]} opacity={0.5} scale={5} blur={2.8} far={2} color="#000000" />
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

useGLTF.preload(MODEL_URL)
