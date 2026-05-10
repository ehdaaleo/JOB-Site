<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '../stores/jobStore'
import { categoryApi } from '@/services/api'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const jobStore = useJobStore()
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.search || '')
const workTypeFilter = ref(route.query.work_type || '')
const categoryFilter = ref(route.query.category_id ? String(route.query.category_id) : '')
const categories = ref([])

const jobs = computed(() => jobStore.jobs)
const isLoading = computed(() => jobStore.isLoading)
const error = computed(() => jobStore.error)

const formatSalary = (min, max) => {
  if (!min && !max) return 'Salary not disclosed'
  const fmt = (n) => `$${Math.round(n / 1000)}K`
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  return min ? `${fmt(min)}+` : `up to ${fmt(max)}`
}

const timeAgo = (iso) => {
  if (!iso) return ''
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(hours / 24)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const workTypeClass = (type) => {
  const types = {
    remote: 'bg-green-100 text-green-700',
    onsite: 'bg-blue-100 text-blue-700',
    hybrid: 'bg-yellow-100 text-yellow-700',
    full_time: 'bg-indigo-100 text-indigo-700',
    part_time: 'bg-purple-100 text-purple-700',
    contract: 'bg-pink-100 text-pink-700',
    internship: 'bg-orange-100 text-orange-700',
  }
  return types[type] || 'bg-blue-100 text-blue-700'
}

const employerName = (job) =>
  job.employer?.company_name || job.employer?.organization || job.employer?.name || 'Company'

const refresh = () => {
  jobStore.fetchJobs({
    search: searchQuery.value,
    work_type: workTypeFilter.value,
    category_id: categoryFilter.value || undefined,
  })

  router.replace({
    query: {
      ...(searchQuery.value && { search: searchQuery.value }),
      ...(workTypeFilter.value && { work_type: workTypeFilter.value }),
      ...(categoryFilter.value && { category_id: categoryFilter.value }),
    },
  })
}

let debounceId = null
watch(searchQuery, () => {
  clearTimeout(debounceId)
  debounceId = setTimeout(refresh, 300)
})
watch([workTypeFilter, categoryFilter], refresh)

onMounted(async () => {
  try {
    const res = await categoryApi.list()
    categories.value = res.data || res || []
  } catch {
    categories.value = []
  }
  refresh()
})
</script>

<template>
  <div class="jobs-list-view">
    <Navbar />

    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <h1 class="text-2xl font-bold text-gray-900">Find Jobs</h1>
      <p class="text-sm text-gray-500">{{ jobs.length }} jobs found</p>
    </div>

    <div class="p-6">
      <div class="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input v-model="searchQuery" type="text" placeholder="Job title, description, requirements"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
            <select v-model="workTypeFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select v-model="categoryFilter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-center py-16">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 max-w-2xl mx-auto">
        {{ error }}
      </div>

      <div v-else-if="jobs.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
        <p class="text-gray-500">Try adjusting your search or filters.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="job in jobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 transition-colors">
          <div class="flex flex-col gap-3">
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900 mb-1">{{ job.title }}</h3>
              <p class="text-sm text-gray-600 mb-2">{{ employerName(job) }}</p>
              <span :class="`text-xs px-2 py-0.5 rounded-full font-medium ${workTypeClass(job.work_type)}`">
                {{ job.work_type?.replace('_', ' ') || 'Unspecified' }}
              </span>
            </div>
            <div class="flex flex-wrap gap-3 text-xs text-gray-500">
              <span v-if="job.location" class="flex items-center gap-1">📍 {{ job.location }}</span>
              <span class="flex items-center gap-1">💰 {{ formatSalary(job.salary_min, job.salary_max) }}</span>
              <span class="flex items-center gap-1">🕐 {{ timeAgo(job.created_at) }}</span>
            </div>
            <RouterLink :to="`/jobs/${job.id}`" class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm text-center">
              View Details
            </RouterLink>
          </div>
        </div>
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
