<script setup>
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'
import { useAuthStore } from '@/stores/auth'

const { user, isAuthenticated, isLoading } = useAuth0()
const authStore = useAuthStore()

// Sync Auth0 state with Pinia store
watch([user, isAuthenticated, isLoading], ([newUser, authenticated, loading]) => {
  if (!loading && authenticated && newUser) {
    authStore.user = newUser
    authStore.token = 'auth0-session' // Placeholder to satisfy isAuthenticated getter
  } else if (!loading && !authenticated) {
    // If not loading and not authenticated, we don't necessarily want to logout
    // because regular login might still be active. 
    // But for Auth0 flows, it helps to keep them in sync.
  }
}, { immediate: true })
</script>

<template>
  <RouterView />
</template>

<style>
/* Base project styles are in src/assets/main.css */
</style>
