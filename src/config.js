// To'y ma'lumotlari — hammasi shu yerdan o'zgartiriladi.
// Bo'sh qoldirilgan ("") qiymatlar bo'lgan bo'limlar saytda ko'rinmaydi.
export const WEDDING = {
  groom: 'Rustamjon',
  bride: 'Madinabonu',
  // Sana va vaqt (Toshkent vaqti)
  date: '2026-10-26T18:00:00+05:00',
  venue: 'Nigora',
  venueType: 'restorani',
  city: '',
  address: 'Manzilni shu yerga yozing',
  mapQuery: 'Nigora restoran',
  // Aniq joy uchun (ixtiyoriy): Yandex xaritadagi havola va koordinatalar
  yandex: '',
  lat: null,
  lng: null,
  hosts: 'Kuyov va kelin xonadonlari',
  // "Ma'lumot uchun" (bo'sh bo'lsa bo'lim chiqmaydi)
  phone: '',
  whatsapp: '',
  // "To'yona" kartasi (bo'sh bo'lsa bo'lim chiqmaydi)
  card: '',
  cardHolder: '',
  // "Stol" raqami (bo'sh bo'lsa bo'lim chiqmaydi)
  table: '',
  // "Ishtirokingizni tasdiqlang" anketasi (olib tashlangan)
  rsvp: false,
}

export const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
export const WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']

// Rasmlar: faylni public/img/ ga qo'ying va nomini shu yerga yozing.
// Bo'sh bo'lsa, o'rnida chizilgan (SVG) bezak chiqadi.
export const IMAGES = {
  'splash-bg': 'splash-bg.webp',
  'door-closed': 'door-closed.webp',
  'door-open': 'door-open.webp',
  'door-couple': 'door-couple.webp',
  'mist-overlay': 'mist-overlay.webp',
  'quran-pillow': '',
  'floral-corner-top': 'floral-corner-top.webp',
  'floral-corner-bottom': 'floral-corner-bottom.webp',
  'floral-garland-top': 'floral-garland-top.webp',
  'gold-divider': 'gold-divider.webp',
  'gold-rosette': 'gold-rosette.webp',
  'countdown-sky': 'countdown-sky.webp',
  'mosque-silhouette': 'mosque-silhouette.webp',
  'hadith-card-bg': '',
  'arch-window-frame': 'arch-window-frame.webp',
  'night-sky-crescent': 'night-sky-crescent.webp',
  'night-mosque': 'night-mosque.webp',
  'night-mosque-layer': '',
  'night-clouds': 'night-clouds.webp',
  'envelope-roses': 'envelope-roses.webp',
  'card-emerald': '',
  'banquet-table': 'banquet-table.webp',
  'rsvp-ornament': '',
  'paper-texture': '',
  'closing-scene': '',
  // "Xotira lavhalari" suratlari (ro'yxat bo'sh bo'lsa bo'lim chiqmaydi)
  photos: ['photo-1.webp', 'photo-2.webp'],
}

// Rasm manzili yoki null (rasm yo'q bo'lsa)
export const img = (slot) => (IMAGES[slot] ? `/img/${IMAGES[slot]}` : null)

// Sananing Toshkentdagi qismlari
export function dateParts(iso = WEDDING.date) {
  const d = new Date(iso)
  const p = {}
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false })
    .formatToParts(d).forEach((x) => (p[x.type] = x.value))
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday)
  return { date: d, y: +p.year, m: +p.month - 1, d: +p.day, time: `${p.hour}:${p.minute}`, weekday: WEEKDAYS[wd], wd }
}
