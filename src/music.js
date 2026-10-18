// Background music.
// 1) public/little-fairy.mp3  2) public/music.mp3  — the first file found is played (looped).
// 3) If neither exists, a gentle "fairy music box" waltz is generated with Web Audio.

const FILES = ['/little-fairy.m4a', '/little-fairy.mp3', '/music.mp3']
const listeners = new Set()
let playing = false
let audioEl = null
let mode = null // 'file' | 'synth'
let ctx, master, wet, timer, nextT, step

const emit = () => listeners.forEach((f) => f(playing))
export const onMusic = (f) => (listeners.add(f), () => listeners.delete(f))
export const isPlaying = () => playing

async function findFile() {
  for (const f of FILES) {
    try {
      const r = await fetch(f, { method: 'HEAD' })
      if (r.ok && (r.headers.get('content-type') || '').includes('audio')) return f
    } catch {}
  }
  return null
}

// ---------------- generated "fairy music box" ----------------
const hz = (m) => 440 * 2 ** ((m - 69) / 12)

function impulse(sec = 3.2) {
  const len = ctx.sampleRate * sec
  const b = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2.2
  }
  return b
}

/** music-box tine: sine + inharmonic bell partials, quick attack, long ring */
function bell(m, t, vol = 0.12, dur = 2.2) {
  const f = hz(m)
  const out = ctx.createGain()
  out.gain.value = vol
  ;[
    [1, 1, dur],
    [2.76, 0.28, dur * 0.35],
    [5.4, 0.12, dur * 0.18],
    [8.9, 0.05, dur * 0.1],
  ].forEach(([mul, a, d]) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = f * mul
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(a, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + d)
    o.connect(g).connect(out)
    o.start(t)
    o.stop(t + d + 0.05)
  })
  out.connect(master)
  out.connect(wet)
}

/** soft pad chord under each bar */
function pad(notes, t, dur) {
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1100
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.05, t + 0.5)
  g.gain.linearRampToValueAtTime(0, t + dur + 0.4)
  notes.forEach((m) => {
    ;[-4, 4].forEach((det) => {
      const o = ctx.createOscillator()
      o.type = 'triangle'
      o.frequency.value = hz(m)
      o.detune.value = det
      o.connect(lp)
      o.start(t)
      o.stop(t + dur + 0.5)
    })
  })
  lp.connect(g)
  g.connect(master)
  g.connect(wet)
}

// 3/4 waltz in D major, 8 bars. Chords: D Bm G A | D Bm G A
const CHORDS = [
  [50, 54, 57], [47, 50, 54], [43, 47, 50], [45, 49, 52],
  [50, 54, 57], [47, 50, 54], [43, 47, 50], [45, 49, 52],
]
// melody: [eighth position in bar (0-5), midi]
const MELODY = [
  [[0, 78], [2, 81], [4, 86]],
  [[0, 83], [3, 81], [4, 78]],
  [[0, 79], [2, 83], [4, 86]],
  [[0, 85], [2, 83], [4, 81]],
  [[0, 81], [1, 83], [2, 81], [4, 78]],
  [[0, 74], [2, 78], [4, 83]],
  [[0, 79], [2, 78], [3, 76], [4, 74]],
  [[0, 76], [4, 73]],
]
const EIGHTH = 0.25

function schedule() {
  while (nextT < ctx.currentTime + 0.5) {
    const bar = Math.floor(step / 6) % 8
    const pos = step % 6
    const ch = CHORDS[bar]
    if (pos === 0) {
      bell(ch[0] - 12 + 12, nextT, 0.09, 2.6) // bass tine
      pad(ch.map((n) => n + 12), nextT, EIGHTH * 6)
    }
    // twinkly arpeggio
    const arp = [ch[0] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12, ch[1] + 24, ch[2] + 12][pos]
    if (pos !== 0) bell(arp, nextT, 0.045, 1.4)
    // melody
    for (const [p, m] of MELODY[bar]) if (p === pos) bell(m, nextT + (Math.random() * 0.015), 0.13, 2.4)
    // fairy sparkle run every 4 bars
    if (pos === 5 && bar % 4 === 3) [86, 88, 90, 93, 95, 98].forEach((m, i) => bell(m, nextT + i * 0.045, 0.03, 1.1))
    nextT += EIGHTH
    step++
  }
}

async function startSynth() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    master = ctx.createGain()
    master.gain.value = 0
    const comp = ctx.createDynamicsCompressor()
    master.connect(comp).connect(ctx.destination)
    const conv = ctx.createConvolver()
    conv.buffer = impulse()
    wet = ctx.createGain()
    wet.gain.value = 0.6
    wet.connect(conv).connect(master)
    step = 0
  }
  await ctx.resume()
  nextT = ctx.currentTime + 0.15
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 2)
  clearInterval(timer)
  timer = setInterval(schedule, 100)
}

function stopSynth() {
  if (!ctx) return
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
  setTimeout(() => {
    clearInterval(timer)
    if (!playing) ctx.suspend()
  }, 700)
}

function fadeFile(to, ms = 1500) {
  const from = audioEl.volume
  const t0 = performance.now()
  const tick = (now) => {
    const k = Math.min(1, (now - t0) / ms)
    audioEl.volume = from + (to - from) * k
    if (k < 1) requestAnimationFrame(tick)
    else if (to === 0) audioEl.pause()
  }
  requestAnimationFrame(tick)
}

// detect the file at load time so play() stays inside the user's tap (iOS)
const detect = findFile().then((file) => {
  mode = file ? 'file' : 'synth'
  if (file) {
    audioEl = new Audio(file)
    audioEl.loop = true
    audioEl.preload = 'auto'
    audioEl.volume = 0
  }
})

export async function playMusic() {
  if (playing) return
  playing = true
  emit()
  if (!mode) await detect // normally finished long before the first tap
  if (mode === 'file') {
    audioEl.play().then(() => fadeFile(0.7)).catch(() => ((playing = false), emit()))
  } else {
    startSynth()
  }
}
export function pauseMusic() {
  if (!playing) return
  playing = false
  emit()
  if (mode === 'file') fadeFile(0, 500)
  else stopSynth()
}
export const toggleMusic = () => (playing ? pauseMusic() : playMusic())

let resumeOnShow = false
document.addEventListener('visibilitychange', () => {
  if (document.hidden && playing) {
    pauseMusic()
    resumeOnShow = true
  } else if (!document.hidden && resumeOnShow) {
    resumeOnShow = false
    playMusic()
  }
})
