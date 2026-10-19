// Kalendar (§6) va "To'ygacha qolgan vaqt" taymeri (§7)
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WEDDING, MONTHS, dateParts, img } from '../../config'
import { Card, Reveal, Sparkle } from '../ui'
import './dates.css'

const EASE = [0.2, 0.7, 0.2, 1]
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// oddiy deterministik tasodifiy sonlar (yulduzlar har safar bir joyda)
function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

// Hilol (shoxlari yuqoriga)
const crescent = (cx, cy, r) => {
  const d = r * 0.62
  const R = Math.sqrt(r * r + d * d)
  return `M${cx - r},${cy} A${r},${r} 0 0,0 ${cx + r},${cy} A${R},${R} 0 0,1 ${cx - r},${cy}Z`
}

/* =====================================================================
   Konfetti — butun ekran ustida (fixed canvas), faqat zarrachalar bor paytda rAF
   ===================================================================== */
function fireConfetti(x0, y0) {
  if (typeof document === 'undefined') return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const c = document.createElement('canvas')
  c.setAttribute('aria-hidden', 'true')
  Object.assign(c.style, { position: 'fixed', left: '0', top: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '45' })
  let W = window.innerWidth
  let H = window.innerHeight
  const size = () => {
    W = window.innerWidth
    H = window.innerHeight
    c.width = Math.round(W * dpr)
    c.height = Math.round(H * dpr)
  }
  size()
  document.body.appendChild(c)
  const ctx = c.getContext('2d')
  const R = Math.random
  const RECT = ['#2F6B45', '#1F5A35', '#3D8A5A', '#C9A85A', '#D8C48A', '#B8954A']
  const STAR = ['#C6A24F', '#E3CF8C', '#D4B062', '#F0DFA6']
  const P = []
  for (let i = 0; i < 124; i++) {
    const burst = i < 78
    const r = R()
    const type = r < 0.42 ? 'star' : r < 0.94 ? 'rect' : 'moon'
    const p = { type, age: 0, rot: R() * 6.28, vr: (R() - 0.5) * 9, flip: R() * 6.28, vf: 5 + R() * 8, wob: 2 + R() * 3, wa: 14 + R() * 26 }
    if (burst) {
      const a = -Math.PI / 2 + (R() - 0.5) * Math.PI * 1.15
      const sp = 380 + R() * 380
      Object.assign(p, { x: x0, y: y0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, delay: R() * 0.07 })
    } else {
      Object.assign(p, { x: R() * W, y: -16 - R() * 60, vx: (R() - 0.5) * 50, vy: 40 + R() * 90, delay: 0.1 + R() * 0.7 })
    }
    p.life = 2.3 + R() * 0.8
    p.vt = 110 + R() * 120 // tushish tezligi chegarasi
    if (type === 'star') { p.s = 8 + R() * 8; p.col = STAR[(R() * STAR.length) | 0] }
    else if (type === 'rect') { p.w = 4 + R() * 1.5; p.h = 8 + R() * 3; p.col = RECT[(R() * RECT.length) | 0] }
    else { p.s = 8 + R() * 4; p.col = '#E3CF8C' }
    P.push(p)
  }
  const star5 = (s) => {
    ctx.beginPath()
    for (let k = 0; k < 10; k++) {
      const rr = k % 2 ? s * 0.22 : s * 0.5
      const an = (k * Math.PI) / 5 - Math.PI / 2
      ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr)
    }
    ctx.closePath()
    ctx.fill()
  }
  let last = performance.now()
  const onResize = () => size()
  window.addEventListener('resize', onResize)
  const tick = (t) => {
    const dt = Math.min(0.034, (t - last) / 1000)
    last = t
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    let alive = 0
    for (const p of P) {
      p.age += dt
      if (p.age < p.delay) { alive++; continue }
      const a = p.age - p.delay
      if (a > p.life) continue
      alive++
      p.vy += 980 * dt
      p.vx *= 1 - 1.9 * dt
      if (p.vy > p.vt) p.vy += (p.vt - p.vy) * Math.min(1, 6 * dt)
      p.x += (p.vx + Math.sin(a * p.wob) * p.wa) * dt
      p.y += p.vy * dt
      p.rot += p.vr * dt
      p.flip += p.vf * dt
      const k = a / p.life
      ctx.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.col
      if (p.type === 'rect') {
        ctx.scale(1, Math.cos(p.flip))
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      } else if (p.type === 'star') {
        ctx.scale(0.75 + 0.25 * Math.cos(p.flip), 1)
        star5(p.s)
      } else {
        const s = p.s / 2
        ctx.beginPath()
        ctx.arc(0, 0, s, Math.PI * 0.15, Math.PI * 1.85, false)
        ctx.arc(s * 0.45, -s * 0.1, s * 0.8, Math.PI * 1.75, Math.PI * 0.25, true)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }
    ctx.globalAlpha = 1
    if (alive) requestAnimationFrame(tick)
    else {
      window.removeEventListener('resize', onResize)
      c.remove()
    }
  }
  requestAnimationFrame(tick)
}

