import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Crescent, Pishtaq, Star8, Stars } from './Ornaments'
import { DoveBurst, Fireflies, Flock, Magnetic, Sparkles, Wipe } from './Magic'
import { WEDDING } from '../config'
import { playMusic } from '../music'

const EASE = [0.16, 1, 0.3, 1]

/** 3D tilt of the portal following pointer / phone tilt */
function useTilt() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 60, damping: 18 })
  const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 60, damping: 18 })
  useEffect(() => {
    const move = (e) => {
      mx.set((e.clientX / innerWidth) * 2 - 1)
      my.set((e.clientY / innerHeight) * 2 - 1)
    }
    const orient = (e) => {
      if (e.gamma == null) return
      mx.set(Math.max(-1, Math.min(1, e.gamma / 25)))
      my.set(Math.max(-1, Math.min(1, (e.beta - 45) / 25)))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('deviceorientation', orient)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('deviceorientation', orient)
    }
  }, [mx, my])
  return { rotateX: rx, rotateY: ry }
}

export default function Intro({ onOpen }) {
  const [opening, setOpening] = useState(false)
  const tilt = useTilt()

  const open = () => {
    if (opening) return
    playMusic()
    setOpening(true)
    setTimeout(onOpen, 2000)
  }

  const out = opening ? { opacity: 0, y: -20, filter: 'blur(8px)', transition: { duration: 0.6 } } : undefined

  return (
    <motion.div
      className="night-bg fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 text-center text-pearl"
      exit={{ opacity: 0, transition: { duration: 1, ease: 'easeOut' } }}
    >
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        <Stars count={110} />
      </motion.div>
      <Fireflies count={18} />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 2 }}>
        <Flock />
      </motion.div>

      {/* moon */}
      <motion.div
        className="absolute right-[9%] top-[7%] text-gold-light"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 2.4, ease: EASE }}
      >
        <div className="absolute -inset-8 rounded-full bg-gold-light/25 blur-2xl" />
        <Crescent size={46} className="relative drop-shadow-[0_0_18px_rgba(236,200,121,0.9)]" />
      </motion.div>

      <motion.div animate={out}>
        <Wipe rtl delay={0.5} duration={1.8} as="p" className="relative block font-arabic text-[1.75rem] text-gold-light sm:text-4xl">
          <span dir="rtl">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</span>
        </Wipe>
      </motion.div>

      {/* portal */}
      <div className="relative my-5 w-[min(62vw,290px)] [perspective:900px] sm:my-7">
        <motion.div
          className="rays absolute left-1/2 top-[58%] aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ delay: opening ? 0 : 1.2, duration: 2 }}
        />
        <motion.div
          className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 text-gold-light/30"
          initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
          animate={{ opacity: opening ? 0 : 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1, duration: 2.4, ease: EASE }}
        >
          <Star8 size={420} strokeWidth={0.35} className="spin-slow" />
        </motion.div>

        <motion.div
          style={{ ...tilt, transformOrigin: '50% 72%', transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, scale: 0.82, y: 30, clipPath: 'circle(0% at 50% 75%)' }}
          animate={
            opening
              ? { scale: 11, opacity: [1, 1, 0], transition: { duration: 1.9, ease: [0.7, 0, 0.25, 1] } }
              : { opacity: 1, scale: 1, y: 0, clipPath: 'circle(120% at 50% 75%)', transition: { delay: 0.9, duration: 2, ease: EASE } }
          }
          className="relative"
        >
          <div className="glow absolute inset-x-[22%] bottom-0 top-[38%] rounded-full bg-gold-light/50 blur-3xl" />
          <Pishtaq className="relative w-full drop-shadow-[0_30px_50px_rgba(3,8,30,0.7)]" />
        </motion.div>

        {opening && (
          <div className="absolute left-1/2 top-[72%]">
            <Sparkles count={14} spread={200} />
            <DoveBurst count={5} spread={420} />
          </div>
        )}
      </div>

      <motion.div animate={out} className="relative">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.9em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ delay: 2.2, duration: 1.6, ease: EASE }}
          className="font-sans text-[11px] font-bold uppercase text-turq"
        >
          Nikoh to'yiga taklifnoma
        </motion.p>
        <Wipe delay={2.5} duration={2} as="p" className="mt-2 block font-script text-[2.5rem] leading-tight text-gold-light drop-shadow-[0_0_20px_rgba(236,200,121,0.35)] sm:text-5xl">
          {WEDDING.groom} & {WEDDING.bride}
        </Wipe>
      </motion.div>

      <motion.div
        className="relative mt-7"
        initial={{ opacity: 0, y: 20 }}
        animate={opening ? { opacity: 0, scale: 0.8 } : { opacity: 1, y: 0 }}
        transition={opening ? { duration: 0.4 } : { delay: 3.4, type: 'spring', stiffness: 100, damping: 14 }}
      >
        <span className="ripple absolute inset-0 rounded-full border border-gold-light/60" />
        <span className="ripple absolute inset-0 rounded-full border border-gold-light/40" style={{ animationDelay: '1.2s' }} />
        <Magnetic
          onClick={open}
          className="group relative overflow-hidden rounded-full bg-gradient-to-br from-[#f6dc9c] via-gold-light to-gold px-9 py-4 font-sans text-[15px] font-extrabold text-night shadow-[0_14px_40px_-10px_rgba(236,200,121,0.7),inset_0_1px_0_rgba(255,255,255,0.6)]"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          <span className="relative flex items-center gap-2">
            <Star8 size={16} fill="currentColor" strokeWidth={0} />
            Taklifnomani ochish
          </span>
        </Magnetic>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 0.6 }}
        transition={{ delay: opening ? 0 : 3.8, duration: 1 }}
        className="relative mt-4 flex items-center gap-1.5 font-sans text-xs text-pearl"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M9 18V5l12-2v13" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        Musiqa bilan ochiladi
      </motion.p>

      {/* golden flash as we pass through the arch */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,#fff7df_0%,#f8f3e8_45%,#f3dca4_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 1 : 0 }}
        transition={{ delay: opening ? 1.15 : 0, duration: 0.85 }}
      />
    </motion.div>
  )
}
