// O'ng pastdagi suzuvchi tugmalar: avto-aylantirish (↓▷ / ↓❚❚) va ovoz (karnay).
import { useEffect, useRef, useState } from 'react'
import { isPlaying, onMusic, toggleMusic } from '../music'

const SPEED = 40 // px/s
const R = 23 // progress halqa radiusi
const C = 2 * Math.PI * R

const ico = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#2F3A33', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

const IconAuto = ({ on }) => (
  <svg {...ico}>
    <path d="M8 4v15M4.5 15.5L8 19l3.5-3.5" />
    {on ? <path d="M15 8v8M19 8v8" /> : <path d="M14.5 8.5v7l5.5-3.5z" />}
  </svg>
)
const IconSound = ({ on }) => (
  <svg {...ico}>
    <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" />
    {on ? (
      <>
        <path d="M15 9.5a3.5 3.5 0 0 1 0 5" />
        <path d="M17.5 7a7 7 0 0 1 0 10" />
      </>
    ) : (
      <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
    )}
  </svg>
)

const btn =
  'pointer-events-auto relative grid h-11 w-11 place-items-center rounded-full bg-white/95 shadow-[0_4px_14px_rgba(40,30,10,0.18)] ring-1 ring-gold-line/80 transition-transform duration-150 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-ink'

export default function FloatingButtons() {
  const [auto, setAuto] = useState(false)
  const [music, setMusic] = useState(isPlaying())
  const [shown, setShown] = useState(false)
  const ring = useRef(null)

  useEffect(() => onMusic(setMusic), [])
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // aylantirish progress halqasi (render qilmasdan, to'g'ridan-to'g'ri style)
  useEffect(() => {
    let raf = 0
    const upd = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, scrollY / max) : 0
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - p))
    }
    const on = () => raf || (raf = requestAnimationFrame(upd))
    upd()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  // avto-aylantirish: rAF delta bilan ~40 px/s
  useEffect(() => {
    if (!auto) return
    let raf = 0
    let last = performance.now()
    let acc = 0
    const stop = () => setAuto(false)
    const step = (now) => {
      const dt = Math.min(100, now - last)
      last = now
      acc += (SPEED * dt) / 1000
      const px = Math.floor(acc)
      if (px >= 1) {
        acc -= px
        window.scrollBy({ top: px, behavior: 'instant' })
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) return stop()
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const opts = { passive: true }
    addEventListener('wheel', stop, opts)
    addEventListener('touchstart', stop, opts)
    addEventListener('keydown', stop)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('wheel', stop, opts)
      removeEventListener('touchstart', stop, opts)
      removeEventListener('keydown', stop)
    }
  }, [auto])

  return (
    <div
      className="pointer-events-none fixed z-40 flex flex-col gap-3 transition-opacity duration-300"
      style={{
        right: 'calc(max(0px, (100vw - 416px) / 2) + 16px + env(safe-area-inset-right))',
        bottom: 'calc(24px + env(safe-area-inset-bottom))',
        opacity: shown ? 1 : 0,
      }}
    >
      <button
        type="button"
        className={btn}
        onClick={(e) => (e.stopPropagation(), setAuto((a) => !a))}
        aria-pressed={auto}
        aria-label={auto ? "Avto-aylantirishni to'xtatish" : 'Avto-aylantirish'}
        title={auto ? "To'xtatish" : 'Avto-aylantirish'}
      >
        <svg className="absolute -inset-[3px] h-[50px] w-[50px] -rotate-90" viewBox="0 0 50 50" aria-hidden="true">
          <circle ref={ring} cx="25" cy="25" r={R} fill="none" stroke="#C9A85A" strokeWidth="1.6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
        </svg>
        <IconAuto on={auto} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={(e) => (e.stopPropagation(), toggleMusic())}
        aria-pressed={music}
        aria-label={music ? "Musiqani o'chirish" : 'Musiqani yoqish'}
        title={music ? "Musiqani o'chirish" : 'Musiqani yoqish'}
      >
        <IconSound on={music} />
      </button>
    </div>
  )
}
