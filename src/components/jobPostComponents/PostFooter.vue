<script setup>
const props = defineProps({
  currentStep: Number,
  steps: Array,
  submitting: Boolean,
  hideSubmit: Boolean
})
const emit = defineEmits(['next', 'back'])
</script>

<template>
  <div class="flex justify-between items-center px-[32px] py-[16px] bg-white border-t border-slate-200 shrink-0">
    <div class="text-[15px] text-slate-500 font-medium">
      Step <span class="text-blue-600 font-bold">{{ currentStep + 1 }}</span> of {{ steps.length }} ·
      <span class="text-blue-600 font-bold ml-1">{{ steps[currentStep].label }}</span>
    </div>
    
    <div class="flex gap-[12px]">
      <button 
        v-if="currentStep > 0" 
        type="button" 
        class="bg-white border border-slate-300 text-slate-700 px-[24px] py-[10px] rounded-lg text-[16px] font-medium hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
        @click="emit('back')"
      >
        ← Back
      </button>
      
      <button
        v-if="currentStep < steps.length - 1"
        type="button"
        class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 border-none px-[28px] py-[10px] rounded-lg text-[16px] font-bold hover:-translate-y-px transition-all duration-200 shadow-md"
        @click="emit('next')"
      >
        Continue →
      </button>
      
      <span v-else-if="hideSubmit" class="text-[14px] text-slate-400 font-medium px-[28px] py-[10px]">
        Complete payment to post your job
      </span>
    </div>
  </div>
</template>
