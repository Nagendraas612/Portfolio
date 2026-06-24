import { client, urlFor } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries'
import PortfolioClient from '@/components/PortfolioClient'

// Revalidate every 60 seconds for ISR
export const revalidate = 60

// Type definitions
interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: { x: number; y: number; height: number; width: number }
}

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
  profilePhoto: SanityImage
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

interface Project {
  _id: string
  title: string
  slug: { current: string }
  orderIndex: number
  type: string
  status: string
  year: string
  screenshot: SanityImage
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

interface HomePageData {
  settings: SiteSettings | null
  about: About | null
  projects: Project[]
  skills: SkillCategory[]
}

export default async function Home() {
  let data: HomePageData = {
    settings: null,
    about: null,
    projects: [],
    skills: [],
  }

  try {
    data = await client.fetch(homePageQuery)
  } catch (e) {
    console.error('Failed to fetch Sanity data, using fallbacks:', e)
  }

  // Build image URLs on the server
  const profilePhotoUrl = data.about?.profilePhoto
    ? urlFor(data.about.profilePhoto).width(600).height(800).url()
    : '/assets/Nagendra.jpg'

  const projectsWithUrls = (data.projects || []).map((p) => ({
    ...p,
    screenshotUrl: p.screenshot
      ? urlFor(p.screenshot).width(800).height(500).url()
      : '',
  }))

  return (
    <PortfolioClient
      settings={data.settings}
      about={data.about}
      profilePhotoUrl={profilePhotoUrl}
      projects={projectsWithUrls}
      skills={data.skills || []}
    />
  )
}
