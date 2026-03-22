<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <!-- Email field container -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
      <div class="mt-1">
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="loading"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100"
          placeholder="you@example.com"
        />
      </div>
    </div>

    <!-- Password field container -->
    <div>
      <div class="flex items-center justify-between">
        <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
        <RouterLink to="/auth/forgot-password" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</RouterLink>
      </div>
      <div class="mt-1">
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="loading"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100"
        />
      </div>
    </div>

    <!-- Submit button container -->
    <div>
      <button
        type="submit"
        :disabled="loading"
        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = () => {
  emit('submit', form)
}
</script>
