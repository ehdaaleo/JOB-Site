<template>
  <div class="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
    <div class="text-[12px] font-bold text-slate-500 mb-5 tracking-[1.2px] uppercase flex items-center gap-3">
      Job Overview
      <span class="flex-1 h-px bg-slate-100"></span>
    </div>
    <div class="space-y-1">
      <div v-for="row in overviewRows" :key="row.label" class="flex flex-col gap-1 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-2xl px-3 -mx-2">
        <div class="flex items-center gap-2.5 text-[13px] font-bold text-slate-400 uppercase tracking-wider">
          <div v-html="row.icon" class="w-3.5 h-3.5 opacity-70 text-blue-500"></div>
          {{ row.label }}
        </div>
        <div class="font-extrabold text-slate-900 text-[15px] pl-6" :class="{ 'text-green-600': row.isGreen }">
          {{ row.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  job: { type: Object, required: true }
});

const overviewRows = computed(() => [
  { 
    label: 'Job type', 
    value: props.job.work_type, 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38a3.36 3.36 0 0 1-2.452-.181m3.125-7.825a2.18 2.18 0 0 0-3.037-3.037L4.35 15.152a2.18 2.18 0 0 0 3.037 3.037l12.863-12.863ZM5.625 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>' 
  },
  { 
    label: 'Experience', 
    value: props.job.experience_level, 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18" /></svg>' 
  },
  { 
    label: 'Location', 
    value: props.job.location, 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>' 
  },
  { 
    label: 'Salary', 
    value: `${props.job.salary_min?.toLocaleString()} – ${props.job.salary_max?.toLocaleString()}`, 
    isGreen: true, 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'
  },
  { 
    label: 'Category', 
    value: props.job.category, 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>' 
  },
  { 
    label: 'Deadline', 
    value: props.job.application_deadline, 
    icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>' 
  }
]);
</script>

