// Pastki bo'limlar: to'yxona → xarita → ma'lumot uchun → to'yona → stol → xotira lavhalari → yakun
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { WEDDING, IMAGES, img, dateParts } from '../../config'
import { Reveal, Card, Sparkle, Star8, Divider } from '../ui'
import './bottom.css'

const EASE = [0.2, 0.7, 0.2, 1]
const BACK = [0.34, 1.32, 0.64, 1]

/* ===================================================================== */
/* Kichik bezak va ikonalar                                               */
/* ===================================================================== */

const Hair = ({ w = 40, dir = 'r' }) => (
  <span className="h-px shrink-0" style={{ width: w, background: `linear-gradient(${dir === 'r' ? 90 : 270}deg, transparent, #D8C48A)` }} />
)

function CapsLine({ children, w = 40, className = '', color = '#88784B' }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Hair w={w} />
      <span className="font-caps text-[12px] font-medium uppercase tracking-[0.3em]" style={{ color, marginRight: '-0.3em' }}>{children}</span>
      <Hair w={w} dir="l" />
    </div>
  )
}

const PinIcon = ({ size = 14, color = '#C9A85A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </svg>
)
const NavIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 3 3 10.5l7.5 3L13.5 21 21 3Z" />
  </svg>
)
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 3.5h3.2l1.6 4.2-2.1 1.4a11.5 11.5 0 0 0 7.2 7.2l1.4-2.1 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6C10.4 20.1 3.9 13.6 3.4 5.2A1.6 1.6 0 0 1 5 3.5Z" />
  </svg>
)
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
)
const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="m9 5 7 7-7 7" />
  </svg>
)
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
    <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
    <path d="M15.5 8.5V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
  </svg>
)
const Medal = ({ size = 6 }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="none" stroke="#CDB574" /><circle cx="5" cy="5" r="1.6" fill="#CDB574" /></svg>
)

// Rub el hizb konturi (to'yona kartasi burchaklari)
const StarOutline = ({ size = 22, className = '', color = '#D8C48A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke={color} strokeWidth="1.2">
    <rect x="5" y="5" width="14" height="14" fill="rgba(216,196,138,.18)" />
    <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" fill="rgba(216,196,138,.18)" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
)

// Hilol va yulduz
const CrescentStar = ({ size = 44, color = '#E6CF8E' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path d="M30 6a18 18 0 1 0 12 30A15 15 0 1 1 30 6Z" fill={color} />
    <path d="M36 14l1.6 3.9 4.2.3-3.2 2.7 1 4.1-3.6-2.2-3.6 2.2 1-4.1-3.2-2.7 4.2-.3Z" fill={color} />
  </svg>
)

/* ---------- SVG atirgul (rasm bo'lmasa) ---------- */
function Rose({ x, y, r = 12, white = false, rot = 0 }) {
  const c = white ? ['#FCF8EE', '#EADFC8', '#CDBB98'] : ['#F7D7C8', '#EDB7A0', '#D48F79']
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {/* tashqi gulbarglar (to'lqinsimon chekka) */}
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r * 0.5} cy={Math.sin((a * Math.PI) / 180) * r * 0.5} r={r * 0.55} fill={c[1]} />
      ))}
      <circle r={r * 0.9} fill={c[0]} />
      <circle cx={r * 0.06} cy={-r * 0.08} r={r * 0.66} fill={c[1]} opacity="0.75" />
      <circle cx={-r * 0.03} cy={-r * 0.12} r={r * 0.52} fill={c[0]} />
      <circle cx={r * 0.05} cy={-r * 0.15} r={r * 0.34} fill={c[1]} opacity="0.9" />
      <circle cx={0} cy={-r * 0.17} r={r * 0.2} fill={c[0]} />
      <path
        d={`M${-r * 0.08} ${-r * 0.2}a${r * 0.1} ${r * 0.1} 0 1 1 ${r * 0.16} ${r * 0.08}`}
        fill="none"
        stroke={c[2]}
        strokeWidth={Math.max(0.6, r * 0.06)}
        strokeLinecap="round"
      />
      <path d={`M${-r * 0.8} ${r * 0.3}Q0 ${r * 0.95} ${r * 0.8} ${r * 0.3}`} fill="none" stroke={c[2]} strokeOpacity="0.45" strokeWidth={Math.max(0.6, r * 0.05)} />
      <ellipse cx={-r * 0.34} cy={-r * 0.48} rx={r * 0.2} ry={r * 0.1} fill="#fff" opacity="0.5" />
    </g>
  )
}
const Leaf = ({ x, y, s = 1, rot = 0, fill = '#93B39A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0C4 -5.5 12 -5.5 17 0C12 5.5 4 5.5 0 0Z" fill={fill} />
    <path d="M1 0H15" stroke="#6F927A" strokeWidth="0.6" opacity="0.7" />
  </g>
)
const Euca = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0C10 -2 22 -2 34 2" stroke="#7E9C88" strokeWidth="0.9" fill="none" />
    {[6, 14, 22, 30].map((cx, i) => (
      <g key={cx}>
        <circle cx={cx} cy={-4 - (i % 2)} r={3.4 - i * 0.3} fill="#B3C8B9" />
        <circle cx={cx + 3} cy={4} r={3.2 - i * 0.3} fill="#A5BCAD" />
      </g>
    ))}
  </g>
)

