import { useEffect, useRef, useState } from 'react'
import { audio } from '../utils/audioEngine'

interface NodePoint {
  id: string
  name: string
  country: string
  lat: number
  lng: number
  threatLevel: 'CRITICAL' | 'ELEVATED' | 'MONITORED' | 'STABLE'
  threatColor: string
  activeEvents: number
}

const NODES: NodePoint[] = [
  { id: 'tlv', name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, threatLevel: 'ELEVATED', threatColor: '#ff0055', activeEvents: 14 },
  { id: 'kyiv', name: 'Kyiv', country: 'Ukraine', lat: 50.4501, lng: 30.5234, threatLevel: 'CRITICAL', threatColor: '#ff0055', activeEvents: 28 },
  { id: 'dc', name: 'Washington D.C.', country: 'USA', lat: 38.9072, lng: -77.0369, threatLevel: 'MONITORED', threatColor: '#00f0ff', activeEvents: 9 },
  { id: 'teh', name: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.389, threatLevel: 'CRITICAL', threatColor: '#ff0055', activeEvents: 22 },
  { id: 'tpe', name: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654, threatLevel: 'ELEVATED', threatColor: '#ffb800', activeEvents: 11 },
  { id: 'lon', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, threatLevel: 'STABLE', threatColor: '#00ff9d', activeEvents: 4 },
  { id: 'redsea', name: 'Bab el-Mandeb', country: 'Red Sea Corridor', lat: 12.5833, lng: 43.3333, threatLevel: 'CRITICAL', threatColor: '#ff0055', activeEvents: 19 },
]

