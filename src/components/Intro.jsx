// Darvoza ("Hurmatli Mehmonimiz") + eshik ochilishi (≈3.3 s) → Hero bilan bir xil kadrda topshiriladi.
// Rasm slotlari bo'sh bo'lsa, butun sahna SVG/CSS bilan chiziladi.
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { img, WEDDING } from '../config'
import { playMusic } from '../music'
import './intro.css'

const OPEN_MS = 3300 // bosilgandan Hero gacha (keyin 0.42 s yumshoq o'tish) ≈ 3.7 s
const GOLD = '#C9A85A'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// ---------------------------------------------------------------- shakl yordamchilari
function ogee(cx, w, ya, ys, yb) {
  const h = ys - ya
  const L = (k) => cx - k * w
  const R = (k) => cx + k * w
  return [
    `M${L(1)} ${yb}L${L(1)} ${ys}`,
    `C${L(1)} ${ys - 0.42 * h} ${L(0.78)} ${ya + 0.56 * h} ${L(0.38)} ${ya + 0.36 * h}`,
    `C${L(0.16)} ${ya + 0.25 * h} ${L(0.04)} ${ya + 0.12 * h} ${cx} ${ya}`,
    `C${R(0.04)} ${ya + 0.12 * h} ${R(0.16)} ${ya + 0.25 * h} ${R(0.38)} ${ya + 0.36 * h}`,
    `C${R(0.78)} ${ya + 0.56 * h} ${R(1)} ${ys - 0.42 * h} ${R(1)} ${ys}L${R(1)} ${yb}Z`,
  ].join('')
}
const spark = (x, y, s) =>
  `M${x} ${y - s}C${x + s * 0.08} ${y - s * 0.36} ${x + s * 0.36} ${y - s * 0.08} ${x + s} ${y}C${x + s * 0.36} ${y + s * 0.08} ${x + s * 0.08} ${y + s * 0.36} ${x} ${y + s}C${x - s * 0.08} ${y + s * 0.36} ${x - s * 0.36} ${y + s * 0.08} ${x - s} ${y}C${x - s * 0.36} ${y - s * 0.08} ${x - s * 0.08} ${y - s * 0.36} ${x} ${y - s}Z`

const STARS = [
  [208, 20, 9, 3.2, 0], [150, 42, 5, 2.6, 0.4], [268, 38, 5.5, 3.4, 1.1], [112, 72, 4, 2.9, 0.7], [305, 68, 4.5, 3.8, 0.2],
  [78, 112, 3.5, 3.1, 1.5], [340, 104, 5, 2.7, 0.9], [176, 62, 3, 3.6, 1.8], [242, 60, 3, 2.4, 0.5], [58, 162, 3, 3.3, 1.2],
  [362, 152, 3.5, 2.8, 0.1], [132, 96, 2.6, 3.9, 2], [288, 94, 2.6, 3, 1.4], [34, 58, 3.5, 3.5, 0.6], [388, 46, 3, 2.6, 1.7],
  [98, 30, 2.6, 3.2, 1], [322, 22, 3.5, 3.7, 0.3], [20, 120, 2.4, 2.9, 2.2], [400, 112, 2.4, 3.3, 0.8],
]

