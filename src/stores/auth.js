import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, apiErrorMessage } from '@/services/api'
import router from '@/router'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

function readPersistedToken() {
  return (
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null
  )
}

function readPersistedUser() {
  const raw =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function clearPersisted() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)
}

function persist(token, user, remember) {
  const store = remember ? localStorage : sessionStorage
  // Clear the other store so we never end up with two copies.
  const other = remember ? sessionStorage : localStorage
  other.removeItem(TOKEN_KEY)
  other.removeItem(USER_KEY)
  store.setItem(TOKEN_KEY, token)
  store.setItem(USER_KEY, JSON.stringify(user))
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(readPersistedUser())
  const token = ref(readPersistedToken())
  const isLoading = ref(false)
  const error = ref(null)
  const rememberMe = ref(!!localStorage.getItem(TOKEN_KEY))
  let listenersAttached = false

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isCandidate = computed(() => userRole.value === 'candidate')
  const isEmployer = computed(() => userRole.value === 'employer')
  const isAdmin = computed(() => userRole.value === 'admin')

  /** Where this user belongs after login. */
  const dashboardRoute = computed(() => {
    switch (userRole.value) {
      case 'employer':
        return { name: 'employer-dashboard' }
      case 'admin':
        return { name: 'admin-dashboard' }
      case 'candidate':
        return { name: 'candidate-dashboard' }
      default:
        return { name: 'home' }
    }
  })

  function attachAuthListeners() {
    if (listenersAttached || typeof window === 'undefined') return
    listenersAttached = true

    // Server told us the token is no longer valid.
    window.addEventListener('auth:unauthorized', () => {
      handleLocalLogout()
      if (router.currentRoute.value.name !== 'login') {
        router.push({
          name: 'login',
          query: { redirect: router.currentRoute.value.fullPath },
        })
      }
    })

    // Another tab cleared the token — sync this tab.
    window.addEventListener('storage', (event) => {
      if ((event.key === TOKEN_KEY || event.key === USER_KEY) && !event.newValue) {
        handleLocalLogout()
      }
    })
  }

  /** Called once from App.vue#onMounted. */
  async function bootstrap() {
    attachAuthListeners()
    if (!token.value) return
    // Refresh from /me so role/profile are up to date even if the
    // persisted snapshot is stale.
    try {
      const res = await authApi.me()
      user.value = res.user || res
      persist(token.value, user.value, rememberMe.value)
    } catch {
      // Interceptor already cleared storage on 401.
    }
  }

  async function login(credentials) {
    isLoading.value = true
    error.value = null
    rememberMe.value = !!credentials.rememberMe
    try {
      const res = await authApi.login({
        email: credentials.email,
        password: credentials.password,
        remember_me: rememberMe.value,
      })
      const authToken = res.token
      const userData = res.user
      if (!authToken || !userData) {
        throw new Error('Malformed login response.')
      }
      token.value = authToken
      user.value = userData
      persist(authToken, userData, rememberMe.value)
      return { success: true, user: userData }
    } catch (err) {
      error.value = apiErrorMessage(err, 'Login failed.')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload) {
    isLoading.value = true
    error.value = null
    try {
      const { confirmPassword, rememberMe: _rm, ...rest } = payload
      // Laravel expects password_confirmation; accept either shape.
      const body = {
        ...rest,
        password_confirmation:
          rest.password_confirmation || confirmPassword || rest.password,
      }
      const res = await authApi.register(body)
      return { success: true, user: res.user || res }
    } catch (err) {
      error.value = apiErrorMessage(err, 'Registration failed.')
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  function handleLocalLogout() {
    user.value = null
    token.value = null
    rememberMe.value = false
    clearPersisted()
  }

  async function logout() {
    isLoading.value = true
    try {
      if (token.value) await authApi.logout()
    } catch {
      // Even if the server call fails, drop local credentials.
    } finally {
      handleLocalLogout()
      isLoading.value = false
      router.push({ name: 'login' })
    }
  }

  /** Re-fetch the current user, e.g. after a profile update. */
  async function refresh() {
    if (!token.value) return null
    try {
      const res = await authApi.me()
      user.value = res.user || res
      persist(token.value, user.value, rememberMe.value)
      return user.value
    } catch {
      return null
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // state
    user,
    token,
    isLoading,
    error,
    rememberMe,
    // getters
    isAuthenticated,
    userRole,
    isCandidate,
    isEmployer,
    isAdmin,
    dashboardRoute,
    // actions
    bootstrap,
    login,
    register,
    logout,
    refresh,
    clearError,
  }
})
