'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface About {
  role: string
  roleEmphasis: string
  bio: string
  bioEmphasis: string
  basedIn: string
  status: string
  education: string
  focus: string
}

interface SkillCategory {
  _id: string
  title: string
  orderIndex: number
  skills: string[]
}

interface SiteSettings {
  name: string
  email: string
  footerCopyright?: string
}

interface Props {
  about: About
  skills: SkillCategory[]
  profilePhotoUrl: string
  settings: SiteSettings
}

import { ScrollRevealText } from './ScrollReveal'

export default function AboutClient({ about, skills, profilePhotoUrl, settings }: Props) {
  useEffect(() => {
    // ─── Scroll reveal observer ───
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.href = '/'
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  /* ─── Scroll-linked word reveal ─── */
  useEffect(() => {
    const blocks = document.querySelectorAll('[data-scroll-reveal]')
    if (!blocks.length) return

    const updateWords = () => {
      const vh = window.innerHeight
      const activateY = vh * 0.78

      blocks.forEach(block => {
        const words = block.querySelectorAll('.scroll-word') as NodeListOf<HTMLElement>
        words.forEach(word => {
          const rect = word.getBoundingClientRect()
          const wordCenter = rect.top + rect.height / 2
          if (wordCenter < activateY) {
            word.classList.add('sw-active')
          } else {
            word.classList.remove('sw-active')
          }
        })
      })
    }

    updateWords()
    window.addEventListener('scroll', updateWords, { passive: true })
    window.addEventListener('resize', updateWords, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateWords)
      window.removeEventListener('resize', updateWords)
    }
  }, [])

  return (
    <div className="subpage-container">
      {/* Subpage Nav */}
      <nav className="site-nav" id="siteNav">
        <a className="nav-logo" href="/">
          NA<span className="nav-dot">.</span>
        </a>
        <a className="nav-back-link font-mono" href="/">
          [ Back to Home ]
        </a>
      </nav>

      {/* ABOUT */}
      <section className="scroll-section" id="section-about">
        <div className="section-inner">
          <div className="section-eyebrow reveal">
            <span className="label">About me</span>
            <span className="section-line"></span>
          </div>
          <div className="about-layout">
            <div className="info-content">
              <p className="info-role reveal scroll-text-block">
                <ScrollRevealText text={about.role} emphasis={about.roleEmphasis} isStatic={false} />
              </p>
              <p className="info-bio reveal scroll-text-block">
                <ScrollRevealText text={about.bio} emphasis={about.bioEmphasis} isStatic={false} />
              </p>
            </div>
            <div className="info-photo-area reveal">
              <div className="info-photo">
                <Image src={profilePhotoUrl} alt={settings.name} className="profile-img" width={600} height={800} priority />
                <div className="info-photo-corner tl"></div>
                <div className="info-photo-corner tr"></div>
                <div className="info-photo-corner bl"></div>
                <div className="info-photo-corner br"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="scroll-section" id="section-skills">
        <div className="section-inner">
          <div className="section-eyebrow reveal">
            <span className="label">Capabilities</span>
            <span className="section-line"></span>
          </div>
          <div className="skills-layout">
            <div className="skills-intro reveal scroll-text-block">
              <p className="skills-intro-text">
                <ScrollRevealText text="Tools and technologies I use to bring ideas to life — from intelligent systems to polished interfaces." emphasis="intelligent systems" isStatic={false} />
              </p>
            </div>
            <div className="skills-grid">
              {skills.map((cat, index) => (
                <div key={cat._id} className={`skill-column reveal${index > 0 ? ` reveal-delay-${index}` : ''}`}>
                  <h4 className="skill-col-title">{cat.title}</h4>
                  <ul>
                    {cat.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="global-footer">
        <div className="footer-inner">
          <span className="footer-copy label">{settings.footerCopyright || `© 2026 ${settings.name}`}</span>
        </div>
      </footer>
    </div>
  )
}
