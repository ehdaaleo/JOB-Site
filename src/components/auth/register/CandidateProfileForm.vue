<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Profile Information</h2>

    <!-- Headline field -->
    <div>
      <label for="headline" class="block text-sm font-medium text-gray-900">Professional headline <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="headline"
          v-model="form.headline"
          type="text"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.headline ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="e.g., Senior Software Engineer"
          @blur="validateHeadline"
          @input="clearError('headline')"
          aria-invalid="errors.headline ? 'true' : 'false'"
          :aria-describedby="errors.headline ? 'headline-error' : undefined"
        />
      </div>
      <p v-if="errors.headline" id="headline-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.headline }}</p>
    </div>

    <!-- Skills field -->
    <div>
      <label for="skills" class="block text-sm font-medium text-gray-900">Skills (comma separated) <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="skills"
          v-model="form.skills"
          type="text"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.skills ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="e.g., JavaScript, Vue.js, Node.js"
          @blur="validateSkills"
          @input="clearError('skills')"
          aria-invalid="errors.skills ? 'true' : 'false'"
          :aria-describedby="errors.skills ? 'skills-error' : undefined"
        />
      </div>
      <p v-if="errors.skills" id="skills-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.skills }}</p>
    </div>

    <!-- Experience field -->
    <div>
      <label for="experience" class="block text-sm font-medium text-gray-900">Years of experience <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <select
          id="experience"
          v-model="form.experience"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.experience ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          @change="validateExperience"
          aria-invalid="errors.experience ? 'true' : 'false'"
          :aria-describedby="errors.experience ? 'experience-error' : undefined"
        >
          <option value="">Select experience level</option>
          <option value="0-1">0-1 years (Entry level)</option>
          <option value="1-3">1-3 years (Junior)</option>
          <option value="3-5">3-5 years (Mid-level)</option>
          <option value="5-10">5-10 years (Senior)</option>
          <option value="10+">10+ years (Expert)</option>
        </select>
      </div>
      <p v-if="errors.experience" id="experience-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.experience }}</p>
    </div>

    <!-- Resume upload container -->
    <div>
      <label class="block text-sm font-medium text-gray-900">Upload resume (optional)</label>
      <div class="mt-2">
        <div
          class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center hover:border-gray-400"
          :class="{ 'border-indigo-500 bg-indigo-50': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.doc,.docx"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            @change="handleFileSelect"
          />
          <div v-if="form.resume" class="flex items-center space-x-2">
            <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm text-gray-700">{{ form.resume.name }}</span>
          </div>
          <div v-else class="text-center">
            <svg class="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mt-2 text-sm text-gray-700">
              <span class="font-medium text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p class="mt-1 text-xs text-gray-600">PDF, DOC, DOCX up to 5MB</p>
          </div>
        </div>
      </div>
      <p v-if="errors.resume" class="mt-1 text-sm text-red-600" role="alert">{{ errors.resume }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['file-change'])

const isDragging = ref(false)
const fileInput = ref(null)

const errors = reactive({
  headline: '',
  skills: '',
  experience: '',
  resume: ''
})

// Text validation: at least 3 chars, letters/spaces/hyphens only
const validateText = (value, fieldName, minLength = 3, maxLength = 100) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  if (value.trim().length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }
  // Allow letters, spaces, hyphens, and commas (for skills)
  const textRegex = /^[\p{L}][\p{L} \-,]{0,99}$/u
  if (!textRegex.test(value)) {
    return `${fieldName} can only contain letters, spaces, and hyphens`
  }
  if (/  +/.test(value)) {
    return `${fieldName} cannot contain consecutive spaces`
  }
  if (/--/.test(value)) {
    return `${fieldName} cannot contain consecutive hyphens`
  }
  if (/^[ \-]|[ \-]$/.test(value)) {
    return `${fieldName} cannot start or end with a space or hyphen`
  }
  return ''
}

const validateHeadline = () => {
  const error = validateText(props.form.headline, 'Headline', 3, 100)
  errors.headline = error
  return !error
}

const validateSkills = () => {
  if (!props.form.skills || props.form.skills.trim() === '') {
    errors.skills = 'Skills are required'
    return false
  }
  const skillsArray = props.form.skills.split(',').map(s => s.trim()).filter(s => s)
  if (skillsArray.length < 2) {
    errors.skills = 'Please enter at least 2 skills'
    return false
  }
  if (props.form.skills.length > 500) {
    errors.skills = 'Skills must not exceed 500 characters'
    return false
  }
  errors.skills = ''
  return true
}

const validateExperience = () => {
  if (!props.form.experience) {
    errors.experience = 'Please select your experience level'
    return false
  }
  errors.experience = ''
  return true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && isValidResumeType(file)) {
    handleFile(file)
  } else {
    errors.resume = 'Please drop a valid file (PDF, DOC, DOCX)'
  }
}

const isValidResumeType = (file) => {
  return file.type === 'application/pdf' ||
         file.type === 'application/msword' ||
         file.type.includes('wordprocessingml')
}

const handleFile = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errors.resume = 'File size must be less than 5MB'
    return
  }
  errors.resume = ''
  emit('file-change', file, 'resume')
}

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

defineExpose({
  validateHeadline,
  validateSkills,
  validateExperience,
  errors,
  isValid: () => !errors.headline && !errors.skills && !errors.experience
})
</script>