// To'yxona kartasining pastki burchak gul bezagi (95×100)
function RoseCorner({ flip = false }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      <Euca x={4} y={92} rot={-58} s={1.1} />
      <Euca x={22} y={98} rot={-14} s={0.95} />
      <Leaf x={14} y={80} rot={-70} s={1.1} />
      <Leaf x={30} y={88} rot={-28} s={1} fill="#86A88F" />
      <Leaf x={46} y={95} rot={-6} s={0.9} />
      <Leaf x={4} y={70} rot={-110} s={0.9} fill="#86A88F" />
      <path d="M2 99C8 72 34 76 30 57C27 45 14 51 19 61" fill="none" stroke="#2B5C3B" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M5 99C11 75 36 79 33 59" fill="none" stroke="#3F7552" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M28 96C46 86 60 98 76 90" fill="none" stroke="#2B5C3B" strokeWidth="1.8" strokeLinecap="round" />
      <Rose x={20} y={88} r={13} />
      <Rose x={40} y={96} r={9} white rot={20} />
      <Rose x={6} y={74} r={8} rot={-30} />
      {[[30, 76], [50, 86], [12, 62], [58, 94]].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="1.3" fill="#E6CF8E" />
      ))}
    </svg>
  )
}

// Konvert + atirgullar (268×230)
function EnvelopeBouquet() {
  const back = [
    [134, 110, -150], [134, 110, -120], [134, 110, -95], [134, 110, -60], [134, 110, -30], [134, 110, -170], [134, 110, -10],
  ]
  return (
    <svg viewBox="0 0 268 230" className="h-full w-full" aria-hidden="true">
      {back.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <Leaf x={70} y={0} s={2.1} fill={i % 2 ? '#9AB8A1' : '#86A88F'} />
          <Euca x={40} y={-10} s={1.3} rot={8} />
        </g>
      ))}
      <Rose x={92} y={70} r={25} />
      <Rose x={136} y={50} r={23} white />
      <Rose x={180} y={70} r={25} rot={30} />
      <Rose x={112} y={34} r={14} rot={-20} />
      <Rose x={162} y={32} r={13} white />
      <Rose x={58} y={108} r={19} white rot={-10} />
      <Rose x={212} y={106} r={19} rot={14} />
      {/* konvert */}
      <g transform="rotate(-4 134 150)">
        <path d="M82 124 134 84l52 40Z" fill="#F2E7CF" stroke="#D9C7A0" strokeWidth="1" />
        <rect x="96" y="92" width="76" height="72" rx="2" fill="#FFFCF3" stroke="#E6DAC0" />
        {[104, 112, 120, 128].map((y, i) => (
          <path key={y} d={`M104 ${y}c10-3 20 3 30 0s20-3 ${30 - i * 6} 0`} fill="none" stroke="#B9A98A" strokeWidth="0.8" opacity="0.7" />
        ))}
        <path d="M82 124 134 162l52-38v66H82Z" fill="#FBF4E3" stroke="#DCCBA5" strokeWidth="1" />
        <path d="M82 190 124 154M186 190 144 154" stroke="#E2D4B4" strokeWidth="1" />
        <path d="M88 130 134 164l46-34v54H88Z" fill="none" stroke="#C9A85A" strokeWidth="0.7" opacity="0.7" />
        {/* muhr */}
        <circle cx="134" cy="160" r="16.5" fill="#245F3B" />
        <circle cx="134" cy="160" r="15" fill="#1F5A35" />
        <circle cx="134" cy="160" r="11" fill="none" stroke="#3B7D52" strokeWidth="1.2" />
        <path d="M137 152a8 8 0 1 0 4.8 13.4A6.6 6.6 0 1 1 137 152Z" fill="#D8C48A" />
        <path d="m140.5 155.5.7 1.7 1.8.1-1.4 1.2.4 1.8-1.5-1-1.6 1 .5-1.8-1.4-1.2 1.8-.1Z" fill="#D8C48A" />
      </g>
      {/* lenta */}
      <path d="M186 140c34-20 52 10 34 30-14 15-26-3-10-10" fill="none" stroke="#2B5C3B" strokeWidth="4" strokeLinecap="round" />
      <path d="M188 176c20 24 44 22 60 34" fill="none" stroke="#2B5C3B" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M187 143c30-16 46 8 32 26" fill="none" stroke="#4A8160" strokeWidth="1.2" strokeLinecap="round" />
      <Leaf x={50} y={170} rot={-150} s={1.6} />
      <Leaf x={216} y={176} rot={-30} s={1.5} fill="#9AB8A1" />
      <Rose x={74} y={184} r={18} />
      <Rose x={198} y={190} r={16} rot={25} />
      <Rose x={100} y={200} r={11} white />
      {[[64, 60], [206, 58], [40, 130], [230, 132], [120, 18], [150, 14], [86, 210], [176, 212]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="2" fill="#FFFFFF" stroke="#E6DCC6" strokeWidth="0.5" />
      ))}
      {[[70, 40], [200, 40], [30, 100], [244, 96]].map(([cx, cy]) => (
        <circle key={`g${cx}`} cx={cx} cy={cy} r="1.4" fill="#D8C48A" />
      ))}
    </svg>
  )
}

