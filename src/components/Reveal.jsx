import { motion } from 'framer-motion'
import { Star8 } from './Ornaments'

export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)', scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ eyebrow, title, sub, light = false }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-md text-center">
      <motion.div initial={{ rotate: -90, scale: 0 }} whileInView={{ rotate: 0, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 100, damping: 12 }}>
        <Star8 size={28} className="mx-auto text-turq" fill="rgba(60,199,192,0.15)" />
      </motion.div>
      {eyebrow && <p className={`mt-3 font-sans text-[11px] font-bold uppercase tracking-[0.3em] ${light ? 'text-gold-light' : 'text-gold'}`}>{eyebrow}</p>}
      <h2 className={`mt-2 font-serif text-4xl leading-tight sm:text-5xl ${light ? 'text-pearl' : 'text-lapis'}`}>{title}</h2>
      {sub && <p className={`mt-3 font-sans text-[15px] leading-relaxed ${light ? 'text-pearl/70' : 'text-ink/60'}`}>{sub}</p>}
    </Reveal>
  )
}
