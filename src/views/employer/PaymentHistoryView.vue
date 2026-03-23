<script setup>
import { ref, computed } from 'vue'
import { usePaymentStore } from '../../stores/paymentStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const paymentStore = usePaymentStore()

const payments = computed(() =>
  [...paymentStore.allPayments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

const statusFilter = ref('')
const selectedPayment = ref(null)
const showReceiptModal = ref(false)

const filteredPayments = computed(() => {
  if (!statusFilter.value) return payments.value
  return payments.value.filter(p => p.status === statusFilter.value)
})

const getStatusClass = (status) => {
  const classes = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const viewReceipt = (payment) => {
  selectedPayment.value = payment
  showReceiptModal.value = true
}

const totalSpent = computed(() =>
  paymentStore.completedPayments.reduce((sum, p) => sum + p.amount, 0)
)
</script>

<template>
  <div class="payment-history">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payment History</h1>
          <p class="text-sm text-gray-500">Your receipts and transaction records</p>
        </div>
        <button @click="router.push({ name: 'view-applications' })" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm">
          Back to Applications
        </button>
      </div>
    </div>

    <div class="p-6">
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" style="grid-template-columns: repeat(4, minmax(0, 1fr));">
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-500">Total Spent</p>
          <p class="text-2xl font-bold text-gray-900">${{ totalSpent.toFixed(2) }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-500">Completed</p>
          <p class="text-2xl font-bold text-green-600">{{ paymentStore.completedPayments.length }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-4">
          <p class="text-sm text-gray-500">Total Transactions</p>
          <p class="text-2xl font-bold text-gray-900">{{ payments.length }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button @click="statusFilter = ''" :class="`px-4 py-2 rounded-lg font-medium text-sm ${!statusFilter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          All ({{ payments.length }})
        </button>
        <button @click="statusFilter = 'completed'" :class="`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          Completed
        </button>
        <button @click="statusFilter = 'failed'" :class="`px-4 py-2 rounded-lg font-medium text-sm ${statusFilter === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`">
          Failed
        </button>
      </div>

      <!-- Payments List -->
      <div class="space-y-4">
        <div v-for="payment in filteredPayments" :key="payment.id" class="bg-white rounded-xl border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ payment.jobTitle }}</h3>
                <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(payment.status)}`">
                  {{ payment.status }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{ payment.companyName }}</p>
              <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>${{ payment.amount.toFixed(2) }} {{ payment.currency }}</span>
                <span>via {{ payment.method === 'paypal' ? 'PayPal' : payment.method }}</span>
                <span>{{ formatDate(payment.createdAt) }}</span>
              </div>
              <p class="text-xs text-gray-400 mt-1">ID: {{ payment.id }}</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                v-if="payment.status === 'completed' && payment.receipt"
                @click="viewReceipt(payment)"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                View Receipt
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPayments.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
        <p class="text-gray-500">Your payment history will appear here once you unlock candidate contacts.</p>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceiptModal && selectedPayment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showReceiptModal = false">
      <div class="bg-white rounded-xl max-w-md w-full" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Payment Receipt</h2>
          <button @click="showReceiptModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="text-center mb-6">
            <p class="text-3xl font-bold text-gray-900">${{ selectedPayment.receipt.amount.toFixed(2) }}</p>
            <p class="text-sm text-green-600 font-medium mt-1">Payment Successful</p>
          </div>

          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Receipt #</span>
              <span class="text-gray-900 font-medium">{{ selectedPayment.receipt.receiptNumber }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Transaction ID</span>
              <span class="text-gray-900 font-medium text-xs">{{ selectedPayment.receipt.transactionId }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Date</span>
              <span class="text-gray-900 font-medium">{{ formatDate(selectedPayment.receipt.date) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Method</span>
              <span class="text-gray-900 font-medium">{{ selectedPayment.receipt.method }}</span>
            </div>
            <hr class="border-gray-200" />
            <div class="text-sm">
              <span class="text-gray-500">Description</span>
              <p class="text-gray-900 mt-1">{{ selectedPayment.receipt.description }}</p>
            </div>
          </div>

          <p class="text-xs text-gray-400 text-center">Sandbox transaction - no real charges applied</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-history {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
