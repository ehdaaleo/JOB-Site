<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and main nav links -->
        <div class="flex items-center">
          <RouterLink to="/" class="text-xl font-bold text-indigo-600 flex items-center">
            <svg class="h-8 w-8 text-indigo-600 mr-2" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="14" width="24" height="18" rx="3" fill="currentColor" fill-opacity="0.2"/>
              <rect x="8" y="14" width="24" height="18" rx="3" stroke="currentColor" stroke-width="2"/>
              <path d="M14 14V12C14 10.8954 14.8954 10 16 10H24C25.1046 10 26 10.8954 26 12V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M20 24V28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M16 20H24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Job Site
          </RouterLink>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <RouterLink
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
              About
            </RouterLink>
          </div>
        </div>

        <!-- Right side nav -->
        <div class="flex items-center">
          <template v-if="authStore.isLoggedIn">
            <!-- User menu -->
            <div class="ml-3 flex items-center space-x-4">
              <span class="text-sm text-gray-700">{{ authStore.user?.name }}</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {{ authStore.user?.role }}
              </span>
              <button
                @click="handleLogout"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center space-x-4">
              <RouterLink
                to="/auth/login"
                class="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </RouterLink>
              <RouterLink
                to="/auth/register"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Create account
              </RouterLink>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
}
</script>
