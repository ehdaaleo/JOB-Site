<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import AuthCard from '@/components/auth/AuthCard.vue'
import LoginForm from '@/components/auth/login/LoginForm.vue'
import SocialAuthButtons from '@/components/auth/SocialAuthButtons.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showForgotPassword = ref(false)

const handleLogin = async (formData) => {
  const result = await authStore.login(formData)

  if (result.success) {
    toast.success(`Welcome back, ${result.user.name || result.user.email}!`)

    // Redirect based on role, with fallback to home
    const redirectPath = router.currentRoute.value.query.redirect
    if (redirectPath) {
      router.push(redirectPath)
    } else if (result.user.role === 'candidate') {
      router.push({ name: 'home' })
    } else if (result.user.role === 'employer') {
      router.push({ name: 'home' })
    } else if (result.user.role === 'admin') {
      router.push({ name: 'home' })
    } else {
      router.push({ name: 'home' })
    }
  } else {
    toast.error(result.error || 'Login failed')
  }
}

const handleSocialLogin = (provider) => {
  console.log(`Login with ${provider}`)
  toast.info(`${provider} login coming soon!`)
}
</script>

<template>
  <AuthCard title="Welcome back" subtitle="Sign in to your account to continue">
    <!-- Show Forgot Password Form -->
    <div v-if="showForgotPassword" class="forgot-password-section">
      <div class="text-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Forgot Password?</h3>
        <p class="text-sm text-gray-500 mt-1">
          No worries! Enter your email and we'll send you reset instructions.
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="router.push('/auth/forgot-password')">
        <div>
          <label for="reset-email" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
        >
          Send Reset Link
        </button>

        <button
          type="button"
          class="w-full py-2 text-sm text-gray-600 hover:text-gray-900"
          @click="showForgotPassword = false"
        >
          ← Back to Sign In
        </button>
      </form>
    </div>

    <!-- Show Login Form -->
    <template v-else>
      <LoginForm @submit="handleLogin" :loading="authStore.isLoading" />

      <SocialAuthButtons @login="handleSocialLogin" />

      <!-- Sign Up Link -->
      <p class="text-center mt-6 text-sm text-gray-600">
        Don't have an account?
        <router-link to="/auth/register" class="text-blue-600 font-semibold hover:underline">
          Sign up for free
        </router-link>
      </p>
    </template>
  </AuthCard>
</template>
