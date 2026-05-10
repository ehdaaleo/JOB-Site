<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJobStore } from '@/stores/jobStore'
import { useApplicationStore } from '@/stores/applicationStore'
import { apiErrorMessage } from '@/services/api'

import ApplyJobSummary from '../components/applyJobComponents/ApplyJobSummary.vue'
import ApplyJobForm from '../components/applyJobComponents/ApplyJobForm.vue'
import ApplyJobSuccess from '../components/applyJobComponents/ApplyJobSuccess.vue'
import ApplyJobError from '../components/applyJobComponents/ApplyJobError.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const jobStore = useJobStore()
const applicationStore = useApplicationStore()

// State: idle | success | error
const status = ref('idle')
const loading = ref(false)
const errorMessage = ref('')

const jobDetails = computed(() => {
  const j = jobStore.currentJob
  if (!j) return { title: '', company: '' }
  return {
    title: j.title,
    company:
      j.employer?.company_name || j.employer?.organization || j.employer?.name || 'Company',
  }
})

onMounted(() => jobStore.fetchJobById(props.id))

const handleSubmit = async (formData) => {
  loading.value = true
  errorMessage.value = ''
  try {
    // Normalise the form payload onto the Laravel ApplicationRequest schema.
    const payload = {
      cover_letter: formData.cover_letter || '',
      phone: formData.phone || '',
      email: formData.email || '',
      message: [
        formData.candidate_name && `Candidate: ${formData.candidate_name}`,
        formData.current_role && `Current role: ${formData.current_role}`,
        formData.industry && `Industry: ${formData.industry}`,
        formData.resume_content && `\n${formData.resume_content}`,
      ]
        .filter(Boolean)
        .join('\n')
        .slice(0, 2000),
      resume: (formData.resume || '').slice(0, 1000),
    }
    await applicationStore.applyForJob(props.id, payload)
    status.value = 'success'
  } catch (err) {
    status.value = 'error'
    if (err?.response?.status === 409) {
      errorMessage.value = 'You have already applied for this job.'
    } else {
      errorMessage.value = apiErrorMessage(err, 'Failed to submit your application.')
    }
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
            :jobTitle="jobDetails.title"
            :companyName="jobDetails.company"
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
