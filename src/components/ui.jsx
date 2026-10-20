// Umumiy bezak va karta qismlari — hamma bo'limlar shulardan foydalanadi
import { motion } from 'framer-motion'

const EASE = [0.2, 0.7, 0.2, 1]

// Ko'rinishga kirganda yumshoq paydo bo'lish (tez: 0.65 s)
export function Reveal({ children, delay = 0, y = 14, className = '', as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      {children}
    </M>
  )
}

// Ikki qavatli karta: tashqi "mat" + oq karta + uzuq-uzuq oltin chiziq
export function Card({ children, className = '', innerClassName = '', sparkles = 'bottom' }) {
  return (
    <div className={`mat ${className}`}>
      <div className={`card ${innerClassName}`}>
        <span className="card-dash" aria-hidden="true" />
        {sparkles === 'bottom' && (
          <>
            <Sparkle className="absolute bottom-3 left-3" />
            <Sparkle className="absolute bottom-3 right-3" />
          </>
        )}
        {sparkles === 'dots' && (
          <>
            <span className="absolute left-4 top-4 h-[5px] w-[5px] rounded-full border border-gold-line" />
            <span className="absolute right-4 top-4 h-[5px] w-[5px] rounded-full border border-gold-line" />
          </>
        )}
        <div className="relative">{children}</div>
      </div>
    </div>
  )
}

// To'rt qirrali kichik oltin yulduzcha ✦
export function Sparkle({ size = 10, className = '', color = '#C9AE6A' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" className={className} aria-hidden="true">
      <path d="M5 0C5.4 3.2 6.8 4.6 10 5 6.8 5.4 5.4 6.8 5 10 4.6 6.8 3.2 5.4 0 5 3.2 4.6 4.6 3.2 5 0Z" fill={color} />
    </svg>
  )
}

// Sakkiz qirrali yulduz (rub el hizb)
export function Star8({ size = 14, className = '', color = '#C9A44F' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="5" y="5" width="14" height="14" fill={color} />
      <rect x="5" y="5" width="14" height="14" fill={color} transform="rotate(45 12 12)" />
      <circle cx="12" cy="12" r="3" fill="#FBF8EF" />
    </svg>
  )
}

const Line = ({ dir = 'r', w = 110 }) => (
  <span
    className="h-px"
    style={{ width: w, background: `linear-gradient(${dir === 'r' ? 90 : 270}deg, transparent, #D8C48A)` }}
  />
)

// Bo'limlar orasidagi ajratgichlar: 'moon' (◗ ✦ ◖), 'medal' (⊛), 'star' (8 qirrali yulduz)
export function Divider({ kind = 'moon', className = '', w = 110 }) {
  return (
    <div className={`flex items-center justify-center gap-[10px] ${className}`} aria-hidden="true">
      <Line dir="r" w={w} />
      {kind === 'moon' && (
        <>
          <svg width="9" height="12" viewBox="0 0 9 12"><path d="M8 0.5A5.5 5.5 0 1 0 8 11.5 4.2 4.6 0 1 1 8 0.5Z" fill="#C9A85A" /></svg>
          <Sparkle size={14} color="#C9A85A" />
          <svg width="9" height="12" viewBox="0 0 9 12"><path d="M1 0.5A5.5 5.5 0 1 1 1 11.5 4.2 4.6 0 1 0 1 0.5Z" fill="#C9A85A" /></svg>
        </>
      )}
      {kind === 'medal' && (
        <svg width="9" height="9" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="none" stroke="#CDB574" /><circle cx="5" cy="5" r="1.6" fill="#CDB574" /></svg>
      )}
      {kind === 'star' && <Star8 size={14} />}
      <Line dir="l" w={w} />
    </div>
  )
}

// Kichik bosh harfli sarlavha: "TO'YXONA", "HADISI SHARIF"
export function Eyebrow({ children, className = '' }) {
  return <p className={`caps text-[13px] text-gold-ink ${className}`}>{children}</p>
}

// Yozma (script) sarlavha: "Mehmonimiz", "Xotira lavhalari"
export function ScriptTitle({ children, className = '', as: Tag = 'h2' }) {
  return <Tag className={`script text-[48px] ${className}`}>{children}</Tag>
}

// Rasm joyi: rasm bo'lsa — rasm, bo'lmasa — fallback (chizilgan bezak)
export function Slot({ src, alt = '', className = '', imgClassName = '', fallback = null, eager = false, style }) {
  if (!src) return fallback
  return (
    <div className={className} style={style}>
      <img src={src} alt={alt} decoding="async" loading={eager ? 'eager' : 'lazy'} className={`block h-full w-full ${imgClassName}`} draggable="false" />
    </div>
  )
}
