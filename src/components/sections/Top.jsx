// Yuqori bo'limlar: ismlar → oyat → hadis → tungi masjid sahnasi → "Hurmat bilan"
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { WEDDING, img } from '../../config'
import { Card, Divider, Slot, Sparkle } from '../ui'
import './top.css'

const EASE = [0.22, 0.7, 0.2, 1]
const VIEW = { once: true, margin: '0px 0px -8% 0px' }

// Barqaror tasodifiy sonlar (har renderda bir xil yulduzlar)
function rng(seed) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

// ketma-ket paydo bo'lish
const stagger = (gap = 0.15, delay = 0) => ({ hide: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } })
const up = { hide: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }

// Nozik girih (8 qirrali yulduz) naqshi — fon uchun
function Girih({ id, opacity = 0.07, className = '', size = 46 }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#B8964A" strokeWidth="0.7" transform={`scale(${size / 46})`}>
            <rect x="13" y="13" width="20" height="20" />
            <rect x="13" y="13" width="20" height="20" transform="rotate(45 23 23)" />
            <circle cx="23" cy="23" r="4" />
            <path d="M0 0L9 9M46 0L37 9M0 46L9 37M46 46L37 37M23 0V8.9M23 46V37.1M0 23H8.9M46 23H37.1" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  )
}

/* ============================== 4. ISMLAR ============================== */
export function Names() {
  return (
    <section
      id="ismlar"
      className="relative overflow-hidden text-center"
      style={{ background: 'linear-gradient(180deg,#F6F3EA,#FBF8EF)', padding: '56px 16px 40px' }}
    >
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 45%, #000 0%, transparent 75%)',
        }}
      >
        <Girih id="tp-girih-names" opacity={0.08} />
      </div>

      <motion.div className="relative" variants={stagger(0.15)} initial="hide" whileInView="show" viewport={VIEW}>
        <motion.p variants={up} dir="rtl" lang="ar" className="tp-bismillah text-[27px] leading-[1.6]">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </motion.p>
        <motion.div variants={up} className="mt-2 flex items-center justify-center gap-2" aria-hidden="true">
          <Sparkle size={7} color="#D2B672" />
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M15 3a9 9 0 1 0 6 15.8A10 10 0 0 1 15 3Z" fill="#C9A85A" /></svg>
          <Sparkle size={7} color="#D2B672" />
        </motion.div>

        <motion.p variants={up} className="mt-5 font-serif text-[21px] italic leading-none text-[#857858]">
          Assalomu alaykum
        </motion.p>
        <motion.p variants={up} className="mt-[10px] font-serif text-[15px] font-medium uppercase tracking-[0.2em] text-ink-label">
          Aziz mehmonlar!
        </motion.p>

        <motion.h2
          variants={{ hide: { opacity: 0, y: 16, color: '#8FB5A0' }, show: { opacity: 1, y: 0, color: '#1F5A35', transition: { duration: 0.7, ease: EASE } } }}
          className="mt-[22px] font-script text-[63px] leading-none"
        >
          {WEDDING.groom}
        </motion.h2>

        <motion.div variants={up} className="flex h-[28px] items-center justify-center gap-3" aria-label="va">
          <span className="h-px w-[120px]" style={{ background: 'linear-gradient(90deg,transparent,#D8C48A)' }} />
          <span className="font-serif text-[16px] italic text-[#857858]">va</span>
          <span className="h-px w-[120px]" style={{ background: 'linear-gradient(270deg,transparent,#D8C48A)' }} />
        </motion.div>

        <motion.h2
          variants={{ hide: { opacity: 0, y: 16, color: '#8FB5A0' }, show: { opacity: 1, y: 0, color: '#1F5A35', transition: { duration: 0.7, ease: EASE } } }}
          className="font-script text-[63px] leading-none"
        >
          {WEDDING.bride}
        </motion.h2>

        {/* oltin hilol-yulduz ajratgich (rasm) */}
        <motion.div variants={up} className="tp-gdiv mx-auto mt-[18px]" aria-hidden="true">
          {img('gold-divider') ? <img src={img('gold-divider')} alt="" decoding="async" draggable="false" /> : <Divider kind="medal" w={95} />}
        </motion.div>

        <motion.p variants={up} className="mx-auto mt-[14px] max-w-[340px] font-serif text-[19px] leading-[1.65] text-[#5E544C]">
          Alloh taoloning izni va marhamati bilan farzandlarimiz{' '}
          <span className="font-semibold text-emerald-ink">{WEDDING.groom}</span> va{' '}
          <span className="font-semibold text-emerald-ink">{WEDDING.bride}</span>ning nikoh to'yi bo'lib o'tadi.
        </motion.p>
        <motion.p variants={up} className="mx-auto mt-3 max-w-[340px] font-serif text-[18px] italic leading-[1.65] text-ink-quote">
          Sizni oilangiz bilan ushbu quvonchli kunimizga lutfan taklif etamiz. Tashrifingiz biz uchun katta sharafdir.
        </motion.p>
      </motion.div>
    </section>
  )
}

/* ============================== 5. OYAT ============================== */

