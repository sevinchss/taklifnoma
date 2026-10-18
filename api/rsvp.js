import { put } from '@vercel/blob'
import { ACCESS, clean, json } from './_lib.js'

// Guest: "kelaman / kelmayman"
export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const name = clean(body.name, 80)
  if (!name) return json({ error: 'Ismingizni kiriting' }, 400)
  const attending = body.attending === true || body.attending === 'yes'
  const rsvp = {
    name,
    attending,
    guests: attending ? Math.min(Math.max(parseInt(body.guests) || 1, 1), 10) : 0,
    message: clean(body.message, 500),
    at: new Date().toISOString(),
  }
  await put(`rsvp/${Date.now()}.json`, JSON.stringify(rsvp), {
    access: ACCESS,
    addRandomSuffix: true,
    contentType: 'application/json',
  })
  return json({ ok: true })
}
