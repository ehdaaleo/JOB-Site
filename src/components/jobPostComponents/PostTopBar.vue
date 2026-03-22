<script setup>
defineProps({
  employer: Object
})
</script>

<template>
  <div class="flex items-center justify-between px-7 py-4 bg-white border-b border-slate-200 shrink-0">
    <div class="font-extrabold text-blue-600 flex items-center gap-2.5 text-[21px]">
      <div class="flex items-center justify-center w-[32px] h-[32px] bg-blue-50 text-blue-600 rounded-[10px] shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      </div>
      Post Job
    </div>
    <div class="flex items-center gap-3">
      <img
        v-if="employer.logo"
        :src="employer.logo"
        class="w-[36px] h-[36px] rounded-lg object-contain border border-slate-200 p-0.5 shrink-0" 
        alt="Logo"
      />
      <div v-else class="w-[36px] h-[36px] rounded-lg bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
        {{ employer.initials }}
      </div>
      <div class="flex flex-col">
        <p class="text-[15px] font-bold text-slate-900 leading-tight">{{ employer.name }}</p>
        <span class="text-[13px] text-slate-500 font-medium">{{ employer.email }} · {{ employer.location }}</span>
      </div>
      <div v-if="employer.verified" class="ml-2 bg-blue-50 border border-blue-100 text-blue-600 text-[13px] font-bold py-1 px-3 rounded-full flex items-center gap-1.5 leading-none tracking-wide">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Verified
      </div>
    </div>
  </div>
</template>
