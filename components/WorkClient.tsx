'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface ImpactStat {
  value: string
  label: string
}

interface ProjectWithUrl {
  _id: string
  title: string
  slug: { current: string }
  orderIndex: number
  type: string
  status: string
  year: string
  screenshotUrl: string
  shortDescription: string
  longDescription: string
  tags: string[]
  deployedUrl: string
  githubUrl: string
  impactStats: ImpactStat[]
}

interface SiteSettings {
  name: string
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
  projects: ProjectWithUrl[]
  settings: SiteSettings
}

export default function WorkClient({ projects, settings }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)
  const previewImgRef = useRef<HTMLImageElement>(null)
  const previewDateRef = useRef<HTMLSpanElement>(null)

  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const previewPosRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, scale: 0.85, tScale: 0.85, rot: 0, tRot: 0 })

  const openDetails = useCallback((slug: string) => {
    setActiveProject(slug)
    setDetailsVisible(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeDetails = useCallback(() => {
    setDetailsVisible(false)
    setTimeout(() => { setActiveProject(null) }, 380)
    document.body.style.overflow = ''
  }, [])

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
        if (detailsVisible) {
          closeDetails()
        } else {
          window.location.href = '/'
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [detailsVisible, closeDetails])

  useEffect(() => {
    const pp = previewPosRef.current
    const animate = () => {
      const el = previewRef.current
      if (!el) { requestAnimationFrame(animate); return }
      const dx = pp.tx - pp.x, dy = pp.ty - pp.y
      pp.x += dx * 0.12; pp.y += dy * 0.12
      pp.scale += (pp.tScale - pp.scale) * 0.15
      pp.rot += (pp.tRot - pp.rot) * 0.15
      const speedX = Math.max(-15, Math.min(15, dx * 0.1))
      pp.tRot = speedX * 1.5
      el.style.transform = `translate3d(${pp.x}px, ${pp.y}px, 0) translate(-50%, -50%) scale(${pp.scale}) rotate(${pp.rot}deg)`
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)

    const mm = (e: MouseEvent) => { pp.tx = e.clientX; pp.ty = e.clientY }
    document.addEventListener('mousemove', mm)
    return () => document.removeEventListener('mousemove', mm)
  }, [])

  const handleRowEnter = (proj: ProjectWithUrl, e: React.MouseEvent) => {
    if (previewImgRef.current) previewImgRef.current.src = proj.screenshotUrl
    if (previewDateRef.current) previewDateRef.current.textContent = `${String(proj.orderIndex).padStart(2, '0')} // ${proj.year}`
    previewPosRef.current.tScale = 1
    previewRef.current?.classList.add('visible')
    previewPosRef.current.tx = e.clientX; previewPosRef.current.ty = e.clientY
    previewPosRef.current.x = e.clientX; previewPosRef.current.y = e.clientY
  }

  const handleRowLeave = () => {
    previewPosRef.current.tScale = 0.85
    previewRef.current?.classList.remove('visible')
  }

  const statusClass = (status: string) => {
    if (status === 'completed') return 'status-completed'
    if (status === 'in-development') return 'status-pending'
    return 'status-completed'
  }

  const statusLabel = (status: string) => {
    if (status === 'completed') return 'Completed'
    if (status === 'active') return 'Active'
    if (status === 'in-development') return 'In Development'
    return status
  }

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

      {/* WORK / PROJECTS */}
      <section className="scroll-section" id="section-work">
        <div className="section-inner">
          <div className="section-eyebrow reveal">
            <span className="label">Selected Work</span>
            <span className="section-line"></span>
            <span className="label">({String(projects.length).padStart(2, '0')})</span>
          </div>
          <div className="cyber-projects-list reveal">
            {projects.map((proj) => (
              <div
                key={proj._id}
                className="cyber-project-row"
                data-project={proj.slug.current}
                onClick={() => openDetails(proj.slug.current)}
                onMouseEnter={(e) => handleRowEnter(proj, e)}
                onMouseLeave={handleRowLeave}
                onMouseMove={(e) => { previewPosRef.current.tx = e.clientX; previewPosRef.current.ty = e.clientY }}
              >
                <div className="project-row-left">
                  <span className="project-row-num font-mono">{String(proj.orderIndex).padStart(2, '0')} //</span>
                  <h3 className="project-row-title font-serif">{proj.title}</h3>
                </div>
                <div className="project-row-right font-mono">
                  <span className="project-row-type">{proj.type}</span>
                  <span className="project-row-arrow">➔</span>
                </div>
              </div>
            ))}
          </div>

          {/* Project Details Modal Overlay */}
          <div
            className={`project-details-overlay${detailsVisible ? ' visible' : ''}`}
            id="projectDetailsOverlay"
            onClick={(e) => { if (e.target === e.currentTarget) closeDetails() }}
          >
            {projects.map((proj) => (
              <article
                key={proj._id}
                className={`project-details-card${activeProject === proj.slug.current ? ' active' : ''}`}
                id={`details-${proj.slug.current}`}
              >
                <button className="details-close-btn" aria-label="Close details" onClick={closeDetails}>&times;</button>
                <div className="details-grid">
                  <div className="details-visual">
                    <Image src={proj.screenshotUrl} alt={`${proj.title} Platform`} className="details-img" width={800} height={500} priority={activeProject === proj.slug.current} />
                    <div className="details-visual-shine"></div>
                  </div>
                  <div className="details-info">
                    <div className="details-meta">
                      <span className="work-card-type label">{proj.type}</span>
                      <span className="work-card-year label">{proj.year}</span>
                      <span className={`details-status-badge label ${statusClass(proj.status)}`}>{statusLabel(proj.status)}</span>
                    </div>
                    <h2 className="details-title font-serif">{proj.title}</h2>
                    <p className="details-desc">{proj.longDescription}</p>
                    <div className="details-tags">
                      {proj.tags?.map((tag, i) => <span key={i} className="work-tag">{tag}</span>)}
                    </div>
                    <div className="details-divider"></div>
                    <div className="details-impact">
                      {proj.impactStats?.map((stat, i) => (
                        <div key={i} className="impact-stat">
                          <span className="impact-num">{stat.value}</span>
                          <span className="impact-label label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                    {proj.deployedUrl && (
                      <div className="details-action-group">
                        <a href={proj.deployedUrl} target="_blank" rel="noopener noreferrer" className="details-link-btn">
                          Visit Deployed App <span className="details-arrow">↗</span>
                        </a>
                        {proj.deployedUrl.includes('onrender.com') && (
                          <div className="render-coldstart-notice">
                            <span className="coldstart-pulse"></span>
                            <span className="coldstart-text">
                              This demo is hosted on a free server tier. It may take 30-60 seconds to spin up on the first load.
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="global-footer">
        <div className="footer-inner">
          <span className="footer-copy label">{settings.footerCopyright || `© 2026 ${settings.name}`}</span>
        </div>
      </footer>

      {/* Floating Project Hover Preview */}
      <div className="cyber-hover-preview" id="cyberHoverPreview" ref={previewRef}>
        <div className="cyber-preview-card" id="cyberPreviewCard">
          <div className="cyber-preview-meta font-mono">
            <span className="cyber-preview-date" id="cyberPreviewDate" ref={previewDateRef}>01 // 2025</span>
            <span className="cyber-preview-label">PREVIEW</span>
          </div>
          <div className="cyber-preview-image-wrap">
            <img id="cyberPreviewImage" ref={previewImgRef} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Project Preview" />
          </div>
        </div>
      </div>
    </div>
  )
}
