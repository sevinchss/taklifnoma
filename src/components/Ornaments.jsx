import { useId, useMemo } from 'react'
import { motion } from 'framer-motion'

/** Repeating girih-style 8-point star lattice */
export function Pattern({ color = '#b88a2e', opacity = 0.08, size = 56, className = '' }) {
  const id = useId().replace(/:/g, '')
  const h = size / 2
  const q = size * 0.2857
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} style={{ opacity }} aria-hidden>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="0.8">
            <rect x={q} y={q} width={size - 2 * q} height={size - 2 * q} />
            <rect x={q} y={q} width={size - 2 * q} height={size - 2 * q} transform={`rotate(45 ${h} ${h})`} />
            <circle cx={h} cy={h} r={size * 0.08} />
            <path d={`M0 0L${q} ${q}M${size} 0L${size - q} ${q}M0 ${size}L${q} ${size - q}M${size} ${size}L${size - q} ${size - q}`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/** Rub el Hizb — 8-point star */
export function Star8({ size = 24, className = '', stroke = 'currentColor', fill = 'none', strokeWidth = 1.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <path d="M22 22H78V78H22Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <path d="M50 10.4L89.6 50L50 89.6L10.4 50Z" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    </svg>
  )
}

export function Crescent({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M15.5 2.5a9.5 9.5 0 1 0 0 19a8 8 0 1 1 0-19z" />
    </svg>
  )
}

export function Divider({ className = '', light = false }) {
  const c = light ? 'via-gold-light/70' : 'via-gold/60'
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className={`h-px w-16 bg-gradient-to-r from-transparent ${c} to-transparent`} />
      <Star8 size={10} className="text-turq" fill="currentColor" strokeWidth={0} />
      <Star8 size={16} className={light ? 'text-gold-light' : 'text-gold'} fill="currentColor" strokeWidth={0} />
      <Star8 size={10} className="text-turq" fill="currentColor" strokeWidth={0} />
      <span className={`h-px w-16 bg-gradient-to-l from-transparent ${c} to-transparent`} />
    </div>
  )
}

/** Majolica tile ribbon (Registan-style) */
export function TileBand({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`block h-5 w-full ${className}`} aria-hidden>
      <defs>
        <pattern id={id} width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#142a6b" />
          <path d="M20 2L28 10L20 18L12 10Z" fill="#3cc7c0" />
          <path d="M20 6L24 10L20 14L16 10Z" fill="#ecc879" />
          <path d="M0 2L8 10L0 18M40 2L32 10L40 18" fill="#1d3a8a" />
          <circle cx="0" cy="10" r="2" fill="#ecc879" />
          <circle cx="40" cy="10" r="2" fill="#ecc879" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/** Twinkling star field */
export function Stars({ count = 70, seed = 7 }) {
  const stars = useMemo(() => {
    let s = seed
    const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
    return Array.from({ length: count }, () => ({ x: r() * 100, y: r() * 85, z: r() * 2 + 1, d: 2 + r() * 4, delay: r() * 5 }))
  }, [count, seed])
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.z, height: s.z, '--d': `${s.d}s`, '--delay': `${s.delay}s`, boxShadow: '0 0 6px rgba(255,255,255,.8)' }}
        />
      ))}
      <span className="shooting absolute right-[10%] top-[12%] h-px w-28 bg-gradient-to-l from-white to-transparent" style={{ '--delay': '1.5s' }} />
      <span className="shooting absolute right-[40%] top-[5%] h-px w-20 bg-gradient-to-l from-white to-transparent" style={{ '--delay': '5s' }} />
    </div>
  )
}

/** Samarkand skyline silhouette */
export function Skyline({ fill = '#f8f3e8', className = '' }) {
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" className={`pointer-events-none block w-full ${className}`} aria-hidden>
      <g fill={fill}>
        <rect x="0" y="196" width="1440" height="24" />
        {/* center dome */}
        <path d="M600 196V138H840V196Z" />
        <path d="M612 140C612 78 670 48 720 34C770 48 828 78 828 140Z" />
        <rect x="717" y="6" width="6" height="30" />
        <circle cx="720" cy="8" r="6" />
        {/* portal */}
        <path d="M640 196V150H800V196Z" />
        {/* minarets */}
        <path d="M548 196V62h26v134z M544 62l17-30 17 30z M542 92h38v8h-38z" />
        <path d="M866 196V62h26v134z M862 62l17-30 17 30z M860 92h38v8h-38z" />
        {/* side domes */}
        <path d="M300 196V160C300 116 340 96 380 88C420 96 460 116 460 160V196Z" />
        <rect x="377" y="70" width="6" height="20" />
        <path d="M980 196V160C980 116 1020 96 1060 88C1100 96 1140 116 1140 160V196Z" />
        <rect x="1057" y="70" width="6" height="20" />
        {/* far minarets */}
        <path d="M216 196V100h18v96z M212 100l11-20 11 20z" />
        <path d="M1206 196V100h18v96z M1202 100l11-20 11 20z" />
        {/* low walls */}
        <path d="M0 196V176h300v20zM460 196V170h88v26zM892 196V170h88v26zM1140 196V176h300v20z" />
        <path d="M60 196V150C60 132 76 124 92 120C108 124 124 132 124 150V196Z" />
        <path d="M1316 196V150C1316 132 1332 124 1348 120C1364 124 1380 132 1380 150V196Z" />
      </g>
    </svg>
  )
}

