<script setup>
import { ref, onMounted } from 'vue'
import { jobApi, apiErrorMessage } from '@/services/api'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const pendingJobs = ref([])
const isLoading = ref(true)
const error = ref(null)
const selectedJob = ref(null)
const showModal = ref(false)
const toast = useToast()

async function load() {
  isLoading.value = true
  error.value = null
  try {
    const res = await jobApi.list({ status: 'pending', per_page: 50 })
    pendingJobs.value = res.data || []
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load pending jobs.')
  } finally {
    isLoading.value = false
  }
}

const employerName = (job) =>
  job.employer?.company_name || job.employer?.organization || job.employer?.name || 'Employer'

const formatSalary = (job) => {
  if (!job.salary_min && !job.salary_max) return 'Salary not disclosed'
  const fmt = (n) => `$${Math.round(Number(n) / 1000)}K`
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} - ${fmt(job.salary_max)}`
  return job.salary_min ? `${fmt(job.salary_min)}+` : `up to ${fmt(job.salary_max)}`
}

const approveJob = async (job) => {
  try {
    await jobApi.approve(job.id)
    pendingJobs.value = pendingJobs.value.filter((j) => j.id !== job.id)
    toast.success(`Approved: ${job.title}`)
    if (showModal.value) closeModal()
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to approve job.'))
  }
}

const rejectJob = async (job) => {
  if (!confirm('Reject this job?')) return
  try {
    await jobApi.reject(job.id)
    pendingJobs.value = pendingJobs.value.filter((j) => j.id !== job.id)
    toast.success(`Rejected: ${job.title}`)
    if (showModal.value) closeModal()
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to reject job.'))
  }
}

const viewJobDetails = (job) => {
  selectedJob.value = job
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedJob.value = null
}

onMounted(load)
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pending Jobs</h1>
          <p class="text-sm text-gray-500">Review and approve job postings</p>
        </div>
        <span class="text-sm text-gray-500">{{ pendingJobs.length }} pending</span>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>

      <div class="mt-6 grid gap-4">
        <div v-for="job in pendingJobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ employerName(job) }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span v-if="job.location">📍 {{ job.location }}</span>
                <span v-if="job.work_type">{{ job.work_type.replace('_', ' ') }}</span>
                <span>{{ formatSalary(job) }}</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <button @click="viewJobDetails(job)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">View Details</button>
              <button @click="approveJob(job)" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">Approve</button>
              <button @click="rejectJob(job)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">Reject</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && pendingJobs.length === 0" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No pending jobs</h3>
        <p class="text-gray-500">All job postings have been reviewed.</p>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Job Details</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <div class="p-6" v-if="selectedJob">
            <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedJob.title }}</h3>
            <p class="text-lg text-gray-600 mb-4">{{ employerName(selectedJob) }}</p>

            <div class="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
              <span v-if="selectedJob.location">{{ selectedJob.location }}</span>
              <span v-if="selectedJob.work_type">{{ selectedJob.work_type.replace('_', ' ') }}</span>
              <span>{{ formatSalary(selectedJob) }}</span>
            </div>

            <div class="mb-6" v-if="selectedJob.description">
              <h4 class="font-semibold text-gray-900 mb-2">Description</h4>
              <p class="text-gray-600 whitespace-pre-line">{{ selectedJob.description }}</p>
            </div>

            <div class="mb-6" v-if="selectedJob.requirements">
              <h4 class="font-semibold text-gray-900 mb-2">Requirements</h4>
              <p class="text-gray-600 whitespace-pre-line">{{ selectedJob.requirements }}</p>
            </div>

            <div class="flex gap-3">
              <button @click="approveJob(selectedJob)" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Approve</button>
              <button @click="rejectJob(selectedJob)" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.pending-jobs {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
