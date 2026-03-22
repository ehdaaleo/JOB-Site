<script setup>
import { ref, computed } from 'vue'
import { useProfileStore } from '../../stores/profileStore'

const profileStore = useProfileStore()
const profile = computed(() => profileStore.profile)

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
</script>

<template>
  <div class="profile-view">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">My Profile</h1>
          <p class="text-sm text-gray-500">Manage your profile information</p>
        </div>
        <button v-if="!isEditing" @click="toggleEdit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Edit Profile
        </button>
        <div v-else class="flex gap-2">
          <button @click="toggleEdit" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            Cancel
          </button>
          <button @click="saveProfile" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Save
          </button>
        </div>
      </div>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Basic Info -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                {{ profile.name.charAt(0) }}
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
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-3">Resume</h3>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ profile.resume }}</span>
              </div>
              <button class="mt-3 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
                Upload New Resume
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column - Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Summary -->
          <div class="bg-white rounded-xl border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-3">Summary</h3>
            <p v-if="!isEditing" class="text-gray-600">{{ profile.summary }}</p>
            <textarea v-else v-model="editData.summary" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
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
                <p class="text-sm text-gray-500">{{ exp.company }} • {{ exp.period }}</p>
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
                <p class="text-sm text-gray-500">{{ edu.school }} • {{ edu.year }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
