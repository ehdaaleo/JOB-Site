<script setup>
import { ref, onMounted } from 'vue'
import { fetchCompanies } from '../../services/api'

const companies = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await fetchCompanies()
    companies.value = response.data
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

const colors = [
  'from-blue-500 to-indigo-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500'
]
const getColor = (index) => colors[index % colors.length]

// Helper to calculate employees from job count (mock)
const getEmployeeCount = (jobCount) => {
  return Math.floor(jobCount * 15) + 10
}
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Top Companies</h2>
        <p class="text-gray-500 mt-1">Hiring now</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Grid - All Visible -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(company, index) in companies" :key="company.id" class="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all">
          <!-- Company Header -->
          <div class="flex items-center gap-3 mb-4">
            <div :class="`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(index)} flex items-center justify-center text-white font-bold text-lg`">
              {{ company.name.charAt(0) }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ company.name }}</h3>
              <p class="text-xs text-gray-500">{{ company.location }}</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex gap-4 mb-4">
            <div class="text-center">
              <p class="font-bold text-gray-900 text-lg">{{ company.jobCount }}</p>
              <p class="text-xs text-gray-500">Jobs</p>
            </div>
            <div class="text-center">
              <p class="font-bold text-gray-900 text-lg">{{ getEmployeeCount(company.jobCount) }}+</p>
              <p class="text-xs text-gray-500">Employees</p>
            </div>
            <div class="text-center">
              <p class="font-bold text-gray-900 text-lg">{{ company.rating }}</p>
              <p class="text-xs text-gray-500">Rating</p>
            </div>
          </div>

          <!-- Industry -->
          <div class="mb-4">
            <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium">{{ company.industry }}</span>
          </div>

          <!-- Button -->
          <router-link :to="`/companies/${company.id}`" class="block w-full py-2 text-center border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            View Company
          </router-link>
        </div>
      </div>

      <!-- View All -->
      <div class="mt-10 text-center">
        <router-link to="/companies" class="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">View All Companies</router-link>
      </div>
    </div>
  </section>
</template>
