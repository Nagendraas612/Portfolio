import type { Metadata } from 'next'
import { client, urlFor } from '../sanity/lib/client'
import { siteSettingsQuery } from '../sanity/lib/queries'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = null
  try {
    settings = await client.fetch(siteSettingsQuery)
  } catch (e) {
    console.error('Failed to fetch site settings for metadata:', e)
  }

  const title = settings?.title || 'Nagendra AS — Creative Developer'
  const description = settings?.metaDescription || 'Nagendra AS — Computer Science student specializing in AI, Machine Learning, and building innovative digital experiences.'

  const iconUrl = settings?.favicon
    ? urlFor(settings.favicon).width(192).height(192).url()
    : '/assets/nagslogo.jpeg'

  return {
    title,
    description,
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    }
  }
}

import FloatingDockWrapper from '../components/FloatingDockWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;1,14..32,300;1,14..32,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <FloatingDockWrapper />
      </body>
    </html>
  )
}

