import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import Intro from './components/Intro'
import { Countdown, Footer, Hero, Invitation, KeyFacts, Venue, Verse } from './components/Sections'
import Rsvp from './components/Rsvp'
import Photos from './components/Photos'
import Host from './components/Host'
import { isPlaying, onMusic, toggleMusic } from './music'
import { ScrollProgress } from './components/Magic'
import CursorMagic from './components/CursorMagic'

function useRoute() {
  const [r, setR] = useState(location.hash)
  useEffect(() => {
    const f = () => setR(location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return r
}

function MusicButton() {
  const [on, setOn] = useState(isPlaying())
  useEffect(() => onMusic(setOn), [])
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onClick={toggleMusic}
      aria-label={on ? "Musiqani o'chirish" : 'Musiqani yoqish'}
      className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-40 flex h-12 items-center gap-2 rounded-full border border-gold-light/50 bg-night/75 px-4 text-gold-light shadow-xl backdrop-blur-md"
    >
      {on ? (
        <span className="eq flex h-4 items-end gap-[3px]">
          <span className="h-4 w-[3px] rounded bg-gold-light" />
          <span className="h-4 w-[3px] rounded bg-gold-light" />
          <span className="h-4 w-[3px] rounded bg-gold-light" />
        </span>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><path d="M2 2l20 20" /></svg>
      )}
      <span className="font-sans text-xs font-bold">{on ? 'Musiqa' : "O'chiq"}</span>
    </motion.button>
  )
}

function Dock() {
  const { scrollY } = useScroll()
  const [show, setShow] = useState(false)
  useEffect(() => scrollY.on('change', (y) => setShow(y > window.innerHeight * 0.8)), [scrollY])
  const btn = 'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3.5 font-sans text-[13px] font-bold transition'
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex max-w-sm gap-1.5 rounded-full border border-gold/30 bg-pearl/90 p-1.5 shadow-2xl shadow-lapis/25 backdrop-blur-xl"
        >
          <a href="#javob" className={`${btn} text-lapis hover:bg-mist`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            Kelaman
          </a>
          <a href="#rasmlar" className={`${btn} bg-lapis text-pearl`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
            Rasm yuklash
          </a>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const route = useRoute()
  // Skip intro on direct links like /#rasmlar (e.g. from a QR code at the venue)
  const [opened, setOpened] = useState(() => /^#(rasmlar|javob)$/.test(location.hash))

  useEffect(() => {
    document.body.style.overflow = opened || route.startsWith('#/mezbon') ? '' : 'hidden'
  }, [opened, route])

  useEffect(() => {
    if (opened && /^#(rasmlar|javob)$/.test(location.hash)) {
      setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 300)
    }
  }, []) // eslint-disable-line

  if (route.startsWith('#/mezbon')) return <Host />

  return (
    <>
      <AnimatePresence>{!opened && <Intro onOpen={() => setOpened(true)} />}</AnimatePresence>
      <main>
        <Hero ready={opened} />
        <KeyFacts />
        <Invitation />
        <Verse />
        <Countdown />
        <Venue />
        <Rsvp />
        <Photos />
        <Footer />
      </main>
      {opened && <ScrollProgress />}
      {opened && <CursorMagic />}
      {opened && <MusicButton />}
      {opened && <Dock />}
    </>
  )
}
