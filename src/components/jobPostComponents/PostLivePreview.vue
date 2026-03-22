<script setup>
defineProps({
  form: Object,
  employer: Object,
  steps: Array,
  currentStep: Number,
  getCategoryName: Function
})
</script>

<template>
  <div class="w-[300px] bg-slate-50 p-[24px] shrink-0 flex flex-col gap-[24px] border-l border-slate-200 overflow-y-auto hide-scrollbar">
    
    <div>
      <p class="text-[13px] font-bold text-slate-500 tracking-[1px] uppercase flex items-center gap-[10px] mb-[16px]">
         Live Preview
        <span class="flex-1 h-px bg-slate-200"></span>
      </p>

      <div class="bg-white border border-slate-200 rounded-xl p-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div class="flex items-center gap-[12px] mb-[16px]">
          <img
            v-if="employer.logo"
            :src="employer.logo"
            class="w-[46px] h-[46px] rounded-[10px] object-cover border border-slate-200 p-0.5 shrink-0 bg-white" 
            alt="Logo"
          />
          <div v-else class="w-[46px] h-[46px] rounded-[10px] bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-[18px] flex items-center justify-center shrink-0">
            {{ employer.initials }}
          </div>
          <div class="overflow-hidden">
            <p class="font-bold text-[17px] text-slate-900 mb-[3px] truncate" :class="{ 'text-slate-400 italic font-normal': !form.title }">
              {{ form.title || 'Job title' }}
            </p>
            <p class="text-[14px] text-slate-500 font-medium truncate">{{ employer.name }}</p>
          </div>
        </div>

        <div class="flex gap-[6px] flex-wrap mb-[12px]">
          <span v-if="form.work_type" class="px-[10px] py-[3px] bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-[13px] font-bold tracking-wide">{{ form.work_type }}</span>
          <span v-if="form.experience_level" class="px-[10px] py-[3px] bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-[13px] font-bold tracking-wide">{{ form.experience_level }}</span>
          <span v-if="form.category_id" class="px-[10px] py-[3px] bg-slate-100 text-slate-600 rounded-full text-[13px] font-bold tracking-wide">{{ getCategoryName(form.category_id) }}</span>
          <span v-if="!form.work_type && !form.experience_level" class="px-[10px] py-[3px] bg-slate-100 text-slate-500 rounded-full text-[13px] font-bold tracking-wide">—</span>
        </div>

        <div class="flex items-center gap-[4px] text-[14px] text-slate-500 font-medium mb-[10px] truncate"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>{{ form.location || 'Location' }}</div>
        
        <div class="text-[15px] font-extrabold text-green-600 truncate">
          <span v-if="form.salary_min || form.salary_max">
            ${{ form.salary_min ? form.salary_min.toLocaleString() : '?' }}
            –
            ${{ form.salary_max ? form.salary_max.toLocaleString() : '?' }}
          </span>
          <span v-else>Salary</span>
        </div>

        <div class="h-px bg-slate-200 my-[14px]"></div>

        <div class="text-[14px] text-slate-600 leading-[1.6] relative" :class="{ 'italic text-slate-400': !form.description }">
          {{ form.description
            ? form.description.slice(0, 60) + (form.description.length > 60 ? '…' : '')
            : 'Description' }}
        </div>
      </div>
    </div>

    <div>
      <p class="text-[13px] font-bold text-slate-500 tracking-[1px] uppercase flex items-center gap-[10px] mb-[16px]">
        Progress
        <span class="flex-1 h-px bg-slate-200"></span>
      </p>

      <div class="flex flex-col gap-[4px]">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[10px] transition-colors duration-200"
          :class="{ 'bg-blue-50': currentStep === i }"
        >
          <div 
            class="w-[8px] h-[8px] rounded-full shrink-0 transition-all duration-200"
            :class="{
              'bg-green-600': currentStep > i,
              'bg-blue-600': currentStep === i,
              'bg-slate-300': currentStep < i
            }"
          ></div>
          <span 
            class="text-[15px] text-slate-500 font-semibold transition-colors"
            :class="{
              'text-green-600': currentStep > i,
              'text-blue-600 font-bold': currentStep === i
            }"
          >{{ step.label }}</span>
          <span v-if="currentStep > i" class="ml-auto text-[14px] text-green-600 font-extrabold">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { width: 3px; }
.hide-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>
