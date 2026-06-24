import { client } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries'
import ContactClient from '@/components/ContactClient'

export const revalidate = 60

export default async function ContactPage() {
  let data: any = {
    settings: null,
  }

  try {
    data = await client.fetch(homePageQuery)
  } catch (e) {
    console.error('Failed to fetch Sanity data for contact page:', e)
  }

  // Handle fallback settings
  const settings = data.settings || {
    name: 'Nagendra AS',
    email: 'nagendraas612@gmail.com',
    githubUrl: 'https://github.com/Nagendraas612',
    linkedinUrl: 'https://linkedin.com/in/nagendraas612',
    contactHeadline: "Let's build\nsomething great.",
    contactSubhead: "CS student with a sharp eye for AI-powered solutions and a bias for shipping. If you have a project, an idea, or an open role — I'm listening.",
    avgResponse: '24h',
    location: 'India',
    openTo: ['Internships', 'Freelancing', 'Open source', 'Project collaborations'],
  }

  return (
    <ContactClient
      settings={settings}
    />
  )
}
