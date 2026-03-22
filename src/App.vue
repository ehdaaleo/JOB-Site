<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navigation />
    <RouterView />
  </div>
</template>

