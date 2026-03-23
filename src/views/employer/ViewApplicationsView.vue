<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApplicationStore } from '../../stores/applicationStore'
import { usePaymentStore } from '../../stores/paymentStore'

const router = useRouter()
const applicationStore = useApplicationStore()
const paymentStore = usePaymentStore()

const applications = computed(() => applicationStore.applications)
const statusFilter = ref('')
const selectedApp = ref(null)
const showModal = ref(false)

const filteredApps = computed(() => {
  if (!statusFilter.value) return applications.value
  return applications.value.filter(app => app.status === statusFilter.value)
})

const getStatusClass = (status) => {
  const classes = {
    interviewing: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    accepted: 'bg-blue-100 text-blue-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const viewDetails = (app) => {
  selectedApp.value = app
  showModal.value = true
}

const acceptApplication = (app) => {
  app.status = 'accepted'
}

const rejectApplication = (app) => {
  if (confirm('Reject this application? The candidate will be notified.')) {
    app.status = 'rejected'
  }
}

const isContactUnlocked = (appId) => {
  return paymentStore.hasUnlockedContact(appId)
}

const unlockContact = (app) => {
  router.push({ name: 'payment-checkout', params: { applicationId: app.id } })
}
</script>

<template>
  <div class="view-applications">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
          <p class="text-sm text-gray-500">Review and manage candidate applications</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="router.push({ name: 'payment-history' })" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
            Payment History
          </button>
          <a href="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
            Post a Job
          </a>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Filters -->
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
            <!-- App Info -->
            <div class="flex items-start gap-4 flex-1">
              <div class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                {{ (app.candidateName || 'C')[0] }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ app.candidateName || 'Candidate' }}</h3>
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(app.status)}`">
                    {{ app.status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-1">Applied for: <span class="font-medium">{{ app.job }}</span></p>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>{{ app.location }}</span>
                  <span>{{ app.type }}</span>
                  <span>{{ app.salary }}</span>
                  <span>Applied: {{ app.date }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 flex-shrink-0">
              <button @click="viewDetails(app)" class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Details
              </button>

              <!-- Pending: Accept / Reject -->
              <template v-if="app.status === 'pending' || app.status === 'interviewing'">
                <button @click="acceptApplication(app)" class="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                  Accept
                </button>
                <button @click="rejectApplication(app)" class="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium text-sm">
                  Reject
                </button>
              </template>

              <!-- Accepted: Unlock Contact or View Contact -->
              <template v-if="app.status === 'accepted'">
                <button
                  v-if="!isContactUnlocked(app.id)"
                  @click="unlockContact(app)"
                  class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Unlock Contact - $4.99
                </button>
                <span v-else class="px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Contact Unlocked
                </span>
              </template>
            </div>
          </div>

          <!-- Unlocked Contact Info -->
          <div v-if="app.status === 'accepted' && isContactUnlocked(app.id)" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 class="text-sm font-semibold text-green-900 mb-2">Contact Details</h4>
            <div class="flex flex-wrap gap-6 text-sm">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span class="text-green-800">{{ (app.candidateName || 'candidate').toLowerCase().replace(' ', '.') }}@email.com</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span class="text-green-800">+1 (555) 012-3456</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span class="text-blue-600">linkedin.com/in/{{ (app.candidateName || 'candidate').toLowerCase().replace(' ', '-') }}</span>
              </div>
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
        <p class="text-gray-500 mb-4">Applications from candidates will appear here.</p>
        <a href="/job-post" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Post a Job
        </a>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showModal && selectedApp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showModal = false">
      <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
              {{ (selectedApp.candidateName || 'C')[0] }}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedApp.candidateName || 'Candidate' }}</h3>
              <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(selectedApp.status)}`">
                {{ selectedApp.status }}
              </span>
            </div>
          </div>

          <div class="space-y-3 mb-4">
            <div>
              <span class="text-sm text-gray-500">Position</span>
              <p class="text-gray-900 font-medium">{{ selectedApp.job }}</p>
            </div>
            <div>
              <span class="text-sm text-gray-500">Company</span>
              <p class="text-gray-900">{{ selectedApp.company }}</p>
            </div>
            <div class="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>{{ selectedApp.location }}</span>
              <span>{{ selectedApp.type }}</span>
              <span>{{ selectedApp.salary }}</span>
            </div>
          </div>

          <div class="mb-4" v-if="selectedApp.coverLetter">
            <h4 class="font-medium text-gray-900 mb-2">Cover Letter</h4>
            <p class="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">{{ selectedApp.coverLetter }}</p>
          </div>

          <div class="text-sm text-gray-500 mb-6">Applied on {{ selectedApp.date }}</div>

          <!-- Actions in Modal -->
          <div class="flex gap-3">
            <template v-if="selectedApp.status === 'pending' || selectedApp.status === 'interviewing'">
              <button @click="acceptApplication(selectedApp); showModal = false" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Accept
              </button>
              <button @click="rejectApplication(selectedApp); showModal = false" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
                Reject
              </button>
            </template>
            <template v-if="selectedApp.status === 'accepted' && !isContactUnlocked(selectedApp.id)">
              <button @click="unlockContact(selectedApp)" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Unlock Contact - $4.99
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-applications {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
