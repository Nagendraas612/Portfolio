import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    name,
    title,
    metaDescription,
    heroTagline,
    heroSubtitle,
    availabilityText,
    email,
    githubUrl,
    linkedinUrl,
    contactHeadline,
    contactSubhead,
    avgResponse,
    location,
    openTo
  }
`

export const aboutQuery = groq`
  *[_type == "about"][0] {
    profilePhoto,
    role,
    roleEmphasis,
    bio,
    bioEmphasis,
    basedIn,
    status,
    education,
    focus
  }
`

export const projectsQuery = groq`
  *[_type == "project"] | order(orderIndex asc) {
    _id,
    title,
    slug,
    orderIndex,
    type,
    status,
    year,
    screenshot,
    shortDescription,
    longDescription,
    tags,
    deployedUrl,
    githubUrl,
    impactStats
  }
`

export const skillCategoriesQuery = groq`
  *[_type == "skillCategory"] | order(orderIndex asc) {
    _id,
    title,
    orderIndex,
    skills
  }
`

// Fetch all data in a single query for the home page
export const homePageQuery = groq`
{
  "settings": ${siteSettingsQuery},
  "about": ${aboutQuery},
  "projects": ${projectsQuery},
  "skills": ${skillCategoriesQuery}
}
`