// Ochiq Qur'on, yostiq va zumrad tasbeh — rasm bo'lmaganda chiziladi
function QuranPillow() {
  // tasbeh munchoqlari egri chiziq bo'ylab
  const bez = (p0, p1, p2, p3, t) => {
    const u = 1 - t
    return [
      u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
    ]
  }
  const beads = []
  for (let i = 0; i < 22; i++) beads.push(bez([150, 26], [176, 34], [188, 92], [172, 128], i / 21))
  for (let i = 1; i < 12; i++) beads.push(bez([172, 128], [168, 146], [196, 146], [214, 140], i / 11))
  const petals = [[34, 30, 20], [52, 14, -30], [222, 22, 40], [240, 52, 10], [16, 70, -50], [206, 6, 70], [92, 6, 15], [248, 96, -20], [10, 120, 30], [60, 154, 60]]

  return (
    <svg viewBox="0 0 258 160" className="mx-auto block h-[160px] w-[258px]" role="img" aria-label="Ochiq Qur'oni Karim va tasbeh">
      <defs>
        <radialGradient id="tp-pil" cx="45%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFFBF4" />
          <stop offset=".6" stopColor="#F5E6DA" />
          <stop offset="1" stopColor="#E3C6B6" />
        </radialGradient>
        <linearGradient id="tp-page" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFCF2" />
          <stop offset="1" stopColor="#F1E4C7" />
        </linearGradient>
        <linearGradient id="tp-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9D290" />
          <stop offset=".5" stopColor="#B8964A" />
          <stop offset="1" stopColor="#D9BC72" />
        </linearGradient>
        <radialGradient id="tp-bead" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#6FBF8A" />
          <stop offset=".45" stopColor="#1F6B40" />
          <stop offset="1" stopColor="#0E3A22" />
        </radialGradient>
        <radialGradient id="tp-shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#8B6F4E" stopOpacity=".28" />
          <stop offset="1" stopColor="#8B6F4E" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="128" cy="150" rx="118" ry="11" fill="url(#tp-shadow)" />

      {/* yostiq: pastki qizil qatlam + tugmali ipak */}
      <path d="M28 118C46 142 88 154 128 154 170 154 212 142 230 118 218 150 172 158 128 158 82 158 40 150 28 118Z" fill="#9B2747" />
      <path d="M22 108C20 84 60 64 128 64 196 64 238 84 236 108 238 130 200 148 128 148 56 148 20 130 22 108Z" fill="url(#tp-pil)" stroke="#E2C9B5" strokeWidth=".8" />
      <g stroke="#DDBFAE" strokeWidth=".8" fill="none" opacity=".9">
        <path d="M60 96C70 104 70 116 62 128M196 96C186 104 186 116 194 128M98 128C110 122 146 122 158 128M40 104C52 100 62 100 72 104M184 104C196 100 206 100 218 104" />
      </g>
      {[[70, 112], [128, 126], [186, 112], [100, 140], [156, 140]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill="#E8D2C2" stroke="#D2B19E" strokeWidth=".6" />
      ))}
      {/* burchak popuklari */}
      <g fill="url(#tp-gold)">
        <path d="M22 108l-9 6 4 1-3 6 9-8z" />
        <path d="M236 108l9 6-4 1 3 6-9-8z" />
      </g>

      {/* Qur'on: muqova, varaqlar, oltin bezak */}
      <path d="M128 92C106 78 80 76 54 82L60 26C86 18 110 20 130 30 150 20 174 18 200 26L206 82C180 76 152 78 130 92Z" fill="#6B4425" />
      <path d="M128 88C106 76 82 74 58 78L64 26C86 20 110 22 129 32Z" fill="#E9DDBF" />
      <path d="M130 88C152 76 176 74 200 78L194 26C172 20 148 22 131 32Z" fill="#E9DDBF" />
      <path d="M128 84C108 72 86 70 62 74L67 24C88 18 110 20 129 30Z" fill="url(#tp-page)" stroke="#C9A85A" strokeWidth=".6" />
      <path d="M130 84C150 72 172 70 196 74L191 24C170 18 148 20 131 30Z" fill="url(#tp-page)" stroke="#C9A85A" strokeWidth=".6" />
      <g fill="none" stroke="url(#tp-gold)" strokeWidth="1.1">
        <path d="M124 76C108 68 90 66 72 68L76 30C92 26 110 28 124 35Z" />
        <path d="M134 76C150 68 168 66 186 68L182 30C166 26 148 28 134 35Z" />
      </g>
      {/* lavha (zarhal oval) */}
      <ellipse cx="99" cy="50" rx="16" ry="13" fill="#F4E6C2" stroke="url(#tp-gold)" strokeWidth="1.2" transform="rotate(-6 99 50)" />
      <ellipse cx="159" cy="50" rx="16" ry="13" fill="#F4E6C2" stroke="url(#tp-gold)" strokeWidth="1.2" transform="rotate(6 159 50)" />
      <g fill="#C9A85A">
        <circle cx="99" cy="50" r="5" opacity=".55" />
        <circle cx="159" cy="50" r="5" opacity=".55" />
      </g>
      <g stroke="#B8964A" strokeWidth=".5" opacity=".55">
        <path d="M84 64h30M86 68h28M146 64h30M148 68h28" />
      </g>
      <path d="M129 31L129 86" stroke="#B89C6A" strokeWidth=".8" />

      {/* tasbeh */}
      {beads.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i % 11 === 10 ? 2.6 : 3.7} fill={i % 11 === 10 ? '#C9A85A' : 'url(#tp-bead)'} />
          {i % 11 !== 10 && <circle cx={x - 1.1} cy={y - 1.2} r=".9" fill="#E6F5EA" className="tp-shine" style={{ animationDelay: `${i * 0.12}s` }} />}
        </g>
      ))}
      <g stroke="#1F6B40" strokeWidth="1.1" strokeLinecap="round">
        <path d="M216 139l14 6M216 140l12 9M216 140l15 3M216 139l10 11" />
      </g>
      <circle cx="216" cy="139.5" r="3" fill="url(#tp-gold)" />

      {/* gulbarglar */}
      {petals.map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.2" ry="1.7" fill={i % 2 ? '#EFB3A2' : '#F4C8BA'} transform={`rotate(${r} ${x} ${y})`} opacity=".85" />
      ))}
    </svg>
  )
}

