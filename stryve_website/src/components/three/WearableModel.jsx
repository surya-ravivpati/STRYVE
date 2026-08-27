import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, ContactShadows, Html, useProgress } from '@react-three/drei'
import * as THREE from 'three'

const MODEL_URL = '/models/stryve-wearable.glb'

/* Authored in metres (157mm wide), Y-up after export. Its bbox centre sits
   at y = -0.0575, so we lift it back to the origin before scaling. */
const MODEL_CENTER_Y = -0.0575
const BASE_TILT = 0.5 // resting pitch: tips the module face toward the viewer
const FIT_SCALE = 6.4

/** Real part positions (three.js space) sampled from the source .blend */
export const HOTSPOTS = [
  { id: 'semg', label: 'sEMG electrode', tag: 'MUSCLE', pos: [0.068, -0.039, 0] },
  { id: 'imu', label: 'IMU sensor pod', tag: 'MOTION', pos: [-0.068, -0.039, 0] },
  { id: 'gsr', label: 'GSR electrodes', tag: 'SKIN', pos: [-0.07, -0.074, 0] },
  { id: 'temp', label: 'Temperature probe', tag: 'THERMAL', pos: [0.071, -0.074, 0] },
  { id: 'mcu', label: 'Enclosure + MCU', tag: 'COMPUTE', pos: [0, 0.021, 0] },
]

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-[2px] w-24 overflow-hidden bg-carbon-600">
          <div className="h-full bg-pulse transition-all duration-300" style={{ width: progress + '%' }} />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-slate">
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  )
}

function Assembly({ spin, tilt }) {
  const { scene } = useGLTF(MODEL_URL)
  const group = useRef()
  const damped = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  // Clone so the GLB can be mounted in several sections independently
  const model = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (o.material) {
          o.material = o.material.clone()
          o.material.envMapIntensity = 0.95
        }
      }
    })
    return c
  }, [scene])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.y += delta * spin
    g.rotation.z = -0.06
    if (tilt) {
      const px = (state.pointer.x * viewport.width) / 60
      const py = (state.pointer.y * viewport.height) / 60
      damped.current.x = THREE.MathUtils.lerp(damped.current.x, BASE_TILT + py * 0.1, 0.05)
      g.rotation.x = damped.current.x
      g.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03
    }
  })

  return (
    <group ref={group} scale={FIT_SCALE}>
      <primitive object={model} position={[0, -MODEL_CENTER_Y, 0]} />
    </group>
  )
}

export default function WearableModel({
  className = '',
  spin = 0.25,
  tilt = true,
  shadows = true,
  dpr = [1, 1.75],
}) {
  const hostRef = useRef(null)
  const [visible, setVisible] = useState(false)

  // Only drive the render loop while the canvas is actually on screen —
  // two WebGL canvases idling off-screen is wasted battery on mobile.
  useEffect(() => {
    const node = hostRef.current
    if (!node) return
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: '150px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <div className={className} ref={hostRef}>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => { gl.toneMappingExposure = 0.92 }}
        camera={{ position: [0, 0.18, 3.0], fov: 30 }}
      >
        {/* studio rig echoing the lighting authored in the .blend */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={2.1} color="#FFFFFF" />
        <directionalLight position={[-3, 1.5, -2]} intensity={0.32} color="#31E7E0" />
        <directionalLight position={[-1.5, -1.2, 1.5]} intensity={0.6} color="#FF421D" />
        <spotLight position={[0, 5, 1]} angle={0.6} penumbra={1} intensity={1.0} color="#FFFFFF" />

        <Suspense fallback={<Loader />}>
          <Assembly spin={spin} tilt={tilt} />
          {/* studio environment built in-scene: reflections with no external HDR */}
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={4.2} color="#FFFFFF" position={[0, 3, 2]} scale={[7, 3, 1]} rotation={[-Math.PI / 3, 0, 0]} />
            <Lightformer form="rect" intensity={0.3} color="#31E7E0" position={[-4, 0.5, -2]} scale={[4, 4, 1]} rotation={[0, Math.PI / 2.4, 0]} />
            <Lightformer form="rect" intensity={0.8} color="#FF421D" position={[4, -1, 1]} scale={[4, 3, 1]} rotation={[0, -Math.PI / 2.6, 0]} />
            <Lightformer form="ring" intensity={1.6} color="#FFFFFF" position={[0, -2, 3]} scale={3} />
          </Environment>
          {shadows && (
            <ContactShadows position={[0, -0.62, 0]} opacity={0.55} scale={5} blur={2.6} far={2} color="#000000" />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_URL)
