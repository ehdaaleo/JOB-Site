<script setup>
import { ref, computed } from 'vue'
import { useJobStore } from '../../stores/jobStore'

const jobStore = useJobStore()
const pendingJobs = computed(() => jobStore.pendingJobs)

const selectedJob = ref(null)
const showModal = ref(false)

const approveJob = (job) => {
  jobStore.approveJob(job.id)
  alert(`Job "${job.title}" has been approved! It will now appear on the home page and jobs list.`)
}

const rejectJob = (job) => {
  jobStore.rejectJob(job.id)
  alert(`Job "${job.title}" has been rejected.`)
}

const viewJobDetails = (job) => {
  selectedJob.value = job
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedJob.value = null
}
</script>

<template>
  <div class="pending-jobs">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pending Jobs</h1>
          <p class="text-sm text-gray-500">Review and approve job postings</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">{{ pendingJobs.length }} pending</span>
        </div>
      </div>
    </div>

    <!-- Jobs List -->
    <div class="p-6">
      <div class="grid gap-4">
        <div v-for="job in pendingJobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <!-- Job Info -->
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                <span class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ job.company.name }}</p>
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ job.location }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ job.type }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ${{ job.salaryMin/1000 }}K - ${{ job.salaryMax/1000 }}K
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
              <button @click="viewJobDetails(job)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                View Details
              </button>
              <button @click="approveJob(job)" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                Approve
              </button>
              <button @click="rejectJob(job)" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="pendingJobs.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No pending jobs</h3>
        <p class="text-gray-500">All job postings have been reviewed.</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="closeModal">
      <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Job Details</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6" v-if="selectedJob">
          <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ selectedJob.title }}</h3>
          <p class="text-lg text-gray-600 mb-4">{{ selectedJob.company.name }}</p>
          
          <div class="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
            <span>{{ selectedJob.location }}</span>
            <span>{{ selectedJob.type }}</span>
            <span>${{ selectedJob.salaryMin/1000 }}K - ${{ selectedJob.salaryMax/1000 }}K</span>
          </div>

          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Description</h4>
            <p class="text-gray-600">{{ selectedJob.description }}</p>
          </div>

          <div class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Requirements</h4>
            <p class="text-gray-600 whitespace-pre-line">{{ selectedJob.requirements }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="approveJob(selectedJob); closeModal()" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Approve
            </button>
            <button @click="rejectJob(selectedJob); closeModal()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pending-jobs {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
