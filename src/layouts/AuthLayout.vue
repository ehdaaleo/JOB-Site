<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo Header -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
      <router-link to="/" class="flex items-center justify-center gap-2">
        <svg class="h-12 w-12 text-blue-600" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="14" width="24" height="18" rx="3" fill="currentColor" fill-opacity="0.2"/>
          <rect x="8" y="14" width="24" height="18" rx="3" stroke="currentColor" stroke-width="2"/>
          <path d="M14 14V12C14 10.8954 14.8954 10 16 10H24C25.1046 10 26 10.8954 26 12V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M20 24V28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M16 20H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span class="text-3xl font-bold text-blue-600">JobSite</span>
      </router-link>
    </div>

    <!-- Main Content -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <RouterView />
    </div>

    <!-- Footer -->
    <div class="mt-12 text-center text-sm text-gray-500">
      <p>&copy; {{ new Date().getFullYear() }} JobSite. All rights reserved.</p>
      <div class="mt-2 space-x-4">
        <a href="/terms" class="hover:text-blue-600 transition-colors">Terms of Service</a>
        <a href="/privacy" class="hover:text-blue-600 transition-colors">Privacy Policy</a>
        <a href="/help" class="hover:text-blue-600 transition-colors">Help</a>
      </div>
    </div>
  </div>
</template>
