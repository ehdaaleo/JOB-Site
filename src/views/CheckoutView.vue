<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pricingPlans } from '@/stores/pricingPlans'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'
import { loadScript } from '@paypal/paypal-js'
import { usePaymentStore } from '@/stores/paymentStore'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()
const authStore = useAuthStore()

const planId = route.params.planId
const billing = route.query.billing || 'monthly'

const plan = computed(() => pricingPlans.find(p => p.id === planId))
const price = computed(() => billing === 'yearly' ? plan.value?.yearlyPrice : plan.value?.monthlyPrice)
const priceLabel = computed(() => billing === 'yearly' ? plan.value?.yearlyPriceLabel : plan.value?.monthlyPriceLabel)

const loading = ref(true)
const processing = ref(false)
const errorMessage = ref('')
const success = ref(false)

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

onMounted(async () => {
  if (!plan.value) {
    router.push('/pricing')
    return
  }

  try {
    const paypal = await loadScript({
      clientId: PAYPAL_CLIENT_ID,
      currency: 'USD',
    })

    if (paypal) {
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'pay',
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              description: `Subscription: ${plan.value.name} (${billing})`,
              amount: {
                currency_code: 'USD',
                value: price.value.toString(),
              },
            }],
          })
        },
        onApprove: async (data, actions) => {
          processing.value = true
          try {
            const details = await actions.order.capture()
            
            // Record payment
            const payment = paymentStore.createPayment(
              `${plan.value.name} Subscription`,
              authStore.user?.name || 'Employer',
              price.value
            )
            paymentStore.completePayment(payment.id, details.id)

            success.value = true
            processing.value = false
            
            setTimeout(() => {
              router.push('/employer/dashboard')
            }, 3000)
          } catch (err) {
            console.error(err)
            errorMessage.value = 'Failed to capture payment.'
            processing.value = false
          }
        },
        onError: (err) => {
          console.error(err)
          errorMessage.value = 'An error occurred with PayPal.'
        }
      }).render('#paypal-button-container')
    }
    loading.value = false
  } catch (err) {
    console.error(err)
    loading.value = false
    errorMessage.value = 'Failed to load PayPal SDK.'
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col pt-16">
    <Navbar />

    <main class="flex-grow py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <!-- Order Summary -->
          <div class="space-y-8">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p class="text-gray-500">Securely upgrade your account.</p>
            </div>

            <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
              <h2 class="text-xl font-bold mb-6">Order Summary</h2>
              
              <div v-if="plan" class="space-y-4">
                <div class="flex justify-between items-center">
                  <div>
                    <p class="font-bold text-gray-900">{{ plan.name }} Plan</p>
                    <p class="text-sm text-gray-500 capitalize">{{ billing }} Billing</p>
                  </div>
                  <p class="font-bold text-lg">{{ priceLabel }}</p>
                </div>
                
                <hr class="border-gray-100" />
                
                <div class="flex justify-between items-center text-lg font-bold">
                  <span>Total Due</span>
                  <span class="text-blue-600">{{ priceLabel }}</span>
                </div>
              </div>

              <div class="mt-8">
                <h3 class="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Included Features</h3>
                <ul class="space-y-3">
                  <li v-for="feat in plan?.features.filter(f => f.included)" :key="feat.text" class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.704 4.126a.75.75 0 01.03 1.06l-8.25 8.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 011.06-1.06L8 11.94l7.644-7.644a.75.75 0 011.06-.03z" clip-rule="evenodd" />
                    </svg>
                    {{ feat.text }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col">
            <h2 class="text-xl font-bold mb-8">Secure Payment</h2>

            <div v-if="success" class="flex-grow flex flex-col items-center justify-center text-center animate-fade-in">
              <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
              <p class="text-gray-500 mb-6">Your plan has been upgraded. Redirecting to dashboard...</p>
            </div>

            <div v-else-if="processing" class="flex-grow flex flex-col items-center justify-center py-20">
              <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p class="text-gray-600 font-medium">Processing your transaction...</p>
            </div>

            <div v-else class="flex-grow">
              <div v-if="loading" class="flex justify-center py-20">
                <div class="w-8 h-8 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
              </div>

              <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm leading-relaxed">
                {{ errorMessage }}
              </div>

              <div id="paypal-button-container"></div>

              <div class="mt-8 p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs flex items-start gap-3">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>We use PayPal to ensure your transaction is safe and encrypted. We don't store your credit card details.</span>
              </div>
            </div>
            
            <div class="mt-auto pt-8 flex items-center justify-center gap-4 text-gray-400">
               <svg class="h-8 w-auto opacity-50" viewBox="0 0 450 450"><path d="M450 376c0 14.8-12 26.8-26.8 26.8H26.8C12 402.8 0 390.8 0 376V74c0-14.8 12-26.8 26.8-26.8h396.4C438 47.2 450 59.2 450 74v302z" fill="#f2f2f2"/><path d="M423.2 225c0 109.5-88.7 198.2-198.2 198.2S26.8 334.5 26.8 225 115.5 26.8 225 26.8 423.2 115.5 423.2 225z" fill="#003087"/><path d="M373.2 225c0 81.8-66.3 148.2-148.2 148.2S76.8 306.8 76.8 225 143.2 76.8 225 76.8 373.2 143.2 373.2 225z" fill="#009cde"/><path d="M225 323.2c54.2 0 98.2-44 98.2-98.2S279.2 126.8 225 126.8s-98.2 44-98.2 98.2 44 98.2 98.2 98.2z" fill="#003087"/></svg>
               <span class="text-xs uppercase tracking-widest font-bold">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
