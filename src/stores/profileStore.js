import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    title: 'Senior Software Developer',
    summary: 'Experienced software developer with 5+ years of experience in building web applications. Skilled in Vue.js, React, Node.js, and cloud technologies.',
    skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker'],
    experience: [
      { id: 1, title: 'Senior Developer', company: 'TechCorp', period: '2021 - Present', description: 'Led frontend development team' },
      { id: 2, title: 'Software Developer', company: 'StartupXYZ', period: '2019 - 2021', description: 'Built full-stack web applications' }
    ],
    education: [
      { id: 1, degree: 'BS Computer Science', school: 'University of California', year: '2019' }
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
