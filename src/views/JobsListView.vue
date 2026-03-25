<script setup>
import { ref, computed } from 'vue'
import { useJobStore } from '../stores/jobStore'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const jobStore = useJobStore()
const jobs = computed(() => jobStore.activeJobs)

const searchQuery = ref('')
const locationFilter = ref('')
const categoryFilter = ref('')

const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    const matchesSearch = !searchQuery.value || 
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesLocation = !locationFilter.value || 
      job.location.toLowerCase().includes(locationFilter.value.toLowerCase()) ||
      job.workType === locationFilter.value
    
    const matchesCategory = !categoryFilter.value || job.category === categoryFilter.value
    
    return matchesSearch && matchesLocation && matchesCategory
  })
})

const formatSalary = (min, max) => {
  return `$${min/1000}K - $${max/1000}K`
}

const timeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const getWorkTypeClass = (type) => {
  const types = { remote: 'bg-green-100 text-green-700', onsite: 'bg-blue-100 text-blue-700', hybrid: 'bg-yellow-100 text-yellow-700' }
  return types[type] || 'bg-blue-100 text-blue-700'
}
</script>

<template>
  <div class="jobs-list-view">
    <Navbar />
    
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Find Jobs</h1>
        <p class="text-sm text-gray-500">{{ filteredJobs.length }} jobs available</p>
      </div>
    </div>

    <div class="p-6">
      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input v-model="searchQuery" type="text" placeholder="Job title, skills, or company" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Location / Type</label>
            <select v-model="locationFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select v-model="categoryFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="management">Management</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Jobs List -->
      <div class="space-y-4">
        <div v-for="job in filteredJobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-colors">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ job.title }}</h3>
                <span v-if="job.featured" class="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">Featured</span>
                <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getWorkTypeClass(job.workType)}`">{{ job.workType }}</span>
              </div>
              <p class="text-sm text-gray-600 mb-2">{{ job.company.name }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
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
                  {{ formatSalary(job.salaryMin, job.salaryMax) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ timeAgo(job.postedAt) }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span v-for="skill in job.skills.slice(0, 5)" :key="skill" class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {{ skill }}
                </span>
              </div>
            </div>
            <RouterLink :to="`/jobs/${job.id}`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm whitespace-nowrap">
              Apply Now
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p class="text-gray-500">Try adjusting your search or filters.</p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.jobs-list-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