const PETALS = [
  { l: '8%', dur: 14, delay: 0, dx: 50 },
  { l: '22%', dur: 17, delay: 4, dx: 30 },
  { l: '38%', dur: 15, delay: 8, dx: 60 },
  { l: '55%', dur: 18, delay: 2, dx: -30 },
  { l: '70%', dur: 13, delay: 6, dx: 40 },
  { l: '86%', dur: 16, delay: 10, dx: -40 },
  { l: '47%', dur: 19, delay: 12, dx: 20 },
]

function Petals() {
  return (
    <div className="tp-petals" aria-hidden="true">
      {PETALS.map((p, i) => (
        <span key={i} className="tp-petal" style={{ left: p.l, '--dur': `${p.dur}s`, '--delay': `${p.delay}s`, '--dx': `${p.dx}px` }} />
      ))}
    </div>
  )
}

const Quote = ({ close }) => (
  <span aria-hidden="true" className="block font-serif text-[30px] font-semibold leading-[0.6] text-[#B8964A]">
    {close ? '”' : '“'}
  </span>
)

export function Ayah() {
  return (
    <section
      id="oyat"
      className="relative overflow-hidden text-center"
      style={{ background: 'linear-gradient(180deg,#FBF8EF,#F5F1E6)', padding: '40px 16px 60px' }}
    >
      <Petals />
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Slot src={img('quran-pillow')} alt="Qur'oni Karim" className="mx-auto h-[160px] w-[258px]" imgClassName="object-contain" fallback={<QuranPillow />} />
      </motion.div>

      <motion.div className="relative mx-auto max-w-[360px]" variants={stagger(0.22, 0.15)} initial="hide" whileInView="show" viewport={VIEW}>
        <motion.div variants={up} className="mt-6 flex items-center justify-center gap-2" aria-hidden="true">
          <span className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,#D2B672)' }} />
          <Sparkle size={9} color="#C9A85A" />
          <span className="h-px w-10" style={{ background: 'linear-gradient(270deg,transparent,#D2B672)' }} />
        </motion.div>
        <motion.p variants={up} dir="rtl" lang="ar" className="mt-4 font-arabic text-[23px] leading-[1.9] text-[#8E7234]">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </motion.p>
        <motion.p variants={up} className="mt-4 font-serif text-[19px] italic leading-[1.7] text-ink-quote">
          «U zotning belgilaridan biri — sizlar uchun o'zlaringizdan juftlar yaratgani, toki ular bilan orom topgaysiz. Va o'rtalaringizda mehr-muhabbat va rahmat paydo qildi.»
        </motion.p>
        <motion.p variants={up} className="mt-[16px] font-caps text-[14px] font-medium uppercase tracking-[0.11em] text-[#76663E]">
          Rum surasi · 21-oyat
        </motion.p>
        <motion.div variants={up} className="mt-[14px] flex justify-center" aria-hidden="true">
          <Sparkle size={7} color="#D2B672" />
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ============================== 8. HADIS ============================== */
export function Hadith() {
  return (
    <section id="hadis" className="relative bg-ivory" style={{ padding: '30px 16px' }}>
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={VIEW}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <Card sparkles="dots" innerClassName="overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 0%, transparent 70%)',
              maskImage: 'radial-gradient(circle at 50% 50%, #000 0%, transparent 70%)',
            }}
          >
            <Girih id="tp-girih-hadith" opacity={0.07} size={40} />
          </div>
          <div className="relative px-8 pb-9 pt-10 text-center">
            <Quote />
            <p className="mx-auto mt-[14px] max-w-[310px] font-serif text-[19px] italic leading-[1.7] text-[#3F3D38]">
              Nikoh mening sunnatimdandir. Kim mening sunnatimga amal qilmasa, u mendan emas.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg,transparent,#A9C3B2)' }} />
              <p className="font-caps text-[14px] font-medium uppercase tracking-[0.13em] text-[#4C7360]">Hadisi sharif</p>
              <span className="h-px w-8" style={{ background: 'linear-gradient(270deg,transparent,#A9C3B2)' }} />
            </div>
            <p className="mt-1 font-serif text-[15px] italic text-[#857858]">Imom Ibn Moja rivoyati</p>
            <div className="mt-3">
              <Quote close />
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  )
}

/* ============================== 9. TUNGI MASJID SAHNASI ============================== */

const W = 416
const H = 736

