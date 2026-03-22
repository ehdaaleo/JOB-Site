import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { authApi } from '@/services/auth'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || null)
  const isLoading = ref(false)
  const error = ref(null)
  const rememberMe = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isLoggedIn = computed(() => !!user.value && !!token.value)

  // Watch for token changes and persist accordingly
  watch(token, (newToken) => {
    if (newToken) {
      if (rememberMe.value) {
        localStorage.setItem('auth_token', newToken)
      } else {
        sessionStorage.setItem('auth_token', newToken)
      }
    }
  })

  // Watch for user changes and persist
  watch(user, (newUser) => {
    if (newUser) {
      const userData = JSON.stringify(newUser)
      if (rememberMe.value) {
        localStorage.setItem('user', userData)
      } else {
        sessionStorage.setItem('user', userData)
      }
    }
  })

  // Actions
  async function login(credentials) {
    isLoading.value = true
    error.value = null
    rememberMe.value = credentials.rememberMe || false

    try {
      const { user: userData, token: authToken, rememberMe: shouldRemember } = await authApi.login(credentials)
      
      user.value = userData
      token.value = authToken
      rememberMe.value = shouldRemember

      // Persist based on rememberMe choice
      if (rememberMe.value) {
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        sessionStorage.setItem('auth_token', authToken)
        sessionStorage.setItem('user', JSON.stringify(userData))
      }

      return { success: true, user: userData }
    } catch (err) {
      error.value = err.message || 'Login failed'
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
      const newUser = await authApi.register(dataWithoutConfirm)
      return { success: true, user: newUser }
    } catch (err) {
      error.value = err.message || 'Registration failed'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function forgotPassword(email) {
    isLoading.value = true
    error.value = null

    try {
      const result = await authApi.forgotPassword(email)
      return { success: true, message: result.message }
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
      const result = await authApi.resetPassword(tokenValue, newPassword)
      return { success: true, message: result.message }
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
      await authApi.logout()
    } finally {
      user.value = null
      token.value = null
      rememberMe.value = false
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      isLoading.value = false
      
      // Redirect to login
      router.push('/auth/login')
    }
  }

  // Initialize user from localStorage/sessionStorage on store creation
  function initAuth() {
    const storedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
      rememberMe.value = !!localStorage.getItem('auth_token')
    }
  }

  // Setup auth state listener for token expiration
  function setupAuthListener() {
    window.addEventListener('auth:unauthorized', () => {
      user.value = null
      token.value = null
      router.push('/auth/login')
    })

    // Listen for storage changes (logout in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'auth_token' && !event.newValue) {
        user.value = null
        token.value = null
        if (router.currentRoute.value.path !== '/auth/login') {
          router.push('/auth/login')
        }
      }
    })
  }

  // Check if email exists
  async function checkEmailExists(email) {
    try {
      return await authApi.checkEmailExists(email)
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
      const updatedUser = await authApi.updateUser(user.value.id, userData)
      user.value = updatedUser
      
      // Persist updated user
      if (rememberMe.value) {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      } else {
        sessionStorage.setItem('user', JSON.stringify(updatedUser))
      }
      
      return { success: true, user: updatedUser }
    } catch (err) {
      error.value = err.message || 'Failed to update profile'
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
      const result = await authApi.verifyEmail(tokenValue)
      return { success: true, message: result.message }
    } catch (err) {
      error.value = err.message || 'Failed to verify email'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Clear error state
  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    rememberMe,
    // Getters
    isAuthenticated,
    isLoggedIn,
    // Actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    initAuth,
    setupAuthListener,
    checkEmailExists,
    updateProfile,
    verifyEmail,
    clearError
  }
})
