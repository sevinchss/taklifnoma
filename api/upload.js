import { handleUpload } from '@vercel/blob/client'
import { json } from './_lib.js'

// Guest photos go straight from the phone to Blob storage (no 4.5 MB function limit).
// This endpoint only hands out a short-lived upload token for the photos/ folder.
export async function POST(request) {
  const body = await request.json().catch(() => null)
  if (!body) return json({ error: "Noto'g'ri so'rov" }, 400)
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith('photos/')) throw new Error('Bad path')
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif'],
          maximumSizeInBytes: 30 * 1024 * 1024,
          addRandomSuffix: true,
        }
      },
      onUploadCompleted: async () => {},
    })
    return json(result)
  } catch (e) {
    return json({ error: e.message || 'Yuklab bo\'lmadi' }, 400)
  }
}
