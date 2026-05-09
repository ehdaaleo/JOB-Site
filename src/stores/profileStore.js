import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { profileApi } from '@/services/laravelApi'

// Configuration: Set to true to use Laravel API, false to use local/mock data
const USE_LARAVEL_API = !!import.meta.env.VITE_LARAVEL_API_URL

export const useProfileStore = defineStore('profile', () => {
  // State
  const profile = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Default profile data (for fallback)
  const defaultProfile = {
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
  }

  // Initialize profile from localStorage or use default
  function initProfile() {
    const savedProfile = localStorage.getItem('user_profile')
    if (savedProfile) {
      try {
        profile.value = JSON.parse(savedProfile)
      } catch (e) {
        profile.value = { ...defaultProfile }
      }
    } else {
      profile.value = { ...defaultProfile }
    }
  }

  // Call init on store creation
  initProfile()

  // Getters
  const skillsList = computed(() => profile.value?.skills || [])
  const experienceList = computed(() => profile.value?.experience || [])
  const educationList = computed(() => profile.value?.education || [])
  const hasResume = computed(() => !!profile.value?.resume)

  // Actions
  async function fetchProfile() {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await profileApi.getProfile()
        profile.value = response || { ...defaultProfile }
      } else {
        // Use local data
        profile.value = { ...defaultProfile }
      }

      // Persist to localStorage
      localStorage.setItem('user_profile', JSON.stringify(profile.value))
      
      return profile.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch profile'
      console.error('Error fetching profile:', err)
      
      // Fallback to default
      profile.value = { ...defaultProfile }
      return profile.value
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(profileData) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        // Map local field names to Laravel API field names
        const apiData = {
          bio: profileData.bio,
          phone: profileData.phone,
          location: profileData.location,
          headline: profileData.title || profileData.headline,
          skills: profileData.skills,
          linkedin_profile: profileData.linkedin_profile,
          experience: profileData.experience,
          resume: profileData.resume
        }

        const response = await profileApi.updateProfile(apiData)
        profile.value = { ...profile.value, ...response }
      } else {
        // Local update
        profile.value = { ...profile.value, ...profileData }
      }

      // Persist to localStorage
      localStorage.setItem('user_profile', JSON.stringify(profile.value))

      return profile.value
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update profile'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function updateProfileLocal(profileData) {
    profile.value = { ...profile.value, ...profileData }
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
    return profile.value
  }

  function addSkill(skill) {
    if (!profile.value.skills.includes(skill)) {
      profile.value.skills.push(skill)
      localStorage.setItem('user_profile', JSON.stringify(profile.value))
    }
  }

  function removeSkill(skill) {
    profile.value.skills = profile.value.skills.filter(s => s !== skill)
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
  }

  function addExperience(exp) {
    const newExp = { id: Date.now(), ...exp }
    profile.value.experience.push(newExp)
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
    return newExp
  }

  function removeExperience(id) {
    profile.value.experience = profile.value.experience.filter(e => e.id !== id)
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
  }

  function addEducation(edu) {
    const newEdu = { id: Date.now(), ...edu }
    profile.value.education.push(newEdu)
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
    return newEdu
  }

  function removeEducation(id) {
    profile.value.education = profile.value.education.filter(e => e.id !== id)
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
  }

  async function uploadResume(file) {
    isLoading.value = true
    error.value = null

    try {
      // Laravel API expects file upload - this would need multipart/form-data
      // For now, we'll store the file name locally
      // In production, you would use FormData and upload to the backend
      
      if (USE_LARAVEL_API) {
        // Note: The Laravel API reference shows resume as a string field
        // File upload would need a different endpoint or multipart handling
        console.log('Resume upload would require multipart handling:', file.name)
      }

      profile.value.resume = file.name
      localStorage.setItem('user_profile', JSON.stringify(profile.value))
      
      return { success: true, fileName: file.name }
    } catch (err) {
      error.value = err.message || 'Failed to upload resume'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function getSkillColor(skill) {
    // Generate consistent colors for skills
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ]
    let hash = 0
    for (let i = 0; i < skill.length; i++) {
      hash = skill.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  function clearError() {
    error.value = null
  }

  function resetProfile() {
    profile.value = { ...defaultProfile }
    localStorage.setItem('user_profile', JSON.stringify(profile.value))
  }

  return {
    // State
    profile,
    isLoading,
    error,
    // Getters
    skillsList,
    experienceList,
    educationList,
    hasResume,
    // Actions
    fetchProfile,
    updateProfile,
    updateProfileLocal,
    addSkill,
    removeSkill,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    uploadResume,
    getSkillColor,
    clearError,
    resetProfile
  }
})