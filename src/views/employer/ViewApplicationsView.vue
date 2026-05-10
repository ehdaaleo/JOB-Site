<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApplicationStore } from '../../stores/applicationStore'
import { jobApi, applicationApi, apiErrorMessage } from '@/services/api'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const route = useRoute()
const router = useRouter()
const applicationStore = useApplicationStore()
const toast = useToast()

const myJobs = ref([])
const selectedJobId = ref(route.query.job ? Number(route.query.job) : null)
const applications = ref([])
const isLoading = ref(false)
const error = ref(null)

const statusFilter = ref('')
const selectedApp = ref(null)
const showModal = ref(false)

const filteredApps = computed(() => {
  if (!statusFilter.value) return applications.value
  return applications.value.filter((a) => a.status === statusFilter.value)
})

async function loadMyJobs() {
  // ?mine=1 returns this employer's jobs in any status.
  const res = await jobApi.list({ mine: 1, per_page: 100 })
  myJobs.value = res.data || []
  if (!selectedJobId.value && myJobs.value[0]) {
    selectedJobId.value = myJobs.value[0].id
  }
}

async function loadApplications() {
  if (!selectedJobId.value) {
    applications.value = []
    return
  }
  isLoading.value = true
  error.value = null
  try {
    const res = await applicationApi.listForJob(selectedJobId.value, { per_page: 50 })
    applications.value = res.data || []
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load applications.')
    applications.value = []
  } finally {
    isLoading.value = false
  }
}

watch(selectedJobId, () => {
  router.replace({ query: { ...route.query, job: selectedJobId.value || undefined } })
  loadApplications()
})

const getStatusClass = (status) => ({
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-indigo-100 text-indigo-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-200 text-gray-600',
})[status] || 'bg-gray-100 text-gray-700'

const setStatus = async (app, status, reason = null) => {
  try {
    const updated = await applicationStore.updateApplicationStatus(app.id, status, reason)
    const idx = applications.value.findIndex((a) => a.id === app.id)
    if (idx !== -1) applications.value[idx] = updated
    toast.success(`Application marked as ${status}.`)
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to update status.'))
  }
}

const acceptApplication = (app) => setStatus(app, 'accepted')
const reviewApplication = (app) => setStatus(app, 'reviewed')
const shortlistApplication = (app) => setStatus(app, 'shortlisted')
const rejectApplication = (app) => {
  const reason = prompt('Reason for rejection (optional):') || null
  if (!confirm('Reject this application?')) return
  setStatus(app, 'rejected', reason)
}

const goToCheckout = (app) => {
  router.push({
    name: 'application-checkout',
    params: { applicationId: app.id },
    query: { job_id: selectedJobId.value },
  })
}

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '')

const viewDetails = (app) => {
  selectedApp.value = app
  showModal.value = true
}

onMounted(async () => {
  await loadMyJobs()
  await loadApplications()
})
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Applications</h1>
          <p class="text-sm text-gray-500">Review and manage candidate applications</p>
        </div>
        <RouterLink to="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">
          Post a Job
        </RouterLink>
      </div>

      <div class="mt-6 bg-white rounded-xl border border-gray-200 p-4">
        <label class="text-sm font-medium text-gray-700">Job</label>
        <select v-model.number="selectedJobId" class="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg">
          <option :value="null" disabled>Select a job…</option>
          <option v-for="job in myJobs" :key="job.id" :value="job.id">
            {{ job.title }} ({{ job.applications_count || 0 }} apps)
          </option>
        </select>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>

      <div class="mt-6 flex flex-wrap gap-2">
        <button @click="statusFilter = ''" :class="`px-4 py-2 rounded-lg font-medium text-sm ${!statusFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          All ({{ applications.length }})
        </button>
        <button v-for="s in ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected']" :key="s"
                @click="statusFilter = s"
                :class="`px-4 py-2 rounded-lg font-medium text-sm capitalize ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          {{ s }}
        </button>
      </div>

      <div class="mt-6 space-y-4">
        <div v-for="app in filteredApps" :key="app.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div class="flex items-start gap-4 flex-1">
              <div class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                {{ (app.candidate?.name || 'C')[0] }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 class="text-lg font-semibold text-gray-900">{{ app.candidate?.name || 'Candidate' }}</h3>
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(app.status)}`">
                    {{ app.status }}
                  </span>
                  <span v-if="app.payment_status && app.payment_status !== 'unpaid'"
                        class="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700 capitalize">
                    Payment: {{ app.payment_status }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-1">{{ app.candidate?.email }}</p>
                <p v-if="app.phone" class="text-sm text-gray-500 mb-1">{{ app.phone }}</p>
                <p class="text-xs text-gray-400">Applied: {{ formatDate(app.created_at) }}</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 flex-shrink-0">
              <button @click="viewDetails(app)" class="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Details</button>
              <template v-if="['pending', 'reviewed', 'shortlisted'].includes(app.status)">
                <button v-if="app.status === 'pending'" @click="reviewApplication(app)" class="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Mark reviewed</button>
                <button v-if="app.status !== 'shortlisted'" @click="shortlistApplication(app)" class="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">Shortlist</button>
                <button @click="acceptApplication(app)" class="px-3 py-2 bg-green-600 text-white rounded-lg text-sm">Accept</button>
                <button @click="rejectApplication(app)" class="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm">Reject</button>
              </template>
              <button v-if="app.status === 'accepted' && app.payment_status !== 'paid'" @click="goToCheckout(app)" class="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                Pay (PayPal)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && filteredApps.length === 0" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
        <p class="text-gray-500">Applications for this job will appear here.</p>
      </div>

      <div v-if="showModal && selectedApp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showModal = false">
        <div class="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedApp.candidate?.name }}</h3>
              <p class="text-sm text-gray-500">{{ selectedApp.candidate?.email }}</p>
              <p v-if="selectedApp.phone" class="text-sm text-gray-500">{{ selectedApp.phone }}</p>
            </div>
            <div v-if="selectedApp.cover_letter">
              <h4 class="font-medium text-gray-900 mb-2">Cover Letter</h4>
              <p class="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg whitespace-pre-line">{{ selectedApp.cover_letter }}</p>
            </div>
            <div v-if="selectedApp.message">
              <h4 class="font-medium text-gray-900 mb-2">Message</h4>
              <p class="text-gray-600 text-sm whitespace-pre-line">{{ selectedApp.message }}</p>
            </div>
            <div v-if="selectedApp.resume">
              <h4 class="font-medium text-gray-900 mb-2">Resume</h4>
              <a v-if="selectedApp.resume.startsWith('http')" :href="selectedApp.resume" target="_blank" class="text-blue-600 underline text-sm">{{ selectedApp.resume }}</a>
              <span v-else class="text-sm text-gray-600">{{ selectedApp.resume }}</span>
            </div>
            <div class="text-sm text-gray-500">Applied on {{ formatDate(selectedApp.created_at) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.view-applications { min-height: 100vh; background-color: #f9fafb; }
</style>
