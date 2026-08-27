import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, ContactShadows, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

const MODEL_URL = '/models/stryve-wearable.glb'

/* Authored in metres (157mm across), Y-up after export. Bbox centre sits at
   y = -0.0575, so the assembly is lifted back to the origin before scaling. */
const MODEL_CENTER_Y = -0.0575
const BASE_SCALE = 5.0
/* Push the assembly right of centre so narrative copy owns the left column. */
const X_OFFSET = 0.055

/** The four sensing systems, keyed to real mesh names inside the GLB. */
export type SensorKey = 'semg' | 'imu' | 'gsr' | 'temp'

export const SENSORS: {
  key: SensorKey
  label: string
  sub: string
  meshes: string[]
  anchor: [number, number, number]
}[] = [
  {
    key: 'semg',
    label: 'Muscle',
    sub: 'sEMG',
    meshes: ['semg_electrode_pad'],
    anchor: [0.068, -0.039, 0],
  },
  {
    key: 'imu',
    label: 'Movement',
    sub: 'IMU',
    meshes: ['imu_sensor_pod'],
    anchor: [-0.068, -0.039, 0],
  },
  {
    key: 'gsr',
    label: 'Sweat',
    sub: 'GSR',
    meshes: ['gsr_electrode_pad_a', 'gsr_electrode_pad_b'],
    anchor: [-0.07, -0.088, 0],
  },
  {
    key: 'temp',
    label: 'Temperature',
    sub: 'Skin temp',
    meshes: ['temperature_sensor_mount'],
    anchor: [0.071, -0.074, 0],
  },
]

const SENSOR_MESHES = new Set(SENSORS.flatMap((s) => s.meshes))

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}
/** Normalised progress across a sub-range of the overall scroll. */
function range(p: number, a: number, b: number) {
  return clamp01((p - a) / (b - a))
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

type PartState = {
  mesh: THREE.Object3D
  home: THREE.Vector3
  dir: THREE.Vector3
  isSensor: boolean
}

function Assembly({
  progress,
  compact,
  onSensorPhase,
}: {
  progress: MotionValue<number>
  compact: boolean
  onSensorPhase: (v: number) => void
}) {
  const { scene } = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)

  const { model, parts } = useMemo(() => {
    const c = scene.clone(true)
    const parts: PartState[] = []
    const centre = new THREE.Vector3(0, MODEL_CENTER_Y, 0)
    c.traverse((o) => {
      const m = o as THREE.Mesh
      if (!m.isMesh) return
      m.castShadow = true
      m.receiveShadow = true
      if (m.material) {
        m.material = (m.material as THREE.Material).clone()
        ;(m.material as THREE.MeshStandardMaterial).envMapIntensity = 0.9
      }
      const home = m.position.clone()
      // Explode outward from the assembly centre, biased along the band face
      const world = new THREE.Vector3()
      m.getWorldPosition(world)
      const dir = world.clone().sub(centre)
      if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0)
      dir.normalize()
      const isSensor = SENSOR_MESHES.has(m.name)
      // sensors travel further so they read clearly when separated
      dir.multiplyScalar(isSensor ? 0.078 : 0.02)
      parts.push({ mesh: m, home, dir, isSensor })
    })
    return { model: c, parts }
  }, [scene])

  const lastPhase = useRef(-1)

  useFrame((state, delta) => {
    const p = progress.get()

    // ---- camera dolly: pull in through the story, ease back out at the end
    // narrow viewports need more distance and no lateral offset
    const offset = compact ? 0 : X_OFFSET
    const dolly = (compact ? 4.5 : 3.45) - range(p, 0, 0.55) * 0.55 + range(p, 0.78, 1) * 0.45
    const height = 0.12 + range(p, 0.15, 0.6) * 0.24 - range(p, 0.8, 1) * 0.22
    state.camera.position.lerp(new THREE.Vector3(0, height, dolly), 0.06)
    state.camera.lookAt(offset, 0, 0)

    if (group.current) {
      // continuous slow inspection turn, accelerated slightly mid-story
      const spin = 0.13 + range(p, 0.2, 0.5) * 0.16
      group.current.rotation.y += delta * spin
      // tip the sensing face toward the viewer as the sensors are revealed
      const tilt = 0.18 + range(p, 0.3, 0.62) * 0.5 - range(p, 0.82, 1) * 0.4
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, tilt, 0.06)
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.025

      group.current.position.x = offset
      const scale = BASE_SCALE * (1 + range(p, 0.85, 1) * 0.06)
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x || scale, scale, 0.08))
    }

    // ---- exploded view: separate 0.42→0.62, hold, reassemble 0.74→0.88
    const out = range(p, 0.42, 0.62)
    const back = range(p, 0.74, 0.88)
    const explode = out * (1 - back)
    const eased = explode * explode * (3 - 2 * explode) // smoothstep
    for (const part of parts) {
      part.mesh.position.set(
        part.home.x + part.dir.x * eased,
        part.home.y + part.dir.y * eased,
        part.home.z + part.dir.z * eased,
      )
    }

    if (Math.abs(eased - lastPhase.current) > 0.01) {
      lastPhase.current = eased
      onSensorPhase(eased)
    }
  })

  return (
    <group ref={group} scale={BASE_SCALE}>
      <group ref={inner}>
        <primitive object={model} position={[0, -MODEL_CENTER_Y, 0]} />
      </group>
    </group>
  )
}

export default function StoryScene({
  progress,
  className = '',
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [quality, setQuality] = useState<'high' | 'low'>('high')

  useEffect(() => {
    // Mobile gets a lighter scene: no contact shadows, fewer pins, lower dpr.
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
    <div ref={host} className={className}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={quality === 'low' ? [1, 1.4] : [1, 1.9]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.18, 3.15], fov: 30 }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 0.95
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-3, 1.5, -2]} intensity={0.35} color="#3BE0CF" />
        <directionalLight position={[-1.5, -1.2, 1.5]} intensity={0.55} color="#FF421D" />
        <spotLight position={[0, 5, 1]} angle={0.6} penumbra={1} intensity={1.0} color="#FFFFFF" />

        <Suspense fallback={<Loader />}>
          <Assembly progress={progress} compact={quality === 'low'} onSensorPhase={() => {}} />
          {/* studio reflections built in-scene — no external HDR fetch */}
          <Environment resolution={quality === 'low' ? 128 : 256}>
            <Lightformer form="rect" intensity={4.0} color="#FFFFFF" position={[0, 3, 2]} scale={[7, 3, 1]} rotation={[-Math.PI / 3, 0, 0]} />
            <Lightformer form="rect" intensity={0.5} color="#3BE0CF" position={[-4, 0.5, -2]} scale={[4, 4, 1]} rotation={[0, Math.PI / 2.4, 0]} />
            <Lightformer form="rect" intensity={0.9} color="#FF421D" position={[4, -1, 1]} scale={[4, 3, 1]} rotation={[0, -Math.PI / 2.6, 0]} />
            <Lightformer form="ring" intensity={1.5} color="#FFFFFF" position={[0, -2, 3]} scale={3} />
          </Environment>
          {quality === 'high' && (
            <ContactShadows position={[0, -0.72, 0]} opacity={0.5} scale={5} blur={2.8} far={2} color="#000000" />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
