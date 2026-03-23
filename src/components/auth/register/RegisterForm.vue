<template>
  <div class="w-full">
    <!-- Role Selection Stage -->
    <div v-if="currentStage === 0" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Create Your Account</h2>
        <p class="mt-2 text-sm text-gray-600">Choose how you want to use our platform</p>
      </div>

      <!-- Role selection cards -->
      <RoleSelection v-model="selectedRole" @select="selectRole" />

      <!-- Continue button -->
      <div class="flex justify-center pt-4">
        <button
          @click="proceedFromRoleSelection"
          :disabled="!selectedRole"
          class="rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>

    <!-- Employer Type Selection -->
    <div v-if="currentStage === 0.5" class="space-y-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Employer Type</h2>
        <p class="mt-2 text-sm text-gray-600">Are you registering as a company or individual?</p>
      </div>

      <!-- Employer type cards -->
      <EmployerTypeSelection v-model="employerType" @select="selectEmployerType" />

      <!-- Navigation buttons -->
      <div class="flex justify-between pt-4">
        <button
          @click="goBackToRole"
          class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          @click="proceedFromEmployerType"
          :disabled="!employerType"
          class="rounded-md bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>

    <!-- Main Registration Form -->
    <div v-if="currentStage >= 1">
      <!-- Progress indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <template v-for="(stage, index) in currentStages" :key="stage.id">
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-colors',
                  currentStage > index + 1
                    ? 'bg-blue-600 text-white'
                    : currentStage === index + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                ]"
              >
                <span v-if="currentStage > index + 1">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span
                :class="[
                  'mt-2 text-xs font-medium',
                  currentStage >= index + 1 ? 'text-blue-600' : 'text-gray-500'
                ]"
              >
                {{ stage.name }}
              </span>
            </div>
            <!-- Connector line -->
            <div
              v-if="index < currentStages.length - 1"
              :class="[
                'mx-2 h-1 flex-1 rounded',
                currentStage > index + 1 ? 'bg-blue-600' : 'bg-gray-200'
              ]"
            />
          </template>
        </div>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <!-- Stage 1: Account Information -->
        <AccountForm
          v-if="currentStage === 1"
          ref="accountForm"
          :form="form"
        />

        <!-- Stage 2: Candidate Profile -->
        <div v-if="currentStage === 2 && selectedRole === 'candidate'">
          <CandidateProfileForm
            :form="form"
            @file-change="handleFileChange"
          />
        </div>

        <!-- Stage 2: Company Details -->
        <div v-if="currentStage === 2 && selectedRole === 'employer' && employerType === 'company'">
          <CompanyDetailsForm
            :form="form"
          />
        </div>

        <!-- Stage 2: Individual Employer Details -->
        <div v-if="currentStage === 2 && selectedRole === 'employer' && employerType === 'individual'">
          <IndividualEmployerForm
            :form="form"
          />
        </div>

        <!-- Stage 3: Logo Upload (Company employers only) -->
        <div v-if="currentStage === 3 && selectedRole === 'employer' && employerType === 'company'">
          <LogoUpload
            ref="logoUpload"
            :form="form"
            @file-change="handleFileChange"
            @remove="handleFileRemove"
          />
        </div>

        <!-- Stage 3: Review & Submit (Candidates & Individual Employers) -->
        <div v-if="currentStage === 3 && (selectedRole === 'candidate' || (selectedRole === 'employer' && employerType === 'individual'))">
          <ReviewSubmit
            :form="form"
            :role="selectedRole"
            :employer-type="employerType"
            @update:acceptedTerms="form.acceptedTerms = $event"
          />
        </div>

        <!-- Stage 4: Review & Submit (Company Employers) -->
        <div v-if="currentStage === 4 && selectedRole === 'employer' && employerType === 'company'">
          <ReviewSubmit
            :form="form"
            :role="selectedRole"
            :employer-type="employerType"
            :logo-preview="logoPreview"
            @update:acceptedTerms="form.acceptedTerms = $event"
          />
        </div>

        <!-- Navigation buttons -->
        <div class="flex justify-between pt-4">
          <button
            v-if="currentStage > 1"
            type="button"
            @click="prevStage"
            class="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 transition-colors"
          >
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="currentStage < currentStages.length"
            type="button"
            @click="nextStage"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
          >
            Next
          </button>

          <button
            v-else
            type="submit"
            :disabled="!form.acceptedTerms || isSubmitting"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {{ isSubmitting ? 'Creating Account...' : 'Create Account' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import RoleSelection from './RoleSelection.vue'
import EmployerTypeSelection from './EmployerTypeSelection.vue'
import AccountForm from './AccountForm.vue'
import CandidateProfileForm from './CandidateProfileForm.vue'
import CompanyDetailsForm from './CompanyDetailsForm.vue'
import IndividualEmployerForm from './IndividualEmployerForm.vue'
import LogoUpload from './LogoUpload.vue'
import ReviewSubmit from './ReviewSubmit.vue'
import SocialAuthButtons from '../SocialAuthButtons.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

// Stage management
const currentStage = ref(0) // 0 = role selection, 0.5 = employer type, 1+ = main form
const selectedRole = ref(null) // 'candidate' or 'employer'
const employerType = ref(null) // 'company' or 'individual'
const isSubmitting = ref(false)
const logoPreview = ref(null)

// Form data - matches ERD User entity fields
const form = reactive({
  // Common fields (from ERD User entity)
  name: '',
  email: '',
  password: '',
  confirmPassword: '', // UI only, not stored in DB
  role: '', // 'candidate' or 'employer'
  employerType: '', // 'company' or 'individual' (for employers only)
  acceptedTerms: false, // UI only, not stored in DB

  // ERD User fields
  user_id: null, // Auto-generated by DB
  company_name: null,
  company_logo: null,
  phone: '',
  linkedin_profile: '',
  resume: null,
  profile_picture: null,
  bio: '',
  location: '',

  // Candidate/Freelancer specific fields
  headline: '',
  skills: '',
  experience: '',

  // Company employer fields
  companyWebsite: '',
  companySize: '',
  industry: '',
  companyDescription: '',
  logo: null,

  // Individual employer fields
  organization: '',
  jobTitle: ''
})

// Stage definitions for each registration type
const candidateStages = [
  { id: 'account', name: 'Account' },
  { id: 'profile', name: 'Profile' },
  { id: 'review', name: 'Review' }
]

const companyStages = [
  { id: 'account', name: 'Account' },
  { id: 'company', name: 'Company' },
  { id: 'logo', name: 'Logo' },
  { id: 'review', name: 'Review' }
]

const individualStages = [
  { id: 'account', name: 'Account' },
  { id: 'professional', name: 'Professional' },
  { id: 'review', name: 'Review' }
]

const currentStages = computed(() => {
  if (selectedRole.value === 'candidate') {
    return candidateStages
  } else if (selectedRole.value === 'employer') {
    return employerType.value === 'company' ? companyStages : individualStages
  }
  return []
})

// Selection handlers
const selectRole = (role) => {
  selectedRole.value = role
}

const selectEmployerType = (type) => {
  employerType.value = type
}

const proceedFromRoleSelection = () => {
  if (!selectedRole.value) return
  currentStage.value = selectedRole.value === 'employer' ? 0.5 : 1
}

const proceedFromEmployerType = () => {
  if (!employerType.value) return
  currentStage.value = 1
}

const goBackToRole = () => {
  currentStage.value = 0
  employerType.value = null
}

// Validation
const validateCurrentStage = () => {
  if (currentStage.value === 1) {
    if (!form.name || !form.email || !form.password) {
      alert('Please fill in all required fields')
      return false
    }
    if (form.confirmPassword && form.password !== form.confirmPassword) {
      alert('Passwords do not match')
      return false
    }
  }

  if (currentStage.value === 2) {
    if (selectedRole.value === 'candidate') {
      if (!form.headline || !form.skills || !form.experience) {
        alert('Please fill in all required profile fields')
        return false
      }
    } else if (employerType.value === 'company') {
      if (!form.companyName || !form.companySize || !form.industry || !form.companyDescription) {
        alert('Please fill in all required company fields')
        return false
      }
    } else {
      if (!form.organization || !form.jobTitle || !form.industry || !form.bio) {
        alert('Please fill in all required professional fields')
        return false
      }
    }
  }

  return true
}

// Navigation
const nextStage = () => {
  if (validateCurrentStage()) {
    currentStage.value++
  }
}

const prevStage = () => {
  if (currentStage.value === 1 && selectedRole.value === 'employer' && employerType.value) {
    goBackToRole()
  } else {
    currentStage.value--
  }
}

// File handling
const handleFileChange = (file, type) => {
  if (type === 'resume') {
    form.resume = file
  } else if (type === 'logo') {
    form.logo = file
    logoPreview.value = URL.createObjectURL(file)
  }
}

const handleFileRemove = (type) => {
  if (type === 'logo') {
    form.logo = null
    logoPreview.value = null
  }
}

// Form submission
const handleSubmit = () => {
  if (!form.acceptedTerms) {
    alert('Please accept the terms and conditions')
    return
  }

  if (form.confirmPassword && form.password !== form.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  form.role = selectedRole.value
  form.employerType = employerType.value

  // Remove confirmPassword before submitting (it's only for UI validation)
  const { confirmPassword, ...formDataWithoutConfirm } = form

  isSubmitting.value = true
  emit('submit', formDataWithoutConfirm)
  isSubmitting.value = false
}
</script>
