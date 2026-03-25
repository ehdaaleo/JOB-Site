<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <h2 class="mt-0 text-center text-3xl font-bold tracking-tight text-gray-900">{{ title }}</h2>
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
