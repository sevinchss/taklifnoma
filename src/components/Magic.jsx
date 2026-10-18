import { memo, useEffect, useMemo, useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/* ------------------------------------------------------------------
   Fireflies / fairy lights — one canvas, drawn outside React renders
------------------------------------------------------------------- */
export const Fireflies = memo(function Fireflies({ count = 40, color = '255,214,140', additive = true, className = 'absolute inset-0' }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    const ctx = cv.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let raf = 0

    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 64
    const s = sprite.getContext('2d')
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, `rgba(${color},1)`)
    g.addColorStop(0.12, `rgba(${color},0.55)`)
    g.addColorStop(1, `rgba(${color},0)`)
    s.fillStyle = g
    s.fillRect(0, 0, 64, 64)

    const resize = () => {
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    const P = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 5 + Math.random() * 13,
      a: Math.random() * Math.PI * 2,
      s: 0.12 + Math.random() * 0.4,
      p: Math.random() * Math.PI * 2,
      ps: 0.008 + Math.random() * 0.025,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = additive ? 'lighter' : 'source-over'
      for (const f of P) {
        f.a += (Math.random() - 0.5) * 0.18
        f.x += Math.cos(f.a) * f.s
        f.y += Math.sin(f.a) * f.s - 0.07
        f.p += f.ps
        if (f.x < -20) f.x = w + 20
        if (f.x > w + 20) f.x = -20
        if (f.y < -20) f.y = h + 20
        if (f.y > h + 20) f.y = -20
        ctx.globalAlpha = 0.15 + 0.85 * Math.max(0, Math.sin(f.p))
        ctx.drawImage(sprite, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2)
      }
      raf = requestAnimationFrame(tick)
    }
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduced()) tick()
    }
    onVis()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [count, color, additive])
  return <canvas ref={ref} className={`pointer-events-none h-full w-full ${className}`} aria-hidden />
})

/* ------------------------------------------------------------------
   Dove — white bird seen from below, wings flap via CSS
------------------------------------------------------------------- */
export function Dove({ size = 48, flap = 0.5, className = '', style, stroke }) {
  return (
    <svg viewBox="0 0 100 60" width={size} height={size * 0.6} className={`dove ${className}`} style={{ '--flap': `${flap}s`, ...style }} aria-hidden>
      <g fill="#fffaf0" stroke={stroke} strokeWidth={stroke ? 1.4 : 0} strokeLinejoin="round">
        <path className="wing-l" d="M47 30C36 14 20 6 2 10C10 16 17 18 23 22C15 22 9 24 5 28C19 30 33 34 47 36Z" />
        <path className="wing-r" d="M53 30C64 14 80 6 98 10C90 16 83 18 77 22C85 22 91 24 95 28C81 30 67 34 53 36Z" />
        <ellipse cx="50" cy="34" rx="5.5" ry="11" />
        <circle cx="50" cy="21" r="4.5" />
        <path d="M50 42L43.5 55H56.5Z" />
        <path d="M48.6 17.2L50 13.5L51.4 17.2Z" fill="#ecc879" />
      </g>
    </svg>
  )
}

const FLOCK = [
  { top: 16, size: 30, dur: 34, delay: 0, rise: -12, flap: 0.5 },
  { top: 21, size: 22, dur: 38, delay: 1.6, rise: -10, flap: 0.46 },
  { top: 44, size: 26, dur: 36, delay: 17, rise: -16, flap: 0.5 },
]

/** Doves crossing the sky, looping forever (pure CSS transforms) */
export const Flock = memo(function Flock({ birds = FLOCK, className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {birds.map((b, i) => (
        <span
          key={i}
          className="fly absolute left-0"
          style={{ top: `${b.top}%`, '--dur': `${b.dur}s`, '--delay': `${b.delay}s`, '--rise': `${b.rise}vh` }}
        >
          <span className="bob block" style={{ '--delay': `${i * 0.7}s` }}>
            <Dove size={b.size} flap={b.flap} style={{ transform: 'rotate(72deg)', filter: 'drop-shadow(0 0 5px rgba(255,240,200,.35))', opacity: 0.9 }} />
          </span>
        </span>
      ))}
    </div>
  )
})

/** One-shot burst of doves flying out from the centre */
export function DoveBurst({ count = 9, spread = 340 }) {
  const birds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = -Math.PI / 2 + (i / (count - 1) - 0.5) * Math.PI * 1.3 + (Math.random() - 0.5) * 0.25
        const d = spread * (0.75 + Math.random() * 0.6)
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, rot: (a * 180) / Math.PI + 90, size: 26 + Math.random() * 26, delay: Math.random() * 0.25 }
      }),
    [count, spread],
  )
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
      {birds.map((b, i) => (
        <motion.div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: b.rot }}
          animate={{ x: b.x, y: b.y, scale: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2.6, delay: b.delay, ease: [0.16, 1, 0.3, 1], opacity: { duration: 2.6, times: [0, 0.1, 0.7, 1] } }}
        >
          <Dove size={b.size} flap={0.28} style={{ filter: 'drop-shadow(0 0 10px rgba(255,240,200,.7))' }} />
        </motion.div>
      ))}
    </div>
  )
}

/** One-shot burst of tiny gold stars */
export function Sparkles({ count = 22, spread = 220 }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const a = Math.random() * Math.PI * 2
        const d = spread * (0.3 + Math.random() * 0.7)
        return { x: Math.cos(a) * d, y: Math.sin(a) * d, s: 6 + Math.random() * 10, r: Math.random() * 180, delay: Math.random() * 0.2 }
      }),
    [count, spread],
  )
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden>
      {parts.map((p, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 100 100"
          width={p.s}
          height={p.s}
          className="absolute -translate-x-1/2 -translate-y-1/2 text-gold-light"
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.2, 0], rotate: p.r, opacity: [1, 1, 0] }}
          transition={{ duration: 1.6, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        >
          <path fill="currentColor" d="M50 0C54 38 62 46 100 50C62 54 54 62 50 100C46 62 38 54 0 50C38 46 46 38 50 0Z" />
        </motion.svg>
      ))}
    </div>
  )
}

/** Button that leans toward the pointer (motion values, no re-renders) */
export function Magnetic({ children, strength = 0.35, className = '', ...rest }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 150, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 150, damping: 15, mass: 0.4 })
  return (
    <motion.button
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => (x.set(0), y.set(0))}
      whileTap={{ scale: 0.95 }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/** Text that appears as if written by a pen (clip-path wipe) */
export function Wipe({ children, show = true, delay = 0, duration = 1.6, rtl = false, className = '', as = 'span' }) {
  const M = motion[as]
  const hidden = rtl ? 'inset(-20% -5% -20% 105%)' : 'inset(-20% 105% -20% -5%)'
  return (
    <M
      className={className}
      initial={{ clipPath: hidden, opacity: 0, filter: 'blur(6px)' }}
      animate={show ? { clipPath: 'inset(-20% -5% -20% -5%)', opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ delay, duration, ease: [0.65, 0, 0.35, 1], opacity: { duration: 0.4, delay } }}
    >
      {children}
    </M>
  )
}

/** Thin gold progress line on top of the page */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-turq via-gold-light to-gold" />
}
