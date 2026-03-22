<template>
  <AuthLayout>
    <AuthCard title="Sign in to your account">
      <LoginForm @submit="handleLogin" :loading="authStore.isLoading" />
      <SocialAuthButtons />
      <template #footer>
        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <RouterLink to="/auth/register" class="font-semibold text-indigo-600 hover:text-indigo-500">
            Create one now
          </RouterLink>
        </p>
      </template>
    </AuthCard>
  </AuthLayout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthLayout from '../layouts/AuthLayout.vue'
import AuthCard from '../components/auth/AuthCard.vue'
import LoginForm from '../components/auth/login/LoginForm.vue'
import SocialAuthButtons from '../components/auth/SocialAuthButtons.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

const handleLogin = async (formData) => {
  const result = await authStore.login(formData)

  if (result.success) {
    toast.success(`Welcome back, ${result.user.name}!`)
    
    // Redirect to intended page or home
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } else {
    toast.error(result.error)
  }
}
</script>
