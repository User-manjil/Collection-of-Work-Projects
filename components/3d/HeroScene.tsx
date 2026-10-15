"use client"

import { useEffect, useRef } from "react"

/**
 * Premium glossy 3D Poké Ball (fan-art, procedural – no model files).
 *
 * Look
 *  - Lacquered red + pearl white shell with a clearcoat finish
 *  - Raised satin-black center band, layered glowing button
 *  - Procedural studio lighting (softboxes + light strips) for rich reflections
 *  - Floating dust, orbit rings, red under-glow and a contact shadow
 *
 * Interaction
 *  - Hover  : label appears at the cursor, ball scales up, button glows
 *  - Mouse  : ball tilts / turns toward the cursor
 *  - Scroll : turntable spin + camera zoom
 *  - Click  : "catch" animation – ball shakes, button blinks red, then a
 *             shockwave + sparkle burst (tap works on touch screens too)
 *
 * Perf: three.js lazy-loaded, cheap proxy sphere for hover raycasts,
 * pixel ratio capped, pauses off-screen / hidden tab, reduced-motion aware.
 */

type Vec3 = [number, number, number]

type Props = {
  label?: string
  hint?: string
}

export default function PokeBallScene({
  label = "Poké Ball",
  hint = "Click to catch",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const labelEl = labelRef.current
    if (!container || !labelEl) return

    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative"
    }

    let disposed = false
    let cleanup: (() => void) | undefined

    import("three").then((THREE) => {
      if (disposed || !container) return

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      const disposables: { dispose(): void }[] = []
      const track = <T extends { dispose(): void }>(o: T): T => {
        disposables.push(o)
        return o
      }

      // ---------- renderer / scene / camera ----------
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      renderer.domElement.style.display = "block"
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        38,
        container.clientWidth / container.clientHeight,
        0.1,
        80
      )
      let baseZ = 7
      const fitCamera = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        if (!w || !h) return
        camera.aspect = w / h
        baseZ = 7 * Math.max(1, 0.8 / camera.aspect)
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }
      fitCamera()

      // ---------- procedural studio environment (no downloads) ----------
      {
        const envScene = new THREE.Scene()
        envScene.add(
          new THREE.Mesh(
            new THREE.SphereGeometry(30, 32, 16),
            new THREE.MeshBasicMaterial({ color: 0x1a1a22, side: THREE.BackSide })
          )
        )
        const panel = (
          color: number,
          intensity: number,
          pos: Vec3,
          size: [number, number]
        ) => {
          const mat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
          mat.color.multiplyScalar(intensity)
          const m = new THREE.Mesh(new THREE.PlaneGeometry(size[0], size[1]), mat)
          m.position.set(...pos)
          m.lookAt(0, 0, 0)
          envScene.add(m)
        }
        panel(0xffffff, 7, [6, 7, 7], [8, 10]) // key softbox
        panel(0xbfdcff, 4, [-9, 3, 5], [5, 10]) // cool fill
        panel(0xffd9b0, 5, [-3, 4, -10], [10, 6]) // warm rim
        panel(0xffffff, 4, [0, 12, 0], [14, 3]) // top strip
        panel(0xffffff, 10, [4.5, 2, 9], [0.6, 9]) // crisp highlight strips
        panel(0xffffff, 10, [-4.5, 2, 9], [0.6, 9])
        panel(0x9a9ab0, 1.2, [0, -4, 0], [24, 24]) // floor bounce

        const pmrem = new THREE.PMREMGenerator(renderer)
        const envRT = pmrem.fromScene(envScene, 0.03)
        scene.environment = envRT.texture
        track(envRT)
        pmrem.dispose()
        envScene.traverse((o) => {
          const m = o as import("three").Mesh
          if (m.isMesh) {
            m.geometry.dispose()
            ;(m.material as import("three").Material).dispose()
          }
        })
      }
      const key = new THREE.DirectionalLight(0xffffff, 1.2)
      key.position.set(3, 4, 5)
      scene.add(key)

      // ---------- materials ----------
      const redMat = track(
        new THREE.MeshPhysicalMaterial({
          color: 0xd71d1d,
          metalness: 0.12,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          envMapIntensity: 1.1,
        })
      )
      const whiteMat = track(
        new THREE.MeshPhysicalMaterial({
          color: 0xf6f6f9,
          metalness: 0.05,
          roughness: 0.28,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1,
        })
      )
      const blackMat = track(
        new THREE.MeshPhysicalMaterial({
          color: 0x0d0d11,
          metalness: 0.6,
          roughness: 0.3,
          clearcoat: 0.8,
          clearcoatRoughness: 0.08,
          envMapIntensity: 1.1,
        })
      )
      const buttonMat = track(
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.2,
          clearcoat: 1,
          emissive: new THREE.Color(0xffffff),
          emissiveIntensity: 0.15,
          side: THREE.DoubleSide,
        })
      )
      const discBlack = track(
        new THREE.MeshPhysicalMaterial({
          color: 0x0d0d11,
          metalness: 0.6,
          roughness: 0.3,
          clearcoat: 0.8,
          side: THREE.DoubleSide,
        })
      )
      const discWhite = track(
        new THREE.MeshPhysicalMaterial({
          color: 0xf6f6f9,
          roughness: 0.28,
          clearcoat: 1,
          side: THREE.DoubleSide,
        })
      )

      // ---------- rig: root(float) > spin(tilt/turntable) > ball ----------
      const root = new THREE.Group()
      const spin = new THREE.Group()
      const ball = new THREE.Group()
      ball.scale.setScalar(1.2)
      root.add(spin)
      spin.add(ball)
      scene.add(root)

      // shell: top red, bottom white, raised satin-black band in between
      const G = 0.085 // half band angle (radians)
      const topGeo = track(
        new THREE.SphereGeometry(1, 128, 48, 0, Math.PI * 2, 0, Math.PI / 2 - G)
      )
      const botGeo = track(
        new THREE.SphereGeometry(
          1, 128, 48, 0, Math.PI * 2, Math.PI / 2 + G, Math.PI / 2 - G
        )
      )
      ball.add(new THREE.Mesh(topGeo, redMat))
      ball.add(new THREE.Mesh(botGeo, whiteMat))

      // band: smooth raised bump that blends seamlessly into both hemispheres
      const bandPts: import("three").Vector2[] = []
      const N = 40
      for (let i = 0; i <= N; i++) {
        const t = i / N
        const phi = -G + t * 2 * G
        const R = 1 + Math.pow(Math.sin(t * Math.PI), 0.4) * 0.022
        bandPts.push(new THREE.Vector2(R * Math.cos(phi), R * Math.sin(phi)))
      }
      const bandGeo = track(new THREE.LatheGeometry(bandPts, 128))
      ball.add(new THREE.Mesh(bandGeo, blackMat))

      // layered center button (lathe discs with rounded edges)
      const disc = (r: number, h: number, bevel: number) => {
        const pts: import("three").Vector2[] = [
          new THREE.Vector2(0, 0),
          new THREE.Vector2(r, 0),
          new THREE.Vector2(r, h - bevel),
        ]
        for (let k = 1; k <= 8; k++) {
          const a = (k / 8) * (Math.PI / 2)
          pts.push(
            new THREE.Vector2(r - bevel + bevel * Math.cos(a), h - bevel + bevel * Math.sin(a))
          )
        }
        pts.push(new THREE.Vector2(0, h))
        return track(new THREE.LatheGeometry(pts, 96))
      }
      const btn = new THREE.Group()
      btn.rotation.x = Math.PI / 2 // lathe +y -> +z (faces the camera)
      ball.add(btn)
      const layer = (geo: import("three").BufferGeometry, mat: import("three").Material) => {
        const m = new THREE.Mesh(geo, mat)
        m.position.y = 0.95
        btn.add(m)
      }
      layer(disc(0.25, 0.08, 0.02), discBlack) // outer ring  -> front z = 1.03
      layer(disc(0.18, 0.095, 0.02), discWhite) // white ring  -> front z = 1.045
      layer(disc(0.13, 0.105, 0.015), discBlack) // dark gap    -> front z = 1.055
      layer(disc(0.105, 0.12, 0.035), buttonMat) // glowing button -> front z = 1.07

      // invisible low-poly proxy used only for fast hover/click raycasts
      const proxy = new THREE.Mesh(
        track(new THREE.SphereGeometry(1.02, 16, 12)),
        new THREE.MeshBasicMaterial()
      )
      proxy.visible = false
      ball.add(proxy)

      // ---------- decoration: orbit rings, dust, glow, shadow ----------
      const ringMat = track(
        new THREE.MeshBasicMaterial({ color: 0x8b93a7, transparent: true, opacity: 0.45 })
      )
      const ringGeo = track(new THREE.TorusGeometry(1.95, 0.006, 8, 220))
      const ring1 = new THREE.Mesh(ringGeo, ringMat)
      const ring2 = new THREE.Mesh(ringGeo, ringMat)
      ring1.rotation.set(1.25, 0.2, 0)
      ring2.rotation.set(0.5, 0, 0.9)
      ring2.scale.setScalar(1.18)
      scene.add(ring1, ring2)

      const DUST = 160
      const dustPos = new Float32Array(DUST * 3)
      for (let i = 0; i < DUST; i++) {
        const r = 2.4 + Math.random() * 2.6
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(Math.random() * 2 - 1)
        dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th)
        dustPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7
        dustPos[i * 3 + 2] = r * Math.cos(ph) - 1
      }
      const dustGeo = track(new THREE.BufferGeometry())
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3))
      const dustMat = track(
        new THREE.PointsMaterial({
          color: 0xaab0c0,
          size: 0.035,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
        })
      )
      const dust = new THREE.Points(dustGeo, dustMat)
      scene.add(dust)

      const radialTex = (rgb: string) => {
        const c = document.createElement("canvas")
        c.width = c.height = 64
        const ctx = c.getContext("2d")!
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        g.addColorStop(0, `rgba(${rgb},1)`)
        g.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 64, 64)
        return track(new THREE.CanvasTexture(c))
      }
      const floorY = -1.85
      const planeGeo = track(new THREE.PlaneGeometry(1, 1))
      const glowMat = track(
        new THREE.MeshBasicMaterial({
          map: radialTex("255,60,60"),
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        })
      )
      const glow = new THREE.Mesh(planeGeo, glowMat)
      glow.rotation.x = -Math.PI / 2
      glow.position.y = floorY
      glow.scale.set(4.2, 4.2, 1)
      scene.add(glow)
      const shadowMat = track(
        new THREE.MeshBasicMaterial({
          map: radialTex("0,0,0"),
          transparent: true,
          opacity: 0.4,
          depthWrite: false,
        })
      )
      const shadow = new THREE.Mesh(planeGeo, shadowMat)
      shadow.rotation.x = -Math.PI / 2
      shadow.position.y = floorY + 0.005
      shadow.scale.set(2.8, 2.8, 1)
      scene.add(shadow)

      // ---------- catch effects: sparks + shockwave ----------
      const SPARKS = 120
      const sparkPos = new Float32Array(SPARKS * 3)
      const sparkVel = new Float32Array(SPARKS * 3)
      const sparkGeo = track(new THREE.BufferGeometry())
      sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3))
      const sparkMat = track(
        new THREE.PointsMaterial({
          color: 0xffc83d,
          size: 0.09,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        })
      )
      const sparks = new THREE.Points(sparkGeo, sparkMat)
      sparks.frustumCulled = false
      scene.add(sparks)
      let sparkLife = 0

      const waveGeo = track(new THREE.RingGeometry(0.96, 1, 96))
      const waveMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      )
      const wave = new THREE.Mesh(waveGeo, waveMat)
      wave.visible = false
      scene.add(wave)
      let waveT = -1

      const burst = () => {
        for (let i = 0; i < SPARKS; i++) {
          const th = Math.random() * Math.PI * 2
          const ph = Math.acos(Math.random() * 2 - 1)
          const sp = 1.5 + Math.random() * 2.5
          sparkPos.set([0, 0, 0], i * 3)
          sparkVel.set(
            [
              Math.sin(ph) * Math.cos(th) * sp,
              Math.sin(ph) * Math.sin(th) * sp,
              Math.cos(ph) * sp,
            ],
            i * 3
          )
        }
        sparkGeo.attributes.position.needsUpdate = true
        sparkLife = 1
        waveT = 0
        wave.visible = true
      }

      // ---------- state ----------
      const S = {
        tx: 0, ty: 0, mx: 0, my: 0,
        tScroll: 0, scroll: 0,
        hover: 0, forceHoverUntil: 0,
        shakeT: -1,
        px: 0, py: 0,
      }

      const raycaster = new THREE.Raycaster()
      const ndc = new THREE.Vector2(9, 9)
      const setPointer = (e: PointerEvent) => {
        const r = container.getBoundingClientRect()
        S.px = e.clientX - r.left
        S.py = e.clientY - r.top
        ndc.set((S.px / r.width) * 2 - 1, -((S.py / r.height) * 2 - 1))
        S.tx = Math.max(-1.5, Math.min(1.5, ndc.x))
        S.ty = Math.max(-1.5, Math.min(1.5, ndc.y))
      }
      const hitsBall = () => {
        if (Math.abs(ndc.x) > 1 || Math.abs(ndc.y) > 1) return false
        raycaster.setFromCamera(ndc, camera)
        return raycaster.intersectObject(proxy, false).length > 0
      }

      let hoverDirty = false
      const onMove = (e: PointerEvent) => {
        setPointer(e)
        hoverDirty = true
      }
      const onDown = (e: PointerEvent) => {
        setPointer(e)
        if (hitsBall()) {
          if (S.shakeT < 0) S.shakeT = 0
          if (e.pointerType === "touch") S.forceHoverUntil = performance.now() + 2200
        }
      }
      const onScroll = () => {
        S.tScroll = Math.min(Math.max(window.scrollY / (window.innerHeight * 1.5), 0), 1)
      }
      window.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("pointerdown", onDown, { passive: true })
      window.addEventListener("scroll", onScroll, { passive: true })
      onScroll()
      S.scroll = S.tScroll

      const ro = new ResizeObserver(fitCamera)
      ro.observe(container)

      // ---------- animation ----------
      let raf = 0
      let running = false
      let inView = true
      let last = performance.now()
      let time = 0
      let frameNo = 0
      let isHover = false
      const speed = reduceMotion ? 0.3 : 1
      const RED = new THREE.Color(0xff2a2a)
      const WHITE = new THREE.Color(0xffffff)

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame)
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        time += dt * speed
        frameNo++

        S.mx += (S.tx - S.mx) * 0.08
        S.my += (S.ty - S.my) * 0.08
        S.scroll += (S.tScroll - S.scroll) * 0.08

        // hover detection
        if (hoverDirty || frameNo % 8 === 0) {
          hoverDirty = false
          const hit = hitsBall() || now < S.forceHoverUntil
          if (hit !== isHover) {
            isHover = hit
            labelEl.style.opacity = hit ? "1" : "0"
            container.style.cursor = hit ? "pointer" : "default"
          }
        }
        S.hover += ((isHover ? 1 : 0) - S.hover) * 0.12

        // catch animation
        let shakeZ = 0
        let blinking = false
        if (S.shakeT >= 0) {
          S.shakeT += dt
          shakeZ = Math.sin(S.shakeT * 14) * 0.45 * Math.exp(-S.shakeT * 1.6)
          blinking = true
          if (S.shakeT >= 1.6) {
            S.shakeT = -1
            burst()
          }
        }

        // turntable on scroll, tilt toward cursor, calm idle sway
        spin.rotation.y =
          S.scroll * Math.PI * 2 +
          S.mx * 0.55 +
          Math.sin(time * 0.5) * 0.35 * (1 - S.hover)
        spin.rotation.x = -S.my * 0.35 + Math.sin(time * 0.4) * 0.05 + S.scroll * 0.5
        spin.rotation.z = shakeZ
        ball.scale.setScalar(1.2 * (1 + S.hover * 0.05))

        // float + shadow/glow
        const lift = Math.sin(time * 1.1) * 0.07
        root.position.y = lift
        const sh = 1 / (1 + (lift + 0.07) * 1.2)
        shadow.scale.set(2.8 * sh, 2.8 * sh, 1)
        shadowMat.opacity = 0.4 * sh
        glowMat.opacity = 0.32 + S.hover * 0.25

        // button glow / blink
        if (blinking) {
          buttonMat.emissive.copy(RED)
          buttonMat.emissiveIntensity = 0.5 + 0.5 * Math.sin(S.shakeT * 22)
        } else {
          buttonMat.emissive.copy(WHITE)
          buttonMat.emissiveIntensity = 0.15 + Math.sin(time * 2.4) * 0.05 + S.hover * 0.7
        }

        // decoration motion
        ring1.rotation.z = time * 0.25 + S.scroll * 2
        ring2.rotation.y = -time * 0.18
        dust.rotation.y = time * 0.03 + S.scroll
        dust.rotation.x = S.my * 0.1

        // sparks + shockwave
        if (sparkLife > 0) {
          sparkLife = Math.max(0, sparkLife - dt * 1.1)
          for (let i = 0; i < SPARKS; i++) {
            sparkVel[i * 3 + 1] -= 1.2 * dt
            sparkPos[i * 3] += sparkVel[i * 3] * dt
            sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt
            sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt
          }
          sparkGeo.attributes.position.needsUpdate = true
          sparkMat.opacity = sparkLife
        }
        if (waveT >= 0) {
          waveT += dt / 0.8
          const t = Math.min(waveT, 1)
          wave.scale.setScalar(1.3 + t * 2.4)
          waveMat.opacity = (1 - t) * 0.8
          if (waveT >= 1) {
            waveT = -1
            wave.visible = false
          }
        }

        // name label follows cursor
        if (S.hover > 0.01) {
          labelEl.style.transform = `translate(${S.px}px, ${S.py}px) translate(-50%, -170%)`
        }

        // camera
        const z = baseZ * (1 - Math.sin(S.scroll * Math.PI) * 0.15)
        camera.position.set(S.mx * 0.5, 0.35 + S.my * 0.3, z)
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)
      }

      const start = () => {
        if (running) return
        running = true
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
      const stop = () => {
        running = false
        cancelAnimationFrame(raf)
      }
      const sync = () => (inView && !document.hidden ? start() : stop())

      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting
        sync()
      })
      io.observe(container)
      document.addEventListener("visibilitychange", sync)

      camera.position.set(0, 0.35, baseZ)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      renderer.domElement.style.opacity = "0"
      renderer.domElement.style.transition = "opacity 0.8s ease"
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          renderer.domElement.style.opacity = "1"
        })
      )
      sync()

      cleanup = () => {
        stop()
        io.disconnect()
        ro.disconnect()
        document.removeEventListener("visibilitychange", sync)
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerdown", onDown)
        window.removeEventListener("scroll", onScroll)
        proxy.material.dispose()
        disposables.forEach((d) => d.dispose())
        renderer.dispose()
        renderer.forceContextLoss()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    })

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [])

  return (
    <div className="hero-3d-wrapper">
      <div ref={containerRef} className="hero-3d-canvas-container">
        <div
          ref={labelRef}
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 5,
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity 0.25s ease",
            padding: "8px 18px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            textAlign: "center",
            color: "#fff",
            background:
              "linear-gradient(135deg, rgba(18,18,26,0.9), rgba(58,58,82,0.9))",
            border: "1px solid rgba(255,255,255,0.28)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            fontWeight: 600,
            letterSpacing: "0.02em",
            fontSize: 16,
          }}
        >
          {label}
          {hint ? (
            <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75 }}>{hint}</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}