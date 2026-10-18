import { del, get } from '@vercel/blob'
import { ACCESS, deny, isHost, json } from '../_lib.js'

const photoId = (request) => {
  const id = new URL(request.url).searchParams.get('id') || ''
  return id.startsWith('photos/') && !id.includes('..') ? id : null
}

// Host only: stream a private photo
export async function GET(request) {
  if (!isHost(request)) return deny()
  const id = photoId(request)
  if (!id) return json({ error: 'Topilmadi' }, 404)
  const r = await get(id, { access: ACCESS })
  if (!r || r.statusCode !== 200) return json({ error: 'Topilmadi' }, 404)
  const headers = {
    'content-type': r.blob.contentType || 'image/jpeg',
    'cache-control': 'private, max-age=86400',
  }
  if (new URL(request.url).searchParams.get('download')) {
    headers['content-disposition'] = `attachment; filename="toy-${id.split('/').pop()}"`
  }
  return new Response(r.stream, { headers })
}

export async function DELETE(request) {
  if (!isHost(request)) return deny()
  const id = photoId(request)
  if (!id) return json({ error: 'Topilmadi' }, 404)
  await del(id)
  return json({ ok: true })
}