// ---------------------------------------------------------------- devor, ravoq, yulduzlar
function Wall() {
  const outer = ogee(208, 150, 44, 206, 600)
  const outer2 = ogee(208, 143, 55, 209, 600)
  const inner = ogee(208, 118, 116, 236, 600)
  const inner2 = ogee(208, 112, 125, 238, 600)
  return (
    <svg className="dz-layer" viewBox="0 0 416 598" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="dzBlush"><stop offset="0" stopColor="#F1C9BA" stopOpacity=".55" /><stop offset="1" stopColor="#F1C9BA" stopOpacity="0" /></radialGradient>
        <radialGradient id="dzSage"><stop offset="0" stopColor="#B9CDB4" stopOpacity=".5" /><stop offset="1" stopColor="#B9CDB4" stopOpacity="0" /></radialGradient>
        <linearGradient id="dzBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FCF8EE" /><stop offset="1" stopColor="#F4EDDB" /></linearGradient>
        <linearGradient id="dzGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B8954A" /><stop offset=".45" stopColor="#E6CF8E" /><stop offset="1" stopColor="#B08C42" /></linearGradient>
        <linearGradient id="dzJamb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#D9CDA8" /><stop offset=".5" stopColor="#EADFBF" /><stop offset="1" stopColor="#D9CDA8" /></linearGradient>
        <pattern id="dzKilim" width="26" height="18" patternUnits="userSpaceOnUse" x="12" y="4">
          <rect width="26" height="18" fill="#F3EAD3" />
          <path d="M13 1L22 9 13 17 4 9Z" fill="#E4AE9E" />
          <path d="M13 5L18 9 13 13 8 9Z" fill="#9DB59A" />
          <circle cx="13" cy="9" r="1.6" fill="#B5786A" />
          <path d="M0 0L4 4 0 8M26 0L22 4 26 8M0 10L4 14 0 18M26 10L22 14 26 18" stroke="#A9BFA3" strokeWidth="1.4" fill="none" />
        </pattern>
        <clipPath id="dzInnerClip"><path d={inner2} /></clipPath>
      </defs>
      <rect width="416" height="598" fill="#F6F0E1" />
      {/* akvarel dog'lari */}
      <circle cx="62" cy="214" r="96" fill="url(#dzBlush)" />
      <circle cx="366" cy="236" r="84" fill="url(#dzBlush)" />
      <circle cx="300" cy="118" r="60" fill="url(#dzBlush)" opacity=".6" />
      <circle cx="36" cy="350" r="80" fill="url(#dzSage)" />
      <circle cx="392" cy="370" r="76" fill="url(#dzSage)" />
      {/* tashqi ravoq (pishtoq) */}
      <path d={outer} fill="url(#dzBand)" />
      <path d={outer} fill="none" stroke="url(#dzGold)" strokeWidth="2.4" />
      <path d={outer2} fill="none" stroke={GOLD} strokeWidth=".9" opacity=".8" />
      {/* ichki ravoq: kilim timpan + eshik romi */}
      <path d={inner} fill="url(#dzJamb)" />
      <g clipPath="url(#dzInnerClip)">
        <rect x="80" y="110" width="256" height="140" fill="url(#dzKilim)" />
        <rect x="80" y="238" width="256" height="12" fill="#EADFC2" />
      </g>
      <path d={inner} fill="none" stroke="url(#dzGold)" strokeWidth="2" />
      <path d={inner2} fill="none" stroke={GOLD} strokeWidth=".8" opacity=".75" />
      <path d="M96 249.5H320" stroke="url(#dzGold)" strokeWidth="1.6" />
      <rect x="95" y="249" width="226" height="352" fill="#3B3020" opacity=".08" />
      {/* yulduzlar */}
      <g fill="url(#dzGold)">
        {STARS.map(([x, y, s, d, dl], i) => (
          <path key={i} d={spark(x, y, s)} className="twinkle" style={{ '--d': `${d}s`, '--delay': `${dl}s`, transformBox: 'fill-box', transformOrigin: 'center' }} />
        ))}
      </g>
      <g fill={GOLD} opacity=".55">
        {[[190, 34], [228, 30], [160, 82], [256, 84], [46, 92], [372, 80], [120, 140], [298, 136]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.1" />
        ))}
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------- eshik ortidagi dunyo (220×348)
function BeyondLight() {
  return (
    <svg className="dz-layer" viewBox="0 0 220 348" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="dzSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF9E8" /><stop offset=".6" stopColor="#FBE8B9" /><stop offset="1" stopColor="#F3D392" /></linearGradient>
        <radialGradient id="dzSun" cx="110" cy="160" r="150" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#FFFEF6" /><stop offset=".45" stopColor="#FFF4D2" stopOpacity=".8" /><stop offset="1" stopColor="#FFF4D2" stopOpacity="0" /></radialGradient>
        <linearGradient id="dzFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4DDA6" /><stop offset="1" stopColor="#DDB273" /></linearGradient>
        <linearGradient id="dzRunner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EBC3A8" stopOpacity=".3" /><stop offset="1" stopColor="#D99A86" stopOpacity=".75" /></linearGradient>
      </defs>
      <rect width="220" height="348" fill="url(#dzSky)" />
      <path d="M0 214H220V348H0Z" fill="url(#dzFloor)" />
      <path d="M96 214H124L168 348H52Z" fill="url(#dzRunner)" />
      <path d="M98 214L56 348M122 214L164 348" stroke="#F7E3C0" strokeWidth="1.2" opacity=".8" />
      <g stroke="#FAEBCB" strokeWidth=".7" opacity=".55">
        {[-120, -60, 0, 50, 170, 220, 280, 340].map((x) => <path key={x} d={`M110 214L${x} 348`} />)}
        {[226, 244, 270, 306].map((y) => <path key={y} d={`M0 ${y}H220`} />)}
      </g>
      <rect width="220" height="348" fill="url(#dzSun)" />
    </svg>
  )
}

function Mosque() {
  const win = (x, y, w = 9, h = 16) => `M${x - w / 2} ${y + h}V${y + w * 0.5}Q${x - w / 2} ${y} ${x} ${y - w * 0.35}Q${x + w / 2} ${y} ${x + w / 2} ${y + w * 0.5}V${y + h}Z`
  return (
    <svg className="dz-layer" viewBox="0 0 220 348" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="dzMos" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F3D894" /><stop offset="1" stopColor="#D9AC5E" /></linearGradient>
      </defs>
      <g fill="url(#dzMos)" opacity=".86">
        {/* minoralar */}
        {[22, 198].map((x) => (
          <g key={x}>
            <rect x={x - 4.5} y="118" width="9" height="98" />
            <rect x={x - 7.5} y="146" width="15" height="4" rx="1" />
            <rect x={x - 6.5} y="178" width="13" height="3.5" rx="1" />
            <path d={`M${x - 5.5} 119L${x} 96L${x + 5.5} 119Z`} />
            <path d={`M${x} 96V88`} stroke="#E1BC70" strokeWidth="1" />
          </g>
        ))}
        {/* yon gumbazlar */}
        {[53, 167].map((x) => (
          <g key={x}>
            <rect x={x - 18} y="188" width="36" height="28" />
            <path d={`M${x - 15} 189C${x - 15} 176 ${x - 4} 172 ${x} 164C${x + 4} 172 ${x + 15} 176 ${x + 15} 189Z`} />
          </g>
        ))}
        {/* asosiy bino va gumbaz */}
        <rect x="70" y="174" width="80" height="42" />
        <rect x="86" y="158" width="48" height="18" />
        <path d="M84 160C74 142 88 126 110 112C132 126 146 142 136 160Z" />
        <path d="M110 112V96" stroke="#E1BC70" strokeWidth="1.2" />
        <path d="M113 90A5 5 0 1 0 113 99 4 4 0 1 1 113 90Z" />
      </g>
      <g fill="#FFF5D8" opacity=".9">
        <path d={win(92, 190)} /><path d={win(110, 186, 11, 22)} /><path d={win(128, 190)} />
        <path d={win(53, 196, 7, 12)} /><path d={win(167, 196, 7, 12)} />
        <path d={win(98, 164, 5, 7)} /><path d={win(110, 163, 5, 8)} /><path d={win(122, 164, 5, 7)} />
      </g>
    </svg>
  )
}

function FogBack() {
  return (
    <svg className="dz-layer" viewBox="0 0 220 348" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="dzFogB"><stop offset="0" stopColor="#FFFDF5" stopOpacity=".95" /><stop offset="1" stopColor="#FFFDF5" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="40" cy="222" rx="90" ry="26" fill="url(#dzFogB)" />
      <ellipse cx="170" cy="214" rx="96" ry="28" fill="url(#dzFogB)" />
      <ellipse cx="110" cy="240" rx="130" ry="30" fill="url(#dzFogB)" />
    </svg>
  )
}

// ---------------------------------------------------------------- eshik tavaqasi (110×348)
function Leaf({ right = false }) {
  const id = right ? 'R' : 'L'
  return (
    <svg viewBox="0 0 110 348" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`dzWood${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E6DCBC" /><stop offset=".55" stopColor="#F1E8CF" /><stop offset="1" stopColor="#E8DEC0" />
        </linearGradient>
        <linearGradient id={`dzBronze${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C9A060" /><stop offset=".5" stopColor="#8E6A34" /><stop offset="1" stopColor="#B88D4E" /></linearGradient>
        <pattern id={`dzGirih${id}`} width="20" height="20" patternUnits="userSpaceOnUse" x="15" y="6">
          <rect width="20" height="20" fill="#ECE2C6" />
          <g stroke="#BF9F57" strokeWidth=".8" fill="none">
            <rect x="5" y="5" width="10" height="10" />
            <rect x="5" y="5" width="10" height="10" transform="rotate(45 10 10)" />
            <path d="M0 0L5 5M20 0L15 5M0 20L5 15M20 20L15 15M10 0V2.9M10 20V17.1M0 10H2.9M20 10H17.1" />
          </g>
          <circle cx="10" cy="10" r="2.2" fill="#A9BFA3" />
          <circle cx="0" cy="0" r="1.3" fill="#E2AE9C" /><circle cx="20" cy="0" r="1.3" fill="#E2AE9C" />
          <circle cx="0" cy="20" r="1.3" fill="#E2AE9C" /><circle cx="20" cy="20" r="1.3" fill="#E2AE9C" />
        </pattern>
      </defs>
      <g transform={right ? 'translate(110 0) scale(-1 1)' : undefined}>
        <rect width="110" height="348" fill={`url(#dzWood${id})`} />
        <rect x="4.5" y="4.5" width="101" height="339" fill="none" stroke="#A7BC9F" strokeWidth="3.2" />
        <rect x="9.5" y="9.5" width="91" height="329" fill="none" stroke={GOLD} strokeWidth=".8" />
        {/* yuqori ravoqli panel: girih */}
        <path d="M17 168V54C17 38 34 28 55 17C76 28 93 38 93 54V168Z" fill={`url(#dzGirih${id})`} stroke={GOLD} strokeWidth="1.3" />
        <path d="M21 164V56C21 42 37 33 55 23C73 33 89 42 89 56V164Z" fill="none" stroke="#A7BC9F" strokeWidth=".8" />
        {/* o'rta belbog' */}
        <rect x="17" y="176" width="76" height="16" fill="#DDE6D5" stroke={GOLD} strokeWidth=".7" />
        <g fill="#C9A85A">{[27, 41, 55, 69, 83].map((x) => <path key={x} d={`M${x} 179L${x + 4} 184 ${x} 189 ${x - 4} 184Z`} />)}</g>
        {/* pastki panel: anor */}
        <rect x="17" y="200" width="76" height="134" rx="3" fill="#EEE5CB" stroke={GOLD} strokeWidth="1.1" />
        <rect x="22" y="205" width="66" height="124" rx="2" fill="none" stroke="#A7BC9F" strokeWidth=".7" />
        <path d="M55 296C55 308 44 314 38 324M55 296C55 308 66 314 72 324M55 296V326" stroke="#8FAA8A" strokeWidth="1.1" fill="none" />
        <ellipse cx="40" cy="298" rx="8" ry="3.6" transform="rotate(-28 40 298)" fill="#A7BC9F" />
        <ellipse cx="70" cy="298" rx="8" ry="3.6" transform="rotate(28 70 298)" fill="#A7BC9F" />
        <circle cx="55" cy="270" r="16" fill="#E8B6A2" stroke="#C48D78" strokeWidth="1" />
        <path d="M47 256L50 249 55 255 60 249 63 256Z" fill="#C48D78" />
        <path d="M47 268Q55 276 63 268M49 276Q55 282 61 276" stroke="#D29E89" strokeWidth=".9" fill="none" />
        {[[24, 212], [86, 212], [24, 322], [86, 322]].map(([x, y]) => (
          <path key={`${x}${y}`} d={spark(x, y, 4)} fill={GOLD} />
        ))}
        {/* halqa (qoqqich) */}
        <g transform="translate(92 214)">
          <circle r="8.5" fill={`url(#dzBronze${id})`} />
          <circle r="4" fill="#E2C182" />
          <circle cy="11" r="9.5" fill="none" stroke={`url(#dzBronze${id})`} strokeWidth="2.6" />
        </g>
        {/* ichki chekka: oltin munchoq */}
        <rect x="106" y="0" width="4" height="348" fill="#D9BE78" />
        <g fill="#F4E3B0">{Array.from({ length: 29 }, (_, i) => <circle key={i} cx="108" cy={6 + i * 12} r="1.1" />)}</g>
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------- kelin-kuyov (orqadan)
function Couple() {
  return (
    <svg className="dz-layer" viewBox="0 0 416 598" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="dzChapan" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A8BE9B" /><stop offset="1" stopColor="#7C9A75" /></linearGradient>
        <linearGradient id="dzDress" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFEF9" /><stop offset="1" stopColor="#EEE7D6" /></linearGradient>
        <pattern id="dzLace" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".9" fill="#E6DCC6" /><circle cx="6" cy="6" r=".7" fill="#EEE6D4" />
        </pattern>
        <radialGradient id="dzShadow"><stop offset="0" stopColor="#7A5A2A" stopOpacity=".28" /><stop offset="1" stopColor="#7A5A2A" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="200" cy="590" rx="92" ry="9" fill="url(#dzShadow)" />
      {/* parda (fata) — orqada, chapga sudraladi */}
      <path d="M176 394C160 424 150 472 138 520C128 556 112 578 96 592H198C198 560 196 470 188 400Z" fill="#FFFFFF" opacity=".62" />
      <path d="M176 394C160 424 150 472 138 520C128 556 112 578 96 592H198C198 560 196 470 188 400Z" fill="url(#dzLace)" opacity=".8" />
      {/* kuyov */}
      <path d="M226 520L224 584H235.5L238 528 240.5 584H252L250 520Z" fill="#F4EFE3" stroke="#DCD2BC" strokeWidth=".6" />
      <ellipse cx="229.5" cy="586" rx="7" ry="3" fill="#CDB993" /><ellipse cx="246.5" cy="586" rx="7" ry="3" fill="#CDB993" />
      <path d="M216 424C208 444 206 470 207 496L215 498C215 474 219 448 222 430Z" fill="#8EA984" />
      <path d="M260 424C268 444 270 470 269 496L261 498C261 474 257 448 254 430Z" fill="#87A27E" />
      <path d="M220 416C214 420 212 430 212 446L208 532C222 537 254 537 268 532L264 446C264 430 262 420 256 416C248 411 228 411 220 416Z" fill="url(#dzChapan)" stroke="#6F8D69" strokeWidth=".6" />
      <rect x="234" y="417" width="8" height="114" fill="#CDBB80" opacity=".85" />
      <g fill="#F2E6BE">{Array.from({ length: 13 }, (_, i) => <circle key={i} cx="238" cy={422 + i * 8.5} r="1.3" />)}</g>
      <path d="M212 452Q238 458 264 452" stroke="#C9B679" strokeWidth=".8" fill="none" opacity=".7" />
      <circle cx="265" cy="500" r="4.3" fill="#E1BC99" />
      <rect x="232" y="402" width="12" height="13" rx="3" fill="#D7AF8C" />
      <ellipse cx="238" cy="393" rx="11.5" ry="13" fill="#3E3026" />
      <ellipse cx="226.6" cy="396" rx="2" ry="4" fill="#D7AF8C" /><ellipse cx="249.4" cy="396" rx="2" ry="4" fill="#D7AF8C" />
      <path d="M226 386L227 374C232 369.5 244 369.5 249 374L250 386C242 388.5 234 388.5 226 386Z" fill="#F7F3E8" stroke="#CFC4A4" strokeWidth=".6" />
      <path d="M226.6 382C234 384 242 384 249.4 382" stroke="#B9C9B0" strokeWidth=".8" fill="none" />
      <g fill="#9DB59A">{[231, 236, 241, 246].map((x) => <circle key={x} cx={x} cy="377.5" r="1.1" />)}</g>
      {/* kelin */}
      <path d="M168 426C162 450 160 480 156 520C152 552 146 576 140 590H214C210 570 206 540 202 512C198 476 196 450 192 426C184 420 176 420 168 426Z" fill="url(#dzDress)" stroke="#E2D8C2" strokeWidth=".6" />
      <path d="M168 426C162 450 160 480 156 520C152 552 146 576 140 590H214C210 570 206 540 202 512C198 476 196 450 192 426C184 420 176 420 168 426Z" fill="url(#dzLace)" opacity=".7" />
      <path d="M192 432C198 452 202 476 206 496L200 499C194 478 190 456 188 440Z" fill="#FBF7EE" stroke="#E2D8C2" strokeWidth=".5" />
      <circle cx="208" cy="500" r="4" fill="#E5C3A2" />
      <path d="M164 444C164 428 167 418 170 412C165 403 167 388 180 387C193 388 195 403 190 412C193 418 196 428 196 444C186 449 174 449 164 444Z" fill="#FDFBF5" stroke="#E5DCC8" strokeWidth=".7" />
      <path d="M171 411Q180 416 189 411" stroke="#EAE2D0" strokeWidth=".8" fill="none" />
      <path d="M170 404C164 446 160 504 164 560L178 591H200C198 540 194 470 190 404Z" fill="#FFFFFF" opacity=".42" />
      <path d="M172 430Q180 434 188 430" stroke="#E8DFCB" strokeWidth=".8" fill="none" />
    </svg>
  )
}

// ---------------------------------------------------------------- old plan: tuman + atirgullar
function FogFront() {
  return (
    <svg className="dz-layer" viewBox="0 0 416 598" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="dzFogF"><stop offset="0" stopColor="#FFFDF6" stopOpacity=".92" /><stop offset=".6" stopColor="#FFFDF6" stopOpacity=".45" /><stop offset="1" stopColor="#FFFDF6" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="120" cy="548" rx="120" ry="40" fill="url(#dzFogF)" />
      <ellipse cx="300" cy="552" rx="120" ry="40" fill="url(#dzFogF)" />
      <ellipse cx="210" cy="580" rx="190" ry="44" fill="url(#dzFogF)" />
    </svg>
  )
}

function Rose({ x, y, r, rot = 0 }) {
  const petals = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2 + rot
    return (
      <ellipse key={i} cx={x + Math.cos(a) * r * 0.42} cy={y + Math.sin(a) * r * 0.42} rx={r * 0.6} ry={r * 0.46}
        transform={`rotate(${(a * 180) / Math.PI} ${x + Math.cos(a) * r * 0.42} ${y + Math.sin(a) * r * 0.42})`}
        fill="url(#dzRoseO)" stroke="#D9927E" strokeWidth=".6" />
    )
  })
  return (
    <g>
      {petals}
      <circle cx={x} cy={y} r={r * 0.6} fill="url(#dzRoseM)" />
      <path d={`M${x - r * 0.5} ${y + r * 0.18}Q${x} ${y + r * 0.66} ${x + r * 0.5} ${y + r * 0.18}`} stroke="#D48C78" strokeWidth={r * 0.05} fill="none" />
      <path
        d={`M${x - r * 0.3} ${y + r * 0.05}a${r * 0.3} ${r * 0.26} 0 1 1 ${r * 0.55} ${r * 0.05}a${r * 0.2} ${r * 0.18} 0 1 1 ${-r * 0.36} ${-r * 0.1}a${r * 0.1} ${r * 0.1} 0 1 1 ${r * 0.18} ${r * 0.04}`}
        stroke="#C47D6A" strokeWidth={Math.max(0.8, r * 0.055)} fill="none" strokeLinecap="round"
      />
    </g>
  )
}

function Stem({ d, pts, flip = 1, size = 1 }) {
  return (
    <g>
      <path d={d} stroke="#8FA98C" strokeWidth="1.4" fill="none" />
      {pts.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={7.5 * size} ry={5.8 * size}
          transform={`rotate(${(i % 2 ? 35 : -35) * flip} ${x} ${y})`}
          fill={i % 3 ? '#AFC4A8' : '#93AE92'} stroke="#7F9C7E" strokeWidth=".5" opacity=".95" />
      ))}
    </g>
  )
}

