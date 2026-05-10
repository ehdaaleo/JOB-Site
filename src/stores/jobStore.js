import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jobApi, apiErrorMessage } from '@/services/api'

/**
 * Backend job statuses are: pending | approved | rejected | closed.
 * The SPA used to label "approved" as "active" in places — keep the
 * raw enum and let views translate for display.
 */
export const useJobStore = defineStore('jobs', () => {
  const jobs = ref([])
  const currentJob = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = ref({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  })
  const filters = ref({
    search: '',
    location: '',
    category_id: null,
    work_type: '',
    experience_level: '',
  })

  const approvedJobs = computed(() =>
    jobs.value.filter((j) => j.status === 'approved'),
  )
  const pendingJobs = computed(() =>
    jobs.value.filter((j) => j.status === 'pending'),
  )

  function setLastPage(p) {
    pagination.value = {
      currentPage: p.current_page ?? 1,
      lastPage: p.last_page ?? 1,
      perPage: p.per_page ?? 15,
      total: p.total ?? 0,
    }
  }

  async function fetchJobs(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const apiParams = {
        page: params.page || 1,
        per_page: params.per_page || 15,
        search: params.search || params.keyword || filters.value.search || '',
        location: params.location || filters.value.location || '',
        category_id:
          params.category_id || params.category || filters.value.category_id,
        work_type:
          params.work_type || params.workType || filters.value.work_type || '',
        experience_level:
          params.experience_level ||
          params.experienceLevel ||
          filters.value.experience_level ||
          '',
      }
      // Strip empty values so Laravel sees absent params instead of "" matches.
      Object.keys(apiParams).forEach(
        (k) =>
          (apiParams[k] === '' || apiParams[k] == null) && delete apiParams[k],
      )

      const res = await jobApi.list(apiParams)
      jobs.value = res.data || []
      setLastPage(res)
      return jobs.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load jobs.')
      jobs.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchJobById(id) {
    isLoading.value = true
    error.value = null
    try {
      const res = await jobApi.show(id)
      currentJob.value = res.data || res
      return currentJob.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load job.')
      currentJob.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  function normalizeJobPayload(input) {
    return {
      title: input.title,
      description: input.description,
      category_id: input.category_id ?? input.categoryId,
      location: input.location,
      work_type: input.work_type ?? input.workType,
      experience_level: input.experience_level ?? input.experienceLevel,
      salary_min: input.salary_min ?? input.salaryMin,
      salary_max: input.salary_max ?? input.salaryMax,
      responsibilities: input.responsibilities,
      requirements: input.requirements,
      benefits: input.benefits,
      application_deadline: input.application_deadline ?? input.deadline,
      company_logo: input.company_logo ?? input.companyLogo,
      technology_ids: input.technology_ids ?? input.technologyIds,
    }
  }

  async function createJob(jobData) {
    isLoading.value = true
    error.value = null
    try {
      const res = await jobApi.create(normalizeJobPayload(jobData))
      const created = res.data || res
      jobs.value = [created, ...jobs.value]
      return created
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to create job.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateJob(id, jobData) {
    isLoading.value = true
    error.value = null
    try {
      const res = await jobApi.update(id, normalizeJobPayload(jobData))
      const updated = res.data || res
      const idx = jobs.value.findIndex((j) => String(j.id) === String(id))
      if (idx !== -1) jobs.value[idx] = updated
      if (currentJob.value && String(currentJob.value.id) === String(id)) {
        currentJob.value = updated
      }
      return updated
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to update job.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteJob(id) {
    isLoading.value = true
    error.value = null
    try {
      await jobApi.destroy(id)
      jobs.value = jobs.value.filter((j) => String(j.id) !== String(id))
      if (currentJob.value && String(currentJob.value.id) === String(id)) {
        currentJob.value = null
      }
      return true
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to delete job.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function approveJob(id) {
    try {
      const res = await jobApi.approve(id)
      const updated = res.data || res
      const idx = jobs.value.findIndex((j) => String(j.id) === String(id))
      if (idx !== -1) jobs.value[idx] = updated
      return updated
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to approve job.')
      throw err
    }
  }

  async function rejectJob(id, reason) {
    try {
      const res = await jobApi.reject(id, reason)
      const updated = res.data || res
      const idx = jobs.value.findIndex((j) => String(j.id) === String(id))
      if (idx !== -1) jobs.value[idx] = updated
      return updated
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to reject job.')
      throw err
    }
  }

  function getJobById(id) {
    if (!id) return undefined
    const search = String(id).trim()
    return jobs.value.find((j) => String(j.id).trim() === search)
  }

  function setFilters(next) {
    filters.value = { ...filters.value, ...next }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      location: '',
      category_id: null,
      work_type: '',
      experience_level: '',
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // state
    jobs,
    currentJob,
    isLoading,
    error,
    pagination,
    filters,
    // getters
    approvedJobs,
    pendingJobs,
    // actions
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
    clearError,
  }
})
