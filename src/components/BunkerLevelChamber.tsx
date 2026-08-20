import React from 'react'

interface BunkerLevelChamberProps {
  level: 1 | 2 | 3
  children: React.ReactNode
}

export const BunkerLevelChamber: React.FC<BunkerLevelChamberProps> = ({ level, children }) => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* 1. DEDICATED ENVIRONMENTAL CHAMBER LIGHTING MATCHING PRECEDING GATE */}

      {/* LEVEL 1: Neutral Obsidian & Sub-Facility Command (-55m) */}
      {level === 1 && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[#060709]" />
          {/* Subtle industrial steel wall grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
          {/* Soft emerald overhead ambient point */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[380px] bg-emerald-500/6 blur-[150px]" />
          {/* Side perimeter track lines */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-dashed border-r border-zinc-800/60 hidden md:block" />
          <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-dashed border-l border-zinc-800/60 hidden md:block" />
        </div>
      )}

      {/* LEVEL 2: Warm Amber & Golden Subterranean R&D Vault (-170m) - Matches Amber Gate */}
      {level === 2 && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[#0a0805]" />
          {/* Warm Amber wall grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          {/* Golden overhead ambient glow radiating from the gate */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[450px] bg-amber-500/12 blur-[170px]" />
          {/* Ambient side golden flares */}
          <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-600/8 blur-[160px]" />
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-yellow-600/6 blur-[180px]" />
          {/* Top Amber horizon beam transition line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          {/* Side amber track lines */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-dashed border-r border-amber-900/40 hidden md:block" />
          <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-dashed border-l border-amber-900/40 hidden md:block" />
        </div>
      )}

      {/* LEVEL 3: Electric Violet & Neon Purple Mainframe Server Silo (-420m) - Matches Violet Gate */}
      {level === 3 && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[#07040a]" />
          {/* Violet scanline grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(168,85,247,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(168,85,247,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          {/* Vivid electric violet overhead server aura */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[500px] bg-purple-500/14 blur-[180px]" />
          {/* Deep violet and indigo subterranean data flares */}
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-purple-600/10 blur-[150px]" />
          <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-violet-600/8 blur-[170px]" />
          {/* Top Violet horizon beam transition line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          {/* Side violet data conduit track lines */}
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-dashed border-r border-purple-900/40 hidden md:block" />
          <div className="absolute right-6 top-0 bottom-0 w-[1px] bg-dashed border-l border-purple-900/40 hidden md:block" />
        </div>
      )}

      {/* 2. Level Content & Active Terminals */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {children}
      </div>
    </section>
  )
}
