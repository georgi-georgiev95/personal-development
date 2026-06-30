import { Canvas, useFrame } from '@react-three/fiber'
import { memo, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { theme } from '@/shared/styles/theme'

type ScrollSceneProps = {
  progress: number
}

const SpineFigure = ({ progress }: ScrollSceneProps) => {
  const rootRef = useRef<THREE.Group>(null)
  const spineRef = useRef<THREE.Group>(null)
  const spiralCurve = useMemo(() => {
    const points: THREE.Vector3[] = []
    const turns = 3.4
    const height = 2.82
    const radiusStart = 0.25
    const radiusEnd = 0.13
    const pointCount = 90

    for (let index = 0; index <= pointCount; index += 1) {
      const t = index / pointCount
      const angle = t * turns * Math.PI * 2
      const radius = THREE.MathUtils.lerp(radiusStart, radiusEnd, t)
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          t * height,
          Math.sin(angle) * radius
        )
      )
    }

    return new THREE.CatmullRomCurve3(points)
  }, [])

  useFrame((_state, delta) => {
    const root = rootRef.current
    const spine = spineRef.current

    if (!root || !spine) {
      return
    }

    root.rotation.y = THREE.MathUtils.damp(
      root.rotation.y,
      progress * Math.PI * 1.4,
      4.5,
      delta
    )
    root.position.y = THREE.MathUtils.damp(
      root.position.y,
      -1 + progress * 0.55,
      4.5,
      delta
    )
    root.position.z = THREE.MathUtils.damp(
      root.position.z,
      -progress * 0.24,
      4,
      delta
    )

    spine.rotation.x = THREE.MathUtils.damp(spine.rotation.x, 0, 4.2, delta)
    spine.rotation.z = THREE.MathUtils.damp(spine.rotation.z, 0, 4.2, delta)
  })

  return (
    <group ref={rootRef} position={[0, -1, 0]}>
      <mesh position={[0, -1.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 42]} />
        <meshStandardMaterial color="#191919" roughness={1} metalness={0} />
      </mesh>

      <group ref={spineRef} position={[0, -0.95, 0]}>
        <mesh>
          <tubeGeometry args={[spiralCurve, 180, 0.07, 18, false]} />
          <meshStandardMaterial
            color="#ece6dc"
            roughness={0.46}
            metalness={0.04}
          />
        </mesh>
      </group>

      <mesh position={[0, 0.25, -1.1]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[1.8, 3.8]} />
        <meshStandardMaterial
          color={theme.colors.starPrimary}
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  )
}

const Scene = memo(({ progress }: ScrollSceneProps) => {
  return (
    <>
      <fog attach="fog" args={['#050608', 4, 9]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[2.2, 3.6, 2]}
        intensity={0.95}
        color="#ffe6c6"
      />
      <directionalLight
        position={[-2.6, 1.5, -1.5]}
        intensity={0.3}
        color="#cfd6db"
      />
      <SpineFigure progress={progress} />
    </>
  )
})

export const SkeletonScrollScene = ({ progress }: ScrollSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0.45, 5.2], fov: 41 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <Scene progress={progress} />
    </Canvas>
  )
}

export default SkeletonScrollScene