// Osmon: tun → binafsha → shafaq, yulduzlar, hilol
function SkyArt() {
  const r = rng(7)
  const stars = Array.from({ length: 70 }, (_, i) => ({
    x: 20 + r() * 376,
    y: 70 + Math.pow(r(), 1.4) * 360,
    s: 0.5 + r() * 1.3,
    tw: i % 3 === 0,
    d: 2 + r() * 2.5,
    delay: r() * 3,
  }))
  const big = [[300, 120], [352, 210], [252, 270], [70, 300], [330, 330], [180, 110]]
  const trail = Array.from({ length: 16 }, (_, i) => [312 - i * 5.5 + Math.sin(i * 0.9) * 3, 236 + i * 9])

  return (
    <svg viewBox={`0 0 ${W} ${H + 120}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C2034" />
          <stop offset=".25" stopColor="#2A2D3E" />
          <stop offset=".42" stopColor="#3D3E5A" />
          <stop offset=".55" stopColor="#544A6C" />
          <stop offset=".66" stopColor="#8A6079" />
          <stop offset=".76" stopColor="#D18A6C" />
          <stop offset=".86" stopColor="#E9A57B" />
          <stop offset="1" stopColor="#F3D2AE" />
        </linearGradient>
        <radialGradient id="tp-moonglow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity=".42" />
          <stop offset=".38" stopColor="#F2CF7A" stopOpacity=".16" />
          <stop offset="1" stopColor="#E6C46E" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tp-moon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF0B8" />
          <stop offset=".45" stopColor="#E8C46A" />
          <stop offset="1" stopColor="#B88A36" />
        </linearGradient>
        <mask id="tp-crescent">
          <circle cx="118" cy="190" r="52" fill="#fff" />
          <circle cx="142" cy="172" r="45" fill="#000" />
        </mask>
        <radialGradient id="tp-dusk" cx="50%" cy="100%" r="70%">
          <stop offset="0" stopColor="#FFC98A" stopOpacity=".75" />
          <stop offset="1" stopColor="#FFC98A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H + 120} fill="url(#tp-sky)" />
      <ellipse cx="208" cy="640" rx="300" ry="190" fill="url(#tp-dusk)" />

      {/* yulduzlar */}
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.s}
          fill="#F6E6B4"
          className={s.tw ? 'tp-tw' : undefined}
          style={s.tw ? { '--d': `${s.d}s`, '--delay': `${s.delay}s` } : { opacity: 0.75 }}
        />
      ))}
      {big.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 7}C${x + .8} ${y - 1.5} ${x + 1.5} ${y - .8} ${x + 7} ${y} ${x + 1.5} ${y + .8} ${x + .8} ${y + 1.5} ${x} ${y + 7} ${x - .8} ${y + 1.5} ${x - 1.5} ${y + .8} ${x - 7} ${y} ${x - 1.5} ${y - .8} ${x - .8} ${y - 1.5} ${x} ${y - 7}Z`}
          fill="#F3DC98"
          className="tp-tw"
          style={{ '--d': `${2.6 + i * 0.4}s`, '--delay': `${i * 0.5}s` }}
        />
      ))}
      {/* yulduz izi */}
      {trail.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.4 - i * 0.06} fill="#F3DC98" opacity={0.9 - i * 0.045} />
      ))}

      {/* hilol */}
      <g transform="translate(16 72)">
      <circle cx="104" cy="200" r="88" fill="url(#tp-moonglow)" className="tp-glow" />
      <g mask="url(#tp-crescent)">
        <circle cx="118" cy="190" r="52" fill="url(#tp-moon)" />
        <g fill="none" stroke="#C99A44" strokeWidth=".7" opacity=".55">
          <path d="M80 170c8 4 10 12 6 18M76 200c6 2 9 8 7 14M92 226c6-1 11 3 12 8M84 150c5 0 8 4 8 8" />
          <circle cx="78" cy="186" r="3" />
          <circle cx="96" cy="214" r="2.2" />
        </g>
      </g>
      <path d="M118 138a52 52 0 1 0 51.5 59" fill="none" stroke="#FFF3C4" strokeWidth=".8" opacity=".5" />
      </g>

      {/* binafsha bulutlar */}
      <g className="tp-drift">
        <Cloud x={-20} y={420} s={1.25} c="#6A5A80" lit="#B48A9C" />
        <Cloud x={250} y={392} s={1.05} c="#5E5378" lit="#A88199" />
      </g>
      <g className="tp-drift-r">
        <Cloud x={110} y={478} s={1.35} c="#8A6683" lit="#E0A385" />
        <Cloud x={-60} y={530} s={1.2} c="#A77283" lit="#F0B38E" />
        <Cloud x={280} y={520} s={1.15} c="#A06F84" lit="#EDAE8A" />
      </g>
    </svg>
  )
}

function Cloud({ x, y, s = 1, c, lit }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity=".72">
      <path d="M0 40C-4 24 14 14 28 20 32 4 58 -2 70 12 80 0 108 2 112 22 128 18 146 28 142 42Z" fill={c} />
      <path d="M2 42C18 34 34 36 44 40 60 32 84 34 96 40 112 34 132 36 142 42Z" fill={lit} opacity=".7" />
    </g>
  )
}

