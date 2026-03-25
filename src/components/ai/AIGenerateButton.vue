<script setup>
import { useAI } from '@/composables/useAI'
import { useToast } from 'vue-toastification'

const props = defineProps({
  jobData: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['generated', 'error'])

const { loading, error, generateJobContent } = useAI()
const toast = useToast()

const handleGenerate = async () => {
  try {
    const result = await generateJobContent(props.jobData)
    emit('generated', result)
    toast.success('Job content generated successfully!')
  } catch (e) {
    const errorMessage = e.message || 'Failed to generate content'
    toast.error(errorMessage)
    emit('error', errorMessage)
  }
}
</script>

<template>
  <button 
    type="button"
    :disabled="disabled || loading"
    @click="handleGenerate"
    class="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all duration-200 shadow-sm hover:shadow"
  >
    <svg v-if="loading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <span v-if="loading">Generating...</span>
    <span v-else>AI Generate</span>
  </button>
</template>
