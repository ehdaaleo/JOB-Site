<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import ChatbotWidget from '@/components/chatbot/ChatbotWidget.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { initTheme } = useTheme()
const authStore = useAuthStore()

onMounted(() => {
  initTheme()
  // Re-hydrate from /me using the persisted token, then start the
  // cross-tab logout listener.
  authStore.bootstrap()
})
</script>

<template>
  <main class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 min-h-screen">
    <RouterView />
    <ChatbotWidget />
    <ConfirmDialog />
  </main>
</template>

<style>
/* Base project styles are in src/assets/main.css */
</style>