// Masjid: markaziy gumbaz, 4 minora, nurli eshiklar, sarvlar
function Minaret({ x, top, base = 640, w = 11 }) {
  const h = base - top
  return (
    <g>
      <path d={`M${x - w / 2} ${base}L${x - w / 2 + 1} ${top + 26}L${x + w / 2 - 1} ${top + 26}L${x + w / 2} ${base}Z`} fill="url(#tp-stone)" />
      <path d={`M${x + w / 2 - 2.5} ${base}L${x + w / 2 - 3} ${top + 26}L${x + w / 2 - 1} ${top + 26}L${x + w / 2} ${base}Z`} fill="#E9B46E" opacity=".35" />
      {/* balkonlar */}
      {[top + 26, top + 26 + h * 0.32].map((y, i) => (
        <g key={i}>
          <rect x={x - w / 2 - 3} y={y} width={w + 6} height="3" rx="1" fill="#E8C47A" />
          <rect x={x - w / 2 + 1} y={y + 4} width={w - 2} height="5" fill="#FFD989" opacity=".85" className="tp-glow" />
        </g>
      ))}
      {/* konus va hilol */}
      <path d={`M${x - w / 2 + 1} ${top + 26}L${x} ${top}L${x + w / 2 - 1} ${top + 26}Z`} fill="#3A3A5C" stroke="#D8B56A" strokeWidth=".6" />
      <line x1={x} y1={top} x2={x} y2={top - 7} stroke="#E3C277" strokeWidth="1" />
      <path d={`M${x + 2.6} ${top - 13}a3.4 3.4 0 1 0 0 5.8 2.8 2.8 0 1 1 0-5.8Z`} fill="#F0D184" />
    </g>
  )
}

function Cypress({ x, y = 660, h = 70, w = 12 }) {
  return <path d={`M${x} ${y - h}C${x + w * 0.7} ${y - h * 0.6} ${x + w * 0.6} ${y - h * 0.15} ${x + w * 0.35} ${y}L${x - w * 0.35} ${y}C${x - w * 0.6} ${y - h * 0.15} ${x - w * 0.7} ${y - h * 0.6} ${x} ${y - h}Z`} fill="#1F2A2E" />
}

function MosqueArt() {
  const arches = [112, 140, 168, 248, 276, 304]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tp-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4A4870" />
          <stop offset="1" stopColor="#2C2B45" />
        </linearGradient>
        <linearGradient id="tp-dome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2E3256" />
          <stop offset=".55" stopColor="#4B5487" />
          <stop offset=".85" stopColor="#8E86A8" />
          <stop offset="1" stopColor="#E5B47C" />
        </linearGradient>
        <radialGradient id="tp-door" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#FFF0BF" />
          <stop offset=".6" stopColor="#FFC66B" />
          <stop offset="1" stopColor="#E08A3E" />
        </radialGradient>
        <radialGradient id="tp-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFC878" stopOpacity=".55" />
          <stop offset="1" stopColor="#FFC878" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="208" cy="610" rx="190" ry="90" fill="url(#tp-halo)" className="tp-glow" />

      <Minaret x={58} top={470} />
      <Minaret x={358} top={470} />
      <Minaret x={104} top={400} w={12} />
      <Minaret x={312} top={400} w={12} />

      {/* yon gumbazlar */}
      <path d="M118 586C118 562 134 548 150 540 166 548 182 562 182 586Z" fill="url(#tp-dome)" />
      <path d="M234 586C234 562 250 548 266 540 282 548 298 562 298 586Z" fill="url(#tp-dome)" />
      <line x1="150" y1="540" x2="150" y2="528" stroke="#E3C277" />
      <line x1="266" y1="540" x2="266" y2="528" stroke="#E3C277" />

      {/* markaziy gumbaz */}
      <rect x="146" y="552" width="124" height="40" fill="url(#tp-stone)" />
      {[160, 178, 196, 214, 232, 250].map((x) => (
        <path key={x} d={`M${x} 588V572a4 4 0 0 1 8 0V588Z`} fill="#FFD27E" opacity=".9" />
      ))}
      <rect x="146" y="552" width="124" height="2.5" fill="#E8C47A" />
      <path d="M150 552C150 498 182 474 208 456 234 474 266 498 266 552Z" fill="url(#tp-dome)" />
      <path d="M208 456C234 474 266 498 266 552H258C258 506 232 480 208 456Z" fill="#F2BE84" opacity=".35" />
      <g fill="none" stroke="#D9B76A" strokeWidth=".7" opacity=".7">
        <path d="M168 552C170 512 188 488 208 470M248 552C246 512 228 488 208 470M208 470V552" />
        <path d="M152 540H264" />
      </g>
      <line x1="208" y1="456" x2="208" y2="436" stroke="#E3C277" strokeWidth="1.4" />
      <circle cx="208" cy="438" r="2.4" fill="#F0D184" />
      <path d="M212 418a6 6 0 1 0 0 10 5 5 0 1 1 0-10Z" fill="#F0D184" />

      {/* asosiy bino va ravoqlar */}
      <rect x="84" y="590" width="248" height="70" fill="url(#tp-stone)" />
      <rect x="84" y="590" width="248" height="3" fill="#E8C47A" />
      {arches.map((x) => (
        <path key={x} d={`M${x - 8} 640V614C${x - 8} 606 ${x} 600 ${x} 600 ${x} 600 ${x + 8} 606 ${x + 8} 614V640Z`} fill="url(#tp-door)" opacity=".9" />
      ))}
      {/* bosh eshik (nurli ravoq) */}
      <path d="M190 660V618C190 604 208 592 208 592 208 592 226 604 226 618V660Z" fill="url(#tp-door)" />
      <path d="M184 660V616C184 598 208 584 208 584 208 584 232 598 232 616V660" fill="none" stroke="#E8C47A" strokeWidth="1.2" />
      <path d="M201 592l7-8 7 8" fill="none" stroke="#E8C47A" strokeWidth=".8" />

      {/* sarvlar */}
      <Cypress x={22} h={96} w={14} />
      <Cypress x={40} h={70} />
      <Cypress x={80} h={84} w={13} />
      <Cypress x={336} h={84} w={13} />
      <Cypress x={376} h={70} />
      <Cypress x={396} h={96} w={14} />
      <Cypress x={132} h={52} w={10} />
      <Cypress x={284} h={52} w={10} />

      {/* yer */}
      <path d="M0 656C80 648 140 652 208 650 280 648 340 650 416 656V736H0Z" fill="#2A2638" />
      <path d="M150 658H266L300 736H116Z" fill="#E7B474" opacity=".22" />
    </svg>
  )
}

