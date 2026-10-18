import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pattern, Star8 } from './Ornaments'
import { WEDDING } from '../config'

const KEY = 'toy-host-token'
const store = {
  get: () => { try { return sessionStorage.getItem(KEY) } catch { return null } },
  set: (v) => { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY) } catch {} },
}
const when = (iso) => new Date(iso).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

function Login({ onToken }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const go = async (e) => {
    e.preventDefault()
    const r = await fetch('/api/host/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) return setErr(j.error || 'Xatolik')
    store.set(j.token)
    onToken(j.token)
  }
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-lapis px-5">
      <Pattern color="#dcc28a" opacity={0.1} />
      <motion.form onSubmit={go} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="paper relative w-full max-w-sm rounded-[32px] p-8 text-center">
        <Star8 size={40} className="mx-auto text-gold" />
        <p className="mt-4 font-sans text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Faqat to'y egasi uchun</p>
        <h1 className="mt-2 font-script text-5xl text-lapis">Mezbon paneli</h1>
        <input
          type="password"
          inputMode="text"
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN kod"
          className="mt-7 w-full rounded-2xl border border-gold/30 bg-white px-4 py-3.5 text-center font-sans text-lg tracking-[0.3em] outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
        />
        {err && <p className="mt-3 font-sans text-sm text-red-700">{err}</p>}
        <button className="mt-4 w-full rounded-2xl bg-lapis py-3.5 font-sans text-sm font-bold text-pearl">Kirish</button>
        <a href="#/" className="mt-5 inline-block font-sans text-xs text-ink/50 underline-offset-4 hover:underline">← Taklifnomaga qaytish</a>
      </motion.form>
    </div>
  )
}

