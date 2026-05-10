import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { profileApi, apiErrorMessage } from '@/services/api'

const SKILL_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
]

/**
 * The Laravel Profile model stores skills/experience/education as JSON.
 * We always treat them as arrays in the SPA. The server is the source
 * of truth — there is no localStorage fallback.
 */
function normalize(profile) {
  if (!profile) return null
  const safe = { ...profile }
  safe.skills = normalizeSkills(safe.skills)
  for (const k of ['experience', 'education']) {
    safe[k] = normalizeArrayField(safe[k])
  }
  safe.profile_picture = normalizeStorageUrl(safe.profile_picture)
  safe.resume = normalizeStorageUrl(safe.resume)
  return safe
}

function apiOrigin() {
  const baseUrl =
    import.meta.env.VITE_API_URL?.trim() || 'http://127.0.0.1:8000/api'
  return baseUrl.replace(/\/api\/?$/, '')
}

function normalizeStorageUrl(path) {
  if (!path || typeof path !== 'string') return path
  if (/^(https?:)?\/\//.test(path) || path.startsWith('blob:')) return path

  const cleanPath = path.replace(/^\/+/, '')
  if (cleanPath.startsWith('storage/')) return `${apiOrigin()}/${cleanPath}`
  return `${apiOrigin()}/storage/${cleanPath}`
}

function normalizeArrayField(value) {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function normalizeSkills(value) {
  const raw = normalizeArrayField(value)
  if (raw.length) {
    return raw.map((skill) => String(skill).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((skill) => skill.trim())
      .filter(Boolean)
  }
  return []
}

function appendFormValue(fd, key, value) {
  if (value === undefined || value === null) return

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (item === undefined || item === null) return
      if (typeof item === 'object') {
        Object.entries(item).forEach(([childKey, childValue]) => {
          if (childValue !== undefined && childValue !== null) {
            fd.append(`${key}[${index}][${childKey}]`, childValue)
          }
        })
      } else {
        fd.append(`${key}[]`, item)
      }
    })
    return
  }

  if (typeof value === 'object') {
    fd.append(key, JSON.stringify(value))
    return
  }

  fd.append(key, value)
}

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const skillsList = computed(() => profile.value?.skills || [])
  const experienceList = computed(() => profile.value?.experience || [])
  const educationList = computed(() => profile.value?.education || [])
  const hasResume = computed(() => !!profile.value?.resume)

  async function fetchProfile() {
    isLoading.value = true
    error.value = null
    try {
      const res = await profileApi.show()
      profile.value = normalize(res.data ?? res)
      return profile.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load profile.')
      profile.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update profile. Pass either a plain object or a FormData (when uploading
   * resume / profile_picture).
   */
  async function updateProfile(payload) {
    isLoading.value = true
    error.value = null
    try {
      const res = await profileApi.update(payload)
      profile.value = normalize(res.data ?? res)
      return profile.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to update profile.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function buildFormData(fields, files = {}) {
    const fd = new FormData()
    for (const [k, v] of Object.entries(fields)) {
      appendFormValue(fd, k, v)
    }
    for (const [k, file] of Object.entries(files)) {
      if (file) fd.append(k, file)
    }
    return fd
  }

  async function uploadFiles({ resume, profilePicture, ...fields } = {}) {
    return updateProfile(
      buildFormData(fields, { resume, profile_picture: profilePicture }),
    )
  }

  function getSkillColor(skill) {
    let hash = 0
    for (let i = 0; i < skill.length; i++) {
      hash = skill.charCodeAt(i) + ((hash << 5) - hash)
    }
    return SKILL_COLORS[Math.abs(hash) % SKILL_COLORS.length]
  }

  function clearError() {
    error.value = null
  }

  return {
    profile,
    isLoading,
    error,
    skillsList,
    experienceList,
    educationList,
    hasResume,
    fetchProfile,
    updateProfile,
    uploadFiles,
    getSkillColor,
    clearError,
  }
})