// Old qatlam: shafaqdagi tuman/bulut
function MistArt() {
  return (
    <svg viewBox={`0 0 ${W} 200`} preserveAspectRatio="none" className="absolute bottom-0 left-0 h-[170px] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tp-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E2CF" stopOpacity="0" />
          <stop offset=".45" stopColor="#F3DCC6" stopOpacity=".55" />
          <stop offset="1" stopColor="#F6F3EA" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M0 70C40 50 80 64 110 56 150 40 190 62 230 52 270 42 310 60 350 50 380 44 400 52 416 58V200H0Z" fill="url(#tp-mist)" />
    </svg>
  )
}

// Ustki mehrob-arka ramka (fil suyagi, oltin chiziq, anor va novdalar)
const ARCH = 'M16 340V232C16 204 34 188 56 180 64 152 92 130 122 120 152 108 178 86 194 54 200 40 205 28 208 14 211 28 216 40 222 54 238 86 264 108 294 120 324 130 352 152 360 180 382 188 400 204 400 232V340'

function Pomegranate({ x, y, flip }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g fill="none" stroke="#C5A35B" strokeWidth="1.1" strokeLinecap="round">
        <path d="M0 0C18 -6 30 4 44 0 58 -4 64 10 78 8" />
        <path d="M30 2C34 14 46 18 54 14M14 -4C10 -14 18 -22 26 -18M60 6c4 10 14 12 20 6" />
        <path d="M-6 12C-14 30 -4 46 10 54M2 24c-8 2-12 10-8 16" />
        <circle cx="26" cy="-18" r="2" />
        <circle cx="80" cy="12" r="1.8" />
      </g>
      <g fill="#7E9A72">
        <path d="M40 -2c6-8 14-8 18-6-4 6-10 8-18 6Z" />
        <path d="M4 20c-6-6-6-14-4-18 6 4 8 10 4 18Z" />
        <path d="M66 10c6-4 12-2 14 0-4 4-10 4-14 0Z" />
      </g>
      <circle cx="22" cy="22" r="13" fill="url(#tp-pom)" />
      <path d="M17 10l2 -5 3 4 3 -4 2 5Z" fill="#8E2F3A" />
      <path d="M14 18a9 9 0 0 1 8-6" stroke="#F3B5A6" strokeWidth="1.4" fill="none" opacity=".7" strokeLinecap="round" />
    </g>
  )
}

function ArchFrameArt() {
  return (
    <svg viewBox={`0 0 ${W} 360`} className="absolute left-0 top-0 h-[360px] w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tp-ivory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6F3EA" />
          <stop offset="1" stopColor="#EFE2CC" />
        </linearGradient>
        <radialGradient id="tp-pom" cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#E8838A" />
          <stop offset=".6" stopColor="#B33F4E" />
          <stop offset="1" stopColor="#6E1E2C" />
        </radialGradient>
        <linearGradient id="tp-fadeSides" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".72" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="tp-archmask">
          <rect width={W} height="360" fill="url(#tp-fadeSides)" />
        </mask>
      </defs>
      <g mask="url(#tp-archmask)">
        <path d={`M0 0H${W}V340H400V232C400 204 382 188 360 180 352 152 324 130 294 120 264 108 238 86 222 54 216 40 211 28 208 14 205 28 200 40 194 54 178 86 152 108 122 120 92 130 64 152 56 180 34 188 16 204 16 232V340H0Z`} fill="url(#tp-ivory)" />
        <path d={ARCH} fill="none" stroke="#C9A85A" strokeWidth="1.6" />
        <path d={ARCH} fill="none" stroke="#E2CC8E" strokeWidth=".8" transform="translate(208 180) scale(1.035) translate(-208 -180)" />
        <path d={ARCH} fill="none" stroke="#C9A85A" strokeWidth=".6" strokeDasharray="2 4" transform="translate(208 186) scale(1.075) translate(-208 -186)" opacity=".8" />
      </g>
      {/* cho'qqi bezagi */}
      <g transform="translate(208 6)">
        <path d="M0 -2l3 5-3 5-3-5Z" fill="#C9A85A" />
      </g>
      <Pomegranate x={22} y={22} />
      <Pomegranate x={394} y={22} flip />
      {/* tayanch nuqtalaridagi kichik bezak */}
      <g fill="#C9A85A">
        <circle cx="56" cy="180" r="2.2" />
        <circle cx="360" cy="180" r="2.2" />
      </g>
    </svg>
  )
}

