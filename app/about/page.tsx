import { client, urlFor } from '@/sanity/lib/client'
import { homePageQuery } from '@/sanity/lib/queries'
import AboutClient from '@/components/AboutClient'

export const revalidate = 60

export default async function AboutPage() {
  let data: any = {
    settings: null,
    about: null,
    skills: [],
  }

  try {
    data = await client.fetch(homePageQuery)
  } catch (e) {
    console.error('Failed to fetch Sanity data for about page:', e)
  }

  // Handle fallback settings
  const settings = data.settings || {
    name: 'Nagendra AS',
    email: 'nagendraas612@gmail.com',
  }

  // Handle fallback about
  const about = data.about || {
    role: 'CS student & developer, building at the intersection of AI, automation, and thoughtful design.',
    roleEmphasis: 'AI, automation, and thoughtful design.',
    bio: "I care about the intersection of technical precision and real-world impact. Every project I take on starts with a question: how can this make someone's day measurably better? I thrive in collaborative environments and believe the best code is the code nobody has to think about.",
    bioEmphasis: "how can this make someone's day measurably better?",
    basedIn: 'India 🇮🇳',
    status: 'Open to work',
    education: 'VVCE · CS',
    focus: 'AI & ML',
  }

  const profilePhotoUrl = data.about?.profilePhoto
    ? urlFor(data.about.profilePhoto).width(600).height(800).url()
    : '/assets/Nagendra.jpg'

  // Handle fallback skills
  const skills = data.skills?.length ? data.skills : [
    { _id: 's1', title: 'Frontend', orderIndex: 1, skills: ['HTML & CSS', 'JavaScript', 'React.js', 'Responsive Design'] },
    { _id: 's2', title: 'AI & ML', orderIndex: 2, skills: ['Python', 'Machine Learning', 'Computer Vision', 'Data Analysis'] },
    { _id: 's3', title: 'Backend', orderIndex: 3, skills: ['Node.js · Express', 'MongoDB', 'Java', 'REST APIs'] },
    { _id: 's4', title: 'Tools', orderIndex: 4, skills: ['Git · GitHub', 'VS Code', 'Figma', 'Linux'] },
  ]

  return (
    <AboutClient
      settings={settings}
      about={about}
      profilePhotoUrl={profilePhotoUrl}
      skills={skills}
    />
  )
}
