import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  applicationApi,
  candidateApi,
  apiErrorMessage,
} from '@/services/api'

const SAVED_JOBS_KEY = 'saved_jobs'

/**
 * Saved jobs are intentionally a frontend-only feature backed by
 * localStorage — the Laravel API has no endpoint for them.
 */
function readSavedJobs() {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeSavedJobs(items) {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(items))
}

export const useApplicationStore = defineStore('applications', () => {
  const applications = ref([])
  const savedJobs = ref(readSavedJobs())
  const currentApplication = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const applicationsByStatus = computed(() => {
    const buckets = {
      pending: [],
      reviewed: [],
      shortlisted: [],
      accepted: [],
      rejected: [],
      withdrawn: [],
    }
    for (const app of applications.value) {
      const key = buckets[app.status] ? app.status : 'pending'
      buckets[key].push(app)
    }
    return buckets
  })

  async function fetchMyApplications() {
    isLoading.value = true
    error.value = null
    try {
      const res = await candidateApi.applications()
      applications.value = res.data ?? res
      return applications.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load applications.')
      applications.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchApplicationsForJob(jobId, params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const res = await applicationApi.listForJob(jobId, params)
      return res.data ?? res
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load applications.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function applyForJob(jobId, applicationData) {
    isLoading.value = true
    error.value = null
    try {
      const payload = {
        resume: applicationData.resume,
        cover_letter:
          applicationData.cover_letter ?? applicationData.coverLetter,
        phone: applicationData.phone,
        email: applicationData.email,
        message: applicationData.message,
      }
      const res = await applicationApi.apply(jobId, payload)
      const created = res.data ?? res
      applications.value = [created, ...applications.value]
      return created
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to apply.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchApplication(jobId, applicationId) {
    isLoading.value = true
    error.value = null
    try {
      const res = await applicationApi.show(jobId, applicationId)
      currentApplication.value = res.data ?? res
      return currentApplication.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load application.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateApplication(jobId, applicationId, applicationData) {
    isLoading.value = true
    error.value = null
    try {
      const payload = {
        cover_letter:
          applicationData.cover_letter ?? applicationData.coverLetter,
        phone: applicationData.phone,
        email: applicationData.email,
        message: applicationData.message,
        resume: applicationData.resume,
      }
      const res = await applicationApi.update(jobId, applicationId, payload)
      const updated = res.data ?? res
      const idx = applications.value.findIndex(
        (a) => String(a.id) === String(applicationId),
      )
      if (idx !== -1) applications.value[idx] = updated
      if (
        currentApplication.value &&
        String(currentApplication.value.id) === String(applicationId)
      ) {
        currentApplication.value = updated
      }
      return updated
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to update application.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function withdrawApplication(jobId, applicationId) {
    isLoading.value = true
    error.value = null
    try {
      await applicationApi.withdraw(jobId, applicationId)
      applications.value = applications.value.filter(
        (a) => String(a.id) !== String(applicationId),
      )
      if (
        currentApplication.value &&
        String(currentApplication.value.id) === String(applicationId)
      ) {
        currentApplication.value = null
      }
      return true
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to withdraw application.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateApplicationStatus(applicationId, status, rejectionReason = null) {
    isLoading.value = true
    error.value = null
    try {
      const res = await applicationApi.updateStatus(
        applicationId,
        status,
        rejectionReason,
      )
      const updated = res.data ?? res
      const idx = applications.value.findIndex(
        (a) => String(a.id) === String(applicationId),
      )
      if (idx !== -1) applications.value[idx] = updated
      if (
        currentApplication.value &&
        String(currentApplication.value.id) === String(applicationId)
      ) {
        currentApplication.value = updated
      }
      return updated
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to update status.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── Saved jobs (localStorage only) ─────────────────────────────────────────
  function saveJob(job) {
    if (!job || !job.id) return false
    if (savedJobs.value.some((s) => String(s.id) === String(job.id))) {
      return false
    }
    const snapshot = {
      id: job.id,
      title: job.title,
      location: job.location,
      work_type: job.work_type,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      employer: job.employer
        ? { id: job.employer.id, name: job.employer.name, company_name: job.employer.company_name }
        : null,
      saved_at: new Date().toISOString(),
    }
    savedJobs.value = [snapshot, ...savedJobs.value]
    writeSavedJobs(savedJobs.value)
    return true
  }

  function unsaveJob(jobId) {
    const next = savedJobs.value.filter((s) => String(s.id) !== String(jobId))
    if (next.length === savedJobs.value.length) return false
    savedJobs.value = next
    writeSavedJobs(savedJobs.value)
    return true
  }

  function isJobSaved(jobId) {
    return savedJobs.value.some((s) => String(s.id) === String(jobId))
  }

  function clearError() {
    error.value = null
  }

  return {
    applications,
    savedJobs,
    currentApplication,
    isLoading,
    error,
    applicationsByStatus,
    fetchMyApplications,
    fetchApplicationsForJob,
    applyForJob,
    fetchApplication,
    updateApplication,
    withdrawApplication,
    updateApplicationStatus,
    saveJob,
    unsaveJob,
    isJobSaved,
    clearError,
  }
})