export function NightScene() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const skyY = useTransform(scrollYProgress, [0, 1], [-26, 26])
  const cloudY = useTransform(scrollYProgress, [0, 1], [18, -18])

  const sky = img('night-sky-crescent')
  const mosque = img('night-mosque-layer') || img('night-mosque')
  const clouds = img('night-clouds')
  const frame = img('arch-window-frame')
  const real = sky && mosque && frame

  return (
    <motion.section
      ref={ref}
      id="tungi-masjid"
      aria-label="Hilol va masjid"
      className={`relative w-full overflow-hidden ${real ? 'tp-night' : ''}`}
      style={real ? undefined : { height: H, background: '#F6F3EA' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6 }}
    >
      {real ? (
        <>
          {/* 1. osmon + hilol (ravoq ichidan ko'rinadi), sekin parallaks */}
          <motion.div className="tp-n-sky" style={{ y: skyY }}>
            <img src={sky} alt="" decoding="async" draggable="false" />
          </motion.div>

          {/* 2. pushti-oltin bulutlar — osmon va masjid tutashgan joyda suzadi */}
          {clouds && (
            <motion.div className="tp-n-clouds" style={{ y: cloudY }} aria-hidden="true">
              <img className="tp-drift" src={clouds} alt="" decoding="async" draggable="false" />
            </motion.div>
          )}

          {/* 3. oltin nurli masjid — tepasi osmonga, pasti fil suyagi sahifaga singadi */}
          <div className="tp-n-mosque">
            <img src={mosque} alt="Oqshom chog'idagi nurli masjid" decoding="async" draggable="false" />
          </div>

          {/* 4. anor novdali mehrob-ravoq ramka (ochiq qismi shaffof) */}
          <div className="tp-n-frame" aria-hidden="true">
            <img src={frame} alt="" decoding="async" draggable="false" />
          </div>

          <div className="tp-n-fade-top" aria-hidden="true" />
          <div className="tp-n-fade-bottom" aria-hidden="true" />
        </>
      ) : (
        // Rasmlar bo'lmasa — chizilgan (SVG) sahna
        <>
          <motion.div className="absolute inset-x-0" style={{ top: -60, bottom: -60, y: skyY }}>
            <SkyArt />
          </motion.div>
          <MosqueArt />
          <MistArt />
          <ArchFrameArt />
        </>
      )}
    </motion.section>
  )
}

/* ============================== 14. HURMAT BILAN ============================== */

function Rose({ x, y, r = 12, tone = 0 }) {
  const fills = ['url(#tp-rose)', 'url(#tp-rose2)']
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={fills[tone % 2]} />
      <g fill="none" stroke="#D8968A" strokeWidth={Math.max(0.6, r / 16)} strokeLinecap="round" opacity=".8">
        <path d={`M${-r * 0.7} ${r * 0.1}C${-r * 0.6} ${-r * 0.6} ${r * 0.4} ${-r * 0.8} ${r * 0.7} ${-r * 0.1}`} />
        <path d={`M${-r * 0.5} ${r * 0.45}C${-r * 0.2} ${r * 0.8} ${r * 0.5} ${r * 0.6} ${r * 0.6} ${r * 0.2}`} />
        <path d={`M${-r * 0.3} ${-r * 0.1}C${-r * 0.2} ${-r * 0.45} ${r * 0.3} ${-r * 0.4} ${r * 0.3} ${0}C${r * 0.3} ${r * 0.3} ${-r * 0.15} ${r * 0.3} ${-r * 0.1} ${0}`} />
      </g>
    </g>
  )
}

function Leaf({ x, y, a = 0, s = 1, c = '#7E9F86' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d="M0 0C6 -6 18 -6 24 0 18 6 6 6 0 0Z" fill={c} />
      <path d="M1 0H22" stroke="#5F8169" strokeWidth=".5" />
    </g>
  )
}

function Euca({ x, y, a = 0, n = 6, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}>
      <path d={`M0 0C10 ${n * 2} 6 ${n * 6} 4 ${n * 9}`} stroke="#8AA693" strokeWidth=".8" fill="none" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={(i % 2 ? 7 : -1) + i * 0.4} cy={i * 9 + 4} r={4 - i * 0.25} fill="#AFC6B5" opacity=".9" />
      ))}
    </g>
  )
}