/* =====================================================================
   Gul burchak (rasm bo'lmasa — SVG): pushti atirgullar, evkalipt, zumrad lenta
   ===================================================================== */
function Rose({ x, y, r, id }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.62} rx={r * 0.62} ry={r * 0.5} transform={`rotate(${a})`} fill={`url(#${id}-pet)`} opacity="0.95" />
      ))}
      <circle r={r * 0.78} fill={`url(#${id}-core)`} />
      <g fill="none" stroke="#C97C64" strokeLinecap="round" opacity="0.55">
        <path d={`M${-r * 0.55},${r * 0.1} A${r * 0.58},${r * 0.58} 0 0 1 ${r * 0.45},${-r * 0.35}`} strokeWidth="1.1" />
        <path d={`M${r * 0.5},${r * 0.05} A${r * 0.5},${r * 0.5} 0 0 1 ${-r * 0.25},${r * 0.5}`} strokeWidth="1" />
        <path d={`M${-r * 0.3},${-r * 0.1} A${r * 0.32},${r * 0.32} 0 0 1 ${r * 0.25},${-r * 0.12}`} strokeWidth="1" />
        <path d={`M${r * 0.22},${r * 0.12} A${r * 0.22},${r * 0.22} 0 0 1 ${-r * 0.14},${r * 0.18}`} strokeWidth="0.9" />
        <path d={`M${-r * 0.08},${-r * 0.04} a${r * 0.1},${r * 0.1} 0 1 1 ${r * 0.12},${r * 0.06}`} strokeWidth="0.9" />
      </g>
      <ellipse cx={-r * 0.25} cy={-r * 0.35} rx={r * 0.25} ry={r * 0.12} fill="#fff" opacity="0.35" transform="rotate(-25)" />
    </g>
  )
}

function Leaf({ x, y, a, s = 1, fill = 'url(#fc-leaf)' }) {
  return <ellipse cx={x} cy={y} rx={6.5 * s} ry={4.6 * s} transform={`rotate(${a} ${x} ${y})`} fill={fill} />
}

