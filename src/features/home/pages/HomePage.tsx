import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { MeshWobbleMaterial, OrbitControls, useHelper } from '@react-three/drei'
import { useControls } from 'leva'
import {
  HomeCanvasWrapper,
  HintsOverlay,
  HintsTitle,
  HintItem,
} from './HomePage.styles'

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
      const speed = isHovered ? 2 : 0.2
      ref.current.rotation.y += delta * 0.2 * speed
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

  return (
    <mesh position={position} ref={ref}>
      <torusKnotGeometry args={[radius, ...size]} />
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
    <HomeCanvasWrapper>
      <Canvas style={{ width: '100%', height: '100%' }}>
        <Scene />
      </Canvas>

      <HintsOverlay>
        <HintsTitle>Hints:</HintsTitle>
        <HintItem>White square =&gt; directional light direction</HintItem>
        <HintItem>Drag: rotate</HintItem>
        <HintItem>Scroll: zoom</HintItem>
        <HintItem>Sphere supports hover and click effects</HintItem>
      </HintsOverlay>
    </HomeCanvasWrapper>
  )
}

export default HomePage
