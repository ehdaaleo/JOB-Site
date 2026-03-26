
<script setup>
import { RouterLink } from 'vue-router'
defineProps({
  company: Object,
  jobs: Array,
  loading: Boolean,
  jobsLoading: Boolean
})
</script>
<template>
  <div class="lg:col-span-2 space-y-12">
    <!-- About Section -->
    <section class="space-y-6">
      <h2 class="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4">About the Company</h2>
      <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm leading-relaxed text-slate-700 space-y-4">
        <div v-if="loading" class="animate-pulse space-y-3">
          <div class="h-4 bg-slate-200 rounded w-full"></div>
          <div class="h-4 bg-slate-200 rounded w-5/6"></div>
          <div class="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
        <p v-else>{{ company.description || company.tagline || company.company?.description || company.company?.tagline || 'No description provided.' }}</p>
      </div>
    </section>

    <!-- Open Positions -->
    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-4">Open Positions</h2>
        <span class="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-bold rounded-full">{{ jobs.length }} Jobs</span>
      </div>

      <div v-if="jobsLoading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-24 bg-slate-200 animate-pulse rounded-2xl"></div>
      </div>

      <div v-else-if="jobs.length > 0" class="space-y-4">
        <div v-for="job in jobs" :key="job.id" class="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-300">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <RouterLink :to="`/jobs/${job.id}`" class="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                {{ job.title }}
              </RouterLink>
              <div class="flex items-center gap-4 text-sm text-slate-500 font-medium">
                <span class="flex items-center gap-1 capitalize">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {{ job.workType }}
                </span>
                <span>{{ job.location }}</span>
              </div>
            </div>
            <RouterLink :to="`/jobs/${job.id}`" class="px-4 py-2 bg-slate-50 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all">
              View Details
            </RouterLink>
          </div>
        </div>
      </div>
      <div v-else class="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
        <p class="text-slate-500 font-medium">There are no open positions at this moment.</p>
      </div>
    </section>
  </div>
</template>
