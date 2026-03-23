<script setup>
defineProps({
  modelValue: Object,
  employer: Object,
  getCategoryName: Function
})
</script>

<template>
  <div>
    <h2 class="text-[24px] font-bold text-slate-900 mb-1 leading-tight">Review & Post</h2>
    <p class="text-[16px] text-slate-400 mb-[26px] leading-relaxed">Everything looks good? Submit your job for admin review.</p>
    
    <div class="bg-slate-50 border border-slate-200 rounded-[12px] p-[20px] flex flex-col gap-[14px]">
      <div class="flex gap-[14px] items-center pb-[14px] border-b border-slate-200">
        <img
          v-if="employer.logo"
          :src="employer.logo"
          class="w-[50px] h-[50px] rounded-[10px] object-cover border border-slate-200 p-0.5 shrink-0 bg-white" 
          alt="Logo"
        />
        <div v-else class="w-[50px] h-[50px] rounded-[10px] bg-blue-50 border border-blue-100 text-blue-600 font-bold text-[20px] flex items-center justify-center shrink-0">
          {{ employer.initials }}
        </div>
        <div>
          <p class="font-bold text-[19px] text-slate-900 mb-[6px] leading-tight">{{ modelValue.title || '—' }}</p>
          <div class="flex gap-[8px] flex-wrap items-center text-[14px] text-slate-400 font-medium">
            <span v-if="modelValue.work_type" class="px-[10px] py-[3px] bg-blue-50 border border-blue-100 text-blue-600 rounded-full font-bold capitalize tracking-wide">{{ modelValue.work_type }}</span>
            <span v-if="modelValue.experience_level" class="px-[10px] py-[3px] bg-blue-50 border border-blue-100 text-blue-600 rounded-full font-bold capitalize tracking-wide">{{ modelValue.experience_level }}</span>
            <span class="flex items-center gap-[4px]"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>{{ modelValue.location || 'Remote' }}</span>
          </div>
        </div>
      </div>

      <div class="flex gap-[14px] text-[15px] leading-relaxed">
        <span class="text-slate-500 min-w-[100px] font-semibold shrink-0">Posted by</span>
        <span class="text-slate-900 font-medium">{{ employer.name }}</span>
      </div>
      <div class="flex gap-[14px] text-[15px] leading-relaxed">
        <span class="text-slate-500 min-w-[100px] font-semibold shrink-0">Category</span>
        <span class="text-slate-900 font-medium">{{ getCategoryName(modelValue.category_id) }}</span>
      </div>
      <div class="flex gap-[14px] text-[15px] leading-relaxed">
        <span class="text-slate-500 min-w-[100px] font-semibold shrink-0">Salary</span>
        <span class="text-slate-900 font-bold text-green-600">
          {{ modelValue.salary_min ? '$' + modelValue.salary_min.toLocaleString() : '—' }}
          –
          {{ modelValue.salary_max ? '$' + modelValue.salary_max.toLocaleString() : '—' }}
        </span>
      </div>
      <div class="flex gap-[14px] text-[15px] leading-relaxed">
        <span class="text-slate-500 min-w-[100px] font-semibold shrink-0">Deadline</span>
        <span class="text-slate-900 font-medium">{{ modelValue.application_deadline || 'Not set' }}</span>
      </div>
      <div class="flex gap-[14px] text-[15px] leading-relaxed">
        <span class="text-slate-500 min-w-[100px] font-semibold shrink-0">Technologies</span>
        <span class="flex flex-wrap gap-[6px]">
          <span v-for="t in modelValue.technologies" :key="t" class="px-[10px] py-[3px] bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-[11px] font-bold">{{ t }}</span>
          <span v-if="!modelValue.technologies.length" class="text-slate-400">None</span>
        </span>
      </div>

      <div class="flex flex-col gap-[6px] text-[15px] pt-[6px]">
        <span class="text-slate-500 font-semibold">Description</span>
        <div class="text-slate-900 leading-[1.6] whitespace-pre-wrap bg-white p-[14px] rounded-lg border border-slate-200 shadow-sm break-words">{{ modelValue.description || '—' }}</div>
      </div>

      <div v-if="modelValue.responsibilities.filter(r => r && r.trim() !== '').length > 0" class="flex flex-col gap-[8px] text-[15px] pt-[4px]">
        <span class="text-slate-500 font-semibold">Responsibilities</span>
        <ul class="list-disc pl-[24px] text-slate-900 leading-[1.6]">
          <li v-for="(item, i) in modelValue.responsibilities.filter(r => r && r.trim() !== '')" :key="i" class="pl-[4px] mb-[4px]">{{ item }}</li>
        </ul>
      </div>

      <div v-if="modelValue.requirements.filter(r => r && r.trim() !== '').length > 0" class="flex flex-col gap-[8px] text-[15px] pt-[4px]">
        <span class="text-slate-500 font-semibold">Requirements</span>
        <ul class="list-disc pl-[24px] text-slate-900 leading-[1.6]">
          <li v-for="(item, i) in modelValue.requirements.filter(r => r && r.trim() !== '')" :key="i" class="pl-[4px] mb-[4px]">{{ item }}</li>
        </ul>
      </div>

      <div v-if="modelValue.benefits.filter(r => r && r.trim() !== '').length > 0" class="flex flex-col gap-[8px] text-[15px] pt-[4px]">
        <span class="text-slate-500 font-semibold">Benefits</span>
        <ul class="list-disc pl-[24px] text-slate-900 leading-[1.6]">
          <li v-for="(item, i) in modelValue.benefits.filter(r => r && r.trim() !== '')" :key="i" class="pl-[4px] mb-[4px]">{{ item }}</li>
        </ul>
      </div>
    </div>

    <div class="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200/60 rounded-[10px] py-[12px] px-[16px] text-[14px] font-medium text-amber-800 leading-[1.5]">
      ⚠ Your job will be reviewed by an admin before going live.
    </div>
  </div>
</template>
