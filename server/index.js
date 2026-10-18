import express from 'express'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
const DB_FILE = path.join(DATA_DIR, 'db.json')
const PORT = process.env.PORT || 3001
const HOST_PIN = process.env.HOST_PIN || 'mezbon2026'
const SECRET = process.env.SECRET || HOST_PIN + ':toy'

if (!process.env.HOST_PIN) {
  console.warn('[!] HOST_PIN o\'rnatilmagan — standart PIN ishlatilmoqda: mezbon2026')
}

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

// ---------- tiny JSON "database" ----------
function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } catch {
    return { rsvps: [], photos: [] }
  }
}
function writeDb(db) {
  const tmp = DB_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2))
  fs.renameSync(tmp, DB_FILE)
}
const clean = (v, max = 300) => String(v ?? '').trim().slice(0, max)

// ---------- auth (host only) ----------
const hostToken = crypto.createHmac('sha256', SECRET).update('host').digest('hex')
const safeEq = (a, b) =>
  a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))

function requireHost(req, res, next) {
  const t = String(req.get('x-host-token') || req.query.t || '')
  if (t && safeEq(t, hostToken)) return next()
  res.status(401).json({ error: 'Ruxsat yo\'q' })
}

// ---------- uploads ----------
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = (path.extname(file.originalname) || '.jpg').toLowerCase().replace(/[^.a-z0-9]/g, '')
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`)
    },
  }),
  limits: { fileSize: 30 * 1024 * 1024, files: 30 },
  fileFilter: (_req, file, cb) => cb(null, /^image\//.test(file.mimetype)),
})

const app = express()
app.use(express.json({ limit: '100kb' }))

// Guest: RSVP
app.post('/api/rsvp', (req, res) => {
  const name = clean(req.body.name, 80)
  const attending = req.body.attending === true || req.body.attending === 'yes'
  const guests = attending ? Math.min(Math.max(parseInt(req.body.guests) || 1, 1), 10) : 0
  const message = clean(req.body.message, 500)
  if (!name) return res.status(400).json({ error: 'Ismingizni kiriting' })
  const db = readDb()
  db.rsvps.unshift({ id: crypto.randomUUID(), name, attending, guests, message, at: new Date().toISOString() })
  writeDb(db)
  res.json({ ok: true })
})

// Guest: photo upload (photos are private — only the host can list/see them)
app.post('/api/photos', upload.array('photos', 30), (req, res) => {
  const files = req.files || []
  if (!files.length) return res.status(400).json({ error: 'Rasm topilmadi' })
  const by = clean(req.body.name, 80)
  const db = readDb()
  for (const f of files) {
    db.photos.unshift({ id: f.filename, by, size: f.size, type: f.mimetype, at: new Date().toISOString() })
  }
  writeDb(db)
  res.json({ ok: true, count: files.length })
})

// Host
app.post('/api/host/login', (req, res) => {
  const pin = clean(req.body.pin, 100)
  if (!pin || !safeEq(crypto.createHash('sha256').update(pin).digest('hex'), crypto.createHash('sha256').update(HOST_PIN).digest('hex'))) {
    return res.status(401).json({ error: 'PIN noto\'g\'ri' })
  }
  res.json({ token: hostToken })
})
app.get('/api/host/data', requireHost, (_req, res) => res.json(readDb()))
app.get('/api/host/photo/:id', requireHost, (req, res) => {
  const id = path.basename(req.params.id)
  const file = path.join(UPLOAD_DIR, id)
  if (!fs.existsSync(file)) return res.sendStatus(404)
  if (req.query.download) res.attachment(`toy-${id}`)
  res.sendFile(file)
})
app.delete('/api/host/photo/:id', requireHost, (req, res) => {
  const id = path.basename(req.params.id)
  const db = readDb()
  db.photos = db.photos.filter((p) => p.id !== id)
  writeDb(db)
  fs.rm(path.join(UPLOAD_DIR, id), { force: true }, () => {})
  res.json({ ok: true })
})
app.delete('/api/host/rsvp/:id', requireHost, (req, res) => {
  const db = readDb()
  db.rsvps = db.rsvps.filter((r) => r.id !== req.params.id)
  writeDb(db)
  res.json({ ok: true })
})

app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Rasm juda katta (30MB dan oshmasin)' : 'Xatolik yuz berdi' })
})

// Production: serve built frontend
const DIST = path.join(ROOT, 'dist')
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')))
}

app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`))
