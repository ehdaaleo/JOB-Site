<script setup>
import { computed } from 'vue'
import { useApplicationStore } from '../../stores/applicationStore'

const applicationStore = useApplicationStore()
const savedJobs = computed(() => applicationStore.mySavedJobs)

const removeSaved = (job) => {
  if (confirm('Remove this job from saved?')) {
    applicationStore.unsaveJob(job.jobId)
  }
}
</script>

<template>
  <div class="saved-jobs">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p class="text-sm text-gray-500">Jobs you've bookmarked for later</p>
        </div>
        <a href="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse More Jobs
        </a>
      </div>
    </div>

    <!-- Jobs List -->
    <div class="p-6">
      <div class="grid gap-4">
        <div v-for="job in savedJobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ job.job }}</h3>
                <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">{{ job.type }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ job.company }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ job.location }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ job.salary }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ job.postedAt }}
                </span>
              </div>
              <p class="text-sm text-gray-500 line-clamp-2">{{ job.description }}</p>
            </div>
            <div class="flex flex-col gap-2 lg:min-w-[140px]">
              <a :href="`/jobs/${job.jobId}`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm text-center">
                View Details
              </a>
              <button @click="removeSaved(job)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="savedJobs.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
        <p class="text-gray-500 mb-4">Save jobs to view them later.</p>
        <a href="/jobs" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse Jobs
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.saved-jobs {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
