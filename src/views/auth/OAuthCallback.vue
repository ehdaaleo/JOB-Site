<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 text-center">
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <h3 class="text-sm font-medium text-red-800">Authentication Error</h3>
        <p class="mt-2 text-sm text-red-700">{{ error }}</p>
        <div class="mt-4">
          <router-link
            to="/auth/login"
            class="text-sm font-medium text-red-600 hover:text-red-500"
          >
            &larr; Back to login
          </router-link>
        </div>
      </div>
      <div v-else class="space-y-4">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
        <h2 class="text-xl font-semibold text-gray-900">Signing you in...</h2>
        <p class="text-sm text-gray-500">Please wait while we complete the authentication process.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const error = ref(null)

onMounted(async () => {
  const { code, state, error: queryError } = route.query
  const provider = sessionStorage.getItem('oauth_provider')
  const savedState = sessionStorage.getItem('oauth_state')

  // Clean up session storage
  sessionStorage.removeItem('oauth_state')
  sessionStorage.removeItem('oauth_provider')

  if (queryError) {
    error.value = `Provider error: ${queryError}`
    return
  }

  if (!code || !provider) {
    error.value = 'Invalid authentication request.'
    return
  }

  // CSRF check
  if (!state || state !== savedState) {
    error.value = 'Security validation failed. Please try again.'
    return
  }

  try {
    const result = await authStore.loginWithOAuth({
      provider,
      code,
      redirectUri: `${window.location.origin}/auth/callback/${provider}`
    })

    if (result.success) {
      toast.success(`Welcome back, ${result.user.name || result.user.email}!`)

      // Redirect based on role or saved redirect
      const redirectPath = route.query.redirect || '/'
      router.push(redirectPath)
    } else {
      error.value = result.error || 'Failed to authenticate with social provider.'
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred during sign-in.'
    console.error('OAuth Callback Error:', err)
  }
})
</script>
