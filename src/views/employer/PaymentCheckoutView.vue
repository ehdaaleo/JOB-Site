<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadScript } from '@paypal/paypal-js'
import { usePaymentStore } from '../../stores/paymentStore'
import { useApplicationStore } from '../../stores/applicationStore'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentStore()
const applicationStore = useApplicationStore()

const applicationId = computed(() => parseInt(route.params.applicationId))
const application = computed(() =>
  applicationStore.applications.find(a => a.id === applicationId.value)
)

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const unlockFee = '4.99'

// UI state
const step = ref('loading') // loading | review | processing | success | failed
const currentPayment = ref(null)
const errorMessage = ref('')
let paypalInstance = null

const alreadyUnlocked = computed(() =>
  paymentStore.hasUnlockedContact(applicationId.value)
)

onMounted(async () => {
  if (!application.value) {
    router.push({ name: 'view-applications' })
    return
  }

  if (alreadyUnlocked.value) {
    step.value = 'success'
    currentPayment.value = paymentStore.getPaymentByApplicationId(applicationId.value)
    return
  }

  // Load the real PayPal JS SDK — fails naturally if VITE_PAYPAL_CLIENT_ID is missing
  try {
    paypalInstance = await loadScript({
      clientId: PAYPAL_CLIENT_ID,
      currency: 'USD',
      intent: 'capture',
    })
    step.value = 'review'
    await nextTick()
    renderPayPalButtons()
  } catch (err) {
    console.error('Failed to load PayPal SDK:', err)
    errorMessage.value = 'Could not load PayPal. Make sure VITE_PAYPAL_CLIENT_ID is set in your .env file.'
    step.value = 'failed'
  }
})

onUnmounted(() => {
  paypalInstance = null
})

const renderPayPalButtons = () => {
  if (!paypalInstance || !paypalInstance.Buttons) return

  const container = document.getElementById('paypal-button-container')
  if (!container) return

  paypalInstance.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'pay',
      height: 45,
    },

    // Called when the buyer clicks the PayPal button
    createOrder: (data, actions) => {
      // Create a pending payment in our store
      currentPayment.value = paymentStore.createPayment(
        applicationId.value,
        application.value.job,
        application.value.candidateName || 'Candidate',
        parseFloat(unlockFee)
      )

      // Create the PayPal order (client-side for sandbox)
      return actions.order.create({
        purchase_units: [{
          description: `Contact unlock: ${application.value.candidateName} - ${application.value.job}`,
          amount: {
            currency_code: 'USD',
            value: unlockFee,
          },
        }],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
    },

    // Called after the buyer approves the payment in the PayPal popup
    onApprove: async (data, actions) => {
      step.value = 'processing'

      try {
        // Capture the funds
        const details = await actions.order.capture()

        // Mark payment as completed in our store
        paymentStore.completePayment(currentPayment.value.id, details.id)
        currentPayment.value = paymentStore.getPaymentById(currentPayment.value.id)
        step.value = 'success'
      } catch (err) {
        console.error('PayPal capture error:', err)
        paymentStore.failPayment(
          currentPayment.value.id,
          'PayPal could not capture the payment. The sandbox buyer account may not have enough balance.'
        )
        currentPayment.value = paymentStore.getPaymentById(currentPayment.value.id)
        errorMessage.value = currentPayment.value.failReason
        step.value = 'failed'
      }
    },

    // Called when the buyer cancels the payment
    onCancel: () => {
      if (currentPayment.value) {
        paymentStore.failPayment(currentPayment.value.id, 'You cancelled the payment.')
        currentPayment.value = paymentStore.getPaymentById(currentPayment.value.id)
      }
      errorMessage.value = 'Payment was cancelled. No money was charged.'
      step.value = 'review'
      nextTick(() => renderPayPalButtons())
    },

    // Called on any error
    onError: (err) => {
      console.error('PayPal error:', err)
      if (currentPayment.value) {
        paymentStore.failPayment(currentPayment.value.id, err.message || 'An unexpected error occurred.')
        currentPayment.value = paymentStore.getPaymentById(currentPayment.value.id)
      }
      errorMessage.value = 'Something went wrong with PayPal. Please try again.'
      step.value = 'failed'
    },
  }).render('#paypal-button-container')
}

const retryPayment = async () => {
  errorMessage.value = ''
  step.value = 'review'
  await nextTick()
  renderPayPalButtons()
}

const goToApplications = () => {
  router.push({ name: 'view-applications' })
}

const goToReceipts = () => {
  router.push({ name: 'payment-history' })
}
</script>