export default function Host() {
  const [token, setToken] = useState(store.get())
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('photos')
  const [open, setOpen] = useState(null) // index in photos
  const [selecting, setSelecting] = useState(false)
  const [sel, setSel] = useState([]) // selected photo ids
  const [, setLoaded] = useState(0)
  const [toast, setToast] = useState('')
  const cache = useRef(new Map()) // id -> File, pre-fetched so the share sheet opens instantly on tap

  const api = useCallback(
    async (url, opts = {}) => {
      const r = await fetch(url, { ...opts, headers: { ...(opts.headers || {}), 'x-host-token': token } })
      if (r.status === 401) {
        store.set(null)
        setToken(null)
        throw new Error('auth')
      }
      return r.json()
    },
    [token],
  )
  const load = useCallback(() => api('/api/host/data').then(setData).catch(() => {}), [api])

  useEffect(() => {
    if (!token) return
    load()
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [token, load])

  useEffect(() => {
    if (open !== null && data?.photos[open]) prefetch(data.photos[open].id)
  }, [open, data]) // eslint-disable-line

  useEffect(() => {
    if (open === null) return
    const k = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((i) => Math.min(i + 1, data.photos.length - 1))
      if (e.key === 'ArrowLeft') setOpen((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, data])

  if (!token) return <Login onToken={setToken} />

  const src = (id, dl) => `/api/host/photo?id=${encodeURIComponent(id)}&t=${token}${dl ? '&download=1' : ''}`
  const photos = data?.photos || []
  const isPhone = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches

  const prefetch = (id) => {
    if (cache.current.has(id)) return
    cache.current.set(id, null)
    fetch(src(id))
      .then((r) => r.blob())
      .then((b) => {
        cache.current.set(id, new File([b], `toy-${id.split('/').pop()}`, { type: b.type || 'image/jpeg' }))
        setLoaded((n) => n + 1)
      })
      .catch(() => cache.current.delete(id))
  }
  const readyCount = (ids) => ids.filter((id) => cache.current.get(id)).length
  const toggle = (id) => {
    prefetch(id)
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }
  const selectAll = () => {
    const all = photos.map((p) => p.id)
    all.forEach(prefetch)
    setSel(sel.length === all.length ? [] : all)
  }
  const flash = (t) => {
    setToast(t)
    setTimeout(() => setToast(''), 2600)
  }

  /** Phone: native share sheet -> "Save images" puts them into the gallery. Desktop: downloads. */
  const save = (ids) => {
    const files = ids.map((id) => cache.current.get(id)).filter(Boolean)
    if (!files.length || files.length < ids.length) return
    if (isPhone && navigator.canShare?.({ files })) {
      navigator
        .share({ files })
        .then(() => flash(`${files.length} ta rasm saqlandi`))
        .catch(() => {})
      return
    }
    files.forEach((f, i) =>
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(f)
        a.download = f.name
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(a.href), 5000)
      }, i * 400),
    )
    flash(`${files.length} ta rasm yuklab olinmoqda`)
  }
  const rsvps = data?.rsvps || []
  const yes = rsvps.filter((r) => r.attending)
  const people = yes.reduce((s, r) => s + r.guests, 0)

  const delPhoto = async (id) => {
    if (!confirm("Bu rasmni o'chirasizmi?")) return
    await api(`/api/host/photo?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    setOpen(null)
    load()
  }
  const delRsvp = async (id) => {
    if (!confirm("Bu javobni o'chirasizmi?")) return
    await api(`/api/host/rsvp?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    load()
  }

  const stats = [
    ['Rasmlar', photos.length],
    ['Keladi', `${yes.length}`, `${people} kishi`],
    ['Kelmaydi', rsvps.length - yes.length],
  ]

  return (
    <div className="min-h-svh bg-pearl">
      <header className="relative overflow-hidden bg-lapis px-5 pb-20 pt-8 text-pearl">
        <Pattern color="#dcc28a" opacity={0.1} />
        <div className="relative mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-gold-light">Mezbon paneli</p>
            <h1 className="font-script text-4xl text-pearl sm:text-5xl">
              {WEDDING.groom} & {WEDDING.bride}
            </h1>
          </div>
          <button onClick={() => (store.set(null), setToken(null))} className="rounded-full border border-gold-light/40 px-4 py-2 font-sans text-xs text-gold-light">
            Chiqish
          </button>
        </div>
      </header>

      <div className="relative mx-auto -mt-12 max-w-5xl px-5 pb-16">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(([l, v, s]) => (
            <div key={l} className="paper rounded-2xl p-4 text-center">
              <div className="font-serif text-4xl font-semibold text-lapis">{v}</div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">{l}</div>
              {s && <div className="font-sans text-[11px] text-ink/50">{s}</div>}
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2 rounded-full bg-mist p-1 font-sans text-sm font-semibold sm:w-fit">
          {[['photos', `Rasmlar (${photos.length})`], ['rsvp', `Javoblar (${rsvps.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full px-5 py-2.5 transition sm:flex-none ${tab === k ? 'bg-lapis text-pearl shadow' : 'text-lapis'}`}>
              {l}
            </button>
          ))}
        </div>

        {!data ? (
          <p className="mt-16 text-center font-sans text-sm text-ink/50">Yuklanmoqda...</p>
        ) : tab === 'photos' ? (
          photos.length === 0 ? (
            <div className="mt-16 text-center">
              <Star8 size={48} className="mx-auto text-gold/50" />
              <p className="mt-4 font-italic text-xl italic text-ink/60">Hozircha rasm yo'q. Mehmonlar yuklagan rasmlar shu yerda paydo bo'ladi.</p>
            </div>
          ) : (
            <>
              <div className="mt-6 flex items-center justify-between gap-3">
                <p className="font-sans text-sm text-ink/55">
                  {selecting ? (sel.length ? `${sel.length} ta tanlandi` : 'Yoqqan rasmlarni belgilang') : "Rasmni ko'rish uchun bosing"}
                </p>
                <div className="flex gap-2 font-sans text-sm font-semibold">
                  {selecting && (
                    <button onClick={selectAll} className="rounded-full px-4 py-2 text-lapis hover:bg-mist">
                      {sel.length === photos.length ? 'Bekor qilish' : 'Hammasi'}
                    </button>
                  )}
                  <button
                    onClick={() => (setSelecting(!selecting), setSel([]))}
                    className={`rounded-full px-5 py-2 transition ${selecting ? 'bg-mist text-lapis' : 'bg-lapis text-pearl shadow'}`}
                  >
                    {selecting ? 'Yopish' : 'Tanlash'}
                  </button>
                </div>
              </div>
              <div className="mt-4 columns-2 gap-3 pb-24 sm:columns-3 lg:columns-4">
                {photos.map((p, i) => {
                  const on = sel.includes(p.id)
                  return (
                    <motion.button
                      key={p.id}
                      layout
                      onClick={() => (selecting ? toggle(p.id) : setOpen(i))}
                      className="group relative mb-3 block w-full overflow-hidden rounded-2xl bg-mist"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, scale: on ? 0.94 : 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                      <img src={src(p.id)} alt="" loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 text-left font-sans text-[11px] text-white opacity-90">
                        {p.by || 'Mehmon'} · {when(p.at)}
                      </span>
                      {selecting && (
                        <>
                          <span className={`absolute inset-0 rounded-2xl ring-inset transition ${on ? 'ring-4 ring-gold-light' : ''}`} />
                          <span
                            className={`absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border-2 transition ${
                              on ? 'border-gold-light bg-gold-light text-night' : 'border-white/90 bg-black/25'
                            }`}
                          >
                            {on && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            )}
                          </span>
                        </>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </>
          )
        ) : (
          <div className="mt-6 space-y-3">
            {rsvps.length === 0 && <p className="mt-16 text-center font-italic text-xl italic text-ink/60">Hozircha javob yo'q.</p>}
            {rsvps.map((r) => (
              <div key={r.id} className="paper flex items-start gap-4 rounded-2xl p-4">
                <span className={`mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full ${r.attending ? 'bg-lapis text-gold-light' : 'bg-mist text-ink/50'}`}>
                  {r.attending ? '✓' : '✕'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-serif text-xl font-semibold text-lapis">{r.name}</span>
                    <span className="font-sans text-xs text-ink/50">
                      {r.attending ? `Keladi · ${r.guests} kishi` : 'Kela olmaydi'} · {when(r.at)}
                    </span>
                  </div>
                  {r.message && <p className="mt-1 font-italic text-xl italic text-ink/70">«{r.message}»</p>}
                </div>
                <button onClick={() => delRsvp(r.id)} className="font-sans text-xs text-ink/40 hover:text-red-700">O'chirish</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selecting && sel.length > 0 && (
          <motion.div
            initial={{ y: 120 }}
            animate={{ y: 0 }}
            exit={{ y: 120 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-md"
          >
            <button
              onClick={() => save(sel)}
              disabled={readyCount(sel) < sel.length}
              className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-lapis py-4 font-sans text-[15px] font-bold text-pearl shadow-2xl shadow-lapis/40 disabled:cursor-wait"
            >
              {readyCount(sel) < sel.length && (
                <span className="absolute inset-y-0 left-0 bg-gold/35 transition-all" style={{ width: `${(readyCount(sel) / sel.length) * 100}%` }} />
              )}
              <svg className="relative" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12M7 10l5 5 5-5M4 19h16" />
              </svg>
              <span className="relative">
                {readyCount(sel) < sel.length ? `Tayyorlanmoqda... ${readyCount(sel)}/${sel.length}` : `Telefonga saqlash (${sel.length})`}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-5 z-[60] -translate-x-1/2 rounded-full bg-night px-5 py-3 font-sans text-sm font-semibold text-gold-light shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open !== null && photos[open] && (
          <motion.div className="fixed inset-0 z-50 flex flex-col bg-black/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between p-4 font-sans text-sm text-white/80">
              <span>
                {photos[open].by || 'Mehmon'} · {open + 1}/{photos.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => save([photos[open].id])}
                  disabled={!cache.current.get(photos[open].id)}
                  className="rounded-full bg-gold-light px-4 py-2 font-semibold text-night disabled:opacity-50"
                >
                  {cache.current.get(photos[open].id) ? 'Saqlash' : '...'}
                </button>
                <button onClick={() => delPhoto(photos[open].id)} className="rounded-full bg-white/10 px-4 py-2 hover:bg-red-700">O'chirish</button>
                <button onClick={() => setOpen(null)} className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20">✕</button>
              </div>
            </div>
            <div className="relative flex flex-1 items-center justify-center p-4" onClick={() => setOpen(null)}>
              <motion.img key={open} src={src(photos[open].id)} alt="" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
              {open > 0 && <button onClick={(e) => (e.stopPropagation(), setOpen(open - 1))} className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white">‹</button>}
              {open < photos.length - 1 && <button onClick={(e) => (e.stopPropagation(), setOpen(open + 1))} className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-2xl text-white">›</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
