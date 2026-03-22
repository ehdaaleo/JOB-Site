import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock axios - must be before imports
vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
  
  const mockAxios = {
    create: vi.fn(() => mockAxiosInstance)
  }
  
  return {
    default: mockAxios
  }
})

// Mock router
vi.mock('@/router', () => ({
  default: {
    currentRoute: { value: { path: '/auth/login' } },
    push: vi.fn()
  }
}))

import { authApi } from '@/services/auth'
import axios from 'axios'

describe('authApi', () => {
  let api

  beforeEach(() => {
    vi.clearAllMocks()
    api = axios.create()
  })

  describe('login', () => {
    it('should use POST request for login (not GET)', async () => {
      const mockResponse = {
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        token: 'jwt-token'
      }

      api.post.mockResolvedValue({ data: mockResponse })

      await authApi.login({ email: 'john@example.com', password: 'secret123' })

      // Should use POST, not GET
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'john@example.com',
        password: 'secret123'
      })
      expect(api.get).not.toHaveBeenCalled()
    })

    it('should return user and token on successful login', async () => {
      const mockResponse = {
        user: { id: '1', name: 'John Doe', email: 'john@example.com' },
        token: 'jwt-token'
      }

      api.post.mockResolvedValue({ data: mockResponse })

      const result = await authApi.login({ email: 'john@example.com', password: 'secret123' })

      expect(result.user).toEqual(mockResponse.user)
      expect(result.token).toBe('jwt-token')
    })

    it('should handle login failure with proper error message', async () => {
      api.post.mockRejectedValue({ response: { status: 401 } })

      await expect(
        authApi.login({ email: 'wrong@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid email or password')
    })

    it('should handle rate limiting (429)', async () => {
      api.post.mockRejectedValue({ response: { status: 429 } })

      await expect(
        authApi.login({ email: 'test@example.com', password: 'secret' })
      ).rejects.toThrow('Too many login attempts')
    })
  })

  describe('register', () => {
    it('should return created user without password', async () => {
      const mockUser = {
        id: '4',
        name: 'New User',
        email: 'new@example.com',
        role: 'candidate'
      }

      api.post.mockResolvedValue({ data: mockUser })

      const result = await authApi.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'secret123',
        role: 'candidate'
      })

      expect(api.post).toHaveBeenCalledWith('/auth/register', expect.any(Object))
      expect(result.password).toBeUndefined()
    })

    it('should handle email already exists error', async () => {
      api.post.mockRejectedValue({ response: { status: 409, data: { message: 'Email already exists' } } })

      await expect(
        authApi.register({ name: 'Test', email: 'existing@example.com', password: 'secret', role: 'candidate' })
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('checkEmailExists', () => {
    it('should return true when email exists', async () => {
      api.get.mockResolvedValue({ data: [{ id: '1', email: 'exists@example.com' }] })

      const result = await authApi.checkEmailExists('exists@example.com')

      expect(result).toBe(true)
    })

    it('should return false when email does not exist', async () => {
      api.get.mockResolvedValue({ data: [] })

      const result = await authApi.checkEmailExists('notexists@example.com')

      expect(result).toBe(false)
    })

    it('should return false on error (graceful failure)', async () => {
      api.get.mockRejectedValue(new Error('Network error'))

      const result = await authApi.checkEmailExists('error@example.com')

      expect(result).toBe(false)
    })
  })

  describe('forgotPassword', () => {
    it('should return generic message to prevent user enumeration', async () => {
      api.post.mockResolvedValue({ data: {} })

      const result = await authApi.forgotPassword('user@example.com')

      expect(result.message).toContain('If the email exists')
    })

    it('should return same message even when email does not exist', async () => {
      api.post.mockRejectedValue({ response: { status: 404 } })
      api.get.mockResolvedValue({ data: [] })

      const result = await authApi.forgotPassword('notfound@example.com')

      expect(result.message).toContain('If the email exists')
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      api.post.mockResolvedValue({ data: {} })

      const result = await authApi.resetPassword('validtoken', 'newpassword123')

      expect(result.message).toContain('Password reset successful')
    })

    it('should throw error when reset token is invalid', async () => {
      api.post.mockRejectedValue({ response: { status: 400, data: { message: 'Invalid token' } } })

      await expect(
        authApi.resetPassword('invalidtoken', 'newpassword')
      ).rejects.toThrow('Invalid or expired reset token')
    })
  })

  describe('logout', () => {
    it('should clear local storage even if API call fails', async () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem')
      
      api.post.mockRejectedValue(new Error('Network error'))

      await authApi.logout()

      expect(removeItemSpy).toHaveBeenCalledWith('auth_token')
      expect(removeItemSpy).toHaveBeenCalledWith('user')
      
      removeItemSpy.mockRestore()
    })
  })

  describe('getUserById', () => {
    it('should return user without password', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'candidate'
      }

      api.get.mockResolvedValue({ data: mockUser })

      const result = await authApi.getUserById('1')

      expect(result.password).toBeUndefined()
    })
  })

  describe('updateUser', () => {
    it('should return updated user without password', async () => {
      const mockUser = {
        id: '1',
        name: 'Updated Name',
        email: 'john@example.com',
        role: 'candidate'
      }

      api.patch.mockResolvedValue({ data: mockUser })

      const result = await authApi.updateUser('1', { name: 'Updated Name' })

      expect(result.password).toBeUndefined()
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      api.post.mockResolvedValue({ data: {} })

      const result = await authApi.verifyEmail('verification-token')

      expect(result.message).toContain('Email verified successfully')
    })

    it('should throw error for invalid verification token', async () => {
      api.post.mockRejectedValue({ response: { status: 400 } })

      await expect(
        authApi.verifyEmail('invalid-token')
      ).rejects.toThrow('Invalid or expired verification token')
    })
  })

  describe('Security Tests', () => {
    it('should NOT send password in GET request params', async () => {
      api.post.mockResolvedValue({ data: { user: {}, token: 'token' } })

      await authApi.login({ email: 'test@example.com', password: 'secret' })

      expect(api.get).not.toHaveBeenCalledWith('/users', {
        params: expect.objectContaining({ password: expect.any(String) })
      })
    })

    it('should handle 401 unauthorized responses', async () => {
      api.post.mockRejectedValue({ response: { status: 401 } })

      await expect(
        authApi.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow()
    })
  })
})
