<script setup>
import { reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthCard from '@/components/auth/AuthCard.vue'
import PasswordStrength from '@/components/auth/PasswordStrength.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = reactive({
  password: '',
  confirmPassword: ''
})

const passwordMismatch = computed(() => {
  return form.confirmPassword && form.password !== form.confirmPassword
})

const handleSubmit = async () => {
  if (passwordMismatch.value) {
    toast.error('Passwords do not match')
    return
  }

  const token = route.query.token

  if (!token) {
    toast.error('Missing reset token. Please request a new password reset.')
    return
  }

  const result = await authStore.resetPassword(token, form.password)

  if (result.success) {
    toast.success(result.message)
    setTimeout(() => {
      router.push('/auth/login')
    }, 2000)
  } else {
    toast.error(result.error)
  }
}
</script>

<template>
  <AuthCard title="Reset your password" subtitle="Enter your new password below">
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">New password</label>
        <div class="mt-1">
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            :disabled="authStore.isLoading"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 disabled:bg-gray-100"
          />
        </div>
        <PasswordStrength :password="form.password" class="mt-2" />
      </div>

      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm password</label>
        <div class="mt-1">
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            :disabled="authStore.isLoading"
            class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 disabled:bg-gray-100"
          />
        </div>
        <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
      </div>

      <div>
        <button
          type="submit"
          :disabled="authStore.isLoading || passwordMismatch"
          class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ authStore.isLoading ? 'Resetting...' : 'Reset password' }}
        </button>
      </div>
    </form>

    <template #footer>
      <p class="mt-6 text-center text-sm text-gray-600">
        <RouterLink to="/auth/login" class="font-semibold text-blue-600 hover:text-blue-500">
          Back to sign in
        </RouterLink>
      </p>
    </template>
  </AuthCard>
</template>
