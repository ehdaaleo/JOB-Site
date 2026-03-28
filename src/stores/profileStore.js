import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    name: 'Abdo Tolba',
    email: 'tolba@gmail.com',
    phone: '+2 0111 234 5678',
    location: 'Cairo, Egypt',
    role: 'candidate',
    title: 'Senior Software Developer',
    bio: 'Experienced software developer with 5+ years of experience in building web applications. Skilled in Vue.js, React, Node.js, and cloud technologies.',
    linkedin_profile: 'https://www.linkedin.com/in/abdoltolba/',
    profile_picture: 'https://picsum.photos/seed/johndoe/200/200',
    company_name: '',
    company_logo: '',
    skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: [
      { id: 1, title: 'Senior Developer', company: 'TechCorp', period: '2021 - Present', description: 'Led frontend development team' },
      { id: 2, title: 'Software Developer', company: 'StartupXYZ', period: '2019 - 2021', description: 'Built full-stack web applications' }
    ],
    education: [
      { id: 1, degree: 'BS Computer Science', school: 'Arab Academy for Science, Technology & Maritime Transport', year: '2025' }
    ],
    resume: 'resume.pdf'
  })

  const updateProfile = (newData) => {
    profile.value = { ...profile.value, ...newData }
  }

  const addSkill = (skill) => {
    if (!profile.value.skills.includes(skill)) {
      profile.value.skills.push(skill)
    }
  }

  const removeSkill = (skill) => {
    profile.value.skills = profile.value.skills.filter(s => s !== skill)
  }

  const addExperience = (exp) => {
    profile.value.experience.push({ id: Date.now(), ...exp })
  }

  const removeExperience = (id) => {
    profile.value.experience = profile.value.experience.filter(e => e.id !== id)
  }

  const addEducation = (edu) => {
    profile.value.education.push({ id: Date.now(), ...edu })
  }

  const removeEducation = (id) => {
    profile.value.education = profile.value.education.filter(e => e.id !== id)
  }

  return {
    profile,
    updateProfile,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation
  }
})
