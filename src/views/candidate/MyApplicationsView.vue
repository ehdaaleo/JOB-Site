<script setup>
import { ref, computed } from 'vue'
import { useApplicationStore } from '../../stores/applicationStore'

const applicationStore = useApplicationStore()
const applications = computed(() => applicationStore.myApplications)

const statusFilter = ref('')
const selectedApp = ref(null)
const showModal = ref(false)

const filteredApps = computed(() => {
  if (!statusFilter.value) return applications.value
  return applications.value.filter(app => app.status === statusFilter.value)
})

const getStatusClass = (status) => {
  const classes = { interviewing: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', rejected: 'bg-red-100 text-red-700', accepted: 'bg-blue-100 text-blue-700' }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const viewDetails = (app) => {
  selectedApp.value = app
  showModal.value = true
}

const withdrawApplication = (app) => {
  if (confirm('Are you sure you want to withdraw this application?')) {
    applicationStore.withdrawApplication(app.id)
  }
}
</script>

<template>
  <div class="my-applications">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>
          <p class="text-sm text-gray-500">Track your job applications</p>
        </div>
        <a href="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse More Jobs
        </a>
      </div>
    </div>

    <!-- Filters -->
    <div class="p-6">
      <div class="flex flex-wrap gap-2 mb-6">
        <button @click="statusFilter = ''" :class="`px-4 py-2 rounded-lg font-medium text-sm ${!statusFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          All ({{ applications.length }})
        </button>
        <button @click="statusFilter = 'pending'" :class="`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          Pending
        </button>
        <button @click="statusFilter = 'interviewing'" :class="`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === 'interviewing' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          Interviewing
        </button>
        <button @click="statusFilter = 'accepted'" :class="`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === 'accepted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          Accepted
        </button>
        <button @click="statusFilter = 'rejected'" :class="`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          Rejected
        </button>
      </div>

      <!-- Applications List -->
      <div class="space-y-4">
        <div v-for="app in filteredApps" :key="app.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ app.job }}</h3>
                <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(app.status)}`">
                  {{ app.status }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ app.company }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>{{ app.location }}</span>
                <span>{{ app.type }}</span>
                <span>{{ app.salary }}</span>
                <span>Applied: {{ app.date }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button @click="viewDetails(app)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              <button v-if="app.status === 'pending'" @click="withdrawApplication(app)" class="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm">
                Withdraw
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredApps.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
        <p class="text-gray-500 mb-4">Start applying for jobs to see them here.</p>
        <a href="/jobs" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse Jobs
        </a>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showModal = false">
      <div class="bg-white rounded-xl max-w-lg w-full" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6" v-if="selectedApp">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ selectedApp.job }}</h3>
          <p class="text-gray-600 mb-4">{{ selectedApp.company }}</p>
          <div class="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
            <span>{{ selectedApp.location }}</span>
            <span>{{ selectedApp.type }}</span>
            <span>{{ selectedApp.salary }}</span>
          </div>
          <div class="mb-4">
            <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(selectedApp.status)}`">
              {{ selectedApp.status }}
            </span>
          </div>
          <div class="mb-4">
            <h4 class="font-medium text-gray-900 mb-2">Cover Letter</h4>
            <p class="text-gray-600 text-sm">{{ selectedApp.coverLetter }}</p>
          </div>
          <div class="text-sm text-gray-500">Applied on {{ selectedApp.date }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-applications {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
