import axios from 'axios'
import router from '@/router'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL environment variable is required. Please create a .env file with VITE_API_URL=http://localhost:3000')
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000 // 15 second timeout
})

// Request interceptor - attach auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')

      // Dispatch custom event for auth state change
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))

      // Redirect to login if not already there
      if (router.currentRoute.value.path !== '/auth/login') {
        router.push('/auth/login')
      }
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      error.message = 'Too many attempts. Please try again later.'
    }

    return Promise.reject(error)
  }
)

export const authApi = {
  /**
   * Login user with POST request (secure)
   * @param {Object} credentials - Email and password
   * @returns {Promise<Object>} User data and token
   */
  async login({ email, password, rememberMe = false }) {
    try {
      // Try the secure auth endpoint first
      try {
        const response = await api.post('/auth/login', { email, password })
        return {
          user: response.data.user,
          token: response.data.token,
          rememberMe
        }
      } catch (authError) {
        // Fallback to JSON server structure for development
        if (authError.response?.status !== 404) {
          throw authError
        }

        // Development fallback - query users endpoint
        const response = await api.get('/users', {
          params: { email }
        })

        if (response.data.length === 0) {
          throw new Error('Invalid email or password')
        }

        const user = response.data[0]

        // Verify password (in production, this should be done server-side)
        if (user.password !== password) {
          throw new Error('Invalid email or password')
        }

        // Generate a simple token for development
        const token = btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 }))

        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = user
        return {
          user: userWithoutPassword,
          token,
          rememberMe
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password')
      }
      if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later.')
      }
      throw new Error(error.message || 'Login failed. Please try again.')
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user without password
   */
  async register(userData) {
    try {
      // Try the secure auth endpoint first
      try {
        const response = await api.post('/auth/register', userData)
        return response.data
      } catch (authError) {
        // Fallback to JSON server structure for development
        if (authError.response?.status !== 404) {
          throw authError
        }

        // Development fallback
        const response = await api.post('/users', userData)
        const { password: _, ...userWithoutPassword } = response.data
        return userWithoutPassword
      }
    } catch (error) {
      if (error.response?.status === 409 || error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || error.message
        if (errorMsg.toLowerCase().includes('email')) {
          throw new Error('Email already exists')
        }
        throw new Error(errorMsg)
      }
      throw new Error(error.message || 'Registration failed. Please try again.')
    }
  },

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} True if email exists
   */
  async checkEmailExists(email) {
    try {
      const response = await api.get('/users', {
        params: { email }
      })
      return response.data.length > 0
    } catch (error) {
      console.error('Error checking email:', error)
      return false
    }
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message (same for all cases to prevent enumeration)
   */
  async forgotPassword(email) {
    try {
      // Try the secure auth endpoint first
      try {
        await api.post('/auth/forgot-password', { email })
        return {
          message: 'If the email exists, a password reset link has been sent to your inbox.'
        }
      } catch (authError) {
        // Fallback to JSON server structure for development
        if (authError.response?.status !== 404) {
          throw authError
        }

        // Development fallback
        const response = await api.get('/users', {
          params: { email }
        })

        if (response.data.length > 0) {
          const user = response.data[0]
          // Generate a more secure token for development
          const resetToken = Array.from(crypto.getRandomValues(new Uint32Array(8)))
            .map(n => n.toString(36))
            .join('')

          const resetRequest = {
            user_id: user.id,
            email: user.email,
            token: resetToken,
            created_at: new Date().toISOString()
          }

          await api.post('/passwordResets', resetRequest)

          // In production, send email here
          console.log('Password reset token (development):', resetToken)
        }

        // Always return same message to prevent user enumeration
        return {
          message: 'If the email exists, a password reset link has been sent to your inbox.'
        }
      }
    } catch (error) {
      // Still return generic message for security
      return {
        message: 'If the email exists, a password reset link has been sent to your inbox.'
      }
    }
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Success message
   */
  async resetPassword(token, newPassword) {
    try {
      // Try the secure auth endpoint first
      try {
        await api.post('/auth/reset-password', { token, newPassword })
        return { message: 'Password reset successful. You can now log in with your new password.' }
      } catch (authError) {
        // Fallback to JSON server structure for development
        if (authError.response?.status !== 404) {
          throw authError
        }

        // Development fallback
        const response = await api.get('/passwordResets', {
          params: { token }
        })

        if (response.data.length === 0) {
          throw new Error('Invalid or expired reset token')
        }

        const resetRequest = response.data[0]

        // Update user password
        await api.patch(`/users/${resetRequest.user_id}`, {
          password: newPassword
        })

        // Delete used reset token
        await api.delete(`/passwordResets/${resetRequest.id}`)

        return { message: 'Password reset successful. You can now log in with your new password.' }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      throw new Error(errorMsg || 'Invalid or expired reset token')
    }
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      // Try to notify server of logout (optional)
      await api.post('/auth/logout').catch(() => {})
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User data without password
   */
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      const { password: _, ...userWithoutPassword } = response.data
      return userWithoutPassword
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch user')
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user without password
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.patch(`/users/${userId}`, userData)
      const { password: _, ...userWithoutPassword } = response.data
      return userWithoutPassword
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile')
    }
  },

  /**
   * Verify email with token
   * @param {string} token - Email verification token
   * @returns {Promise<Object>} Success message
   */
  async verifyEmail(token) {
    try {
      await api.post('/auth/verify-email', { token })
      return { message: 'Email verified successfully' }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid or expired verification token')
    }
  }
}

export default api
