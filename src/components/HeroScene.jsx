import { useEffect, useRef } from 'react'
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, BufferGeometry, Float32BufferAttribute,
  Points, PointsMaterial, LineSegments, LineBasicMaterial, CanvasTexture, AdditiveBlending,
  Color, Vector3, SRGBColorSpace,
} from 'three'

/**
 * Agent network — a slowly turning graph of glowing nodes with "messages" (pulses) travelling
 * along the edges. It's a visual metaphor for Agentic AI workflows.
 * Loaded lazily, paused when off-screen or when the tab is hidden, capped pixel-ratio.
 */
function glowSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.75)')
  grad.addColorStop(0.55, 'rgba(255,255,255,0.18)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  return t
}

export default function HeroScene() {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    let renderer
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
    } catch {
      return // no WebGL → the page simply keeps its CSS glow
    }
    const small = window.innerWidth < 720
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(48, 1, 0.1, 60)
    camera.position.z = 9.5
    const group = new Group()
    scene.add(group)

    /* ── nodes on a noisy fibonacci sphere ───────────────── */
    const N = small ? 64 : 118
    const nodes = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = golden * i
      const rad = 3.5 * (0.7 + Math.random() * 0.4)
      nodes.push(new Vector3(Math.cos(th) * r * rad, y * rad, Math.sin(th) * r * rad))
    }

    /* ── edges: each node links to its 3 nearest neighbours ─ */
    const edgeKey = new Set()
    const edges = []
    for (let i = 0; i < N; i++) {
      const near = nodes
        .map((p, j) => ({ j, d: p.distanceToSquared(nodes[i]) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
      for (const { j } of near) {
        const k = i < j ? `${i}-${j}` : `${j}-${i}`
        if (!edgeKey.has(k)) {
          edgeKey.add(k)
          edges.push([i, j])
        }
      }
    }
    const adj = Array.from({ length: N }, () => [])
    edges.forEach(([a, b], ei) => { adj[a].push(ei); adj[b].push(ei) })

    const palette = [new Color('#a855f7'), new Color('#e879f9'), new Color('#818cf8'), new Color('#f5f3ff')]
    const tex = glowSprite()

    // nodes
    const nodePos = new Float32Array(N * 3)
    const nodeCol = new Float32Array(N * 3)
    nodes.forEach((p, i) => {
      nodePos.set([p.x, p.y, p.z], i * 3)
      const c = palette[Math.random() < 0.15 ? 3 : Math.floor(Math.random() * 3)]
      nodeCol.set([c.r, c.g, c.b], i * 3)
    })
    const nodeGeo = new BufferGeometry()
    nodeGeo.setAttribute('position', new Float32BufferAttribute(nodePos, 3))
    nodeGeo.setAttribute('color', new Float32BufferAttribute(nodeCol, 3))
    const nodeMat = new PointsMaterial({
      size: small ? 0.34 : 0.3, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending,
    })
    group.add(new Points(nodeGeo, nodeMat))

    // edges
    const linePos = new Float32Array(edges.length * 6)
    edges.forEach(([a, b], i) => {
      linePos.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], i * 6)
    })
    const lineGeo = new BufferGeometry()
    lineGeo.setAttribute('position', new Float32BufferAttribute(linePos, 3))
    const lineMat = new LineBasicMaterial({ color: '#8b5cf6', transparent: true, opacity: 0.2, depthWrite: false, blending: AdditiveBlending })
    group.add(new LineSegments(lineGeo, lineMat))

    // pulses (messages travelling between agents)
    const P = small ? 12 : 24
    const pulses = Array.from({ length: P }, () => {
      const e = Math.floor(Math.random() * edges.length)
      return { e, t: Math.random(), speed: 0.35 + Math.random() * 0.55, fwd: Math.random() < 0.5 }
    })
    const pulsePos = new Float32Array(P * 3)
    const pulseGeo = new BufferGeometry()
    pulseGeo.setAttribute('position', new Float32BufferAttribute(pulsePos, 3))
    const pulseMat = new PointsMaterial({
      size: small ? 0.5 : 0.46, map: tex, color: '#fbcfe8', transparent: true, depthWrite: false, blending: AdditiveBlending,
    })
    group.add(new Points(pulseGeo, pulseMat))

    /* ── sizing ─────────────────────────────────────────── */
    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.position.z = camera.aspect < 0.75 ? 13 : camera.aspect < 1.2 ? 11 : 9.5
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    /* ── pointer parallax ───────────────────────────────── */
    let mx = 0, my = 0, sx = 0, sy = 0
    const onPointer = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1
      my = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    /* ── loop (paused off-screen / hidden tab) ───────────── */
    let raf = 0, last = performance.now(), spin = 0, ready = false
    let inView = true
    const tmpA = new Vector3(), tmpB = new Vector3()

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      spin += dt * 0.11
      sx += (mx - sx) * 0.05
      sy += (my - sy) * 0.05
      group.rotation.y = spin + sx * 0.45
      group.rotation.x = sy * 0.28

      for (let i = 0; i < P; i++) {
        const p = pulses[i]
        p.t += dt * p.speed
        if (p.t >= 1) {
          const node = p.fwd ? edges[p.e][1] : edges[p.e][0]
          const opts = adj[node]
          p.e = opts[Math.floor(Math.random() * opts.length)]
          p.fwd = edges[p.e][0] === node
          p.t = 0
        }
        const [a, b] = edges[p.e]
        tmpA.copy(nodes[p.fwd ? a : b])
        tmpB.copy(nodes[p.fwd ? b : a])
        tmpA.lerp(tmpB, p.t)
        pulsePos[i * 3] = tmpA.x
        pulsePos[i * 3 + 1] = tmpA.y
        pulsePos[i * 3 + 2] = tmpA.z
      }
      pulseGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      if (!ready) {
        ready = true
        el.classList.add('is-ready')
      }
    }
    const start = () => { if (!raf && inView && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame) } }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? start() : stop() }, { threshold: 0 })
    io.observe(el)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', onVis)
      ;[nodeGeo, lineGeo, pulseGeo].forEach((g) => g.dispose())
      ;[nodeMat, lineMat, pulseMat].forEach((m) => m.dispose())
      tex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div className="hero-canvas" ref={host} aria-hidden="true" />
}
