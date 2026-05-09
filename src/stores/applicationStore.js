import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { applicationApi, candidateApi } from '@/services/laravelApi'
import { useJobStore } from './jobStore'

// Configuration: Set to true to use Laravel API, false to use local/mock data
const USE_LARAVEL_API = !!import.meta.env.VITE_LARAVEL_API_URL

export const useApplicationStore = defineStore('applications', () => {
  const jobStore = useJobStore()

  // State
  const applications = ref([])
  const savedJobs = ref([])
  const currentApplication = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0
  })

  // Mock Data (Initial state for fallback)
  const initialApplications = [
    {
      id: 1,
      jobId: 1,
      job: 'Senior Frontend Developer',
      company: 'TechCorp',
      candidateName: 'Sarah Johnson',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$120k - $160k',
      status: 'interviewing',
      date: '2024-01-10',
      coverLetter: 'I am excited to apply for this position because I have over 5 years of Vue.js experience and a deep passion for building accessible, performant interfaces.'
    },
    {
      id: 2,
      jobId: 2,
      job: 'Backend Engineer',
      company: 'InnovateTech',
      candidateName: 'Michael Chen',
      location: 'New York, NY',
      type: 'Hybrid',
      salary: '$130k - $170k',
      status: 'pending',
      date: '2024-01-08',
      coverLetter: 'With my experience in backend development and distributed systems, I believe I can make a meaningful impact on your team.'
    },
    {
      id: 3,
      jobId: 3,
      job: 'Product Manager',
      company: 'CloudSystems',
      candidateName: 'Emily Davis',
      location: 'Austin, TX',
      type: 'On-site',
      salary: '$110k - $150k',
      status: 'rejected',
      date: '2024-01-05',
      coverLetter: 'I am passionate about product management and have led cross-functional teams to deliver three major product launches in the past two years.'
    },
  ]

  const initialSavedJobs = [
    { id: 1, jobId: 1, job: 'Senior Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', type: 'Remote', salary: '$120k - $160k', postedAt: '2024-01-10', description: 'We are looking for a Senior Frontend Developer...' },
    { id: 2, jobId: 2, job: 'Backend Engineer', company: 'InnovateTech', location: 'New York, NY', type: 'Hybrid', salary: '$130k - $170k', postedAt: '2024-01-08', description: 'Join our backend team to build scalable...' },
  ]

  // Getters
  const myApplications = computed(() => applications.value)
  const mySavedJobs = computed(() => savedJobs.value)
  
  const applicationsByStatus = computed(() => {
    return {
      pending: applications.value.filter(a => a.status === 'pending'),
      interviewing: applications.value.filter(a => a.status === 'interviewing'),
      accepted: applications.value.filter(a => a.status === 'accepted'),
      rejected: applications.value.filter(a => a.status === 'rejected'),
    }
  })

  // Actions
  async function fetchMyApplications(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        // Use Laravel candidate applications endpoint
        const response = await candidateApi.getApplications()
        applications.value = response.data || response
        return applications.value
      } else {
        // Use local mock data
        applications.value = [...initialApplications]
        return applications.value
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch applications'
      console.error('Error fetching applications:', err)
      
      // Fallback to mock data
      applications.value = [...initialApplications]
      return applications.value
    } finally {
      isLoading.value = false
    }
  }

  async function fetchApplicationsForJob(jobId) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await applicationApi.getApplicationsForJob(jobId)
        return response.data || response
      } else {
        // Filter local applications by job ID
        return initialApplications.filter(a => a.jobId === jobId)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch applications'
      console.error('Error fetching applications:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function applyForJob(jobId, applicationData) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        // Map local field names to Laravel API field names
        const apiData = {
          resume: applicationData.resume,
          cover_letter: applicationData.cover_letter || applicationData.coverLetter,
          phone: applicationData.phone,
          email: applicationData.email,
          message: applicationData.message
        }

        const response = await applicationApi.applyForJob(jobId, apiData)
        const newApplication = response.data || response
        
        // Add to local state
        applications.value.unshift(newApplication)
        return newApplication
      } else {
        // Local application
        const job = jobStore.getJobById(jobId)
        if (!job) throw new Error('Job not found')

        const newApplication = {
          id: applications.value.length + 1,
          jobId: job.id,
          job: job.title,
          company: job.company?.name || job.company,
          location: job.location,
          type: job.workType || job.work_type,
          salary: `$${job.salaryMin/1000}K - $${job.salaryMax/1000}K`,
          status: 'pending',
          date: new Date().toISOString().split('T')[0],
          coverLetter: applicationData.coverLetter || applicationData.cover_letter || '',
          ...applicationData
        }
        applications.value.push(newApplication)
        return newApplication
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to apply for job'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchApplication(id) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await applicationApi.getApplication(id)
        currentApplication.value = response.data || response
        return currentApplication.value
      } else {
        // Search in local data
        const application = initialApplications.find(a => a.id === id)
        if (application) {
          currentApplication.value = application
          return application
        }
        throw new Error('Application not found')
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch application'
      console.error('Error fetching application:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateApplication(id, applicationData) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const apiData = {
          cover_letter: applicationData.cover_letter || applicationData.coverLetter,
          phone: applicationData.phone,
          email: applicationData.email,
          message: applicationData.message
        }

        const response = await applicationApi.updateApplication(id, apiData)
        const updatedApplication = response.data || response
        
        // Update local state
        const index = applications.value.findIndex(a => a.id === id)
        if (index !== -1) {
          applications.value[index] = updatedApplication
        }
        if (currentApplication.value && currentApplication.value.id === id) {
          currentApplication.value = updatedApplication
        }
        return updatedApplication
      } else {
        // Local update
        const index = applications.value.findIndex(a => a.id === id)
        if (index !== -1) {
          applications.value[index] = { ...applications.value[index], ...applicationData }
          return applications.value[index]
        }
        throw new Error('Application not found')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update application'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function withdrawApplication(id) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        await applicationApi.withdrawApplication(id)
      }
      
      // Remove from local state
      const index = applications.value.findIndex(a => a.id === id)
      if (index !== -1) {
        applications.value.splice(index, 1)
      }
      if (currentApplication.value && currentApplication.value.id === id) {
        currentApplication.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to withdraw application'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateApplicationStatus(id, status, rejectionReason = null) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await applicationApi.updateApplicationStatus(id, status, rejectionReason)
        const updatedApplication = response.data || response
        
        // Update local state
        const index = applications.value.findIndex(a => a.id === id)
        if (index !== -1) {
          applications.value[index] = updatedApplication
        }
        if (currentApplication.value && currentApplication.value.id === id) {
          currentApplication.value = updatedApplication
        }
        return updatedApplication
      } else {
        // Local update
        const index = applications.value.findIndex(a => a.id === id)
        if (index !== -1) {
          applications.value[index].status = status
          if (status === 'rejected' && rejectionReason) {
            applications.value[index].rejectionReason = rejectionReason
          }
          return applications.value[index]
        }
        throw new Error('Application not found')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update application status'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function processPayment(id, paymentData) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const apiData = {
          payment_id: paymentData.payment_id || paymentData.paymentId,
          amount: paymentData.amount
        }

        const response = await applicationApi.processPayment(id, apiData)
        return response.data || response
      } else {
        // Mock payment processing
        return { success: true, message: 'Payment processed successfully' }
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to process payment'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Saved Jobs functionality
  async function fetchSavedJobs() {
    isLoading.value = true
    error.value = null

    try {
      // For now, use local storage for saved jobs
      // Laravel API doesn't have a specific saved jobs endpoint in the reference
      const saved = localStorage.getItem('saved_jobs')
      if (saved) {
        savedJobs.value = JSON.parse(saved)
      } else {
        savedJobs.value = [...initialSavedJobs]
      }
      return savedJobs.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch saved jobs'
      savedJobs.value = [...initialSavedJobs]
      return savedJobs.value
    } finally {
      isLoading.value = false
    }
  }

  function saveJob(jobId) {
    const job = jobStore.getJobById(jobId)
    if (!job || savedJobs.value.find(s => s.jobId === jobId)) return false
    
    const savedJob = {
      id: savedJobs.value.length + 1,
      jobId: job.id,
      job: job.title,
      company: job.company?.name || job.company,
      location: job.location,
      type: job.workType || job.work_type,
      salary: `$${job.salaryMin/1000}K - $${job.salaryMax/1000}K`,
      postedAt: job.postedAt || new Date().toISOString().split('T')[0],
      description: job.description
    }
    
    savedJobs.value.push(savedJob)
    
    // Persist to localStorage
    localStorage.setItem('saved_jobs', JSON.stringify(savedJobs.value))
    
    return true
  }

  function unsaveJob(jobId) {
    const index = savedJobs.value.findIndex(s => s.jobId === jobId)
    if (index > -1) {
      savedJobs.value.splice(index, 1)
      // Update localStorage
      localStorage.setItem('saved_jobs', JSON.stringify(savedJobs.value))
      return true
    }
    return false
  }

  function isJobSaved(jobId) {
    return savedJobs.value.some(s => s.jobId === jobId)
  }

  function getApplicationById(id) {
    return applications.value.find(a => a.id === id)
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    applications,
    savedJobs,
    currentApplication,
    isLoading,
    error,
    pagination,
    // Getters
    myApplications,
    mySavedJobs,
    applicationsByStatus,
    // Actions
    fetchMyApplications,
    fetchApplicationsForJob,
    applyForJob,
    fetchApplication,
    updateApplication,
    withdrawApplication,
    updateApplicationStatus,
    processPayment,
    fetchSavedJobs,
    saveJob,
    unsaveJob,
    isJobSaved,
    getApplicationById,
    clearError
  }
})