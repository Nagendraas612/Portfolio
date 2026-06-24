import { client, urlFor } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries'
import WorkClient from '@/components/WorkClient'

export const revalidate = 60

export default async function WorkPage() {
  let data: any = {
    settings: null,
    projects: [],
  }

  try {
    data = await client.fetch(homePageQuery)
  } catch (e) {
    console.error('Failed to fetch Sanity data for work page:', e)
  }

  // Handle fallback settings
  const settings = data.settings || {
    name: 'Nagendra AS',
  }

  // Map screenshot urls
  const projectsWithUrls = (data.projects || []).map((p: any) => ({
    ...p,
    screenshotUrl: p.screenshot
      ? urlFor(p.screenshot).width(800).height(500).url()
      : '',
  }))

  const finalProjects = projectsWithUrls.length ? projectsWithUrls : [
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

  return (
    <WorkClient
      settings={settings}
      projects={finalProjects}
    />
  )
}
