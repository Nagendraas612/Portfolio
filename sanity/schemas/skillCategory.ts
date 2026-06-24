import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'skillCategory',
  title: 'Skill Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      description: 'e.g. "Frontend", "AI & ML", "Backend", "Tools"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'orderIndex',
      title: 'Display Order',
      description: 'Categories are sorted by this number (1 = first)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderIndexAsc',
      by: [{ field: 'orderIndex', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', skills: 'skills' },
    prepare({ title, skills }) {
      return {
        title,
        subtitle: skills ? `${skills.length} skills` : 'No skills',
      }
    },
  },
})
