'use client'

import { useEffect, useRef, useState } from 'react'

/* ── CONFIG ───────────────────────────── */
const COLS = 15
const ROWS = 9
const DOT_SIZE = 5 // px diameter
const DOT_GAP = 3.5 // px gap
const PADDLE_H = 3 // dots tall
const DURATION = 4000 // ms total
const BALL_SPD_X = 0.08
const BALL_SPD_Y = 0.055

interface LoaderProps {
  onComplete: () => void
  fade: boolean
}

export default function Loader({ onComplete, fade }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set scaling for retina displays
    const dpr = window.devicePixelRatio || 1
    const W = COLS * (DOT_SIZE + DOT_GAP) - DOT_GAP
    const H = ROWS * (DOT_SIZE + DOT_GAP) - DOT_GAP

    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    let raf: number

    /* Pong state */
    let ballX = (COLS - 1) / 2
    let ballY = (ROWS - 1) / 2
    let ballDX = BALL_SPD_X
    let ballDY = BALL_SPD_Y
    let leftY = (ROWS - PADDLE_H) / 2
    let rightY = (ROWS - PADDLE_H) / 2
    let startTime: number | null = null
    let lastTime = 0

    function getBrightness(c: number, r: number): number {
      let brightness = 0.04 // Baseline inactive brightness

      // Left paddle contribution (smooth fade at the edges)
      if (c === 0) {
        const dist = Math.min(
          Math.abs(r - leftY),
          Math.abs(r - (leftY + 1)),
          Math.abs(r - (leftY + 2))
        )
        if (dist < 1.0) {
          brightness = Math.max(brightness, 1.0 - dist)
        }
      }

      // Right paddle contribution (smooth fade at the edges)
      if (c === COLS - 1) {
        const dist = Math.min(
          Math.abs(r - rightY),
          Math.abs(r - (rightY + 1)),
          Math.abs(r - (rightY + 2))
        )
        if (dist < 1.0) {
          brightness = Math.max(brightness, 1.0 - dist)
        }
      }

      // Ball contribution (smooth sub-pixel light distribution)
      const ballDist = Math.sqrt((c - ballX) ** 2 + (r - ballY) ** 2)
      if (ballDist < 1.4) {
        const ballBrightness = Math.max(0, 1.0 - ballDist / 1.4)
        brightness = Math.max(brightness, ballBrightness)
      }

      return brightness
    }

    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, W, H)
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          const brightness = getBrightness(c, r)
          const x = c * (DOT_SIZE + DOT_GAP) + DOT_SIZE / 2
          const y = r * (DOT_SIZE + DOT_GAP) + DOT_SIZE / 2

          // 1. Draw static crisp background dot (faint white)
          ctx.beginPath()
          ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2)
          ctx.shadowBlur = 0
          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
          ctx.fill()

          // 2. Draw animated glowing active dot overlay (if close to ball/paddle)
          if (brightness > 0.04) {
            const alpha = (brightness - 0.04) / 0.96
            ctx.beginPath()
            ctx.arc(x, y, DOT_SIZE / 2, 0, Math.PI * 2)
            ctx.shadowColor = 'rgba(34, 211, 238, 0.4)'
            ctx.shadowBlur = 2 * alpha
            ctx.fillStyle = `rgba(34, 211, 238, ${alpha.toFixed(3)})`
            ctx.fill()
          }
        }
      }
    }

    function movePaddles(dt: number) {
      const spd = 0.08 * dt
      const lc = leftY + PADDLE_H / 2
      const rc = rightY + PADDLE_H / 2
      if (ballY > lc + 0.3) leftY = Math.min(ROWS - PADDLE_H, leftY + spd)
      else if (ballY < lc - 0.3) leftY = Math.max(0, leftY - spd)
      if (ballY > rc + 0.3) rightY = Math.min(ROWS - PADDLE_H, rightY + spd)
      else if (ballY < rc - 0.3) rightY = Math.max(0, rightY - spd)
    }

    function moveBall(dt: number) {
      ballX += ballDX * dt
      ballY += ballDY * dt

      if (ballY <= 0) {
        ballY = 0
        ballDY = Math.abs(ballDY)
      }
      if (ballY >= ROWS - 1) {
        ballY = ROWS - 1
        ballDY = -Math.abs(ballDY)
      }

      if (ballX <= 1 && ballDX < 0) {
        const lc = leftY + PADDLE_H / 2
        if (ballY >= leftY - 0.5 && ballY <= leftY + PADDLE_H + 0.5) {
          ballX = 1
          ballDX = Math.abs(ballDX)
          ballDY = ((ballY - lc) / (PADDLE_H / 2)) * 0.09
        } else {
          ballX = (COLS - 1) / 2
          ballY = Math.random() * (ROWS - 1)
          ballDX = Math.abs(ballDX)
        }
      }

      if (ballX >= COLS - 2 && ballDX > 0) {
        const rc = rightY + PADDLE_H / 2
        if (ballY >= rightY - 0.5 && ballY <= rightY + PADDLE_H + 0.5) {
          ballX = COLS - 2
          ballDX = -Math.abs(ballDX)
          ballDY = ((ballY - rc) / (PADDLE_H / 2)) * 0.09
        } else {
          ballX = (COLS - 1) / 2
          ballY = Math.random() * (ROWS - 1)
          ballDX = -Math.abs(ballDX)
        }
      }
    }

    function loop(ts: number) {
      if (!startTime) {
        startTime = ts
        lastTime = ts
      }
      const elapsed = ts - startTime
      const progress = Math.min(100, (elapsed / DURATION) * 100)

      // Calculate frame delta time relative to 60fps (~16.67ms)
      const dt = Math.min(3, (ts - lastTime) / 16.67)
      lastTime = ts

      movePaddles(dt)
      moveBall(dt)
      draw()

      if (progress < 100) {
        raf = requestAnimationFrame(loop)
      } else {
        draw()
        setTimeout(onComplete, 300)
      }
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#07111a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.8s',
        opacity: fade ? 0 : 1,
        visibility: fade ? 'hidden' : 'visible',
        pointerEvents: fade ? 'none' : 'auto',
      }}
    >
      <div
        className="loader-inner"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        {/* Name (with existing CSS animations from globals.css) */}
        <div className="loader-name" style={{ marginBottom: 0 }}>
          <span className="loader-n">N</span>
          <span className="loader-rest">agendra A.S.</span>
        </div>

        {/* Canvas directly aligned in middle */}
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
