
<script setup>
defineProps({
  tabs: { type: Array, required: true },
  activeTab: { type: Number, default: 0 }
});

defineEmits(['tabClick']);
</script>

<template>
  <div class="flex border-b border-slate-200 mt-2 overflow-x-auto no-scrollbar">
    <div
      v-for="(tab, i) in tabs"
      :key="i"
      class="px-6 py-3.5 text-[15px] font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border-b-2 -mb-[px] tracking-tight"
      :class="activeTab === i 
        ? 'text-blue-600 border-blue-600' 
        : 'text-slate-400 border-transparent hover:text-slate-600 hover:border-slate-300'"
      @click="$emit('tabClick', i)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

