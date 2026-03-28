<script setup>
import { ref, computed } from 'vue'
import { useProfileStore } from '../../stores/profileStore'
import { useAuthStore } from '../../stores/auth'
import Hero from '../../components/Hero.vue'
import NavBar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const profileStore = useProfileStore()
const authStore = useAuthStore()

const profile = computed(() => profileStore.profile)
const isOwner = computed(() => {
  return authStore.user && authStore.user.email === profile.value.email
})

const isEditing = ref(false)
const editData = ref({})
const newSkill = ref('')

const toggleEdit = () => {
  if (isEditing.value) {
    profileStore.updateProfile(editData.value)
  } else {
    editData.value = { ...profile.value }
  }
  isEditing.value = !isEditing.value
}

const saveProfile = () => {
  profileStore.updateProfile(editData.value)
  isEditing.value = false
  alert('Profile saved successfully!')
}

const addSkill = () => {
  if (newSkill.value.trim()) {
    profileStore.addSkill(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (skill) => {
  profileStore.removeSkill(skill)
}
const downloadResume = () => {
  const link = document.createElement('a')
  link.href = profile.value.resume
  link.download = 'resume.pdf'
  link.click()
}
</script>

<template>
  <div class="profile-view">
    <!-- Hero Section -->
    <!-- <Hero /> -->
<NavBar />
<div class="bg-slate-50 min-h-screen pb-20 pt-16">
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ isOwner ? 'My Profile' : profile.name + "'s Profile" }}</h1>
          <p class="text-sm text-gray-500">{{ isOwner ? 'Manage your profile information' : 'View professional profile and experience' }}</p>
        </div>
        
        <div class="flex items-center gap-3">

          <!-- Edit Profile Button (Owner Only) -->
          <button v-if="isOwner && !isEditing" @click="toggleEdit" class="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-sm shadow-sm transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Profile
          </button>

          <div v-if="isOwner && isEditing" class="flex gap-2">
            <button @click="toggleEdit" class="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold text-sm transition-all">
              Cancel
            </button>
            <button @click="saveProfile" class="px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold text-sm shadow-sm transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Basic Info -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                <img :src="profile.profile_picture" :alt="profile.name" class="w-full h-full object-cover" />
              </div>
              <h2 class="text-xl font-semibold text-gray-900">{{ profile.name }}</h2>
              <p class="text-gray-500">{{ profile.title }}</p>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3 text-sm">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-600">{{ profile.email }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span class="text-gray-600">{{ profile.phone }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-gray-600">{{ profile.location }}</span>
              </div>
              <div v-if="profile.linkedin_profile" class="flex items-center gap-3 text-sm">
                <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <a :href="profile.linkedin_profile" target="_blank" class="text-blue-600 hover:underline">LinkedIn Profile</a>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-3">Resume</h3>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ profile.resume }}</span>
              </div>
              <button v-if="isOwner" class="mt-3 w-full px-4 py-2 border border-blue-100 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-bold transition-all text-sm flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Upload New Resume
              </button>
              <button v-else @click="downloadResume" class="mt-3 w-full px-4 py-2 border border-indigo-100 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-bold transition-all text-sm flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Resume
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column - Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Bio -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Bio</h3>
            <p v-if="!isEditing" class="text-gray-600">{{ profile.bio }}</p>
            <textarea v-else v-model="editData.bio" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
          </div>

          <!-- Skills -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Skills</h3>
            <div v-if="!isEditing" class="flex flex-wrap gap-2">
              <span v-for="skill in profile.skills" :key="skill" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {{ skill }}
              </span>
            </div>
            <div v-else>
              <div class="flex flex-wrap gap-2 mb-3">
                <span v-for="skill in editData.skills" :key="skill" class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                  {{ skill }}
                  <button @click="removeSkill(skill)" class="text-blue-400 hover:text-blue-600">&times;</button>
                </span>
              </div>
              <div class="flex gap-2">
                <input v-model="newSkill" type="text" placeholder="Add skill" aria-label="Add new skill" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg" @keyup.enter="addSkill">
                <button @click="addSkill" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
              </div>
            </div>
          </div>

          <!-- Experience -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Experience</h3>
            <div class="space-y-4">
              <div v-for="exp in profile.experience" :key="exp.id" class="border-l-2 border-blue-500 pl-4">
                <h4 class="font-medium text-gray-900">{{ exp.title }}</h4>
                <p class="text-sm text-gray-500">{{ exp.company }} - {{ exp.period }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- Education -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4">Education</h3>
            <div class="space-y-3">
              <div v-for="edu in profile.education" :key="edu.id" class="border-l-2 border-purple-500 pl-4">
                <h4 class="font-medium text-gray-900">{{ edu.degree }}</h4>
                <p class="text-sm text-gray-500">{{ edu.school }} - {{ edu.year }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
  <Footer />

</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
