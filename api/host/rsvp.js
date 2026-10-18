import { del } from '@vercel/blob'
import { deny, isHost, json } from '../_lib.js'

export async function DELETE(request) {
  if (!isHost(request)) return deny()
  const id = new URL(request.url).searchParams.get('id') || ''
  if (!id.startsWith('rsvp/') || id.includes('..')) return json({ error: 'Topilmadi' }, 404)
  await del(id)
  return json({ ok: true })
}
