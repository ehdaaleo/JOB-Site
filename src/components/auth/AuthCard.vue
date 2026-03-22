<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <!-- Job Site Logo -->
    <div class="mx-auto h-12 w-auto flex items-center justify-center">
      <svg class="h-10 w-10 text-indigo-600" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Briefcase icon -->
        <rect x="8" y="14" width="24" height="18" rx="3" fill="currentColor" fill-opacity="0.2"/>
        <rect x="8" y="14" width="24" height="18" rx="3" stroke="currentColor" stroke-width="2"/>
        <path d="M14 14V12C14 10.8954 14.8954 10 16 10H24C25.1046 10 26 10.8954 26 12V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M20 24V28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 20H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="ml-2 text-2xl font-bold text-indigo-600">Job Site</span>
    </div>
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">{{ title }}</h2>
    <p v-if="subtitle" class="mt-2 text-center text-sm text-gray-600">{{ subtitle }}</p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
      <slot />
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>
