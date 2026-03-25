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
            ref="candidateProfileForm"
            :form="form"
            @file-change="handleFileChange"
          />
        </div>

        <!-- Stage 2: Company Details -->
        <div v-if="currentStage === 2 && selectedRole === 'employer' && employerType === 'company'">
          <CompanyDetailsForm
            ref="companyDetailsForm"
            :form="form"
          />
        </div>

        <!-- Stage 2: Individual Employer Details -->
        <div v-if="currentStage === 2 && selectedRole === 'employer' && employerType === 'individual'">
          <IndividualEmployerForm
            ref="individualEmployerForm"
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
            :disabled="isSubmitting || (accountForm?.isCheckingEmail)"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
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

        <!-- Display validation errors -->
        <div v-if="validationErrors.length > 0" class="rounded-md bg-red-50 p-4">
          <p class="text-sm font-medium text-red-800">Please fix the following errors:</p>
          <ul class="mt-2 list-disc list-inside text-sm text-red-700">
            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
          </ul>
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

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

// Stage management
const currentStage = ref(0)
const selectedRole = ref(null)
const employerType = ref(null)
const isSubmitting = ref(false)
const logoPreview = ref(null)
const validationErrors = ref([])

// Form refs for validation
const accountForm = ref(null)
const candidateProfileForm = ref(null)
const companyDetailsForm = ref(null)
const individualEmployerForm = ref(null)
const logoUpload = ref(null)

// Form data
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  employerType: '',
  acceptedTerms: false,
  user_id: null,
  company_name: null,
  company_logo: null,
  phone: '',
  linkedin_profile: '',
  resume: null,
  profile_picture: null,
  bio: '',
  location: '',
  headline: '',
  skills: '',
  experience: '',
  companyWebsite: '',
  companySize: '',
  industry: '',
  companyDescription: '',
  logo: null,
  organization: '',
  jobTitle: ''
})

// Stage definitions
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

// Validation functions
const validateAccountStage = async () => {
  validationErrors.value = []
  const errors = []

  if (!accountForm.value) return true

  const nameValid = accountForm.value.validateName()
  const emailValid = await accountForm.value.validateEmail()
  const passwordValid = accountForm.value.validatePassword()
  const confirmPasswordValid = accountForm.value.validateConfirmPassword()

  if (!nameValid) errors.push(accountForm.value.errors.name)
  if (!emailValid) errors.push(accountForm.value.errors.email)
  if (!passwordValid) errors.push(accountForm.value.errors.password)
  if (!confirmPasswordValid) errors.push(accountForm.value.errors.confirmPassword)

  validationErrors.value = errors.filter(Boolean)
  return validationErrors.value.length === 0
}

const validateCandidateProfileStage = () => {
  validationErrors.value = []
  const errors = []
  
  if (!candidateProfileForm.value) return true
  
  const headlineValid = candidateProfileForm.value.validateHeadline()
  const skillsValid = candidateProfileForm.value.validateSkills()
  const experienceValid = candidateProfileForm.value.validateExperience()
  
  if (!headlineValid) errors.push(candidateProfileForm.value.errors.headline)
  if (!skillsValid) errors.push(candidateProfileForm.value.errors.skills)
  if (!experienceValid) errors.push(candidateProfileForm.value.errors.experience)
  
  validationErrors.value = errors.filter(Boolean)
  return validationErrors.value.length === 0
}

const validateCompanyDetailsStage = () => {
  validationErrors.value = []
  const errors = []
  
  if (!companyDetailsForm.value) return true
  
  const companyNameValid = companyDetailsForm.value.validateCompanyName()
  const companyWebsiteValid = companyDetailsForm.value.validateCompanyWebsite()
  const companySizeValid = companyDetailsForm.value.validateCompanySize()
  const industryValid = companyDetailsForm.value.validateIndustry()
  const companyDescriptionValid = companyDetailsForm.value.validateCompanyDescription()
  
  if (!companyNameValid) errors.push(companyDetailsForm.value.errors.companyName)
  if (!companyWebsiteValid) errors.push(companyDetailsForm.value.errors.companyWebsite)
  if (!companySizeValid) errors.push(companyDetailsForm.value.errors.companySize)
  if (!industryValid) errors.push(companyDetailsForm.value.errors.industry)
  if (!companyDescriptionValid) errors.push(companyDetailsForm.value.errors.companyDescription)
  
  validationErrors.value = errors.filter(Boolean)
  return validationErrors.value.length === 0
}

