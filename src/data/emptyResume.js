export function emptyResume() {
  return {
    personal: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
  }
}

export function newExperienceEntry() {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
  }
}

export function newEducationEntry() {
  return {
    id: crypto.randomUUID(),
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
  }
}
