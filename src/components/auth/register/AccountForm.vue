<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Account Information</h2>

    <!-- Full name field container -->
    <div>
      <label for="name" class="block text-sm font-medium text-gray-900">Full name</label>
      <div class="mt-1">
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="John Doe"
        />
      </div>
    </div>

    <!-- Email address field container -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-900">Email address</label>
      <div class="mt-1">
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="you@example.com"
        />
      </div>
      <p class="mt-1 text-xs text-gray-600">A verification email will be sent to this address</p>
    </div>

    <!-- Password field container -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
      <div class="mt-1">
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        />
      </div>
      <PasswordStrength :password="form.password" class="mt-2" />
    </div>

    <!-- Confirm password field container -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-900">Confirm password</label>
      <div class="mt-1">
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        />
      </div>
      <p v-if="passwordMismatch" class="mt-1 text-sm text-red-600">Passwords do not match</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PasswordStrength from '../PasswordStrength.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const passwordMismatch = computed(() => {
  return props.form.confirmPassword && props.form.password !== props.form.confirmPassword
})

defineExpose({ passwordMismatch })
</script>
