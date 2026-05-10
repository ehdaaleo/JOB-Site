<script setup>
import { computed } from 'vue'
import { useApplicationStore } from '../../stores/applicationStore'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const applicationStore = useApplicationStore()
const toast = useToast()
const savedJobs = computed(() => applicationStore.savedJobs)

const removeSaved = (job) => {
  if (!confirm('Remove this job from saved?')) return
  applicationStore.unsaveJob(job.id)
  toast.info('Removed from saved jobs.')
}

const employerName = (job) =>
  job.employer?.company_name || job.employer?.name || 'Company'

const formatSalary = (job) => {
  if (!job.salary_min && !job.salary_max) return ''
  const fmt = (n) => `$${Math.round(Number(n) / 1000)}K`
  if (job.salary_min && job.salary_max) return `${fmt(job.salary_min)} - ${fmt(job.salary_max)}`
  return job.salary_min ? `${fmt(job.salary_min)}+` : `up to ${fmt(job.salary_max)}`
}
</script>

<template>
  <Navbar />
  <div class="saved-jobs pt-16">
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="container mx-auto flex items-center justify-between max-w-6xl">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Saved Jobs</h1>
          <p class="text-sm text-gray-500">Jobs you've bookmarked for later (saved locally on this device)</p>
        </div>
        <RouterLink to="/jobs" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse More Jobs
        </RouterLink>
      </div>
    </div>

    <div class="container mx-auto p-6 max-w-6xl">
      <div class="grid gap-4">
        <div v-for="job in savedJobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2 flex-wrap">
                <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                <span v-if="job.work_type" class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full font-medium capitalize">{{ job.work_type.replace('_', ' ') }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ employerName(job) }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                <span v-if="job.location">📍 {{ job.location }}</span>
                <span v-if="formatSalary(job)">{{ formatSalary(job) }}</span>
                <span v-if="job.saved_at">Saved: {{ new Date(job.saved_at).toLocaleDateString() }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2 lg:min-w-[140px]">
              <RouterLink :to="`/jobs/${job.id}`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm text-center">
                View Details
              </RouterLink>
              <button @click="removeSaved(job)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="savedJobs.length === 0" class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
        <p class="text-gray-500 mb-4">Save jobs from the job detail page to view them here.</p>
        <RouterLink to="/jobs" class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Browse Jobs
        </RouterLink>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.saved-jobs {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
