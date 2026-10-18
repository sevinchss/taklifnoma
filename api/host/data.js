import { get } from '@vercel/blob'
import { ACCESS, deny, isHost, json, listAll, uploaderFromPath } from '../_lib.js'

const byNewest = (a, b) => (a.at < b.at ? 1 : -1)

export async function GET(request) {
  if (!isHost(request)) return deny()

  const [photoBlobs, rsvpBlobs] = await Promise.all([listAll('photos/'), listAll('rsvp/')])

  const photos = photoBlobs
    .map((b) => ({ id: b.pathname, by: uploaderFromPath(b.pathname), size: b.size, at: new Date(b.uploadedAt).toISOString() }))
    .sort(byNewest)

  const rsvps = (
    await Promise.all(
      rsvpBlobs.map(async (b) => {
        try {
          const r = await get(b.pathname, { access: ACCESS })
          if (!r || r.statusCode !== 200) return null
          return { id: b.pathname, ...JSON.parse(await new Response(r.stream).text()) }
        } catch {
          return null
        }
      }),
    )
  )
    .filter(Boolean)
    .sort(byNewest)

  return json({ photos, rsvps })
}
