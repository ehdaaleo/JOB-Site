<script setup>
import { computed } from 'vue'
import { useProfileStore } from '../stores/profileStore'

const profileStore = useProfileStore()
const profile = computed(() => profileStore.profile)

const linkedinPath = computed(() => {
  try {
    return new URL(profile.value.linkedin_profile).pathname
  } catch {
    return profile.value.linkedin_profile
  }
})

const downloadResume = () => {
  const link = document.createElement('a')
  link.href = profile.value.resume
  link.download = 'resume.pdf'
  link.click()
}
</script>

<template>
  <div class="hero bg-base-200 py-10 rounded-3xl my-5 shadow-xl transition-all hover:shadow-2xl">
    <div class="hero-content flex-col lg:flex-row w-full justify-between items-center gap-8 px-8">
      <!-- Left Section: Image and Info -->
      <div class="flex flex-col lg:flex-row items-center lg:items-center gap-8">
        <div class="avatar">
          <div class="w-36 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-xl">
            <img :src="profile.profile_picture" :alt="profile.name" />
          </div>
        </div>

        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold tracking-tight text-base-content">{{ profile.name }}</h1>
          <p class="text-xl text-primary font-semibold mt-2">{{ profile.title }}</p>
          <div class="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-4 text-base opacity-80">
            <a :href="`mailto:${profile.email}`" class="flex items-center gap-2 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {{ profile.email }}
            </a>
            <a v-if="profile.linkedin_profile" :href="profile.linkedin_profile" target="_blank" class="flex items-center gap-2 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              {{ linkedinPath }}
            </a>
            <span v-if="profile.location" class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {{ profile.location }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
        <a v-if="profile.linkedin_profile" :href="profile.linkedin_profile" target="_blank" class="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform">
          Connect
        </a>
        <button
            @click="downloadResume"
            class="btn btn-outline btn-secondary btn-lg gap-2 hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Resume
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
