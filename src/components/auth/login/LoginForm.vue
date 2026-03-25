<template>
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <!-- Email field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
      <div class="mt-1">
        <input
          id="email"
          v-model="form.email"
          type="email"
          :disabled="loading"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 disabled:bg-gray-100"
          :class="errors.email ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-blue-600'"
          placeholder="you@example.com"
          @blur="validateEmail"
          @input="clearError('email')"
          aria-invalid="errors.email ? 'true' : 'false'"
          :aria-describedby="errors.email ? 'email-error' : undefined"
        />
      </div>
      <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.email }}</p>
    </div>

    <!-- Password field -->
    <div>
      <div class="flex items-center justify-between">
        <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
        <RouterLink to="/auth/forgot-password" class="text-sm font-semibold text-blue-600 hover:text-blue-500">Forgot password?</RouterLink>
      </div>
      <div class="relative">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :disabled="loading"
          class="block w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 disabled:bg-gray-100"
          :class="errors.password ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-blue-600'"
          @blur="validatePassword"
          @input="clearError('password')"
          aria-invalid="errors.password ? 'true' : 'false'"
          :aria-describedby="errors.password ? 'password-error' : undefined"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
      <p v-if="errors.password" id="password-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.password }}</p>
    </div>

    <!-- Rate limit warning -->
    <div v-if="isLocked" class="rounded-md bg-yellow-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            Too many failed attempts. Please try again in 30 seconds.
          </p>
        </div>
      </div>
    </div>

    <!-- Submit button -->
    <div>
      <button
        type="submit"
        :disabled="loading || isLocked || !isFormValid"
        class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>

    <!-- Generic error after multiple failed attempts -->
    <div v-if="genericError" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ genericError }}</p>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

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

const errors = reactive({
  email: '',
  password: ''
})

const touched = reactive({
  email: false,
  password: false
})

const showPassword = ref(false)
const isLocked = ref(false)
const failedAttempts = ref(0)
const genericError = ref('')

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validateEmail = () => {
  touched.email = true
  if (!form.email || form.email.trim() === '') {
    errors.email = 'Email address is required'
    return false
  }
  if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }
  errors.email = ''
  return true
}

const validatePassword = () => {
  touched.password = true
  if (!form.password) {
    errors.password = 'Password is required'
    return false
  }
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }
  errors.password = ''
  return true
}

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

const isFormValid = computed(() => {
  const emailValid = form.email && emailRegex.test(form.email)
  const passwordValid = form.password && form.password.length >= 8
  return emailValid && passwordValid && !errors.email && !errors.password
})

const handleSubmit = () => {
  genericError.value = ''
  
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  
  if (!emailValid || !passwordValid) {
    return
  }
  
  emit('submit', form, () => {
    form.email = ''
    form.password = ''
    touched.email = false
    touched.password = false
  })
}
</script>
