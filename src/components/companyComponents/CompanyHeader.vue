
<script setup>
defineProps({
  company: Object,
  loading: Boolean
})
</script>

<template>
  <div class="bg-white border-b border-slate-200">
    <div class="container mx-auto px-4 py-12">
      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 bg-slate-200 rounded-2xl"></div>
          <div class="space-y-3">
            <div class="h-8 w-64 bg-slate-200 rounded-lg"></div>
            <div class="h-4 w-32 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div v-else-if="company" class="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="flex items-center gap-8">
          <!-- Company Logo -->
          <div class="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
            <span v-if="!company.logo" class="text-4xl font-bold uppercase tracking-wider">
              {{ (company.name || 'C').charAt(0) }}
            </span>
            <img v-else :src="company.logo" :alt="company.name" class="w-full h-full object-cover rounded-2xl">
          </div>

          <div class="space-y-2">
            <h1 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {{ company.name }}
            </h1>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 font-medium">
              <span v-if="company.location" class="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ company.location }}
              </span>
              <span v-if="company.industry" class="flex items-center gap-1.5 capitalize">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {{ company.industry }}
              </span>
              <a v-if="company.website" :href="company.website.startsWith('http') ? company.website : `https://${company.website}`" target="_blank" class="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visit Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
