<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Company Details</h2>

    <!-- Company name field -->
    <div>
      <label for="companyName" class="block text-sm font-medium text-gray-900">Company name <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="companyName"
          v-model="form.companyName"
          type="text"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.companyName ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="Acme Inc."
          @blur="validateCompanyName"
          @input="clearError('companyName')"
          aria-invalid="errors.companyName ? 'true' : 'false'"
          :aria-describedby="errors.companyName ? 'companyName-error' : undefined"
        />
      </div>
      <p v-if="errors.companyName" id="companyName-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.companyName }}</p>
    </div>

    <!-- Company website field -->
    <div>
      <label for="companyWebsite" class="block text-sm font-medium text-gray-900">Company website</label>
      <div class="mt-1">
        <input
          id="companyWebsite"
          v-model="form.companyWebsite"
          type="url"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.companyWebsite ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="https://www.example.com"
          @blur="validateCompanyWebsite"
          @input="clearError('companyWebsite')"
          aria-invalid="errors.companyWebsite ? 'true' : 'false'"
          :aria-describedby="errors.companyWebsite ? 'companyWebsite-error' : undefined"
        />
      </div>
      <p v-if="errors.companyWebsite" id="companyWebsite-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.companyWebsite }}</p>
    </div>

    <!-- Company size field -->
    <div>
      <label for="companySize" class="block text-sm font-medium text-gray-900">Company size <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <select
          id="companySize"
          v-model="form.companySize"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.companySize ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          @change="validateCompanySize"
          aria-invalid="errors.companySize ? 'true' : 'false'"
          :aria-describedby="errors.companySize ? 'companySize-error' : undefined"
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501-1000">501-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </select>
      </div>
      <p v-if="errors.companySize" id="companySize-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.companySize }}</p>
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

    <!-- Company description field -->
    <div>
      <label for="companyDescription" class="block text-sm font-medium text-gray-900">Company description <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <textarea
          id="companyDescription"
          v-model="form.companyDescription"
          rows="4"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.companyDescription ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="Tell us about your company..."
          @blur="validateCompanyDescription"
          @input="clearError('companyDescription')"
          aria-invalid="errors.companyDescription ? 'true' : 'false'"
          :aria-describedby="errors.companyDescription ? 'companyDescription-error' : undefined"
        />
      </div>
      <p v-if="errors.companyDescription" id="companyDescription-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.companyDescription }}</p>
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
  companyName: '',
  companyWebsite: '',
  companySize: '',
  industry: '',
  companyDescription: ''
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

const validateCompanyName = () => {
  const error = validateText(props.form.companyName, 'Company name', 3, 100)
  errors.companyName = error
  return !error
}

const validateCompanyWebsite = () => {
  if (!props.form.companyWebsite) {
    errors.companyWebsite = ''
    return true
  }
  const urlRegex = /^https?:\/\/.+/i
  if (!urlRegex.test(props.form.companyWebsite)) {
    errors.companyWebsite = 'Please enter a valid URL starting with http:// or https://'
    return false
  }
  errors.companyWebsite = ''
  return true
}

const validateCompanySize = () => {
  if (!props.form.companySize) {
    errors.companySize = 'Please select company size'
    return false
  }
  errors.companySize = ''
  return true
}

const validateIndustry = () => {
  if (!props.form.industry) {
    errors.industry = 'Please select an industry'
    return false
  }
  errors.industry = ''
  return true
}

const validateCompanyDescription = () => {
  const error = validateText(props.form.companyDescription, 'Company description', 3, 2000)
  errors.companyDescription = error
  return !error
}

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

defineExpose({
  validateCompanyName,
  validateCompanyWebsite,
  validateCompanySize,
  validateIndustry,
  validateCompanyDescription,
  errors,
  isValid: () => !errors.companyName && !errors.companyWebsite && !errors.companySize && !errors.industry && !errors.companyDescription
})
</script>
