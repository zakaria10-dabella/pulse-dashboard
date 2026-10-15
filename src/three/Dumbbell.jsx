import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

function Plate({ x, r, w, color }) {
  return (
    <group position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, w, 48]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.3} />
      </mesh>
      {/* bevel ring */}
      <mesh>
        <torusGeometry args={[r * 0.98, w * 0.12, 12, 64]} />
        <meshStandardMaterial color="#9B70FF" emissive="#7C4DF0" emissiveIntensity={0.9} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, w / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * 0.25, r * 0.7, 48]} />
        <meshStandardMaterial color="#26213D" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Bell({ progress }) {
  const ref = useRef()
  useFrame((state, dt) => {
    const p = progress ? progress.get() : 0
    // swing around a three-quarter view instead of spinning end-on
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.55 + 0.35 + state.pointer.x * 0.3
    ref.current.rotation.z = THREE.MathUtils.damp(ref.current.rotation.z, -0.35 + state.pointer.x * 0.25 + p, 3, dt)
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, 0.3 - state.pointer.y * 0.25, 3, dt)
  })
  return (
    <group ref={ref} scale={0.9}>
      {/* handle with knurling rings */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.11, 0.11, 2.2, 32]} />
        <meshStandardMaterial color="#D9D6E8" metalness={1} roughness={0.22} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[-0.48 + i * 0.12, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.115, 0.012, 8, 32]} />
          <meshStandardMaterial color="#8F8AA8" metalness={1} roughness={0.4} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.08, 32]} />
            <meshStandardMaterial color="#C6F432" emissive="#C6F432" emissiveIntensity={0.35} metalness={0.3} roughness={0.4} />
          </mesh>
          <Plate x={s * 0.88} r={0.72} w={0.2} color="#3B3360" />
          <Plate x={s * 1.1} r={0.56} w={0.18} color="#524682" />
          <mesh position={[s * 1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
            <meshStandardMaterial color="#D9D6E8" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function Dumbbell({ progress }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0.4, 4.4], fov: 38 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 2, 5]} intensity={1.6} />
      <spotLight position={[3, 5, 4]} angle={0.4} penumbra={1} intensity={60} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={12} color="#9B70FF" />
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1.1}>
        <Bell progress={progress} />
      </Float>
      <ContactShadows position={[0, -1.25, 0]} opacity={0.45} scale={6} blur={2.6} far={2} color="#7C4DF0" />
      {/* procedural studio lighting: no HDR files are downloaded */}
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 3, 2]} scale={[6, 1, 1]} />
        <Lightformer intensity={1.5} color="#9B70FF" position={[-4, 0, 1]} scale={[1, 4, 1]} />
        <Lightformer intensity={1} color="#C6F432" position={[4, -1, 1]} scale={[1, 3, 1]} />
      </Environment>
    </Canvas>
  )
}
