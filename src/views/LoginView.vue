<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthCard from '@/components/auth/AuthCard.vue'
import LoginForm from '@/components/auth/login/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const handleLogin = async (formData) => {
  const result = await authStore.login(formData)
  if (!result.success) {
    toast.error(result.error || 'Login failed')
    return
  }

  toast.success(`Welcome back, ${result.user.name || result.user.email}!`)
  const redirect = router.currentRoute.value.query.redirect
  if (redirect) {
    router.push(redirect)
    return
  }
  router.push(authStore.dashboardRoute)
}
</script>

<template>
  <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
    <LoginForm @submit="handleLogin" :loading="authStore.isLoading" />

    <p class="text-center mt-6 text-sm text-gray-600">
      Don't have an account?
      <router-link to="/auth/register" class="text-blue-600 font-semibold hover:underline">
        Sign up for free
      </router-link>
    </p>
  </AuthCard>
</template>
