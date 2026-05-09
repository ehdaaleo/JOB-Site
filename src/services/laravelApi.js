/**
 * Laravel Job Board API Service
 * Complete integration with Laravel backend API
 * Base URL: http://127.0.0.1:8000/api
 */

import axios from 'axios'
import router from '@/router'

const API_BASE_URL = import.meta.env.VITE_LARAVEL_API_URL || 'http://127.0.0.1:8000/api'

// Create axios instance for Laravel API
const laravelApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - Add auth token
laravelApi.interceptors.request.use(
  config => {
    // Try multiple token storage locations for compatibility
    const token = localStorage.getItem('token') || 
                  sessionStorage.getItem('token') ||
                  localStorage.getItem('auth_token') ||
                  sessionStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor - Handle errors
laravelApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear storage and redirect to login
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      
      // Dispatch event for auth state change
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
      
      if (router.currentRoute.value.path !== '/auth/login') {
        router.push('/auth/login')
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Forbidden: User does not have permission for this action')
    }
    
    if (error.response?.status === 429) {
      // Rate limiting
      error.message = 'Too many requests. Please try again later.'
    }
    
    return Promise.reject(error)
  }
)

// ==================== AUTHENTICATION ENDPOINTS ====================

export const authApi = {
  /**
   * Register a new user
   * POST /register
   */
  async register(userData) {
    const response = await laravelApi.post('/register', userData)
    return response.data
  },

  /**
   * Login user
   * POST /login
   */
  async login(credentials) {
    const response = await laravelApi.post('/login', credentials)
    return response.data
  },

  /**
   * Logout user
   * POST /logout
   */
  async logout() {
    const response = await laravelApi.post('/logout')
    return response.data
  },

  /**
   * Get current authenticated user
   * GET /me
   */
  async getCurrentUser() {
    const response = await laravelApi.get('/me')
    return response.data
  },

  /**
   * Get user info
   * GET /user
   */
  async getUserInfo() {
    const response = await laravelApi.get('/user')
    return response.data
  }
}

// ==================== GENERAL ENDPOINTS ====================

export const generalApi = {
  /**
   * Get homepage data
   * GET /home-data
   */
  async getHomeData() {
    const response = await laravelApi.get('/home-data')
    return response.data
  },

  /**
   * Test endpoint
   * GET /test
   */
  async test() {
    const response = await laravelApi.get('/test')
    return response.data
  }
}

// ==================== PROFILE ENDPOINTS ====================

export const profileApi = {
  /**
   * Get user profile
   * GET /profile
   */
  async getProfile() {
    const response = await laravelApi.get('/profile')
    return response.data
  },

  /**
   * Update user profile
   * POST /profile
   */
  async updateProfile(profileData) {
    const response = await laravelApi.post('/profile', profileData)
    return response.data
  }
}

// ==================== JOB ENDPOINTS ====================

export const jobApi = {
  /**
   * Get all jobs with pagination and filters
   * GET /jobs
   * @param {Object} params - Query parameters (page, per_page, search, location, category_id, work_type, experience_level)
   */
  async getJobs(params = {}) {
    const response = await laravelApi.get('/jobs', { params })
    return response.data
  },

  /**
   * Get job details by ID
   * GET /jobs/{id}
   */
  async getJobById(id) {
    const response = await laravelApi.get(`/jobs/${id}`)
    return response.data
  },

  /**
   * Create a new job (Employer only)
   * POST /jobs
   */
  async createJob(jobData) {
    const response = await laravelApi.post('/jobs', jobData)
    return response.data
  },

  /**
   * Update a job (Employer only)
   * PUT /jobs/{id}
   */
  async updateJob(id, jobData) {
    const response = await laravelApi.put(`/jobs/${id}`, jobData)
    return response.data
  },

  /**
   * Delete a job (Employer only)
   * DELETE /jobs/{id}
   */
  async deleteJob(id) {
    const response = await laravelApi.delete(`/jobs/${id}`)
    return response.data
  },

  /**
   * Approve a job (Admin only)
   * POST /jobs/{id}/approve
   */
  async approveJob(id) {
    const response = await laravelApi.post(`/jobs/${id}/approve`)
    return response.data
  },

  /**
   * Reject a job (Admin only)
   * POST /jobs/{id}/reject
   */
  async rejectJob(id) {
    const response = await laravelApi.post(`/jobs/${id}/reject`)
    return response.data
  }
}

// ==================== APPLICATION ENDPOINTS ====================