function Roses() {
  const L = (
    <g>
      <Stem d="M28 600C34 540 18 480 34 404" pts={[[30, 566], [22, 540], [34, 516], [20, 488], [32, 462], [24, 438], [36, 414]]} />
      <Stem d="M84 600C92 560 102 520 96 470" pts={[[92, 556], [102, 532], [94, 508], [104, 488], [96, 470]]} flip={-1} size={0.85} />
      <Stem d="M10 600C4 560 8 520 0 480" pts={[[6, 560], [2, 520]]} size={0.9} />
      <Rose x={50} y={548} r={30} />
      <Rose x={14} y={492} r={21} rot={0.4} />
      <Rose x={100} y={584} r={24} rot={0.9} />
      <circle cx="70" cy="474" r="7" fill="#EDB4A2" stroke="#D18F7C" strokeWidth=".6" />
      <path d="M64 478Q70 490 76 478" fill="#93AE92" />
      <circle cx="108" cy="512" r="5" fill="#F0C2B1" stroke="#D18F7C" strokeWidth=".5" />
      {[[80, 530], [118, 548], [26, 590]].map(([x, y], i) => (
        <g key={i} fill="#F7E3D8">{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={x} cy={y - 4} rx="2.6" ry="4" transform={`rotate(${a} ${x} ${y})`} />)}<circle cx={x} cy={y} r="1.6" fill="#E3B76E" /></g>
      ))}
    </g>
  )
  return (
    <svg className="dz-layer" viewBox="0 0 416 598" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <radialGradient id="dzRoseO"><stop offset="0" stopColor="#FCE6DA" /><stop offset="1" stopColor="#E9A994" /></radialGradient>
        <radialGradient id="dzRoseM"><stop offset="0" stopColor="#F6CDBD" /><stop offset="1" stopColor="#E29A85" /></radialGradient>
      </defs>
      {L}
      <g transform="translate(416 0) scale(-1 1)">{L}</g>
    </svg>
  )
}

