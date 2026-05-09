import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { authApi as laravelAuthApi } from '@/services/laravelApi'
import { authApi as legacyAuthApi } from '@/services/auth'
import router from '@/router'

// Configuration: Set to true to use Laravel API, false to use legacy JSON Server
const USE_LARAVEL_API = !!import.meta.env.VITE_LARAVEL_API_URL

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const rememberMe = ref(false)
  const useLaravelBackend = ref(USE_LARAVEL_API)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isCandidate = computed(() => user.value?.role === 'candidate')
  const isEmployer = computed(() => user.value?.role === 'employer')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Initialize token from storage on store creation
  function initFromStorage() {
    // Try Laravel token first, then fallback to legacy
    const storedToken = localStorage.getItem('token') || 
                        sessionStorage.getItem('token') ||
                        localStorage.getItem('auth_token') || 
                        sessionStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      const basicUser = JSON.parse(storedUser)
      user.value = basicUser
      rememberMe.value = !!localStorage.getItem('token') || !!localStorage.getItem('auth_token')

      // Fetch full user data from Laravel API
      if (basicUser.id && useLaravelBackend.value) {
        laravelAuthApi
          .getCurrentUser()
          .then((response) => {
            user.value = response.user || response
          })
          .catch((err) => {
            console.error('Failed to fetch full user profile from Laravel API', err)
            // Fallback to legacy auth API
            if (legacyAuthApi) {
              legacyAuthApi.getUserById(basicUser.id).then((fullUser) => {
                user.value = fullUser
              }).catch(() => {
                console.error('Failed to fetch user from legacy API')
              })
            }
          })
      } else if (basicUser.id && !useLaravelBackend.value && legacyAuthApi) {
        // Use legacy auth API
        legacyAuthApi
          .getUserById(basicUser.id)
          .then((fullUser) => {
            user.value = fullUser
          })
          .catch((err) => {
            console.error('Failed to fetch full user profile', err)
          })
      }
    }
  }

  // Call init on store creation
  initFromStorage()

  // Watch for token changes and persist accordingly
  watch(token, (newToken) => {
    if (!newToken) return

    if (rememberMe.value) {
      localStorage.setItem('token', newToken)
    } else {
      sessionStorage.setItem('token', newToken)
    }
  })

  // Helper to persist only stripped user data
  function saveUserToStorage(userData, remember) {
    if (!userData) return
    const safeUserData = {
      id: userData.id,
      name: userData.name,
      role: userData.role,
      employerType: userData.employerType,
    }
    const dataStr = JSON.stringify(safeUserData)
    if (remember) {
      localStorage.setItem('user', dataStr)
    } else {
      sessionStorage.setItem('user', dataStr)
    }
  }

  // Watch for user changes and persist
  watch(user, (newUser) => {
    saveUserToStorage(newUser, rememberMe.value)
  })

  // Actions
  async function login(credentials) {
    isLoading.value = true
    error.value = null
    rememberMe.value = credentials.rememberMe || false

    try {
      let response
      if (useLaravelBackend.value) {
        // Use Laravel API
        response = await laravelAuthApi.login(credentials)
      } else if (legacyAuthApi) {
        // Fallback to legacy API
        response = await legacyAuthApi.login(credentials)
      } else {
        throw new Error('No authentication API available')
      }

      const { user: userData, token: authToken } = response

      user.value = userData
      token.value = authToken

      // Persist based on rememberMe choice
      if (rememberMe.value) {
        localStorage.setItem('token', authToken)
      } else {
        sessionStorage.setItem('token', authToken)
      }
      saveUserToStorage(userData, rememberMe.value)

      return { success: true, user: userData }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function loginWithOAuth({ provider, code, redirectUri }) {
    isLoading.value = true
    error.value = null

    try {
      console.log(`Exchanging ${provider} code for token...`, { code, redirectUri })

      throw new Error(
        'Social login backend not implemented yet. Token exchange must happen server-side.',
      )
    } catch (err) {
      error.value = err.message || 'Social login failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true
    error.value = null

    try {
      // Remove confirmPassword if it exists (it's only for UI validation)
      const { confirmPassword, ...dataWithoutConfirm } = userData
      
      let response
      if (useLaravelBackend.value) {
        // Use Laravel API - includes role-specific fields
        response = await laravelAuthApi.register(dataWithoutConfirm)
      } else if (legacyAuthApi) {
        // Fallback to legacy API
        response = await legacyAuthApi.register(dataWithoutConfirm)
      } else {
        throw new Error('No registration API available')
      }

      return { success: true, user: response }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Registration failed'
      // Handle specific Laravel validation errors
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errors = err.response.data.errors
        const firstError = Object.values(errors)[0]
        if (Array.isArray(firstError)) {
          error.value = firstError[0]
        }
      }
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function forgotPassword(email) {
    isLoading.value = true
    error.value = null

    try {
      // Laravel API doesn't have this endpoint in the reference, use legacy
      if (legacyAuthApi) {
        const result = await legacyAuthApi.forgotPassword(email)
        return { success: true, message: result.message }
      } else {
        throw new Error('Password reset not available')
      }
    } catch (err) {
      error.value = err.message || 'Failed to send reset email'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(tokenValue, newPassword) {
    isLoading.value = true
    error.value = null

    try {
      // Laravel API doesn't have this endpoint in the reference, use legacy
      if (legacyAuthApi) {
        const result = await legacyAuthApi.resetPassword(tokenValue, newPassword)
        return { success: true, message: result.message }
      } else {
        throw new Error('Password reset not available')
      }
    } catch (err) {
      error.value = err.message || 'Failed to reset password'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      if (useLaravelBackend.value) {
        await laravelAuthApi.logout()
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      token.value = null
      rememberMe.value = false
      isLoading.value = false

      // Clear storage
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')

      // Redirect to login
      router.push('/auth/login')
    }
  }

  // Setup auth state listener for token expiration
  function setupAuthListener() {
    window.addEventListener('auth:unauthorized', () => {
      user.value = null
      token.value = null
      rememberMe.value = false
      // Clear all storage on unauthorized
      localStorage.clear()
      sessionStorage.clear()
      router.push('/auth/login')
    })

    // Listen for storage changes (logout in another tab)
    window.addEventListener('storage', (event) => {
      if ((event.key === 'token' || event.key === 'user') && !event.newValue) {
        user.value = null
        token.value = null
        rememberMe.value = false
        // Clear remaining storage
        localStorage.clear()
        sessionStorage.clear()
        if (router.currentRoute.value.path !== '/auth/login') {
          router.push('/auth/login')
        }
      }
    })
  }

  // Check if email exists (uses legacy API since Laravel doesn't have this endpoint)
  async function checkEmailExists(email) {
    try {
      if (legacyAuthApi) {
        return await legacyAuthApi.checkEmailExists(email)
      }
      return false
    } catch (err) {
      return false
    }
  }

  // Update user profile
  async function updateProfile(userData) {
    if (!user.value) return { success: false, error: 'Not authenticated' }

    isLoading.value = true
    error.value = null

    try {
      let updatedUser
      if (useLaravelBackend.value) {
        // Use Laravel profile API
        const response = await laravelAuthApi.updateProfile(userData)
        updatedUser = response
      } else if (legacyAuthApi) {
        // Use legacy API
        updatedUser = await legacyAuthApi.updateUser(user.value.id, userData)
      } else {
        throw new Error('No profile API available')
      }
      
      user.value = updatedUser

      // Persist updated user
      saveUserToStorage(updatedUser, rememberMe.value)

      return { success: true, user: updatedUser }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update profile'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Verify email
  async function verifyEmail(tokenValue) {
    isLoading.value = true
    error.value = null

    try {
      // Laravel API doesn't have this endpoint in the reference, use legacy if available
      if (legacyAuthApi) {
        const result = await legacyAuthApi.verifyEmail(tokenValue)
        return { success: true, message: result.message }
      } else {
        console.log('Email verification not implemented')
        return { success: true, message: 'Email verification not implemented' }
      }
    } catch (err) {
      error.value = err.message || 'Failed to verify email'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Refresh current user data from API
  async function refreshUser() {
    if (!token.value) return null
    
    try {
      if (useLaravelBackend.value) {
        const response = await laravelAuthApi.getCurrentUser()
        user.value = response.user || response
        return user.value
      } else if (legacyAuthApi && user.value?.id) {
        const fullUser = await legacyAuthApi.getUserById(user.value.id)
        user.value = fullUser
        return user.value
      }
    } catch (err) {
      console.error('Failed to refresh user:', err)
      return null
    }
  }

  // Clear error state
  function clearError() {
    error.value = null
  }

  // Switch backend (for development/testing)
  function switchBackend(useLaravel) {
    useLaravelBackend.value = useLaravel
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    rememberMe,
    useLaravelBackend,
    // Getters
    isAuthenticated,
    isLoggedIn,
    userRole,
    isCandidate,
    isEmployer,
    isAdmin,
    // Actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    initFromStorage,
    setupAuthListener,
    checkEmailExists,
    updateProfile,
    verifyEmail,
    loginWithOAuth,
    clearError,
    refreshUser,
    switchBackend,
  }
})