<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth0 } from '@auth0/auth0-vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()
const { logout, isAuthenticated: isAuth0Authenticated } = useAuth0()

const handleLogout = () => {
  if (isAuth0Authenticated.value) {
    logout({ logoutParams: { returnTo: window.location.origin } })
  }
  authStore.logout()
}
const isMenuOpen = ref(false)
const isScrolled = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 10
  })
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Find Jobs', path: '/jobs' },
  { name: 'Companies', path: '/companies' },
  { name: 'Pricing', path: '/pricing' },
]
</script>

<template>
  <nav class="navbar bg-white dark:bg-gray-900 fixed top-0 left-0 right-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors" :class="{ 'shadow-md': isScrolled }">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between w-full h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 no-underline">
          <div class="w-9 h-9 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5 text-white">
              <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="text-lg font-bold text-gray-800 dark:text-gray-100">Find Jobs site </span>
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-6">
          <RouterLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {{ link.name }}
          </RouterLink>
        </div>

        <!-- Auth -->
        <div class="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <template v-if="authStore.isAuthenticated">
            <RouterLink 
              :to="`/${authStore.user?.role || 'candidate'}/dashboard`" 
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-2"
            >
              Dashboard
            </RouterLink>
            <!-- Post Job Button for Employers -->
            <RouterLink 
              v-if="authStore.user?.role === 'employer'"
              to="/employer/job-post"
              class="text-sm font-medium px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity mr-2"
            >
              Post Job
            </RouterLink>
            <button class="text-sm font-medium px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" @click="handleLogout">
              Log out
            </button>
          </template>
          <template v-else>
            <button class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors" @click="router.push('/login')">
              Log in
            </button>
            <button class="text-sm font-medium px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90" @click="router.push('/register')">
              Register
            </button>
          </template>
        </div>

        <!-- Mobile -->
        <div class="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button class="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white" @click="isMenuOpen = !isMenuOpen">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div class="flex flex-col gap-2">
          <RouterLink v-for="link in navLinks" :key="link.path" :to="link.path" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" @click="isMenuOpen = false">
            {{ link.name }}
          </RouterLink>
          <div class="h-px bg-gray-200 dark:bg-gray-800 my-1"></div>
          <template v-if="authStore.isAuthenticated">
            <RouterLink :to="`/${authStore.user?.role || 'candidate'}/dashboard`" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left" @click="isMenuOpen = false">Dashboard</RouterLink>
            <!-- Post Job for Mobile Employers -->
            <RouterLink 
              v-if="authStore.user?.role === 'employer'"
              to="/employer/job-post" 
              class="px-3 py-2 text-sm font-medium text-blue-600 rounded-lg hover:bg-blue-50 text-left" 
              @click="isMenuOpen = false"
            >
              Post Job
            </RouterLink>
            <button class="px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 text-left" @click="handleLogout(); isMenuOpen = false">Log out</button>
          </template>
          <template v-else>
            <button class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left" @click="router.push('/login'); isMenuOpen = false">Log in</button>
            <button class="px-3 py-2 text-sm font-medium bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg" @click="router.push('/register'); isMenuOpen = false">Register</button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.no-underline {
  text-decoration: none;
}
.navbar {
  min-height: 64px;
}
</style>
