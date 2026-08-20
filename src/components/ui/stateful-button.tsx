"use client"

import React, { useState } from 'react'
import { audio } from '../../utils/audioEngine'

export interface StatefulButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => Promise<unknown> | void
  children: React.ReactNode
  loadingText?: string
  successText?: string
  className?: string
}

export function Button({
  onClick,
  children,
  loadingText = 'ENCRYPTING & TRANSMITTING...',
  successText = '✓ TRANSMISSION DELIVERED',
  className = '',
  disabled,
  type = 'button',
  ...props
}: StatefulButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== 'idle' || disabled) return

    audio.playClick(1400)

    if (!onClick) return

    try {
      setStatus('loading')
      audio.playAlert()

      const result = onClick(e)
      if (result instanceof Promise) {
        await result
      }

      setStatus('success')
      audio.playAccessGranted()

      setTimeout(() => {
        setStatus('idle')
      }, 3500)
    } catch {
      setStatus('idle')
      audio.playGlitchFX()
    }
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || status === 'loading'}
      onMouseEnter={() => audio.playHover()}
      className={`group relative overflow-hidden rounded-xl border font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:cursor-not-allowed select-none ${
        status === 'loading'
          ? 'border-cyan/80 bg-cyan/15 text-cyan shadow-[0_0_25px_rgba(0,240,255,0.4)]'
          : status === 'success'
          ? 'border-green bg-green/20 text-green shadow-[0_0_30px_rgba(0,255,157,0.5)]'
          : 'border-green bg-green/15 text-green hover:bg-green hover:text-[#05080e] hover:shadow-[0_0_30px_rgba(0,255,157,0.45)]'
      } ${className}`}
      {...props}
    >
      {/* Animated Shimmer Laser on Loading */}
      {status === 'loading' && (
        <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[cyber-shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      )}

      {/* Button Content States */}
      <span className="relative z-10 flex items-center justify-center gap-2.5 px-7 py-3.5">
        {status === 'loading' ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-cyan"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{loadingText}</span>
          </>
        ) : status === 'success' ? (
          <>
            <svg
              className="h-4 w-4 text-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-text">{successText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              ✉
            </span>
          </>
        )}
      </span>
    </button>
  )
}
