<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminApi, apiErrorMessage } from '@/services/api'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const data = ref(null)
const isLoading = ref(true)
const error = ref(null)

const stats = computed(() => {
  const s = data.value?.stats || {}
  return [
    { label: 'Total Users', value: s.total_users ?? 0 },
    { label: 'Total Jobs', value: s.total_jobs ?? 0 },
    { label: 'Pending Jobs', value: s.pending_jobs ?? 0 },
    { label: 'Total Applications', value: s.total_applications ?? 0 },
  ]
})

const recentJobs = computed(() => data.value?.recent_jobs || [])
const recentApplications = computed(() => data.value?.recent_applications || [])

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '')

const getStatusClass = (status) =>
  ({
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    closed: 'bg-gray-100 text-gray-700',
    accepted: 'bg-green-100 text-green-700',
    reviewed: 'bg-blue-100 text-blue-700',
    shortlisted: 'bg-indigo-100 text-indigo-700',
  })[status] || 'bg-gray-100 text-gray-700'

onMounted(async () => {
  try {
    const res = await adminApi.dashboard()
    data.value = res.data ?? res
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load admin dashboard.')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-sm text-gray-500">Manage the job board platform</p>
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
            <h2 class="text-lg font-semibold text-gray-900">Recent Jobs</h2>
            <RouterLink to="/admin/pending-jobs" class="text-sm text-blue-600 hover:text-blue-700">Pending →</RouterLink>
          </div>
          <div class="p-6">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs text-gray-500 uppercase">
                  <th class="pb-3">Title</th>
                  <th class="pb-3">Employer</th>
                  <th class="pb-3">Status</th>
                  <th class="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in recentJobs" :key="job.id" class="border-t border-gray-100">
                  <td class="py-3 text-sm font-medium text-gray-900">{{ job.title }}</td>
                  <td class="py-3 text-sm text-gray-500">{{ job.employer?.name }}</td>
                  <td class="py-3">
                    <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(job.status)}`">{{ job.status }}</span>
                  </td>
                  <td class="py-3 text-sm text-gray-500">{{ formatDate(job.created_at) }}</td>
                </tr>
                <tr v-if="!isLoading && recentJobs.length === 0">
                  <td colspan="4" class="py-6 text-center text-gray-400">No jobs yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div class="p-6">
            <table class="w-full">
              <thead>
                <tr class="text-left text-xs text-gray-500 uppercase">
                  <th class="pb-3">Candidate</th>
                  <th class="pb-3">Job</th>
                  <th class="pb-3">Status</th>
                  <th class="pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="app in recentApplications" :key="app.id" class="border-t border-gray-100">
                  <td class="py-3 text-sm font-medium text-gray-900">{{ app.candidate?.name }}</td>
                  <td class="py-3 text-sm text-gray-500">{{ app.job?.title }}</td>
                  <td class="py-3">
                    <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(app.status)}`">{{ app.status }}</span>
                  </td>
                  <td class="py-3 text-sm text-gray-500">{{ formatDate(app.created_at) }}</td>
                </tr>
                <tr v-if="!isLoading && recentApplications.length === 0">
                  <td colspan="4" class="py-6 text-center text-gray-400">No applications yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
