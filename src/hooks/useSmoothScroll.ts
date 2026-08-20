import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { subterraneanAudio } from '../utils/subterraneanAudio'
import { tacticalAudio } from '../utils/tacticalAudio'
import { audio } from '../utils/audioEngine'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  useEffect(() => {
    // 1. Force browser to NOT restore previous scroll position on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    window.scrollTo(0, 0)

    // 2. Global Autoplay & AudioContext Auto-Unlock on first user gesture
    const unlockAudio = () => {
      subterraneanAudio.init()
      tacticalAudio.init()
      audio.initContext()
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
      window.removeEventListener('wheel', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true })
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true })
    window.addEventListener('wheel', unlockAudio, { passive: true, once: true })
    window.addEventListener('keydown', unlockAudio, { passive: true, once: true })

    // 3. Initialize Lenis Inertial Momentum Scroll
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    // Guarantee starting at top
    lenis.scrollTo(0, { immediate: true })

    // 4. Synchronize Lenis with GSAP ScrollTrigger & Ambient Subterranean Depth
    lenis.on('scroll', (e: { velocity: number; progress: number }) => {
      ScrollTrigger.update()
      tacticalAudio.updateVelocity(e.velocity)
      subterraneanAudio.updateAmbientDepth(e.progress * 420)
    })

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Expose lenis globally for programmatic smooth scrolling (nav links, buttons)
    ;(window as unknown as { lenis: Lenis }).lenis = lenis

    return () => {
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('touchstart', unlockAudio)
      window.removeEventListener('wheel', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])
}
