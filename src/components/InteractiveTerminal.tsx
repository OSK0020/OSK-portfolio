import { useState, useRef, useEffect } from 'react'
import { audio } from '../utils/audioEngine'

interface HistoryEntry {
  command: string
  output: string | React.ReactNode
  type: 'cmd' | 'system' | 'error' | 'success'
}

export function InteractiveTerminal() {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: 'system.init',
      output: 'OSK COMMAND MATRIX v4.8 [REAL-TIME INTEL & AI SYSTEMS INITIALIZED]',
      type: 'system',
    },
    {
      command: 'help',
      output: 'Available commands: projects, osn, ai-lab, threats, skills, whoami, contact, matrix, clear',
      type: 'system',
    },
  ])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>(['help'])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const executeCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim().toLowerCase()
    if (!cleanCmd) return

    setCommandHistory((prev) => [...prev, cleanCmd])
    setHistoryIndex(-1)
    audio.playClick(900)

    let response: React.ReactNode = ''
    let type: HistoryEntry['type'] = 'cmd'

    switch (cleanCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-text-dim">
            <p className="text-green font-bold">OPERATOR CLI COMMAND DIRECTORY:</p>
            <p><span className="text-cyan font-bold">projects</span> - Display all active production products & repositories</p>
            <p><span className="text-red font-bold">osn</span> - Query Observer Security Network architecture & live feeds</p>
            <p><span className="text-cyan font-bold">ai-lab</span> - Inspect AI Models Laboratory WebGL engine</p>
            <p><span className="text-amber font-bold">threats</span> - Scan real-time global intelligence telemetry</p>
            <p><span className="text-text font-bold">skills</span> - List full technology stack & capabilities</p>
            <p><span className="text-green font-bold">whoami</span> - Display operator profile & credentials</p>
            <p><span className="text-cyan font-bold">contact</span> - Open direct transmission channels (Email, GitHub, X)</p>
            <p><span className="text-text-faint font-bold">clear</span> - Purge terminal buffer</p>
          </div>
        )
        type = 'system'
        break

      case 'projects':
        response = (
          <div className="space-y-1.5 text-xs text-text-dim">
            <p className="text-green font-bold">ACTIVE PRODUCTION DEPLOYMENTS (4):</p>
            <p>1. <span className="text-red font-bold">[OSN Extra]</span> - Live Tactical Threat Matrix (Leaflet, D3, Web Audio) → <a href="https://osn-e-xtra.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">osn-e-xtra.vercel.app</a></p>
            <p>2. <span className="text-cyan font-bold">[Global Security Data Poll]</span> - 3D Globe Intelligence Platform (Next.js, WebGL) → <a href="https://osn-website.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">osn-website.vercel.app</a></p>
            <p>3. <span className="text-cyan font-bold">[AI Models Lab]</span> - Visual playground for comparing generative AI models → <a href="https://iamge-lab-website.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">iamge-lab-website.vercel.app</a></p>
            <p>4. <span className="text-amber font-bold">[X Auto-Reply Bot]</span> - Autonomous OSINT 4-model cascade running 24/7 on X</p>
          </div>
        )
        type = 'success'
        break

      case 'osn':
        response = (
          <div className="space-y-1 text-xs text-text-dim">
            <p className="text-red font-bold">OSN — OBSERVER SECURITY NETWORK</p>
            <p>Role: Founder, Lead Architect & Security Data Engineer</p>
            <p>Function: Real-time open-source intelligence pipeline aggregating dozens of military, aviation, and geopolitical feeds into unified live tactical dashboards.</p>
            <p className="text-green">STATUS: 24/7 ACTIVE SURVEILLANCE MATRIX</p>
          </div>
        )
        type = 'success'
        break

      case 'ai-lab':
        response = (
          <div className="space-y-1 text-xs text-text-dim">
            <p className="text-cyan font-bold">AI MODELS LABORATORY [TELEMETRY]:</p>
            <p>• Architecture: Next.js 15, Three.js 3D Viewport, Web Audio Sound Synthesis</p>
            <p>• Features: Real-time model latency comparison, side-by-side prompt benchmarking, smart low-end GPU detection fallback</p>
            <p>• Live URL: <a href="https://iamge-lab-website.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">iamge-lab-website.vercel.app</a></p>
          </div>
        )
        type = 'success'
        break

      case 'threats':
        audio.playAlert()
        response = (
          <div className="space-y-1 text-xs text-red">
            <p className="font-bold">⚠️ OSN THREAT ASSESSMENT // LIVE INTERCEPT:</p>
            <p>[SECTOR-01: MIDDLE EAST] - THREAT LEVEL: ELEVATED (14 Live Incidents)</p>
            <p>[SECTOR-02: EASTERN EUROPE] - THREAT LEVEL: CRITICAL (28 Live Incidents)</p>
            <p>[SECTOR-03: RED SEA CORRIDOR] - THREAT LEVEL: CRITICAL (19 Maritime Alerts)</p>
            <p className="text-green">✓ ALL SENSOR ARRAYS RESPONDING NORMALLY</p>
          </div>
        )
        type = 'error'
        break

      case 'skills':
        response = (
          <div className="space-y-1 text-xs text-text-dim">
            <p className="text-green font-bold">TECHNICAL MATRIX & CAPABILITIES:</p>
            <p>• <span className="text-text font-bold">Frontend & Visuals:</span> React 19, Next.js, TypeScript, Tailwind CSS, WebGL, Three.js, Canvas 2D/3D, D3.js, Web Audio API</p>
            <p>• <span className="text-text font-bold">Backend & Automation:</span> Python, Node.js, FastAPI, Real-time WebSockets, REST APIs, NTFY Push Engine</p>
            <p>• <span className="text-text font-bold">AI & Intelligence:</span> Gemini API, Multi-Model Cascades, Search Grounding, OSINT Data Pipelines, Threat Classification</p>
          </div>
        )
        type = 'success'
        break

      case 'whoami':
        response = (
          <div className="space-y-1 text-xs text-text-dim">
            <p className="text-text font-bold">OPERATOR: <span className="text-green">OSK (OSK0020)</span></p>
            <p>Title: Independent Full-Stack Developer & Real-Time OSINT Architect</p>
            <p>Mission: Turning chaotic live data into crystal-clear interactive interfaces and high-performance digital experiences.</p>
          </div>
        )
        type = 'system'
        break

      case 'contact':
        response = (
          <div className="space-y-1 text-xs text-text-dim">
            <p className="text-cyan font-bold">TRANSMISSION CHANNELS:</p>
            <p>• Email: <a href="mailto:oristern8@gmail.com" className="text-green underline">oristern8@gmail.com</a></p>
            <p>• GitHub: <a href="https://github.com/OSK0020" target="_blank" rel="noreferrer" className="text-green underline">github.com/OSK0020</a></p>
            <p>• OSN Network: <a href="https://osn-e-xtra.vercel.app/" target="_blank" rel="noreferrer" className="text-green underline">osn-e-xtra.vercel.app</a></p>
          </div>
        )
        type = 'system'
        break

      case 'clear':
        setHistory([])
        setInput('')
        return

      case 'matrix':
        audio.playRadarSweep()
        response = (
          <p className="text-green font-mono tracking-widest animate-pulse">
            01001111 01010011 01001110 00100000 01001111 01010000 01000101 01010010 01000001 01010100 01001001 01010110 01000101
          </p>
        )
        type = 'success'
        break

      case 'sudo':
        response = <p className="text-red">ACCESS DENIED: Operator privileges already at maximum clearance (LEVEL 5).</p>
        type = 'error'
        break

      default:
        response = (
          <p className="text-text-faint">
            Command not recognized: <span className="text-red font-mono">{cleanCmd}</span>. Type <span className="text-green font-mono">help</span> for command list.
          </p>
        )
        type = 'error'
    }

    setHistory((prev) => [...prev, { command: cleanCmd, output: response, type }])
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    audio.playKeystroke()

    if (e.key === 'Enter') {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const nextIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex
      setHistoryIndex(nextIndex)
      setInput(commandHistory[commandHistory.length - 1 - nextIndex] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1
        setHistoryIndex(nextIndex)
        setInput(commandHistory[commandHistory.length - 1 - nextIndex] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInput('')
      }
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-line bg-bg-panel font-mono text-[12.5px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)]">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3 text-text-faint">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green/80" />
          <span className="ml-2 font-bold text-text-dim">operator@osk-terminal:~</span>
        </div>
        <span className="text-[11px] text-green/80">INTERACTIVE SHELL</span>
      </div>

      {/* Terminal Body */}
      <div
        className="max-h-[340px] min-h-[260px] overflow-y-auto p-4.5 space-y-3"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-text-faint">
              <span className="text-green">➜</span>
              <span className="text-cyan">~</span>
              <span className="text-text font-bold">{entry.command}</span>
            </div>
            <div className="pl-4">{entry.output}</div>
          </div>
        ))}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 pt-1 text-green">
          <span>➜</span>
          <span className="text-cyan">~</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help' or click quick chips below..."
            className="flex-1 bg-transparent font-mono text-text outline-none placeholder:text-text-faint/60"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Quick Command Chips */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-line bg-bg-panel-alt px-3.5 py-2.5 text-[11px]">
        <span className="mr-1 text-text-faint">QUICK:</span>
        {['projects', 'osn', 'threats', 'ai-lab', 'skills', 'contact'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            onMouseEnter={() => audio.playHover()}
            className="rounded border border-line-soft bg-bg px-2 py-0.5 text-text-dim transition-colors hover:border-green hover:text-green"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  )
}
