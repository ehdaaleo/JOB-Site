<script setup>
defineProps({
  job: { type: Object, required: true },
  isCandidate: { type: Boolean, default: false },
  isSaved: { type: Boolean, default: false },
  applicantAvatars: { type: Array, required: true }
});

defineEmits(['apply', 'save']);
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-3xl p-5 py-5 text-center flex flex-col items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-300">
    <!-- Deadline Tag -->
    <div v-if="job.application_deadline" class="bg-blue-50/50 border border-blue-100 text-blue-600 text-[11px] uppercase tracking-[1.2px] px-3 py-1.5 rounded-full flex items-center gap-2 inline-flex font-bold shadow-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
      Closes {{ job.application_deadline }}
    </div>
    
    <!-- Title & Desc -->
    <div class="space-y-1">
      <div class="text-[17px] font-bold text-slate-900 tracking-tight">Ready to apply?</div>
      <div class="text-[14px] text-slate-500 font-medium leading-[1.5] px-2">
        {{ isCandidate ? 'Submit your application in just a few steps.' : 'Create a candidate account to apply.' }}
      </div>
    </div>

    <!-- Applicants Summary -->
    <div class="flex items-center gap-3 py-2.5 border-y border-slate-50 w-full justify-center">
      <div class="text-[14px] font-bold text-slate-700">
        {{ job.applications_count }} <span class="text-slate-400 font-medium text-[13px]">applicants</span>
      </div>
    </div>

    <!-- Guest Notice -->
    <div v-if="!isCandidate" class="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 text-[13px] text-blue-700 text-left leading-relaxed w-full font-semibold shadow-sm">
      <div class="flex gap-2.5 items-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="shrink-0"><path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" /></svg>
        <span>Account required to apply.</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="w-full flex flex-col gap-4">
      <button
        class="w-full text-[15px] font-bold py-4 px-6 rounded-2xl shadow-md transition-all duration-300 flex items-center justify-center gap-2.5 group bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 hover:shadow-blue-200 hover:shadow-lg"
        @click="$emit('apply')"
      >
        {{ isCandidate ? 'Apply for this position' : 'Login to Apply' }}
        <svg v-if="isCandidate" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      
      <button
        class="w-full text-[14px] font-bold py-3 rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2"
        :class="isSaved 
          ? 'border-red-100 text-red-500 bg-red-50 hover:bg-red-100 shadow-sm' 
          : 'border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 bg-white hover:bg-red-50/50 shadow-sm'"
        @click="$emit('save')"
      >
        {{ isSaved ? 'Saved to Favorites' : 'Save for later' }}
      </button>
    </div>
  </div>
</template>
