import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { theme } from '@/shared/styles/theme'
import { usePrefersReducedMotion } from '@/shared/utils/usePrefersReducedMotion'

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

interface InstancedStarsProps {
  starIndices: number[]
  geometry: THREE.SphereGeometry
  material: THREE.MeshStandardMaterial
  animate: boolean
}

// One InstancedMesh per material renders all its stars in a single draw
// call (2 total per frame, down from 600 with individual meshes).
const InstancedStars = ({
  starIndices,
  geometry,
  material,
  animate,
}: InstancedStarsProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const offsetRef = useRef(0)
  const tempRef = useRef(new THREE.Object3D())
  const invalidate = useThree((state) => state.invalidate)

  const applyMatrices = (offset: number) => {
    const mesh = meshRef.current
    if (!mesh) return
    const half = FIELD_HEIGHT / 2
    const temp = tempRef.current
    starIndices.forEach((starIndex, i) => {
      const baseY = starPositions[starIndex * 3 + 1]
      const wrapped =
        ((((baseY - offset + half) % FIELD_HEIGHT) + FIELD_HEIGHT) %
          FIELD_HEIGHT) -
        half
      temp.position.set(
        starPositions[starIndex * 3],
        wrapped,
        starPositions[starIndex * 3 + 2]
      )
      temp.scale.setScalar(starScales[starIndex])
      temp.updateMatrix()
      mesh.setMatrixAt(i, temp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  useEffect(() => {
    applyMatrices(offsetRef.current)
    invalidate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFrame((_, delta) => {
    if (!animate) return
    offsetRef.current += delta * SCROLL_SPEED
    applyMatrices(offsetRef.current)
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, starIndices.length]}
    />
  )
}

const Scene = ({ animate }: { animate: boolean }) => {
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

  const [evenIndices, oddIndices] = useMemo(() => {
    const even: number[] = []
    const odd: number[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      ;(i % 2 === 0 ? even : odd).push(i)
    }
    return [even, odd]
  }, [])

  return (
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
      <InstancedStars
        starIndices={evenIndices}
        geometry={geometry}
        material={materials[0]}
        animate={animate}
      />
      <InstancedStars
        starIndices={oddIndices}
        geometry={geometry}
        material={materials[1]}
        animate={animate}
      />
    </>
  )
}

export const StarFieldBackground: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 2]}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <Scene animate={!reducedMotion} />
    </Canvas>
  )
}

export default StarFieldBackground
