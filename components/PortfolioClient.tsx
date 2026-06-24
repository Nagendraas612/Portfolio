'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */
interface SiteSettings {
  name: string
  title: string
  metaDescription: string
  heroTagline: string
  heroSubtitle: string
  availabilityText: string
  email: string
  githubUrl: string
  linkedinUrl: string
  contactHeadline: string
  contactSubhead: string
  avgResponse: string
  location: string
  openTo: string[]
}

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

interface SkillCategory {
  _id: string
  title: string
  orderIndex: number
  skills: string[]
}

interface Props {
  settings: SiteSettings | null
  about: About | null
  profilePhotoUrl: string
  projects: ProjectWithUrl[]
  skills: SkillCategory[]
}

/* ═══════════════════════════════════════════════════════════════
   FALLBACK DATA (used when Sanity has no content yet)
   ═══════════════════════════════════════════════════════════════ */
const FALLBACK_SETTINGS: SiteSettings = {
  name: 'Nagendra AS',
  title: 'Nagendra AS — Creative Developer',
  metaDescription: 'CS student specializing in AI, ML',
  heroTagline: 'I build *intelligent systems.*',
  heroSubtitle: 'CS student · AI & ML · VVCE',
  availabilityText: 'Available for opportunities · 2026',
  email: 'nagendraas612@gmail.com',
  githubUrl: 'https://github.com/Nagendraas612',
  linkedinUrl: 'https://linkedin.com/in/nagendraas612',
  contactHeadline: "Let's build\nsomething great.",
  contactSubhead: "CS student with a sharp eye for AI-powered solutions and a bias for shipping. If you have a project, an idea, or an open role — I'm listening.",
  avgResponse: '24h',
  location: 'India',
  openTo: ['Internships', 'Freelancing', 'Open source', 'Project collaborations'],
}

const FALLBACK_ABOUT: About = {
  role: 'CS student & developer, building at the intersection of AI, automation, and thoughtful design.',
  roleEmphasis: 'AI, automation, and thoughtful design.',
  bio: "I care about the intersection of technical precision and real-world impact. Every project I take on — from facial recognition to exam management systems — starts with a question: how can this make someone's day measurably better? I thrive in collaborative environments and believe the best code is the code nobody has to think about.",
  bioEmphasis: "how can this make someone's day measurably better?",
  basedIn: 'India 🇮🇳',
  status: 'Open to work',
  education: 'VVCE · CS',
  focus: 'AI & ML',
}

const FALLBACK_PROJECTS: ProjectWithUrl[] = [
  {
    _id: 'ff-1',
    title: 'FaceFetch',
    slug: { current: 'facefetch' },
    orderIndex: 1,
    type: 'Event Tech Platform',
    status: 'completed',
    year: '2025',
    screenshotUrl: '/assets/FaceFetch.png',
    shortDescription: 'AI-powered event photo retrieval',
    longDescription: 'AI-powered event photo retrieval. Attendees upload a selfie and instantly surface every photo of themselves from thousands of event images — using facial recognition at scale. Built for speed, accuracy, and seamless attendee UX.',
    tags: ['Computer Vision', 'Facial Recognition', 'AI Search', 'UX Design'],
    deployedUrl: 'https://eventai-w89h.onrender.com/',
    githubUrl: '',
    impactStats: [
      { value: '1000s', label: 'Photos scanned' },
      { value: '<2s', label: 'Retrieval time' },
      { value: 'AI', label: 'Face matching' },
    ],
  },
  {
    _id: 'se-2',
    title: 'AIML Exam System',
    slug: { current: 'seating' },
    orderIndex: 2,
    type: 'Education Platform',
    status: 'completed',
    year: '2025',
    screenshotUrl: '/assets/seating.png',
    shortDescription: 'Full-stack examination management platform',
    longDescription: 'Full-stack examination management platform with intelligent seating algorithms, anti-copy pattern generation, OAuth 2.0 secure authentication, and automated PDF generation. Built for academic institutions that need reliability at scale.',
    tags: ['Workflow Automation', 'Smart Algorithms', 'Secure Auth', 'PDF Generation'],
    deployedUrl: 'https://seating-dak2.onrender.com/',
    githubUrl: '',
    impactStats: [
      { value: 'Auto', label: 'Seating logic' },
      { value: 'OAuth', label: 'Secure login' },
      { value: 'PDF', label: 'Auto-generated' },
    ],
  },
]

