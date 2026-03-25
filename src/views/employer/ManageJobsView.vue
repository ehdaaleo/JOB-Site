<script setup>
import { computed } from 'vue'
import { useJobStore } from '../../stores/jobStore'
import { useRouter } from 'vue-router'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const jobStore = useJobStore()
const router = useRouter()

// Get employer jobs (filter by company)
const myJobs = computed(() => jobStore.jobs)

const stats = computed(() => ({
  total: myJobs.value.length,
  active: myJobs.value.filter(j => j.status === 'active').length,
  pending: myJobs.value.filter(j => j.status === 'pending').length,
  expired: myJobs.value.filter(j => {
    if (!j.deadline) return false
    return new Date(j.deadline) < new Date()
  }).length
}))

const handleEditJob = (jobId) => {
  router.push(`/employer/jobs/${jobId}/edit`)
}

const handleViewApplications = (jobId) => {
  router.push(`/employer/applications?job=${jobId}`)
}

const handleDeleteJob = (jobId) => {
  if (confirm('Are you sure you want to delete this job?')) {
    const job = jobStore.jobs.find(j => j.id === jobId)
    if (job) {
      job.status = 'deleted'
    }
  }
}

const handleToggleStatus = (jobId) => {
  const job = jobStore.jobs.find(j => j.id === jobId)
  if (job) {
    job.status = job.status === 'active' ? 'inactive' : 'active'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatSalary = (min, max, currency = 'USD') => {
  const formatNum = (num) => new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(num / 1000)
  return `$${formatNum(min)}K - $${formatNum(max)}K`
}

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    inactive: 'bg-gray-100 text-gray-700 border-gray-200'
  }
  return classes[status] || classes.inactive
}

const getWorkTypeClass = (workType) => {
  const classes = {
    remote: 'bg-purple-100 text-purple-700',
    'on-site': 'bg-blue-100 text-blue-700',
    hybrid: 'bg-indigo-100 text-indigo-700'
  }
  return classes[workType] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="manage-jobs-page">
    <Navbar />
    
    <div class="pt-16 pb-12 flex-1">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            <p class="text-sm text-gray-500">View, edit, and manage your job postings</p>
          </div>
          <div class="flex items-center gap-3">
            <a href="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Post New Job
            </a>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Total Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Active</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Pending Review</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Expired</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.expired }}</p>
          </div>
        </div>

        <!-- Jobs List -->
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="job in myJobs" :key="job.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {{ job.company?.name?.charAt(0) || 'J' }}
                      </div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900">{{ job.title }}</p>
                        <p class="text-sm text-gray-500">{{ job.company?.name }} • {{ job.location }}</p>
                        <div class="flex items-center gap-2 mt-1">
                          <span :class="`text-xs px-2 py-0.5 rounded-full ${getWorkTypeClass(job.workType)}`">
                            {{ job.workType }}
                          </span>
                          <span class="text-xs text-gray-400">{{ job.type }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClass(job.status)}`">
                      {{ job.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-900 font-medium">{{ job.applicationsCount || 0 }}</p>
                    <p class="text-xs text-gray-500">applications</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-900">{{ job.postedAt ? formatDate(job.postedAt) : 'N/A' }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-900">{{ job.deadline ? formatDate(job.deadline) : 'N/A' }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="handleViewApplications(job.id)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Applications">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>
                      <button @click="handleEditJob(job.id)" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Job">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="handleToggleStatus(job.id)" class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Toggle Status">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button @click="handleDeleteJob(job.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Job">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="myJobs.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 class="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h3>
                      <p class="text-gray-500 mb-4">Start by posting your first job listing</p>
                      <a href="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Post New Job
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>

<style scoped>
.manage-jobs-page {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
