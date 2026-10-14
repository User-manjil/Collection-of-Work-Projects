"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let animationFrameId: number

    // Detect theme
    const isDarkMode = () =>
      document.documentElement.classList.contains("dark")

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 4.8

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Palette helper
    const getColors = () => {
      const dark = isDarkMode()
      return {
        outerWireframe: dark ? 0x9e9ea7 : 0x222226,
        innerCore: dark ? 0x6366f1 : 0x4f46e5,
        particles: dark ? 0xa1a1aa : 0x52525b,
        ambient: dark ? 0xffffff : 0x333333,
      }
    }

    let colors = getColors()

    // 1. Outer Sculptural Cage: Geodesic Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 2)
    const outerMat = new THREE.MeshBasicMaterial({
      color: colors.outerWireframe,
      wireframe: true,
      transparent: true,
      opacity: isDarkMode() ? 0.35 : 0.45,
    })
    const outerMesh = new THREE.Mesh(outerGeo, outerMat)
    scene.add(outerMesh)

    // 2. Inner Kinetic Core: Intricate Torus Knot
    const innerGeo = new THREE.TorusKnotGeometry(0.75, 0.22, 120, 16, 2, 3)
    const innerMat = new THREE.MeshStandardMaterial({
      color: colors.innerCore,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: isDarkMode() ? 0.75 : 0.85,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerMesh)

    // 3. Central Node: Luminous Octahedron
    const centerGeo = new THREE.OctahedronGeometry(0.35, 0)
    const centerMat = new THREE.MeshStandardMaterial({
      color: isDarkMode() ? 0xffffff : 0x111111,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    })
    const centerMesh = new THREE.Mesh(centerGeo, centerMat)
    scene.add(centerMesh)

    // 4. Kinetic Star / Orbit Particle Field
    const particleCount = 180
    const particleCoords = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = 2.0 + Math.random() * 1.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      particleCoords[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      particleCoords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      particleCoords[i * 3 + 2] = r * Math.cos(phi)
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particleCoords, 3)
    )

    const particleMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x6366f1, 2.5, 10)
    pointLight1.position.set(3, 3, 3)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff6b4a, 1.8, 10)
    pointLight2.position.set(-3, -2, 2)
    scene.add(pointLight2)

    // Mouse Tracking for subtle parallax
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetMouseX = x * 0.45
      targetMouseY = y * 0.45
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Scroll Tracking for interactive rotation and scaling
    let scrollProgress = 0
    let targetScrollProgress = 0

    const handleScroll = () => {
      const maxScroll = window.innerHeight * 1.5
      const current = window.scrollY
      targetScrollProgress = Math.min(Math.max(current / maxScroll, 0), 1)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    // Theme Observer to update colors dynamically
    const observer = new MutationObserver(() => {
      colors = getColors()
      outerMat.color.setHex(colors.outerWireframe)
      outerMat.opacity = isDarkMode() ? 0.35 : 0.45
      innerMat.color.setHex(colors.innerCore)
      centerMat.color.setHex(isDarkMode() ? 0xffffff : 0x111111)
      particleMat.color.setHex(colors.particles)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // Animation Loop with smooth Lerping and standard performance timing
    let startTime = performance.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const now = performance.now()
      const time = (now - startTime) * 0.001

      // Lerp mouse and scroll for natural weight and inertia
      mouseX += (targetMouseX - mouseX) * 0.06
      mouseY += (targetMouseY - mouseY) * 0.06
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08

      // Scroll influences:
      // 1. Extra rotation spin velocity and tilt
      const scrollRotationX = scrollProgress * Math.PI * 1.8
      const scrollRotationY = scrollProgress * Math.PI * 2.4
      const scrollScale = 1.0 - scrollProgress * 0.22

      // Outer Cage rotation
      outerMesh.rotation.x = time * 0.18 + mouseY + scrollRotationX
      outerMesh.rotation.y = time * 0.22 + mouseX + scrollRotationY
      outerMesh.scale.setScalar(scrollScale)

      // Inner Knot counter-rotation
      innerMesh.rotation.x = -time * 0.35 - mouseY * 1.2 - scrollRotationX * 1.3
      innerMesh.rotation.y = time * 0.4 + mouseX * 1.2 + scrollRotationY * 1.5
      innerMesh.rotation.z = time * 0.2
      innerMesh.scale.setScalar(scrollScale * (0.95 + Math.sin(time * 1.5) * 0.04))

      // Center Octahedron subtle pulsing rotation
      centerMesh.rotation.x = time * 0.8
      centerMesh.rotation.y = -time * 0.6
      const centerPulse = 1 + Math.sin(time * 3) * 0.08
      centerMesh.scale.set(centerPulse, centerPulse, centerPulse)

      // Particles gentle drift & swirl
      particleSystem.rotation.y = time * 0.05 + scrollRotationY * 0.3
      particleSystem.rotation.x = time * 0.03 + mouseX * 0.2

      // Camera parallax
      camera.position.x = mouseX * 0.8
      camera.position.y = mouseY * 0.8
      camera.position.z = 4.8 + scrollProgress * 0.8
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      observer.disconnect()
      resizeObserver.disconnect()

      outerGeo.dispose()
      outerMat.dispose()
      innerGeo.dispose()
      innerMat.dispose()
      centerGeo.dispose()
      centerMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="hero-3d-wrapper">
      <div ref={containerRef} className="hero-3d-canvas-container" />
    </div>
  )
}
