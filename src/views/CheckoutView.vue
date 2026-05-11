<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadScript } from '@paypal/paypal-js'
import { usePaymentStore } from '@/stores/paymentStore'
import { useAuthStore } from '@/stores/auth'
import { applicationApi, apiErrorMessage } from '@/services/api'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

/**
 * Application checkout — paying for an *accepted* candidate via the
 * backend's PayPal create/capture endpoints. The flow is:
 *
 *   1. Employer enters / confirms the amount.
 *   2. We POST /applications/{id}/payment/paypal/create — backend records
 *      a Payment row and returns paypal_order_id + approval_url.
 *   3. The PayPal JS SDK is initialised with `createOrder` returning that
 *      same paypal_order_id (so the SDK doesn't open a new order).
 *   4. On buyer approval, the SDK fires `onApprove`. We then POST
 *      /applications/{id}/payment/paypal/capture which actually captures
 *      the funds and flips the application's payment_status to "paid".
 */

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const paymentStore = usePaymentStore()

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID

const applicationId = computed(() => route.params.applicationId)
const application = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const success = ref(false)
const processing = ref(false)
const amount = ref(50.0)
// Last Payment row id from create() — used by the Verify button when
// capture fails so we can ask the backend to re-check PayPal.
const lastPaymentId = ref(null)
const verifying = ref(false)

let paypalButtonsInstance = null

const candidateName = computed(() =>
  application.value?.candidate?.name || 'Candidate',
)
const jobTitle = computed(() => application.value?.job?.title || 'Job')

async function loadApplication() {
  try {
    isLoading.value = true
    // The application show endpoint requires the job_id for the route — we
    // fetch by chasing the application via the employer's job. Instead of
    // round-tripping, fetch the candidate-applications-show through the
    // payment service: backend's /payments/{id} only works post-create.
    // So we GET via /jobs/{job}/applications/{id}.
    // For simplicity: try the candidate dashboard endpoint shape — fallback
    // to an inline lookup. Since employer reaches here from the apps view,
    // we just expose the bits we need.
    const res = await applicationApi
      .show(route.query.job_id || 0, applicationId.value)
      .catch(async () => {
        // If we don't have job_id, ask the user to supply it. We just stub
        // with the application id only — the create endpoint enforces
        // ownership server-side, so this still works.
        return { data: { id: applicationId.value } }
      })
    application.value = res.data || res
  } catch (err) {
    errorMessage.value = apiErrorMessage(err, 'Failed to load application.')
  } finally {
    isLoading.value = false
  }
}

async function mountPayPal() {
  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'test') {
    errorMessage.value =
      'PayPal client id is not configured. Set VITE_PAYPAL_CLIENT_ID in .env to a real sandbox value.'
    return
  }

  try {
    const paypal = await loadScript({
      clientId: PAYPAL_CLIENT_ID,
      currency: 'USD',
    })
    if (!paypal) {
      errorMessage.value = 'PayPal SDK failed to load.'
      return
    }

    paypalButtonsInstance = paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' },
      createOrder: async () => {
        try {
          const order = await paymentStore.createOrder(
            applicationId.value,
            Number(amount.value),
            'USD',
          )
          lastPaymentId.value = order.payment_id
          return order.paypal_order_id
        } catch (err) {
          errorMessage.value = paymentStore.error || apiErrorMessage(err, 'Failed to start payment.')
          throw err
        }
      },
      onApprove: async (data) => {
        processing.value = true
        try {
          await paymentStore.captureOrder(applicationId.value, data.orderID)
          success.value = true
          setTimeout(() => router.push({ name: 'view-applications' }), 2500)
        } catch (err) {
          errorMessage.value = paymentStore.error || apiErrorMessage(err, 'Capture failed.')
        } finally {
          processing.value = false
        }
      },
      onError: (err) => {
        console.error(err)
        errorMessage.value = 'PayPal returned an error. Please try again.'
      },
      onCancel: () => {
        errorMessage.value = 'Payment cancelled.'
      },
    })
    await paypalButtonsInstance.render('#paypal-button-container')
  } catch (err) {
    errorMessage.value = apiErrorMessage(err, 'Failed to load PayPal.')
  }
}

/**
 * Re-check the payment against PayPal. Useful when capture failed
 * mid-flight (network, SSL, or browser closed) — the buyer may have
 * actually paid on PayPal's side and the backend just couldn't confirm.
 */
async function verifyNow() {
  if (!lastPaymentId.value) return
  verifying.value = true
  errorMessage.value = ''
  try {
    const res = await paymentStore.verifyPayment(lastPaymentId.value)
    const status = res?.data?.status
    if (status === 'succeeded' || res?.data?.application?.payment_status === 'paid') {
      success.value = true
      setTimeout(() => router.push({ name: 'view-applications' }), 2000)
    } else {
      errorMessage.value = res?.message || 'Payment is not completed yet.'
    }
  } catch (err) {
    errorMessage.value = paymentStore.error || apiErrorMessage(err, 'Could not verify payment.')
  } finally {
    verifying.value = false
  }
}

onMounted(async () => {
  await loadApplication()
  await mountPayPal()
})

onBeforeUnmount(() => {
  if (paypalButtonsInstance && typeof paypalButtonsInstance.close === 'function') {
    paypalButtonsInstance.close().catch(() => {})
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
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment</h1>
              <p class="text-gray-500">Pay for an accepted application via PayPal.</p>
            </div>

            <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
              <h2 class="text-xl font-bold mb-6">Summary</h2>
              <div v-if="isLoading" class="text-gray-500">Loading…</div>
              <div v-else class="space-y-4">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-bold text-gray-900">{{ jobTitle }}</p>
                    <p class="text-sm text-gray-500">Candidate: {{ candidateName }}</p>
                    <p class="text-xs text-gray-400 mt-1">Application #{{ applicationId }}</p>
                  </div>
                </div>

                <div class="border-t border-gray-100 pt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                  <input
                    v-model.number="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p class="text-xs text-gray-500 mt-2">
                    Charged to the connected PayPal account when the buyer approves.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl flex flex-col">
            <h2 class="text-xl font-bold mb-8">Secure Payment</h2>

            <div v-if="success" class="flex-grow flex flex-col items-center justify-center text-center">
              <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Payment captured!</h3>
              <p class="text-gray-500 mb-6">Application marked as paid. Redirecting…</p>
            </div>

            <div v-else-if="processing" class="flex-grow flex flex-col items-center justify-center py-20">
              <div class="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p class="text-gray-600 font-medium">Capturing your payment…</p>
            </div>

            <div v-else class="flex-grow">
              <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                <p>{{ errorMessage }}</p>
                <button
                  v-if="lastPaymentId"
                  @click="verifyNow"
                  :disabled="verifying"
                  class="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {{ verifying ? 'Verifying…' : 'Verify with PayPal' }}
                </button>
                <p v-if="lastPaymentId" class="mt-2 text-xs text-red-600/80">
                  If the buyer already approved on PayPal, this re-checks the order and marks the payment paid when PayPal confirms.
                </p>
              </div>

              <div id="paypal-button-container"></div>

              <div class="mt-8 p-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs">
                The PayPal SDK calls our backend to create an order, then captures it after buyer approval. No card details ever touch this server.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>
