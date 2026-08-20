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
      command: 'sys_init',
      output:
        'TACTICAL CLI SHELL v3.0 LOADED // ENCRYPTED SESSION: AES-256-GCM. Type "help" or click quick chips below for full command matrix.',
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
    audio.playClick(650)

    let response: React.ReactNode = ''
    let type: HistoryEntry['type'] = 'cmd'

    switch (cleanCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-text-dim font-mono text-xs">
            <p className="text-green font-bold">AVAILABLE COMMAND DIRECTORY:</p>
            <p><span className="text-cyan font-bold">warp</span> - Engage 3D hyperspace speed boost across canvas</p>
            <p><span className="text-red font-bold">hack</span> - Run automated brute-force cryptographic breach routine</p>
            <p><span className="text-amber font-bold">ambient</span> - Toggle continuous background tactical sci-fi hum</p>
            <p><span className="text-cyan font-bold">sonar</span> - Dispatch 360° acoustic pulse to all radar sensors</p>
            <p><span className="text-green font-bold">satellites</span> - Query synced orbital recon constellations</p>
            <p><span className="text-cyan font-bold">projects</span> - Query flagship engineering &amp; AI architectures</p>
            <p><span className="text-red font-bold">osint</span> - Display active intelligence gathering tools &amp; live feeds</p>
            <p><span className="text-cyan font-bold">ai-lab</span> - Run real-time neural inference simulation benchmark</p>
            <p><span className="text-amber font-bold">threats</span> - Scan real-time global intelligence telemetry</p>
            <p><span className="text-text font-bold">skills</span> - Output tactical tech stack &amp; system proficiencies</p>
            <p><span className="text-green font-bold">whoami</span> - Print operator identity &amp; clearance level</p>
            <p><span className="text-cyan font-bold">contact</span> - Open secure communication channels</p>
            <p><span className="text-violet font-bold">matrix</span> - Decrypt live telemetry binary stream</p>
            <p><span className="text-text-faint font-bold">clear</span> - Wipe active console memory</p>
          </div>
        )
        type = 'system'
        break

      case 'warp':
        audio.playWarpSound()
        window.dispatchEvent(new CustomEvent('osk:warp-burst'))
        response = (
          <p className="text-cyan font-bold animate-pulse">
            🚀 HYPERSPACE WARP BOOST ENGAGED // 3D PARTICLES ACCELERATING TO WARP 9.2
          </p>
        )
        type = 'success'
        break

      case 'hack':
        audio.playGlitchFX()
        setTimeout(() => audio.playKeystroke(), 150)
        setTimeout(() => audio.playKeystroke(), 300)
        setTimeout(() => audio.playAccessGranted(), 600)
        response = (
          <div className="space-y-1 text-xs font-mono text-green">
            <p className="text-red font-bold">INITIALIZING BRUTE-FORCE BREACH...</p>
            <p>0x7FFE94B2 &gt;&gt; BYPASSING FIREWALL KERNEL... [OK]</p>
            <p>0x4A10C3F8 &gt;&gt; INJECTING QUANTUM PAYLOAD... [OK]</p>
            <p className="text-cyan font-bold">✓ ROOT CLEARANCE LEVEL 5 GRANTED // ACCESS UNRESTRICTED</p>
          </div>
        )
        type = 'success'
        break

      case 'ambient': {
        const isPlaying = audio.toggleAmbient()
        response = (
          <p className={isPlaying ? 'text-green font-bold' : 'text-amber font-bold'}>
            {isPlaying
              ? '🔊 CONTINUOUS TACTICAL SCI-FI DRONE: ACTIVE (55Hz Sub-Harmonic)'
              : '🔇 CONTINUOUS TACTICAL SCI-FI DRONE: MUTED'}
          </p>
        )
        type = isPlaying ? 'success' : 'system'
        break
      }

      case 'sonar':
        audio.playSonarPing(1350)
        response = (
          <p className="text-cyan font-bold animate-pulse">
            📡 ACOUSTIC SONAR PULSE DISPATCHED // 4 RADAR CONTACTS ACKNOWLEDGED
          </p>
        )
        type = 'success'
        break

      case 'satellites':
        audio.playRadarSweep()
        response = (
          <div className="space-y-1 text-xs font-mono text-text-dim">
            <p className="text-cyan font-bold">ORBITAL RECON SATELLITE CONSTELLATIONS:</p>
            <p>• <span className="text-green font-bold">[SAT-OSN-01]</span> - GEO Orbit // North Atlantic Surveillance // 99.98% Lock</p>
            <p>• <span className="text-cyan font-bold">[SAT-OSN-02]</span> - LEO Orbit // Pacific Defense Corridor Ingest // Active</p>
            <p>• <span className="text-amber font-bold">[SAT-OSN-03]</span> - Polar Orbit // Global Threat Radar Sweep // 14 Nodes Synced</p>
          </div>
        )
        type = 'success'
        break

      case 'projects':
        response = (
          <div className="space-y-1.5 text-xs text-text-dim font-mono">
            <p className="text-green font-bold">DEPLOYED PRODUCTION PLATFORMS (4):</p>
            <p>1. <span className="text-red font-bold">[OSN Extra]</span> - Live Tactical Threat Matrix (Leaflet, D3, Web Audio) → <a href="https://osn-e-xtra.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">osn-e-xtra.vercel.app</a></p>
            <p>2. <span className="text-cyan font-bold">[Global Security Data Poll]</span> - 3D Globe Intelligence Platform (Next.js, WebGL) → <a href="https://osn-website.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">osn-website.vercel.app</a></p>
            <p>3. <span className="text-cyan font-bold">[AI Models Lab]</span> - Visual playground for comparing generative AI models → <a href="https://iamge-lab-website.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">iamge-lab-website.vercel.app</a></p>
            <p>4. <span className="text-amber font-bold">[X Auto-Reply Bot]</span> - Autonomous OSINT 4-model cascade running 24/7 on X</p>
          </div>
        )
        type = 'success'
        break

      case 'osint':
      case 'osn':
        response = (
          <div className="space-y-1 text-xs text-text-dim font-mono">
            <p className="text-red font-bold">OSN — OBSERVER SECURITY NETWORK</p>
            <p>Founder &amp; Lead Systems Architect: OSK</p>
            <p>Function: Real-time intelligence pipeline aggregating 48+ feeds across global security networks, mapping crisis telemetry onto interactive tactical matrices.</p>
            <p className="text-green">STATUS: 24/7 ACTIVE RADAR SURVEILLANCE</p>
          </div>
        )
        type = 'success'
        break

      case 'ai-lab':
        response = (
          <div className="space-y-1 text-xs text-text-dim font-mono">
            <p className="text-cyan font-bold">AI INFERENCE &amp; VRAM BENCHMARK LAB:</p>
            <p>• Architecture: Next.js 15, Three.js 3D Viewport, Web Audio Sound Synthesis</p>
            <p>• Quantization: INT4 / INT8 / FP16 Latency &amp; Memory Allocation Profiling</p>
            <p>• Live URL: <a href="https://iamge-lab-website.vercel.app/" target="_blank" rel="noreferrer" className="text-cyan underline">iamge-lab-website.vercel.app</a></p>
          </div>
        )
        type = 'success'
        break

      case 'threats':
        audio.playAlert()
        response = (
          <div className="space-y-1 text-xs text-red font-mono">
            <p className="font-bold">⚠️ OSN THREAT ASSESSMENT // LIVE INTERCEPT:</p>
            <p>[SECTOR-01: GENEVA CYBER NODE] - THREAT LEVEL: MONITORED (14 Live Incidents)</p>
            <p>[SECTOR-02: KYIV / EASTERN EUROPE] - THREAT LEVEL: CRITICAL (28 Live Incidents)</p>
            <p>[SECTOR-03: PACIFIC DEFENSE CORRIDOR] - THREAT LEVEL: CRITICAL (19 Maritime Alerts)</p>
            <p className="text-green">✓ ALL SENSOR ARRAYS RESPONDING NORMALLY</p>
          </div>
        )
        type = 'error'
        break

      case 'skills':
        response = (
          <div className="space-y-1 text-xs text-text-dim font-mono">
            <p className="text-green font-bold">OPERATOR LOADOUT MATRIX:</p>
            <p>• <span className="text-text font-bold">Frontend &amp; 3D:</span> React 19, Next.js 15, TypeScript, WebGL/Three.js, Canvas 2D/3D, Web Audio API</p>
            <p>• <span className="text-text font-bold">AI/ML &amp; Automation:</span> Gemini Multi-Model Cascades, Search Grounding, Quantization Profiling, Python 3.12</p>
            <p>• <span className="text-text font-bold">Security &amp; OSINT:</span> Realtime Radar Ingestion, WebSockets, Anomaly Scoring, NTFY Push Engine</p>
          </div>
        )
        type = 'success'
        break

      case 'whoami':
        response = (
          <div className="space-y-1 text-xs text-text-dim font-mono">
            <p className="text-text font-bold">OPERATOR: <span className="text-green">OSK // SENIOR CREATIVE TECHNOLOGIST &amp; OSINT ARCHITECT</span></p>
            <p>Clearance: <span className="text-cyan">LEVEL-5 TOP_SECRET</span></p>
            <p>Status: <span className="text-green">ACTIVE_COMBAT_READINESS</span></p>
            <p>Location: <span className="text-amber">GLOBAL CYBER GRID // 47.3769°N 8.5417°E</span></p>
          </div>
        )
        type = 'system'
        break

      case 'contact':
        response = (
          <div className="space-y-1 text-xs text-text-dim font-mono">
            <p className="text-cyan font-bold">SECURE TRANSMISSION CHANNELS:</p>
            <p>• Email: <a href="mailto:oristern8@gmail.com" className="text-green underline">oristern8@gmail.com</a></p>
            <p>• GitHub: <a href="https://github.com/OSK0020" target="_blank" rel="noreferrer" className="text-green underline">github.com/OSK0020</a></p>
            <p>• PGP Fingerprint: <span className="text-text-faint font-mono">4A7B 89C1 2F0E E1D9 93B4</span></p>
          </div>
        )
        type = 'system'
        break

      case 'matrix':
        audio.playRadarSweep()
        response = (
          <p className="text-green font-mono tracking-widest animate-pulse">
            01001111 01010011 01001110 00100000 01001111 01010000 01000101 01010010 01000001 01010100 01001001 01010110 01000101
          </p>
        )
        type = 'success'
        break

      case 'clear':
        setHistory([])
        setInput('')
        return

      default:
        response = (
          <p className="text-text-faint font-mono">
            Command not recognized: <span className="text-red font-mono">{cleanCmd}</span>. Type <span className="text-green font-mono">help</span> for directory.
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
      const nextIndex =
        historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex
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
    <div className="flex h-[460px] w-full flex-col rounded-2xl border border-green/30 bg-bg-panel p-5 font-mono text-xs shadow-neon-green/20 backdrop-blur-xl">
      {/* Title Bar */}
      <div className="mb-3 flex items-center justify-between border-b border-line pb-3 text-text-faint">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber" />
          <div className="h-2.5 w-2.5 rounded-full bg-green" />
          <span className="text-[11px] font-bold text-cyan ml-2">
            bash - tactical-operator@terminal:~
          </span>
        </div>
        <span className="text-[10px] text-text-faint">
          ENCRYPTED_SESSION: AES-256-GCM
        </span>
      </div>

      {/* Terminal History */}
      <div
        className="flex-1 overflow-y-auto space-y-3 pr-2"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan font-bold">
              <span>root@cyber-node:~$</span>
              <span className="text-text">{entry.command}</span>
            </div>
            <div className="pl-4">{entry.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Live Input Line */}
      <div className="mt-3 flex items-center gap-2 border-t border-line/60 pt-3 text-cyan font-bold">
        <span>❯</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help', 'warp', 'hack', 'sonar', 'ambient' or click chips..."
          className="flex-1 bg-transparent font-mono text-text outline-none placeholder:text-text-faint/60"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {/* Quick Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line/40 pt-2 text-[10.5px]">
        <span className="mr-1 text-text-faint">QUICK_ACTIONS:</span>
        {[
          { cmd: 'warp', label: '🚀 WARP', highlight: 'text-cyan border-cyan/40' },
          { cmd: 'hack', label: '💀 HACK', highlight: 'text-red border-red/40' },
          { cmd: 'ambient', label: '🔊 AMBIENT', highlight: 'text-green border-green/40' },
          { cmd: 'sonar', label: '📡 SONAR', highlight: 'text-cyan border-cyan/40' },
          { cmd: 'satellites', label: '🛰️ SATS', highlight: 'text-amber border-amber/40' },
          { cmd: 'projects', label: 'PROJECTS', highlight: '' },
          { cmd: 'threats', label: 'THREATS', highlight: '' },
        ].map((item) => (
          <button
            key={item.cmd}
            onClick={() => executeCommand(item.cmd)}
            onMouseEnter={() => audio.playHover()}
            className={`rounded border bg-bg-panel-alt px-2.5 py-0.5 text-text-dim hover:text-text transition-colors cursor-pointer ${
              item.highlight || 'border-line-soft hover:border-green'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