function FloralCornerSVG() {
  const leaves1 = [[14, 6, 20, 1.1], [30, 12, -20, 1], [44, 8, 30, 0.9], [92, 10, -15, 1], [108, 16, 25, 0.95], [124, 14, -30, 0.85], [140, 22, 20, 0.8], [154, 24, -20, 0.7], [166, 30, 15, 0.6]]
  const leaves2 = [[6, 70, 70, 1], [14, 84, -60, 1], [4, 98, 80, 0.9], [12, 112, -70, 0.85], [6, 126, 75, 0.75], [10, 138, -70, 0.6]]
  return (
    <svg viewBox="0 0 200 168" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <radialGradient id="fc-pet" cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#FCE6DA" /><stop offset="0.7" stopColor="#F0B9A0" /><stop offset="1" stopColor="#E3A188" /></radialGradient>
        <radialGradient id="fc-core" cx="45%" cy="40%" r="65%"><stop offset="0" stopColor="#F9D3C1" /><stop offset="0.6" stopColor="#EFB399" /><stop offset="1" stopColor="#DC977D" /></radialGradient>
        <radialGradient id="fc2-pet" cx="50%" cy="40%" r="70%"><stop offset="0" stopColor="#FFF6EC" /><stop offset="0.7" stopColor="#F6DCCB" /><stop offset="1" stopColor="#E9C1AA" /></radialGradient>
        <radialGradient id="fc2-core" cx="45%" cy="40%" r="65%"><stop offset="0" stopColor="#FFF3E8" /><stop offset="0.7" stopColor="#F3D2BF" /><stop offset="1" stopColor="#E4B59C" /></radialGradient>
        <linearGradient id="fc-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B6C9B8" /><stop offset="1" stopColor="#6E8C76" /></linearGradient>
        <linearGradient id="fc-leaf2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9DB5A2" /><stop offset="1" stopColor="#4F7360" /></linearGradient>
        <linearGradient id="fc-rib" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#163F27" /><stop offset="0.5" stopColor="#2F7344" /><stop offset="1" stopColor="#183823" /></linearGradient>
      </defs>
      {/* evkalipt novdalari */}
      <g fill="none" stroke="#7F9A86" strokeWidth="1" opacity="0.9">
        <path d="M0 4 C40 6 80 6 170 32" />
        <path d="M4 40 C10 80 4 110 10 146" />
      </g>
      <g opacity="0.92">
        {leaves1.map(([x, y, a, s], i) => <Leaf key={i} x={x} y={y} a={a} s={s} fill={i % 3 === 1 ? 'url(#fc-leaf2)' : 'url(#fc-leaf)'} />)}
        {leaves2.map(([x, y, a, s], i) => <Leaf key={'b' + i} x={x} y={y} a={a} s={s} fill={i % 2 ? 'url(#fc-leaf2)' : 'url(#fc-leaf)'} />)}
      </g>
      {/* zumrad atlas lentalar */}
      <g strokeLinecap="round" fill="none">
        <path d="M30 34 C46 52 20 66 30 86 C40 104 18 118 26 142 C30 152 22 160 18 166" stroke="url(#fc-rib)" strokeWidth="6.5" />
        <path d="M30 34 C46 52 20 66 30 86 C40 104 18 118 26 142" stroke="#5FA078" strokeWidth="1.2" opacity="0.6" />
        <path d="M58 22 C78 34 92 22 108 36 C118 46 130 40 140 52" stroke="url(#fc-rib)" strokeWidth="5" />
        <path d="M58 22 C78 34 92 22 108 36 C118 46 130 40 140 52" stroke="#5FA078" strokeWidth="1" opacity="0.55" />
      </g>
      {/* atirgullar */}
      <Rose x={34} y={24} r={22} id="fc" />
      <Rose x={70} y={12} r={14} id="fc2" />
      <Rose x={14} y={58} r={12} id="fc2" />
      {/* g'unchalar va mayda oq gullar */}
      <ellipse cx="92" cy="20" rx="5" ry="7" transform="rotate(40 92 20)" fill="url(#fc-core)" />
      <ellipse cx="22" cy="84" rx="4.5" ry="6" transform="rotate(-20 22 84)" fill="url(#fc-core)" />
      {[[56, 36], [62, 42], [52, 44], [10, 30], [44, 52], [80, 30]].map(([x, y], i) => (
        <g key={i}><circle cx={x} cy={y} r="2.4" fill="#FFFDF6" stroke="#EADFC6" strokeWidth="0.5" /><circle cx={x} cy={y} r="0.8" fill="#C9A85A" /></g>
      ))}
      {[[118, 30], [100, 46], [64, 62], [40, 96], [150, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1" fill="#C9A85A" opacity="0.8" />)}
    </svg>
  )
}

function FloralTop() {
  const src = img('floral-corner-top')
  const [failed, setFailed] = useState(false)
  const real = src && !failed
  // Haqiqiy rasm bo'lsa faqat u chiqadi; SVG faqat rasm yo'q yoki yuklanmasa
  const corner = real ? (
    <img src={src} alt="" width="1245" height="1263" className="cal-fimg" decoding="async" draggable="false" onError={() => setFailed(true)} />
  ) : (
    <FloralCornerSVG />
  )
  return (
    <motion.div className={`cal-floral ${real ? 'is-img' : 'is-svg'}`} aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className="corner l">{corner}</div>
      <div className="corner r"><div className="mirror">{corner}</div></div>
    </motion.div>
  )
}

const Medal = () => (
  <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="none" stroke="#CDB574" /><circle cx="5" cy="5" r="1.6" fill="#CDB574" /></svg>
)

/* =====================================================================
   KALENDAR
   ===================================================================== */
const WK = ['DU', 'SE', 'CH', 'PA', 'JU', 'SH', 'YA']
const STEP = 52 // ms har bir kunga
const SEL_PAD = 60

export function Calendar() {
  const P = useMemo(() => dateParts(), [])
  const cells = useMemo(() => {
    const lead = (new Date(Date.UTC(P.y, P.m, 1)).getUTCDay() + 6) % 7
    const dim = new Date(Date.UTC(P.y, P.m + 1, 0)).getUTCDate()
    const prev = new Date(Date.UTC(P.y, P.m, 0)).getUTCDate()
    const rows = Math.ceil((lead + dim) / 7)
    return Array.from({ length: rows * 7 }, (_, i) => {
      const d = i - lead + 1
      if (d < 1) return { n: prev + d, out: true }
      if (d > dim) return { n: d - dim, out: true }
      return { n: d, out: false }
    })
  }, [P])

  const cardRef = useRef(null)
  const selRef = useRef(null)
  const [mode, setMode] = useState('idle') // idle | run | static

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    if (reduceMotion()) { setMode('static'); return }
    let timer, dwell
    // ≥40% ko'rinsa va ~0.16 s turib qolsa boshlanadi (tez o'tib ketayotgan smooth-scroll paytida emas)
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(dwell)
        if (!e.isIntersecting) return
        dwell = setTimeout(() => {
          io.disconnect()
          setMode('run')
          timer = setTimeout(() => {
            const r = selRef.current?.getBoundingClientRect()
            if (r) fireConfetti(r.left + r.width / 2, r.top + r.height / 2)
            try { navigator.vibrate?.(12) } catch {}
          }, SEL_PAD + (P.d - 1) * STEP + 120)
        }, 160)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer); clearTimeout(dwell) }
  }, [P.d])

  const selDelay = `${SEL_PAD + (P.d - 1) * STEP + 80}ms`
  const month = MONTHS[P.m].toUpperCase()

  return (
    <section id="sana" className="gutter relative bg-[#F6F3EA] py-10">
      <Reveal y={18}>
        <div ref={cardRef}>
          <Card innerClassName="overflow-visible">
            <FloralTop />
            <div className={`relative px-4 pb-7 pt-[118px] ${mode === 'run' ? 'cal-run' : mode === 'static' ? 'cal-static' : ''}`} style={{ '--sel-d': mode === 'static' ? '0ms' : selDelay }}>
              {/* oy sarlavhasi */}
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-[18px] bg-gradient-to-r from-transparent to-[#D8C48A]" />
                <Sparkle size={8} color="#C9A85A" />
                <h3 className="cal-head oldnum whitespace-nowrap pl-[0.18em]">{month}, {P.y}</h3>
                <Sparkle size={8} color="#C9A85A" />
                <span className="h-px w-[18px] bg-gradient-to-l from-transparent to-[#D8C48A]" />
              </div>

              {/* hafta kunlari */}
              <div className="mx-auto mt-4 w-[329px] max-w-full border-y border-[#E6DCC0]">
                <div className="cal-grid" style={{ gridAutoRows: '34px' }}>
                  {WK.map((w, i) => (
                    <div key={w} className="cal-wk grid place-items-center" style={{ color: i > 4 ? '#315640' : '#8C7B4E' }}>{w}</div>
                  ))}
                </div>
              </div>

              {/* kunlar */}
              <div className="cal-grid mt-1" role="grid" aria-label={`${MONTHS[P.m]} ${P.y}`}>
                {cells.map((c, i) => {
                  const wave = !c.out && c.n < P.d
                  const sel = !c.out && c.n === P.d
                  return (
                    <div key={i} className={`cal-day ${c.out ? 'out' : ''}`} aria-current={sel ? 'date' : undefined}>
                      {wave && <span className="cal-bub" style={{ '--i': c.n - 1 }} />}
                      {sel && (
                        <span ref={selRef} className="cal-sel">
                          <span className="halo" />
                          <span className="disc" />
                          <Sparkle size={11} color="#D8B868" className="spk" />
                        </span>
                      )}
                      <span className={sel ? 'n sel-n' : 'n'}>{c.n}</span>
                      {sel && <span className="cal-num-w oldnum">{c.n}</span>}
                    </div>
                  )
                })}
              </div>

              <div className="mx-auto mt-2 w-[329px] max-w-full border-t border-dashed border-[#E3D9BE]" />

              <div className="mt-4 flex items-center justify-center gap-2.5 font-serif text-[15px] font-semibold uppercase tracking-[0.12em] text-[#5B5140]">
                <Medal />
                <span className="oldnum pl-[0.12em]">{P.weekday} · {P.d}-{month}</span>
                <Medal />
              </div>
              <p className="mt-3 text-center font-serif text-[14px] font-medium uppercase tracking-[0.24em] text-[#A8904F]">Soat</p>
              <div className="mt-2 flex items-center justify-center gap-4">
                <span className="h-px w-[50px] bg-gradient-to-r from-transparent to-[#D8C48A]" />
                <span className="cal-time">{P.time}</span>
                <span className="h-px w-[50px] bg-gradient-to-l from-transparent to-[#D8C48A]" />
              </div>
            </div>
          </Card>
        </div>
      </Reveal>
    </section>
  )
}

