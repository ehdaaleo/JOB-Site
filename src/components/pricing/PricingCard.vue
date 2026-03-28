<script setup>
defineProps({
  plan: {
    type: Object,
    required: true
  },
  isYearly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])
</script>

<template>
  <div 
    class="flex flex-col p-8 rounded-3xl transition-all duration-300 relative overflow-hidden"
    :class="[
      plan.popular 
        ? 'bg-white shadow-2xl scale-105 z-10 border-2 border-blue-600' 
        : 'bg-white/80 backdrop-blur-sm border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1'
    ]"
  >
    <!-- Popular Badge -->
    <div 
      v-if="plan.popular" 
      class="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider"
    >
      Most Popular
    </div>

    <div class="mb-8">
      <h3 class="text-xl font-bold text-gray-900 mb-2">{{ plan.name }}</h3>
      <p class="text-gray-500 text-sm leading-relaxed">{{ plan.description }}</p>
    </div>

    <div class="mb-8 flex items-baseline gap-1">
      <span class="text-4xl font-extrabold text-gray-900">
        {{ isYearly ? plan.yearlyPrice : plan.monthlyPrice }}
      </span>
      <span class="text-gray-500 font-medium">{{ isYearly ? '/year' : '/month' }}</span>
    </div>

    <ul class="space-y-4 mb-10 flex-grow">
      <li 
        v-for="(feature, index) in plan.features" 
        :key="index"
        class="flex items-start gap-3"
      >
        <div 
          class="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
          :class="feature.included ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-300'"
        >
          <svg 
            v-if="feature.included" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            class="w-3.5 h-3.5"
          >
            <path fill-rule="evenodd" d="M16.704 4.126a.75.75 0 01.03 1.06l-8.25 8.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 011.06-1.06L8 11.94l7.644-7.644a.75.75 0 011.06-.03z" clip-rule="evenodd" />
          </svg>
          <svg 
            v-else 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            class="w-3.5 h-3.5"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </div>
        <span 
          class="text-sm"
          :class="feature.included ? 'text-gray-700 font-medium' : 'text-gray-400 line-through'"
        >
          {{ feature.text }}
        </span>
      </li>
    </ul>

    <button 
      @click="emit('select', plan)"
      class="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95"
      :class="[
        plan.popular 
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
          : 'bg-gray-900 text-white hover:bg-gray-800'
      ]"
    >
      {{ plan.cta }}
    </button>
  </div>
</template>

<style scoped>
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.15);
}
</style>