const validateLogoStage = () => {
  validationErrors.value = []
  const errors = []
  
  if (!logoUpload.value) return true
  
  const logoValid = logoUpload.value.validateLogo()
  
  if (!logoValid) errors.push(logoUpload.value.errors.logo)
  
  validationErrors.value = errors.filter(Boolean)
  return validationErrors.value.length === 0
}

const validateReviewStage = () => {
  validationErrors.value = []
  const errors = []
  
  // Find the ReviewSubmit component (it's rendered conditionally)
  const reviewSubmitRef = currentStage.value === 3 && selectedRole.value === 'employer' && employerType.value === 'company'
    ? logoUpload.value // For company, review is at stage 4
    : null
  
  // For review stage, just check terms acceptance from form
  if (!form.acceptedTerms) {
    errors.push('You must accept the terms and conditions to continue')
  }
  
  validationErrors.value = errors.filter(Boolean)
  return validationErrors.value.length === 0
}

const validateIndividualEmployerStage = () => {
  validationErrors.value = []
  const errors = []
  
  if (!individualEmployerForm.value) return true
  
  const organizationValid = individualEmployerForm.value.validateOrganization()
  const jobTitleValid = individualEmployerForm.value.validateJobTitle()
  const industryValid = individualEmployerForm.value.validateIndustry()
  const bioValid = individualEmployerForm.value.validateBio()
  
  if (!organizationValid) errors.push(individualEmployerForm.value.errors.organization)
  if (!jobTitleValid) errors.push(individualEmployerForm.value.errors.jobTitle)
  if (!industryValid) errors.push(individualEmployerForm.value.errors.industry)
  if (!bioValid) errors.push(individualEmployerForm.value.errors.bio)
  
  validationErrors.value = errors.filter(Boolean)
  return validationErrors.value.length === 0
}

const validateCurrentStage = async () => {
  if (currentStage.value === 1) {
    return await validateAccountStage()
  }

  if (currentStage.value === 2) {
    if (selectedRole.value === 'candidate') {
      return validateCandidateProfileStage()
    } else if (employerType.value === 'company') {
      return validateCompanyDetailsStage()
    } else {
      return validateIndividualEmployerStage()
    }
  }

  if (currentStage.value === 3 && selectedRole.value === 'employer' && employerType.value === 'company') {
    return validateLogoStage()
  }

  if (currentStage.value >= 3) {
    return validateReviewStage()
  }

  return true
}

// Navigation
const nextStage = async () => {
  const isValid = await validateCurrentStage()
  if (isValid) {
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
const handleSubmit = async () => {
  validationErrors.value = []

  // Validate all stages
  let allValid = true

  if (!await validateAccountStage()) {
    allValid = false
  }

  if (selectedRole.value === 'candidate') {
    if (!validateCandidateProfileStage()) {
      allValid = false
    }
  } else if (employerType.value === 'company') {
    if (!validateCompanyDetailsStage()) {
      allValid = false
    }
    if (!validateLogoStage()) {
      allValid = false
    }
  } else {
    if (!validateIndividualEmployerStage()) {
      allValid = false
    }
  }

  if (!validateReviewStage()) {
    allValid = false
  }

  if (!allValid) {
    return
  }

  if (!form.acceptedTerms) {
    validationErrors.value.push('Please accept the terms and conditions')
    return
  }

  if (form.password !== form.confirmPassword) {
    validationErrors.value.push('Passwords do not match')
    return
  }

  form.role = selectedRole.value
  form.employerType = employerType.value

  const { confirmPassword, ...formDataWithoutConfirm } = form

  isSubmitting.value = true
  emit('submit', formDataWithoutConfirm, () => {
    isSubmitting.value = false
  })
}
</script>
