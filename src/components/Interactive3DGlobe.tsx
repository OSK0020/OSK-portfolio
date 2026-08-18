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
  { id: 'tlv', name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, threatLevel: 'ELEVATED', threatColor: '#ff4b3e', activeEvents: 14 },
  { id: 'kyiv', name: 'Kyiv', country: 'Ukraine', lat: 50.4501, lng: 30.5234, threatLevel: 'CRITICAL', threatColor: '#ff4b3e', activeEvents: 28 },
  { id: 'dc', name: 'Washington D.C.', country: 'USA', lat: 38.9072, lng: -77.0369, threatLevel: 'MONITORED', threatColor: '#5fb9ff', activeEvents: 9 },
  { id: 'teh', name: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.389, threatLevel: 'CRITICAL', threatColor: '#ff4b3e', activeEvents: 22 },
  { id: 'tpe', name: 'Taipei', country: 'Taiwan', lat: 25.033, lng: 121.5654, threatLevel: 'ELEVATED', threatColor: '#ffb648', activeEvents: 11 },
  { id: 'lon', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, threatLevel: 'STABLE', threatColor: '#3dffa0', activeEvents: 4 },
  { id: 'redsea', name: 'Bab el-Mandeb', country: 'Red Sea Corridor', lat: 12.5833, lng: 43.3333, threatLevel: 'CRITICAL', threatColor: '#ff4b3e', activeEvents: 19 },
]

type Point3D = { x: number; y: number; z: number }

