'use client'

import React from 'react'

interface ScrollRevealProps {
  text: string
  emphasis?: string
  className?: string
  isStatic?: boolean
}

export function ScrollRevealText({ text, emphasis, className, isStatic = true }: ScrollRevealProps) {
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
        <span
          key={i}
          className={`scroll-word ${isStatic ? 'sw-active' : ''}`}
          style={isStatic ? { opacity: 1 } : undefined}
          data-sw-index={isStatic ? undefined : i}
        >
          {seg.isEm ? <em>{seg.word}</em> : seg.word}
          {i < segments.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

export function ScrollRevealPlain({ text, className, isStatic = true }: { text: string; className?: string; isStatic?: boolean }) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <span className={`scroll-text-block ${className || ''}`} data-scroll-reveal>
      {words.map((w, i) => (
        <span
          key={i}
          className={`scroll-word ${isStatic ? 'sw-active' : ''}`}
          style={isStatic ? { opacity: 1 } : undefined}
          data-sw-index={isStatic ? undefined : i}
        >
          {w}{i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}
