import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  RoundedBox,
  ContactShadows,
  useGLTF,
} from '@react-three/drei'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'

type BodyPartProps = {
  side?: 'left' | 'right'
  offsetY?: number
  speed?: number
  metalness?: number
  roughness?: number
}

const Material = ({
  color,
  metalness,
  roughness,
}: {
  color: string
  metalness?: number
  roughness?: number
}) => {
  return (
    <meshStandardMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      envMapIntensity={2}
    />
  )
}

const Head = (props: BodyPartProps) => {
  const { metalness, roughness } = props

  return (
    <group>
      <RoundedBox args={[1, 1, 1]} radius={0.08} position={[0, 1, 0]}>
        <Material color="#d90429" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <RoundedBox
        args={[0.2, 0.5, 0.2]}
        radius={0.03}
        position={[-0.6, 1.5, 0]}
      >
        <Material color="#4361ee" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <RoundedBox args={[0.2, 0.5, 0.2]} radius={0.03} position={[0.6, 1.5, 0]}>
        <Material color="#4361ee" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <mesh position={[-0.2, 1.05, 0.52]}>
        <boxGeometry args={[0.15, 0.1, 0.02]} />
        <meshStandardMaterial
          color="#00b4ff"
          emissive="#00b4ff"
          emissiveIntensity={2}
        />
      </mesh>

      <mesh position={[0.2, 1.05, 0.52]}>
        <boxGeometry args={[0.15, 0.1, 0.02]} />
        <meshStandardMaterial
          color="#00b4ff"
          emissive="#00b4ff"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

const Body = (props: BodyPartProps) => {
  const { metalness, roughness } = props

  return (
    <group position={[0, -0.5, 0]}>
      <RoundedBox args={[2, 2, 1]} radius={0.08}>
        <Material color="#1d4ed8" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <RoundedBox
        args={[0.8, 0.7, 0.1]}
        radius={0.03}
        position={[-0.45, 0.2, 0.56]}
      >
        <Material color="#ef233c" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <RoundedBox
        args={[0.8, 0.7, 0.1]}
        radius={0.03}
        position={[0.45, 0.2, 0.56]}
      >
        <Material color="#ef233c" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <mesh position={[0, -0.5, 0.56]}>
        <boxGeometry args={[0.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#999" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

const Arm = (props: BodyPartProps) => {
  const { side, offsetY = -0.5, speed = 3, metalness, roughness } = props

  const groupRef = useRef<THREE.Group>(null)

  const phase = side === 'left' ? 0 : Math.PI

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const swing = Math.sin(t * speed + phase) * 0.6

    if (groupRef.current) {
      groupRef.current.rotation.x = swing
    }
  })

  const x = side === 'left' ? 1.4 : -1.4

  return (
    <group ref={groupRef} position={[x, offsetY, 0]}>
      <RoundedBox args={[0.7, 0.5, 0.7]} radius={0.05} position={[0, 0.3, 0]}>
        <Material color="#555" metalness={1} roughness={0.3} />
      </RoundedBox>

      <RoundedBox args={[0.5, 1.5, 0.5]} radius={0.05} position={[0, -0.5, 0]}>
        <Material color="#ef233c" metalness={metalness} roughness={roughness} />
      </RoundedBox>
    </group>
  )
}

const Leg = (props: BodyPartProps) => {
  const { side, speed = 3, metalness, roughness } = props

  const groupRef = useRef<THREE.Group>(null)

  const phase = side === 'left' ? Math.PI : 0

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const hipSwing = Math.sin(t * speed + phase) * 0.3

    if (groupRef.current) {
      groupRef.current.rotation.x = hipSwing
    }
  })

  const x = side === 'left' ? 0.55 : -0.55

  return (
    <group ref={groupRef} position={[x, -1.75, 0]}>
      <RoundedBox args={[0.8, 1.8, 0.8]} radius={0.05} position={[0, -0.75, 0]}>
        <Material color="#1d4ed8" metalness={metalness} roughness={roughness} />
      </RoundedBox>

      <mesh position={[0, -1.7, 0]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
      </mesh>

      <RoundedBox
        args={[0.9, 0.35, 1.3]}
        radius={0.04}
        position={[0, -2, 0.15]}
      >
        <Material color="#ef233c" metalness={metalness} roughness={roughness} />
      </RoundedBox>
    </group>
  )
}

/**
 * ImportedModel - Animates a rigged GLB model with walking motion
 *
 * BONE AXIS REFERENCE (for this specific model):
 * - Hips (bip_hip_l/r): X axis = forward/back swing
 * - Knees (bip_knee_l/r): X axis = bend
 * - Upper Arms (bip_upperarm_l/r): X axis = forward/back swing
 * - Lower Arms (bip_lowerarm_l/r): Y axis = elbow bend
 * - Spine: Y = sway side-to-side, Z = bob forward/back
 *
 * To adjust which axis controls movement, modify the rotation.x/y/z assignments
 * in the useFrame callback below.
 */
const ImportedModel = ({
  speed = 3,
  legAmplitude = 0.4,
  armAmplitude = 0.4,
  elbowAmplitude = 0.25,
  armInward = 0,
  legInward = 0,
}: {
  speed?: number
  legAmplitude?: number // How far legs swing forward/back
  armAmplitude?: number // How far arms swing forward/back
  elbowAmplitude?: number // How much elbows bend
  armInward?: number // Z rotation to bring arms closer to body (negative = closer)
  legInward?: number // Y rotation to bring legs closer together (positive = closer)
}) => {
  const { scene } = useGLTF('/optimus-prime.glb')
  const groupRef = useRef<THREE.Group>(null)

  // Store initial bone rotations to apply deltas instead of absolutes
  const initialRotationsRef = useRef<Map<string, THREE.Euler>>(new Map())

  // Bone references
  const bonesRef = useRef<{
    hipL: THREE.Bone | null
    hipR: THREE.Bone | null
    kneeL: THREE.Bone | null
    kneeR: THREE.Bone | null
    footL: THREE.Bone | null
    footR: THREE.Bone | null
    upperArmL: THREE.Bone | null
    upperArmR: THREE.Bone | null
    lowerArmL: THREE.Bone | null
    lowerArmR: THREE.Bone | null
    spine0: THREE.Bone | null
    spine1: THREE.Bone | null
  }>({
    hipL: null,
    hipR: null,
    kneeL: null,
    kneeR: null,
    footL: null,
    footR: null,
    upperArmL: null,
    upperArmR: null,
    lowerArmL: null,
    lowerArmR: null,
    spine0: null,
    spine1: null,
  })

  // Find bones on mount and store initial rotations
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Bone) {
        // Store initial rotation for this bone
        initialRotationsRef.current.set(child.name, child.rotation.clone())

        switch (child.name) {
          case 'bip_hip_l_81':
            bonesRef.current.hipL = child
            break
          case 'bip_hip_r_89':
            bonesRef.current.hipR = child
            break
          case 'bip_knee_l_80':
            bonesRef.current.kneeL = child
            break
          case 'bip_knee_r_88':
            bonesRef.current.kneeR = child
            break
          case 'bip_foot_l_75':
            bonesRef.current.footL = child
            break
          case 'bip_foot_r_83':
            bonesRef.current.footR = child
            break
          case 'bip_upperarm_l_39':
            bonesRef.current.upperArmL = child
            break
          case 'bip_upperarm_r_55':
            bonesRef.current.upperArmR = child
            break
          case 'bip_lowerarm_l_37':
            bonesRef.current.lowerArmL = child
            break
          case 'bip_lowerarm_r_53':
            bonesRef.current.lowerArmR = child
            break
          case 'bip_spine_0_73':
            bonesRef.current.spine0 = child
            break
          case 'bip_spine_1_70':
            bonesRef.current.spine1 = child
            break
        }
      }
    })
  }, [scene])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const bones = bonesRef.current
    const initRots = initialRotationsRef.current

    // ===== LEG SWING =====
    // X axis swings leg forward/back (opposite phase for L/R)
    // To change swing axis: modify rotation.x to rotation.y or .z
    const legSwingL = Math.sin(t * speed) * legAmplitude
    const legSwingR = Math.sin(t * speed + Math.PI) * legAmplitude

    // ===== KNEE BEND =====
    // Only bend when leg goes back (positive sin values)
    const kneeBendL = Math.max(0, Math.sin(t * speed)) * legAmplitude
    const kneeBendR = Math.max(0, Math.sin(t * speed + Math.PI)) * legAmplitude

    // ===== ARM SWING =====
    // Arms swing opposite to legs for natural walking
    const armSwingL = Math.sin(t * speed + Math.PI) * armAmplitude
    const armSwingR = Math.sin(t * speed) * armAmplitude

    // ===== ELBOW BEND =====
    const elbowBendL = Math.abs(Math.sin(t * speed + Math.PI)) * elbowAmplitude
    const elbowBendR = Math.abs(Math.sin(t * speed)) * elbowAmplitude

    // ===== BODY MOVEMENT =====
    const bodyBob = Math.sin(t * speed * 2) * 0.02
    const bodySway = Math.sin(t * speed) * 0.02

    // ----- APPLY LEG ROTATIONS -----
    // Hip swing: X axis = forward/back
    // To bring legs closer: adjust Z rotation with legInward
    // Both legs use same sign since their Z axes point in opposite directions
    if (bones.hipL) {
      const init = initRots.get('bip_hip_l_81')
      if (init) {
        bones.hipL.rotation.x = init.x + legSwingL
        bones.hipL.rotation.z = init.z + legInward // Z axis brings leg inward
      }
    }
    if (bones.hipR) {
      const init = initRots.get('bip_hip_r_89')
      if (init) {
        bones.hipR.rotation.x = init.x + legSwingR
        bones.hipR.rotation.z = init.z + legInward // Same sign - Z axes already point opposite
      }
    }

    // Knee bend: X axis
    if (bones.kneeL) {
      const init = initRots.get('bip_knee_l_80')
      if (init) {
        bones.kneeL.rotation.x = init.x + kneeBendL
      }
    }
    if (bones.kneeR) {
      const init = initRots.get('bip_knee_r_88')
      if (init) {
        bones.kneeR.rotation.x = init.x + kneeBendR
      }
    }

    // ----- APPLY ARM ROTATIONS -----
    // Upper arm swing: X axis = forward/back
    // To bring arms closer: adjust Z rotation with armInward (same sign for both arms)
    if (bones.upperArmL) {
      const init = initRots.get('bip_upperarm_l_39')
      if (init) {
        bones.upperArmL.rotation.x = init.x + armSwingL
        bones.upperArmL.rotation.z = init.z + armInward // Bring arm closer to body
      }
    }
    if (bones.upperArmR) {
      const init = initRots.get('bip_upperarm_r_55')
      if (init) {
        bones.upperArmR.rotation.x = init.x - armSwingR // Inverted for right side
        bones.upperArmR.rotation.z = init.z + armInward // Same sign for both arms
      }
    }

    // Elbow bend: Y axis
    if (bones.lowerArmL) {
      const init = initRots.get('bip_lowerarm_l_37')
      if (init) {
        bones.lowerArmL.rotation.y = init.y - elbowBendL
      }
    }
    if (bones.lowerArmR) {
      const init = initRots.get('bip_lowerarm_r_53')
      if (init) {
        bones.lowerArmR.rotation.y = init.y + elbowBendR
      }
    }

    // ----- APPLY BODY MOVEMENT -----
    if (bones.spine0) {
      const init = initRots.get('bip_spine_0_73')
      if (init) {
        bones.spine0.rotation.y = init.y + bodySway
      }
    }
    if (bones.spine1) {
      const init = initRots.get('bip_spine_1_70')
      if (init) {
        bones.spine1.rotation.z = init.z + bodyBob
      }
    }

    // Group position bob (vertical bounce while walking)
    if (groupRef.current) {
      groupRef.current.position.y = -3 + Math.sin(t * speed * 2) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, -2, -6]}>
      <primitive object={scene} scale={1.5} />
    </group>
  )
}

