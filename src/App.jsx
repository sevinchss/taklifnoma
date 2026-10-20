import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Intro from './components/Intro'
import FloatingButtons from './components/FloatingButtons'
import Hero from './components/Hero'
import { Names, Ayah, Hadith, NightScene, Family } from './components/sections/Top'
import { Calendar, Countdown } from './components/sections/Dates'
import { Contacts, Toyona, Table, Memories, Footer } from './components/sections/Bottom'
import Photos from './components/Photos'
import Host from './components/Host'

function useRoute() {
  const [r, setR] = useState(location.hash)
  useEffect(() => {
    const f = () => setR(location.hash)
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return r
}

// Sahifa tartibi videodagidek:
// darvoza → eshik → hero → ismlar → oyat → kalendar → taymer → hadis → tungi masjid →
// ma'lumot uchun → to'yona → hurmat bilan → stol → xotira lavhalari → suratlar → pastki qism
export default function App() {
  const route = useRoute()
  // QR koddan to'g'ridan-to'g'ri /#rasmlar yoki /#javob ochilsa, kirishni o'tkazib yuboramiz
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
      <main className="page">
        <Hero ready={opened} />
        <Names />
        <Ayah />
        <Calendar />
        <Countdown />
        <Hadith />
        <NightScene />
        <Contacts />
        <Toyona />
        <Family />
        <Table />
        <Memories />
        <Photos />
        <Footer />
      </main>
      {opened && <FloatingButtons />}
    </>
  )
}
