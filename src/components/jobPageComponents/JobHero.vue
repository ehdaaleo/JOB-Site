
<script setup>
defineProps({
  job: { type: Object, required: true },
  isCandidate: { type: Boolean, default: false },
  isSaved: { type: Boolean, default: false }
});

defineEmits(['apply', 'save']);
</script>

<template>
  <div class="flex flex-col md:flex-row items-start gap-6 lg:gap-10">
    <!-- Company logo -->
    <div class="lg:w-24 lg:h-24 md:w-20 md:h-20 w-16 h-16 rounded-[1.5rem] bg-indigo-50/50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden font-['Syne'] text-3xl font-bold text-blue-600 shadow-sm transition-transform hover:scale-105 duration-300">
      <img v-if="job.company_logo" :src="job.company_logo" :alt="job.company_name" class="w-full h-full object-cover" />
      <span v-else>{{ job.company_name?.[0] }}</span>
    </div>

    <!-- Job info -->
    <div class="flex-1">
      <div class="flex flex-wrap items-center gap-3 mb-2">
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
          {{ job.title }}
        </h1>
        <span v-if="job.company_verified" class="inline-flex bg-green-50 border border-green-200 text-green-600 text-[12px] tracking-widest font-bold px-3 py-1.5 rounded-full items-center gap-1.5 shadow-sm h-fit">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.236Z" clip-rule="evenodd" /></svg>
          Verified
        </span>
      </div>
      
      <div class="flex items-center gap-2 text-base text-slate-500 mb-6 font-medium">
        <span class="text-blue-600 font-bold border-b-2 border-blue-50 hover:border-blue-600 cursor-pointer transition-all duration-300">{{ job.company_name }}</span>
        <span class="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
        <span>{{ job.category }}</span>
      </div>
      
      <div class="flex flex-wrap gap-2.5">
        <div class="flex items-center gap-2 text-[12px] font-bold text-slate-500 bg-white border border-slate-100 px-3 py-2 rounded-xl shadow-sm hover:border-blue-200 transition-colors cursor-default">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
           {{ job.location }}
        </div>
        <!-- Work Type -->
        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-colors cursor-default">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
          {{ job.work_type }}
        </span>

        <!-- Job Type -->
        <span v-if="job.type" class="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg px-3 py-1.5 hover:bg-purple-100 transition-colors cursor-default capitalize">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          {{ job.type }}
        </span>
        <div class="flex items-center gap-2 text-[12px] font-bold text-slate-500 bg-white border border-slate-100 px-3 py-2 rounded-xl shadow-sm hover:border-blue-200 transition-colors cursor-default">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5 text-blue-500"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
           {{ job.posted_at }}
        </div>
        <div class="px-3 py-2 rounded-xl text-[12px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-sm">
          {{ job.experience_level }}
        </div>
        <div v-if="job.salary_min || job.salary_max" class="px-3 py-2 rounded-xl text-[12px] font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-sm">
          ${{ job.salary_min?.toLocaleString() }} – ${{ job.salary_max?.toLocaleString() }} / {{ job.salary_period }}
        </div>
        <div v-if="job.application_deadline" class="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-bold bg-amber-50 border border-amber-100 text-amber-800 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>
          {{ job.application_deadline }}
        </div>
      </div>
    </div>
  </div>
</template>


