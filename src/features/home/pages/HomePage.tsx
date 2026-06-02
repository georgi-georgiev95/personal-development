import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { MeshWobbleMaterial, OrbitControls, useHelper } from '@react-three/drei'
import { useControls } from 'leva'

type FormProps = {
  position: [number, number, number]
  size: [number, number, number, number?]
  color?: string
}

const Sphere = ({ position }: Pick<FormProps, 'position'>) => {
  const ref = useRef<THREE.Mesh>(null)

  const { color, radius, widthSegments, heightSegments } = useControls(
    'Sphere',
    {
      // Use a different default color so hover (lightBlue) is visible
      color: 'orange',
      radius: { value: 1, min: 0.1, max: 4, step: 0.1 },
      widthSegments: { value: 32, min: 3, max: 64, step: 1 },
      heightSegments: { value: 32, min: 2, max: 64, step: 1 },
    }
  )

  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  useFrame((_, delta) => {
    if (ref.current) {
      // ref.current.rotation.x += delta
      const speed = isHovered ? 2 : 0.2
      ref.current.rotation.y += delta * 0.2 * speed
      // ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
    }
  })

  return (
    <mesh
      position={position}
      ref={ref}
      onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
      onPointerLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
      scale={isClicked ? 1.5 : 1}
    >
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshStandardMaterial
        color={isHovered ? 'lightBlue' : color}
        wireframe={true}
      />
    </mesh>
  )
}

const TorusKnot = ({ position, size }: FormProps) => {
  const ref = useRef<THREE.Mesh>(null)

  const { color, radius } = useControls('Torus Knot', {
    color: 'orange',
    radius: { value: 0.7, min: 0.1, max: 1, step: 0.1 },
  })

  // useFrame((state, delta) => {
  //   if (ref.current) {
  //     ref.current.rotation.x += delta
  //     ref.current.rotation.y += delta * 2
  //     ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2
  //   }
  // })

  return (
    <mesh position={position} ref={ref}>
      <torusKnotGeometry args={[radius, ...size]} />
      {/* <meshStandardMaterial color={color} /> */}
      <MeshWobbleMaterial color={color} speed={1} factor={0.6} />
    </mesh>
  )
}

const Scene = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!)

  const { lightColor, lightIntensity } = useControls('Directional Light', {
    lightColor: 'white',
    lightIntensity: { value: 0.5, min: 0, max: 5, step: 0.1 },
  })

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 0.5, 'white')
  return (
    <>
      <directionalLight
        position={[0, 0, 2]}
        intensity={lightIntensity}
        ref={directionalLightRef}
        color={lightColor}
      />
      <ambientLight intensity={0.1} />

      <group position={[0, 0, 0]}>
        <Sphere position={[-2, 0, 0]} />
        <TorusKnot position={[2, 0, 0]} size={[0.3, 1000, 50]} />
      </group>
      <OrbitControls />
    </>
  )
}

export const HomePage: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Scene />
      </Canvas>

      <div
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          padding: '8px 12px',
          borderRadius: 8,
          fontSize: 20,
          lineHeight: '1.25',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Hints:</div>
        <div style={{ marginBottom: 4 }}>
          White square ={'>'} directional light direction
        </div>
        <div>Drag: rotate</div>
        <div>Scroll: zoom</div>
        <div>Sphere supports hover and click effects</div>
      </div>
    </div>
  )
}

export default HomePage
