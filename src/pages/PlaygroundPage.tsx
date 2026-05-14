import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/components/useAuth'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/auth'
import * as THREE from 'three'
import {
  PageWrapper,
  NavBar,
  AppTitle,
  NavActions,
  NavButton,
  AuthStatus,
  CanvasMount,
  ScrollSection,
  SectionContent,
  SectionLabel,
  SectionTitle,
  SectionText,
  ScrollHint,
} from './PlaygroundPage.styles'

export const PlaygroundPage: React.FC = () => {
  const { user } = useAuth()
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 60) setScrolled(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = window.innerWidth
    const H = window.innerHeight

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)
    mount.appendChild(renderer.domElement)

    // ── Objects ───────────────────────────────────────────────────────────
    const torusKnotGeo = new THREE.TorusKnotGeometry(1, 0.32, 256, 64)
    const torusKnotMat = new THREE.MeshPhongMaterial({
      color: 0x6c63ff,
      shininess: 120,
    })
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat)
    torusKnot.position.set(0, 0, 0)
    scene.add(torusKnot)

    const icoGeo = new THREE.IcosahedronGeometry(0.75, 1)
    const icoMat = new THREE.MeshPhongMaterial({
      color: 0xff6584,
      wireframe: true,
    })
    const icosahedron = new THREE.Mesh(icoGeo, icoMat)
    icosahedron.position.set(-3.2, 1.2, -1)
    scene.add(icosahedron)

    const octGeo = new THREE.OctahedronGeometry(0.85)
    const octMat = new THREE.MeshPhongMaterial({
      color: 0x00ccff,
      shininess: 80,
    })
    const octahedron = new THREE.Mesh(octGeo, octMat)
    octahedron.position.set(3.2, -0.6, -1)
    scene.add(octahedron)

    const torusGeo = new THREE.TorusGeometry(1.1, 0.22, 16, 100)
    const torusMat = new THREE.MeshPhongMaterial({
      color: 0xfed6e3,
      shininess: 60,
    })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.position.set(-2, -2.2, -2)
    scene.add(torus)

    const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32)
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0xa8edea,
      shininess: 90,
    })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)
    sphere.position.set(2.8, 2.2, -1)
    scene.add(sphere)

    // ── Lights ────────────────────────────────────────────────────────────
    const hemi = new THREE.HemisphereLight(0x6c63ff, 0xff6584, 2.5)
    scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 1.5)
    dir.position.set(5, 5, 5)
    scene.add(dir)

    // ── Animation loop ────────────────────────────────────────────────────
    const animate = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const t = maxScroll > 0 ? window.scrollY / maxScroll : 0
      const elapsed = performance.now() * 0.001

      // TorusKnot — spins, drifts left + up, shrinks slightly
      torusKnot.rotation.x += 0.005
      torusKnot.rotation.y += 0.01
      torusKnot.position.x = t * -3.5
      torusKnot.position.y = t * 1.5
      torusKnot.scale.setScalar(1 - t * 0.25)

      // Icosahedron — spins freely, rises on scroll
      icosahedron.rotation.x += 0.009
      icosahedron.rotation.z += 0.007
      icosahedron.position.y = 1.2 + t * 3.5

      // Octahedron — drifts left and sinks
      octahedron.rotation.y += 0.012
      octahedron.rotation.x += 0.006
      octahedron.position.x = 3.2 - t * 2.8
      octahedron.position.y = -0.6 - t * 2.5

      // Torus — comes forward and rotates fast
      torus.rotation.x += 0.007
      torus.rotation.y += 0.005
      torus.position.z = -2 + t * 3.5

      // Sphere — bobs and descends
      sphere.rotation.y += 0.01
      sphere.position.y = 2.2 + Math.sin(elapsed * 1.4) * 0.25 - t * 3

      // Camera follows scroll: zoom in + gentle downward drift
      camera.position.z = 5 - t * 2.5
      camera.position.y = -t * 2

      renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('resize', handleResize)
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement)
      ;[torusKnotGeo, icoGeo, octGeo, torusGeo, sphereGeo].forEach((g) =>
        g.dispose()
      )
      ;[torusKnotMat, icoMat, octMat, torusMat, sphereMat].forEach((m) =>
        m.dispose()
      )
      renderer.dispose()
    }
  }, [])

  const handleLogout = async (): Promise<void> => {
    await signOut(auth)
  }

  return (
    <PageWrapper>
      <NavBar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <AppTitle>G. Georgiev</AppTitle>
        </Link>
        <NavActions>
          {user && <AuthStatus>{user.displayName ?? user.email}</AuthStatus>}
          {user ? (
            <NavButton onClick={handleLogout}>Logout</NavButton>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <NavButton as="span">Login</NavButton>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <NavButton as="span">Register</NavButton>
              </Link>
            </>
          )}
        </NavActions>
      </NavBar>

      <CanvasMount ref={mountRef} aria-hidden="true" />

      <ScrollSection>
        <SectionContent>
          <SectionLabel>Welcome</SectionLabel>
          <SectionTitle>Widget Playground</SectionTitle>
          <SectionText>
            A canvas where independent widgets live. Drag, resize, and compose
            your own workspace — no setup required.
          </SectionText>
        </SectionContent>
        <ScrollHint
          style={{ opacity: scrolled ? 0 : 1 }}
          aria-label="Scroll down"
        >
          <span>Scroll</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </ScrollHint>
      </ScrollSection>

      <ScrollSection style={{ justifyContent: 'flex-end' }}>
        <SectionContent>
          <SectionLabel>Build</SectionLabel>
          <SectionTitle>Snap Widgets Together</SectionTitle>
          <SectionText>
            Every widget is a self-contained MVVM unit. Add as many as you need
            and let them communicate through the EventBus — never coupled,
            always composable.
          </SectionText>
        </SectionContent>
      </ScrollSection>

      <ScrollSection style={{ justifyContent: 'flex-start' }}>
        <SectionContent>
          <SectionLabel>Customize</SectionLabel>
          <SectionTitle>Make It Yours</SectionTitle>
          <SectionText>
            Theme, resize, or rearrange. The grid adapts to desktop, tablet, and
            mobile out of the box — your layout, your rules.
          </SectionText>
        </SectionContent>
      </ScrollSection>

      <ScrollSection>
        <SectionContent>
          <SectionLabel>Ship It</SectionLabel>
          <SectionTitle>Take Any Widget Anywhere</SectionTitle>
          <SectionText>
            Each widget is portable. Copy it into any project and it brings its
            own logic, styles, and tests along for the ride.
          </SectionText>
        </SectionContent>
      </ScrollSection>
    </PageWrapper>
  )
}
