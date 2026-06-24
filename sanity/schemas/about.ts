import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Me',
  type: 'document',
  fields: [
    defineField({
      name: 'profilePhoto',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Intro',
      description: 'The serif intro line. Use *italic* for emphasis, e.g. "CS student & developer, building at the intersection of *AI, automation, and thoughtful design.*"',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'roleEmphasis',
      title: 'Role Emphasis Text',
      description: 'The part that should be italic/highlighted in the role text, e.g. "AI, automation, and thoughtful design."',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      description: 'Longer paragraph about yourself',
      type: 'text',
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bioEmphasis',
      title: 'Bio Emphasis Text',
      description: 'The part that should be italic/highlighted in the bio, e.g. "how can this make someone\'s day measurably better?"',
      type: 'string',
    }),
    defineField({
      name: 'basedIn',
      title: 'Based In',
      type: 'string',
      initialValue: 'India 🇮🇳',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'Open to work',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'string',
      initialValue: 'VVCE · CS',
    }),
    defineField({
      name: 'focus',
      title: 'Focus',
      type: 'string',
      initialValue: 'AI & ML',
    }),
  ],
  preview: {
    select: { title: 'status', media: 'profilePhoto' },
    prepare({ title, media }) {
      return { title: 'About Me', subtitle: title, media }
    },
  },
})
