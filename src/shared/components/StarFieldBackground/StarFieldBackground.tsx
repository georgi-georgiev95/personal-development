import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { theme } from '@/shared/styles/theme'

const STAR_COUNT = 600
const SPHERE_RADIUS = 0.03
const SPHERE_SEGMENTS = 8
const FIELD_HEIGHT = 24
const SCROLL_SPEED = 0.4

const STAR_COLOR_PRIMARY = theme.colors.starPrimary
const STAR_COLOR_SECONDARY = theme.colors.starSecondary

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
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  const geometry = useMemo(
    () =>
      new THREE.SphereGeometry(SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS),
    []
  )

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: STAR_COLOR_PRIMARY,
        emissive: STAR_COLOR_PRIMARY,
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
    const halfHeight = FIELD_HEIGHT / 2
    meshRefs.current.forEach((mesh) => {
      if (!mesh) return
      let y = mesh.position.y - delta * SCROLL_SPEED
      if (y < -halfHeight) {
        y += FIELD_HEIGHT
      }
      mesh.position.y = y
    })
  })

  return (
    <group>
      {meshes.map((star, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el
          }}
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
