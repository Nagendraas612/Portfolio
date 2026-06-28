import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5hujwuzl',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, message } = body

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // 2. Write to Sanity
    const doc = await writeClient.create({
      _type: 'contactMessage',
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    })

    // 3. Send Push Notification via ntfy
    try {
      const topic = process.env.NEXT_PUBLIC_NTFY_TOPIC || 'nagendra-portfolio-msgs-612'
      await fetch(`https://ntfy.sh/${topic}`, {
        method: 'POST',
        headers: {
          'Title': `New message from ${name.trim()}`,
          'Tags': 'incoming_envelope,speech_balloon',
          'Click': `mailto:${email.trim()}`,
        },
        body: `Email: ${email.trim()}\n\nMessage:\n${message.trim()}`
      })
    } catch (ntfyError) {
      console.error('Failed to send ntfy push notification:', ntfyError)
    }

    return NextResponse.json({ success: true, docId: doc._id }, { status: 200 })
  } catch (error: any) {
    console.error('Contact form submission error:', error)
    return NextResponse.json(
      { error: error?.message || 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