/* =====================================================================
   TAYMER — tungi yulduzli osmon
   ===================================================================== */
function useCountdown(target) {
  const calc = () => Math.max(0, target - Date.now())
  const [left, setLeft] = useState(calc)
  useEffect(() => {
    let t
    const loop = () => {
      setLeft(calc())
      t = setTimeout(loop, 1000 - (Date.now() % 1000) + 5)
    }
    loop()
    return () => clearTimeout(t)
  }, [target]) // eslint-disable-line
  const s = Math.floor(left / 1000)
  return { done: left <= 0, d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }
}

function Stars({ subtle = false }) {
  const stars = useMemo(() => {
    const r = rng(2026)
    return Array.from({ length: subtle ? 22 : 46 }, (_, i) => {
      const big = i % 6 === 0
      return {
        x: r() * 100, y: r() * (subtle ? 52 : 78), s: big ? (subtle ? 5 + r() * 4 : 7 + r() * 6) : 1.1 + r() * (subtle ? 1.6 : 2.2), big,
        d: 2.2 + r() * 2.8, dl: -r() * 4, c: r() < 0.7 ? '#E6CF8E' : '#F7F2E2',
      }
    })
  }, [subtle])
  return (
    <div className={`pointer-events-none absolute inset-0 ${subtle ? 'opacity-60' : ''}`} aria-hidden="true">
      {stars.map((st, i) => st.big ? (
        <span key={i} className="cd-star" style={{ left: `${st.x}%`, top: `${st.y}%`, '--d': `${st.d}s`, '--dl': `${st.dl}s`, filter: 'drop-shadow(0 0 4px rgba(230,207,142,.7))' }}>
          <Sparkle size={st.s} color={st.c} />
        </span>
      ) : (
        <span key={i} className="cd-star rounded-full" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s, background: st.c, boxShadow: `0 0 ${st.s * 2}px rgba(230,207,142,.8)`, '--d': `${st.d}s`, '--dl': `${st.dl}s` }} />
      ))}
    </div>
  )
}

