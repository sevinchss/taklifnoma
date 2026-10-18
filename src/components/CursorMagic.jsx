import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Dove } from './Magic'

const GOLD = ['#e9c77e', '#f4e2b4', '#d4a85a']
const MAX_DOVES = 2

/**
 * Fairy dust trail + doves that take off from the pointer.
 * Sparkles live on one canvas (no React renders); doves are a tiny pooled list.
 */
function CursorMagic() {
  const cv = useRef(null)
  const [doves, setDoves] = useState([])
  const idRef = useRef(0)

  const launch = useCallback((x, y, n = 1, burst = false) => {
    setDoves((d) => {
      const room = MAX_DOVES + (burst ? 6 : 0) - d.length
      if (room <= 0) return d
      const add = Array.from({ length: Math.min(n, room) }, (_, i) => {
        const side = Math.random() < 0.5 ? -1 : 1
        const a = burst ? -Math.PI / 2 + (i / Math.max(1, n - 1) - 0.5) * 2.2 : -Math.PI / 2 + side * (0.25 + Math.random() * 0.35)
        const dist = 320 + Math.random() * 160
        return {
          id: ++idRef.current,
          x,
          y,
          dx: Math.cos(a) * dist,
          dy: Math.sin(a) * dist - 80,
          rot: (a * 180) / Math.PI + 90,
          size: 30 + Math.random() * 8,
          dur: 3.6 + Math.random() * 0.8,
        }
      })
      return [...d, ...add]
    })
  }, [])

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = cv.current
    const ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const P = []
    let raf = 0
    let running = false
    let last = null
    let travelled = 0

    const resize = () => {
      c.width = innerWidth * dpr
      c.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const rings = []
    const spawn = (x, y, n, power = 1) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = (0.08 + Math.random() * 0.35) * power
        P.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.15,
          life: 1,
          decay: 0.018 + Math.random() * 0.02,
          r: 0.7 + Math.random() * 1.3,
          color: GOLD[(Math.random() * GOLD.length) | 0],
        })
      }
      if (P.length > 160) P.splice(0, P.length - 160)
      wake()
    }
    const ring = (x, y) => {
      rings.push({ x, y, t: 0 })
      wake()
    }
    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      ctx.globalCompositeOperation = 'source-over'
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i]
        p.vx *= 0.96
        p.vy = p.vy * 0.96 - 0.004 // dust rises very slightly
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0) {
          P.splice(i, 1)
          continue
        }
        ctx.globalAlpha = p.life * 0.9
        ctx.fillStyle = p.color
        ctx.shadowColor = 'rgba(233,199,126,0.9)'
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i]
        r.t += 0.022
        if (r.t >= 1) {
          rings.splice(i, 1)
          continue
        }
        const e = 1 - (1 - r.t) ** 3
        ctx.globalAlpha = (1 - r.t) * 0.7
        ctx.strokeStyle = '#d4a85a'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(r.x, r.y, 6 + e * 46, 0, Math.PI * 2)
        ctx.stroke()
        ctx.globalAlpha = (1 - r.t) * 0.35
        ctx.beginPath()
        ctx.arc(r.x, r.y, 4 + e * 26, 0, Math.PI * 2)
        ctx.stroke()
      }
      if (P.length || rings.length) raf = requestAnimationFrame(tick)
      else running = false
    }

    let lastDove = 0
    const move = (e) => {
      if (e.pointerType === 'touch') return // on phones: only taps, no trail
      const x = e.clientX
      const y = e.clientY
      if (last) {
        const d = Math.hypot(x - last.x, y - last.y)
        if (d < 14) return
        spawn(x, y, 1)
      }
      last = { x, y }
    }
    const down = (e) => {
      if (e.target.closest('input,textarea,button,a,label,select')) return
      ring(e.clientX, e.clientY)
      spawn(e.clientX, e.clientY, 10, 1.4)
      const now = performance.now()
      if (now - lastDove > 1800) {
        lastDove = now
        launch(e.clientX, e.clientY, 1)
      }
    }
    const leave = () => (last = null)

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('resize', resize)
    }
  }, [launch])

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden>
      <canvas ref={cv} className="absolute inset-0 h-full w-full" />
      <AnimatePresence>
        {doves.map((d) => (
          <motion.div
            key={d.id}
            className="absolute left-0 top-0"
            initial={{ x: d.x - d.size / 2, y: d.y - d.size * 0.3, scale: 0.2, opacity: 0, rotate: d.rot }}
            animate={{ x: d.x + d.dx, y: d.y + d.dy, scale: 1, opacity: [0, 1, 1, 0] }}
            transition={{ duration: d.dur, ease: [0.33, 0, 0.2, 1], opacity: { duration: d.dur, times: [0, 0.15, 0.6, 1] } }}
            onAnimationComplete={() => setDoves((all) => all.filter((x) => x.id !== d.id))}
          >
            <Dove size={d.size} flap={0.38} stroke="#c9a25e" style={{ filter: 'drop-shadow(0 6px 14px rgba(20,42,107,.28))' }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default memo(CursorMagic)
