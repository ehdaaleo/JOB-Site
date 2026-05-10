<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobApi, apiErrorMessage } from '@/services/api'
import { useToast } from 'vue-toastification'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const router = useRouter()
const toast = useToast()
const { confirmDialog } = useConfirmDialog()

const myJobs = ref([])
const isLoading = ref(true)
const error = ref(null)

const stats = computed(() => ({
  total: myJobs.value.length,
  approved: myJobs.value.filter((j) => j.status === 'approved').length,
  pending: myJobs.value.filter((j) => j.status === 'pending').length,
  closed: myJobs.value.filter(
    (j) =>
      j.status === 'closed' ||
      (j.application_deadline && new Date(j.application_deadline) < new Date()),
  ).length,
}))

async function load() {
  isLoading.value = true
  error.value = null
  try {
    // ?mine=1 returns this employer's jobs in any status.
    const res = await jobApi.list({ mine: 1, per_page: 100 })
    myJobs.value = res.data || []
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load jobs.')
  } finally {
    isLoading.value = false
  }
}

const handleEditJob = (jobId) => router.push(`/employer/jobs/${jobId}/edit`)
const handleViewApplications = (jobId) =>
  router.push({ name: 'view-applications', query: { job: jobId } })

const handleDeleteJob = async (jobId) => {
  const confirmed = await confirmDialog({
    title: 'Delete job',
    message: 'Delete this job posting?',
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await jobApi.destroy(jobId)
    myJobs.value = myJobs.value.filter((j) => String(j.id) !== String(jobId))
    toast.success('Job deleted.')
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Failed to delete job.'))
  }
}

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'

const getStatusClass = (status) => ({
  approved: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
})[status] || 'bg-gray-100 text-gray-700 border-gray-200'

const getWorkTypeClass = (workType) => ({
  remote: 'bg-purple-100 text-purple-700',
  onsite: 'bg-blue-100 text-blue-700',
  hybrid: 'bg-indigo-100 text-indigo-700',
  full_time: 'bg-cyan-100 text-cyan-700',
  part_time: 'bg-pink-100 text-pink-700',
  contract: 'bg-orange-100 text-orange-700',
  internship: 'bg-amber-100 text-amber-700',
})[workType] || 'bg-gray-100 text-gray-700'

onMounted(load)
</script>

<template>
  <div class="manage-jobs-page">
    <Navbar />

    <div class="pt-16 pb-12">
      <div class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="container mx-auto max-w-7xl flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            <p class="text-sm text-gray-500">View, edit, and manage your job postings</p>
          </div>
          <RouterLink to="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Post New Job
          </RouterLink>
        </div>
      </div>

      <div class="container mx-auto max-w-7xl p-6">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{{ error }}</div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Total Jobs</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Approved</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.approved }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Pending Review</p>
            <p class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</p>
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">Closed / Expired</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.closed }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="job in myJobs" :key="job.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <p class="text-sm font-medium text-gray-900">{{ job.title }}</p>
                    <p class="text-sm text-gray-500">{{ job.location || '—' }}</p>
                    <span :class="`mt-1 inline-block text-xs px-2 py-0.5 rounded-full capitalize ${getWorkTypeClass(job.work_type)}`">
                      {{ (job.work_type || '').replace('_', ' ') }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="`px-3 py-1 text-xs font-medium rounded-full border capitalize ${getStatusClass(job.status)}`">{{ job.status }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-900 font-medium">{{ job.applications_count || 0 }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-900">{{ formatDate(job.created_at) }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-gray-900">{{ formatDate(job.application_deadline) }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button @click="handleViewApplications(job.id)" class="text-sm text-blue-600 hover:text-blue-700">Apps</button>
                      <button @click="handleEditJob(job.id)" class="text-sm text-indigo-600 hover:text-indigo-700">Edit</button>
                      <button @click="handleDeleteJob(job.id)" class="text-sm text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isLoading && myJobs.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <h3 class="text-lg font-medium text-gray-900 mb-1">No jobs posted yet</h3>
                    <p class="text-gray-500 mb-4">Start by posting your first job listing</p>
                    <RouterLink to="/employer/post-job" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                      Post New Job
                    </RouterLink>
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
