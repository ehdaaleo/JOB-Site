<script setup>
import { ref, onMounted } from 'vue'
import { categoryApi } from '@/services/api'

const categories = ref([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const res = await categoryApi.list()
    categories.value = res.data || res || []
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

const descriptions = {
  programming: 'Software development',
  management: 'Project management',
  design: 'UI/UX design',
  marketing: 'Digital marketing',
  sales: 'Sales & BD',
  hr: 'Human Resources',
  finance: 'Finance & Banking',
  'customer-service': 'Customer Support'
}

const colors = [
  'from-blue-500 to-indigo-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-red-500',
  'from-cyan-500 to-blue-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-yellow-500 to-orange-500'
]
const getDescription = (slug) => descriptions[slug] || 'Browse jobs'
const getColor = (index) => colors[index % colors.length]
</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-10">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Browse Categories</h2>
        <p class="text-gray-500 mt-1">Find jobs by category</p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Grid - All Visible -->
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a v-for="(category, index) in categories" :key="category.id" :href="`/jobs?category=${category.slug}`" 
           class="bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center">
          <div :class="`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${getColor(index)} flex items-center justify-center text-white`">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h3 class="font-semibold text-gray-900 text-sm">{{ category.name }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ getDescription(category.slug) }}</p>
        </a>
      </div>
    </div>
  </section>
</template>
