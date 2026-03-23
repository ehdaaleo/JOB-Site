<script setup>
import { ref } from 'vue'

const stats = [
  { value: '10,000+', label: 'Active Jobs' },
  { value: '5,000+', label: 'Companies' },
  { value: '50,000+', label: 'Candidates' },
  { value: '15,000+', label: 'Placements' },
]
</script>

<template>
  <section class="pt-24 pb-20 bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto px-4">
      <!-- Hero Content -->
      <div class="max-w-3xl mx-auto text-center mb-12">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 leading-tight">
          Find Your <span class="text-blue-600">Dream Job</span> Today
        </h1>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">
          Connect with top companies and discover opportunities that match your skills and career aspirations.
        </p>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap justify-center gap-8 md:gap-16">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <p class="text-3xl md:text-4xl font-bold text-gray-900">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