export const applicationApi = {
  /**
   * Get applications for a specific job (Employer only)
   * GET /jobs/{jobId}/applications
   */
  async getApplicationsForJob(jobId) {
    const response = await laravelApi.get(`/jobs/${jobId}/applications`)
    return response.data
  },

  /**
   * Apply for a job (Candidate only)
   * POST /jobs/{jobId}/applications
   */
  async applyForJob(jobId, applicationData) {
    const response = await laravelApi.post(`/jobs/${jobId}/applications`, applicationData)
    return response.data
  },

  /**
   * Get application details
   * GET /applications/{id}
   */
  async getApplication(id) {
    const response = await laravelApi.get(`/applications/${id}`)
    return response.data
  },

  /**
   * Update application
   * PUT /applications/{id}
   */
  async updateApplication(id, applicationData) {
    const response = await laravelApi.put(`/applications/${id}`, applicationData)
    return response.data
  },

  /**
   * Withdraw application (Candidate only)
   * DELETE /applications/{id}
   */
  async withdrawApplication(id) {
    const response = await laravelApi.delete(`/applications/${id}`)
    return response.data
  },

  /**
   * Update application status (Employer/Admin only)
   * POST /applications/{id}/status
   * @param {string} status - 'pending', 'accepted', 'rejected', 'interviewing'
   */
  async updateApplicationStatus(id, status, rejectionReason = null) {
    const response = await laravelApi.post(`/applications/${id}/status`, {
      status,
      rejection_reason: rejectionReason
    })
    return response.data
  },

  /**
   * Process payment for application (Employer only)
   * POST /applications/{id}/payment
   */
  async processPayment(id, paymentData) {
    const response = await laravelApi.post(`/applications/${id}/payment`, paymentData)
    return response.data
  }
}

// ==================== COMMENT ENDPOINTS ====================

export const commentApi = {
  /**
   * Get comments for a job
   * GET /jobs/{jobId}/comments
   */
  async getCommentsForJob(jobId) {
    const response = await laravelApi.get(`/jobs/${jobId}/comments`)
    return response.data
  },

  /**
   * Add comment to a job
   * POST /jobs/{jobId}/comments
   */
  async addComment(jobId, commentData) {
    const response = await laravelApi.post(`/jobs/${jobId}/comments`, commentData)
    return response.data
  },

  /**
   * Get comment details
   * GET /comments/{id}
   */
  async getComment(id) {
    const response = await laravelApi.get(`/comments/${id}`)
    return response.data
  },

  /**
   * Update comment
   * PUT /comments/{id}
   */
  async updateComment(id, commentData) {
    const response = await laravelApi.put(`/comments/${id}`, commentData)
    return response.data
  },

  /**
   * Delete comment
   * DELETE /comments/{id}
   */
  async deleteComment(id) {
    const response = await laravelApi.delete(`/comments/${id}`)
    return response.data
  },

  /**
   * Approve comment (Admin only)
   * POST /comments/{id}/approve
   */
  async approveComment(id) {
    const response = await laravelApi.post(`/comments/${id}/approve`)
    return response.data
  }
}

// ==================== CATEGORY ENDPOINTS (Admin Only) ====================

export const categoryApi = {
  /**
   * Get all categories
   * GET /categories
   */
  async getCategories() {
    const response = await laravelApi.get('/categories')
    return response.data
  },

  /**
   * Create category
   * POST /categories
   */
  async createCategory(categoryData) {
    const response = await laravelApi.post('/categories', categoryData)
    return response.data
  },

  /**
   * Get category details
   * GET /categories/{id}
   */
  async getCategory(id) {
    const response = await laravelApi.get(`/categories/${id}`)
    return response.data
  },

  /**
   * Update category
   * PUT /categories/{id}
   */
  async updateCategory(id, categoryData) {
    const response = await laravelApi.put(`/categories/${id}`, categoryData)
    return response.data
  },

  /**
   * Delete category
   * DELETE /categories/{id}
   */
  async deleteCategory(id) {
    const response = await laravelApi.delete(`/categories/${id}`)
    return response.data
  }
}

// ==================== CANDIDATE DASHBOARD ENDPOINTS ====================

export const candidateApi = {
  /**
   * Get candidate dashboard data
   * GET /candidate/dashboard
   */
  async getDashboard() {
    const response = await laravelApi.get('/candidate/dashboard')
    return response.data
  },

  /**
   * Get candidate's applications
   * GET /candidate/applications
   */
  async getApplications() {
    const response = await laravelApi.get('/candidate/applications')
    return response.data
  }
}

// ==================== ADMIN DASHBOARD ENDPOINTS ====================

export const adminApi = {
  /**
   * Get admin dashboard data
   * GET /admin/dashboard
   */
  async getDashboard() {
    const response = await laravelApi.get('/admin/dashboard')
    return response.data
  }
}

// Export the axios instance for custom requests
export { laravelApi as default }

// Export all API modules as a single object for convenience
export const laravelApiAll = {
  auth: authApi,
  general: generalApi,
  profile: profileApi,
  jobs: jobApi,
  applications: applicationApi,
  comments: commentApi,
  categories: categoryApi,
  candidate: candidateApi,
  admin: adminApi
}