// ---------------------------------------------------------------- umumiy sahna
const MOTES = [
  [44, 30, 6.5, 0], [58, 52, 8, 1.2], [50, 70, 7, 2.6], [36, 48, 9, 3.4], [64, 38, 7.5, 4.1], [47, 62, 6, 5.2], [55, 44, 8.5, 0.6], [41, 76, 7, 2],
]

// Uchala eshik rasmi bor bo'lsa — faqat rasmlar (SVG umuman chizilmaydi).
const PHOTO = !!(img('door-closed') && img('door-open') && img('door-couple'))
const SCENE_SLOTS = ['door-closed', 'door-open', 'door-couple', 'mist-overlay']

// Hero dagi oltin zarrachalar (rasm kadri foizlarida: eshik yorug'i 34–66 %, 30–80 %)
const DUST = [
  [38, 66, 7.5, 0], [61, 58, 9, 1.4], [47, 74, 8, 2.8], [55, 46, 10, 0.7], [42, 52, 8.5, 3.6], [64, 70, 7, 2.1],
  [50, 62, 9.5, 4.4], [36, 42, 8, 5.2], [58, 34, 10.5, 1.9], [45, 38, 9, 3.1], [67, 50, 8, 0.4], [52, 78, 7.5, 4.9],
  [24, 56, 11, 2.4], [78, 44, 10, 3.9],
]