// 8 nurli katta yulduz (tepada, markazda)
const Flare = () => (
  <svg width="64" height="64" viewBox="-32 -32 64 64" className="cd-flare" aria-hidden="true">
    <defs><radialGradient id="cd-fg"><stop offset="0" stopColor="#FFF6D8" /><stop offset="0.35" stopColor="rgba(230,207,142,.55)" /><stop offset="1" stopColor="rgba(230,207,142,0)" /></radialGradient></defs>
    <circle r="22" fill="url(#cd-fg)" />
    <path d="M0-30 1.6-1.6 30 0 1.6 1.6 0 30-1.6 1.6-30 0-1.6-1.6Z" fill="#F3E2AD" />
    <path d="M0-14 1.2-1.2 14 0 1.2 1.2 0 14-1.2 1.2-14 0-1.2-1.2Z" fill="#E6CF8E" transform="rotate(45)" />
    <circle r="2.2" fill="#FFFBEA" />
  </svg>
)

// Nozik oltin arabeska chiziqlari (yuqori burchaklarda)
const Arabesque = ({ flip }) => (
  <svg viewBox="0 0 160 120" className="absolute top-0 h-[120px] w-[160px] opacity-[0.28]" style={{ [flip ? 'right' : 'left']: 0, transform: flip ? 'scaleX(-1)' : undefined }} aria-hidden="true">
    <g fill="none" stroke="#C9A85A" strokeWidth="0.8" strokeLinecap="round">
      <path d="M0 30 C30 10 60 50 90 30 S140 10 150 40" />
      <path d="M90 30 c10 -14 26 -10 24 4 c-2 10 -14 10 -16 2" />
      <path d="M20 60 C40 40 70 80 100 64 c14 -8 20 -24 8 -30" />
      <path d="M40 46 c-8 -10 2 -22 12 -16" />
      <path d="M0 90 C24 76 40 100 64 88 c12 -6 14 -18 4 -22" />
      <circle cx="150" cy="40" r="2" fill="#C9A85A" />
      <circle cx="98" cy="34" r="1.4" fill="#C9A85A" />
    </g>
  </svg>
)