// Ziyofat stoli (366×290)
function BanquetTable() {
  const settings = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    return { x: 183 + 118 * Math.cos(a), y: 118 + 30 * Math.sin(a), k: 0.82 + 0.18 * ((Math.sin(a) + 1) / 2) }
  }).sort((p, q) => p.y - q.y)
  return (
    <svg viewBox="0 0 366 290" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="bt-cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFBF0" />
          <stop offset="1" stopColor="#EFE3C6" />
        </linearGradient>
        <linearGradient id="bt-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E3D3AE" stopOpacity="0.8" />
          <stop offset="0.25" stopColor="#FFF9EC" stopOpacity="0" />
          <stop offset="0.75" stopColor="#FFF9EC" stopOpacity="0" />
          <stop offset="1" stopColor="#E3D3AE" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="bt-lamp">
          <stop offset="0" stopColor="#FFF4C8" />
          <stop offset="1" stopColor="#F2C76A" />
        </radialGradient>
      </defs>
      <ellipse cx="183" cy="279" rx="162" ry="9" fill="rgba(90,70,30,.12)" />
      <path
        d="M34 120C31 180 25 230 22 266Q50 281 80 271Q110 284 140 273Q170 286 200 274Q230 285 260 273Q290 283 320 270Q334 266 344 267C341 230 335 180 332 120Z"
        fill="url(#bt-cloth)"
      />
      <path
        d="M34 120C31 180 25 230 22 266Q50 281 80 271Q110 284 140 273Q170 286 200 274Q230 285 260 273Q290 283 320 270Q334 266 344 267C341 230 335 180 332 120Z"
        fill="url(#bt-side)"
      />
      {[60, 96, 132, 168, 204, 240, 276, 310].map((x, i) => (
        <path key={x} d={`M${x} ${150 + (i % 2) * 6}C${x - 3} 200 ${x - 4} 240 ${x - 6 + i} 276`} fill="none" stroke="#E2D2AC" strokeWidth="1.2" opacity="0.65" />
      ))}
      <path d="M22 266Q50 281 80 271Q110 284 140 273Q170 286 200 274Q230 285 260 273Q290 283 320 270Q334 266 344 267" fill="none" stroke="#C9A85A" strokeWidth="3" />
      <path d="M24 259Q52 273 80 264Q110 276 140 266Q170 278 200 267Q230 277 260 266Q290 275 320 263Q334 259 342 260" fill="none" stroke="#D8C48A" strokeWidth="1" strokeDasharray="2 3" />
      <ellipse cx="183" cy="120" rx="150" ry="42" fill="#FFFCF3" stroke="#E8DCBE" />
      <ellipse cx="183" cy="120" rx="142" ry="37" fill="none" stroke="#EFE5CC" strokeDasharray="1 4" />
      {settings.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) scale(${s.k})`}>
          <ellipse rx="17" ry="6.4" fill="#D8C48A" stroke="#B8964A" strokeWidth="0.8" />
          <ellipse rx="12" ry="4.4" fill="#FFFFFF" stroke="#E6DCC6" strokeWidth="0.6" />
          <path d="M-7 1-1-6 0 1 1-6 7 1Q0 3-7 1Z" fill="#1F5A35" />
          <path d="M-1-6 0 1" stroke="#2F7344" strokeWidth="0.6" />
          <g transform="translate(16 -9)" opacity="0.85">
            <path d="M-3-8h6l-1 6a2 2 0 0 1-4 0Z" fill="#EAF2F5" stroke="#B9C8CF" strokeWidth="0.6" />
            <path d="M0-2v6M-2.5 4h5" stroke="#B9C8CF" strokeWidth="0.6" />
          </g>
        </g>
      ))}
      {/* markaziy guldasta */}
      {[-150, -120, -60, -30, -175, -5, 160, 20].map((r, i) => (
        <Leaf key={r} x={183} y={104} rot={r} s={1.5 + (i % 3) * 0.2} fill={i % 2 ? '#7FA088' : '#94B39C'} />
      ))}
      <Euca x={150} y={106} rot={-160} s={0.9} />
      <Euca x={216} y={106} rot={-20} s={0.9} />
      <Rose x={170} y={96} r={12} white />
      <Rose x={197} y={97} r={12} white rot={20} />
      <Rose x={183} y={83} r={13} white rot={-15} />
      <Rose x={156} y={106} r={8.5} white />
      <Rose x={210} y={107} r={8.5} white />
      <Rose x={183} y={108} r={9} white />
      {/* fonuslar */}
      {[[134, 96], [232, 96]].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <circle cy="-12" r="16" fill="url(#bt-lamp)" opacity="0.28" className="glow" />
          <path d="M0-44v5" stroke="#B8964A" strokeWidth="1.4" />
          <circle cy="-45" r="2" fill="none" stroke="#B8964A" strokeWidth="1" />
          <path d="M-8-30Q0-42 8-30Z" fill="#C9A85A" stroke="#A58E44" strokeWidth="0.8" />
          <rect x="-8" y="-30" width="16" height="26" rx="2" fill="url(#bt-lamp)" stroke="#B8964A" strokeWidth="1.2" />
          <path d="M-8-17h16M0-30v26M-4-30v26M4-30v26" stroke="#B8964A" strokeWidth="0.7" opacity="0.7" />
          <rect x="-10" y="-5" width="20" height="5" rx="1.5" fill="#C9A85A" stroke="#A58E44" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  )
}

/* ===================================================================== */
/* Yordamchilar                                                           */
/* ===================================================================== */

const digits = (s) => String(s || '').replace(/\D/g, '')
function fmtPhone(s) {
  const d = digits(s)
  if (d.length === 12 && d.startsWith('998')) return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`
  if (d.length === 9) return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7)}`
  return String(s).trim()
}
const intl = (s) => {
  const d = digits(s)
  return d.length === 9 ? `998${d}` : d
}
function cardScheme(num) {
  const d = digits(num)
  if (/^(8600|5614)/.test(d)) return 'UZCARD'
  if (/^9860/.test(d)) return 'HUMO'
  if (/^4/.test(d)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'MASTERCARD'
  return ''
}
const photoSrc = (f) => (/^(https?:)?\//.test(f) ? f : `/img/${f}`)

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const t = document.createElement('textarea')
      t.value = text
      t.setAttribute('readonly', '')
      t.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(t)
      t.select()
      const ok = document.execCommand('copy')
      t.remove()
      return ok
    } catch {
      return false
    }
  }
}

/* ===================================================================== */
/* 10. TO'YXONA                                                           */
/* ===================================================================== */
export function Venue() {
  if (!WEDDING.venue) return null
  const corner = img('floral-corner-bottom')
  return (
    <section id="manzil" className="gutter relative pb-6 pt-12" style={{ background: '#F6F3EA' }}>
      <Reveal>
        <Divider kind="moon" />
      </Reveal>
      <Reveal delay={0.12} y={18} className="mt-6">
        <Card sparkles="dots" innerClassName="overflow-hidden">
          <div className={`relative z-[1] px-6 pt-9 text-center ${corner ? 'min-h-[236px] pb-[104px]' : 'min-h-[214px] pb-[92px]'}`}>
            <CapsLine>To'yxona</CapsLine>
            <h3 className="mt-[14px] font-serif text-[30px] font-semibold leading-[1.1] text-[#245638] [text-wrap:balance]">
              «{WEDDING.venue}»
              {WEDDING.venueType && <span className="ml-2 font-serif text-[24px] font-medium italic text-[#3C6B4C]">{WEDDING.venueType}</span>}
            </h3>
            <div className="mt-3 flex items-center justify-center gap-3" aria-hidden="true">
              <Hair w={80} />
              <Sparkle size={11} color="#C9A85A" />
              <Hair w={80} dir="l" />
            </div>
            {WEDDING.city && (
              <p className="mt-3 flex items-center justify-center gap-2 font-serif text-[17px] italic text-[#7A746F]">
                <PinIcon />
                {WEDDING.city}
              </p>
            )}
            {WEDDING.address &&
              (WEDDING.city ? (
                <p className="mx-auto mt-1.5 max-w-[250px] font-serif text-[15px] leading-snug text-[#8A8178]">{WEDDING.address}</p>
              ) : (
                <p className="mx-auto mt-3 max-w-[270px] font-serif text-[17px] italic leading-snug text-[#7A746F]">
                  <span className="mr-2 inline-block align-[-2px]"><PinIcon /></span>
                  {WEDDING.address}
                </p>
              ))}
          </div>
          {corner ? (
            <>
              {/* haqiqiy gul burchaklari (chap: asl, o'ng: ko'zgu) */}
              <img src={corner} alt="" width="1536" height="1024" loading="lazy" decoding="async" draggable="false" className="venue-corner pointer-events-none absolute bottom-0 left-0" />
              <img src={corner} alt="" width="1536" height="1024" loading="lazy" decoding="async" draggable="false" className="venue-corner is-flip pointer-events-none absolute bottom-0 right-0" />
            </>
          ) : (
            <>
              <div className="pointer-events-none absolute bottom-0 left-0 h-[100px] w-[95px]"><RoseCorner /></div>
              <div className="pointer-events-none absolute bottom-0 right-0 h-[100px] w-[95px]"><RoseCorner flip /></div>
            </>
          )}
        </Card>
      </Reveal>
    </section>
  )
}

/* ===================================================================== */
/* 11. XARITA                                                             */
/* ===================================================================== */
export function MapCard() {
  const box = useRef(null)
  const near = useInView(box, { once: true, margin: '400px 0px' })
  const [loaded, setLoaded] = useState(false)

  const query = WEDDING.mapQuery || [WEDDING.venue, WEDDING.venueType, WEDDING.city].filter(Boolean).join(' ')
  const hasLL = WEDDING.lat != null && WEDDING.lng != null && WEDDING.lat !== '' && WEDDING.lng !== ''
  if (!hasLL && !query) return null
  const q = encodeURIComponent(query)
  const ll = hasLL ? `${WEDDING.lng}%2C${WEDDING.lat}` : ''
  const src = hasLL ? `https://yandex.uz/map-widget/v1/?ll=${ll}&z=16&pt=${ll}%2Cpm2gnm` : `https://yandex.uz/map-widget/v1/?text=${q}&z=15`
  const open = WEDDING.yandex || (hasLL ? `https://yandex.uz/maps/?pt=${WEDDING.lng},${WEDDING.lat}&z=17&l=map` : `https://yandex.uz/maps/?text=${q}`)
  const google = `https://www.google.com/maps/search/?api=1&query=${hasLL ? `${WEDDING.lat},${WEDDING.lng}` : q}`

  return (
    <section className="gutter relative pb-12 pt-4" style={{ background: '#F6F3EA' }}>
      <Reveal y={18}>
        <div className="mat">
          <div ref={box} className="card relative h-[245px] overflow-hidden">
            <div className="map-dots absolute inset-0 grid place-items-center" aria-hidden="true">
              <div className="flex flex-col items-center">
                <span className="map-pin-bob">
                  <svg width="30" height="38" viewBox="0 0 30 38">
                    <path d="M15 37S2 23.6 2 14.5a13 13 0 0 1 26 0C28 23.6 15 37 15 37Z" fill="#1F5A35" stroke="#D8C48A" strokeWidth="1.5" />
                    <circle cx="15" cy="14.5" r="5" fill="#E6CF8E" />
                  </svg>
                </span>
                <span className="map-pin-shadow mt-0.5 h-1.5 w-5 rounded-full bg-[#3a3328]" />
              </div>
            </div>
            {near && (
              <iframe
                title={`${WEDDING.venue} — xarita`}
                src={src}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 h-full w-full border-0 transition-opacity duration-500"
                style={{ opacity: loaded ? 1 : 0 }}
              />
            )}
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-[22px] flex flex-col items-center">
        <motion.a
          href={open}
          target="_blank"
          rel="noreferrer"
          whileTap={{ scale: 0.97 }}
          className="pill-emerald inline-flex h-11 w-[260px] items-center justify-center gap-2.5 rounded-full font-caps text-[13px] font-semibold uppercase tracking-[0.16em]"
        >
          <NavIcon />
          <span>Xaritada ochish</span>
          <span className="text-[17px] leading-none">›</span>
        </motion.a>
        <a href={google} target="_blank" rel="noreferrer" className="mt-3.5 font-serif text-[15px] italic text-[#8A7A4C] underline decoration-[#D8C48A] underline-offset-4">
          Google Maps orqali ochish
        </a>
      </Reveal>
    </section>
  )
}

