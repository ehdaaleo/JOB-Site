
<script setup>
defineProps({
  benefits: { type: Array, required: true }
});
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-3xl p-8 scroll-mt-24 shadow-sm hover:shadow-md transition-shadow duration-300">
    <div class="text-[20px] font-bold text-slate-900 mb-6 flex items-center gap-3">
      Benefits
    </div>
    <ul class="flex flex-col gap-3.5">
      <li v-for="(item, i) in benefits" :key="i" class="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed group">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
