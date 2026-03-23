<template>
  <div class="space-y-5">
    <div>
      <label class="block text-sm font-medium text-gray-900">Upload company logo</label>
      <div class="mt-2">
        <div
          class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10 text-center hover:border-gray-400"
          :class="{ 'border-violet-500 bg-violet-50': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            @change="handleFileSelect"
          />

          <!-- Logo preview container -->
          <div v-if="logoPreview" class="mb-4">
            <img
              :src="logoPreview"
              alt="Logo preview"
              class="mx-auto h-32 w-32 object-contain rounded-lg"
            />
          </div>

          <!-- Upload icon and text -->
          <div v-else class="text-center">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-700">
              <span class="font-medium text-violet-600">Click to upload</span> or drag and drop
            </p>
            <p class="mt-1 text-xs text-gray-600">PNG, JPG, GIF up to 2MB</p>
          </div>
        </div>

        <!-- File info container -->
        <div v-if="form.logo" class="mt-2 flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
          <span class="text-sm text-gray-700">{{ form.logo.name }}</span>
          <button
            type="button"
            @click="removeLogo"
            class="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Email verification notice container -->
    <div class="rounded-md bg-blue-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Email Verification Required</h3>
          <p class="mt-1 text-sm text-blue-700">
            After registration, you'll need to verify your email address before you can post jobs or access all features.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['file-change', 'remove'])

const isDragging = ref(false)
const fileInput = ref(null)
const logoPreview = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    handleFile(file)
  } else {
    alert('Please drop an image file')
  }
}

const handleFile = (file) => {
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    alert('File size must be less than 2MB')
    return
  }
  emit('file-change', file, 'logo')
  logoPreview.value = URL.createObjectURL(file)
}

const removeLogo = () => {
  emit('remove', 'logo')
  logoPreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

defineExpose({ logoPreview })
</script>
