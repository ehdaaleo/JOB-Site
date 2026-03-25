<template>
  <div class="space-y-1">
    <div class="flex items-center gap-1">
      <div
        v-for="(segment, index) in segments"
        :key="index"
        class="h-1 flex-1 rounded-full transition-colors"
        :class="getSegmentClass(index)"
      ></div>
    </div>
    <ul class="text-xs space-y-1">
      <li :class="getRequirementClass(requirements.length)">
        <span class="inline-block w-2 h-2 rounded-full mr-2" :class="getRequirementDotClass(0)"></span>
        At least 8 characters
      </li>
      <li :class="getRequirementClass(requirements.length)">
        <span class="inline-block w-2 h-2 rounded-full mr-2" :class="getRequirementDotClass(1)"></span>
        One uppercase letter
      </li>
      <li :class="getRequirementClass(requirements.length)">
        <span class="inline-block w-2 h-2 rounded-full mr-2" :class="getRequirementDotClass(2)"></span>
        One number
      </li>
      <li :class="getRequirementClass(requirements.length)">
        <span class="inline-block w-2 h-2 rounded-full mr-2" :class="getRequirementDotClass(3)"></span>
        One special character
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  password: {
    type: String,
    required: true
  }
})

const requirements = computed(() => {
  const reqs = []
  if (props.password.length >= 8) reqs.push(true)
  if (/[A-Z]/.test(props.password)) reqs.push(true)
  if (/[0-9]/.test(props.password)) reqs.push(true)
  if (/[!@#$%^&*(),.?":{}|<>]/.test(props.password)) reqs.push(true)
  return reqs
})

const segments = computed(() => {
  const count = requirements.value.length
  if (count === 0) return [false, false, false, false]
  if (count <= 1) return [true, false, false, false]
  if (count <= 2) return [true, true, false, false]
  if (count <= 3) return [true, true, true, false]
  return [true, true, true, true]
})

const getSegmentClass = (index) => {
  const count = requirements.value.length
  if (count === 0) return 'bg-gray-200'
  if (count <= 1) return index === 0 ? 'bg-red-500' : 'bg-gray-200'
  if (count <= 2) return index < 2 ? 'bg-yellow-500' : 'bg-gray-200'
  if (count <= 3) return index < 3 ? 'bg-blue-500' : 'bg-gray-200'
  return 'bg-green-500'
}

const getRequirementClass = (count) => {
  return count >= 4 ? 'text-green-600' : 'text-gray-500'
}

const getRequirementDotClass = (index) => {
  if (index < requirements.value.length) {
    const count = requirements.value.length
    if (count <= 1) return 'bg-red-500'
    if (count <= 2) return 'bg-yellow-500'
    if (count <= 3) return 'bg-blue-500'
    return 'bg-green-500'
  }
  return 'bg-gray-200'
}
</script>