export function Interactive3DGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodePoint>(NODES[0])

  const stateRef = useRef({
    rotationX: 0.25,
    rotationY: 0,
    targetRotationX: 0.25,
    targetRotationY: 0,
    autoRotate: true,
    isDragging: false,
    startX: 0,
    startY: 0,
    dots: [] as { x: number; y: number; z: number }[],
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const size = 520
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const globeRadius = 190
    const dotCount = 750

    // Fibonacci sphere distribution
    const dots: { x: number; y: number; z: number }[] = []
    const phi = Math.PI * (3 - Math.sqrt(5)) // Golden angle

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = phi * i

      dots.push({
        x: Math.cos(theta) * radiusAtY * globeRadius,
        y: y * globeRadius,
        z: Math.sin(theta) * radiusAtY * globeRadius,
      })
    }
    stateRef.current.dots = dots

    function latLngTo3D(lat: number, lng: number, radius: number) {
      const phiRad = (90 - lat) * (Math.PI / 180)
      const thetaRad = (lng + 180) * (Math.PI / 180)

      return {
        x: -(radius * Math.sin(phiRad) * Math.cos(thetaRad)),
        y: radius * Math.cos(phiRad),
        z: radius * Math.sin(phiRad) * Math.sin(thetaRad),
      }
    }

    let pulseTime = 0

    const render = () => {
      // Pause rendering if tab is hidden to conserve power
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      pulseTime += 0.03
      const state = stateRef.current

      if (state.autoRotate && !state.isDragging) {
        state.targetRotationY += 0.0035
      }

      state.rotationX += (state.targetRotationX - state.rotationX) * 0.12
      state.rotationY += (state.targetRotationY - state.rotationY) * 0.12

      ctx.clearRect(0, 0, size, size)

      const centerX = size / 2
      const centerY = size / 2

      // Google Hologram Aura Radial Glow
      const grad = ctx.createRadialGradient(centerX, centerY, globeRadius * 0.5, centerX, centerY, globeRadius * 1.28)
      grad.addColorStop(0, 'rgba(0, 240, 255, 0.06)')
      grad.addColorStop(0.5, 'rgba(0, 255, 157, 0.04)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(centerX, centerY, globeRadius * 1.28, 0, Math.PI * 2)
      ctx.fill()

      // Rotation matrix values
      const cosX = Math.cos(state.rotationX)
      const sinX = Math.sin(state.rotationX)
      const cosY = Math.cos(state.rotationY)
      const sinY = Math.sin(state.rotationY)

      function project(x: number, y: number, z: number) {
        const x1 = x * cosY - z * sinY
        const z1 = z * cosY + x * sinY
        const y2 = y * cosX - z1 * sinX
        const z2 = z1 * cosX + y * sinX

        return {
          px: centerX + x1,
          py: centerY + y2,
          pz: z2,
        }
      }

      // Draw Grid Dots
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i]
        const { px, py, pz } = project(dot.x, dot.y, dot.z)

        const normalizedZ = (pz + globeRadius) / (globeRadius * 2)
        if (normalizedZ > 0.08) {
          const alpha = Math.max(0.04, normalizedZ * 0.65)
          const dotSize = Math.max(0.8, normalizedZ * 1.8)

          ctx.fillStyle = `rgba(0, 255, 157, ${alpha})`
          ctx.beginPath()
          ctx.arc(px, py, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Projected Nodes & Connections
      const projectedNodes = NODES.map((node) => {
        const pos = latLngTo3D(node.lat, node.lng, globeRadius)
        const proj = project(pos.x, pos.y, pos.z)
        return { ...node, ...proj }
      })

      // Draw Geodesic Connections Arcs
      const hub = projectedNodes[0] // Tel Aviv HQ
      for (let i = 1; i < projectedNodes.length; i++) {
        const target = projectedNodes[i]
        if (hub.pz > -globeRadius * 0.4 || target.pz > -globeRadius * 0.4) {
          ctx.beginPath()
          ctx.moveTo(hub.px, hub.py)
          const midX = (hub.px + target.px) / 2
          const midY = (hub.py + target.py) / 2 - 25
          ctx.quadraticCurveTo(midX, midY, target.px, target.py)

          const arcAlpha = Math.min(
            0.45,
            Math.max(0.05, ((hub.pz + target.pz) / 2 + globeRadius) / (globeRadius * 2))
          )
          ctx.strokeStyle = `rgba(255, 0, 85, ${arcAlpha})`
          ctx.lineWidth = 1.2
          ctx.setLineDash([3, 5])
          ctx.stroke()
          ctx.setLineDash([])

          // Photon packet
          const t = (pulseTime + i * 0.25) % 1
          const particleX = (1 - t) * (1 - t) * hub.px + 2 * (1 - t) * t * midX + t * t * target.px
          const particleY = (1 - t) * (1 - t) * hub.py + 2 * (1 - t) * t * midY + t * t * target.py
          ctx.fillStyle = target.threatColor
          ctx.beginPath()
          ctx.arc(particleX, particleY, 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Draw Node Beacons
      projectedNodes.forEach((node) => {
        if (node.pz > -globeRadius * 0.2) {
          const isCurrentSelected = node.id === selectedNode.id
          const beaconSize = isCurrentSelected ? 5 : 3.2
          const pulse = (Math.sin(pulseTime * 3.5) + 1) / 2

          ctx.beginPath()
          ctx.arc(node.px, node.py, beaconSize + pulse * 7, 0, Math.PI * 2)
          ctx.fillStyle = `${node.threatColor}33`
          ctx.fill()

          ctx.beginPath()
          ctx.arc(node.px, node.py, beaconSize, 0, Math.PI * 2)
          ctx.fillStyle = node.threatColor
          ctx.shadowColor = node.threatColor
          ctx.shadowBlur = 12
          ctx.fill()
          ctx.shadowBlur = 0

          if (node.pz > 0 || isCurrentSelected) {
            ctx.font = '10px JetBrains Mono, monospace'
            ctx.fillStyle = isCurrentSelected ? '#00f0ff' : '#94a3b8'
            ctx.fillText(`[${node.name}]`, node.px + 8, node.py + 3)
          }
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [selectedNode])

  // Pointer Events with Pointer Capture (Support both mouse & mobile touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    stateRef.current.isDragging = true
    stateRef.current.autoRotate = false
    stateRef.current.startX = e.clientX
    stateRef.current.startY = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
    audio.playClick(1100)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isDragging) return
    const dx = e.clientX - stateRef.current.startX
    const dy = e.clientY - stateRef.current.startY

    stateRef.current.targetRotationY += dx * 0.007
    stateRef.current.targetRotationX = Math.max(-0.85, Math.min(0.85, stateRef.current.targetRotationX - dy * 0.007))

    stateRef.current.startX = e.clientX
    stateRef.current.startY = e.clientY
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    stateRef.current.isDragging = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignored
    }
    setTimeout(() => {
      stateRef.current.autoRotate = true
    }, 4000)
  }

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-cyan/20 bg-bg-panel p-6 shadow-neon-cyan/20 backdrop-blur-xl">
      <div className="absolute top-4 left-4 flex items-center gap-2 font-mono text-[11px] text-text-faint">
        <span className="h-2 w-2 animate-ping rounded-full bg-red" />
        <span className="text-cyan font-bold">GLOBAL_OSINT_RADAR // ACTIVE</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[10px] text-text-dim">
        <span className="rounded border border-line bg-bg-panel-alt px-2 py-0.5">POINTER ROTATION • 60 FPS</span>
      </div>

      {/* 3D Canvas */}
      <div className="relative my-2 cursor-grab active:cursor-grabbing touch-none">
        <canvas
          ref={canvasRef}
          className="h-[360px] w-[360px] max-w-full sm:h-[420px] sm:w-[420px]"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>

      {/* Interactive Node Selector */}
      <div className="mt-2 w-full border-t border-line pt-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
          <span className="text-text-faint">ACTIVE SECTOR TELEMETRY</span>
          <span className="font-bold text-red">{selectedNode.threatLevel} PRIORITY</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {NODES.map((node) => {
            const isSel = node.id === selectedNode.id
            return (
              <button
                key={node.id}
                onClick={() => {
                  setSelectedNode(node)
                  audio.playClick(1400)
                }}
                onMouseEnter={() => audio.playHover()}
                className={`rounded border px-2.5 py-1 font-mono text-[11px] transition-all ${
                  isSel
                    ? 'border-red bg-red/15 text-text font-bold shadow-neon-red/30'
                    : 'border-line bg-bg-panel-alt text-text-dim hover:border-cyan hover:text-cyan'
                }`}
              >
                {node.name}
              </button>
            )
          })}
        </div>

        {/* Selected Node Details Box */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-bg-panel-alt p-3 font-mono text-xs">
          <div>
            <span className="block font-bold text-text">{selectedNode.name}, {selectedNode.country}</span>
            <span className="text-[11px] text-text-faint">LAT: {selectedNode.lat}° | LNG: {selectedNode.lng}°</span>
          </div>
          <div className="text-right">
            <span className="block text-sm font-extrabold text-cyan">{selectedNode.activeEvents}</span>
            <span className="text-[10px] text-text-faint">INTERCEPTED SIGNALS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