// Gulchambar: markaziy guldasta + zumrad lenta, yon tomonlarda atirgul va lentalar
function GarlandArt() {
  return (
    <svg viewBox="0 -24 368 194" className="block h-[194px] w-full" aria-hidden="true">
      <defs>
        <radialGradient id="tp-rose" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFF1EA" />
          <stop offset=".55" stopColor="#F5CFC1" />
          <stop offset="1" stopColor="#E3A897" />
        </radialGradient>
        <radialGradient id="tp-rose2" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFF8F2" />
          <stop offset=".6" stopColor="#F3DCCF" />
          <stop offset="1" stopColor="#DDB6A4" />
        </radialGradient>
        <linearGradient id="tp-ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3C7F55" />
          <stop offset=".5" stopColor="#1F5A35" />
          <stop offset="1" stopColor="#2F7344" />
        </linearGradient>
      </defs>

      {/* yon lentalar */}
      <g fill="none" stroke="url(#tp-ribbon)" strokeWidth="2.4" strokeLinecap="round">
        <path d="M22 30C10 60 34 72 22 98 12 120 30 136 20 156" />
        <path d="M54 40C70 60 52 78 74 92 92 104 80 120 96 126" />
        <path d="M346 30C358 60 334 72 346 98 356 120 338 136 348 156" />
        <path d="M314 40C298 60 316 78 294 92 276 104 288 120 272 126" />
      </g>
      <g fill="none" stroke="#7FB394" strokeWidth=".8" opacity=".7">
        <path d="M22 30C10 60 34 72 22 98 12 120 30 136 20 156" />
        <path d="M346 30C358 60 334 72 346 98 356 120 338 136 348 156" />
      </g>

      {/* chap burchak */}
      <Euca x={8} y={6} a={-20} n={7} />
      <Euca x={70} y={8} a={-50} n={6} s={0.9} />
      <Leaf x={36} y={46} a={70} s={1.1} />
      <Leaf x={60} y={24} a={-10} />
      <Leaf x={4} y={40} a={100} s={0.9} c="#94B29B" />
      <Leaf x={86} y={18} a={10} s={0.8} c="#94B29B" />
      <Rose x={28} y={22} r={17} />
      <Rose x={56} y={12} r={12} tone={1} />
      <Rose x={14} y={52} r={11} tone={1} />
      <Rose x={78} y={32} r={8} />

      {/* o'ng burchak */}
      <Euca x={360} y={6} a={20} n={7} />
      <Euca x={298} y={8} a={50} n={6} s={0.9} />
      <Leaf x={332} y={46} a={110} s={1.1} />
      <Leaf x={308} y={24} a={190} />
      <Leaf x={364} y={40} a={80} s={0.9} c="#94B29B" />
      <Leaf x={282} y={18} a={170} s={0.8} c="#94B29B" />
      <Rose x={340} y={22} r={17} />
      <Rose x={312} y={12} r={12} tone={1} />
      <Rose x={354} y={52} r={11} tone={1} />
      <Rose x={290} y={32} r={8} />

      {/* markaziy guldasta (kartadan 30 px yuqoriga chiqadi) */}
      <g transform="translate(184 0)">
        <Euca x={-30} y={-2} a={-60} n={5} s={0.9} />
        <Euca x={30} y={-2} a={60} n={5} s={0.9} />
        <Leaf x={-6} y={8} a={-140} s={1.1} />
        <Leaf x={6} y={8} a={-40} s={1.1} />
        <Leaf x={-14} y={30} a={160} c="#94B29B" />
        <Leaf x={14} y={30} a={20} c="#94B29B" />
        <Rose x={-16} y={20} r={12} tone={1} />
        <Rose x={16} y={20} r={12} tone={1} />
        <Rose x={0} y={10} r={14} />
        <Rose x={0} y={34} r={11} />
        <circle cx="-26" cy="34" r="2.4" fill="#FFFDF6" stroke="#E5D3BD" strokeWidth=".5" />
        <circle cx="26" cy="34" r="2.4" fill="#FFFDF6" stroke="#E5D3BD" strokeWidth=".5" />
        {/* poyalar */}
        <g stroke="#6F9177" strokeWidth="1.4">
          <path d="M-4 44L-6 70M0 44V72M4 44L6 70" />
        </g>
        {/* zumrad bant */}
        <g fill="url(#tp-ribbon)">
          <path d="M0 56C-10 44 -24 44 -24 54 -24 64 -10 64 0 58Z" />
          <path d="M0 56C10 44 24 44 24 54 24 64 10 64 0 58Z" />
          <path d="M-2 58C-8 74 -16 88 -12 100L-6 94C-6 82 -2 70 1 60Z" />
          <path d="M2 58C8 74 16 88 12 100L6 94C6 82 2 70 -1 60Z" />
        </g>
        <rect x="-4" y="52" width="8" height="9" rx="2" fill="#174A2C" />
        <path d="M-20 52C-14 49 -8 51 -3 55M20 52C14 49 8 51 3 55" stroke="#7FB394" strokeWidth=".8" fill="none" opacity=".8" />
      </g>
    </svg>
  )
}

export function Family() {
  return (
    <section id="hurmat" className="relative bg-ivory" style={{ padding: '28px 16px 40px' }}>
      <Reveal0>
        <Divider kind="moon" />
      </Reveal0>
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEW}
        transition={{ duration: 0.65, ease: EASE }}
        style={{ paddingTop: 30 }}
      >
        <Card innerClassName="min-h-[300px]">
          {img('floral-garland-top') ? (
            <img className="tp-garland" src={img('floral-garland-top')} alt="" decoding="async" draggable="false" aria-hidden="true" />
          ) : (
            <div className="pointer-events-none absolute inset-x-0" style={{ top: -38 }}>
              <GarlandArt />
            </div>
          )}
          <motion.div
            className="relative px-6 pb-12 text-center"
            style={{ paddingTop: 138 }}
            variants={stagger(0.15, 0.45)}
            initial="hide"
            whileInView="show"
            viewport={VIEW}
          >
            <motion.div variants={up} className="flex items-center justify-center gap-3">
              <span className="h-px w-[48px] shrink" style={{ background: 'linear-gradient(90deg,transparent,#D8C48A)' }} />
              <p className="shrink-0 font-caps text-[14px] font-semibold uppercase tracking-[0.22em] text-[#76663E]">Hurmat bilan</p>
              <span className="h-px w-[48px] shrink" style={{ background: 'linear-gradient(270deg,transparent,#D8C48A)' }} />
            </motion.div>
            <motion.p
              variants={{ hide: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } }}
              className="mx-auto mt-3 max-w-[280px] text-balance font-script text-[48px] leading-[1.1] text-emerald-ink"
            >
              {WEDDING.hosts}
            </motion.p>
            {img('gold-rosette') && (
              <motion.div variants={up} className="mt-5 flex justify-center" aria-hidden="true">
                <img className="tp-rosette" src={img('gold-rosette')} alt="" decoding="async" draggable="false" />
              </motion.div>
            )}
          </motion.div>
        </Card>
      </motion.div>
    </section>
  )
}

const Reveal0 = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEW} transition={{ duration: 0.6, ease: EASE }}>
    {children}
  </motion.div>
)
