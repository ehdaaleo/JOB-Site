<script setup>
import { ref } from 'vue'
import axios from 'axios'

import ApplyJobSummary from '../components/applyJobComponents/ApplyJobSummary.vue'
import ApplyJobForm from '../components/applyJobComponents/ApplyJobForm.vue'
import ApplyJobSuccess from '../components/applyJobComponents/ApplyJobSuccess.vue'
import ApplyJobError from '../components/applyJobComponents/ApplyJobError.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

// State: idle | loading | success | error
const status = ref('idle')
const loading = ref(false)
const errorMessage = ref('')

const API_URL = 'https://retoolapi.dev/PAj1AO/AppPost'

const handleSubmit = async (formData) => {
  loading.value = true
  status.value = 'idle'
  errorMessage.value = ''

  try {
    const response = await axios.post(API_URL, formData)

    if (response.status === 201 || response.status === 200) {
      status.value = 'success'
    } else {
      throw new Error('Unexpected response status')
    }
  } catch (err) {
    status.value = 'error'
    errorMessage.value =
      err.response?.data?.message ||
      err.message ||
      'Failed to submit your application. Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

const handleRetry = () => {
  status.value = 'idle'
  errorMessage.value = ''
}
</script>

<template>
  <div class="apply-page min-h-screen bg-[#f8fafc] py-8 md:py-12">
    <div class="apply-container mx-auto px-4 md:px-6">

      <!-- Back link -->
      <router-link
        to="/jobs"
        class="back-link inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 font-medium mb-6 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to Jobs
      </router-link>

      <!-- Page Title -->
      <h1 class="page-title text-2xl md:text-3xl font-bold text-slate-900 mb-8">
        Apply for this Position
      </h1>

      <!-- Success state -->
      <template v-if="status === 'success'">
        <ApplyJobSuccess />
      </template>

      <!-- Idle / error state: show form -->
      <template v-else>
        <div class="flex flex-col gap-6">
          <!-- Job summary card -->
          <ApplyJobSummary :jobId="id" />

          <!-- Error banner (shows above form on error) -->
          <ApplyJobError
            v-if="status === 'error'"
            :message="errorMessage"
            @retry="handleRetry"
          />

          <!-- Application form -->
          <ApplyJobForm
            :jobId="id"
            :loading="loading"
            @submit="handleSubmit"
          />
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

.apply-page {
  font-family: 'DM Sans', sans-serif;
}

.apply-container {
  max-width: 720px;
}

.page-title {
  font-family: 'Syne', sans-serif;
}

.back-link {
  text-decoration: none;
}
</style>
