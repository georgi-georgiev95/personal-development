import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { CanvasMount } from '@/pages/PlaygroundPage.styles'

const PlaygroundCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)

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

    // Objects
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

    // Lights
    const hemi = new THREE.HemisphereLight(0x6c63ff, 0xff6584, 2.5)
    scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 1.5)
    dir.position.set(5, 5, 5)
    scene.add(dir)

    // Animation
    const animate = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const t = maxScroll > 0 ? window.scrollY / maxScroll : 0
      const elapsed = performance.now() * 0.001

      torusKnot.rotation.x += 0.005
      torusKnot.rotation.y += 0.01
      torusKnot.position.x = t * -3.5
      torusKnot.position.y = t * 1.5
      torusKnot.scale.setScalar(1 - t * 0.25)

      icosahedron.rotation.x += 0.009
      icosahedron.rotation.z += 0.007
      icosahedron.position.y = 1.2 + t * 3.5

      octahedron.rotation.y += 0.012
      octahedron.rotation.x += 0.006
      octahedron.position.x = 3.2 - t * 2.8
      octahedron.position.y = -0.6 - t * 2.5

      torus.rotation.x += 0.007
      torus.rotation.y += 0.005
      torus.position.z = -2 + t * 3.5

      sphere.rotation.y += 0.01
      sphere.position.y = 2.2 + Math.sin(elapsed * 1.4) * 0.25 - t * 3

      // camera zoom in as you scroll
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

  return <CanvasMount ref={mountRef} aria-hidden />
}

export default PlaygroundCanvas
