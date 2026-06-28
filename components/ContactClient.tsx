'use client'

import { useEffect } from 'react'

interface SiteSettings {
  name: string
  email: string
  githubUrl: string
  linkedinUrl: string
  contactHeadline: string
  contactSubhead: string
  avgResponse: string
  location: string
  openTo: string[]
  footerCopyright?: string
  contactWorkDetailsTitle?: string
  contactWorkModeLabel?: string
  contactWorkModeValue?: string
  contactCollabLabel?: string
  contactCollabValue?: string
  contactBasedInLabel?: string
  contactBasedInValue?: string
  contactShowStatusDot?: boolean
}

interface Props {
  settings: SiteSettings
}

import { ScrollRevealPlain, ScrollRevealText } from './ScrollReveal'

export default function ContactClient({ settings }: Props) {
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

      {/* CONTACT */}
      <section className="scroll-section" id="section-contact">
        <div className="section-inner">
          <div className="section-eyebrow reveal">
            <span className="label">Get in touch</span>
            <span className="section-line"></span>
          </div>
          <div className="contact-body">
            <div className="contact-headline reveal">
              <h2 className="contact-big">
                {settings.contactHeadline?.includes('\n') ? (
                  <>
                    <ScrollRevealPlain text={settings.contactHeadline.split('\n')[0]} isStatic={false} />
                    <br />
                    <ScrollRevealText text={settings.contactHeadline.split('\n')[1]} emphasis={settings.contactHeadline.split('\n')[1]} isStatic={false} />
                  </>
                ) : (
                  <>
                    <ScrollRevealPlain text="Let's build" isStatic={false} />
                    <br />
                    <ScrollRevealText text="something great." emphasis="something great." isStatic={false} />
                  </>
                )}
              </h2>
              <p className="contact-subhead"><ScrollRevealPlain text={settings.contactSubhead} isStatic={false} /></p>
            </div>
            <div className="contact-grid">
              <div className="contact-col reveal">
                <h4 className="contact-col-title label">Find me at</h4>
                <ul>
                  <li>
                    <a href={`mailto:${settings.email}`} className="contact-item-link">
                      <span>Email</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </a>
                  </li>
                  {settings.linkedinUrl && (
                    <li>
                      <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-item-link">
                        <span>LinkedIn</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                      </a>
                    </li>
                  )}
                  {settings.githubUrl && (
                    <li>
                      <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="contact-item-link">
                        <span>GitHub</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div className="contact-col reveal reveal-delay-1">
                <h4 className="contact-col-title label">Open to</h4>
                <ul>
                  {settings.openTo?.map((item, i) => (
                    <li key={i}><span className="contact-interest">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="contact-col reveal reveal-delay-2">
                <h4 className="contact-col-title label">{settings.contactWorkDetailsTitle || "WORK DETAILS"}</h4>
                <ul className="contact-work-details-list">
                  <li className="crm-row-flat">
                    <span className="contact-info-label label">{settings.contactWorkModeLabel || "WORK MODE"}</span>
                    <strong className="contact-info-value">{settings.contactWorkModeValue || "Remote"}</strong>
                  </li>
                  <li className="crm-row-flat">
                    <span className="contact-info-label label">{settings.contactCollabLabel || "COLLABORATION"}</span>
                    <strong className="contact-info-value">{settings.contactCollabValue || "Open Worldwide"}</strong>
                  </li>
                  <li className="crm-row-flat">
                    <span className="contact-info-label label">{settings.contactBasedInLabel || "BASED IN"}</span>
                    {settings.contactShowStatusDot ? (
                      <span className="avail-green"><span className="avail-dot"></span>{settings.contactBasedInValue || "Mysuru, India"}</span>
                    ) : (
                      <strong className="contact-info-value">{settings.contactBasedInValue || "Mysuru, India"}</strong>
                    )}
                  </li>
                </ul>
              </div>
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
