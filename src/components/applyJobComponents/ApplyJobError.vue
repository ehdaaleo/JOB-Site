<script setup>
defineProps({
  message: {
    type: String,
    default: 'Something went wrong. Please try again.'
  }
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="error-card bg-white border border-red-200 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in-up">
    <div class="flex items-start gap-4">
      <!-- Error icon -->
      <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>

      <div class="flex-1">
        <h4 class="text-base font-bold text-red-800 mb-1" style="font-family: 'Syne', sans-serif;">
          Submission Failed
        </h4>
        <p class="text-sm text-red-600 leading-relaxed mb-4">
          {{ message }}
        </p>
        <button
          @click="emit('retry')"
          class="retry-btn"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-card {
  font-family: 'DM Sans', sans-serif;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1.5px solid #fecaca;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.retry-btn:hover {
  background: #fecaca;
  border-color: #fca5a5;
}
</style>