/** Hanging lantern */
export function Lantern({ className = '', rope = 80, delay = 0, scale = 1 }) {
  return (
    <div className={`swing ${className}`} style={{ animationDelay: `${delay}s` }} aria-hidden>
      <svg width={60 * scale} height={(rope + 120) * scale} viewBox={`0 0 60 ${rope + 120}`}>
        <defs>
          <radialGradient id="lg" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#ffe9b0" />
            <stop offset="60%" stopColor="#f2c66d" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f2c66d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="30" y1="0" x2="30" y2={rope} stroke="#ecc879" strokeWidth="1" />
        <g transform={`translate(0 ${rope})`}>
          <circle className="glow" cx="30" cy="62" r="34" fill="url(#lg)" />
          <path d="M30 0l6 8h-12z" fill="#ecc879" />
          <path d="M18 10h24l-4 10H22z" fill="#b88a2e" />
          <path d="M20 20h20c8 12 10 28 6 48H14c-4-20-2-36 6-48z" fill="#1f8f8f" stroke="#ecc879" strokeWidth="1.5" />
          <path d="M24 26h12c5 10 6 24 3 36H21c-3-12-2-26 3-36z" fill="#ffe2a0" opacity="0.9" className="glow" />
          <path d="M30 26v36M22 44h16" stroke="#b88a2e" strokeWidth="1" />
          <path d="M14 68h32l-6 10H20z" fill="#b88a2e" />
          <path d="M30 78v14" stroke="#ecc879" strokeWidth="1.2" />
          <circle cx="30" cy="95" r="3" fill="#ecc879" />
        </g>
      </svg>
    </div>
  )
}

/** Registan-style pishtaq (grand portal) */
export function Pishtaq({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 320 420" className={className} aria-hidden>
      <defs>
        <pattern id={`t${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#142a6b" />
          <path d="M10 1L19 10L10 19L1 10Z" fill="none" stroke="#3cc7c0" strokeWidth="1" />
          <circle cx="10" cy="10" r="2.2" fill="#ecc879" />
          <circle cx="0" cy="0" r="1.5" fill="#3cc7c0" />
          <circle cx="20" cy="20" r="1.5" fill="#3cc7c0" />
        </pattern>
        <pattern id={`m${id}`} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#1f8f8f" />
          <path d="M0 6h12M6 0v12" stroke="#0e5f63" strokeWidth="1" />
          <circle cx="6" cy="6" r="2" fill="#ecc879" />
        </pattern>
        <radialGradient id={`g${id}`} cx="50%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#fff4d1" />
          <stop offset="45%" stopColor="#f2c66d" />
          <stop offset="100%" stopColor="#8a5a1a" />
        </radialGradient>
      </defs>

      {/* minarets */}
      {[0, 286].map((x) => (
        <g key={x}>
          <rect x={x} y="70" width="34" height="350" fill={`url(#m${id})`} />
          <path d={`M${x - 3} 70h40l-6-12h-28z`} fill="#b88a2e" />
          <path d={`M${x + 4} 58c0-18 6-28 13-34c7 6 13 16 13 34z`} fill="#3cc7c0" stroke="#ecc879" />
          <rect x={x + 15.5} y="10" width="3" height="16" fill="#ecc879" />
          <rect x={x} y="140" width="34" height="6" fill="#ecc879" />
          <rect x={x} y="260" width="34" height="6" fill="#ecc879" />
        </g>
      ))}

      {/* portal */}
      <rect x="34" y="40" width="252" height="380" fill={`url(#t${id})`} />
      <rect x="34" y="40" width="252" height="380" fill="none" stroke="#ecc879" strokeWidth="3" />
      <rect x="42" y="48" width="236" height="372" fill="none" stroke="#ecc879" strokeOpacity=".5" />
      <rect x="34" y="40" width="252" height="40" fill="#0e5f63" />
      <rect x="34" y="40" width="252" height="40" fill="none" stroke="#ecc879" strokeWidth="2" />
      <text x="160" y="69" textAnchor="middle" fontFamily="Amiri, serif" fontSize="22" fill="#ecc879">
        مَا شَاءَ ٱللَّهُ
      </text>

      {/* arch niche */}
      <path d="M72 420V220C72 158 116 124 160 98C204 124 248 158 248 220V420Z" fill="#0b1840" stroke="#ecc879" strokeWidth="3" />
      <path d="M90 420V224C90 172 126 144 160 120C194 144 230 172 230 224V420Z" fill={`url(#g${id})`} />
      <path d="M90 420V224C90 172 126 144 160 120C194 144 230 172 230 224V420Z" fill="none" stroke="#fff4d1" strokeOpacity=".6" />
      {/* muqarnas hint */}
      <path d="M118 176q14 10 14 26M202 176q-14 10-14 26M160 130v26M136 150q10 8 12 20M184 150q-10 8-12 20" stroke="#b88a2e" strokeOpacity=".55" fill="none" />

      {/* spandrel stars */}
      <g fill="#ecc879">
        <path transform="translate(54 96) scale(.32)" d="M22 22H78V78H22ZM50 10.4L89.6 50L50 89.6L10.4 50Z" />
        <path transform="translate(234 96) scale(.32)" d="M22 22H78V78H22ZM50 10.4L89.6 50L50 89.6L10.4 50Z" />
      </g>
    </svg>
  )
}
