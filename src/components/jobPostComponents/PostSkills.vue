<script setup>
import { ref } from 'vue'
const props = defineProps({
  modelValue: Object,
  errors: Object
})
const emit = defineEmits(['update:modelValue'])

const techInput = ref('')
const quickTechs = ['Vue.js', 'React', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS', 'AWS', 'Figma']

const addTech = () => {
  const t = techInput.value.trim()
  if (t && !props.modelValue.technologies.includes(t)) {
    props.modelValue.technologies.push(t)
  }
  techInput.value = ''
}

const removeTech = (i) => {
  props.modelValue.technologies.splice(i, 1)
}

const toggleQuickTech = (t) => {
  const index = props.modelValue.technologies.indexOf(t)
  if (index > -1) {
    props.modelValue.technologies.splice(index, 1)
  } else {
    props.modelValue.technologies.push(t)
  }
}
</script>

<template>
  <div>
    <h2 class="text-[24px] font-bold text-slate-900 mb-1 leading-tight">Compensation & Skills</h2>
    <p class="text-[16px] text-slate-400 mb-[26px] leading-relaxed">Set the salary range and required technologies for this role.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Min Salary (USD) <span class="text-blue-600">*</span></label>
        <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 focus-within:border-blue-600 focus-within:ring-[3px] focus-within:ring-blue-600/15 focus-within:bg-white h-[44px]" :class="{ 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/15': errors.salary_min }">
          <span class="px-[14px] bg-blue-50 text-blue-600 font-bold text-[16px] border-r border-slate-200 h-full flex items-center shrink-0">$</span>
          <input v-model.number="modelValue.salary_min" type="number" placeholder="50,000" class="w-full h-full bg-transparent border-none text-slate-900 text-[16px] px-[12px] outline-none placeholder:text-slate-400" />
        </div>
        <p v-if="errors.salary_min" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.salary_min }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Max Salary (USD) <span class="text-blue-600">*</span></label>
        <div class="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 focus-within:border-blue-600 focus-within:ring-[3px] focus-within:ring-blue-600/15 focus-within:bg-white h-[44px]" :class="{ 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/15': errors.salary_max }">
          <span class="px-[14px] bg-blue-50 text-blue-600 font-bold text-[16px] border-r border-slate-200 h-full flex items-center shrink-0">$</span>
          <input v-model.number="modelValue.salary_max" type="number" placeholder="90,000" class="w-full h-full bg-transparent border-none text-slate-900 text-[16px] px-[12px] outline-none placeholder:text-slate-400" />
        </div>
        <p v-if="errors.salary_max" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.salary_max }}</p>
      </div>

      <div class="flex flex-col gap-[6px] md:col-span-2 mt-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Salary Period <span class="text-blue-600">*</span></label>
        <div class="flex flex-wrap gap-[8px]">
          <button
            v-for="period in ['yearly', 'monthly', 'hourly']"
            :key="period"
            type="button"
            class="px-[16px] py-[8px] rounded-full border text-[15px] font-medium transition-all duration-150 capitalize"
            :class="{
              'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_2px_10px_rgba(37,99,235,0.1)]': modelValue.salary_period === period,
              'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-500': modelValue.salary_period !== period
            }"
            @click="modelValue.salary_period = period"
          >{{ period }}</button>
        </div>
        <p v-if="errors.salary_period" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.salary_period }}</p>
      </div>

      <div class="flex flex-col gap-[6px] md:col-span-2 mt-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Required Technologies <span class="text-blue-600">*</span></label>
        <div class="flex gap-[10px]">
          <input
            v-model="techInput"
            type="text"
            placeholder="Type a technology and press Enter"
            @keydown.enter.prevent="addTech"
            class="flex-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400"
            :class="{ 'border-red-400': errors.technologies && modelValue.technologies.length === 0 }"
          />
          <button type="button" @click="addTech" :disabled="!techInput.trim()" class="px-[20px] py-[10px] bg-blue-600 hover:bg-blue-700 text-white border-none rounded-lg text-[15px] font-bold whitespace-nowrap transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed">Add</button>
        </div>
        <p v-if="errors.technologies && modelValue.technologies.length === 0" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.technologies }}</p>
        
        <div class="flex flex-wrap gap-[8px] mt-[6px]">
          <span v-for="(t, i) in modelValue.technologies" :key="i" class="inline-flex items-center gap-[6px] bg-blue-50 border border-blue-100 text-blue-600 px-[12px] py-[4px] rounded-full text-[14px] font-medium">
            {{ t }}
            <button type="button" @click="removeTech(i)" class="bg-transparent border-none text-blue-600 opacity-60 hover:opacity-100 cursor-pointer text-[14px] font-bold p-0 flex items-center justify-center mt-[-1px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-[6px] mt-[10px]">
          <span class="text-[11px] text-slate-500 font-medium mr-[4px]">Quick picks:</span>
          <button
            v-for="t in quickTechs"
            :key="t"
            type="button"
            class="px-[12px] py-[4px] rounded-full border text-[14px] font-medium transition-all duration-150"
            :class="{
              'border-blue-200 bg-blue-50 text-blue-600 shadow-[0_2px_10px_rgba(37,99,235,0.08)]': modelValue.technologies.includes(t),
              'border-slate-200 bg-white text-slate-500 hover:border-blue-600 hover:text-blue-600': !modelValue.technologies.includes(t)
            }"
            @click="toggleQuickTech(t)"
          >{{ t }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
