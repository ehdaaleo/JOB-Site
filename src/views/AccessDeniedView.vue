<template>
  <Navbar />
  <div class="min-height flex flex-col items-center justify-center p-6 bg-slate-50">
    <div class="max-w-md w-full text-center space-y-6">
      <!-- Icon Container -->
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <!-- Text Content -->
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Access Denied</h1>
        <p class="text-slate-600 leading-relaxed">
          Oops! It looks like you don't have the necessary permissions to view this page.
          Please contact your administrator if you think this is a mistake.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
        <button 
          @click="goBack" 
          class="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-all duration-200 active:scale-95 shadow-sm"
        >
          Go Back
        </button>
        <RouterLink 
          to="/" 
          class="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-lg shadow-blue-600/20"
        >
          Return Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Navbar from '@/components/homePageComponents/navbar.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.min-height {
  min-height: calc(100vh - 128px); /* Adjust based on navbar/footer if needed */
}
</style>
