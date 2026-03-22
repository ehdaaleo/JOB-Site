<script setup>
import { computed } from 'vue'
import { useApplicationStore } from '../../stores/applicationStore'
import { useJobStore } from '../../stores/jobStore'

const applicationStore = useApplicationStore()
const jobStore = useJobStore()

const stats = computed(() => [
  { label: 'Applications', value: applicationStore.myApplications.length, icon: 'document' },
  { label: 'Saved Jobs', value: applicationStore.mySavedJobs.length, icon: 'bookmark' },
  { label: 'Interviewing', value: applicationStore.applicationsByStatus.interviewing.length, icon: 'chat' },
  { label: 'Profile Views', value: '45', icon: 'eye' },
])

const recommendedJobs = computed(() => jobStore.activeJobs.slice(0, 3))

const getStatusClass = (status) => {
  const classes = { interviewing: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700', accepted: 'bg-blue-100 text-blue-700' }
  return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="candidate-dashboard">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p class="text-sm text-gray-500">Find and apply for your dream job</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Browse Jobs
          </a>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Recent Applications -->
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recent Applications</h2>
            <a href="/candidate/applications" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="app in applicationStore.myApplications.slice(0, 3)" :key="app.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p class="font-medium text-gray-900">{{ app.job }}</p>
                  <p class="text-sm text-gray-500">{{ app.company }}</p>
                </div>
                <div class="text-right">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(app.status)}`">
                    {{ app.status }}
                  </span>
                  <p class="text-xs text-gray-400 mt-1">{{ app.date }}</p>
                </div>
              </div>
              <div v-if="applicationStore.myApplications.length === 0" class="text-center py-4 text-gray-500">
                No applications yet. <a href="/jobs" class="text-blue-600">Browse jobs</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Jobs -->
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Recommended For You</h2>
            <a href="/jobs" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="job in recommendedJobs" :key="job.id" class="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-medium text-gray-900">{{ job.title }}</h3>
                  <span class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{{ job.workType }}</span>
                </div>
                <p class="text-sm text-gray-500 mb-2">{{ job.company.name }} • {{ job.location }}</p>
                <p class="text-sm font-medium text-green-600">${{ job.salaryMin/1000 }}K - ${{ job.salaryMax/1000 }}K</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.candidate-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