const FALLBACK_SKILLS: SkillCategory[] = [
  { _id: 's1', title: 'Frontend', orderIndex: 1, skills: ['HTML & CSS', 'JavaScript', 'React.js', 'Responsive Design'] },
  { _id: 's2', title: 'AI & ML', orderIndex: 2, skills: ['Python', 'Machine Learning', 'Computer Vision', 'Data Analysis'] },
  { _id: 's3', title: 'Backend', orderIndex: 3, skills: ['Node.js · Express', 'MongoDB', 'Java', 'REST APIs'] },
  { _id: 's4', title: 'Tools', orderIndex: 4, skills: ['Git · GitHub', 'VS Code', 'Figma', 'Linux'] },
]

/* ═══════════════════════════════════════════════════════════════
   PARTICLE CLASS (Ocean cursor effect)
   ═══════════════════════════════════════════════════════════════ */
class Particle {
  x: number; y: number; size: number; maxAlpha: number
  life: number; decay: number; vx: number; vy: number
  hue: number; sat: number; lit: number

  constructor(x: number, y: number) {
    this.x = x; this.y = y
    this.size = Math.random() * 60 + 30
    this.maxAlpha = Math.random() * 0.04 + 0.01
    this.life = 1
    this.decay = Math.random() * 0.006 + 0.003
    this.vx = (Math.random() - 0.5) * 1.2
    this.vy = (Math.random() - 0.5) * 1.2
    this.hue = 185 + Math.random() * 22
    this.sat = 55 + Math.random() * 28
    this.lit = 35 + Math.random() * 15
  }

