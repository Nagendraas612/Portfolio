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
}

interface Props {
  settings: SiteSettings
}

import { ScrollRevealPlain } from './ScrollReveal'

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
                {settings.contactHeadline?.includes('\n')
                  ? <>
                      {settings.contactHeadline.split('\n')[0]}<br /><em>{settings.contactHeadline.split('\n')[1]}</em>
                    </>
                  : <>Let&apos;s build<br /><em>something great.</em></>
                }
              </h2>
              <p className="contact-subhead"><ScrollRevealPlain text={settings.contactSubhead} /></p>
              <a href={`mailto:${settings.email}`} className="contact-email-btn">
                <span>{settings.email}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
            <div className="contact-grid reveal reveal-delay-1">
              <div className="contact-col">
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
              <div className="contact-col">
                <h4 className="contact-col-title label">Open to</h4>
                <ul>
                  {settings.openTo?.map((item, i) => (
                    <li key={i}><span className="contact-interest">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="contact-col">
                <h4 className="contact-col-title label">Response info</h4>
                <div className="contact-response-card">
                  <div className="crm-row">
                    <span className="label">Avg. response</span>
                    <strong>{settings.avgResponse}</strong>
                  </div>
                  <div className="crm-row">
                    <span className="label">Location</span>
                    <strong>{settings.location}</strong>
                  </div>
                  <div className="crm-row">
                    <span className="label">Available</span>
                    <span className="avail-green"><span className="avail-dot"></span>Now</span>
                  </div>
                </div>
              </div>
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
