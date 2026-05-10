<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { paymentApi, apiErrorMessage } from '@/services/api'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const router = useRouter()

const payments = ref([])
const isLoading = ref(true)
const error = ref(null)
const statusFilter = ref('')
const selectedPayment = ref(null)
const showReceiptModal = ref(false)

const filteredPayments = computed(() =>
  statusFilter.value
    ? payments.value.filter((p) => p.status === statusFilter.value)
    : payments.value,
)

const completedPayments = computed(() =>
  payments.value.filter((p) => p.status === 'completed'),
)

const totalSpent = computed(() =>
  completedPayments.value.reduce((sum, p) => sum + Number(p.amount || 0), 0),
)

const getStatusClass = (status) =>
  ({
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
  })[status] || 'bg-gray-100 text-gray-700'

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

const formatMoney = (n, ccy = 'USD') =>
  `${ccy} ${Number(n || 0).toFixed(2)}`

const viewReceipt = (payment) => {
  selectedPayment.value = payment
  showReceiptModal.value = true
}

async function load() {
  isLoading.value = true
  error.value = null
  try {
    const res = await paymentApi.list({ per_page: 50 })
    payments.value = res.data || []
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load payments.')
  } finally {
    isLoading.value = false
  }
}

onMounted(load)
</script>

<template>
  <Navbar />
  <div class="payment-history pt-16">
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="container mx-auto max-w-7xl flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payment History</h1>
          <p class="text-sm text-gray-500">Your PayPal transactions for accepted candidates.</p>
        </div>
        <button @click="router.push({ name: 'view-applications' })" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
          Back to Applications
        </button>
      </div>
    </div>

    <div class="container mx-auto max-w-7xl p-6">
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{{ error }}</div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-500">Total Spent</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatMoney(totalSpent) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-2xl font-bold text-green-600">{{ completedPayments.length }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-500">Total Records</p>
          <p class="text-2xl font-bold text-gray-900">{{ payments.length }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 mb-6">
        <button @click="statusFilter = ''" :class="`px-4 py-2 rounded-lg font-medium text-sm ${!statusFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          All ({{ payments.length }})
        </button>
        <button v-for="s in ['pending', 'completed', 'failed', 'refunded']" :key="s"
                @click="statusFilter = s"
                :class="`px-4 py-2 rounded-lg font-medium text-sm capitalize ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          {{ s }}
        </button>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">When</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job / Candidate</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="p in filteredPayments" :key="p.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-700">{{ formatDate(p.created_at) }}</td>
              <td class="px-6 py-4 text-sm">
                <p class="font-medium text-gray-900">{{ p.application?.job?.title || `Application #${p.application_id}` }}</p>
                <p class="text-gray-500">{{ p.application?.candidate?.name || '' }}</p>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ formatMoney(p.amount, p.currency) }}</td>
              <td class="px-6 py-4">
                <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusClass(p.status)}`">{{ p.status }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="viewReceipt(p)" class="text-sm text-blue-600 hover:text-blue-700">Receipt</button>
              </td>
            </tr>
            <tr v-if="!isLoading && filteredPayments.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-400">No payments yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showReceiptModal && selectedPayment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showReceiptModal = false">
      <div class="bg-white rounded-xl max-w-md w-full" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Receipt</h2>
          <button @click="showReceiptModal = false" class="text-gray-400 hover:text-gray-600">×</button>
        </div>
        <div class="p-6 space-y-2 text-sm">
          <p><span class="text-gray-500">Payment id:</span> {{ selectedPayment.id }}</p>
          <p><span class="text-gray-500">PayPal order id:</span> {{ selectedPayment.payment_intent_id }}</p>
          <p><span class="text-gray-500">Method:</span> {{ selectedPayment.payment_method }}</p>
          <p><span class="text-gray-500">Amount:</span> {{ formatMoney(selectedPayment.amount, selectedPayment.currency) }}</p>
          <p><span class="text-gray-500">Status:</span> <span class="capitalize">{{ selectedPayment.status }}</span></p>
          <p><span class="text-gray-500">When:</span> {{ formatDate(selectedPayment.created_at) }}</p>
          <p v-if="selectedPayment.application"><span class="text-gray-500">Application:</span> #{{ selectedPayment.application.id }}</p>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.payment-history {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
