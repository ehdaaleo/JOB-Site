/**
 * Composable for Laravel API Integration
 * Provides easy access to all Laravel backend endpoints
 * with optional fallback to mock data when backend is unavailable
 */

import { ref, reactive } from 'vue'
import { 
  authApi, 
  generalApi, 
  profileApi, 
  jobApi, 
  applicationApi, 
  commentApi, 
  categoryApi,
  candidateApi,
  adminApi,
  laravelApiAll 
} from '@/services/laravelApi'

// State for API availability
const isBackendAvailable = ref(true)
const isLoading = ref(false)
const error = ref(null)

/**
 * Use Laravel API composable
 * @param {Object} options - Configuration options
 * @param {boolean} options.useFallback - Whether to use mock data fallback on error
 * @param {Function} options.onAuthError - Callback for authentication errors
 */
export function useLaravelApi(options = {}) {
  const { 
    useFallback = true, 
    onAuthError = null 
  } = options

  const localError = ref(null)
  const localLoading = ref(false)

  // Helper function to handle API errors
  const handleError = (err, fallbackData = null) => {
    localError.value = err.message || 'An error occurred'
    error.value = err
    
    // Check if it's an auth error
    if (err.response?.status === 401) {
      if (onAuthError) onAuthError(err)
      isBackendAvailable.value = false
    }
    
    // Return fallback data if available and enabled
    if (useFallback && fallbackData !== null) {
      console.warn('Using fallback data due to API error:', err.message)
      return fallbackData
    }
    
    throw err
  }

  // Helper function to wrap API calls with loading state
  const withLoading = async (promise) => {
    localLoading.value = true
    isLoading.value = true
    localError.value = null
    
    try {
      const result = await promise
      isBackendAvailable.value = true
      return result
    } catch (err) {
      return handleError(err)
    } finally {
      localLoading.value = false
      isLoading.value = false
    }
  }

  // Authentication methods
  const auth = {
    async register(userData) {
      return withLoading(authApi.register(userData))
    },
    async login(credentials) {
      return withLoading(authApi.login(credentials))
    },
    async logout() {
      return withLoading(authApi.logout())
    },
    async getCurrentUser() {
      return withLoading(authApi.getCurrentUser())
    },
    async getUserInfo() {
      return withLoading(authApi.getUserInfo())
    }
  }

  // General methods
  const general = {
    async getHomeData() {
      return withLoading(generalApi.getHomeData())
    },
    async test() {
      return withLoading(generalApi.test())
    }
  }

  // Profile methods
  const profile = {
    async getProfile() {
      return withLoading(profileApi.getProfile())
    },
    async updateProfile(profileData) {
      return withLoading(profileApi.updateProfile(profileData))
    }
  }

  // Job methods
  const jobs = {
    async getJobs(params = {}) {
      return withLoading(jobApi.getJobs(params))
    },
    async getJobById(id) {
      return withLoading(jobApi.getJobById(id))
    },
    async createJob(jobData) {
      return withLoading(jobApi.createJob(jobData))
    },
    async updateJob(id, jobData) {
      return withLoading(jobApi.updateJob(id, jobData))
    },
    async deleteJob(id) {
      return withLoading(jobApi.deleteJob(id))
    },
    async approveJob(id) {
      return withLoading(jobApi.approveJob(id))
    },
    async rejectJob(id) {
      return withLoading(jobApi.rejectJob(id))
    }
  }

  // Application methods
  const applications = {
    async getApplicationsForJob(jobId) {
      return withLoading(applicationApi.getApplicationsForJob(jobId))
    },
    async applyForJob(jobId, applicationData) {
      return withLoading(applicationApi.applyForJob(jobId, applicationData))
    },
    async getApplication(id) {
      return withLoading(applicationApi.getApplication(id))
    },
    async updateApplication(id, applicationData) {
      return withLoading(applicationApi.updateApplication(id, applicationData))
    },
    async withdrawApplication(id) {
      return withLoading(applicationApi.withdrawApplication(id))
    },
    async updateApplicationStatus(id, status, rejectionReason = null) {
      return withLoading(applicationApi.updateApplicationStatus(id, status, rejectionReason))
    },
    async processPayment(id, paymentData) {
      return withLoading(applicationApi.processPayment(id, paymentData))
    }
  }

  // Comment methods
  const comments = {
    async getCommentsForJob(jobId) {
      return withLoading(commentApi.getCommentsForJob(jobId))
    },
    async addComment(jobId, commentData) {
      return withLoading(commentApi.addComment(jobId, commentData))
    },
    async getComment(id) {
      return withLoading(commentApi.getComment(id))
    },
    async updateComment(id, commentData) {
      return withLoading(commentApi.updateComment(id, commentData))
    },
    async deleteComment(id) {
      return withLoading(commentApi.deleteComment(id))
    },
    async approveComment(id) {
      return withLoading(commentApi.approveComment(id))
    }
  }

  // Category methods (Admin only)
  const categories = {
    async getCategories() {
      return withLoading(categoryApi.getCategories())
    },
    async createCategory(categoryData) {
      return withLoading(categoryApi.createCategory(categoryData))
    },
    async getCategory(id) {
      return withLoading(categoryApi.getCategory(id))
    },
    async updateCategory(id, categoryData) {
      return withLoading(categoryApi.updateCategory(id, categoryData))
    },
    async deleteCategory(id) {
      return withLoading(categoryApi.deleteCategory(id))
    }
  }

  // Candidate methods
  const candidate = {
    async getDashboard() {
      return withLoading(candidateApi.getDashboard())
    },
    async getApplications() {
      return withLoading(candidateApi.getApplications())
    }
  }

  // Admin methods
  const admin = {
    async getDashboard() {
      return withLoading(adminApi.getDashboard())
    }
  }

  // Check backend availability
  const checkBackendHealth = async () => {
    try {
      await generalApi.test()
      isBackendAvailable.value = true
      return true
    } catch {
      isBackendAvailable.value = false
      return false
    }
  }

  // Clear error state
  const clearError = () => {
    localError.value = null
    error.value = null
  }

  return {
    // State
    isLoading: localLoading,
    error: localError,
    isBackendAvailable,
    
    // API methods
    auth,
    general,
    profile,
    jobs,
    applications,
    comments,
    categories,
    candidate,
    admin,
    
    // Utility methods
    checkBackendHealth,
    clearError,
    
    // Direct access to all APIs
    laravelApiAll
  }
}

/**
 * Simple hook for single API calls
 * @param {Function} apiCall - Async function to call
 * @param {any} fallbackData - Fallback data on error
 */
export async function useApiCall(apiCall, fallbackData = null) {
  const loading = ref(true)
  const error = ref(null)
  const data = ref(null)

  try {
    data.value = await apiCall()
  } catch (err) {
    error.value = err.message
    if (fallbackData) {
      data.value = fallbackData
    }
  } finally {
    loading.value = false
  }

  return { data, loading, error }
}

export default useLaravelApi