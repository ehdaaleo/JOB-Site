<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/homePageComponents/navbar.vue'
import Footer from '../components/homePageComponents/footer.vue'
import PricingCard from '../components/pricing/PricingCard.vue'
import { pricingPlans as plans } from '@/stores/pricingPlans'

const router = useRouter()
const isYearly = ref(false)

const handleSelect = (plan) => {
  if (plan.monthlyPrice === 0) {
    // Free plan, skip payment
    router.push('/employer/post-job')
    return
  }
  router.push({
    name: 'checkout',
    params: { planId: plan.id },
    query: { billing: isYearly.value ? 'yearly' : 'monthly' }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col pt-16">
    <Navbar />

    <main class="flex-grow pt-24 pb-20">
      <div class="container mx-auto px-4 text-center mb-16">
        <h2 class="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Pricing Plans</h2>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Find the Perfect Plan for <br />
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Your Hiring Success
          </span>
        </h1>
        <p class="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Scale your team with confidence. Choose a package that fits your needs and start posting today.
        </p>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-4">
          <span class="text-sm font-semibold" :class="!isYearly ? 'text-gray-900' : 'text-gray-400'">Monthly</span>
          <button 
            @click="isYearly = !isYearly"
            class="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-inner"
            :class="isYearly ? 'bg-blue-600' : 'bg-gray-200'"
          >
            <div 
              class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300"
              :class="isYearly ? 'translate-x-7' : 'translate-x-0'"
            ></div>
          </button>
          <span class="text-sm font-semibold flex items-center gap-2" :class="isYearly ? 'text-gray-900' : 'text-gray-400'">
            Yearly
            <span class="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">SAVE 20%</span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards Grid -->
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch pt-8">
          <PricingCard 
            v-for="plan in plans" 
            :key="plan.id" 
            :plan="{
              ...plan,
              monthlyPrice: plan.monthlyPriceLabel,
              yearlyPrice: plan.yearlyPriceLabel
            }" 
            :isYearly="isYearly"
            @select="handleSelect"
          />
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}
.from-blue-600 {
  --tw-gradient-from: #2563eb;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
}
.to-indigo-600 {
  --tw-gradient-to: #4f46e5;
}
</style>
