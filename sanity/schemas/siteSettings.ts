import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Your Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page Title (SEO)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      description: 'The phrase shown after the wave animation, e.g. "I build intelligent systems."',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      description: 'Shown at bottom of hero, e.g. "CS student · AI & ML · VVCE"',
      type: 'string',
    }),
    defineField({
      name: 'availabilityText',
      title: 'Availability Text',
      description: 'Shown in the hero eyebrow, e.g. "Available for opportunities · 2026"',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'contactHeadline',
      title: 'Contact Headline',
      description: 'The big CTA text, e.g. "Let\'s build something great."',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactSubhead',
      title: 'Contact Subheading',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'avgResponse',
      title: 'Average Response Time',
      type: 'string',
      initialValue: '24h',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'India',
    }),
    defineField({
      name: 'openTo',
      title: 'Open To',
      description: 'List of opportunity types',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon Image',
      description: 'Upload your square favicon logo image (will override the default nagslogo.jpeg)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
})
