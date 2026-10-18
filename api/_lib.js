import crypto from 'node:crypto'
import { list } from '@vercel/blob'

// Store is created as "Private" in the Vercel dashboard — blobs can only be read with the token.
export const ACCESS = 'private'

const PIN = process.env.HOST_PIN || 'mezbon2026'
const SECRET = process.env.HOST_SECRET || `${PIN}:toy`
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex')
const eq = (a, b) => {
  const A = Buffer.from(String(a))
  const B = Buffer.from(String(b))
  return A.length === B.length && crypto.timingSafeEqual(A, B)
}

export const hostToken = () => crypto.createHmac('sha256', SECRET).update('host').digest('hex')
export const checkPin = (pin) => Boolean(pin) && eq(sha(pin), sha(PIN))
export function isHost(request) {
  const t = request.headers.get('x-host-token') || new URL(request.url).searchParams.get('t') || ''
  return Boolean(t) && eq(t, hostToken())
}

export const json = (data, status = 200) => Response.json(data, { status, headers: { 'cache-control': 'no-store' } })
export const deny = () => json({ error: "Ruxsat yo'q" }, 401)
export const clean = (v, max = 300) => String(v ?? '').trim().slice(0, max)

export async function listAll(prefix) {
  const out = []
  let cursor
  do {
    const r = await list({ prefix, cursor, limit: 1000 })
    out.push(...r.blobs)
    cursor = r.hasMore ? r.cursor : undefined
  } while (cursor)
  return out
}

/** photos/<ts>__<base64url name>-<random>.<ext>  ->  uploader name */
export function uploaderFromPath(pathname) {
  const part = pathname.split('__')[1] || ''
  const b64 = part.replace(/\.[^.]+$/, '').replace(/-[^-]*$/, '')
  try {
    return Buffer.from(b64, 'base64url').toString('utf8').slice(0, 80)
  } catch {
    return ''
  }
}
