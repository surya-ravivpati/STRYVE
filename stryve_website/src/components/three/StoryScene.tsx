import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, ContactShadows, Html, useProgress } from '@react-three/drei'
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing'
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
}

const SHOTS: Shot[] = [
  // distant, long lens — the product held small and still
  { t: 0.0, az: -0.62, el: 0.3, dist: 4.7, fov: 21, shift: 0.0, tgtY: 0.0, tilt: 0.4, roll: 0.0, expo: 0.9 },
  // the push begins
  { t: 0.14, az: -0.18, el: 0.15, dist: 3.35, fov: 25, shift: 0.16, tgtY: 0.0, tilt: 0.34, roll: -0.015, expo: 1.0 },
  // travelling past the band, lens opening up
  { t: 0.3, az: 0.52, el: 0.04, dist: 2.35, fov: 33, shift: -0.2, tgtY: -0.03, tilt: 0.3, roll: 0.026, expo: 1.05 },
  // macro: high over the sensing face as the assembly opens
  { t: 0.46, az: 1.12, el: 0.6, dist: 1.95, fov: 38, shift: 0.14, tgtY: 0.03, tilt: 0.64, roll: -0.01, expo: 1.14 },
  // rising away while the parts hang separated
  { t: 0.62, az: 1.74, el: 0.32, dist: 2.95, fov: 30, shift: -0.14, tgtY: 0.01, tilt: 0.6, roll: 0.018, expo: 1.08 },
  // reassembly, settling back
  { t: 0.8, az: 2.42, el: 0.19, dist: 3.7, fov: 25, shift: 0.12, tgtY: 0.0, tilt: 0.44, roll: -0.02, expo: 1.0 },
  // long lens again, pulled back to a hero frame
  { t: 1.0, az: 3.15, el: 0.26, dist: 4.5, fov: 21, shift: 0.0, tgtY: 0.0, tilt: 0.38, roll: 0.0, expo: 0.94 },
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
    const shiftX = THREE.MathUtils.damp(target.current.x, shot.shift * (compact ? 0.35 : 1), 3, dt)
    target.current.set(0, THREE.MathUtils.damp(target.current.y, shot.tgtY, 3, dt), 0)
    target.current.addScaledVector(_right, shiftX)
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
  effects = false,
}: {
  progress: MotionValue<number>
  className?: string
  /** Multiplies the assembly scale — lets tighter containers fill the frame. */
  zoom?: number
  /**
   * Depth of field and bloom. The composer cannot preserve a transparent
   * clear, so this also switches the canvas to an opaque carbon background —
   * invisible on the full-bleed story canvas, but it would occlude the page
   * glow behind a boxed mount, so hero and reserve stay on alpha.
   */
  effects?: boolean
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
        gl={{ antialias: true, alpha: !effects, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.6, 3.6], fov: 28 }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.06
        }}
      >
        {effects && <color attach="background" args={['#0A0B0D']} />}
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

        {/* Real optics, desktop only: the product sits in focus while the set
            falls away, and the brand mark and specular edges carry a little
            bloom. This is the difference between a viewer and a camera. */}
        {effects && quality === 'high' && (
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <DepthOfField target={[0, 0, 0]} focalLength={0.28} focusRange={0.35} bokehScale={2.4} height={340} />
            <Bloom intensity={0.6} luminanceThreshold={0.72} luminanceSmoothing={0.32} mipmapBlur height={220} />
          </EffectComposer>
        )}
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
