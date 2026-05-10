<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthCard from '@/components/auth/AuthCard.vue'
import RegisterForm from '@/components/auth/register/RegisterForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleRegister = async (formData) => {
  const result = await authStore.register(formData)
  if (result.success) {
    toast.success('Account created. Please sign in to continue.')
    router.push('/auth/login')
  } else {
    toast.error(result.error)
  }
}
</script>

<template>
  <AuthCard title="Create your account" subtitle="It only takes a minute">
    <RegisterForm @submit="handleRegister" :loading="authStore.isLoading" />
    <template #footer>
      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <RouterLink to="/auth/login" class="font-semibold text-blue-600 hover:text-blue-500">
          Sign in instead
        </RouterLink>
      </p>
    </template>
  </AuthCard>
</template>
