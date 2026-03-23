<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  error: [String, Boolean]
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option[props.valueKey])
  isOpen.value = false
}

const selectedLabel = computed(() => {
  const selected = props.options.find(opt => opt[props.valueKey] === props.modelValue)
  return selected ? selected[props.labelKey] : props.placeholder
})
</script>

<template>
  <div class="relative w-full h-fit" :class="{ 'z-[60]': isOpen }">
    <!--close dropdown when clicking outside -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-40 bg-transparent cursor-default" 
      @click.stop="isOpen = false"
    ></div>

    <div class="relative">
      <button
        type="button"
        @click="toggleDropdown"
        class="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-[16px] px-[14px] py-[10px] outline-none transition-all duration-200 hover:border-blue-400 focus:border-blue-600 focus:ring-[3px] focus:ring-blue-600/15 focus:bg-white text-left"
        :class="{ 
          'border-red-400 focus:border-red-500 focus:ring-red-500/15': error,
          'border-blue-600 ring-[3px] ring-blue-600/15 bg-white shadow-sm': isOpen
        }"
      >
        <span :class="{ 'text-slate-400': !modelValue }">{{ selectedLabel }}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-4 h-4 text-slate-400 transition-transform duration-200" 
          :class="{ 'rotate-180': isOpen }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <transition name="dropdown">
        <div 
          v-if="isOpen" 
          class="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] py-1.5 overflow-hidden ring-1 ring-slate-900/10 active:rotate-0"
        >
          <div class="max-h-[220px] overflow-y-auto custom-scrollbar">
            <div 
              v-for="option in options" 
              :key="option[valueKey]"
              @click="selectOption(option)"
              class="px-4 py-2.5 text-[15px] cursor-pointer transition-colors duration-150 flex items-center justify-between"
              :class="modelValue === option[valueKey] ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'"
            >
              {{ option[labelKey] }}
              <svg v-if="modelValue === option[valueKey]" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
              </svg>
            </div>
            <div v-if="options.length === 0" class="px-4 py-3 text-slate-400 text-sm text-center italic">No options available</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
