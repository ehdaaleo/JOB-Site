<script setup>
import { ref, onMounted } from 'vue'
import { publicApi } from '@/services/api'

const jobs = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const data = await publicApi.homeData()
    jobs.value = (data.featured_jobs || data.data?.featured_jobs || []).slice(0, 6)
  } catch (err) {
    console.error('home-data failed', err)
    jobs.value = []
  } finally {
    isLoading.value = false
  }
})

const formatSalary = (min, max) => {
  const fmt = (n) => `$${Math.round(Number(n) / 1000)}K`
  if (min && max) return `${fmt(min)} - ${fmt(max)}/yr`
  if (min) return `${fmt(min)}+/yr`
  if (max) return `up to ${fmt(max)}/yr`
  return 'Salary not disclosed'
}

const timeAgo = (iso) => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(hours / 24)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

const employerName = (job) =>
  job.employer?.company_name || job.employer?.organization || job.employer?.name || 'Company'

const workTypeClass = (type) => {
  const types = {
    remote: 'bg-green-100 text-green-700',
    onsite: 'bg-blue-100 text-blue-700',
    hybrid: 'bg-yellow-100 text-yellow-700',
  }
  return types[type] || 'bg-blue-100 text-blue-700'
}

const colors = ['from-blue-500 to-indigo-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500', 'from-cyan-500 to-blue-500', 'from-violet-500 to-purple-500']
const getColor = (id) => colors[(Number(id) - 1 + colors.length * 100) % colors.length]
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Featured Jobs</h2>
        <p class="text-gray-500 mt-1">Explore the latest job openings</p>
      </div>

      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else-if="jobs.length === 0" class="text-center py-12">
        <p class="text-gray-500">No featured jobs available yet.</p>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="job in jobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
          <div class="flex items-center gap-3 mb-4">
            <div :class="`w-10 h-10 rounded-lg bg-gradient-to-br ${getColor(job.id)} flex items-center justify-center text-white font-semibold`">
              {{ employerName(job).charAt(0) }}
            </div>
            <div>
              <router-link :to="`/jobs/${job.id}`" class="font-semibold text-gray-900 text-sm hover:text-blue-600">{{ job.title }}</router-link>
              <p class="text-xs text-gray-500">{{ employerName(job) }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="job.location" class="text-xs text-gray-500">{{ job.location }}</span>
            <span v-if="job.work_type" :class="`text-xs px-2 py-0.5 rounded-full font-medium ${workTypeClass(job.work_type)}`">
              {{ job.work_type.replace('_', ' ') }}
            </span>
          </div>

          <p class="text-green-600 font-semibold text-sm mb-3">{{ formatSalary(job.salary_min, job.salary_max) }}</p>

          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-400">{{ timeAgo(job.created_at) }}</span>
            <router-link :to="`/jobs/${job.id}`" class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">View</router-link>
          </div>
        </div>
      </div>

      <div class="mt-10 text-center">
        <router-link to="/jobs" class="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">View All Jobs</router-link>
      </div>
    </div>
  </section>
</template>
