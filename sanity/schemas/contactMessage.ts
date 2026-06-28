import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactMessage',
  title: 'Contact Messages',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Sender Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Sender Email',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
    }),
    defineField({
      name: 'createdAt',
      title: 'Received At',
      type: 'datetime',
    }),
  ],
  orderings: [
    {
      title: 'Date Received (Newest first)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      createdAt: 'createdAt',
    },
    prepare({ name, email, createdAt }) {
      const formattedDate = createdAt 
        ? new Date(createdAt).toLocaleString() 
        : 'Unknown Date'
      return {
        title: name || 'Anonymous',
        subtitle: `${email || 'No Email'} • ${formattedDate}`,
      }
    },
  },
})