  update() {
    this.life -= this.decay
    this.x += this.vx; this.y += this.vy
    this.vx *= 0.98; this.vy *= 0.98
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return
    const a = this.maxAlpha * this.life
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
    g.addColorStop(0, `hsla(${this.hue},${this.sat}%,${this.lit}%,${a})`)
    g.addColorStop(0.5, `hsla(${this.hue},${this.sat}%,${this.lit}%,${(a * 0.4).toFixed(4)})`)
    g.addColorStop(1, `hsla(${this.hue},${this.sat}%,${this.lit}%,0)`)
    ctx.beginPath(); ctx.fillStyle = g
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

/* ═══════════════════════════════════════════════════════════════
   HELPER: Render text with emphasis (fallback for non-scroll areas)
   ═══════════════════════════════════════════════════════════════ */
function renderWithEmphasis(text: string, emphasis: string | undefined) {
  if (!emphasis || !text.includes(emphasis)) {
    return <>{text}</>
  }
  const idx = text.indexOf(emphasis)
  const before = text.slice(0, idx)
  const after = text.slice(idx + emphasis.length)
  return <>{before}<em>{emphasis}</em>{after}</>
}

/* ═══════════════════════════════════════════════════════════════
   HELPER: Scroll-linked word reveal text
   Splits text into word-level <span> elements with emphasis support.
   Each word starts dim and lights up as the user scrolls.
   ═══════════════════════════════════════════════════════════════ */
function ScrollRevealText({ text, emphasis, className }: { text: string; emphasis?: string; className?: string }) {
  // Build a list of { word, isEm } segments
  const segments: { word: string; isEm: boolean }[] = []

  if (emphasis && text.includes(emphasis)) {
    const idx = text.indexOf(emphasis)
    const before = text.slice(0, idx)
    const after = text.slice(idx + emphasis.length)

    before.split(/\s+/).filter(Boolean).forEach(w => segments.push({ word: w, isEm: false }))
    emphasis.split(/\s+/).filter(Boolean).forEach(w => segments.push({ word: w, isEm: true }))
    after.split(/\s+/).filter(Boolean).forEach(w => segments.push({ word: w, isEm: false }))
  } else {
    text.split(/\s+/).filter(Boolean).forEach(w => segments.push({ word: w, isEm: false }))
  }

  return (
    <span className={`scroll-text-block ${className || ''}`} data-scroll-reveal>
      {segments.map((seg, i) => (
        <span key={i} className="scroll-word" data-sw-index={i}>
          {seg.isEm ? <em>{seg.word}</em> : seg.word}
          {i < segments.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

function ScrollRevealPlain({ text, className }: { text: string; className?: string }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <span className={`scroll-text-block ${className || ''}`} data-scroll-reveal>
      {words.map((w, i) => (
        <span key={i} className="scroll-word" data-sw-index={i}>
          {w}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function PortfolioClient({ settings, about, profilePhotoUrl, projects, skills }: Props) {
  const s = settings || FALLBACK_SETTINGS
  const a = about || FALLBACK_ABOUT
  const p = projects.length ? projects : FALLBACK_PROJECTS
  const sk = skills.length ? skills : FALLBACK_SKILLS

  // Refs
  const loaderRef = useRef<HTMLDivElement>(null)
  const oceanCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)
  const waveContainerRef = useRef<HTMLDivElement>(null)
  const heroFirstRef = useRef<HTMLSpanElement>(null)
  const heroLastRef = useRef<HTMLSpanElement>(null)
  const nameWrapperRef = useRef<HTMLDivElement>(null)
  const profileRevealRef = useRef<HTMLDivElement>(null)
  const heroParticlesRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const previewImgRef = useRef<HTMLImageElement>(null)
  const previewDateRef = useRef<HTMLSpanElement>(null)
  
  const timelineRef = useRef<HTMLDivElement>(null)
  const stIndicatorGroupRef = useRef<HTMLDivElement>(null)
  const stLabelRef = useRef<HTMLSpanElement>(null)
  const labelTimeoutRef = useRef<number | null>(null)

  // State
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [detailsVisible, setDetailsVisible] = useState(false)

  // Mutable refs for animation
  const framesRef = useRef<HTMLImageElement[]>([])
  const framesLoadedRef = useRef(0)
  const waveCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastCanvasWRef = useRef(0)
  const lastCanvasHRef = useRef(0)
  const oceanCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const lastSpawnRef = useRef(0)
  const rafScheduledRef = useRef(false)
  const previewPosRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, scale: 0.85, tScale: 0.85, rot: 0, tRot: 0 })

  const FRAME_COUNT = 200
  const FRAME_PATH = '/waves/frame_'
  const FRAME_EXT = '.jpg'


  /* ─── SCROLL PROGRESS ─── */
  const getProgress = useCallback(() => {
    const hero = document.getElementById('hero')
    if (!hero) return 0
    const range = hero.offsetHeight - window.innerHeight
    if (range <= 0) return 0
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    return Math.max(0, Math.min(1, scrollTop / range))
  }, [])

  /* ─── DRAW FRAME ─── */
  const drawFrame = useCallback((idx: number) => {
    const ctx = waveCtxRef.current
    if (!ctx) return
    const img = framesRef.current[idx]
    if (!img || !img.complete || !img.naturalWidth) return
    const canvas = waveCanvasRef.current
    if (!canvas) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = canvas.width / dpr
    const h = canvas.height / dpr
    if (w <= 0 || h <= 0) return
    ctx.clearRect(0, 0, w, h)
    const ia = img.naturalWidth / img.naturalHeight
    const ca = w / h
    let dw: number, dh: number, dx: number, dy: number
    if (ca > ia) { dw = w; dh = w / ia; dx = 0; dy = (h - dh) / 2 }
    else { dh = h; dw = h * ia; dy = 0; dx = (w - dw) / 2 }
    ctx.drawImage(img, dx, dy, dw, dh)
  }, [])

  /* ─── UPDATE HERO (scroll-driven) ─── */
  const updateHero = useCallback(() => {
    rafScheduledRef.current = false
    const prog = getProgress()
    const vw = window.innerWidth
    const vh = window.innerHeight

    let separation = 0, nameOpacity = 1, waveW = 0, waveH = 0, waveOpacity = 0
    let waveBorderRadius = 16, profileOpacity = 0, profileScale = 0.88
    let profilePointerEvents = 'none'

    if (prog <= 0.50) {
      const sf = prog / 0.50
      const ease = 1 - Math.pow(1 - sf, 2)
      separation = ease * Math.min(vw * 0.16, 220)
      const maxW = Math.min(vw * 0.65, 800)
      const maxH = Math.min(vh * 0.50, 500)
      waveW = ease * maxW; waveH = ease * maxH
      waveOpacity = Math.min(1, ease * 1.5)
    } else if (prog <= 0.75) {
      const ff = (prog - 0.50) / 0.25
      const ease = Math.pow(ff, 1.5)
      separation = Math.min(vw * 0.16, 220) + ease * (vw * 0.4)
      nameOpacity = 1 - ff
      const startW = Math.min(vw * 0.65, 800)
      const startH = Math.min(vh * 0.50, 500)
      waveW = startW + (vw - startW) * ease
      waveH = startH + (vh - startH) * ease
      waveOpacity = 1; waveBorderRadius = 16 * (1 - ease)
    } else {
      const rf = (prog - 0.75) / 0.25
      const ease = 1 - Math.pow(1 - rf, 2)
      separation = vw * 0.6; nameOpacity = 0
      waveW = vw * (1 - ease * 0.25); waveH = vh * (1 - ease * 0.25)
      waveOpacity = 1 - ease; waveBorderRadius = ease * 16
      profileOpacity = Math.min(1, rf * 1.5)
      profileScale = 0.88 + ease * 0.12
      profilePointerEvents = rf > 0.5 ? 'all' : 'none'
    }

    if (heroFirstRef.current) {
      heroFirstRef.current.style.right = `calc(50% + ${separation}px)`
      heroFirstRef.current.style.transition = 'none'
    }
    if (heroLastRef.current) {
      heroLastRef.current.style.left = `calc(50% + ${separation}px)`
      heroLastRef.current.style.transition = 'none'
    }
    if (nameWrapperRef.current) nameWrapperRef.current.style.opacity = nameOpacity.toFixed(4)

    const wc = waveContainerRef.current
    if (wc) {
      wc.style.width = waveW.toFixed(1) + 'px'
      wc.style.height = waveH.toFixed(1) + 'px'
      wc.style.opacity = waveOpacity.toFixed(4)
      wc.style.borderRadius = waveBorderRadius.toFixed(1) + 'px'
    }

    const canvas = waveCanvasRef.current
    const ctx = waveCtxRef.current
    const tw = Math.round(waveW), th = Math.round(waveH)
    if (canvas && ctx && tw > 0 && th > 0 && (lastCanvasWRef.current !== tw || lastCanvasHRef.current !== th)) {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = tw * dpr; canvas.height = th * dpr
      canvas.style.width = tw + 'px'; canvas.style.height = th + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastCanvasWRef.current = tw; lastCanvasHRef.current = th
    }

    const frameIdx = Math.min(FRAME_COUNT - 1, Math.round(prog * (FRAME_COUNT - 1)))
    drawFrame(frameIdx)

    if (profileRevealRef.current) {
      profileRevealRef.current.style.opacity = profileOpacity.toFixed(4)
      profileRevealRef.current.style.transform = `translate(-50%, -50%) scale(${profileScale.toFixed(4)})`
      profileRevealRef.current.style.pointerEvents = profilePointerEvents
    }

    if (oceanCanvasRef.current) {
      let co = 0
      if (prog > 0.85) co = ((prog - 0.85) / 0.15) * 0.12
      oceanCanvasRef.current.style.opacity = co.toFixed(4)
    }

    if (navRef.current) {
      const st = window.scrollY || 0
      navRef.current.style.background = st > 60
        ? 'linear-gradient(to bottom,rgba(7,17,26,.96) 0%,rgba(7,17,26,.6) 80%,transparent 100%)'
        : 'transparent'
    }

    // ─── Scroll Timeline sync ───
    const timeline = timelineRef.current
    const indicatorGroup = stIndicatorGroupRef.current
    const label = stLabelRef.current
    if (timeline && indicatorGroup && label) {
      const hero = document.getElementById('hero')
      if (hero) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
        const heroHeight = hero.offsetHeight
        const isPastHero = scrollTop > heroHeight - window.innerHeight * 0.95
        
        if (isPastHero) {
          timeline.style.opacity = '1'
          timeline.style.pointerEvents = 'auto'
          
          const sections = ['section-about', 'section-work', 'section-skills', 'section-contact']
          const sectionNames = ['About', 'Work', 'Skills', 'Contact']
          let activeIndex = 0
          
          const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20
          
          if (isAtBottom) {
            activeIndex = 3
          } else {
            const viewThreshold = window.innerHeight * 0.4
            for (let idx = 0; idx < sections.length; idx++) {
              const el = document.getElementById(sections[idx])
              if (el) {
                const rect = el.getBoundingClientRect()
                if (rect.top <= viewThreshold && rect.bottom > viewThreshold) {
                  activeIndex = idx
                  break
                }
              }
            }
          }
          
          indicatorGroup.style.transform = `translateY(${activeIndex * 60}px)`
          
          const targetLabel = sectionNames[activeIndex]
          if (label.textContent !== targetLabel) {
            label.classList.remove('visible')
            if (labelTimeoutRef.current) window.clearTimeout(labelTimeoutRef.current)
            labelTimeoutRef.current = window.setTimeout(() => {
              label.textContent = targetLabel
              label.classList.add('visible')
            }, 100)
          } else {
            label.classList.add('visible')
          }
        } else {
          timeline.style.opacity = '0'
          timeline.style.pointerEvents = 'none'
          label.classList.remove('visible')
        }
      }
    }
  }, [getProgress, drawFrame])

  /* ─── OPEN / CLOSE PROJECT DETAILS ─── */
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

  /* ─── INIT ALL EFFECTS ─── */
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Reset scroll
    if (history.scrollRestoration) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    // ── Letter split ──
    const splitLetters = (el: HTMLElement | null) => {
      if (!el) return
      const text = el.textContent || ''
      el.textContent = ''
      ;[...text].forEach(ch => {
        const span = document.createElement('span')
        span.className = 'letter'
        span.textContent = ch === ' ' ? '\u00A0' : ch
        el.appendChild(span)
      })
    }
    splitLetters(heroFirstRef.current)
    splitLetters(heroLastRef.current)

    // ── Hero particles ──
    if (heroParticlesRef.current) {
      if (!document.getElementById('heroFloatKF')) {
        const st = document.createElement('style')
        st.id = 'heroFloatKF'
        st.textContent = '@keyframes heroFloat{from{transform:translateY(0) translateX(0)}to{transform:translateY(-28px) translateX(14px)}}'
        document.head.appendChild(st)
      }
      for (let i = 0; i < 28; i++) {
        const d = document.createElement('div')
        d.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;opacity:${(Math.random()*0.16+0.04).toFixed(3)};width:${(Math.random()*3+1.5).toFixed(1)}px;height:${(Math.random()*3+1.5).toFixed(1)}px;background:hsl(${185+Math.random()*22|0},68%,65%);left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*100).toFixed(1)}%;animation:heroFloat ${(6+Math.random()*9).toFixed(1)}s ${(Math.random()*-12).toFixed(1)}s ease-in-out infinite alternate;`
        heroParticlesRef.current.appendChild(d)
      }
    }

    // ── Wave canvas ──
    const waveCanvas = waveCanvasRef.current
    if (waveCanvas) {
      waveCtxRef.current = waveCanvas.getContext('2d')
      const dpr = Math.min(devicePixelRatio || 1, 2)
      waveCanvas.width = 1 * dpr; waveCanvas.height = 1 * dpr
      if (waveCtxRef.current) waveCtxRef.current.scale(dpr, dpr)

      // Load frames
      for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image()
        img.src = FRAME_PATH + String(i).padStart(4, '0') + FRAME_EXT
        img.onload = img.onerror = () => { if (++framesLoadedRef.current === FRAME_COUNT) updateHero() }
        framesRef.current.push(img)
      }
    }

    // ── Ocean cursor ──
    const oc = oceanCanvasRef.current
    if (oc) {
      oceanCtxRef.current = oc.getContext('2d')
      const resizeOcean = () => { oc.width = innerWidth; oc.height = innerHeight }
      resizeOcean()
      window.addEventListener('resize', resizeOcean)

      const handleMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
      document.addEventListener('mousemove', handleMouseMove)

      const loopOcean = () => {
        const ctx = oceanCtxRef.current
        if (!ctx) return
        ctx.clearRect(0, 0, oc.width, oc.height)
        const { x, y } = mouseRef.current
        if (x > 0 && y > 0) {
          const now = Date.now()
          if (now - lastSpawnRef.current > 25) {
            for (let i = 0; i < 3; i++)
              particlesRef.current.push(new Particle(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60))
            lastSpawnRef.current = now
          }
        }
        const parts = particlesRef.current
        for (let i = parts.length - 1; i >= 0; i--) {
          parts[i].update(); parts[i].draw(ctx)
          if (parts[i].life <= 0) parts.splice(i, 1)
        }
        if (parts.length > 160) parts.splice(0, parts.length - 160)
        requestAnimationFrame(loopOcean)
      }
      requestAnimationFrame(loopOcean)

      return () => {
        window.removeEventListener('resize', resizeOcean)
        document.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [updateHero])

  /* ─── Scroll handler ─── */
  useEffect(() => {
    const onScroll = () => {
      if (!rafScheduledRef.current) {
        rafScheduledRef.current = true
        requestAnimationFrame(updateHero)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateHero, { passive: true })
    updateHero()
    if (document.fonts) document.fonts.ready.then(updateHero)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateHero)
    }
  }, [updateHero])

  /* ─── Scroll reveal ─── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.07, rootMargin: '0px 0px -50px 0px' }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  /* ─── Scroll-linked word reveal ─── */
  useEffect(() => {
    const blocks = document.querySelectorAll('[data-scroll-reveal]')
    if (!blocks.length) return

    const updateWords = () => {
      const vh = window.innerHeight
      // The "active zone" — words whose top is above this threshold get activated
      const activateY = vh * 0.78

      blocks.forEach(block => {
        const words = block.querySelectorAll('.scroll-word') as NodeListOf<HTMLElement>
        words.forEach(word => {
          const rect = word.getBoundingClientRect()
          // Word center relative to viewport
          const wordCenter = rect.top + rect.height / 2
          if (wordCenter < activateY) {
            word.classList.add('sw-active')
          } else {
            word.classList.remove('sw-active')
          }
        })
      })
    }

    // Run on load and scroll
    updateWords()
    window.addEventListener('scroll', updateWords, { passive: true })
    window.addEventListener('resize', updateWords, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateWords)
      window.removeEventListener('resize', updateWords)
    }
  }, [])

  /* ─── Nav active highlight ─── */
  useEffect(() => {
    const sections = document.querySelectorAll('.scroll-section')
    const btns = document.querySelectorAll('.nav-btn')
    const io = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id
          btns.forEach(b => b.classList.toggle('active', b.getAttribute('data-section') === id))
        }
      }),
      { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' }
    )
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])

  /* ─── Loader hide ─── */
  useEffect(() => {
    const timer1 = setTimeout(() => {
      loaderRef.current?.classList.add('hidden')
      const timer2 = setTimeout(() => { if (loaderRef.current) loaderRef.current.style.display = 'none' }, 800)
      return () => clearTimeout(timer2)
    }, 1400)
    return () => clearTimeout(timer1)
  }, [])

  /* ─── Project hover preview animation loop ─── */
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

  /* ─── Smooth anchor nav ─── */
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ─── Project row hover handlers ─── */
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

  /* ─── Render status badge class ─── */
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

  /* ═══════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════ */
  return (
    <>
      {/* Loading Screen */}
      <div className="loader" id="loader" ref={loaderRef}>
        <div className="loader-inner">
          <div className="loader-name">
            <span className="loader-n">N</span><span className="loader-rest">agendra A.S.</span>
          </div>
          <div className="loader-bar">
            <div className="loader-bar-fill"></div>
          </div>
        </div>
      </div>

      {/* Ambient cursor canvas */}
      <canvas className="ocean-cursor-canvas" id="oceanCursorCanvas" ref={oceanCanvasRef}></canvas>

      {/* Nav Bar */}
      <nav className="site-nav" id="siteNav" ref={navRef}>
        <a className="nav-logo" href="#hero" onClick={(e) => handleNavClick(e, '#hero')}>
          NA<span className="nav-dot">.</span>
        </a>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-sticky-inner">
          <div className="hero-particles" id="heroParticles" ref={heroParticlesRef}></div>
          <div className="hero-content">
            <div className="hero-eyebrow reveal-instant">
              <span className="hero-status-dot"></span>
              <span>{s.availabilityText}</span>
            </div>
            <div className="hero-name-wrapper" ref={nameWrapperRef}>
              <div className="hero-name-single-line">
                <span className="hero-word hero-word--first" id="heroFirstName" ref={heroFirstRef}>
                  {(s.name.split(' ')[0] || 'Nagendra').split('').map((char, i) => (
                    <span key={i} className="letter">{char === ' ' ? '\u00A0' : char}</span>
                  ))}
                </span>
                <span className="hero-word hero-word--last" id="heroLastName" ref={heroLastRef}>
                  {(() => {
                    let lastName = s.name.split(' ').slice(1).join(' ') || 'A.S';
                    if (lastName.endsWith('.')) {
                      lastName = lastName.slice(0, -1);
                    }
                    return lastName.split('').map((char, i) => (
                      <span key={i} className="letter">{char === ' ' ? '\u00A0' : char}</span>
                    ));
                  })()}
                  <span className="hero-dot">.</span>
                </span>
              </div>
              <div className="wave-scroll-container" id="waveScrollContainer" ref={waveContainerRef}>
                <canvas className="wave-scroll-canvas" id="waveScrollCanvas" ref={waveCanvasRef}></canvas>
              </div>
            </div>
            <div className="hero-profile-reveal" id="heroProfileReveal" ref={profileRevealRef}>
              <div className="ocean-cloud-bg">
                <div className="ocean-blob ob-1"></div>
                <div className="ocean-blob ob-2"></div>
                <div className="ocean-blob ob-3"></div>
              </div>
              <p className="hero-phrase">
                {s.heroTagline?.includes('*')
                  ? <>
                      {s.heroTagline.split('*')[0]}
                      <em>{s.heroTagline.split('*')[1]}</em>
                      {s.heroTagline.split('*')[2] || ''}
                    </>
                  : <>I build <em>intelligent systems.</em></>
                }
              </p>
            </div>
            <div className="hero-bottom-bar reveal-instant">
              <div className="hbb-left">
                <span>→ V1.0</span>
              </div>
              <div className="hbb-center">
                <a href={`mailto:${s.email}`} className="hbb-link">Email</a>
                <span className="hbb-divider">/</span>
                {s.linkedinUrl && (
                  <>
                    <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hbb-link">LinkedIn</a>
                    <span className="hbb-divider">/</span>
                  </>
                )}
                {s.githubUrl && (
                  <a href={s.githubUrl} target="_blank" rel="noopener noreferrer" className="hbb-link">GitHub</a>
                )}
              </div>
              <div className="hbb-right">
                <a href="/about" className="hbb-page-link">About</a>
                <a href="/work" className="hbb-page-link">Work</a>
                <a href="/contact" className="hbb-page-link">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                <ScrollRevealText text={a.role} emphasis={a.roleEmphasis} />
              </p>
              <p className="info-bio reveal scroll-text-block">
                <ScrollRevealText text={a.bio} emphasis={a.bioEmphasis} />
              </p>
            </div>
            <div className="info-photo-area reveal">
              <div className="info-photo">
                <img src={profilePhotoUrl} alt={s.name} className="profile-img" />
                <div className="info-photo-corner tl"></div>
                <div className="info-photo-corner tr"></div>
                <div className="info-photo-corner bl"></div>
                <div className="info-photo-corner br"></div>
              </div>
              <div className="info-status">
                <div className="info-status-row">
                  <span className="info-status-label label">Based in</span>
                  <span className="info-status-value">{a.basedIn}</span>
                </div>
                <div className="info-status-row">
                  <span className="info-status-label label">Status</span>
                  <span className="info-status-value availability-badge">
                    <span className="avail-dot"></span>{a.status}
                  </span>
                </div>
                <div className="info-status-row">
                  <span className="info-status-label label">Education</span>
                  <span className="info-status-value">{a.education}</span>
                </div>
                <div className="info-status-row">
                  <span className="info-status-label label">Focus</span>
                  <span className="info-status-value">{a.focus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK / PROJECTS */}
      <section className="scroll-section" id="section-work">
        <div className="section-inner">
          <div className="section-eyebrow reveal">
            <span className="label">Selected Work</span>
            <span className="section-line"></span>
            <span className="label">({String(p.length).padStart(2, '0')})</span>
          </div>
          <div className="cyber-projects-list reveal">
            {p.map((proj) => (
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
            {p.map((proj) => (
              <article
                key={proj._id}
                className={`project-details-card${activeProject === proj.slug.current ? ' active' : ''}`}
                id={`details-${proj.slug.current}`}
              >
                <button className="details-close-btn" aria-label="Close details" onClick={closeDetails}>&times;</button>
                <div className="details-grid">
                  <div className="details-visual">
                    <img src={proj.screenshotUrl} alt={`${proj.title} Platform`} className="details-img" />
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
                      <a href={proj.deployedUrl} target="_blank" rel="noopener noreferrer" className="details-link-btn">
                        Visit Deployed App <span className="details-arrow">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
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
              {sk.map((cat) => (
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
                {s.contactHeadline?.includes('\n')
                  ? <>
                      {s.contactHeadline.split('\n')[0]}<br /><em>{s.contactHeadline.split('\n')[1]}</em>
                    </>
                  : <>Let&apos;s build<br /><em>something great.</em></>
                }
              </h2>
              <p className="contact-subhead"><ScrollRevealPlain text={s.contactSubhead} /></p>
              <a href={`mailto:${s.email}`} className="contact-email-btn">
                <span>{s.email}</span>
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
                    <a href={`mailto:${s.email}`} className="contact-item-link">
                      <span>Email</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                    </a>
                  </li>
                  {s.linkedinUrl && (
                    <li>
                      <a href={s.linkedinUrl} target="_blank" rel="noopener" className="contact-item-link">
                        <span>LinkedIn</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10" /></svg>
                      </a>
                    </li>
                  )}
                  {s.githubUrl && (
                    <li>
                      <a href={s.githubUrl} target="_blank" rel="noopener" className="contact-item-link">
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
                  {s.openTo?.map((item, i) => (
                    <li key={i}><span className="contact-interest">{item}</span></li>
                  ))}
                </ul>
              </div>
              <div className="contact-col">
                <h4 className="contact-col-title label">Response info</h4>
                <div className="contact-response-card">
                  <div className="crm-row">
                    <span className="label">Avg. response</span>
                    <strong>{s.avgResponse}</strong>
                  </div>
                  <div className="crm-row">
                    <span className="label">Location</span>
                    <strong>{s.location}</strong>
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
            {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noopener" className="footer-link">GitHub ↗</a>}
            {s.linkedinUrl && <a href={s.linkedinUrl} target="_blank" rel="noopener" className="footer-link">LinkedIn ↗</a>}
          </div>
          <div className="home-footer-right">
            <span className="footer-copy label">© 2026 {s.name}</span>
          </div>
        </div>
      </footer>

      {/* Scroll Timeline */}
      <div className="scroll-timeline" id="scrollTimeline" ref={timelineRef}>
        <div className="st-track"></div>
        <div className="st-anchors">
          <a href="#section-about" onClick={(e) => handleNavClick(e, '#section-about')} className="st-anchor" style={{ top: '0px' }} aria-label="Scroll to About"></a>
          <a href="#section-work" onClick={(e) => handleNavClick(e, '#section-work')} className="st-anchor" style={{ top: '60px' }} aria-label="Scroll to Work"></a>
          <a href="#section-skills" onClick={(e) => handleNavClick(e, '#section-skills')} className="st-anchor" style={{ top: '120px' }} aria-label="Scroll to Skills"></a>
          <a href="#section-contact" onClick={(e) => handleNavClick(e, '#section-contact')} className="st-anchor" style={{ top: '180px' }} aria-label="Scroll to Contact"></a>
        </div>
        <div className="st-indicator-group" ref={stIndicatorGroupRef}>
          <span className="st-label" ref={stLabelRef}>About</span>
          <div className="st-indicator-bar"></div>
        </div>
      </div>

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
    </>
  )
}
