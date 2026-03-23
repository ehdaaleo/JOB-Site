<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Professional Information</h2>

    <!-- Organization field container -->
    <div>
      <label for="organization" class="block text-sm font-medium text-gray-900">Organization name</label>
      <div class="mt-1">
        <input
          id="organization"
          v-model="form.organization"
          type="text"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="Your organization or company"
        />
      </div>
    </div>

    <!-- Job title field container -->
    <div>
      <label for="jobTitle" class="block text-sm font-medium text-gray-900">Job title</label>
      <div class="mt-1">
        <input
          id="jobTitle"
          v-model="form.jobTitle"
          type="text"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="e.g., Hiring Manager, HR Director"
        />
      </div>
    </div>

    <!-- Industry field container -->
    <div>
      <label for="industry" class="block text-sm font-medium text-gray-900">Industry</label>
      <div class="mt-1">
        <select
          id="industry"
          v-model="form.industry"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
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
    </div>

    <!-- Bio field container -->
    <div>
      <label for="bio" class="block text-sm font-medium text-gray-900">Short bio</label>
      <div class="mt-1">
        <textarea
          id="bio"
          v-model="form.bio"
          rows="4"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="Tell us about yourself and your hiring needs..."
        />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  form: {
    type: Object,
    required: true
  }
})
</script>
