
<script setup>
defineProps({
  description: { type: String, required: true }
});
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-2xl p-6 scroll-mt-24 shadow-sm hover:shadow-md my-5transition-shadow duration-300">
    <div class="font-['Syne'] text-[20px] font-extrabold text-slate-900 mb-4 flex items-center gap-2.5">
      Job description
    </div>
    <div class=" prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-white rounded-lg p-0" v-html="description"></div>
  </div>
</template>



