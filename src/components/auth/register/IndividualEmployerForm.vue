<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Professional Information</h2>

    <!-- Organization field -->
    <div>
      <label for="organization" class="block text-sm font-medium text-gray-900">Organization name <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="organization"
          v-model="form.organization"
          type="text"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.organization ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="Your organization or company"
          @blur="validateOrganization"
          @input="clearError('organization')"
          aria-invalid="errors.organization ? 'true' : 'false'"
          :aria-describedby="errors.organization ? 'organization-error' : undefined"
        />
      </div>
      <p v-if="errors.organization" id="organization-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.organization }}</p>
    </div>

    <!-- Job title field -->
    <div>
      <label for="jobTitle" class="block text-sm font-medium text-gray-900">Job title <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="jobTitle"
          v-model="form.jobTitle"
          type="text"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.jobTitle ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="e.g., Hiring Manager, HR Director"
          @blur="validateJobTitle"
          @input="clearError('jobTitle')"
          aria-invalid="errors.jobTitle ? 'true' : 'false'"
          :aria-describedby="errors.jobTitle ? 'jobTitle-error' : undefined"
        />
      </div>
      <p v-if="errors.jobTitle" id="jobTitle-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.jobTitle }}</p>
    </div>

    <!-- Industry field -->
    <div>
      <label for="industry" class="block text-sm font-medium text-gray-900">Industry <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <select
          id="industry"
          v-model="form.industry"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.industry ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          @change="validateIndustry"
          aria-invalid="errors.industry ? 'true' : 'false'"
          :aria-describedby="errors.industry ? 'industry-error' : undefined"
        >
          <option value="">Select industry</option>
          <option value="technology">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="retail">Retail</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="services">Services</option>
          <option value="other">Other</option>
        </select>
      </div>
      <p v-if="errors.industry" id="industry-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.industry }}</p>
    </div>

    <!-- Bio field -->
    <div>
      <label for="bio" class="block text-sm font-medium text-gray-900">Short bio <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <textarea
          id="bio"
          v-model="form.bio"
          rows="4"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.bio ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="Tell us about yourself and your hiring needs..."
          @blur="validateBio"
          @input="clearError('bio')"
          aria-invalid="errors.bio ? 'true' : 'false'"
          :aria-describedby="errors.bio ? 'bio-error' : undefined"
        />
      </div>
      <p v-if="errors.bio" id="bio-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.bio }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const errors = reactive({
  organization: '',
  jobTitle: '',
  industry: '',
  bio: ''
})

// Text validation: at least 3 chars, letters/spaces/hyphens only
const validateText = (value, fieldName, minLength = 3, maxLength = 100, allowExtraChars = '') => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  if (value.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  if (value.trim().length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`
  }
  // Build regex pattern - allow letters, spaces, hyphens, and any extra chars passed
  const extraCharsPattern = allowExtraChars ? allowExtraChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') : ''
  const textRegex = new RegExp(`^[\\p{L}][\\p{L} \\-${extraCharsPattern}]{0,${maxLength - 1}}$`, 'u')
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

const validateOrganization = () => {
  const error = validateText(props.form.organization, 'Organization name', 3, 100)
  errors.organization = error
  return !error
}

const validateJobTitle = () => {
  const error = validateText(props.form.jobTitle, 'Job title', 3, 100)
  errors.jobTitle = error
  return !error
}

const validateIndustry = () => {
  if (!props.form.industry) {
    errors.industry = 'Please select an industry'
    return false
  }
  errors.industry = ''
  return true
}

const validateBio = () => {
  const error = validateText(props.form.bio, 'Bio', 3, 2000)
  errors.bio = error
  return !error
}

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

defineExpose({
  validateOrganization,
  validateJobTitle,
  validateIndustry,
  validateBio,
  errors,
  isValid: () => !errors.organization && !errors.jobTitle && !errors.industry && !errors.bio
})
</script>
