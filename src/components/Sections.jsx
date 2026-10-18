import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Fireflies, Flock, Wipe } from './Magic'
import { WEDDING, MONTHS, WEEKDAYS } from '../config'
import { Crescent, Divider, Lantern, Pattern, Skyline, Star8, Stars, TileBand } from './Ornaments'
import Reveal, { SectionTitle } from './Reveal'

const D = new Date(WEDDING.date)
const pad = (n) => String(n).padStart(2, '0')
const timeStr = `${pad(D.getHours())}:${pad(D.getMinutes())}`
const dateStr = `${D.getDate()}-${MONTHS[D.getMonth()].toLowerCase()}`

const Icon = {
  cal: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>,
  clock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  pin: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>,
}

/* ---------------- HERO (night sky over Samarkand) ---------------- */
export function Hero({ ready = true }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yMoon = useTransform(scrollYProgress, [0, 1], [0, 220])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 160])
  const fadeText = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const yBack = useTransform(scrollYProgress, [0, 1], [0, 90])
  const yStars = useTransform(scrollYProgress, [0, 1], [0, 60])
  const show = (d) => ({ initial: { opacity: 0, y: 20 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { delay: d, duration: 1.2, ease: [0.16, 1, 0.3, 1] } })

  return (
    <section ref={ref} className="night-bg relative flex min-h-[100dvh] flex-col overflow-hidden text-pearl">
      <motion.div style={{ y: yStars }} className="absolute inset-0">
        <Stars count={100} />
      </motion.div>
      <Fireflies count={14} />
      <Flock />
      <div className="absolute inset-x-0 top-0 flex justify-between px-[5%]">
        <Lantern rope={30} delay={0} scale={0.75} />
        <Lantern rope={90} delay={1.1} scale={0.85} className="hidden sm:block" />
        <Lantern rope={60} delay={0.5} scale={0.75} />
      </div>
      <motion.div style={{ y: yMoon }} className="absolute left-[16%] top-[13%] text-gold-light">
        <div className="glow absolute -inset-10 rounded-full bg-gold-light/25 blur-2xl" />
        <Crescent size={50} className="float relative drop-shadow-[0_0_22px_rgba(236,200,121,0.9)]" />
      </motion.div>

      <motion.div style={{ y: yText, opacity: fadeText }} className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-44 pt-28 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.9em' }}
          animate={ready ? { opacity: 1, letterSpacing: '0.35em' } : {}}
          transition={{ delay: 0.3, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[11px] font-bold uppercase text-turq"
        >
          Nikoh to'yiga taklifnoma
        </motion.p>
        <h1 className="mt-5 font-script text-[4.2rem] leading-[0.95] sm:text-8xl">
          <Wipe show={ready} delay={0.6} duration={1.8} className="gold-text block px-3">{WEDDING.groom}</Wipe>
          <motion.span {...show(1.6)} className="my-1 block font-italic text-4xl italic text-pearl/80">va</motion.span>
          <Wipe show={ready} delay={1.9} duration={1.8} className="gold-text block px-3">{WEDDING.bride}</Wipe>
        </h1>
        <motion.p {...show(2.8)} className="mt-6 max-w-xs font-italic text-xl italic text-pearl/80">
          Hayotimizning eng baxtli kunida sizni yonimizda ko'rishni istaymiz
        </motion.p>
        <motion.a {...show(3.4)} href="#taklif" className="mt-8 grid h-12 w-8 place-items-start justify-center rounded-full border border-pearl/30 pt-2" aria-label="Pastga">
          <motion.span animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="h-2 w-1 rounded-full bg-gold-light" />
        </motion.a>
      </motion.div>

      <motion.div style={{ y: yBack }} className="absolute inset-x-0 bottom-10">
        <Skyline fill="#0d1d55" className="h-40 opacity-80 sm:h-56" />
      </motion.div>
      <Skyline fill="#f8f3e8" className="absolute -bottom-px h-32 sm:h-44" />
    </section>
  )
}

/* ---------------- 3 key facts: clear for everyone ---------------- */
export function KeyFacts() {
  const facts = [
    { icon: Icon.cal, label: 'Qachon?', value: dateStr, sub: `${WEEKDAYS[D.getDay()]}, ${D.getFullYear()}` },
    { icon: Icon.clock, label: 'Soat nechada?', value: timeStr, sub: 'Mehmonlarni kutib olish' },
    { icon: Icon.pin, label: 'Qayerda?', value: `«${WEDDING.venue}»`, sub: "Restoran · xaritani ko'rish →", href: '#manzil' },
  ]
  return (
    <section className="relative z-10 -mt-6 px-5">
      <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
        {facts.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.1}>
            <a href={f.href} className="paper flex items-center gap-4 rounded-3xl p-5 sm:flex-col sm:text-center">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-lapis text-gold-light shadow-lg shadow-lapis/30">{f.icon}</span>
              <span>
                <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-turq-dark">{f.label}</span>
                <span className="block font-serif text-2xl text-lapis">{f.value}</span>
                <span className="block font-sans text-[13px] text-ink/55">{f.sub}</span>
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------- INVITATION TEXT ---------------- */
export function Invitation() {
  return (
    <section id="taklif" className="relative px-5 pb-10 pt-20">
      <Reveal className="mx-auto max-w-xl">
        <div className="paper relative overflow-hidden rounded-[32px]">
          <TileBand />
          <div className="relative px-7 py-12 text-center sm:px-12">
            <Pattern opacity={0.05} />
            <p className="relative font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Assalomu alaykum</p>
            <h2 className="relative mt-2 font-serif text-4xl text-lapis">Aziz mehmonlar!</h2>
            <Divider className="relative my-6" />
            <p className="relative font-sans text-[17px] leading-[1.8] text-ink/80">
              Alloh taoloning izni va marhamati bilan farzandlarimiz{' '}
              <b className="font-serif text-xl font-normal text-lapis">{WEDDING.groom}</b> va{' '}
              <b className="font-serif text-xl font-normal text-lapis">{WEDDING.bride}</b>ning nikoh to'yi bo'lib o'tadi.
            </p>
            <p className="relative mt-4 font-sans text-[17px] leading-[1.8] text-ink/80">
              Sizni oilangiz bilan ushbu quvonchli kunimizga lutfan taklif etamiz. Tashrifingiz biz uchun katta sharafdir.
            </p>
          </div>
          <TileBand />
        </div>
      </Reveal>
    </section>
  )
}

/* ---------------- VERSE (night band) ---------------- */
export function Verse() {
  return (
    <section className="night-bg relative my-14 overflow-hidden px-5 py-20 text-center text-pearl">
      <Stars count={40} seed={3} />
      <Fireflies count={10} />
      <Reveal className="relative mx-auto max-w-xl">
        <Crescent size={30} className="mx-auto text-gold-light" />
        <p dir="rtl" className="relative mt-6 font-arabic text-2xl leading-[2.1] text-gold-light sm:text-3xl">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </p>
        <motion.p
          className="mx-auto mt-6 max-w-md font-italic text-xl italic leading-relaxed text-pearl/85"
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }}
        >
          {"«U zotning belgilaridan biri — sizlar uchun o'zlaringizdan juftlar yaratgani, toki ular bilan orom topgaysiz. Va o'rtalaringizda mehr-muhabbat va rahmat paydo qildi.»"
            .split(' ')
            .map((w, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{ hide: { opacity: 0, y: 12, filter: 'blur(6px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } } }}
              >
                {w}&nbsp;
              </motion.span>
            ))}
        </motion.p>
        <p className="mt-4 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-turq">Rum surasi · 21-oyat</p>
      </Reveal>
    </section>
  )
}

/* ---------------- COUNTDOWN ---------------- */
function useCountdown(target) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, target - now)
  return {
    done: diff === 0,
    parts: [
      [Math.floor(diff / 864e5), 'kun'],
      [Math.floor(diff / 36e5) % 24, 'soat'],
      [Math.floor(diff / 6e4) % 60, 'daqiqa'],
      [Math.floor(diff / 1e3) % 60, 'soniya'],
    ],
  }
}

export function Countdown() {
  const { parts, done } = useCountdown(D.getTime())
  const end = new Date(D.getTime() + 4 * 36e5)
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${WEDDING.groom} va ${WEDDING.bride} nikoh to'yi`)}&dates=${fmt(D)}/${fmt(end)}&location=${encodeURIComponent(`${WEDDING.venue} ${WEDDING.venueType}`)}`

  return (
    <section className="relative px-5 py-14">
      <SectionTitle eyebrow={`${WEEKDAYS[D.getDay()]}, ${dateStr}, soat ${timeStr}`} title={done ? 'Bugun — muborak kun!' : "To'ygacha qoldi"} />
      <Reveal className="mx-auto grid max-w-lg grid-cols-4 gap-2.5 sm:gap-4">
        {parts.map(([v, l]) => (
          <div key={l} className="relative overflow-hidden rounded-3xl bg-lapis py-5 text-center shadow-xl shadow-lapis/25">
            <Pattern color="#3cc7c0" opacity={0.12} size={30} />
            <div className="relative h-9 overflow-hidden font-serif text-3xl leading-9 text-gold-light [perspective:300px] sm:h-14 sm:text-5xl sm:leading-[3.5rem]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={v}
                  className="block"
                  initial={{ y: '-100%', rotateX: 80, opacity: 0 }}
                  animate={{ y: '0%', rotateX: 0, opacity: 1 }}
                  exit={{ y: '100%', rotateX: -80, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                >
                  {pad(v)}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="relative mt-1 font-sans text-[11px] font-semibold text-pearl/70">{l}</div>
          </div>
        ))}
      </Reveal>
      <Reveal className="mt-8 text-center">
        <a href={gcal} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-lapis/15 bg-white px-6 py-3 font-sans text-sm font-bold text-lapis transition hover:border-lapis">
          {Icon.cal} Telefon taqvimiga qo'shish
        </a>
      </Reveal>
    </section>
  )
}

/* ---------------- VENUE ---------------- */
export function Venue() {
  const q = encodeURIComponent(WEDDING.mapQuery)
  return (
    <section id="manzil" className="relative px-5 py-14">
      <SectionTitle eyebrow="Manzil" title="To'y qayerda bo'ladi?" />
      <Reveal className="mx-auto max-w-md">
        <div className="paper relative overflow-hidden rounded-[32px]">
          <div className="night-bg relative h-44 overflow-hidden">
            <Stars count={25} seed={11} />
            <Skyline fill="#f8f3e8" className="absolute -bottom-px h-28" />
          </div>
          <div className="relative px-7 pb-9 pt-2 text-center">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-turq-dark">To'yxona</p>
            <h3 className="mt-1 font-serif text-5xl text-lapis">«{WEDDING.venue}»</h3>
            <p className="mt-3 flex items-center justify-center gap-1.5 font-sans text-[15px] text-ink/65">
              {Icon.pin}
              {WEDDING.address}
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href={`https://yandex.uz/maps/?text=${q}`} target="_blank" rel="noreferrer" className="rounded-2xl bg-lapis px-5 py-4 font-sans text-sm font-bold text-pearl transition hover:bg-lapis-2">
                Yandex xaritada ochish
              </a>
              <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noreferrer" className="rounded-2xl border-2 border-lapis/15 px-5 py-4 font-sans text-sm font-bold text-lapis transition hover:border-lapis">
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  return (
    <footer className="night-bg relative overflow-hidden px-5 pb-32 pt-24 text-center text-pearl">
      <Stars count={50} seed={5} />
      <Fireflies count={10} />
      <Flock birds={[{ top: 32, size: 26, dur: 36, delay: 0, rise: -12, flap: 0.5 }, { top: 40, size: 20, dur: 40, delay: 2, rise: -10, flap: 0.46 }]} />
      <Skyline fill="#f8f3e8" className="absolute -top-px left-0 h-24 rotate-180" />
      <Reveal className="relative mx-auto max-w-lg">
        <Star8 size={36} className="spin-slow mx-auto text-gold-light" />
        <p dir="rtl" className="mt-6 font-arabic text-2xl leading-loose text-gold-light sm:text-3xl">
          بَارَكَ ٱللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </p>
        <p className="mt-4 font-italic text-xl italic text-pearl/80">
          «Alloh sizlarga baraka bersin, ustingizga baraka yog'dirsin va ikkingizni yaxshilikda jamlasin»
        </p>
        <Divider light className="my-10" />
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-turq">Hurmat bilan</p>
        <p className="mt-2 font-script text-5xl text-gold-light">{WEDDING.hosts}</p>
      </Reveal>
    </footer>
  )
}
