import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useScrollTo } from '@/hooks/useScrollTo'
import { Contact } from '@/sections/Contact'
import { Faq } from '@/sections/Faq'
import { Hero } from '@/sections/Hero'
import { Manifesto } from '@/sections/Manifesto'
import { MarqueeBand } from '@/sections/MarqueeBand'
import { Process } from '@/sections/Process'
import { Projects } from '@/sections/Projects'
import { Services } from '@/sections/Services'
import { Spotlight } from '@/sections/Spotlight'

export default function HomePage() {
  const { hash } = useLocation()
  const scrollTo = useScrollTo()

  // Honour deep links such as /#contact (e.g. when arriving from another page).
  useEffect(() => {
    if (!hash) return
    const timer = window.setTimeout(() => scrollTo(hash), 120)
    return () => window.clearTimeout(timer)
  }, [hash, scrollTo])

  useEffect(() => {
    document.title = 'Mat Enseigne — Enseignes, adhésifs & marquage véhicules à Paris'
  }, [])

  return (
    <>
      <Hero />
      <MarqueeBand />
      <Manifesto />
      <Services />
      <Spotlight />
      <Projects />
      <Process />
      <Faq />
      <Contact />
    </>
  )
}
