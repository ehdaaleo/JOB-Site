<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthCard from '@/components/auth/AuthCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const email = ref('')
const isSubmitted = ref(false)

const handleSubmit = async () => {
  const result = await authStore.forgotPassword(email.value)

  if (result.success) {
    toast.success(result.message)
    isSubmitted.value = true
  } else {
    toast.error(result.error)
  }
}

const backToLogin = () => {
  router.push('/auth/login')
}
</script>

<template>
  <AuthCard title="Forgot your password?" subtitle="No worries, we'll send you reset instructions">
    <!-- Success Message -->
    <div v-if="isSubmitted" class="text-center py-4">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
      <p class="text-gray-500 mb-6">
        We've sent a password reset link to <strong>{{ email }}</strong>
      </p>
      <button
        type="button"
        class="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
        @click="backToLogin"
      >
        Back to Sign In
      </button>
    </div>

    <!-- Forgot Password Form -->
    <form v-else class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
        <div class="mt-1">
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="authStore.isLoading"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 disabled:bg-gray-100"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ authStore.isLoading ? 'Sending...' : 'Send reset link' }}
        </button>
      </div>
    </form>

    <template #footer>
      <p class="mt-6 text-center text-sm text-gray-600">
        <button type="button" class="font-semibold text-blue-600 hover:text-blue-500" @click="backToLogin">
          ← Back to sign in
        </button>
      </p>
    </template>
  </AuthCard>
</template>
