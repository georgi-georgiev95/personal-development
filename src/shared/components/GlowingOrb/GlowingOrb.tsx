import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { theme } from '@/shared/styles/theme'

const GlowingMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    }
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.45, 1]} />
      <meshStandardMaterial
        color={theme.colors.starPrimary}
        emissive={theme.colors.starGlow}
        emissiveIntensity={0.7}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

const Scene = () => (
  <>
    <ambientLight intensity={0.3} />
    <pointLight
      position={[2, 2, 3]}
      intensity={0.6}
      color={theme.colors.starPrimary}
    />
    <pointLight
      position={[-2, -1, 2]}
      intensity={0.3}
      color={theme.colors.starSecondary}
    />
    <GlowingMesh />
  </>
)

export const GlowingOrb: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  )
}

export default GlowingOrb