/* ===================================================================== */
/* 12. MA'LUMOT UCHUN                                                     */
/* ===================================================================== */
function ContactRow({ href, icon, label, value, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="contact-row flex h-[80px] items-center gap-[14px] px-[22px] first:rounded-t-[20px] last:rounded-b-[20px]"
    >
      <span className="icon-sage grid h-11 w-11 shrink-0 place-items-center rounded-full">{icon}</span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block font-caps text-[11px] font-semibold uppercase tracking-[0.16em] text-[#857340]">{label}</span>
        <span className="mt-0.5 block font-serif text-[18px] font-semibold text-[#312D26]">{value}</span>
      </span>
      <span className="contact-chev text-[#C9B074]"><Chevron /></span>
    </a>
  )
}

export function Contacts() {
  const { phone, whatsapp } = WEDDING
  if (!phone && !whatsapp) return null
  const env = img('envelope-roses')
  return (
    <section className="relative pb-12 pt-[30px]" style={{ background: 'linear-gradient(180deg,#ECE6D2,#F1ECDD)' }}>
      <div className="gutter text-center">
        <Reveal>
          <Divider kind="moon" />
          <p className="mt-3 font-caps text-[12px] font-semibold uppercase tracking-[0.3em] text-[#877341]" style={{ marginRight: '-0.3em' }}>Ma'lumot uchun</p>
          <p className="mt-2.5 font-serif text-[17px] italic text-[#706456]">Savollaringiz bo'lsa, biz bilan bog'laning</p>
        </Reveal>
        <motion.div
          className="relative z-0 mx-auto -mb-4 mt-5 h-[230px] w-[268px]"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -8% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {env ? <img src={env} alt="" loading="lazy" className="h-full w-full object-contain" /> : <EnvelopeBouquet />}
        </motion.div>
        <Reveal delay={0.1} className="relative z-10">
          <Card sparkles="bottom">
            <div>
              {phone && <ContactRow href={`tel:+${intl(phone)}`} icon={<PhoneIcon />} label="Telefon" value={fmtPhone(phone)} />}
              {phone && whatsapp && <span className="mx-[8px] block border-t border-dashed border-[#DCCDA0]" aria-hidden="true" />}
              {whatsapp && <ContactRow href={`https://wa.me/${intl(whatsapp)}`} external icon={<WhatsAppIcon />} label="WhatsApp" value={fmtPhone(whatsapp)} />}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  )
}

/* ===================================================================== */
/* 13. TO'YONA                                                            */
/* ===================================================================== */
export function Toyona() {
  const [done, setDone] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])
  if (!WEDDING.card) return null
  const num = digits(WEDDING.card)
  const grouped = num.replace(/(\d{4})(?=\d)/g, '$1 ')
  const scheme = cardScheme(num)

  const copy = async () => {
    if (await copyText(num)) {
      setDone(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setDone(false), 1800)
    }
  }

  return (
    <section className="gutter relative pb-14 pt-14 text-center" style={{ background: '#F3F1EA' }}>
      <Reveal>
        <h2 className="font-serif text-[22px] font-medium uppercase tracking-[0.25em] text-[#5B5140]" style={{ marginRight: '-0.25em' }}>To'yona</h2>
        <Divider kind="medal" w={120} className="mt-3" />
        <p className="mx-auto mt-4 max-w-[330px] font-serif text-[17px] italic leading-[1.55] text-[#6D6057]">
          Qalban to'yona atamoqchi bo'lsangiz, quyidagi karta raqamidan foydalanishingiz mumkin
        </p>
      </Reveal>

      <motion.div
        className="relative mx-auto mt-7 w-full max-w-[335px]"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <div className="bank-card aspect-[1.595] w-full text-left">
          <span className="bank-lattice" />
          <span className="bank-sheen" />
          <div className="relative flex h-full flex-col px-6 pb-5 pt-[26px]">
            <div className="flex items-start justify-between">
              <span className="font-caps text-[12px] font-normal uppercase tracking-[0.22em] text-[#DCE3D2]/85">To'yona kartasi</span>
              <span className="chip relative h-[26px] w-[34px] rounded-[5px]" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-px bg-[#8a7330]/50" />
                <span className="absolute inset-y-0 left-1/3 w-px bg-[#8a7330]/50" />
                <span className="absolute inset-y-0 left-2/3 w-px bg-[#8a7330]/50" />
              </span>
            </div>
            <p className="foil mt-auto whitespace-nowrap font-serif text-[22px] font-medium tracking-[0.14em] [font-variant-numeric:lining-nums]">{grouped}</p>
            <div className="mt-auto flex items-end justify-between gap-3">
              <div className="min-w-0">
                {WEDDING.cardHolder && (
                  <>
                    <p className="font-caps text-[9px] uppercase tracking-[0.2em] text-[#9FB5A2]">Karta egasi</p>
                    <p className="mt-0.5 truncate font-sans text-[15px] font-medium tracking-[0.04em] text-[#F5F1E3]">{WEDDING.cardHolder}</p>
                  </>
                )}
              </div>
              {scheme && <span className="font-caps text-[12px] font-semibold tracking-[0.18em] text-[#E0CF95]/90">{scheme}</span>}
            </div>
          </div>
        </div>
        {['-left-[15px] -top-[15px]', '-right-[15px] -top-[15px]', '-left-[15px] -bottom-[15px]', '-right-[15px] -bottom-[15px]'].map((p) => (
          <span key={p} className={`pointer-events-none absolute ${p}`} style={{ opacity: 0.8 }}>
            <StarOutline size={30} className="spin-40" />
          </span>
        ))}
      </motion.div>

      <Reveal delay={0.15} className="mt-6">
        <motion.button
          type="button"
          onClick={copy}
          whileTap={{ scale: 0.97 }}
          className={`copy-pill relative mx-auto inline-flex h-11 w-[236px] items-center justify-center gap-2 rounded-full font-sans text-[15px] font-semibold text-[#2B5A3C] ${done ? 'is-done' : ''}`}
          aria-live="polite"
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2"><Medal /></span>
          <span className="absolute right-4 top-1/2 -translate-y-1/2"><Medal /></span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done ? 'ok' : 'copy'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="inline-flex items-center gap-2"
            >
              {done ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  Nusxalandi
                </>
              ) : (
                <>
                  <CopyIcon />
                  Raqamni nusxalash
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </Reveal>

      <AnimatePresence>
        {done && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed bottom-6 left-1/2 z-[70] -ml-[130px] w-[260px] rounded-full bg-[#1F5A35] px-5 py-3 text-center font-sans text-[14px] font-medium text-[#F5F1E3] shadow-[0_10px_30px_rgba(18,42,28,.35)]"
          >
            Karta raqami nusxalandi ✓
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ===================================================================== */
/* 15. STOL                                                               */
/* ===================================================================== */
export function Table() {
  if (!WEDDING.table && WEDDING.table !== 0) return null
  const pic = img('banquet-table')
  return (
    <section className="relative overflow-hidden pb-[30px] pt-[50px] text-center" style={{ background: '#F3F2EA' }}>
      <Reveal>
        <h2 className="script text-[46px]">Stol</h2>
      </Reveal>
      <motion.div
        className="relative mx-auto mt-6 aspect-[1.26] w-[min(366px,calc(100%-24px))]"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {pic ? <img src={pic} alt="" loading="lazy" className="h-full w-full object-contain" /> : <BanquetTable />}
        <motion.div
          className="absolute left-1/2 top-[76%] -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.3, ease: BACK }}
        >
          <span className="table-glow absolute left-1/2 top-1/2 -z-0 h-[120px] w-[170px] -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <span className="relative flex items-baseline gap-1.5 font-serif font-semibold leading-none text-[#1F5A35] [font-variant-numeric:lining-nums]">
            <span className="text-[22px]">№</span>
            <span className="text-[60px]">{WEDDING.table}</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ===================================================================== */
/* 16. XOTIRA LAVHALARI                                                   */
/* ===================================================================== */
const ROT = [-3, 3, -2.5, 2.5, -2, 2, -3, 3]

function Polaroid({ src, i, rot, delay, onOpen, className = '', style }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(i)}
      aria-label={`Suratni kattalashtirish (${i + 1})`}
      className={`polaroid relative block ${className}`}
      style={style}
      initial={{ opacity: 0, y: 30, rotate: rot + 6 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: BACK }}
    >
      <img src={src} alt="" loading="lazy" decoding="async" draggable="false" />
      <span className={`bracket ${i % 2 ? 'right-1.5 bottom-1.5 border-b border-r' : 'left-1.5 top-1.5 border-l border-t'}`} />
      <span className={`bracket ${i % 2 ? 'left-1.5 top-1.5 border-l border-t' : 'right-1.5 bottom-1.5 border-b border-r'}`} style={{ opacity: 0.6 }} />
      <span className="absolute bottom-[10px] left-1/2 -translate-x-1/2">
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 .5C5.4 3.4 6.6 4.6 9.5 5 6.6 5.4 5.4 6.6 5 9.5 4.6 6.6 3.4 5.4.5 5 3.4 4.6 4.6 3.4 5 .5Z" fill="none" stroke="#B8964A" strokeWidth="0.8" />
        </svg>
      </span>
    </motion.button>
  )
}

function Lightbox({ list, index, onClose, onStep }) {
  useEffect(() => {
    const k = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', k)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = prev
    }
  }, [onClose, onStep])
  const many = list.length > 1
  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-[#122A1C]/92 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          className="polaroid relative !pb-3"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28, ease: EASE }}
          drag={many ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) onStep(1)
            else if (info.offset.x > 60) onStep(-1)
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={list[index]} alt="" className="!aspect-auto max-h-[78vh] w-auto max-w-[84vw] object-contain" draggable="false" />
        </motion.div>
      </AnimatePresence>
      <button type="button" onClick={onClose} aria-label="Yopish" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-[#D8C48A]/60 text-[#F5F1E3]" style={{ marginTop: 'env(safe-area-inset-top)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
      {many && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-5 text-[#F5F1E3]" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => onStep(-1)} aria-label="Oldingi" className="grid h-10 w-10 place-items-center rounded-full border border-[#D8C48A]/50"><span className="rotate-180"><Chevron /></span></button>
          <span className="font-caps text-[12px] tracking-[0.2em] text-[#E6CF8E]">{index + 1} / {list.length}</span>
          <button type="button" onClick={() => onStep(1)} aria-label="Keyingi" className="grid h-10 w-10 place-items-center rounded-full border border-[#D8C48A]/50"><Chevron /></button>
        </div>
      )}
    </motion.div>
  )
}

export function Memories() {
  const list = (IMAGES.photos || []).filter(Boolean).map(photoSrc)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length])
  if (!list.length) return null

  const pairCount = list.length === 1 ? 0 : Math.floor(list.length / 2) * 2
  const rows = []
  for (let i = 0; i < pairCount; i += 2) rows.push([i, i + 1])
  const solo = list.length % 2 === 1 ? list.length - 1 : null

  return (
    <section className="relative overflow-hidden pb-14 pt-12 text-center" style={{ background: '#F6F3EA' }}>
      <Reveal>
        <Sparkle size={10} color="#C9A85A" className="mx-auto" />
        <h2 className="script mt-[14px] text-[42px]">Xotira lavhalari</h2>
        <span className="mx-auto mt-[14px] block h-px w-[90px]" style={{ background: 'linear-gradient(90deg,transparent,#D8C48A,transparent)' }} />
      </Reveal>
      <div className="gutter mt-9">
        {rows.map(([a, b], r) => (
          <div key={a} className="flex items-start justify-center px-1" style={{ marginTop: r ? 10 : 0 }}>
            <Polaroid src={list[a]} i={a} rot={ROT[a % ROT.length]} delay={0} onOpen={setOpen} className="z-[1] w-[52%]" />
            <Polaroid src={list[b]} i={b} rot={ROT[b % ROT.length]} delay={0.12} onOpen={setOpen} className="z-[2] -ml-[8%] mt-[46px] w-[52%]" />
          </div>
        ))}
        {solo !== null && (
          <div className="flex justify-center" style={{ marginTop: rows.length ? 26 : 0 }}>
            <Polaroid src={list[solo]} i={solo} rot={ROT[solo % ROT.length]} delay={0} onOpen={setOpen} className="w-[min(252px,66%)]" />
          </div>
        )}
      </div>
      <Reveal className="mt-12">
        <Divider kind="star" w={80} />
      </Reveal>
      <AnimatePresence>{open !== null && <Lightbox list={list} index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}

/* ===================================================================== */
/* YAKUN (footer)                                                         */
/* ===================================================================== */
const STARS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: 8 + ((i * 53.3) % 70),
  s: 1.5 + (i % 3) * 0.8,
  d: 2.4 + (i % 5) * 0.5,
  delay: (i % 7) * 0.4,
}))

export function Footer() {
  const p = dateParts()
  const pad = (n) => String(n).padStart(2, '0')
  const dateLine = `${pad(p.d)} · ${pad(p.m + 1)} · ${p.y}`
  return (
    <footer className="relative overflow-hidden pb-36 pt-20 text-center" style={{ background: 'linear-gradient(180deg,#183823 0%,#122A1C 70%,#0E2116 100%)' }}>
      {/* yuqori qirra: kemerli ravoqlar qatori */}
      <svg className="absolute inset-x-0 top-0 h-[26px] w-full" viewBox="0 0 416 26" preserveAspectRatio="none" aria-hidden="true">
        <path
          d={`M0 0H416V10${Array.from({ length: 8 }, (_, i) => {
            const x0 = 416 - i * 52
            return `C${x0 - 6} 10 ${x0 - 18} 12 ${x0 - 26} 24C${x0 - 34} 12 ${x0 - 46} 10 ${x0 - 52} 10`
          }).join('')}Z`}
          fill="#EEEADC"
        />
      </svg>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-[#F3E2AD]"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, '--d': `${s.d}s`, '--delay': `${s.delay}s` }}
          aria-hidden="true"
        />
      ))}
      {/* mehrob ravog'i */}
      <svg className="pointer-events-none absolute left-1/2 top-[54px] h-[520px] w-[330px] -translate-x-1/2" viewBox="0 0 330 520" fill="none" aria-hidden="true">
        <path d="M10 520V200C10 120 90 70 165 12C240 70 320 120 320 200V520" stroke="#C9A85A" strokeOpacity="0.38" strokeWidth="1.2" />
        <path d="M24 520V204C24 132 98 86 165 32C232 86 306 132 306 204V520" stroke="#C9A85A" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 5" />
      </svg>

      <div className="relative mx-auto max-w-[360px] px-6">
        <Reveal>
          <div className="glow mx-auto w-fit"><CrescentStar size={46} /></div>
          <p dir="rtl" lang="ar" className="gold-text mt-6 font-arabic text-[20px] leading-[1.9] [text-wrap:balance]">
            بَارَكَ ٱللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
          </p>
          <p className="mt-3 font-serif text-[17px] italic leading-[1.55] text-[#E9E2CC]/85">
            «Alloh sizlarga baraka bersin, ustingizga baraka yog'dirsin va ikkingizni yaxshilikda jamlasin»
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <CapsLine color="#D8C48A" w={46}>Hurmat bilan</CapsLine>
          <p className="script mt-3 text-[40px] leading-[1.15]" style={{ color: '#E6CF8E' }}>{WEDDING.hosts}</p>
        </Reveal>
        <Reveal delay={0.18} className="mt-9">
          <div className="flex items-center justify-center gap-3">
            <Hair w={54} />
            <Star8 size={12} color="#C9A85A" />
            <Hair w={54} dir="l" />
          </div>
          <p className="mt-4 font-serif text-[15px] font-medium uppercase tracking-[0.26em] text-[#E9E2CC]/80" style={{ marginRight: '-0.26em' }}>
            {WEDDING.groom} <span className="text-[#C9A85A]">&</span> {WEDDING.bride}
          </p>
          <p className="mt-2 font-serif text-[22px] font-medium tracking-[0.18em] text-[#E6CF8E] [font-variant-numeric:lining-nums]" style={{ marginRight: '-0.18em' }}>{dateLine}</p>
        </Reveal>
      </div>
    </footer>
  )
}
