<template>
  <div class="grid gap-4 md:grid-cols-2">
    <!-- Candidate card -->
    <div
      @click="$emit('select', 'candidate')"
      :class="[
        'relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-lg',
        modelValue === 'candidate'
          ? 'border-violet-500 bg-violet-50'
          : 'border-gray-200 bg-white hover:border-violet-300'
      ]"
    >
      <div class="flex flex-col items-center text-center">
        <!-- Candidate icon -->
        <div
          :class="[
            'flex h-16 w-16 items-center justify-center rounded-full',
            modelValue === 'candidate' ? 'bg-violet-500' : 'bg-gray-100'
          ]"
        >
          <svg
            :class="modelValue === 'candidate' ? 'text-white' : 'text-gray-600'"
            class="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">Candidate</h3>
        <p class="mt-2 text-sm text-gray-600">
          Find jobs, showcase your skills, and work with top employers
        </p>
      </div>
      <!-- Selected checkmark -->
      <div v-if="modelValue === 'candidate'" class="absolute right-4 top-4">
        <svg class="h-6 w-6 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Employer card -->
    <div
      @click="$emit('select', 'employer')"
      :class="[
        'relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:shadow-lg',
        modelValue === 'employer'
          ? 'border-violet-500 bg-violet-50'
          : 'border-gray-200 bg-white hover:border-violet-300'
      ]"
    >
      <div class="flex flex-col items-center text-center">
        <!-- Employer icon -->
        <div
          :class="[
            'flex h-16 w-16 items-center justify-center rounded-full',
            modelValue === 'employer' ? 'bg-violet-500' : 'bg-gray-100'
          ]"
        >
          <svg
            :class="modelValue === 'employer' ? 'text-white' : 'text-gray-600'"
            class="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900">Employer</h3>
        <p class="mt-2 text-sm text-gray-600">
          Post jobs, find talented candidates, and grow your team
        </p>
      </div>
      <!-- Selected checkmark -->
      <div v-if="modelValue === 'employer'" class="absolute right-4 top-4">
        <svg class="h-6 w-6 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: null,
    validator: (value) => ['candidate', 'employer', null].includes(value)
  }
})

defineEmits(['select', 'update:modelValue'])
</script>
