<template>
  <AuthLayout>
    <AuthCard title="Create your account" subtitle="Start your 14-day free trial">
      <RegisterForm @submit="handleRegister" :loading="authStore.isLoading" />
      <SocialAuthButtons />
      <template #footer>
        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/auth/login" class="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in instead
          </RouterLink>
        </p>
      </template>
    </AuthCard>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthLayout from '../layouts/AuthLayout.vue'
import AuthCard from '../components/auth/AuthCard.vue'
import RegisterForm from '../components/auth/register/RegisterForm.vue'
import SocialAuthButtons from '../components/auth/SocialAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleRegister = async (formData) => {
  const result = await authStore.register(formData)

  if (result.success) {
    toast.success('Account created successfully! Please sign in to continue.')
    // After registration, redirect to login page to sign in
    router.push('/auth/login')
  } else {
    toast.error(result.error)
  }
}
</script>
