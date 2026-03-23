<script setup>
import { computed } from 'vue';
import { useJobStore } from '@/stores/jobStore';

const props = defineProps({
  jobId: {
    type: [String, Number],
    required: true
  }
});

const jobStore = useJobStore();
const job = computed(() => jobStore.getJobById(props.jobId));

const jobTitle = computed(() => job.value?.title || 'Unknown Job');
const companyName = computed(() => job.value?.company?.name || job.value?.company_name || 'Unknown Company');
const companyLogo = computed(() => job.value?.company?.logo || job.value?.company_logo || null);
const companyVerified = computed(() => job.value?.company?.verified ?? job.value?.company_verified ?? false);
const location = computed(() => job.value?.location || 'Remote');
const workType = computed(() => job.value?.workType || job.value?.work_type || 'Unknown');
const salaryMin = computed(() => job.value?.salaryMin || job.value?.salary_min || 0);
const salaryMax = computed(() => job.value?.salaryMax || job.value?.salary_max || 0);
const type = computed(() => job.value?.type || 'Full-time');
const deadline = computed(() => job.value?.deadline || 'Unknown');
</script>

<template>
  <div class="apply-summary bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm animate-fade-in-up">
    <!-- Company Header -->
    <div class="flex items-start gap-4 mb-6">
      <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-slate-100 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0 overflow-hidden">
        <img v-if="companyLogo" :src="companyLogo" :alt="companyName" class="w-full h-full object-cover bg-white" />
        <span v-else>{{ companyName.charAt(0) }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <h2 class="text-xl md:text-2xl font-bold text-slate-900 leading-tight" style="font-family: 'Syne', sans-serif;">
          {{ jobTitle }}
        </h2>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-blue-600 font-semibold text-sm">{{ companyName }}</span>
          <span v-if="companyVerified" class="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 font-medium">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            Verified
          </span>
        </div>
      </div>
    </div>

    <!-- Job Meta Badges -->
    <div class="flex flex-wrap gap-2">
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg px-3 py-1.5">
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        {{ location }}
      </span>
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg px-3 py-1.5 hover:bg-blue-100 transition-colors cursor-default">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
        {{ workType }}
      </span>
      <span v-if="salaryMin || salaryMax" class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg px-3 py-1.5 hover:bg-emerald-100 transition-colors cursor-default">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        ${{ salaryMin?.toLocaleString() }} – ${{ salaryMax?.toLocaleString() }}
      </span>
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg px-3 py-1.5 hover:bg-purple-100 transition-colors cursor-default">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        {{ type }}
      </span>
      <span class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors cursor-default">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        {{ deadline }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.apply-summary {
  font-family: 'DM Sans', sans-serif;
}
</style>
