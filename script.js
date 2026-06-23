/* ============================================================
   PORTFOLIO — Luke Baffait-style scroll-driven hero
   Names split apart · Wave grows between them · Profile reveal
   ============================================================ */

(function () {
  'use strict';

  if (history.scrollRestoration) history.scrollRestoration = 'manual';

  /* ── DOM refs ──────────────────────────────────────────── */
  const loader          = document.getElementById('loader');
  const heroFirstName   = document.getElementById('heroFirstName');
  const heroLastName    = document.getElementById('heroLastName');
  const waveCanvas      = document.getElementById('waveScrollCanvas');
  const waveContainer   = document.getElementById('waveScrollContainer');
  const oceanCanvas     = document.getElementById('oceanCursorCanvas');
  const heroParticles   = document.getElementById('heroParticles');
  const siteNav         = document.getElementById('siteNav');
  const profileReveal   = document.getElementById('heroProfileReveal');
  const nameWrapper     = document.querySelector('.hero-name-wrapper');
  const scrollTimeline  = document.getElementById('scrollTimeline');
  const stIndicatorGroup = document.getElementById('stIndicatorGroup');
  const stLabel         = document.getElementById('stLabel');
  const projectRows      = document.querySelectorAll('.cyber-project-row');
  const detailsOverlay   = document.getElementById('projectDetailsOverlay');
  const detailsCards     = document.querySelectorAll('.project-details-card');


  /* ── Wave config ───────────────────────────────────────── */
  const FRAME_COUNT = 200;
  const FRAME_PATH  = 'waves/frame_';
  const FRAME_EXT   = '.jpg';
  const frames      = [];
  let framesLoaded  = 0;
  let waveCtx       = null;
  let lastCanvasW   = 0;
  let lastCanvasH   = 0;

  /* ── Ocean cursor ──────────────────────────────────────── */
  let oceanCtx      = null;
  let particles     = [];
  let mouseX        = -1000, mouseY = -1000;
  let lastSpawn     = 0;


  /* ── Scroll state ──────────────────────────────────────── */
  let rafScheduled = false;

  /* ══════════════════════════════════════════════════════════
     SCROLL PROGRESS
  ══════════════════════════════════════════════════════════ */
  function getProgress() {
    const hero = document.getElementById('hero');
    if (!hero) return 0;
    const range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const p = Math.max(0, Math.min(1, scrollTop / range));
    console.log('[DEBUG getProgress] scrollTop:', scrollTop, 'range:', range, 'p:', p);
    return p;
  }

  /* ══════════════════════════════════════════════════════════
     HERO SCROLL EFFECTS  — the core of the Luke Baffait look
  ══════════════════════════════════════════════════════════ */
  function updateHero() {
    rafScheduled = false;
    const p = getProgress();
    console.log('[DEBUG updateHero] p:', p);

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let separation = 0;
    let nameOpacity = 1;
    let waveW = 0;
    let waveH = 0;
    let waveOpacity = 0;
    let waveBorderRadius = 16;
    let profileOpacity = 0;
    let profileScale = 0.88;
    let profilePointerEvents = 'none';

    // ── Phase 1 (0.0 to 0.50): Name split & wave growth ──────────────────
    if (p <= 0.50) {
      const splitFactor = p / 0.50;
      const ease = 1 - Math.pow(1 - splitFactor, 2); // ease-out quad
      
      separation = ease * Math.min(vw * 0.16, 220); // max 16vw or 220px separation each side
      nameOpacity = 1;
      
      const maxW = Math.min(vw * 0.65, 800);
      const maxH = Math.min(vh * 0.50, 500);
      
      waveW = ease * maxW;
      waveH = ease * maxH;
      waveOpacity = Math.min(1, ease * 1.5);
      waveBorderRadius = 16;
      
      profileOpacity = 0;
      profileScale = 0.88;
      profilePointerEvents = 'none';
    }
    // ── Phase 2 (0.50 to 0.75): Wave cover viewport, name fade ───────────
    else if (p <= 0.75) {
      const fadeFactor = (p - 0.50) / 0.25;
      const ease = Math.pow(fadeFactor, 1.5); // ease-in/out
      
      // push names further off-screen
      separation = Math.min(vw * 0.16, 220) + ease * (vw * 0.4);
      nameOpacity = 1 - fadeFactor;
      
      const startW = Math.min(vw * 0.65, 800);
      const startH = Math.min(vh * 0.50, 500);
      
      waveW = startW + (vw - startW) * ease;
      waveH = startH + (vh - startH) * ease;
      waveOpacity = 1;
      waveBorderRadius = 16 * (1 - ease); // animate border radius to 0px
      
      profileOpacity = 0;
      profileScale = 0.88;
      profilePointerEvents = 'none';
    }
    // ── Phase 3 (0.75 to 1.0): Wave shrink & Profile reveal ──────────────
    else {
      const revealFactor = (p - 0.75) / 0.25;
      const ease = 1 - Math.pow(1 - revealFactor, 2); // ease-out quad
      
      separation = vw * 0.6; // names fully hidden off-screen
      nameOpacity = 0;
      
      waveW = vw * (1 - ease * 0.25); // shrink wave back down to 75%
      waveH = vh * (1 - ease * 0.25);
      waveOpacity = 1 - ease;
      waveBorderRadius = ease * 16;
      
      profileOpacity = Math.min(1, revealFactor * 1.5);
      profileScale = 0.88 + ease * 0.12;
      profilePointerEvents = revealFactor > 0.5 ? 'all' : 'none';
    }

    /* ── Apply positions ── */
    if (heroFirstName) {
      heroFirstName.style.right = `calc(50% + ${separation}px)`;
      heroFirstName.style.transition = 'none';
    }
    if (heroLastName) {
      heroLastName.style.left = `calc(50% + ${separation}px)`;
      heroLastName.style.transition = 'none';
    }
    if (nameWrapper) {
      nameWrapper.style.opacity = nameOpacity.toFixed(4);
    }

    if (waveContainer) {
      waveContainer.style.width = waveW.toFixed(1) + 'px';
      waveContainer.style.height = waveH.toFixed(1) + 'px';
      waveContainer.style.opacity = waveOpacity.toFixed(4);
      waveContainer.style.borderRadius = waveBorderRadius.toFixed(1) + 'px';
    }

    /* ── Sync canvas size to container ── */
    const targetW = Math.round(waveW);
    const targetH = Math.round(waveH);
    if (waveCanvas && waveCtx && targetW > 0 && targetH > 0 && (lastCanvasW !== targetW || lastCanvasH !== targetH)) {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      waveCanvas.width = targetW * dpr;
      waveCanvas.height = targetH * dpr;
      waveCanvas.style.width = targetW + 'px';
      waveCanvas.style.height = targetH + 'px';
      waveCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastCanvasW = targetW;
      lastCanvasH = targetH;
    }

    /* ── Frame index ── */
    const frameIdx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
    drawFrame(frameIdx);

    /* ── Profile card reveal ── */
    if (profileReveal) {
      profileReveal.style.opacity = profileOpacity.toFixed(4);
      profileReveal.style.transform = `translate(-50%, -50%) scale(${profileScale.toFixed(4)})`;
      profileReveal.style.pointerEvents = profilePointerEvents;
    }

    /* ── Sync cursor canvas opacity to show it only after scroll is complete ── */
    if (oceanCanvas) {
      let cursorOpacity = 0;
      if (p > 0.85) {
        const factor = (p - 0.85) / 0.15; // 0 to 1
        cursorOpacity = factor * 0.12;    // max opacity 12% for a very subtle ambient look
      }
      oceanCanvas.style.opacity = cursorOpacity.toFixed(4);
    }

    /* ── Sync scroll timeline overall opacity with smooth fade-out at footer ── */
    if (scrollTimeline) {
      if (p >= 0.75) {
        const docH = document.documentElement.scrollHeight;
        const winH = window.innerHeight;
        const scrT = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const distToBottom = docH - winH - scrT;

        let timelineOpacity = 1;
        if (distToBottom < 450) {
          // Fade out smoothly over the last 450px of scroll
          timelineOpacity = Math.max(0, distToBottom / 450);
        }
        scrollTimeline.style.opacity = timelineOpacity.toFixed(4);
        scrollTimeline.style.pointerEvents = timelineOpacity > 0.1 ? 'all' : 'none';
      } else {
        scrollTimeline.style.opacity = '0';
        scrollTimeline.style.pointerEvents = 'none';
      }
    }

    /* ── Nav background ── */
    if (siteNav) {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      siteNav.style.background = scrollTop > 60
        ? 'linear-gradient(to bottom,rgba(7,17,26,.96) 0%,rgba(7,17,26,.6) 80%,transparent 100%)'
        : 'transparent';
    }
  }

  /* ══════════════════════════════════════════════════════════
     WAVE CANVAS
  ══════════════════════════════════════════════════════════ */
  function initWaveCanvas() {
    if (!waveCanvas) return;
    waveCtx = waveCanvas.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = 1, h = 1;              // starts tiny; resized in updateHero
    waveCanvas.width  = w * dpr;
    waveCanvas.height = h * dpr;
    waveCtx.scale(dpr, dpr);
  }

  function drawFrame(idx) {
    if (!waveCtx) return;
    const img = frames[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w   = waveCanvas.width  / dpr;
    const h   = waveCanvas.height / dpr;
    if (w <= 0 || h <= 0) return;
    waveCtx.clearRect(0, 0, w, h);
    // cover fit
    const ia = img.naturalWidth / img.naturalHeight;
    const ca = w / h;
    let dw, dh, dx, dy;
    if (ca > ia) { dw = w; dh = w / ia; dx = 0;           dy = (h - dh) / 2; }
    else         { dh = h; dw = h * ia; dy = 0;           dx = (w - dw) / 2; }
    waveCtx.drawImage(img, dx, dy, dw, dh);
  }

  function loadFrames() {
    if (!waveCanvas) return;
    initWaveCanvas();
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH + String(i).padStart(4, '0') + FRAME_EXT;
      img.onload  = img.onerror = () => { if (++framesLoaded === FRAME_COUNT) updateHero(); };
      frames.push(img);
    }
  }

  /* ══════════════════════════════════════════════════════════
     OCEAN CURSOR
  ══════════════════════════════════════════════════════════ */
  class Particle {
    constructor(x, y) {
      this.x = x; this.y = y;
      this.size     = Math.random() * 60 + 30; // smaller ambient size
      this.maxAlpha = Math.random() * .04  + .01; // much lower alpha for subtleness
      this.life     = 1;
      this.decay    = Math.random() * .006 + .003;
      this.vx       = (Math.random() - .5) * 1.2;
      this.vy       = (Math.random() - .5) * 1.2;
      this.hue      = 185 + Math.random() * 22;
      this.sat      = 55  + Math.random() * 28;
      this.lit      = 35  + Math.random() * 15;
    }
    update() {
      this.life -= this.decay;
      this.x += this.vx; this.y += this.vy;
      this.vx *= .98;    this.vy *= .98;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      const a = this.maxAlpha * this.life;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      g.addColorStop(0,   `hsla(${this.hue},${this.sat}%,${this.lit}%,${a})`);
      g.addColorStop(.5,  `hsla(${this.hue},${this.sat}%,${this.lit}%,${(a*.4).toFixed(4)})`);
      g.addColorStop(1,   `hsla(${this.hue},${this.sat}%,${this.lit}%,0)`);
      ctx.beginPath(); ctx.fillStyle = g;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function setupOceanCursor() {
    if (!oceanCanvas) return;
    oceanCtx = oceanCanvas.getContext('2d');
    const resize = () => { oceanCanvas.width = innerWidth; oceanCanvas.height = innerHeight; };
    resize();
    addEventListener('resize', resize);
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    loopOcean();
  }

  function loopOcean() {
    if (!oceanCtx) return;
    oceanCtx.clearRect(0, 0, oceanCanvas.width, oceanCanvas.height);
    if (mouseX > 0 && mouseY > 0) {
      const now = Date.now();
      if (now - lastSpawn > 25) {
        for (let i = 0; i < 3; i++)
          particles.push(new Particle(mouseX + (Math.random()-.5)*60, mouseY + (Math.random()-.5)*60));
        lastSpawn = now;
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(); particles[i].draw(oceanCtx);
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    if (particles.length > 160) particles.splice(0, particles.length - 160);
    requestAnimationFrame(loopOcean);
  }

  /* ══════════════════════════════════════════════════════════
     LETTER SPLIT
  ══════════════════════════════════════════════════════════ */
  function splitLetters() {
    [heroFirstName, heroLastName].forEach(el => {
      if (!el) return;
      const text = el.textContent;
      el.textContent = '';
      [...text].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'letter';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(s);
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     PARTICLES
  ══════════════════════════════════════════════════════════ */
  function setupHeroParticles() {
    if (!heroParticles) return;
    if (!document.getElementById('heroFloatKF')) {
      const s = document.createElement('style');
      s.id = 'heroFloatKF';
      s.textContent = '@keyframes heroFloat{from{transform:translateY(0) translateX(0)}to{transform:translateY(-28px) translateX(14px)}}';
      document.head.appendChild(s);
    }
    for (let i = 0; i < 28; i++) {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;
        opacity:${(Math.random()*.16+.04).toFixed(3)};
        width:${(Math.random()*3+1.5).toFixed(1)}px;
        height:${(Math.random()*3+1.5).toFixed(1)}px;
        background:hsl(${185+Math.random()*22|0},68%,65%);
        left:${(Math.random()*100).toFixed(1)}%;
        top:${(Math.random()*100).toFixed(1)}%;
        animation:heroFloat ${(6+Math.random()*9).toFixed(1)}s ${(Math.random()*-12).toFixed(1)}s ease-in-out infinite alternate;`;
      heroParticles.appendChild(d);
    }
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════════════════════════════ */
  function setupScrollReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: .07, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  /* ══════════════════════════════════════════════════════════
     PROJECTS HUD (IRON MAN holographic cards)
  ══════════════════════════════════════════════════════════ */
  function showProjectDetails(projectId) {
    if (!detailsOverlay) return;
    
    detailsCards.forEach(card => card.classList.remove('active'));
    
    const targetCard = document.getElementById(`details-${projectId}`);
    if (targetCard) {
      detailsOverlay.classList.add('visible');
      targetCard.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideProjectDetails() {
    if (!detailsOverlay) return;
    
    detailsOverlay.classList.remove('visible');
    setTimeout(() => {
      detailsCards.forEach(card => card.classList.remove('active'));
    }, 380);
    
    document.body.style.overflow = '';
  }

  function setupProjectDetailsHUD() {
    if (!projectRows.length) return;

    projectRows.forEach(row => {
      row.addEventListener('click', () => {
        const projectId = row.getAttribute('data-project');
        if (projectId) {
          showProjectDetails(projectId);
        }
      });
    });

    document.querySelectorAll('.details-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideProjectDetails();
      });
    });

    if (detailsOverlay) {
      detailsOverlay.addEventListener('click', (e) => {
        if (e.target === detailsOverlay) {
          hideProjectDetails();
        }
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     PROJECTS HOVER PREVIEWS (Luke Baffait Style)
     ══════════════════════════════════════════════════════════ */
  let previewX = 0, previewY = 0;
  let targetPreviewX = 0, targetPreviewY = 0;
  let previewScale = 0.85;
  let targetPreviewScale = 0.85;
  let previewRotation = 0;
  let targetPreviewRotation = 0;
  let isPreviewActive = false;

  function animateProjectPreview() {
    const previewEl = document.getElementById('cyberHoverPreview');
    if (!previewEl) return;

    const dx = targetPreviewX - previewX;
    const dy = targetPreviewY - previewY;
    previewX += dx * 0.12;
    previewY += dy * 0.12;

    const scaleDiff = targetPreviewScale - previewScale;
    previewScale += scaleDiff * 0.15;

    const rotDiff = targetPreviewRotation - previewRotation;
    previewRotation += rotDiff * 0.15;

    // Dynamic tilt based on cursor velocity/speed
    const speedX = Math.max(-15, Math.min(15, dx * 0.1));
    targetPreviewRotation = speedX * 1.5;

    previewEl.style.transform = `translate3d(${previewX}px, ${previewY}px, 0) translate(-50%, -50%) scale(${previewScale}) rotate(${previewRotation}deg)`;

    requestAnimationFrame(animateProjectPreview);
  }

  function setupProjectHoverPreviews() {
    const previewEl = document.getElementById('cyberHoverPreview');
    const previewImg = document.getElementById('cyberPreviewImage');
    const previewDate = document.getElementById('cyberPreviewDate');
    
    if (!previewEl || !projectRows.length) return;

    // Start tracking animation loop
    requestAnimationFrame(animateProjectPreview);

    document.addEventListener('mousemove', (e) => {
      targetPreviewX = e.clientX;
      targetPreviewY = e.clientY;
    });

    projectRows.forEach(row => {
      row.addEventListener('mouseenter', (e) => {
        const imgPath = row.getAttribute('data-img');
        const dateText = row.getAttribute('data-date');
        
        if (previewImg && imgPath) {
          previewImg.src = imgPath;
        }
        if (previewDate && dateText) {
          previewDate.textContent = dateText;
        }

        isPreviewActive = true;
        targetPreviewScale = 1;
        previewEl.classList.add('visible');

        // Set initial positions immediately on hover enter to prevent jumping
        targetPreviewX = e.clientX;
        targetPreviewY = e.clientY;
        previewX = targetPreviewX;
        previewY = targetPreviewY;
      });

      row.addEventListener('mouseleave', () => {
        isPreviewActive = false;
        targetPreviewScale = 0.85;
        previewEl.classList.remove('visible');
      });

      row.addEventListener('mousemove', (e) => {
        targetPreviewX = e.clientX;
        targetPreviewY = e.clientY;
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     SMOOTH SCROLL NAV
  ══════════════════════════════════════════════════════════ */
  function setupNav() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });

    // active nav highlighting & timeline indicator sync
    const sections = document.querySelectorAll('.scroll-section');
    const btns     = document.querySelectorAll('.nav-btn');

    const labelMap = {
      'section-about': 'About',
      'section-work': 'Projects',
      'section-skills': 'Skills',
      'section-contact': 'Contact'
    };

    const indexMap = {
      'section-about': 0,
      'section-work': 1,
      'section-skills': 2,
      'section-contact': 3
    };

    let currentActiveId = '';

    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const id = en.target.id;
          
          // update top nav pill buttons
          btns.forEach(b => b.classList.toggle('active', b.getAttribute('data-section') === id));

          // update vertical timeline
          if (id in indexMap && id !== currentActiveId) {
            currentActiveId = id;
            const idx = indexMap[id];
            const label = labelMap[id];

            if (stIndicatorGroup && stLabel) {
              stLabel.classList.remove('visible');

              setTimeout(() => {
                stIndicatorGroup.style.transform = `translateY(${idx * 60}px)`;
                stLabel.textContent = label;
                stLabel.classList.add('visible');
              }, 150);
            }
          }
        }
      });
    }, { threshold: .15, rootMargin: '-80px 0px -40% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ══════════════════════════════════════════════════════════
     LOADER
  ══════════════════════════════════════════════════════════ */
  function hideLoader() {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => { if (loader) loader.style.display = 'none'; }, 800);
    }, 1400);
    }
  /* ══════════════════════════════════════════════════════════
     SCROLL HANDLER
  ══════════════════════════════════════════════════════════ */
  function onScroll() {
    if (!rafScheduled) { rafScheduled = true; requestAnimationFrame(updateHero); }
  }

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    splitLetters();
    setupHeroParticles();
    setupNav();
    setupScrollReveal();
    loadFrames();
    setupOceanCursor();
    hideLoader();
    setupProjectDetailsHUD();
    setupProjectHoverPreviews();

    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { updateHero(); }, { passive: true });

    // initial render
    updateHero();

    // re-run after fonts load for letter sizing
    if (document.fonts) document.fonts.ready.then(updateHero);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
