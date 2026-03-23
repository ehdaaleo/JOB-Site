<script setup>
import { ref } from 'vue'

// Registration form state
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'candidate',
  agreeToTerms: false
})

const isLoading = ref(false)
const error = ref('')

// Roles
const roles = [
  { value: 'candidate', label: 'Job Seeker', description: 'Looking for my dream job' },
  { value: 'employer', label: 'Employer', description: 'Hiring talent for my company' }
]

// Handle registration
const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (!form.value.agreeToTerms) {
    error.value = 'Please agree to the terms and conditions'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  // In production: call registration API
  setTimeout(() => {
    isLoading.value = false
    console.log('Register:', form.value)
  }, 1500)
}
</script>

<template>
  <div class="register-view">
    <div class="register-container">
      <!-- Header -->
      <div class="register-header">
        <h1>Create Account</h1>
        <p>Join our job platform today</p>
      </div>

      <!-- Role Selection -->
      <div class="role-selection">
        <label 
          v-for="role in roles" 
          :key="role.value"
          class="role-option"
          :class="{ active: form.role === role.value }"
        >
          <input 
            type="radio" 
            :value="role.value" 
            v-model="form.role"
            class="role-radio"
          />
          <div class="role-content">
            <span class="role-label">{{ role.label }}</span>
            <span class="role-description">{{ role.description }}</span>
          </div>
        </label>
      </div>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            id="name"
            v-model="form.name"
            type="text" 
            placeholder="Enter your full name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            id="email"
            v-model="form.email"
            type="email" 
            placeholder="Enter your email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="form.password"
            type="password" 
            placeholder="Create a password"
            required
            minlength="8"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password" 
            placeholder="Confirm your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="terms-checkbox">
          <input 
            type="checkbox" 
            id="terms"
            v-model="form.agreeToTerms"
          />
          <label for="terms">
            I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        <button type="submit" class="register-btn" :disabled="isLoading">
          <span v-if="isLoading">Creating Account...</span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <!-- Login Link -->
      <p class="login-link">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 100%);
}

.register-container {
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 8px;
}

.register-header p {
  font-size: 15px;
  color: #6B7280;
  margin: 0;
}

.role-selection {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.role-option {
  flex: 1;
  padding: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-option:hover {
  border-color: #4F46E5;
}

.role-option.active {
  border-color: #4F46E5;
  background: rgba(79, 70, 229, 0.05);
}

.role-radio {
  display: none;
}

.role-content {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.role-label {
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.role-description {
  font-size: 12px;
  color: #6B7280;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #4F46E5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  color: #DC2626;
  border-radius: 8px;
  font-size: 14px;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
}

.terms-checkbox input {
  width: 18px;
  height: 18px;
  accent-color: #4F46E5;
}

.terms-checkbox label {
  font-size: 13px;
  color: #6B7280;
}

.terms-checkbox a {
  color: #4F46E5;
}

.register-btn {
  padding: 14px;
  background: #4F46E5;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-btn:hover:not(:disabled) {
  background: #4338CA;
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6B7280;
}

.login-link a {
  color: #4F46E5;
  font-weight: 600;
}
</style>
