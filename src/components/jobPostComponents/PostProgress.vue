<script setup>
defineProps({
  currentStep: Number,
  steps: Array
})
const emit = defineEmits(['updateStep'])
</script>

<template>
  <div class="shrink-0 flex flex-col">
    <div class="h-[3px] bg-slate-200 w-full overflow-hidden">
      <div 
        class="h-full bg-blue-600 transition-all duration-400 ease-out" 
        :style="{ width: ((currentStep + 1) / steps.length * 100) + '%' }"
      ></div>
    </div>
    <div class="flex px-7 bg-white border-b border-slate-200 overflow-x-auto hide-scrollbar">
      <div
        v-for="(step, i) in steps"
        :key="i"
        class="flex items-center gap-2 px-6 py-4 text-[15px] font-semibold whitespace-nowrap border-b-2 transition-all duration-200 select-none"
        :class="{
          'text-blue-600 border-blue-600': currentStep === i,
          'text-green-600 border-transparent cursor-pointer': currentStep > i,
          'text-slate-400 border-transparent cursor-default': currentStep < i
        }"
        @click="currentStep > i && emit('updateStep', i)"
      >
        <div 
          class="w-[24px] h-[24px] rounded-full text-[13px] font-bold flex items-center justify-center transition-all duration-200"
          :class="{
            'bg-blue-50 text-blue-600 border border-blue-100': currentStep === i,
            'bg-green-50 text-green-600 border border-green-200': currentStep > i,
            'bg-slate-200 text-slate-400': currentStep < i
          }"
        >
          {{ currentStep > i ? '✓' : i + 1 }}
        </div>
        {{ step.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
