<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApplicationStore } from '../../stores/applicationStore'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const applicationStore = useApplicationStore()
const toast = useToast()

const statusFilter = ref('')
const selectedApp = ref(null)
const showModal = ref(false)

const applications = computed(() => applicationStore.applications)

const filteredApps = computed(() => {
  if (!statusFilter.value) return applications.value
  return applications.value.filter((app) => app.status === statusFilter.value)
})

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

const employerName = (app) =>
  app.job?.employer?.company_name ||
  app.job?.employer?.organization ||
  app.job?.employer?.name ||
  'Company'

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : '')

const formatSalary = (job) => {
  if (!job?.salary_min && !job?.salary_max) return ''
  const fmt = (n) => `$${Math.round(Number(n) / 1000)}K`
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} - ${fmt(job.salary_max)}`
  return job.salary_min ? `${fmt(job.salary_min)}+` : `up to ${fmt(job.salary_max)}`
}

const viewDetails = (app) => {
  selectedApp.value = app
  showModal.value = true
}

const withdrawApplication = async (app) => {
  if (!confirm('Are you sure you want to withdraw this application?')) return
  try {
    await applicationStore.withdrawApplication(app.job_id || app.job?.id, app.id)
    toast.success('Application withdrawn.')
  } catch (err) {
    toast.error(applicationStore.error || 'Could not withdraw application.')
  }
}

onMounted(() => applicationStore.fetchMyApplications())
</script>

<template>
  <Navbar />
  <div class="my-applications pt-16">
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="container mx-auto flex items-center justify-between max-w-6xl">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Applications</h1>
          <p class="text-sm text-gray-500">Track your job applications</p>
        </div>
        <RouterLink to="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse More Jobs
        </RouterLink>
      </div>
    </div>

    <div class="container mx-auto p-6 max-w-6xl">
      <div class="flex flex-wrap gap-2 mb-6">
        <button @click="statusFilter = ''" :class="`px-4 py-2 rounded-lg font-medium text-sm ${!statusFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          All ({{ applications.length }})
        </button>
        <button v-for="s in ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected']" :key="s"
                @click="statusFilter = s"
                :class="`px-4 py-2 rounded-lg font-medium text-sm capitalize ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          {{ s }}
        </button>
      </div>

      <div class="space-y-4">
        <div v-for="app in filteredApps" :key="app.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <h3 class="text-lg font-semibold text-gray-900">{{ app.job?.title || 'Job' }}</h3>
                <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(app.status)}`">
                  {{ app.status }}
                </span>
                <span v-if="app.payment_status && app.payment_status !== 'unpaid'"
                      class="text-xs px-2 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700 capitalize">
                  Payment: {{ app.payment_status }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ employerName(app) }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span v-if="app.job?.location">📍 {{ app.job.location }}</span>
                <span v-if="app.job?.work_type">{{ app.job.work_type.replace('_', ' ') }}</span>
                <span v-if="formatSalary(app.job)">{{ formatSalary(app.job) }}</span>
                <span>Applied: {{ formatDate(app.created_at) }}</span>
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

      <div v-if="filteredApps.length === 0" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
        <p class="text-gray-500 mb-4">Start applying for jobs to see them here.</p>
        <RouterLink to="/jobs" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse Jobs
        </RouterLink>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showModal = false">
      <div class="bg-white rounded-xl max-w-lg w-full" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div class="p-6" v-if="selectedApp">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ selectedApp.job?.title }}</h3>
          <p class="text-gray-600 mb-4">{{ employerName(selectedApp) }}</p>
          <div class="mb-4">
            <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(selectedApp.status)}`">
              {{ selectedApp.status }}
            </span>
          </div>
          <div v-if="selectedApp.cover_letter" class="mb-4">
            <h4 class="font-medium text-gray-900 mb-2">Cover Letter</h4>
            <p class="text-gray-600 text-sm whitespace-pre-line">{{ selectedApp.cover_letter }}</p>
          </div>
          <div v-if="selectedApp.message" class="mb-4">
            <h4 class="font-medium text-gray-900 mb-2">Message</h4>
            <p class="text-gray-600 text-sm whitespace-pre-line">{{ selectedApp.message }}</p>
          </div>
          <div v-if="selectedApp.rejection_reason" class="mb-4 bg-red-50 border border-red-100 rounded p-3">
            <h4 class="font-medium text-red-700 mb-1">Rejection note</h4>
            <p class="text-red-600 text-sm">{{ selectedApp.rejection_reason }}</p>
          </div>
          <div class="text-sm text-gray-500">Applied on {{ formatDate(selectedApp.created_at) }}</div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.my-applications {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
