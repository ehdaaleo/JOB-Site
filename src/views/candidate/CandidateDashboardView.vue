<script setup>
import { computed, onMounted, ref } from 'vue'
import { useApplicationStore } from '../../stores/applicationStore'
import { useJobStore } from '../../stores/jobStore'
import { candidateApi, apiErrorMessage } from '@/services/api'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const applicationStore = useApplicationStore()
const jobStore = useJobStore()

const dashboard = ref(null)
const isLoading = ref(true)
const error = ref(null)

const stats = computed(() => [
  {
    label: 'Applications',
    value:
      dashboard.value?.total_applications ??
      applicationStore.applications.length,
  },
  {
    label: 'Saved Jobs',
    value: applicationStore.savedJobs.length,
  },
  {
    label: 'Pending',
    value:
      dashboard.value?.pending_applications ??
      applicationStore.applicationsByStatus.pending.length,
  },
  {
    label: 'Accepted',
    value:
      dashboard.value?.accepted_applications ??
      applicationStore.applicationsByStatus.accepted.length,
  },
])

const recentApplications = computed(() =>
  applicationStore.applications.slice(0, 3),
)

const recommendedJobs = computed(() => jobStore.jobs.slice(0, 3))

const employerName = (job) =>
  job.employer?.company_name || job.employer?.organization || job.employer?.name || 'Company'

const formatSalary = (min, max) => {
  if (!min && !max) return '—'
  const fmt = (n) => `$${Math.round(Number(n) / 1000)}K`
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  return min ? `${fmt(min)}+` : `up to ${fmt(max)}`
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-indigo-100 text-indigo-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-200 text-gray-600',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

onMounted(async () => {
  try {
    const [dash] = await Promise.all([
      candidateApi.dashboard().catch(() => null),
      applicationStore.fetchMyApplications(),
      jobStore.fetchJobs({ per_page: 6 }),
    ])
    dashboard.value = dash?.data ?? dash
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
      <div class="candidate-dashboard">
        <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
            <p class="text-sm text-gray-500">Find and apply for your dream job</p>
          </div>
          <RouterLink to="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Browse Jobs
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
              <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
              <RouterLink to="/candidate/applications" class="text-sm text-blue-600 hover:text-blue-700">View All</RouterLink>
            </div>
            <div class="p-6 space-y-4">
              <div v-for="app in recentApplications" :key="app.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">{{ app.job?.title || 'Job' }}</p>
                  <p class="text-sm text-gray-500">{{ app.job?.employer?.company_name || app.job?.employer?.name || '' }}</p>
                </div>
                <div class="text-right">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(app.status)}`">
                    {{ app.status }}
                  </span>
                  <p v-if="app.created_at" class="text-xs text-gray-400 mt-1">{{ new Date(app.created_at).toLocaleDateString() }}</p>
                </div>
              </div>
              <div v-if="!isLoading && recentApplications.length === 0" class="text-center py-4 text-gray-500">
                No applications yet. <RouterLink to="/jobs" class="text-blue-600">Browse jobs</RouterLink>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900">Recommended For You</h2>
              <RouterLink to="/jobs" class="text-sm text-blue-600 hover:text-blue-700">View All</RouterLink>
            </div>
            <div class="p-6 space-y-4">
              <RouterLink v-for="job in recommendedJobs" :key="job.id" :to="`/jobs/${job.id}`" class="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900">{{ job.title }}</h3>
                  <span v-if="job.work_type" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{{ job.work_type.replace('_', ' ') }}</span>
                </div>
                <p class="text-sm text-gray-500 mb-2">{{ employerName(job) }}<span v-if="job.location"> • {{ job.location }}</span></p>
                <p class="text-sm font-medium text-green-600">{{ formatSalary(job.salary_min, job.salary_max) }}</p>
              </RouterLink>
              <div v-if="!isLoading && recommendedJobs.length === 0" class="text-center py-4 text-gray-500">
                No jobs available right now.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.candidate-dashboard { min-height: 100vh; }
</style>