// Masjid silueti — kumbaz, minoralar, hilol, iliq chekka nur
function MosqueSVG() {
  const minaret = (x, top, w = 7) => (
    `M${x - w / 2},140 L${x - w / 2},${top + 18} L${x - w / 2 - 2},${top + 16} L${x - w / 2 - 2},${top + 13} L${x - w / 2},${top + 12} L${x},${top} L${x + w / 2},${top + 12} L${x + w / 2 + 2},${top + 13} L${x + w / 2 + 2},${top + 16} L${x + w / 2},${top + 18} L${x + w / 2},140Z`
  )
  const dome = (cx, base, hw, top) =>
    `M${cx - hw},${base} C${cx - hw},${base - (base - top) * 0.55} ${cx - hw * 0.35},${top + (base - top) * 0.3} ${cx},${top} C${cx + hw * 0.35},${top + (base - top) * 0.3} ${cx + hw},${base - (base - top) * 0.55} ${cx + hw},${base}Z`
  const paths = [
    // asos va arkada
    'M112,140 L112,104 L304,104 L304,140Z',
    'M160,104 L160,92 L256,92 L256,104Z',
    'M170,92 L170,84 L246,84 L246,92Z',
    dome(208, 86, 36, 34),
    'M207,34 L207,22 L209,22 L209,34Z',
    dome(146, 106, 20, 78),
    dome(270, 106, 20, 78),
    'M145,78 L145,70 L147,70 L147,78Z',
    'M269,78 L269,70 L271,70 L271,78Z',
    minaret(124, 30),
    minaret(292, 30),
    minaret(98, 62, 6),
    minaret(318, 62, 6),
    // sarv daraxtlari
    'M64,140 C58,120 62,104 68,92 C74,104 78,120 72,140Z',
    'M80,140 C76,126 78,116 82,108 C86,116 88,126 84,140Z',
    'M352,140 C346,120 350,104 356,92 C362,104 366,120 360,140Z',
    'M336,140 C332,126 334,116 338,108 C342,116 344,126 340,140Z',
  ]
  const moons = [[208, 18, 4.2], [146, 67, 2.6], [270, 67, 2.6], [124, 26, 2.6], [292, 26, 2.6], [98, 58, 2.2], [318, 58, 2.2]]
  const city = 'M0,140 L0,124 L14,124 L14,116 L24,116 L24,126 L36,126 C36,118 46,118 46,126 L56,126 L56,120 L62,120 L62,140 Z M354,140 L354,122 L364,122 C364,114 376,114 376,122 L386,122 L386,116 L396,116 L396,126 L408,126 L408,118 L416,118 L416,140Z M88,140 L88,128 L104,128 L104,140Z M312,140 L312,128 L330,128 L330,140Z'
  return (
    <svg viewBox="0 0 416 140" preserveAspectRatio="xMidYMax meet" className="block h-auto w-full" aria-hidden="true">
      <defs>
        <linearGradient id="cd-ms" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0C2017" /><stop offset="1" stopColor="#050C08" /></linearGradient>
        <filter id="cd-rim" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.6" /></filter>
        <radialGradient id="cd-win"><stop offset="0" stopColor="#FFE2A0" /><stop offset="1" stopColor="#E0A955" /></radialGradient>
      </defs>
      <path d={city} fill="#0F241A" opacity="0.9" />
      {/* iliq chekka nur: siluetning yuqoriga siljigan oltin nusxasi */}
      <g transform="translate(0 -1.6)" fill="#E2B867" opacity="0.75" filter="url(#cd-rim)">
        {paths.map((d, i) => <path key={i} d={d} />)}
        {moons.map(([x, y, r], i) => <path key={'m' + i} d={crescent(x, y, r)} />)}
      </g>
      <g fill="url(#cd-ms)">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill="#E6C77E">
        {moons.map(([x, y, r], i) => <path key={i} d={crescent(x, y, r)} />)}
      </g>
      {/* arkali derazalarda iliq nur */}
      <g fill="url(#cd-win)" opacity="0.9">
        {[128, 144, 160, 176, 240, 256, 272, 288].map((x) => (
          <path key={x} d={`M${x - 3},132 L${x - 3},${121} Q${x},${115} ${x + 3},${121} L${x + 3},132Z`} />
        ))}
        <path d="M201,140 L201,118 Q208,108 215,118 L215,140Z" />
        <circle cx="208" cy="76" r="2.2" />
      </g>
    </svg>
  )
}

