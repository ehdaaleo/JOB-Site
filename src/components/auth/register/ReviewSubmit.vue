<template>
  <div class="space-y-5">
    <!-- Review summary container -->
    <div class="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-4">
      <!-- Account info review container -->
      <div>
        <h3 class="text-sm font-medium text-gray-900">Account Information</h3>
        <dl class="mt-2 space-y-1 text-sm text-gray-700">
          <div class="flex">
            <dt class="w-32 font-medium">Name:</dt>
            <dd>{{ form.name }}</dd>
          </div>
          <div class="flex">
            <dt class="w-32 font-medium">Email:</dt>
            <dd>{{ form.email }}</dd>
          </div>
        </dl>
      </div>

      <!-- Dynamic info review container based on role -->
      <div class="border-t border-gray-200 pt-4">
        <h3 class="text-sm font-medium text-gray-900">{{ reviewTitle }}</h3>
        <dl class="mt-2 space-y-1 text-sm text-gray-700">
          <!-- Candidate fields -->
          <template v-if="role === 'candidate'">
            <div class="flex">
              <dt class="w-32 font-medium">Headline:</dt>
              <dd>{{ form.headline }}</dd>
            </div>
            <div class="flex">
              <dt class="w-32 font-medium">Skills:</dt>
              <dd>{{ form.skills }}</dd>
            </div>
            <div class="flex">
              <dt class="w-32 font-medium">Experience:</dt>
              <dd>{{ getExperienceLabel(form.experience) }}</dd>
            </div>
          </template>

          <!-- Individual employer fields -->
          <template v-else-if="role === 'employer' && employerType === 'individual'">
            <div class="flex">
              <dt class="w-32 font-medium">Organization:</dt>
              <dd>{{ form.organization }}</dd>
            </div>
            <div class="flex">
              <dt class="w-32 font-medium">Job Title:</dt>
              <dd>{{ form.jobTitle }}</dd>
            </div>
            <div class="flex">
              <dt class="w-32 font-medium">Industry:</dt>
              <dd>{{ getIndustryLabel(form.industry) }}</dd>
            </div>
          </template>

          <!-- Company employer fields -->
          <template v-else-if="role === 'employer' && employerType === 'company'">
            <div class="flex">
              <dt class="w-32 font-medium">Company:</dt>
              <dd>{{ form.companyName }}</dd>
            </div>
            <div v-if="form.companyWebsite" class="flex">
              <dt class="w-32 font-medium">Website:</dt>
              <dd class="truncate">{{ form.companyWebsite }}</dd>
            </div>
            <div class="flex">
              <dt class="w-32 font-medium">Size:</dt>
              <dd>{{ getCompanySizeLabel(form.companySize) }}</dd>
            </div>
            <div class="flex">
              <dt class="w-32 font-medium">Industry:</dt>
              <dd>{{ getIndustryLabel(form.industry) }}</dd>
            </div>
          </template>
        </dl>
      </div>

      <!-- Logo review container (for company employers) -->
      <div v-if="logoPreview && role === 'employer' && employerType === 'company'" class="border-t border-gray-200 pt-4">
        <h3 class="text-sm font-medium text-gray-900">Company Logo</h3>
        <div class="mt-2">
          <img
            :src="logoPreview"
            alt="Company logo"
            class="h-20 w-20 object-contain rounded"
          />
        </div>
      </div>
    </div>

    <!-- Terms acceptance container -->
    <div class="flex items-start">
      <input
        id="terms"
        v-model="acceptedTerms"
        type="checkbox"
        class="mt-1 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
        :class="{ 'border-red-500': error }"
        @change="clearError"
      />
      <label for="terms" class="ml-2 block text-sm text-gray-900">
        I agree to the
        <a href="#" class="text-violet-600 hover:text-violet-500">Terms of Service</a>
        and
        <a href="#" class="text-violet-600 hover:text-violet-500">Privacy Policy</a>
      </label>
    </div>
    <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

    <!-- Email verification reminder container -->
    <div class="rounded-md bg-yellow-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            <strong>Important:</strong> Please check your email after registration and click the verification link to activate your account.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  employerType: {
    type: String,
    default: null
  },
  logoPreview: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:acceptedTerms', 'validate'])

const error = ref('')

const acceptedTerms = computed({
  get: () => props.form.acceptedTerms,
  set: (value) => emit('update:acceptedTerms', value)
})

const reviewTitle = computed(() => {
  if (props.role === 'candidate') return 'Candidate Profile'
  if (props.employerType === 'company') return 'Company Information'
  return 'Professional Information'
})

const getExperienceLabel = (value) => {
  const labels = {
    '0-1': '0-1 years (Entry level)',
    '1-3': '1-3 years (Junior)',
    '3-5': '3-5 years (Mid-level)',
    '5-10': '5-10 years (Senior)',
    '10+': '10+ years (Expert)'
  }
  return labels[value] || value
}

const getCompanySizeLabel = (value) => {
  const labels = {
    '1-10': '1-10 employees',
    '11-50': '11-50 employees',
    '51-200': '51-200 employees',
    '201-500': '201-500 employees',
    '501-1000': '501-1000 employees',
    '1000+': '1000+ employees'
  }
  return labels[value] || value
}

const getIndustryLabel = (value) => {
  const labels = {
    'technology': 'Technology',
    'finance': 'Finance',
    'healthcare': 'Healthcare',
    'education': 'Education',
    'retail': 'Retail',
    'manufacturing': 'Manufacturing',
    'services': 'Services',
    'other': 'Other'
  }
  return labels[value] || value
}

const validateTerms = () => {
  if (!props.form.acceptedTerms) {
    error.value = 'You must accept the terms and conditions to continue'
    return false
  }
  error.value = ''
  return true
}

const clearError = () => {
  error.value = ''
}

defineExpose({
  validateTerms,
  error
})
</script>
