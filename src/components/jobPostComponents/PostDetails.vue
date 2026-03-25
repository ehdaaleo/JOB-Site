<script setup>
import AIGenerateButton from '@/components/ai/AIGenerateButton.vue'

const props = defineProps({
  modelValue: Object,
  errors: Object
})
const emit = defineEmits(['update:modelValue'])

const addRes = () => props.modelValue.responsibilities.push('')
const removeRes = (i) => props.modelValue.responsibilities.splice(i, 1)

const addReq = () => props.modelValue.requirements.push('')
const removeReq = (i) => props.modelValue.requirements.splice(i, 1)

const addBen = () => props.modelValue.benefits.push('')
const removeBen = (i) => props.modelValue.benefits.splice(i, 1)

const handleAIGenerated = (result) => {
  // Create updated form data with all AI-generated fields
  const updatedForm = { ...props.modelValue }
  
  // Update description
  if (result.description) {
    updatedForm.description = result.description
  }
  
  // Update responsibilities if we have an array
  if (result.responsibilities && Array.isArray(result.responsibilities)) {
    updatedForm.responsibilities = result.responsibilities
  }
  
  // Update requirements if we have an array
  if (result.requirements && Array.isArray(result.requirements)) {
    updatedForm.requirements = result.requirements
  }
  
  // Update benefits if we have an array
  if (result.benefits && Array.isArray(result.benefits)) {
    updatedForm.benefits = result.benefits
  }
  
  // Emit all updates at once
  emit('update:modelValue', updatedForm)
}
</script>

<template>
  <div>
    <h2 class="text-[24px] font-bold text-slate-900 mb-1 leading-tight">Job Details</h2>
    <p class="text-[16px] text-slate-400 mb-[26px] leading-relaxed">Describe the role clearly — good descriptions attract better candidates.</p>
    
    <div class="grid grid-cols-1 gap-[20px]">
      <div class="flex flex-col gap-[6px]">
        <div class="flex items-center justify-between">
          <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Job Description <span class="text-blue-600">*</span></label>
          <AIGenerateButton :job-data="modelValue" @generated="handleAIGenerated" />
        </div>
        <textarea v-model="modelValue.description" rows="4" placeholder="What is this role about? What will the candidate do day-to-day?" class="resize-y w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errors.description }"></textarea>
        <p v-if="errors.description" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.description }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Responsibilities <span class="text-blue-600">*</span></label>
        <div class="flex flex-col gap-[8px]">
          <div v-for="(item, i) in modelValue.responsibilities" :key="i" class="flex items-start gap-[8px]">
            <input v-model="modelValue.responsibilities[i]" placeholder="Lead frontend architecture..." aria-label="Responsibility" class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" />
            <button v-if="modelValue.responsibilities.length > 1" type="button" @click="removeRes(i)" class="w-[42px] h-[42px] bg-red-50 text-red-500 rounded-lg border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          <button type="button" @click="addRes" :disabled="!modelValue.responsibilities[modelValue.responsibilities.length - 1].trim()" class="self-start text-[15px] font-bold text-blue-600 mt-[2px] hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[4px] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Responsibility
          </button>
        </div>
        <p v-if="errors.responsibilities" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.responsibilities }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Requirements <span class="text-blue-600">*</span></label>
        <div class="flex flex-col gap-[8px]">
          <div v-for="(item, i) in modelValue.requirements" :key="i" class="flex items-start gap-[8px]">
            <input v-model="modelValue.requirements[i]" placeholder="3+ years Vue.js experience..." aria-label="Requirement" class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" />
            <button v-if="modelValue.requirements.length > 1" type="button" @click="removeReq(i)" class="w-[42px] h-[42px] bg-red-50 text-red-500 rounded-lg border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          <button type="button" @click="addReq" :disabled="!modelValue.requirements[modelValue.requirements.length - 1].trim()" class="self-start text-[15px] font-bold text-blue-600 mt-[2px] hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[4px] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Requirement
          </button>
        </div>
        <p v-if="errors.requirements" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.requirements }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Benefits</label>
        <div class="flex flex-col gap-[8px]">
          <div v-for="(item, i) in modelValue.benefits" :key="i" class="flex items-start gap-[8px]">
            <input v-model="modelValue.benefits[i]" placeholder="Health insurance, remote work..." aria-label="Benefit" class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" />
            <button v-if="modelValue.benefits.length > 1" type="button" @click="removeBen(i)" class="w-[42px] h-[42px] bg-red-50 text-red-500 rounded-lg border border-red-100 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          <button type="button" @click="addBen" :disabled="!modelValue.benefits[modelValue.benefits.length - 1].trim()" class="self-start text-[15px] font-bold text-blue-600 mt-[2px] hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[4px] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Benefit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
