/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useViewModel } from '@/core/hooks/useViewModel'
import { TOKENS } from '@/core/di/tokens'
import { OptimusContainer } from './OptimusRobot.styles.ts'
import type { OptimusRobotState } from './OptimusRobot.types.ts'

export const OptimusRobot: React.FC = () => {
  const vm = useViewModel(TOKENS.OptimusRobotViewModel) as any
  const [state, setState] = useState<OptimusRobotState>(vm.getState())
  const mountRef = useRef<HTMLDivElement | null>(null)
  const speedRef = useRef<number>(1)

  useEffect(() => {
    const unsub = vm.subscribe((s: OptimusRobotState) => setState(s))
    return () => unsub()
  }, [vm])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth || 800
    const H = mount.clientHeight || 420
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 2.6, 7.2)
    camera.lookAt(0, 1.6, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const sun = new THREE.DirectionalLight(0xffffff, 1.8)
    sun.position.set(4, 8, 6)
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0x6688cc, 0.55)
    fill.position.set(-5, 2, -4)
    scene.add(fill)

    // ── Color palette ─────────────────────────────────────────────────────
    const C = {
      blue: new THREE.Color(0x1155bb), // G1 Optimus blue
      red: new THREE.Color(0xcc2200), // G1 Optimus red
      grey: new THREE.Color(0x909090),
      chrome: new THREE.Color(0xd0d0d0),
      glass: new THREE.Color(0x66ccff),
      dark: new THREE.Color(0x263238),
      yellow: new THREE.Color(0xffdd00),
      black: new THREE.Color(0x111111),
      silver: new THREE.Color(0xbbbbbb),
    }

    const root = new THREE.Group()
    scene.add(root)

    // ── Material / part helpers ───────────────────────────────────────────
    type MatOpts = {
      transparent?: boolean
      opacity?: number
      metalness?: number
      roughness?: number
    }
    const mkMat = (col: THREE.Color, o?: MatOpts) =>
      new THREE.MeshStandardMaterial({
        color: col.clone(),
        metalness: o?.metalness ?? 0.42,
        roughness: o?.roughness ?? 0.5,
        transparent: o?.transparent,
        opacity: o?.opacity ?? 1,
      })

    type Pose = {
      p: [number, number, number]
      r: [number, number, number]
      s: [number, number, number]
    }
    const P = (
      p: [number, number, number],
      r: [number, number, number],
      s: [number, number, number]
    ): Pose => ({ p, r, s })

    interface PartSpec {
      geo: [number, number, number]
      rC: THREE.Color
      tC: THREE.Color
      robot: Pose
      truck: Pose
      opts?: MatOpts
    }

    // ── 22-part spec table: robot pose → truck pose ───────────────────────
    // Cab body (part 5) at truck t=1:  2.06w × 1.70h × 2.46d  centred at y=1.50
    //   bottom y=0.65  (wheels at y=0.30, radius=0.30, top=0.60 → small gap)
    //   front face z=+1.23,  back z=-1.23,  top y=2.35
    //   half-width x=±1.03 → wheels at x=±1.10 (just outside)
    const specs: PartSpec[] = [
      // ── HEAD → blue cab roof (thin slab sitting on top of cab)
      {
        geo: [0.52, 0.52, 0.44],
        rC: C.grey,
        tC: C.blue,
        robot: P([0, 3.58, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0, 2.42, -0.1], [0.08, 0, 0], [4.0, 0.28, 5.2]),
      },
      // ── HEAD CREST → left exhaust stack (chrome, tall pillar behind cab)
      {
        geo: [0.1, 0.32, 0.08],
        rC: C.blue,
        tC: C.chrome,
        robot: P([0, 3.97, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-0.68, 2.95, -0.72], [0, 0, 0], [1.2, 3.75, 1.5]),
        opts: { metalness: 0.9, roughness: 0.1 },
      },
      // ── LEFT EAR ANTENNA → right exhaust stack
      {
        geo: [0.08, 0.22, 0.06],
        rC: C.blue,
        tC: C.chrome,
        robot: P([-0.3, 3.78, 0], [0, 0, -0.3], [1.0, 1.0, 1.0]),
        truck: P([0.68, 2.95, -0.72], [0, 0, 0], [1.5, 5.45, 2.0]),
        opts: { metalness: 0.9, roughness: 0.1 },
      },
      // ── FACE PLATE → full windshield glass (big pane on cab front)
      {
        geo: [0.38, 0.22, 0.06],
        rC: C.silver,
        tC: C.glass,
        robot: P([0, 3.42, 0.24], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0, 1.92, 1.24], [-0.25, 0, 0], [4.74, 3.64, 1.0]),
        opts: {
          transparent: true,
          opacity: 0.85,
          metalness: 0.1,
          roughness: 0.1,
        },
      },
      // ── NECK → hidden dark detail inside cab
      {
        geo: [0.26, 0.22, 0.24],
        rC: C.dark,
        tC: C.dark,
        robot: P([0, 3.1, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0, 1.5, 0.55], [0, 0, 0], [0.3, 0.14, 0.38]),
      },
      // ── CHEST (main torso) BLUE → CAB BODY RED  (sits on wheels)
      {
        geo: [1.45, 1.05, 0.78],
        rC: C.blue,
        tC: C.red,
        robot: P([0, 2.35, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0, 1.5, 0.0], [0, 0, 0], [1.42, 1.62, 3.16]),
      },
      // ── CHEST STRIPE → front chrome grille bar (full cab width)
      {
        geo: [0.22, 0.5, 0.06],
        rC: C.dark,
        tC: C.chrome,
        robot: P([0, 2.3, 0.4], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0, 0.9, 1.25], [0, 0, 0], [8.6, 0.6, 1.0]),
        opts: { metalness: 0.9, roughness: 0.1 },
      },
      // ── LEFT CHEST WINDOW → left cab door window (side-mounted, glass)
      {
        geo: [0.36, 0.26, 0.06],
        rC: C.glass,
        tC: C.glass,
        robot: P([-0.37, 2.42, 0.4], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-1.04, 1.9, 0.28], [0, -1.5708, 0], [3.5, 2.8, 1.0]),
        opts: {
          transparent: true,
          opacity: 0.72,
          metalness: 0.05,
          roughness: 0.08,
        },
      },
      // ── RIGHT CHEST WINDOW → right cab door window (side-mounted, glass)
      {
        geo: [0.36, 0.26, 0.06],
        rC: C.glass,
        tC: C.glass,
        robot: P([0.37, 2.42, 0.4], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([1.04, 1.9, 0.28], [0, 1.5708, 0], [3.5, 2.8, 1.0]),
        opts: {
          transparent: true,
          opacity: 0.72,
          metalness: 0.05,
          roughness: 0.08,
        },
      },
      // ── LEFT SHOULDER pad → left side fender / body panel
      {
        geo: [0.52, 0.42, 0.52],
        rC: C.red,
        tC: C.red,
        robot: P([-1.18, 2.55, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-1.1, 0.85, 0.82], [0, 0, 0], [0.24, 0.86, 1.0]),
      },
      // ── RIGHT SHOULDER pad → right side fender / body panel
      {
        geo: [0.52, 0.42, 0.52],
        rC: C.red,
        tC: C.red,
        robot: P([1.18, 2.55, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([1.1, 0.85, 0.82], [0, 0, 0], [0.24, 0.86, 1.0]),
      },
      // ── LEFT UPPER ARM → left side fuel tank (grey slab)
      {
        geo: [0.36, 0.62, 0.34],
        rC: C.blue,
        tC: C.grey,
        robot: P([-1.38, 1.88, 0], [0, 0, 0.15], [1.0, 1.0, 1.0]),
        truck: P([-1.07, 1.4, -0.62], [0, 0, 0], [0.3, 1.18, 3.5]),
      },
      // ── RIGHT UPPER ARM → right side fuel tank
      {
        geo: [0.36, 0.62, 0.34],
        rC: C.blue,
        tC: C.grey,
        robot: P([1.38, 1.88, 0], [0, 0, -0.15], [1.0, 1.0, 1.0]),
        truck: P([1.07, 1.4, -0.62], [0, 0, 0], [0.3, 1.18, 3.5]),
      },
      // ── LEFT FOREARM → left running board / step (chrome)
      {
        geo: [0.32, 0.52, 0.32],
        rC: C.blue,
        tC: C.chrome,
        robot: P([-1.38, 1.2, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-1.1, 0.52, 0.15], [0, 0, 0], [0.22, 0.2, 4.2]),
        opts: { metalness: 0.88, roughness: 0.14 },
      },
      // ── RIGHT FOREARM → right running board / step (chrome)
      {
        geo: [0.32, 0.52, 0.32],
        rC: C.blue,
        tC: C.chrome,
        robot: P([1.38, 1.2, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([1.1, 0.52, 0.15], [0, 0, 0], [0.22, 0.2, 4.2]),
        opts: { metalness: 0.88, roughness: 0.14 },
      },
      // ── WAIST → lower front bumper (chrome full-width bar)
      {
        geo: [0.82, 0.3, 0.62],
        rC: C.dark,
        tC: C.chrome,
        robot: P([0, 1.62, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0, 0.58, 1.26], [0, 0, 0], [2.44, 0.8, 0.18]),
        opts: { metalness: 0.9, roughness: 0.1 },
      },
      // ── LEFT UPPER LEG → left headlight housing (red box)
      {
        geo: [0.42, 0.68, 0.42],
        rC: C.blue,
        tC: C.red,
        robot: P([-0.4, 1.18, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-0.62, 0.96, 1.26], [0, 0, 0], [0.54, 0.7, 0.24]),
      },
      // ── RIGHT UPPER LEG → right headlight housing
      {
        geo: [0.42, 0.68, 0.42],
        rC: C.blue,
        tC: C.red,
        robot: P([0.4, 1.18, 0], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0.62, 0.96, 1.26], [0, 0, 0], [0.54, 0.7, 0.24]),
      },
      // ── LEFT LOWER LEG → left headlight lens (yellow)
      {
        geo: [0.38, 0.52, 0.38],
        rC: C.blue,
        tC: C.yellow,
        robot: P([-0.4, 0.6, 0.05], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-0.62, 0.96, 1.31], [0, 0, 0], [0.4, 0.52, 0.08]),
        opts: { metalness: 0.05, roughness: 0.2 },
      },
      // ── RIGHT LOWER LEG → right headlight lens (yellow)
      {
        geo: [0.38, 0.52, 0.38],
        rC: C.blue,
        tC: C.yellow,
        robot: P([0.4, 0.6, 0.05], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0.62, 0.96, 1.31], [0, 0, 0], [0.4, 0.52, 0.08]),
        opts: { metalness: 0.05, roughness: 0.2 },
      },
      // ── LEFT FOOT → left bumper corner (chrome)
      {
        geo: [0.46, 0.16, 0.68],
        rC: C.grey,
        tC: C.chrome,
        robot: P([-0.4, 0.08, 0.14], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([-0.88, 0.58, 1.27], [0, 0, 0], [0.76, 0.8, 0.18]),
        opts: { metalness: 0.86, roughness: 0.14 },
      },
      // ── RIGHT FOOT → right bumper corner (chrome)
      {
        geo: [0.46, 0.16, 0.68],
        rC: C.grey,
        tC: C.chrome,
        robot: P([0.4, 0.08, 0.14], [0, 0, 0], [1.0, 1.0, 1.0]),
        truck: P([0.88, 0.58, 1.27], [0, 0, 0], [0.76, 0.8, 0.18]),
        opts: { metalness: 0.86, roughness: 0.14 },
      },
    ]

    // Build all meshes
    const built = specs.map((spec) => {
      const mat = mkMat(spec.rC, spec.opts)
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...spec.geo), mat)
      root.add(mesh)
      return { mesh, spec, rC: spec.rC.clone(), tC: spec.tC.clone() }
    })

    // Shortcuts for animated parts (indices match specs array order above)
    const headMesh = built[0].mesh
    const leftUpperArm = built[11].mesh
    const rightUpperArm = built[12].mesh
    const leftForearm = built[13].mesh
    const rightForearm = built[14].mesh
    const leftUpperLeg = built[16].mesh
    const rightUpperLeg = built[17].mesh
    const leftLowerLeg = built[18].mesh
    const rightLowerLeg = built[19].mesh

    // ── 6 Wheels (scale from 0 → 1 as truck forms) ───────────────────────
    // radius=0.30 → wheel top at y=0.60, cab bottom at y=0.65 → small visible gap
    // x=±1.10 → just outside cab half-width of ±1.03 so wheels are fully visible
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 20)
    const rimGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.32, 16)
    const wPos: [number, number, number][] = [
      [-1.1, 0.3, 0.82],
      [1.1, 0.3, 0.82], // front axle
      [-1.1, 0.3, -0.12],
      [1.1, 0.3, -0.12], // mid axle
      [-1.1, 0.3, -0.95],
      [1.1, 0.3, -0.95], // rear axle
    ]
    const wheels = wPos.map(([x, y, z]) => {
      const wm = new THREE.Mesh(
        wheelGeo,
        mkMat(C.black, { metalness: 0.5, roughness: 0.7 })
      )
      const rim = new THREE.Mesh(
        rimGeo,
        mkMat(C.chrome, { metalness: 0.9, roughness: 0.1 })
      )
      wm.rotation.z = Math.PI / 2
      rim.rotation.z = Math.PI / 2
      wm.position.set(x, y, z)
      wm.scale.setScalar(0)
      wm.add(rim)
      root.add(wm)
      return wm
    })

    // ── Transform helper ─────────────────────────────────────────────────
    const L = THREE.MathUtils.lerp
    const applyTransform = (t: number) => {
      for (const { mesh, spec, rC, tC } of built) {
        const { p: rp, r: rr, s: rs } = spec.robot
        const { p: tp, r: tr, s: ts } = spec.truck
        mesh.position.set(
          L(rp[0], tp[0], t),
          L(rp[1], tp[1], t),
          L(rp[2], tp[2], t)
        )
        mesh.rotation.set(
          L(rr[0], tr[0], t),
          L(rr[1], tr[1], t),
          L(rr[2], tr[2], t)
        )
        mesh.scale.set(
          L(rs[0], ts[0], t),
          L(rs[1], ts[1], t),
          L(rs[2], ts[2], t)
        )
        ;(mesh.material as THREE.MeshStandardMaterial).color.lerpColors(
          rC,
          tC,
          t
        )
      }
      wheels.forEach((wm) => wm.scale.setScalar(Math.min(1, t * 1.5)))
    }

    let last = performance.now()
    let rafId = 0

    const resize = () => {
      const curr = mountRef.current
      if (!curr) return
      const nw = curr.clientWidth || 800
      const nh = curr.clientHeight || 420
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', resize)

    const animate = () => {
      const now = performance.now()
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const spd = speedRef.current

      if (vm.getState().transforming) vm.advanceTransform(dt)
      const t = vm.getState().transformProgress

      applyTransform(t)

      // Run / fight only in robot mode (t < 0.05)
      if (t < 0.05) {
        if (vm.getState().running) {
          const f = 5.0 * spd
          leftUpperLeg.rotation.x = Math.sin(now * 0.006 * f) * 0.55
          rightUpperLeg.rotation.x = -Math.sin(now * 0.006 * f) * 0.55
          leftLowerLeg.rotation.x = Math.sin(now * 0.006 * f + Math.PI) * 0.55
          rightLowerLeg.rotation.x = -Math.sin(now * 0.006 * f + Math.PI) * 0.55
          root.position.y = 0.06 * Math.abs(Math.sin(now * 0.01 * f))
        } else {
          leftUpperLeg.rotation.x = L(leftUpperLeg.rotation.x, 0, 0.12)
          rightUpperLeg.rotation.x = L(rightUpperLeg.rotation.x, 0, 0.12)
          leftLowerLeg.rotation.x = L(leftLowerLeg.rotation.x, 0, 0.12)
          rightLowerLeg.rotation.x = L(rightLowerLeg.rotation.x, 0, 0.12)
          root.position.y = L(root.position.y, 0, 0.08)
        }

        if (vm.getState().fighting) {
          const s = Math.sin(now * 0.006 * spd)
          leftUpperArm.rotation.z = 0.62 + 0.5 * s
          rightUpperArm.rotation.z = -(0.62 + 0.5 * s)
          leftForearm.rotation.z = -0.36 * s
          rightForearm.rotation.z = 0.36 * s
          headMesh.rotation.y = 0.22 * Math.sin(now * 0.003 * spd)
        } else {
          leftUpperArm.rotation.z = L(leftUpperArm.rotation.z, 0, 0.1)
          rightUpperArm.rotation.z = L(rightUpperArm.rotation.z, 0, 0.1)
          leftForearm.rotation.z = L(leftForearm.rotation.z, 0, 0.1)
          rightForearm.rotation.z = L(rightForearm.rotation.z, 0, 0.1)
          headMesh.rotation.y = L(headMesh.rotation.y, 0, 0.08)
        }
      } else {
        root.position.y = L(root.position.y, 0, 0.06)
      }

      root.rotation.y += 0.004 * spd
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement)
    }
  }, [vm])

  return (
    <OptimusContainer>
      <div ref={mountRef} className="three-mount" />
      <div className="controls">
        <button onClick={() => vm.startRun()} disabled={state.running}>
          Run
        </button>
        <button onClick={() => vm.stopRun()} disabled={!state.running}>
          Stop
        </button>
        <button onClick={() => vm.startFight()} disabled={state.fighting}>
          Fight
        </button>
        <button onClick={() => vm.stopFight()} disabled={!state.fighting}>
          Stop Fight
        </button>
        <button
          onClick={() => vm.startTransform()}
          disabled={state.transforming || state.transformProgress >= 1}
        >
          → Truck
        </button>
        <button
          onClick={() => vm.startReverseTransform()}
          disabled={state.transforming || state.transformProgress <= 0}
        >
          → Robot
        </button>
        <button onClick={() => vm.reset()}>Reset</button>
      </div>
      <div className="speed-control">
        <label htmlFor="speed-slider">Speed</label>
        <input
          id="speed-slider"
          type="range"
          min="0.1"
          max="4"
          step="0.1"
          defaultValue="1"
          onChange={(e) => {
            speedRef.current = parseFloat(e.target.value)
          }}
        />
      </div>
    </OptimusContainer>
  )
}

export default OptimusRobot
