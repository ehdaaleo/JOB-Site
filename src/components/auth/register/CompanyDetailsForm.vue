<template>
  <div class="space-y-5">
    <h2 class="text-lg font-semibold text-gray-900">Company Details</h2>

    <!-- Company name field container -->
    <div>
      <label for="companyName" class="block text-sm font-medium text-gray-900">Company name</label>
      <div class="mt-1">
        <input
          id="companyName"
          v-model="form.companyName"
          type="text"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="Acme Inc."
        />
      </div>
    </div>

    <!-- Company website field container -->
    <div>
      <label for="companyWebsite" class="block text-sm font-medium text-gray-900">Company website</label>
      <div class="mt-1">
        <input
          id="companyWebsite"
          v-model="form.companyWebsite"
          type="url"
          placeholder="https://www.example.com"
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
        />
      </div>
    </div>

    <!-- Company size field container -->
    <div>
      <label for="companySize" class="block text-sm font-medium text-gray-900">Company size</label>
      <div class="mt-1">
        <select
          id="companySize"
          v-model="form.companySize"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
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

    <!-- Company description field container -->
    <div>
      <label for="companyDescription" class="block text-sm font-medium text-gray-900">Company description</label>
      <div class="mt-1">
        <textarea
          id="companyDescription"
          v-model="form.companyDescription"
          rows="4"
          required
          class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
          placeholder="Tell us about your company..."
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
