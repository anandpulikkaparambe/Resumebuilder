export const RECORD_RESUME_TOOL = {
  name: 'record_resume',
  description:
    'Records the full structured resume extracted from the conversation with the candidate.',
  input_schema: {
    type: 'object',
    properties: {
      personal: {
        type: 'object',
        description: 'Contact info and summary. Leave a field as an empty string if unknown.',
        properties: {
          fullName: { type: 'string' },
          title: { type: 'string', description: 'Desired job title / professional headline' },
          email: { type: 'string' },
          phone: { type: 'string' },
          location: { type: 'string' },
          linkedin: { type: 'string', description: 'LinkedIn URL or portfolio/website URL' },
          summary: {
            type: 'string',
            description: 'A polished 2-3 sentence professional summary written for the resume, in third person is not required, but should sound resume-appropriate.',
          },
        },
        required: ['fullName', 'title', 'email', 'phone', 'location', 'linkedin', 'summary'],
      },
      experience: {
        type: 'array',
        description: 'Work history, most recent first.',
        items: {
          type: 'object',
          properties: {
            company: { type: 'string' },
            role: { type: 'string' },
            location: { type: 'string' },
            startDate: { type: 'string', description: 'e.g. "Jan 2022"' },
            endDate: { type: 'string', description: 'e.g. "Mar 2024", empty if current' },
            current: { type: 'boolean' },
            description: {
              type: 'string',
              description: 'Achievement-focused bullet points, one per line, written for a resume.',
            },
          },
          required: ['company', 'role', 'location', 'startDate', 'endDate', 'current', 'description'],
        },
      },
      education: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            school: { type: 'string' },
            degree: { type: 'string' },
            field: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
          required: ['school', 'degree', 'field', 'startDate', 'endDate'],
        },
      },
      skills: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['personal', 'experience', 'education', 'skills'],
  },
}
