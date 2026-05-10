<script setup>
defineProps({
  company: Object,
  loading: Boolean,
})
</script>
<template>
  <div class="space-y-8">
    <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      <h3 class="text-xl font-bold text-slate-900">Company Overview</h3>
      
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="flex gap-4">
          <div class="w-10 h-10 bg-slate-100 rounded-xl animate-pulse"></div>
          <div class="space-y-2 flex-1">
            <div class="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
            <div class="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      </div>
      <!-- company size -->
      <div v-else class="space-y-6">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Company Size</p>
            <p class="text-slate-900 font-bold">
              {{ company.size || 'N/A' }}
            </p>
          </div>
        </div>
        <!-- job location -->
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Location</p>
            <p class="text-slate-900 font-bold">{{ company.location || 'N/A' }}</p>
          </div>
        </div>
      </div>
      <!-- social media links -->
      <div class="pt-8 border-t border-slate-100 flex items-center justify-center gap-4">
        <a href="#" class="text-slate-400 hover:text-blue-600 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
        <a href="#" class="text-slate-400 hover:text-blue-400 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
        <a href="#" class="text-slate-400 hover:text-blue-700 transition-colors"><svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.2225 0z"/></svg></a>
      </div>
    </div>
  </div>
</template>
