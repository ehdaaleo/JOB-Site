<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Account Information</h2>

    <!-- Full name field -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-900">Full name <span class="text-red-500">*</span></label>
      <div class="mt-1">
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.name ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="John Doe"
          @blur="validateName"
          @input="clearError('name')"
          aria-invalid="errors.name ? 'true' : 'false'"
          :aria-describedby="errors.name ? 'name-error' : undefined"
        />
      </div>
      <p v-if="errors.name" id="name-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.name }}</p>
    </div>

    <!-- Email address field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-900">Email address <span class="text-red-500">*</span></label>
      <div class="relative mt-1">
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.email ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          placeholder="you@example.com"
          @blur="validateEmail"
          @input="clearError('email')"
          aria-invalid="errors.email ? 'true' : 'false'"
          :aria-describedby="errors.email ? 'email-error' : undefined"
        />
        <!-- Loading spinner -->
        <svg v-if="isCheckingEmail" class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p class="mt-1 text-xs text-gray-600">A verification email will be sent to this address</p>
      <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.email }}</p>
    </div>

    <!-- Password field -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-900">Password <span class="text-red-500">*</span></label>
      <div class="relative">
        <input
          id="password"
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          class="block w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.password ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          @blur="validatePassword"
          @input="clearError('password')"
          aria-invalid="errors.password ? 'true' : 'false'"
          :aria-describedby="errors.password ? 'password-error' : undefined"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
      <PasswordStrength :password="form.password" class="mt-2" />
      <p v-if="errors.password" id="password-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.password }}</p>
    </div>

    <!-- Confirm password field -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-900">Confirm password <span class="text-red-500">*</span></label>
      <div class="relative">
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          class="block w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          :class="errors.confirmPassword ? 'border-red-500 focus:outline-red-600' : 'border-gray-300 focus:outline-indigo-600'"
          @blur="validateConfirmPassword"
          @input="clearError('confirmPassword')"
          aria-invalid="errors.confirmPassword ? 'true' : 'false'"
          :aria-describedby="errors.confirmPassword ? 'confirmPassword-error' : undefined"
        />
        <button
          type="button"
          @click="showConfirmPassword = !showConfirmPassword"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
        >
          <svg v-if="showConfirmPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>
      <p v-if="errors.confirmPassword" id="confirmPassword-error" class="mt-1 text-sm text-red-600" role="alert">{{ errors.confirmPassword }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import PasswordStrength from '../PasswordStrength.vue'
import { authApi } from '@/services/auth'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['validated'])

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isCheckingEmail = ref(false)
const emailAlreadyExists = ref(false)

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const nameRegex = /^[\p{L}][\p{L} \-]{1,49}$/u
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validateName = () => {
  if (!props.form.name || props.form.name.trim() === '') {
    errors.name = 'Full name is required'
    return false
  }
  if (props.form.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters'
    return false
  }
  if (props.form.name.trim().length > 50) {
    errors.name = 'Name must not exceed 50 characters'
    return false
  }
  if (!nameRegex.test(props.form.name)) {
    errors.name = 'Name can only contain letters, spaces, and hyphens'
    return false
  }
  if (/  +/.test(props.form.name)) {
    errors.name = 'Name cannot contain consecutive spaces'
    return false
  }
  if (/--/.test(props.form.name)) {
    errors.name = 'Name cannot contain consecutive hyphens'
    return false
  }
  if (/^[ \-]|[ \-]$/.test(props.form.name)) {
    errors.name = 'Name cannot start or end with a space or hyphen'
    return false
  }
  errors.name = ''
  return true
}

const validateEmail = async () => {
  if (!props.form.email || props.form.email.trim() === '') {
    errors.email = 'Email address is required'
    return false
  }
  if (!emailRegex.test(props.form.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }
  if (props.form.email.length > 254) {
    errors.email = 'Email address is too long'
    return false
  }
  
  // Check if email already exists on the server
  isCheckingEmail.value = true
  emailAlreadyExists.value = false
  try {
    const exists = await authApi.checkEmailExists(props.form.email)
    if (exists) {
      errors.email = 'This email is already registered. Please use a different email or login.'
      emailAlreadyExists.value = true
      return false
    }
  } catch (error) {
    console.error('Error checking email:', error)
    errors.email = 'Unable to verify email. Please try again.'
    return false
  } finally {
    isCheckingEmail.value = false
  }
  
  errors.email = ''
  return true
}

const validatePassword = () => {
  if (!props.form.password) {
    errors.password = 'Password is required'
    return false
  }
  if (props.form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return false
  }
  if (props.form.password.length > 128) {
    errors.password = 'Password must not exceed 128 characters'
    return false
  }
  if (!/[A-Z]/.test(props.form.password)) {
    errors.password = 'Password must include at least one uppercase letter'
    return false
  }
  if (!/[a-z]/.test(props.form.password)) {
    errors.password = 'Password must include at least one lowercase letter'
    return false
  }
  if (!/[0-9]/.test(props.form.password)) {
    errors.password = 'Password must include at least one number'
    return false
  }
  const specialChars = /[!@#$%^&*(),.?":{}|<>]/
  if (!specialChars.test(props.form.password)) {
    errors.password = 'Password must include at least one special character (!@#$...)'
    return false
  }
  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '1234567',
    'letmein', 'trustno1', 'dragon', 'baseball', 'iloveyou', 'master', 'sunshine',
    'ashley', 'bailey', 'shadow', '123123', '654321', 'superman', 'qazwsx',
    'michael', 'football', 'password1', 'password123', 'welcome', 'welcome1'
  ]
  if (commonPasswords.includes(props.form.password.toLowerCase())) {
    errors.password = 'This password is too common. Please choose a stronger one'
    return false
  }
  errors.password = ''
  return true
}

const validateConfirmPassword = () => {
  if (!props.form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    return false
  }
  if (props.form.password !== props.form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
    return false
  }
  errors.confirmPassword = ''
  return true
}

const clearError = (field) => {
  if (errors[field]) {
    errors[field] = ''
  }
}

// Re-validate confirmPassword when password changes
watch(() => props.form.password, () => {
  if (props.form.confirmPassword) {
    validateConfirmPassword()
  }
})

defineExpose({
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  errors,
  isCheckingEmail,
  isValid: () => !errors.name && !errors.email && !errors.password && !errors.confirmPassword
})
</script>
