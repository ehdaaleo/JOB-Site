import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock localStorage BEFORE any other imports
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

const sessionStorageMock = (() => {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
})

Object.defineProperty(global, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Mock authApi
vi.mock('@/services/auth', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    getUserById: vi.fn(),
    updateUser: vi.fn(),
    checkEmailExists: vi.fn(),
    logout: vi.fn(),
    verifyEmail: vi.fn()
  }
}))

// Mock router
vi.mock('@/router', () => ({
  default: {
    push: vi.fn(),
    currentRoute: { value: { path: '/' } }
  }
}))

import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/services/auth'

describe('useAuthStore', () => {
  let store

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    setActivePinia(createPinia())
    store = useAuthStore()
  })

  describe('initial state', () => {
    it('should have null user initially', () => {
      expect(store.user).toBeNull()
    })

    it('should have null token initially', () => {
      expect(store.token).toBeNull()
    })

    it('should have false isLoggedIn initially', () => {
      expect(store.isLoggedIn).toBe(false)
    })

    it('should have false isAuthenticated initially', () => {
      expect(store.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('should set user and token on successful login', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'candidate'
      }

      authApi.login.mockResolvedValue({ user: mockUser, token: 'jwt-token', rememberMe: false })

      const result = await store.login({ email: 'john@example.com', password: 'secret' })

      expect(authApi.login).toHaveBeenCalledWith({ email: 'john@example.com', password: 'secret' })
      expect(result.success).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe('jwt-token')
      expect(store.isLoggedIn).toBe(true)
    })

    it('should use sessionStorage when rememberMe is false', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@example.com' }
      authApi.login.mockResolvedValue({ user: mockUser, token: 'token', rememberMe: false })

      await store.login({ email: 'test@example.com', password: 'secret', rememberMe: false })

      expect(sessionStorage.setItem).toHaveBeenCalledWith('auth_token', 'token')
      expect(localStorage.setItem).not.toHaveBeenCalledWith('auth_token', 'token')
    })

    it('should use localStorage when rememberMe is true', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@example.com' }
      authApi.login.mockResolvedValue({ user: mockUser, token: 'token', rememberMe: true })

      await store.login({ email: 'test@example.com', password: 'secret', rememberMe: true })

      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'token')
    })

    it('should handle login failure', async () => {
      authApi.login.mockRejectedValue(new Error('Invalid credentials'))

      const result = await store.login({ email: 'wrong@example.com', password: 'wrong' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid credentials')
      expect(store.user).toBeNull()
      expect(store.isLoggedIn).toBe(false)
    })

    it('should set isLoading to false after login completes', async () => {
      authApi.login.mockResolvedValue({ user: { id: '1' }, token: 'token', rememberMe: false })

      await store.login({ email: 'test@example.com', password: 'secret' })

      expect(store.isLoading).toBe(false)
    })
  })

  describe('register', () => {
    it('should call authApi.register with user data without confirmPassword', async () => {
      const mockUser = {
        id: '2',
        name: 'New User',
        email: 'new@example.com',
        role: 'candidate'
      }

      authApi.register.mockResolvedValue(mockUser)

      const result = await store.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'secret',
        confirmPassword: 'secret',
        role: 'candidate'
      })

      expect(authApi.register).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'secret',
        role: 'candidate'
      })
      expect(result.success).toBe(true)
      expect(result.user).toEqual(mockUser)
    })

    it('should handle registration failure', async () => {
      authApi.register.mockRejectedValue(new Error('Email already exists'))

      const result = await store.register({
        name: 'New User',
        email: 'existing@example.com',
        password: 'secret',
        role: 'candidate'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Email already exists')
    })
  })

  describe('logout', () => {
    it('should clear user, token and all storage', async () => {
      store.user = { id: '1', name: 'Test' }
      store.token = 'test-token'

      authApi.logout.mockResolvedValue({})

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token')
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('auth_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
      expect(sessionStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('forgotPassword', () => {
    it('should call authApi.forgotPassword with email', async () => {
      authApi.forgotPassword.mockResolvedValue({ message: 'Reset link sent' })

      const result = await store.forgotPassword('user@example.com')

      expect(authApi.forgotPassword).toHaveBeenCalledWith('user@example.com')
      expect(result.success).toBe(true)
      expect(result.message).toBe('Reset link sent')
    })

    it('should handle forgot password failure', async () => {
      authApi.forgotPassword.mockRejectedValue(new Error('Failed'))

      const result = await store.forgotPassword('notfound@example.com')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to send reset email')
    })
  })

  describe('resetPassword', () => {
    it('should call authApi.resetPassword with token and new password', async () => {
      authApi.resetPassword.mockResolvedValue({ message: 'Password reset successful' })

      const result = await store.resetPassword('token123', 'newpassword')

      expect(authApi.resetPassword).toHaveBeenCalledWith('token123', 'newpassword')
      expect(result.success).toBe(true)
      expect(result.message).toBe('Password reset successful')
    })

    it('should handle reset password failure', async () => {
      authApi.resetPassword.mockRejectedValue(new Error('Invalid token'))

      const result = await store.resetPassword('invalidtoken', 'newpassword')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to reset password')
    })
  })

  describe('initAuth', () => {
    it('should restore user from localStorage', () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
      const mockToken = 'test-token'

      localStorage.setItem('auth_token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))

      store.initAuth()

      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
      expect(store.isLoggedIn).toBe(true)
    })

    it('should restore user from sessionStorage', () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' }
      const mockToken = 'test-token'

      sessionStorage.setItem('auth_token', mockToken)
      sessionStorage.setItem('user', JSON.stringify(mockUser))

      store.initAuth()

      expect(store.user).toEqual(mockUser)
      expect(store.token).toBe(mockToken)
    })

    it('should not set user if storage is empty', () => {
      store.initAuth()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })
  })

  describe('checkEmailExists', () => {
    it('should return true when email exists', async () => {
      authApi.checkEmailExists.mockResolvedValue(true)

      const result = await store.checkEmailExists('existing@example.com')

      expect(result).toBe(true)
    })

    it('should return false when email does not exist', async () => {
      authApi.checkEmailExists.mockResolvedValue(false)

      const result = await store.checkEmailExists('notexisting@example.com')

      expect(result).toBe(false)
    })

    it('should return false on error', async () => {
      authApi.checkEmailExists.mockRejectedValue(new Error('Network error'))

      const result = await store.checkEmailExists('error@example.com')

      expect(result).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('should update user profile and localStorage', async () => {
      const updatedUser = { id: '1', name: 'Updated Name', email: 'test@example.com', bio: 'New bio' }
      store.user = { id: '1', name: 'Test', email: 'test@example.com' }
      store.token = { value: 'token' }
      store.rememberMe = true

      authApi.updateUser.mockResolvedValue(updatedUser)

      const result = await store.updateProfile({ name: 'Updated Name', bio: 'New bio' })

      expect(authApi.updateUser).toHaveBeenCalledWith('1', { name: 'Updated Name', bio: 'New bio' })
      expect(result.success).toBe(true)
      expect(store.user).toEqual(updatedUser)
    })

    it('should fail if not authenticated', async () => {
      store.user = null

      const result = await store.updateProfile({ name: 'Updated' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Not authenticated')
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      authApi.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' })

      const result = await store.verifyEmail('verification-token')

      expect(result.success).toBe(true)
      expect(result.message).toBe('Email verified successfully')
    })

    it('should handle verification failure', async () => {
      authApi.verifyEmail.mockRejectedValue(new Error('Invalid token'))

      const result = await store.verifyEmail('invalid-token')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to verify email')
    })
  })

  describe('clearError', () => {
    it('should clear the error state', () => {
      store.error = 'Some error'
      
      store.clearError()
      
      expect(store.error).toBeNull()
    })
  })

  describe('Auth State Persistence', () => {
    it('should use sessionStorage when rememberMe is false', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      authApi.login.mockResolvedValue({ user: mockUser, token: 'jwt-token', rememberMe: false })

      await store.login({ email: 'test@example.com', password: 'secret', rememberMe: false })

      expect(sessionStorage.setItem).toHaveBeenCalledWith('auth_token', 'jwt-token')
      expect(localStorage.setItem).not.toHaveBeenCalledWith('auth_token', 'jwt-token')
    })

    it('should use localStorage when rememberMe is true', async () => {
      const mockUser = { id: '1', email: 'test@example.com' }
      authApi.login.mockResolvedValue({ user: mockUser, token: 'jwt-token', rememberMe: true })

      await store.login({ email: 'test@example.com', password: 'secret', rememberMe: true })

      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'jwt-token')
    })
  })
})
