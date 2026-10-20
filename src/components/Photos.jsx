import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal, Divider, Star8 } from './ui'
import './sections/bottom.css'
import { upload } from '@vercel/blob/client'

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

/** utf-8 safe base64url, used to keep the uploader's name in the file path */
const b64url = (str) => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** Upload one photo straight to private Blob storage */
function send(file, name, onProgress) {
  const ext = (file.name.match(/\.(\w+)$/)?.[1] || 'jpg').toLowerCase()
  return upload(`photos/${Date.now()}__${b64url(name.slice(0, 60))}.${ext}`, file, {
    access: 'private',
    handleUploadUrl: '/api/upload',
    contentType: file.type || 'image/jpeg',
    onUploadProgress: (e) => onProgress(e.percentage / 100),
  }).catch((e) => {
    throw new Error(/network|fetch/i.test(e.message) ? "Internet bilan muammo. Qayta urinib ko'ring" : "Rasmni yuklab bo'lmadi")
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
      // one by one, 3 at a time — a bad connection never loses the whole batch
      const parts = files.map(() => 0)
      const tick = () => setProgress(parts.reduce((a, b) => a + b, 0) / files.length)
      let next = 0
      const worker = async () => {
        while (next < files.length) {
          const i = next++
          await send(files[i], name, (p) => ((parts[i] = p), tick()))
          parts[i] = 1
          tick()
        }
      }
      await Promise.all([worker(), worker(), worker()])
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
    <section id="rasmlar" className="relative scroll-mt-4 overflow-hidden px-5 pb-16 pt-12" style={{ background: 'linear-gradient(180deg,#F3F1EA,#EEEADC)' }}>
      <Reveal className="text-center">
        <Divider kind="moon" />
        <p className="mt-3 font-caps text-[13.5px] font-semibold uppercase tracking-[0.24em] text-[#7A6936]" style={{ marginRight: '-0.24em' }}>To'y kuni uchun</p>
        <h2 className="script mt-2 text-[43px] leading-[1.15]">To'y rasmlarini yuklang</h2>
        <p className="mx-auto mt-3 max-w-[340px] font-serif text-[18.5px] italic leading-[1.65] text-[#5F534B]">
          To'yda kelin-kuyovni suratga oldingizmi? Shu yerga yuklang — rasmlar to'g'ri to'y egasiga boradi.
        </p>
      </Reveal>

      <Reveal delay={0.1} y={18} className="mx-auto mt-7 max-w-[384px]">
        <div className="mat">
          <div className="card px-5 pb-6 pt-6">
            <span className="card-dash" aria-hidden="true" />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3 rounded-[14px] border border-dashed border-[#D4C49A] bg-[#F3EFE5] px-3.5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#E6CF8E]" style={{ background: 'linear-gradient(135deg,#2F7344,#1F5A35)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                </span>
                <p className="text-left font-sans text-[14.5px] leading-[1.5] text-[#34503E]">
                  <b className="font-semibold text-[#1F5A35]">Maxfiy.</b> Rasmlarni faqat to'y egasi ko'radi — boshqa mehmonlarga ko'rinmaydi.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {done > 0 && !items.length ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="py-6 text-center">
                    <div className="relative mx-auto grid h-20 w-20 place-items-center">
                      <Star8 size={80} className="spin-slow absolute inset-0" color="rgba(201,168,90,.28)" />
                      <span className="relative font-serif text-[32px] font-semibold text-[#1F5A35] [font-variant-numeric:lining-nums]">{done}</span>
                    </div>
                    <h3 className="script mt-4 text-[41px]">Rahmat!</h3>
                    <p className="mt-1 font-serif text-[18.5px] italic leading-[1.6] text-[#5F534B]">{done} ta rasm to'y egasiga yuborildi.</p>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => ref.current.click()} className="copy-pill mt-6 inline-flex h-12 items-center rounded-full px-8 font-sans text-[16px] font-semibold text-[#2B5A3C]">
                      Yana yuklash
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div key="up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => ref.current.click()}
                      onDragOver={(e) => (e.preventDefault(), setDrag(true))}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => (e.preventDefault(), setDrag(false), add(e.dataTransfer.files))}
                      className={`group flex w-full flex-col items-center rounded-[18px] border-[1.5px] border-dashed px-4 py-9 transition-colors ${
                        drag ? 'border-[#2F7344] bg-[#EEF4EC]' : 'border-[#D4C49A] bg-[#FBF8F0] active:bg-[#F7F3E6]'
                      }`}
                    >
                      <span
                        className="grid h-16 w-16 place-items-center rounded-full text-[#E6CF8E] transition-transform duration-300 group-hover:scale-105"
                        style={{ background: 'linear-gradient(135deg,#2F7344,#1F5A35)', boxShadow: '0 0 0 4px #FFFDF6, 0 0 0 5px #D8C48A, 0 10px 24px rgba(31,90,53,.28)' }}
                      >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
                      </span>
                      <span className="mt-4 font-serif text-[23.5px] font-semibold text-[#1F5A35]">Rasmlarni tanlang</span>
                      <span className="mt-1.5 font-sans text-[14.5px] leading-snug text-[#6F665D] [text-wrap:balance]">Galereyadan yoki kameradan · 30 tagacha</span>
                    </button>

                    {items.length > 0 && (
                      <>
                        <div className="mt-5 grid grid-cols-4 gap-2">
                          {items.map((it, i) => (
                            <motion.div
                              key={it.url}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative aspect-square overflow-hidden rounded-[10px] bg-[#EFE9DA] p-[3px] shadow-[0_0_0_1px_#E3D6AE]"
                            >
                              <img src={it.url} alt="" className="h-full w-full rounded-[7px] object-cover" />
                              {!busy && (
                                <button onClick={() => remove(i)} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-[#122A1C]/75 text-white after:absolute after:-inset-2 after:content-['']" aria-label="O'chirish">
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
                          aria-label="Ismingiz (ixtiyoriy)"
                          maxLength={80}
                          className="field mt-5"
                        />
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={upload}
                          disabled={busy}
                          className="btn-sage ready relative mt-5 h-[52px] w-full overflow-hidden rounded-full font-serif text-[19px] font-medium disabled:cursor-wait"
                        >
                          {busy && <span className="absolute inset-y-0 left-0 bg-[#E6CF8E]/35 transition-[width] duration-300" style={{ width: `${progress * 100}%` }} />}
                          <span className="relative">{busy ? `Yuklanmoqda... ${Math.round(progress * 100)}%` : `${items.length} ta rasmni yuborish`}</span>
                        </motion.button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              {err && <p className="mt-3 rounded-[12px] border border-dashed border-[#D9A99A] bg-[#FBF1EC] px-3.5 py-2.5 text-center font-sans text-[15px] leading-snug text-[#8E4130]" role="alert">{err}</p>}
              <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => (add(e.target.files), (e.target.value = ''))} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