export const OptimusPrime: React.FC = () => {
  // Walk animation controls
  const { speed } = useControls('Walk', {
    speed: {
      value: 3,
      min: 0,
      max: 10,
      step: 0.1,
    },
  })

  // GLB Model animation controls
  const { legAmplitude, armAmplitude, elbowAmplitude, armInward, legInward } =
    useControls('GLB Robot Animation', {
      legAmplitude: {
        value: 0.4,
        min: 0,
        max: 1,
        step: 0.05,
        label: 'Leg Swing',
      },
      armAmplitude: {
        value: 0.4,
        min: 0,
        max: 1,
        step: 0.05,
        label: 'Arm Swing',
      },
      elbowAmplitude: {
        value: 0.25,
        min: 0,
        max: 0.8,
        step: 0.05,
        label: 'Elbow Bend',
      },
      armInward: {
        value: 0.3,
        min: -0.5,
        max: 0.8,
        step: 0.05,
        label: 'Arms Closer (Z)',
      },
      legInward: {
        value: 0,
        min: 0,
        max: 0.5,
        step: 0.05,
        label: 'Legs Closer (Y)',
      },
    })

  // Custom robot material controls
  const { metalness, roughness } = useControls('Material', {
    metalness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.1,
    },
    roughness: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
    },
  })

  return (
    <Canvas
      shadows
      camera={{ position: [-6, 5, 15], fov: 50 }}
      gl={{ antialias: true }}
      style={{
        background: 'linear-gradient(to bottom, #111827, #1f2937)',
      }}
    >
      <ambientLight intensity={0.2} />

      <directionalLight
        position={[5, 10, 5]}
        intensity={18}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <spotLight position={[-5, 8, 5]} intensity={2} angle={0.3} penumbra={1} />

      <Environment preset="night" />

      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={4}
      />

      {/* Custom Robot */}
      <group position={[0, 1, 0]}>
        <Head metalness={metalness} roughness={roughness} />
        <Body metalness={metalness} roughness={roughness} />
        <Arm
          side="left"
          speed={speed}
          metalness={metalness}
          roughness={roughness}
        />
        <Arm
          side="right"
          speed={speed}
          metalness={metalness}
          roughness={roughness}
        />
        <Leg
          side="left"
          speed={speed}
          metalness={metalness}
          roughness={roughness}
        />
        <Leg
          side="right"
          speed={speed}
          metalness={metalness}
          roughness={roughness}
        />
      </group>

      {/* Imported GLB Model with walking animation */}
      <ImportedModel
        speed={speed}
        legAmplitude={legAmplitude}
        armAmplitude={armAmplitude}
        elbowAmplitude={elbowAmplitude}
        armInward={armInward}
        legInward={legInward}
      />

      <OrbitControls enableDamping />

      <EffectComposer>
        <SSAO samples={31} radius={0.1} intensity={20} />
      </EffectComposer>
    </Canvas>
  )
}

useGLTF.preload('/optimus-prime.glb')