<template>
  <div class="payment-checkout">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Unlock Contact Details</h1>
          <p class="text-sm text-gray-500">Securely pay with PayPal to connect with your candidate</p>
        </div>
        <button @click="goToApplications" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="max-w-2xl mx-auto p-6">

      <!-- Step: Loading SDK -->
      <div v-if="step === 'loading'" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500">Loading PayPal...</p>
      </div>

      <!-- Step: Review & Pay -->
      <div v-if="step === 'review'" class="space-y-6">

        <!-- Application Summary -->
        <div class="bg-white rounded-xl border border-gray-200 p-6" v-if="application">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">What you're unlocking</h2>
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
              {{ (application.candidateName || 'C')[0] }}
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ application.candidateName || 'Candidate' }}</h3>
              <p class="text-sm text-gray-600">Applied for: {{ application.job }}</p>
              <p class="text-sm text-gray-500">{{ application.company }} &middot; {{ application.location }}</p>
              <div class="mt-3 text-sm text-gray-600">
                <p class="mb-1">After payment, you'll get access to:</p>
                <ul class="space-y-1 ml-4">
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Candidate's email address
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Phone number
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    LinkedIn profile
                  </li>
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                    Resume / portfolio link
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- PayPal Buttons -->
        <div class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.603c-.536 0-.99.394-1.073.926L7.076 21.337z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Pay with PayPal</h2>
              <p class="text-sm text-gray-500">PayPal Sandbox - uses test accounts, no real money</p>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="bg-gray-50 rounded-lg p-4 mb-6">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Contact unlock fee</span>
              <span class="text-2xl font-bold text-gray-900">${{ unlockFee }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">One-time payment. Access never expires.</p>
          </div>

          <!-- Error -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-700">{{ errorMessage }}</p>
          </div>

          <!-- PayPal Smart Buttons render here -->
          <div id="paypal-button-container"></div>
        </div>

        <!-- Sandbox Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm font-medium text-blue-800">PayPal Sandbox Mode</p>
              <p class="text-sm text-blue-700 mt-1">
                This uses PayPal's official sandbox environment. When you click the PayPal button,
                log in with a <span class="font-medium">sandbox buyer account</span> from
                developer.paypal.com &rarr; Sandbox &rarr; Accounts. No real money is involved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step: Processing -->
      <div v-if="step === 'processing'" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Capturing payment...</h2>
        <p class="text-gray-500">Finishing up with PayPal. Almost there.</p>
      </div>

      <!-- Step: Success -->
      <div v-if="step === 'success'" class="space-y-6">
        <div class="bg-white rounded-xl border border-green-200 p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p class="text-gray-600 mb-6">You can now view the candidate's contact details.</p>

          <!-- Unlocked Contact Info -->
          <div class="bg-gray-50 rounded-lg p-6 text-left mb-6">
            <h3 class="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-900">{{ (application?.candidateName || 'candidate').toLowerCase().replace(' ', '.') }}@email.com</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div>
                  <p class="text-xs text-gray-500">Phone</p>
                  <p class="text-sm font-medium text-gray-900">+1 (555) 012-3456</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <div>
                  <p class="text-xs text-gray-500">LinkedIn</p>
                  <p class="text-sm font-medium text-blue-600">linkedin.com/in/{{ (application?.candidateName || 'candidate').toLowerCase().replace(' ', '-') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Receipt -->
          <div v-if="currentPayment?.receipt" class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-blue-900">Receipt #{{ currentPayment.receipt.receiptNumber }}</span>
              <span class="text-sm text-blue-700">${{ currentPayment.receipt.amount.toFixed(2) }}</span>
            </div>
            <p class="text-xs text-blue-700">{{ currentPayment.receipt.description }}</p>
            <p class="text-xs text-blue-600 mt-1">PayPal Order: {{ currentPayment.receipt.transactionId }}</p>
          </div>

          <div class="flex gap-3">
            <button @click="goToApplications" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Back to Applications
            </button>
            <button @click="goToReceipts" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              View All Receipts
            </button>
          </div>
        </div>
      </div>

      <!-- Step: Failed -->
      <div v-if="step === 'failed'" class="space-y-6">
        <div class="bg-white rounded-xl border border-red-200 p-8 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p class="text-gray-600 mb-2">{{ errorMessage || 'Something went wrong with the transaction.' }}</p>
          <p class="text-sm text-gray-500 mb-6">You haven't been charged. Feel free to try again.</p>

          <div class="flex gap-3">
            <button @click="retryPayment" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Try Again
            </button>
            <button @click="goToApplications" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Back to Applications
            </button>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            <span class="font-medium">Having trouble?</span> Make sure you're logging in with a
            <span class="font-medium">sandbox buyer account</span> (not your real PayPal).
            Check developer.paypal.com &rarr; Sandbox &rarr; Accounts for test credentials.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.payment-checkout {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
