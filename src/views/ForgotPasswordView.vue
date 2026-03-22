<template>
  <AuthLayout>
    <AuthCard title="Forgot your password?" subtitle="No worries, we'll send you reset instructions">
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
          <div class="mt-1">
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="authStore.isLoading"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 disabled:bg-gray-100"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ authStore.isLoading ? 'Sending...' : 'Send reset link' }}
          </button>
        </div>
      </form>

      <template #footer>
        <p class="mt-6 text-center text-sm text-gray-600">
          <RouterLink to="/auth/login" class="font-semibold text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </RouterLink>
        </p>
      </template>
    </AuthCard>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthLayout from '../layouts/AuthLayout.vue'
import AuthCard from '../components/auth/AuthCard.vue'

const authStore = useAuthStore()
const toast = useToast()
const email = ref('')

const handleSubmit = async () => {
  const result = await authStore.forgotPassword(email.value)

  if (result.success) {
    toast.success(result.message)
    email.value = ''
  } else {
    toast.error(result.error)
  }
}
</script>
