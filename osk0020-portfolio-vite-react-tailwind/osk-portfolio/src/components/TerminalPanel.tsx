import { useEffect, useRef, useState } from 'react'

interface Line {
  text: string
  suffix?: string
  suffixClass?: string
  className?: string
  pauseAfter?: number
}

const LINES: Line[] = [
  { text: '> query repositories --owner OSK0020', className: 'text-text-faint', pauseAfter: 400 },
  { text: '[1/4] OSN-EXTRA-WEB ................... ', suffix: 'LIVE', suffixClass: 'text-cyan' },
  { text: '[2/4] global-security-data-poll ....... ', suffix: 'LIVE', suffixClass: 'text-cyan' },
  { text: '[3/4] imagetestLAB-poll ............... ', suffix: 'LIVE', suffixClass: 'text-cyan' },
  { text: '[4/4] X-comment-BOT ................... ', suffix: 'RUNNING 24/7', suffixClass: 'text-amber' },
  { text: '', pauseAfter: 200 },
  { text: '> STATUS: ALL SYSTEMS OPERATIONAL', className: 'text-green', pauseAfter: 1600 },
]

type RenderedLine = { text: string; done: boolean; meta: Line }

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function TerminalPanel() {
  const [rendered, setRendered] = useState<RenderedLine[]>([])
  const [showCursor, setShowCursor] = useState(false)
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    async function boot() {
      while (!cancelled.current) {
        setRendered([])
        setShowCursor(false)

        for (const line of LINES) {
          if (cancelled.current) return

          if (reduceMotion) {
            setRendered((prev) => [...prev, { text: line.text, done: true, meta: line }])
          } else {
            setRendered((prev) => [...prev, { text: '', done: false, meta: line }])
            for (let i = 0; i <= line.text.length; i++) {
              if (cancelled.current) return
              setRendered((prev) => {
                const next = [...prev]
                next[next.length - 1] = { text: line.text.slice(0, i), done: i === line.text.length, meta: line }
                return next
              })
              await sleep(9)
            }
          }
          await sleep(line.pauseAfter ?? 90)
        }

        setShowCursor(true)
        if (reduceMotion) return
        await sleep(2600)
      }
    }

    boot()
    return () => {
      cancelled.current = true
    }
  }, [])

  return (
    <div className="border border-line bg-bg-panel font-mono text-[12.8px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5 text-text-faint">
        <span>operator@osk0020:~</span>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
      </div>
      <div className="min-h-[230px] px-4 py-5 text-green">
        {rendered.map((line, i) => (
          <div key={i} className={`min-h-[1.7em] whitespace-pre-wrap ${line.meta.className ?? ''}`}>
            {line.text}
            {line.meta.suffix && line.done && (
              <span className={line.meta.suffixClass}>{line.meta.suffix}</span>
            )}
          </div>
        ))}
        {showCursor && (
          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-blink bg-green align-middle" />
        )}
      </div>
    </div>
  )
}
