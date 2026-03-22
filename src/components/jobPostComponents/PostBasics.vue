<script setup>
defineProps({
  modelValue: Object,
  categories: Array,
  errors: Object
})
const emit = defineEmits(['update:modelValue'])
const workTypes = [
  { label: 'Remote', value: 'remote' },
  { label: 'On-site', value: 'on-site' },
  { label: 'Hybrid', value: 'hybrid' },
]
</script>

<template>
  <div>
    <h2 class="text-[24px] font-extrabold text-slate-900 mb-[4px] leading-tight">Job Basics</h2>
    <p class="text-[16px] text-slate-400 mb-[26px] leading-relaxed">Start with the essentials — title, type, and where the role is based.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
      <div class="flex flex-col gap-[6px] md:col-span-2">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Job Title <span class="text-blue-600">*</span></label>
        <input v-model="modelValue.title" type="text" placeholder="e.g. Senior Full-Stack Developer" class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errors.title }" />
        <p v-if="errors.title" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.title }}</p>
      </div>
      
      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Category <span class="text-blue-600">*</span></label>
        <div class="relative">
          <select v-model="modelValue.category_id" class="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] pl-[14px] pr-[30px] py-[10px] outline-none cursor-pointer transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errors.category_id }">
            <option value="">Select category</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <span class="absolute right-[12px] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[12px]">▾</span>
        </div>
        <p v-if="errors.category_id" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.category_id }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Work Type <span class="text-blue-600">*</span></label>
        <div class="relative">
          <select v-model="modelValue.work_type" class="appearance-none w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] pl-[14px] pr-[30px] py-[10px] outline-none cursor-pointer transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errors.work_type }">
            <option value="">Select type</option>
            <option v-for="wt in workTypes" :key="wt.value" :value="wt.value">{{ wt.label }}</option>
          </select>
          <span class="absolute right-[12px] top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[12px]">▾</span>
        </div>
        <p v-if="errors.work_type" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.work_type }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Location <span class="text-blue-600">*</span></label>
        <input v-model="modelValue.location" type="text" placeholder="Cairo..." class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-500/15': errors.location }" />
        <p v-if="errors.location" class="text-red-500 text-[14px] font-medium mt-[2px]">{{ errors.location }}</p>
      </div>

      <div class="flex flex-col gap-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Application Deadline</label>
        <input v-model="modelValue.application_deadline" type="date" class="w-full bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white placeholder:text-slate-400" />
      </div>

      <div class="flex flex-col gap-[6px] md:col-span-2 mt-[6px]">
        <label class="text-[15px] font-semibold text-slate-700 tracking-[0.2px]">Experience Level</label>
        <div class="flex flex-wrap gap-[8px]">
          <button
            v-for="lvl in ['Entry', 'Mid', 'Senior', 'Lead']"
            :key="lvl"
            type="button"
            class="px-[16px] py-[8px] rounded-full border text-[15px] font-medium transition-all duration-150"
            :class="{
              'border-blue-600 bg-blue-50 text-blue-600 shadow-[0_2px_10px_rgba(37,99,235,0.1)]': modelValue.experience_level === lvl,
              'border-slate-300 bg-white text-slate-600 hover:border-blue-400 hover:text-blue-500': modelValue.experience_level !== lvl
            }"
            @click="modelValue.experience_level = lvl"
          >{{ lvl }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
