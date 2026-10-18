import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pattern, Star8 } from './Ornaments'
import Reveal, { SectionTitle } from './Reveal'
import { DoveBurst, Sparkles } from './Magic'

const input =
  'w-full rounded-2xl border border-gold/30 bg-white/70 px-4 py-3.5 font-sans text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/10'

function Choice({ active, onClick, title, sub, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-1 flex-col items-center gap-2 rounded-2xl border px-3 py-5 text-center transition-all duration-300 ${
        active ? 'border-lapis bg-lapis text-pearl shadow-lg shadow-lapis/25' : 'border-gold/30 bg-white/60 text-lapis hover:border-gold'
      }`}
    >
      <span className={`grid h-11 w-11 place-items-center rounded-full ${active ? 'bg-gold-light/20 text-gold-light' : 'bg-mist text-gold'}`}>{icon}</span>
      <span className="font-serif text-lg font-semibold leading-tight">{title}</span>
      <span className={`font-sans text-[11px] ${active ? 'text-pearl/70' : 'text-ink/50'}`}>{sub}</span>
    </button>
  )
}

export default function Rsvp() {
  const [form, setForm] = useState({ name: '', attending: null, guests: 1, message: '' })
  const [state, setState] = useState('idle') // idle | sending | done | error
  const [err, setErr] = useState('')
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setErr('Ismingizni yozing')
    if (form.attending === null) return setErr('Iltimos, javobingizni tanlang')
    setErr('')
    setState('sending')
    try {
      const r = await fetch('/api/rsvp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!r.ok) throw new Error((await r.json()).error)
      setState('done')
    } catch (e2) {
      setErr(e2.message || "Yuborib bo'lmadi, qayta urinib ko'ring")
      setState('idle')
    }
  }

  return (
    <section id="javob" className="relative px-5 py-20">
      <SectionTitle eyebrow="Javobingiz biz uchun muhim" title="Kelasizmi?" sub="Iltimos, quyida belgilab qo'ying — tayyorgarlik ko'rishimizga yordam beradi." />
      <Reveal className="mx-auto max-w-md">
        <div className="paper relative rounded-[32px] p-6 sm:p-8">
          <Pattern opacity={0.04} />
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative py-10 text-center">
                <div className="absolute left-1/2 top-16"><Sparkles count={10} spread={140} />{form.attending && <DoveBurst count={3} spread={260} />}</div>
                <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', delay: 0.15 }} className="mx-auto grid h-24 w-24 place-items-center">
                  <Star8 size={96} className="absolute text-gold" fill="rgba(220,194,138,0.25)" />
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#142a6b" strokeWidth="2.4" className="relative"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </motion.div>
                <h3 className="mt-6 font-script text-4xl text-lapis">Jazakallohu xayran!</h3>
                <p className="mt-3 font-italic text-xl italic text-ink/70">
                  {form.attending ? "Sizni to'yimizda kutib qolamiz." : "Duolaringizda bizni unutmang. Rahmat!"}
                </p>
              </motion.div>
            ) : (
              <motion.form key="f" onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="relative space-y-5">
                <div>
                  <label className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Ism va familiya</label>
                  <input className={input} value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="Masalan: Aziz Karimov" maxLength={80} />
                </div>

                <div className="flex gap-3">
                  <Choice
                    active={form.attending === true}
                    onClick={() => set('attending')(true)}
                    title="Albatta boraman"
                    sub="Ishtirok etaman"
                    icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
                  />
                  <Choice
                    active={form.attending === false}
                    onClick={() => set('attending')(false)}
                    title="Bora olmayman"
                    sub="Afsuski, uzrli"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>}
                  />
                </div>

                <AnimatePresence>
                  {form.attending === true && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <label className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Necha kishi bo'lasiz?</label>
                      <div className="flex items-center justify-between rounded-2xl border border-gold/30 bg-white/70 p-2">
                        <button type="button" onClick={() => set('guests')(Math.max(1, form.guests - 1))} className="h-11 w-11 rounded-xl bg-mist font-sans text-xl text-lapis active:scale-95">−</button>
                        <span className="font-serif text-3xl font-semibold text-lapis">{form.guests}</span>
                        <button type="button" onClick={() => set('guests')(Math.min(10, form.guests + 1))} className="h-11 w-11 rounded-xl bg-mist font-sans text-xl text-lapis active:scale-95">+</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="mb-2 block font-sans text-xs font-semibold uppercase tracking-[0.2em] text-gold">Tilak va duolaringiz <span className="normal-case tracking-normal text-ink/40">(ixtiyoriy)</span></label>
                  <textarea className={`${input} min-h-24 resize-none`} value={form.message} onChange={(e) => set('message')(e.target.value)} placeholder="Yosh oilaga tilaklaringiz..." maxLength={500} />
                </div>

                {err && <p className="font-sans text-sm text-red-700">{err}</p>}

                <button
                  disabled={state === 'sending'}
                  className="group relative w-full overflow-hidden rounded-2xl bg-lapis py-4 font-sans text-sm font-bold tracking-wider text-pearl shadow-lg shadow-lapis/25 transition active:scale-[0.99] disabled:opacity-70"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gold-light/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  {state === 'sending' ? 'Yuborilmoqda...' : 'Javobni yuborish'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  )
}
