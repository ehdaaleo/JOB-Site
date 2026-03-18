<!-- hero section has:
 
image name and linkedin "/in/username" profile and some more information that can be in the horzintal hero section 




<!-- @startuml
title Job Board Application - Entity Relationship Dia

' ========================
' Users Section
' ========================
class User {
  -id: bigint PK
  -name: string
  -email: string UK
  -password: string
  -role: string
  -company_name: string
  -company_logo: string
  -phone: string
  -linkedin_profile: string
  -resume: string
  -profile_picture: string
  -bio: text
  -location: string
  -email_verified_at: timestamp
  -remember_token: string
  -created_at: timestamp
  -updated_at: timestamp
  +login()
  +logout()
  +register()
  +updateProfile()
}
-->
<script setup>
  import { computed } from 'vue'

  const name = 'Tolba'
  const bio = 'Software Engineer passionate about Web Development'
  const role = 'Software Engineer'
  const email = 'mail@mail.mail'
  const resume = new File(
    [''],
    'resume.pdf',
    {
      type: 'application/pdf',
    }
  )
  const linkedin = 'https://www.linkedin.com/in/DevAbdoTolba/'
  const profile_picture = 'https://picsum.photos/seed/tolba/200/200'

  const linkedinPath = computed(() => {
    try {
      return new URL(linkedin).pathname
    } catch {
      return linkedin
    }
  })


  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = resume
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
            <img :src="profile_picture" :alt="name" />
          </div>
        </div>
        
        <div class="text-center lg:text-left">
          <h1 class="text-5xl font-bold tracking-tight text-base-content">{{ name }}</h1>
          <p class="text-xl text-primary font-semibold mt-2">{{ role }}</p>
          <div class="flex flex-col sm:flex-row items-center lg:items-start gap-4 mt-4 text-base opacity-80">
            <a :href="`mailto:${email}`" class="flex items-center gap-2 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {{ email }}
            </a>
            <a :href="linkedin" target="_blank" class="flex items-center gap-2 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              {{ linkedinPath }}
            </a>
          </div>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
        <a :href="linkedin" target="_blank" class="btn btn-primary btn-lg shadow-lg hover:scale-105 transition-transform">
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