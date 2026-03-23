<script setup>
import { computed } from 'vue'
import { useJobStore } from '../../stores/jobStore'

const jobStore = useJobStore()
const jobs = computed(() => jobStore.featuredJobs)

const formatSalary = (min, max, period) => {
  const formatNum = (num) => {
    if (period === 'yearly') return `$${(num / 1000).toFixed(0)}K`
    return `$${num}`
  }
  return `${formatNum(min)} - ${formatNum(max)}`
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

const colors = ['from-blue-500 to-indigo-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-pink-500', 'from-orange-500 to-red-500', 'from-cyan-500 to-blue-500', 'from-violet-500 to-purple-500']
const getColor = (id) => colors[(id - 1) % colors.length]
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Featured Jobs</h2>
        <p class="text-gray-500 mt-1">Explore the latest job openings</p>
      </div>

      <!-- Jobs Grid - All Visible -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="job in jobs" :key="job.id" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
          <!-- Company -->
          <div class="flex items-center gap-3 mb-4">
            <div :class="`w-10 h-10 rounded-lg bg-gradient-to-br ${getColor(job.company.id)} flex items-center justify-center text-white font-semibold`">
              {{ job.company.name.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-sm">{{ job.title }}</h3>
              <p class="text-xs text-gray-500">{{ job.company.name }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="text-xs text-gray-500">{{ job.location }}</span>
            <span :class="`text-xs px-2 py-0.5 rounded-full font-medium ${getWorkTypeClass(job.workType)}`">{{ job.workType }}</span>
          </div>

          <!-- Salary -->
          <p class="text-green-600 font-semibold text-sm mb-3">{{ formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod) }}/yr</p>

          <!-- Skills -->
          <div class="flex flex-wrap gap-1 mb-4">
            <span v-for="(skill, i) in job.skills.slice(0, 3)" :key="i" class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{{ skill }}</span>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-100">
            <span class="text-xs text-gray-400">{{ timeAgo(job.postedAt) }}</span>
            <a :href="`/apply/:id/${job.id}`" class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700">Apply</a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="jobs.length === 0" class="text-center py-12">
        <p class="text-gray-500">No featured jobs available yet.</p>
      </div>

      <!-- View All -->
      <div class="mt-10 text-center">
        <a href="/jobs" class="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">View All Jobs</a>
      </div>
    </div>
  </section>
</template>
