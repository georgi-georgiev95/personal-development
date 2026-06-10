import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { theme } from '@/shared/styles/theme'

const STAR_COUNT = 600
const SPHERE_RADIUS = 0.03
const SPHERE_SEGMENTS = 8

const STAR_COLOR_PRIMARY = theme.colors.starPrimary
const STAR_COLOR_SECONDARY = theme.colors.starSecondary
const STAR_COLOR_GLOW = theme.colors.starGlow

const generateStarPositions = (): Float32Array => {
  const positions = new Float32Array(STAR_COUNT * 3)
  for (let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24
    positions[i * 3 + 1] = (Math.random() - 0.5) * 24
    positions[i * 3 + 2] = (Math.random() - 0.5) * 24
  }
  return positions
}

const starPositions = generateStarPositions()

const starScales = Array.from(
  { length: STAR_COUNT },
  () => 0.4 + Math.random() * 0.8
)

const StarField = () => {
  const groupRef = useRef<THREE.Group>(null)

  const geometry = useMemo(
    () =>
      new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS),
    []
  )

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: STAR_COLOR_PRIMARY,
        emissive: STAR_COLOR_GLOW,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
      }),
      new THREE.MeshStandardMaterial({
        color: STAR_COLOR_SECONDARY,
        emissive: STAR_COLOR_PRIMARY,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.8,
      }),
    ],
    []
  )

  const meshes = useMemo(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      position: new THREE.Vector3(
        starPositions[i * 3],
        starPositions[i * 3 + 1],
        starPositions[i * 3 + 2]
      ),
      material: materials[i % 2],
      scale: starScales[i],
    }))
  }, [materials])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015
      groupRef.current.rotation.x += delta * 0.008
    }
  })

  return (
    <group ref={groupRef}>
      {meshes.map((star, i) => (
        <mesh
          key={i}
          position={star.position}
          material={star.material}
          scale={star.scale}
          geometry={geometry}
        />
      ))}
    </group>
  )
}

const Scene = () => (
  <>
    <ambientLight intensity={0.4} />
    <pointLight
      position={[5, 5, 5]}
      intensity={0.8}
      color={STAR_COLOR_PRIMARY}
    />
    <pointLight
      position={[-5, -3, 3]}
      intensity={0.4}
      color={STAR_COLOR_SECONDARY}
    />
    <StarField />
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.3}
    />
  </>
)

export const StarFieldBackground: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
      <Scene />
    </Canvas>
  )
}

export default StarFieldBackground