function PhotoScene({ phase, live, hero }) {
  const hideOnError = (e) => (e.currentTarget.style.display = 'none')
  const pic = (slot, cls) => (
    <img src={img(slot)} alt="" className={`dzp-img ${cls}`} decoding="async" draggable="false" onError={hideOnError} />
  )
  return (
    <div className={`dzp ${live ? 'is-live' : ''}`} data-phase={phase}>
      <div className="dzp-frame">
        {!hero && pic('door-closed', 'dzp-closed')}
        {!hero && pic('door-open', 'dzp-open')}
        {pic('door-couple', 'dzp-couple')}
        {!hero && (
          <>
            <span className="dzp-seam" aria-hidden="true"><span className="dzp-seam-core" /></span>
            <span className="dzp-line" aria-hidden="true" />
            <span className="dzp-bloom" aria-hidden="true" />
            {img('mist-overlay') && <span className="dzp-mist">{pic('mist-overlay', '')}</span>}
          </>
        )}
        {hero && (
          <>
            <span className="dzp-pulse" aria-hidden="true" />
            {DUST.map(([x, y, d, dl], i) => (
              <span key={i} className="dzp-mote" aria-hidden="true"
                style={{ left: `${x}%`, top: `${y}%`, '--d': `${d}s`, '--delay': `${dl}s`, '--dx': `${(i % 2 ? 1 : -1) * (8 + (i % 5) * 4)}px` }} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export function Scene(props) {
  return PHOTO ? <PhotoScene {...props} /> : <SvgScene {...props} />
}

function SvgScene({ phase = 'closed', live = false, hero = false }) {
  const closedSrc = img('door-closed')
  const openSrc = img('door-open')
  const coupleSrc = img('door-couple')
  const mistSrc = img('mist-overlay')
  return (
    <div className={`dz ${live ? 'is-live' : ''}`} data-phase={phase}>
      <div className="dz-stage">
        <Wall />
        <div className="dz-door dz-beyond">
          <BeyondLight />
          <div className="dz-rays-spin" style={{ transformOrigin: '50% 30%' }}><div className="dz-rays" /></div>
          <div className="dz-layer dz-mosque"><div className="dz-glow"><Mosque /></div></div>
          <div className="dz-layer dz-fogb"><div className="dz-fog-drift"><FogBack /></div></div>
          {live && MOTES.map(([x, y, d, dl], i) => (
            <span key={i} className="dz-mote" style={{ left: `${x}%`, top: `${y}%`, '--d': `${d}s`, '--delay': `${dl}s`, '--dx': `${(i % 2 ? 1 : -1) * (6 + i * 2)}px` }} />
          ))}
        </div>
        <div className="dz-door dz-leaves">
          <div className="dz-leaf dz-leaf-l"><Leaf /><span className="dz-shade" /></div>
          <div className="dz-leaf dz-leaf-r"><Leaf right /><span className="dz-shade" /></div>
          <span className="dz-seam" />
        </div>
        <div className="dz-door" style={{ overflow: 'visible' }}>
          <div className="dz-bloom" />
        </div>
        <div className="dz-layer dz-couple"><Couple /></div>
        <div className="dz-layer dz-fog"><div className="dz-fog-drift"><FogFront /></div></div>
        <div className="dz-layer"><Roses /></div>
      </div>
      {/* tayyor rasmlar (bo'lsa) — SVG ustidan, cover */}
      {closedSrc && !hero && <img src={closedSrc} alt="" className={`dz-img dz-img-closed ${openSrc ? '' : 'dz-solo'}`} decoding="async" draggable="false" />}
      {openSrc && <img src={openSrc} alt="" className="dz-img dz-img-open" decoding="async" draggable="false" />}
      {mistSrc && !hero && <img src={mistSrc} alt="" className="dz-img dz-img-mist" decoding="async" draggable="false" />}
      {coupleSrc && <img src={coupleSrc} alt="" className="dz-img dz-img-couple" decoding="async" draggable="false" />}
      <div className="dz-topmist" />
    </div>
  )
}

// rasmlarni oldindan yuklab, dekod qilib qo'yamiz (DOM dagi <img> lar ham) — hammasi tugaganda resolve
export function preloadSceneImages(root) {
  const jobs = ['splash-bg', ...SCENE_SLOTS].map((s) => {
    const src = img(s)
    if (!src) return null
    const im = new Image()
    im.decoding = 'async'
    im.src = src
    return im.decode ? im.decode().catch(() => {}) : null
  })
  root?.querySelectorAll('img').forEach((el) => jobs.push(el.decode ? el.decode().catch(() => {}) : null))
  return Promise.all(jobs)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------- Intro
export default function Intro({ onOpen }) {
  const [phase, setPhase] = useState('closed')
  const [splashOk, setSplashOk] = useState(false)
  const timer = useRef(0)
  const root = useRef(null)
  const decoded = useRef(null)
  const busy = useRef(false)
  const splash = img('splash-bg')

  useEffect(() => {
    decoded.current = preloadSceneImages(root.current)
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
      window.scrollTo(0, 0)
    } catch {}
    return () => clearTimeout(timer.current)
  }, [])

  const open = () => {
    if (busy.current) return
    busy.current = true
    playMusic() // sinxron — mobil brauzer audio siyosati uchun
    try { navigator.vibrate?.(15) } catch {}
    if (reducedMotion()) {
      onOpen?.()
      return
    }
    // eshik rasmlari dekod bo'lguncha kutamiz (ko'pi bilan 800 ms), keyin ketma-ketlik boshlanadi
    setPhase('arming')
    Promise.race([decoded.current || Promise.resolve(), sleep(800)]).then(() => {
      setPhase('opening')
      timer.current = setTimeout(() => onOpen?.(), OPEN_MS)
    })
  }

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }

  return (
    <motion.div
      ref={root}
      className={`fixed inset-0 z-50 ${PHOTO ? 'bg-[#0e2c18]' : 'bg-ivory'} ${phase === 'opening' ? 'is-opening' : ''} ${phase === 'arming' ? 'is-arming' : ''}`}
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion() ? 0 : 0.42, ease: [0.4, 0, 0.2, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Taklifnoma"
    >
      <div className="relative mx-auto h-[100svh] max-w-[416px] overflow-hidden">
        <Scene phase={phase === 'opening' ? 'opening' : 'closed'} />
        <div className={`gate ${splash ? 'gate-photo' : ''}`} onClick={open} onKeyDown={onKey}>
          {splash && (
            <div className="gate-bg">
              <img src={splash} alt="" className={`gate-splash ${splashOk ? 'is-in' : ''}`} draggable="false"
                onLoad={() => setSplashOk(true)} onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
          <div className="gate-mist" />
          <div className="gate-content">
            <div className="gate-text">
              <p className="gate-bism" lang="ar">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="gate-dear">HURMATLI</p>
              <h1 className="gate-guest"><span>Mehmonimiz</span></h1>
              <div className="gate-divider" aria-hidden="true">
                <span className="gate-rule" />
                <svg width="14" height="14" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" fill="#D9B963" /><rect x="5" y="5" width="14" height="14" fill="#D9B963" transform="rotate(45 12 12)" /><circle cx="12" cy="12" r="3" fill="#163d27" /></svg>
                <span className="gate-rule gate-rule-r" />
              </div>
            </div>
            <button type="button" className="gate-btn" onClick={(e) => (e.stopPropagation(), open())} aria-label={`Taklifnomani ochish — ${WEDDING.groom} va ${WEDDING.bride}`}>
              <span className="relative">TAKLIFNOMANI OCHISH</span>
              <svg className="relative" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E6CF8E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6" /></svg>
            </button>
          </div>
        </div>
        {!PHOTO && <div className="gate-flash" />}
      </div>
    </motion.div>
  )
}
