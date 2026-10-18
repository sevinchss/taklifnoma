import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pattern, Star8 } from './Ornaments'
import Reveal, { SectionTitle } from './Reveal'

/** Shrink big phone photos before upload (faster on venue Wi-Fi). Falls back to original (e.g. HEIC). */
async function compress(file, max = 2200, quality = 0.86) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height))
    if (k === 1 && file.size < 2.5e6) return file
    const c = document.createElement('canvas')
    c.width = Math.round(bmp.width * k)
    c.height = Math.round(bmp.height * k)
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height)
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', quality))
    return blob ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}

function send(files, name, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('name', name)
    files.forEach((f) => fd.append('photos', f))
    const x = new XMLHttpRequest()
    x.open('POST', '/api/photos')
    x.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total)
    x.onload = () => (x.status < 300 ? resolve() : reject(new Error(JSON.parse(x.responseText || '{}').error || 'Xatolik')))
    x.onerror = () => reject(new Error("Internet bilan muammo. Qayta urinib ko'ring"))
    x.send(fd)
  })
}

export default function Photos() {
  const [items, setItems] = useState([]) // {file, url}
  const [name, setName] = useState('')
  const [progress, setProgress] = useState(null)
  const [done, setDone] = useState(0)
  const [err, setErr] = useState('')
  const [drag, setDrag] = useState(false)
  const ref = useRef()

  useEffect(() => () => items.forEach((i) => URL.revokeObjectURL(i.url)), []) // eslint-disable-line

  const add = (list) => {
    const imgs = [...list].filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name)).slice(0, 30 - items.length)
    setItems((p) => [...p, ...imgs.map((file) => ({ file, url: URL.createObjectURL(file) }))])
    setDone(0)
    setErr('')
  }
  const remove = (i) =>
    setItems((p) => {
      URL.revokeObjectURL(p[i].url)
      return p.filter((_, j) => j !== i)
    })

  const upload = async () => {
    setErr('')
    setProgress(0)
    try {
      const files = await Promise.all(items.map((i) => compress(i.file)))
      // send in small batches so one bad connection doesn't lose everything
      for (let i = 0; i < files.length; i += 5) {
        const batch = files.slice(i, i + 5)
        await send(batch, name, (p) => setProgress((i + p * batch.length) / files.length))
      }
      items.forEach((i) => URL.revokeObjectURL(i.url))
      setDone(files.length)
      setItems([])
    } catch (e) {
      setErr(e.message)
    } finally {
      setProgress(null)
    }
  }

  const busy = progress !== null

  return (
    <section id="rasmlar" className="relative overflow-hidden bg-mist/60 px-5 py-20">
      <Pattern opacity={0.06} />
      <SectionTitle eyebrow="To'y kuni uchun" title="To'y rasmlarini yuklang" />
      <Reveal className="relative mx-auto max-w-lg">
        <p className="mx-auto -mt-4 mb-8 max-w-sm text-center font-italic text-xl italic leading-relaxed text-ink/70">
          To'yda kelin-kuyovni suratga oldingizmi? Shu yerga yuklang — rasmlar to'g'ri to'y egasiga boradi.
        </p>

        <div className="paper relative overflow-hidden rounded-[32px] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-lapis/[0.06] px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lapis text-gold-light">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            </span>
            <p className="font-sans text-[12.5px] leading-snug text-lapis">
              <b>Maxfiy.</b> Rasmlarni faqat to'y egasi ko'radi — boshqa mehmonlarga ko'rinmaydi.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {done > 0 && !items.length ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-8 text-center">
                <div className="relative mx-auto grid h-20 w-20 place-items-center">
                  <Star8 size={80} className="absolute text-gold spin-slow" fill="rgba(220,194,138,0.25)" />
                  <span className="relative font-serif text-3xl font-semibold text-lapis">{done}</span>
                </div>
                <h3 className="mt-4 font-script text-4xl text-lapis">Rahmat!</h3>
                <p className="mt-2 font-sans text-sm text-ink/60">{done} ta rasm to'y egasiga yuborildi.</p>
                <button onClick={() => ref.current.click()} className="mt-6 rounded-full border border-lapis/30 px-6 py-2.5 font-sans text-sm font-semibold text-lapis hover:border-lapis">
                  Yana yuklash
                </button>
              </motion.div>
            ) : (
              <motion.div key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => ref.current.click()}
                  onDragOver={(e) => (e.preventDefault(), setDrag(true))}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => (e.preventDefault(), setDrag(false), add(e.dataTransfer.files))}
                  className={`group flex w-full flex-col items-center rounded-3xl border-2 border-dashed px-4 py-10 transition ${
                    drag ? 'border-lapis bg-lapis/5' : 'border-gold/40 hover:border-gold hover:bg-white/60'
                  }`}
                >
                  <motion.span whileHover={{ rotate: 8 }} className="grid h-16 w-16 place-items-center rounded-full bg-lapis text-gold-light shadow-lg shadow-lapis/30">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
                  </motion.span>
                  <span className="mt-4 font-serif text-2xl font-semibold text-lapis">Rasmlarni tanlang</span>
                  <span className="mt-1 font-sans text-xs text-ink/50">Galereyadan yoki kameradan · 30 tagacha</span>
                </button>

                {items.length > 0 && (
                  <>
                    <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {items.map((it, i) => (
                        <motion.div key={it.url} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="group relative aspect-square overflow-hidden rounded-xl bg-mist">
                          <img src={it.url} alt="" className="h-full w-full object-cover" />
                          {!busy && (
                            <button onClick={() => remove(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white" aria-label="O'chirish">
                              <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 6l12 12M18 6L6 18" /></svg>
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ismingiz (ixtiyoriy)"
                      maxLength={80}
                      className="mt-5 w-full rounded-2xl border border-gold/30 bg-white/70 px-4 py-3.5 font-sans text-[15px] outline-none focus:border-gold focus:ring-4 focus:ring-gold/10"
                    />
                    <button
                      onClick={upload}
                      disabled={busy}
                      className="relative mt-4 w-full overflow-hidden rounded-2xl bg-lapis py-4 font-sans text-sm font-bold tracking-wider text-pearl shadow-lg shadow-lapis/25 disabled:cursor-wait"
                    >
                      {busy && <span className="absolute inset-y-0 left-0 bg-gold/40 transition-all" style={{ width: `${progress * 100}%` }} />}
                      <span className="relative">{busy ? `Yuklanmoqda... ${Math.round(progress * 100)}%` : `${items.length} ta rasmni yuborish`}</span>
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          {err && <p className="mt-3 text-center font-sans text-sm text-red-700">{err}</p>}
          <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => (add(e.target.files), (e.target.value = ''))} />
        </div>
      </Reveal>
    </section>
  )
}
