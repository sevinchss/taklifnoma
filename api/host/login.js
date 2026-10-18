import { checkPin, clean, hostToken, json } from '../_lib.js'

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  if (!checkPin(clean(body.pin, 100))) return json({ error: "PIN noto'g'ri" }, 401)
  return json({ token: hostToken() })
}
