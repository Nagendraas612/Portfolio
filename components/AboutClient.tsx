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
                <ScrollRevealText text={about.role} emphasis={about.roleEmphasis} />
              </p>
              <p className="info-bio reveal scroll-text-block">
                <ScrollRevealText text={about.bio} emphasis={about.bioEmphasis} />
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
                <ScrollRevealText text="Tools and technologies I use to bring ideas to life — from intelligent systems to polished interfaces." emphasis="intelligent systems" />
              </p>
            </div>
            <div className="skills-grid reveal reveal-delay-1">
              {skills.map((cat) => (
                <div key={cat._id} className="skill-column">
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
          <div className="home-footer-left">
            <span className="footer-copy label">© 2026 {settings.name}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
