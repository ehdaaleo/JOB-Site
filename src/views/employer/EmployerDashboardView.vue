<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJobStore } from '../../stores/jobStore'
import { useAuthStore } from '../../stores/auth'
import { jobApi, applicationApi, apiErrorMessage } from '@/services/api'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const jobStore = useJobStore()
const authStore = useAuthStore()

const isLoading = ref(true)
const error = ref(null)
const myJobs = ref([])
const recentApplications = ref([])

/**
 * Use ?mine=1 so the backend returns this employer's jobs in any
 * status (pending, approved, rejected, closed).
 */
async function loadMyJobs() {
  const res = await jobApi.list({ mine: 1, per_page: 50 })
  return res.data || []
}

async function loadRecentApplications(jobs) {
  // Pull applications for up to the 3 most recent of my jobs.
  const slice = jobs.slice(0, 3)
  const buckets = await Promise.all(
    slice.map((job) =>
      applicationApi
        .listForJob(job.id, { per_page: 5 })
        .then((res) =>
          (res.data || []).map((a) => ({ ...a, job: { id: job.id, title: job.title } })),
        )
        .catch(() => []),
    ),
  )
  return buckets.flat().slice(0, 5)
}

const stats = computed(() => {
  const jobs = myJobs.value
  return [
    { label: 'Approved Jobs', value: jobs.filter((j) => j.status === 'approved').length },
    {
      label: 'Total Applications',
      value: jobs.reduce((acc, j) => acc + (j.applications_count || 0), 0),
    },
    {
      label: 'Pending Review',
      value: recentApplications.value.filter((a) => a.status === 'pending').length,
    },
    {
      label: 'Total Views',
      value: jobs.reduce((acc, j) => acc + (j.views_count || 0), 0),
    },
  ]
})

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-indigo-100 text-indigo-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''

onMounted(async () => {
  try {
    myJobs.value = await loadMyJobs()
    recentApplications.value = await loadRecentApplications(myJobs.value)
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load dashboard.')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p class="text-sm text-gray-500">Manage your job postings and applications</p>
        </div>
        <RouterLink to="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Post New Job
        </RouterLink>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>

      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl border border-gray-200 p-6">
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">My Job Postings</h2>
            <RouterLink to="/employer/manage-jobs" class="text-sm text-blue-600 hover:text-blue-700">View All</RouterLink>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="job in myJobs.slice(0, 5)" :key="job.id" class="p-3 border border-gray-200 rounded-lg">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-medium text-gray-900">{{ job.title }}</h3>
                <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(job.status)}`">{{ job.status }}</span>
              </div>
              <p class="text-sm text-gray-500">{{ job.location }} · {{ job.applications_count || 0 }} applications</p>
              <p class="text-xs text-gray-400">Posted {{ formatDate(job.created_at) }}</p>
            </div>
            <div v-if="!isLoading && myJobs.length === 0" class="text-center text-gray-500 py-4">
              No jobs posted yet. <RouterLink to="/employer/post-job" class="text-blue-600">Post your first job</RouterLink>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <RouterLink to="/employer/applications" class="text-sm text-blue-600 hover:text-blue-700">View All</RouterLink>
          </div>
          <div class="p-6 space-y-4">
            <div v-for="app in recentApplications" :key="app.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p class="font-medium text-gray-900">{{ app.candidate?.name || 'Candidate' }}</p>
                <p class="text-sm text-gray-500">{{ app.job?.title }}</p>
              </div>
              <div class="text-right">
                <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(app.status)}`">{{ app.status }}</span>
                <p class="text-xs text-gray-400 mt-1">{{ formatDate(app.created_at) }}</p>
              </div>
            </div>
            <div v-if="!isLoading && recentApplications.length === 0" class="text-center text-gray-500 py-4">
              No applications yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
