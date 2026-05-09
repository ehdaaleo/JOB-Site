import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { jobApi } from '@/services/laravelApi'

// Configuration: Set to true to use Laravel API, false to use local/mock data
const USE_LARAVEL_API = !!import.meta.env.VITE_LARAVEL_API_URL

export const useJobStore = defineStore('jobs', () => {
  // State
  const jobs = ref([])
  const currentJob = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0
  })
  const filters = ref({
    search: '',
    location: '',
    category_id: null,
    work_type: '',
    experience_level: ''
  })

  // Mock Data (Initial state for fallback)
  const initialData = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: { id: 1, name: 'TechCorp Inc.', location: 'San Francisco, CA', industry: 'Technology' },
      location: 'San Francisco, CA',
      workType: 'remote',
      salaryMin: 120000,
      salaryMax: 160000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'GraphQL'],
      description: 'We are looking for a Senior Frontend Developer to join our team...',
      responsibilities: '- Lead frontend development\n- Mentor junior developers\n- Collaborate with design team',
      requirements: '- 5+ years frontend experience\n- Strong Vue.js/React skills\n- Experience with TypeScript',
      category: 'programming',
      categoryId: 1,
      type: 'full-time',
      work_type: 'full_time',
      experienceLevel: 'senior',
      experience_level: 'senior',
      postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: 'active',
      applicationsCount: 12,
      comments: [
        {
          id: 'c1',
          user: {
            id: 'u2',
            name: 'Issac',
            initials: 'IS',
            avatarColor: '#10b981',
            role: 'Employer'
          },
          time: (new Date().toLocaleString()),
          content: 'We are very excited to hear from all the applicants! Feel free to ask any questions about the role here.',
          timestamp: Date.now() - 7200000 
        },
        {
          id: 'c2',
          user: {
            id: 'u3',
            name: 'Gerges',
            initials: 'GJ',
            avatarColor: '#3b82f6',
            role: 'Candidate'
          },
          time: (new Date().toLocaleString()),
          content: 'Is this role strictly onsite or does it offer a hybrid schedule?',
          timestamp: Date.now() - 3600000 
        }
      ]
    },
    {
      id: 2,
      title: 'Product Manager',
      company: { id: 2, name: 'InnovateTech', location: 'New York, NY', industry: 'Software' },
      location: 'New York, NY',
      workType: 'hybrid',
      salaryMin: 130000,
      salaryMax: 180000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Roadmapping'],
      description: 'Join our product team to drive innovation...',
      responsibilities: '- Define product roadmap\n- Work with engineering teams\n- Conduct user research',
      requirements: '- 3+ years PM experience\n- Strong analytical skills\n- MBA preferred',
      category: 'management',
      categoryId: 2,
      type: 'full-time',
      work_type: 'full_time',
      experienceLevel: 'mid',
      experience_level: 'mid',
      postedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: 'active',
      applicationsCount: 8,
      comments: []
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: { id: 3, name: 'DesignStudio', location: 'Remote', industry: 'Design' },
      location: 'Remote',
      workType: 'remote',
      salaryMin: 90000,
      salaryMax: 130000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
      description: 'Create beautiful and intuitive user experiences...',
      responsibilities: '- Design user interfaces\n- Conduct usability tests\n- Create design systems',
      requirements: '- 4+ years UX/UI experience\n- Strong portfolio\n- Figma expertise',
      category: 'design',
      categoryId: 3,
      type: 'full-time',
      work_type: 'full_time',
      experienceLevel: 'mid',
      experience_level: 'mid',
      postedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: 'active',
      applicationsCount: 15,
      comments: []
    },
    {
      id: 4,
      title: 'Backend Engineer',
      company: { id: 4, name: 'CloudSystems', location: 'Austin, TX', industry: 'Cloud Computing' },
      location: 'Austin, TX',
      workType: 'onsite',
      salaryMin: 110000,
      salaryMax: 150000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
      description: 'Build scalable backend services...',
      responsibilities: '- Design API endpoints\n- Optimize database queries\n- Implement microservices',
      requirements: '- 3+ years backend experience\n- Python/Django proficiency\n- Cloud experience',
      category: 'programming',
      categoryId: 1,
      type: 'full-time',
      work_type: 'full_time',
      experienceLevel: 'mid',
      experience_level: 'mid',
      postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false,
      status: 'active',
      applicationsCount: 6,
      comments: []
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: { id: 5, name: 'InfraTech', location: 'Seattle, WA', industry: 'Infrastructure' },
      location: 'Seattle, WA',
      workType: 'hybrid',
      salaryMin: 140000,
      salaryMax: 190000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'AWS', 'Linux'],
      description: 'Manage cloud infrastructure and CI/CD pipelines...',
      responsibilities: '- Maintain Kubernetes clusters\n- Build CI/CD pipelines\n- Infrastructure as Code',
      requirements: '- 4+ years DevOps experience\n- Strong Kubernetes knowledge\n- AWS certification preferred',
      category: 'programming',
      categoryId: 1,
      type: 'full-time',
      work_type: 'full_time',
      experienceLevel: 'senior',
      experience_level: 'senior',
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false,
      status: 'active',
      applicationsCount: 9,
      comments: []
    },
    {
      id: 6,
      title: 'Marketing Manager',
      company: { id: 6, name: 'GrowthLabs', location: 'Los Angeles, CA', industry: 'Marketing' },
      location: 'Los Angeles, CA',
      workType: 'onsite',
      salaryMin: 80000,
      salaryMax: 120000,
      salaryPeriod: 'yearly',
      salaryCurrency: 'USD',
      skills: ['Digital Marketing', 'SEO', 'Analytics', 'Content Strategy', 'Social Media'],
      description: 'Lead marketing campaigns and brand strategy...',
      responsibilities: '- Develop marketing strategy\n- Manage campaigns\n- Analyze performance metrics',
      requirements: '- 5+ years marketing experience\n- Strong analytical skills\n- Experience with B2B marketing',
      category: 'marketing',
      categoryId: 4,
      type: 'full-time',
      work_type: 'full_time',
      experienceLevel: 'senior',
      experience_level: 'senior',
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
      featured: false,
      status: 'pending',
      applicationsCount: 0,
      comments: []
    }
  ]

  // Getters
  const activeJobs = computed(() => jobs.value.filter(job => job.status === 'active'))
  const featuredJobs = computed(() => activeJobs.value.filter(job => job.featured))
  const pendingJobs = computed(() => jobs.value.filter(job => job.status === 'pending'))
  const allJobs = computed(() => jobs.value)

  // Actions
  async function fetchJobs(params = {}) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        // Map local filter names to Laravel API parameter names
        const apiParams = {
          page: params.page || 1,
          per_page: params.per_page || 15,
          search: params.search || params.keyword || '',
          location: params.location || '',
          category_id: params.category_id || params.category || null,
          work_type: params.work_type || params.workType || '',
          experience_level: params.experience_level || params.experienceLevel || ''
        }

        const response = await jobApi.getJobs(apiParams)
        
        // Laravel API returns { data: [...], current_page, last_page, per_page, total }
        jobs.value = response.data || []
        pagination.value = {
          currentPage: response.current_page || 1,
          lastPage: response.last_page || 1,
          perPage: response.per_page || 15,
          total: response.total || 0
        }
      } else {
        // Use local mock data
        let filteredJobs = [...initialData]
        
        // Apply filters
        if (params.search || params.keyword) {
          const keyword = (params.search || params.keyword).toLowerCase()
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(keyword) ||
            job.description.toLowerCase().includes(keyword) ||
            job.skills?.some(skill => skill.toLowerCase().includes(keyword))
          )
        }
        
        if (params.location) {
          filteredJobs = filteredJobs.filter(job => 
            job.location?.toLowerCase().includes(params.location.toLowerCase())
          )
        }
        
        if (params.category_id || params.category) {
          const catId = params.category_id || params.category
          filteredJobs = filteredJobs.filter(job => 
            job.categoryId === catId || job.category === catId
          )
        }
        
        if (params.work_type || params.workType) {
          const wt = params.work_type || params.workType
          filteredJobs = filteredJobs.filter(job => 
            job.work_type === wt || job.workType === wt
          )
        }
        
        if (params.experience_level || params.experienceLevel) {
          const el = params.experience_level || params.experienceLevel
          filteredJobs = filteredJobs.filter(job => 
            job.experience_level === el || job.experienceLevel === el
          )
        }

        // Pagination
        const page = params.page || 1
        const perPage = params.per_page || params.perPage || 15
        const start = (page - 1) * perPage
        const paginatedJobs = filteredJobs.slice(start, start + perPage)

        jobs.value = paginatedJobs
        pagination.value = {
          currentPage: page,
          lastPage: Math.ceil(filteredJobs.length / perPage),
          perPage: perPage,
          total: filteredJobs.length
        }
      }

      return jobs.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch jobs'
      console.error('Error fetching jobs:', err)
      
      // Fallback to mock data on error
      jobs.value = [...initialData]
      return jobs.value
    } finally {
      isLoading.value = false
    }
  }

  async function fetchJobById(id) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await jobApi.getJobById(id)
        currentJob.value = response.data || response
      } else {
        // Search in local data
        const job = initialData.find(j => String(j.id) === String(id))
        if (job) {
          currentJob.value = job
        } else {
          throw new Error('Job not found')
        }
      }

      return currentJob.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch job'
      console.error('Error fetching job:', err)
      
      // Fallback to mock data
      const fallbackJob = initialData.find(j => String(j.id) === String(id))
      if (fallbackJob) {
        currentJob.value = fallbackJob
        return fallbackJob
      }
      
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createJob(jobData) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        // Map local field names to Laravel API field names
        const apiData = {
          title: jobData.title,
          description: jobData.description,
          category_id: jobData.category_id || jobData.categoryId,
          location: jobData.location,
          work_type: jobData.work_type || jobData.workType,
          experience_level: jobData.experience_level || jobData.experienceLevel,
          salary_min: jobData.salary_min || jobData.salaryMin,
          salary_max: jobData.salary_max || jobData.salaryMax,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          application_deadline: jobData.application_deadline || jobData.deadline
        }

        const response = await jobApi.createJob(apiData)
        const newJob = response.data || response
        
        // Add to local state
        jobs.value.unshift(newJob)
        return newJob
      } else {
        // Local creation
        const newJob = {
          ...jobData,
          id: jobs.value.length + 1,
          postedAt: new Date().toISOString(),
          status: 'pending',
          applicationsCount: 0,
          comments: []
        }
        jobs.value.unshift(newJob)
        return newJob
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to create job'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateJob(id, jobData) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const apiData = {
          title: jobData.title,
          description: jobData.description,
          category_id: jobData.category_id || jobData.categoryId,
          location: jobData.location,
          work_type: jobData.work_type || jobData.workType,
          experience_level: jobData.experience_level || jobData.experienceLevel,
          salary_min: jobData.salary_min || jobData.salaryMin,
          salary_max: jobData.salary_max || jobData.salaryMax,
          responsibilities: jobData.responsibilities,
          requirements: jobData.requirements,
          benefits: jobData.benefits,
          application_deadline: jobData.application_deadline || jobData.deadline
        }

        const response = await jobApi.updateJob(id, apiData)
        const updatedJob = response.data || response
        
        // Update local state
        const index = jobs.value.findIndex(j => String(j.id) === String(id))
        if (index !== -1) {
          jobs.value[index] = updatedJob
        }
        if (currentJob.value && String(currentJob.value.id) === String(id)) {
          currentJob.value = updatedJob
        }
        return updatedJob
      } else {
        // Local update
        const index = jobs.value.findIndex(j => String(j.id) === String(id))
        if (index !== -1) {
          jobs.value[index] = { ...jobs.value[index], ...jobData }
          return jobs.value[index]
        }
        throw new Error('Job not found')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Failed to update job'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteJob(id) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        await jobApi.deleteJob(id)
      }
      
      // Remove from local state
      const index = jobs.value.findIndex(j => String(j.id) === String(id))
      if (index !== -1) {
        jobs.value.splice(index, 1)
      }
      if (currentJob.value && String(currentJob.value.id) === String(id)) {
        currentJob.value = null
      }
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to delete job'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approveJob(id) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await jobApi.approveJob(id)
        const approvedJob = response.data || response
        
        // Update local state
        const index = jobs.value.findIndex(j => String(j.id) === String(id))
        if (index !== -1) {
          jobs.value[index] = approvedJob
        }
        if (currentJob.value && String(currentJob.value.id) === String(id)) {
          currentJob.value = approvedJob
        }
        return approvedJob
      } else {
        // Local approval
        const job = jobs.value.find(j => String(j.id) === String(id))
        if (job) {
          job.status = 'active'
          job.featured = true
        }
        return job
      }
    } catch (err) {
      error.value = err.message || 'Failed to approve job'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function rejectJob(id) {
    isLoading.value = true
    error.value = null

    try {
      if (USE_LARAVEL_API) {
        const response = await jobApi.rejectJob(id)
        const rejectedJob = response.data || response
        
        // Update local state
        const index = jobs.value.findIndex(j => String(j.id) === String(id))
        if (index !== -1) {
          jobs.value[index] = rejectedJob
        }
        if (currentJob.value && String(currentJob.value.id) === String(id)) {
          currentJob.value = rejectedJob
        }
        return rejectedJob
      } else {
        // Local rejection
        const job = jobs.value.find(j => String(j.id) === String(id))
        if (job) {
          job.status = 'rejected'
        }
        return job
      }
    } catch (err) {
      error.value = err.message || 'Failed to reject job'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function getJobById(id) {
    if (!id) return undefined
    
    const searchId = String(id).trim()
    let found = jobs.value.find(j => String(j.id).trim() === searchId)
    
    // Fallback to initial data if not in reactive state
    if (!found) {
      found = initialData.find(j => String(j.id).trim() === searchId)
    }
    
    return found
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      location: '',
      category_id: null,
      work_type: '',
      experience_level: ''
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    jobs,
    currentJob,
    isLoading,
    error,
    pagination,
    filters,
    // Getters
    activeJobs,
    featuredJobs,
    pendingJobs,
    allJobs,
    // Actions
    fetchJobs,
    fetchJobById,
    createJob,
    updateJob,
    deleteJob,
    approveJob,
    rejectJob,
    getJobById,
    setFilters,
    clearFilters,
    clearError
  }
})