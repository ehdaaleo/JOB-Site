<script setup>
const props = defineProps({
  currentStep: Number,
  steps: Array,
  submitting: Boolean
})
const emit = defineEmits(['next', 'back', 'submit'])
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
        class="bg-blue-600 text-white border-none px-[28px] py-[10px] rounded-lg text-[16px] font-bold hover:bg-blue-700 hover:-translate-y-px transition-all duration-200 shadow-md"
        @click="emit('next')"
      >
        Continue →
      </button>
      
      <button
        v-else
        type="button"
        class="bg-blue-600 text-white border-none px-[28px] py-[10px] rounded-lg text-[16px] font-bold hover:bg-blue-700 hover:-translate-y-px transition-all duration-200 min-w-[130px] flex items-center justify-center shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        :disabled="submitting"
        @click="emit('submit')"
      >
        <span v-if="!submitting" class="flex gap-1.5 items-center"> Post Job</span>
        <span v-else class="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      </button>
    </div>
  </div>
</template>
