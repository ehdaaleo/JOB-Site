<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { loadScript } from '@paypal/paypal-js'

const props = defineProps({
  form: Object,
  employer: Object,
})

const emit = defineEmits(['paymentComplete', 'paymentFailed'])

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const postingFee = '9.99'

const loading = ref(true)
const errorMessage = ref('')
const processing = ref(false)
let paypalInstance = null

onMounted(async () => {
  try {
    paypalInstance = await loadScript({
      clientId: PAYPAL_CLIENT_ID,
      currency: 'USD',
      intent: 'capture',
    })
    loading.value = false
    await nextTick()
    renderPayPalButtons()
  } catch (err) {
    console.error('Failed to load PayPal SDK:', err)
    loading.value = false
    errorMessage.value = 'Could not load PayPal. Make sure VITE_PAYPAL_CLIENT_ID is set in your .env file.'
  }
})

const renderPayPalButtons = () => {
  if (!paypalInstance || !paypalInstance.Buttons) return

  const container = document.getElementById('paypal-post-button')
  if (!container) return

  paypalInstance.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'pay',
      height: 45,
    },

    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          description: `Job posting: ${props.form.title} - ${props.employer.name}`,
          amount: {
            currency_code: 'USD',
            value: postingFee,
          },
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
    },

    onApprove: async (data, actions) => {
      processing.value = true
      errorMessage.value = ''

      try {
        const details = await actions.order.capture()
        emit('paymentComplete', {
          orderId: details.id,
          amount: parseFloat(postingFee),
        })
      } catch (err) {
        console.error('PayPal capture error:', err)
        processing.value = false
        errorMessage.value = 'PayPal could not capture the payment. Please try again.'
        emit('paymentFailed', err.message)
      }
    },

    onCancel: () => {
      errorMessage.value = 'Payment cancelled. Your job has not been posted yet.'
    },

    onError: (err) => {
      console.error('PayPal error:', err)
      errorMessage.value = 'Something went wrong with PayPal. Please try again.'
      emit('paymentFailed', err.message)
    },
  }).render('#paypal-post-button')
}
</script>

<template>
  <div>
    <h2 class="text-[24px] font-bold text-slate-900 mb-1 leading-tight">Payment</h2>
    <p class="text-[16px] text-slate-400 mb-[26px] leading-relaxed">Pay the posting fee to submit your job for review.</p>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center py-12">
      <div class="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
      <p class="text-slate-400 text-[14px]">Loading PayPal...</p>
    </div>

    <!-- Processing -->
    <div v-else-if="processing" class="flex flex-col items-center py-12">
      <div class="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-3"></div>
      <p class="text-slate-600 text-[14px] font-medium">Capturing payment... Almost done.</p>
    </div>

    <!-- Payment Form -->
    <div v-else>
      <!-- Job Summary -->
      <div class="bg-slate-50 border border-slate-200 rounded-[12px] p-[20px] mb-6">
        <div class="flex items-center gap-3 mb-3">
          <img v-if="employer.logo" :src="employer.logo" class="w-[40px] h-[40px] rounded-lg object-cover border border-slate-200" alt="Logo" />
          <div>
            <p class="font-bold text-slate-900 text-[16px]">{{ form.title || 'Untitled Job' }}</p>
            <p class="text-slate-400 text-[13px]">{{ employer.name }} &middot; {{ form.location || 'Remote' }}</p>
          </div>
        </div>
        <hr class="border-slate-200 my-3" />
        <div class="flex items-center justify-between">
          <span class="text-slate-600 font-medium">Job posting fee</span>
          <span class="text-[24px] font-bold text-slate-900">${{ postingFee }}</span>
        </div>
        <p class="text-slate-400 text-[12px] mt-1">One-time fee. Your job will be reviewed by an admin after payment.</p>
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-[10px] p-3 mb-4">
        <p class="text-[13px] text-red-700">{{ errorMessage }}</p>
      </div>

      <!-- PayPal Buttons -->
      <div id="paypal-post-button" class="mb-4"></div>

      <!-- Sandbox note -->
      <div class="flex items-start gap-2 bg-blue-50 border border-blue-200/60 rounded-[10px] py-[12px] px-[16px] text-[13px] font-medium text-blue-700 leading-[1.5]">
        <svg class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        PayPal Sandbox — log in with a sandbox buyer account. No real money charged.
      </div>
    </div>
  </div>
</template>
