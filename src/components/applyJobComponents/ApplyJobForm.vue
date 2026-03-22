<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  jobId: {
    type: [String, Number],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

// Form data
const form = ref({
  candidate_name: '',
  email: '',
  phone: '',
  cover_letter: '',
  resume: ''
})

// Track touched fields for validation UX
const touched = ref({
  candidate_name: false,
  email: false,
  phone: false,
  cover_letter: false,
  resume: false
})

// Validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => {
  const e = {}
  if (touched.value.candidate_name && !form.value.candidate_name.trim()) {
    e.candidate_name = 'Full name is required'
  }
  if (touched.value.email) {
    if (!form.value.email.trim()) {
      e.email = 'Email is required'
    } else if (!emailRegex.test(form.value.email)) {
      e.email = 'Please enter a valid email address'
    }
  }
  if (touched.value.phone && !form.value.phone.trim()) {
    e.phone = 'Phone number is required'
  }
  if (touched.value.cover_letter && !form.value.cover_letter.trim()) {
    e.cover_letter = 'Cover letter is required'
  }
  if (touched.value.resume && !form.value.resume) {
    e.resume = 'Please upload your resume'
  }
  return e
})

const isFormValid = computed(() => {
  return (
    form.value.candidate_name.trim() &&
    form.value.email.trim() &&
    emailRegex.test(form.value.email) &&
    form.value.phone.trim() &&
    form.value.cover_letter.trim() &&
    form.value.resume
  )
})

// File handler – captures filename only
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.resume = file.name
  } else {
    form.value.resume = ''
  }
  touched.value.resume = true
}

const markTouched = (field) => {
  touched.value[field] = true
}

const handleSubmit = () => {
  // Mark all fields as touched
  Object.keys(touched.value).forEach(k => (touched.value[k] = true))

  if (!isFormValid.value) return

  emit('submit', {
    candidate_name: form.value.candidate_name.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim(),
    job_id: Number(props.jobId),
    cover_letter: form.value.cover_letter.trim(),
    resume: form.value.resume
  })
}
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="apply-form bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in-up"
    style="animation-delay: 0.1s;"
  >
    <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2" style="font-family: 'Syne', sans-serif;">
      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      Application Details
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Candidate Name -->
      <div class="form-group">
        <label for="candidate_name" class="form-label">Full Name <span class="text-red-500">*</span></label>
        <div class="form-input-wrap">
          <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <input
            id="candidate_name"
            v-model="form.candidate_name"
            @blur="markTouched('candidate_name')"
            type="text"
            placeholder="e.g. John Doe"
            class="form-input"
            :class="{ 'form-input-error': errors.candidate_name }"
          />
        </div>
        <p v-if="errors.candidate_name" class="form-error">{{ errors.candidate_name }}</p>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">Email Address <span class="text-red-500">*</span></label>
        <div class="form-input-wrap">
          <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          <input
            id="email"
            v-model="form.email"
            @blur="markTouched('email')"
            type="email"
            placeholder="john@example.com"
            class="form-input"
            :class="{ 'form-input-error': errors.email }"
          />
        </div>
        <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div class="form-group">
        <label for="phone" class="form-label">Phone Number <span class="text-red-500">*</span></label>
        <div class="form-input-wrap">
          <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          <input
            id="phone"
            v-model="form.phone"
            @blur="markTouched('phone')"
            type="tel"
            placeholder="+1 (555) 000-0000"
            class="form-input"
            :class="{ 'form-input-error': errors.phone }"
          />
        </div>
        <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
      </div>

      <!-- Job ID (read-only) -->
      <div class="form-group">
        <label for="job_id" class="form-label">Job ID</label>
        <div class="form-input-wrap">
          <svg class="form-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
          <input
            id="job_id"
            :value="jobId"
            type="text"
            readonly
            class="form-input bg-slate-50 text-slate-500 cursor-not-allowed"
          />
        </div>
      </div>
    </div>

    <!-- Cover Letter -->
    <div class="form-group mt-5">
      <label for="cover_letter" class="form-label">Cover Letter <span class="text-red-500">*</span></label>
      <textarea
        id="cover_letter"
        v-model="form.cover_letter"
        @blur="markTouched('cover_letter')"
        rows="5"
        placeholder="Tell us why you're interested in this role and what makes you a great fit..."
        class="form-textarea"
        :class="{ 'form-input-error': errors.cover_letter }"
      ></textarea>
      <p v-if="errors.cover_letter" class="form-error">{{ errors.cover_letter }}</p>
    </div>

    <!-- Resume Upload -->
    <div class="form-group mt-5">
      <label for="resume" class="form-label">Resume <span class="text-red-500">*</span></label>
      <div
        class="file-drop-area"
        :class="{ 'file-drop-error': errors.resume, 'file-drop-filled': form.resume }"
      >
        <input
          id="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          @change="handleFileChange"
          class="file-input-hidden"
        />
        <div v-if="!form.resume" class="file-placeholder">
          <svg class="w-8 h-8 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
          <span class="text-sm text-slate-500 font-medium">Click to upload or drag & drop</span>
          <span class="text-xs text-slate-400 mt-0.5">PDF, DOC, DOCX (max 10 MB)</span>
        </div>
        <div v-else class="file-selected">
          <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-sm text-slate-700 font-medium">{{ form.resume }}</span>
        </div>
      </div>
      <p v-if="errors.resume" class="form-error">{{ errors.resume }}</p>
    </div>

    <!-- Submit Button -->
    <div class="mt-8">
      <button
        type="submit"
        :disabled="!isFormValid || loading"
        class="submit-btn"
        :class="{ 'submit-btn-disabled': !isFormValid || loading }"
      >
        <template v-if="loading">
          <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Sending...
        </template>
        <template v-else>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          Submit Application
        </template>
      </button>
    </div>
  </form>
</template>

<style scoped>
.apply-form {
  font-family: 'DM Sans', sans-serif;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.375rem;
  letter-spacing: 0.01em;
}

.form-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.form-icon {
  position: absolute;
  left: 0.875rem;
  width: 1.125rem;
  height: 1.125rem;
  color: #94a3b8;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.5rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #1e293b;
  background: #fff;
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.form-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-input-error {
  border-color: #ef4444 !important;
}

.form-input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: #1e293b;
  background: #fff;
  transition: all 0.2s ease;
  outline: none;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  line-height: 1.6;
}

.form-textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea::placeholder {
  color: #94a3b8;
}

.form-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* File upload area */
.file-drop-area {
  position: relative;
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  background: #fafbfc;
}

.file-drop-area:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.file-drop-error {
  border-color: #ef4444 !important;
}

.file-drop-filled {
  border-color: #10b981;
  border-style: solid;
  background: #f0fdf4;
}

.file-input-hidden {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.file-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Submit button */
.submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8125rem 1.5rem;
  background: #2563eb;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn-disabled {
  opacity: 0.55;
  cursor: not-allowed !important;
  transform: none !important;
}

/* Responsive: stack grid on mobile */
@media (min-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: 1fr;
}

.gap-5 {
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