const UNITS = [['d', 'KUN'], ['h', 'SOAT'], ['m', 'DAQIQA'], ['s', 'SONIYA']]

function Tile({ value, label, i, wide }) {
  const reduce = reduceMotion()
  return (
    <motion.div
      className="cd-tile"
      style={{ width: wide, '--sd': `${i * 0.18}s` }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.45, delay: 0.1 + i * 0.13, ease: EASE }}
    >
      <div className="cd-num" style={{ width: '100%', textAlign: 'center' }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            className="block"
            initial={reduce ? false : { y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.3, 0.8, 0.3, 1] }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="cd-lab">{label}</div>
    </motion.div>
  )
}

export function Countdown() {
  const target = useMemo(() => new Date(WEDDING.date).getTime(), [])
  const t = useCountdown(target)
  const sky = img('countdown-sky')
  const mosque = img('mosque-silhouette')
  const dayW = Math.max(64, String(t.d).length * 19 + 26)

  return (
    <section id="taymer" className={`relative isolate overflow-hidden ${sky ? 'cd-has-sky' : ''}`} style={{ minHeight: 430 }} aria-label="To'ygacha qolgan vaqt">
      {/* osmon */}
      {sky ? (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <img src={sky} alt="" width="1536" height="2304" className="cd-sky-img" loading="lazy" decoding="async" draggable="false" />
          <div className="cd-sky-veil" />
          <Stars subtle />
        </div>
      ) : (
        <div className="cd-sky absolute inset-0 -z-10" aria-hidden="true">
          <div className="cd-cloud a" style={{ left: -70, top: 150, width: 190, height: 150, background: 'radial-gradient(closest-side, rgba(214,192,134,.42), rgba(150,138,96,.16) 60%, transparent)' }} />
          <div className="cd-cloud b" style={{ right: -80, top: 120, width: 210, height: 170, background: 'radial-gradient(closest-side, rgba(214,192,134,.38), rgba(150,138,96,.14) 60%, transparent)' }} />
          <div className="cd-cloud a" style={{ left: -40, bottom: 40, width: 220, height: 120, background: 'radial-gradient(closest-side, rgba(226,190,120,.28), transparent)' }} />
          <div className="cd-cloud b" style={{ right: -40, bottom: 50, width: 220, height: 120, background: 'radial-gradient(closest-side, rgba(226,190,120,.26), transparent)' }} />
          <Arabesque />
          <Arabesque flip />
          <Stars />
        </div>
      )}

      {/* yuqori ingichka oltin chiziq */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A85A]/70 to-transparent" aria-hidden="true" />

      <div className="relative flex flex-col items-center px-4 pb-[150px] pt-8 text-center">
        <Flare />
        <Reveal y={10} className="mt-5">
          <h2 className="cd-title pl-[0.3em]">TO'YGACHA QOLGAN VAQT</h2>
        </Reveal>

        {t.done ? (
          <Reveal y={12} className="mt-7">
            <p className="script gold-text text-[54px] leading-tight" style={{ filter: 'drop-shadow(0 2px 10px rgba(0,0,0,.5))' }}>Muborak bo'lsin!</p>
          </Reveal>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-[9px]" role="timer" aria-live="off">
            {UNITS.map(([k, l], i) => (
              <div key={k} className="flex items-center gap-[9px]">
                {i > 0 && <Sparkle size={8} color="#D8C48A" className="shrink-0 opacity-90" />}
                <Tile value={k === 'd' ? t.d : t[k]} label={l} i={i} wide={k === 'd' ? dayW : 64} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* masjid silueti */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true">
        {!sky && <div className="absolute inset-x-0 bottom-0 h-[150px]" style={{ background: 'radial-gradient(55% 70% at 50% 100%, rgba(226,184,103,.30), transparent 70%)' }} />}
        {mosque ? <img src={mosque} alt="" width="1774" height="887" className="cd-mosque-img" loading="lazy" decoding="async" draggable="false" /> : <div className="relative"><MosqueSVG /></div>}
        {mosque && <div className="cd-ground" />}
        <div className="absolute inset-x-0 bottom-[3px] flex items-center justify-center gap-2">
          <span className="h-px w-[120px] bg-gradient-to-r from-transparent to-[#C9A85A]/80" />
          <span className="h-[7px] w-[7px] rotate-45 bg-[#D8B868] shadow-[0_0_8px_rgba(216,184,104,.8)]" />
          <span className="h-px w-[120px] bg-gradient-to-l from-transparent to-[#C9A85A]/80" />
        </div>
      </div>
    </section>
  )
}
