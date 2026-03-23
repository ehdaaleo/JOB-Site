
<script setup>
defineProps({
  requirements: { type: Array, required: true },
  technologies: { type: Array, required: true }
});
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-2xl p-6 scroll-mt-24 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div class="text-[20px] font-bold text-slate-900 mb-5 flex items-center gap-2.5">
      Requirements
    </div>
    <ul class="flex flex-col gap-4 mb-10">
      <li v-for="(item, i) in requirements" :key="i" class="flex items-start gap-3.5 text-[15px] text-slate-600 leading-relaxed group">
        {{ item }}
      </li>
    </ul>

    <div class="text-[20px] font-bold text-slate-900 mb-5 flex items-center gap-2.5">
      Technologies
    </div>
    <div class="flex flex-wrap gap-2">
      <span v-for="tech in technologies" :key="tech"  class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-slate-200 px-4 py-1.5 rounded-full text-[12px] font-semibold hover:from-white hover:to-white hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-all duration-500 cursor-default">
        {{ tech }}
      </span>
    </div>
  </div>
</template>