export function Interactive3DGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [selectedNode, setSelectedNode] = useState<NodePoint>(NODES[0])
  const selectedIdRef = useRef(NODES[0].id)
  const stateRef = useRef({ rotationX: 0.25, rotationY: 0, targetRotationX: 0.25, targetRotationY: 0, autoRotate: true, isDragging: false, startX: 0, startY: 0 })

  useEffect(() => { selectedIdRef.current = selectedNode.id }, [selectedNode.id])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const size = 520
    const radius = 190
    const dotCount = window.matchMedia('(pointer: coarse)').matches ? 500 : 800
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const dots: Point3D[] = []
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < dotCount; i += 1) {
      const y = 1 - (i / (dotCount - 1)) * 2
      const ring = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = goldenAngle * i
      dots.push({ x: Math.cos(theta) * ring * radius, y: y * radius, z: Math.sin(theta) * ring * radius })
    }

    const latLngTo3D = (lat: number, lng: number): Point3D => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      return { x: -(radius * Math.sin(phi) * Math.cos(theta)), y: radius * Math.cos(phi), z: radius * Math.sin(phi) * Math.sin(theta) }
    }

    let frame = 0
    let pulse = 0
    let lastTime = performance.now()
    let active = true

    const render = (now: number) => {
      if (!active) return
      const delta = Math.min(50, now - lastTime)
      lastTime = now
      pulse += delta * 0.001
      const state = stateRef.current
      if (state.autoRotate && !state.isDragging) state.targetRotationY += delta * 0.00018
      state.rotationX += (state.targetRotationX - state.rotationX) * 0.1
      state.rotationY += (state.targetRotationY - state.rotationY) * 0.1
      ctx.clearRect(0, 0, size, size)

      const centerX = size / 2
      const centerY = size / 2
      const glow = ctx.createRadialGradient(centerX, centerY, radius * 0.65, centerX, centerY, radius * 1.25)
      glow.addColorStop(0, 'rgba(61,255,160,0.035)'); glow.addColorStop(0.55, 'rgba(95,185,255,0.035)'); glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2); ctx.fill()

      const cosX = Math.cos(state.rotationX), sinX = Math.sin(state.rotationX), cosY = Math.cos(state.rotationY), sinY = Math.sin(state.rotationY)
      const project = (point: Point3D) => {
        const x1 = point.x * cosY - point.z * sinY
        const z1 = point.z * cosY + point.x * sinY
        const y2 = point.y * cosX - z1 * sinX
        return { px: centerX + x1, py: centerY + y2, pz: z1 * cosX + point.y * sinX }
      }

      for (const dot of dots) {
        const p = project(dot)
        const depth = (p.pz + radius) / (radius * 2)
        if (depth <= 0.08) continue
        ctx.fillStyle = `rgba(146,165,160,${Math.max(0.035, depth * 0.55)})`
        ctx.beginPath(); ctx.arc(p.px, p.py, Math.max(0.7, depth * 1.7), 0, Math.PI * 2); ctx.fill()
      }

      const projected = NODES.map((node) => ({ ...node, ...project(latLngTo3D(node.lat, node.lng)) }))
      const hub = projected[0]
      for (let i = 1; i < projected.length; i += 1) {
        const target = projected[i]
        if (hub.pz <= -radius * 0.4 && target.pz <= -radius * 0.4) continue
        const midX = (hub.px + target.px) / 2, midY = (hub.py + target.py) / 2 - 25
        const alpha = Math.min(0.35, Math.max(0.04, ((hub.pz + target.pz) / 2 + radius) / (radius * 2)))
        ctx.strokeStyle = `rgba(255,75,62,${alpha})`; ctx.lineWidth = 1; ctx.setLineDash([3, 5])
        ctx.beginPath(); ctx.moveTo(hub.px, hub.py); ctx.quadraticCurveTo(midX, midY, target.px, target.py); ctx.stroke(); ctx.setLineDash([])
        const t = (pulse * 0.65 + i * 0.25) % 1
        const photonX = (1 - t) ** 2 * hub.px + 2 * (1 - t) * t * midX + t ** 2 * target.px
        const photonY = (1 - t) ** 2 * hub.py + 2 * (1 - t) * t * midY + t ** 2 * target.py
        ctx.fillStyle = target.threatColor; ctx.beginPath(); ctx.arc(photonX, photonY, 1.8, 0, Math.PI * 2); ctx.fill()
      }

      projected.forEach((node) => {
        if (node.pz <= -radius * 0.2) return
        const selected = node.id === selectedIdRef.current
        const beacon = selected ? 4.5 : 3
        const p = (Math.sin(pulse * 3) + 1) / 2
        ctx.fillStyle = `${node.threatColor}33`; ctx.beginPath(); ctx.arc(node.px, node.py, beacon + p * 6, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = node.threatColor; ctx.shadowColor = node.threatColor; ctx.shadowBlur = 10
        ctx.beginPath(); ctx.arc(node.px, node.py, beacon, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0
        if (node.pz > 0 || selected) { ctx.font = '10px JetBrains Mono, monospace'; ctx.fillStyle = selected ? '#e6efec' : '#92a5a0'; ctx.fillText(node.name, node.px + 8, node.py + 3) }
      })
      frame = requestAnimationFrame(render)
    }

    frame = requestAnimationFrame(render)
    const handleVisibility = () => { active = !document.hidden; if (active) { lastTime = performance.now(); frame = requestAnimationFrame(render) } }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => { active = false; cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', handleVisibility) }
  }, [])

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    stateRef.current.isDragging = true; stateRef.current.autoRotate = false; stateRef.current.startX = event.clientX; stateRef.current.startY = event.clientY; event.currentTarget.setPointerCapture(event.pointerId)
  }
  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!stateRef.current.isDragging) return
    stateRef.current.targetRotationY += (event.clientX - stateRef.current.startX) * 0.008
    stateRef.current.targetRotationX = Math.max(-0.9, Math.min(0.9, stateRef.current.targetRotationX - (event.clientY - stateRef.current.startY) * 0.008))
    stateRef.current.startX = event.clientX; stateRef.current.startY = event.clientY
  }
  const handlePointerUp = () => { stateRef.current.isDragging = false; window.setTimeout(() => { stateRef.current.autoRotate = true }, 1800) }

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-line bg-bg-panel p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] sm:p-6">
      <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[10px] text-text-faint sm:text-[11px]"><span className="h-2 w-2 animate-blip rounded-full bg-red" /><span>OSN GLOBAL THREAT GRID // SIMULATION</span></div>
      <div className="absolute right-4 top-4 hidden font-mono text-[10px] text-text-dim sm:block"><span className="border border-line px-2 py-0.5">DRAG / SWIPE 3D</span></div>
      <div className="relative my-5 w-full max-w-[520px] touch-none"><canvas ref={canvasRef} className="block h-auto w-full" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onPointerLeave={handlePointerUp} aria-label="Interactive 3D threat globe" /></div>
      <div className="mt-2 w-full border-t border-line pt-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] sm:text-[11px]"><span className="text-text-faint">ACTIVE SECTOR TELEMETRY</span><span className="font-bold text-red">{selectedNode.threatLevel} PRIORITY</span></div>
        <div className="flex flex-wrap gap-1.5">{NODES.map((node) => <button key={node.id} type="button" onClick={() => { setSelectedNode(node); audio.playClick(1400) }} onMouseEnter={() => audio.playHover()} className={`rounded border px-2.5 py-1 font-mono text-[10px] transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green sm:text-[11px] ${node.id === selectedNode.id ? 'border-red bg-red/15 font-bold text-text shadow-[0_0_12px_rgba(255,75,62,0.3)]' : 'border-line bg-bg-panel-alt text-text-dim hover:border-text-dim hover:text-text'}`}>{node.name}</button>)}</div>
        <div className="mt-3 flex items-center justify-between rounded border border-line-soft bg-bg-panel-alt p-3 font-mono text-[10px] sm:text-xs"><div><span className="block font-bold text-text">{selectedNode.name}, {selectedNode.country}</span><span className="text-[10px] text-text-faint">LAT: {selectedNode.lat}° | LNG: {selectedNode.lng}°</span></div><div className="text-right"><span className="block text-sm font-extrabold text-cyan">{selectedNode.activeEvents}</span><span className="text-[9px] text-text-faint">INTERCEPTED EVENTS</span></div></div>
      </div>
    </div>
  )
}
