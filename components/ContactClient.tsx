'use client'

import { useEffect, useState } from 'react'

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
  // Contact Form State
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      setFormStatus('error')
      setFormError('All fields are required.')
      return
    }
    if (!formEmail.includes('@')) {
      setFormStatus('error')
      setFormError('Please enter a valid email address.')
      return
    }

    setFormStatus('submitting')
    setFormError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message.')
      }

      setFormStatus('success')
      setFormName('')
      setFormEmail('')
      setFormMessage('')
    } catch (err: any) {
      setFormStatus('error')
      setFormError(err.message || 'Something went wrong. Please try again.')
    }
  }

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
        <div className="section-inner contact-page-inner">
          <div className="contact-form-wrapper reveal">
            <h2 className="contact-form-title font-serif">Drop a Message</h2>
            <p className="contact-form-subtitle font-mono">Let's build something great together</p>
            <form onSubmit={handleFormSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label label">Name</label>
                <input
                  type="text"
                  id="contact-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your name"
                  className="form-input"
                  disabled={formStatus === 'submitting'}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email" className="form-label label">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Your email address"
                  className="form-input"
                  disabled={formStatus === 'submitting'}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message" className="form-label label">Message</label>
                <textarea
                  id="contact-message"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Tell me about your project, role, or ideas..."
                  className="form-textarea"
                  rows={5}
                  disabled={formStatus === 'submitting'}
                  required
                />
              </div>
              
              {formStatus === 'error' && (
                <div className="form-feedback error-feedback font-mono">
                  <span className="feedback-icon">⚠️</span> {formError}
                </div>
              )}
              
              {formStatus === 'success' && (
                <div className="form-feedback success-feedback font-mono">
                  <span className="feedback-icon">✓</span> Message sent successfully! I will get back to you shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className={`form-submit-btn ${formStatus === 'submitting' ? 'submitting' : ''}`}
              >
                <span className="btn-text">
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </span>
                {formStatus !== 'submitting' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="btn-icon">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="global-footer">
        <div className="footer-inner" style={{ justifyContent: 'center' }}>
          <span className="footer-copy label">{settings.footerCopyright || `© 2026 ${settings.name}`}</span>
        </div>
      </footer>
    </div>
  )
}
