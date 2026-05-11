<script setup>
import { ref, computed, onMounted } from 'vue'
import { adminApi, paymentApi, apiErrorMessage } from '@/services/api'
import { useToast } from 'vue-toastification'
import Navbar from '@/components/homePageComponents/navbar.vue'
import Footer from '@/components/homePageComponents/footer.vue'

const toast = useToast()

const data = ref(null)
const isLoading = ref(true)
const error = ref(null)
const verifyingId = ref(null)

const stats = computed(() => data.value?.stats || {})
const recent = computed(() => data.value?.recent || [])
const topEmployers = computed(() => data.value?.top_employers || [])
const daily = computed(() => data.value?.daily || [])
const failureReasons = computed(() => data.value?.failure_reasons || [])

const peakDailyCount = computed(() =>
  Math.max(1, ...daily.value.map((d) => d.count || 0)),
)

const formatMoney = (n, ccy = 'USD') =>
  `${ccy} ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—')

const shortDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const employerLabel = (payment) =>
  payment.user?.company_name || payment.user?.name || 'Employer'

const candidateLabel = (payment) =>
  payment.application?.candidate?.name || '—'

const jobLabel = (payment) =>
  payment.application?.job?.title || `App #${payment.application_id}`

const statusClass = (status) =>
  ({
    succeeded: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-purple-100 text-purple-700',
  })[status] || 'bg-gray-100 text-gray-700'

async function load() {
  isLoading.value = true
  error.value = null
  try {
    const res = await adminApi.transactions()
    data.value = res.data ?? res
  } catch (err) {
    error.value = apiErrorMessage(err, 'Failed to load transactions.')
  } finally {
    isLoading.value = false
  }
}

async function verifyOne(payment) {
  verifyingId.value = payment.id
  try {
    await paymentApi.verify(payment.id)
    toast.success('Verified against PayPal.')
    await load()
  } catch (err) {
    toast.error(apiErrorMessage(err, 'Could not verify.'))
  } finally {
    verifyingId.value = null
  }
}

onMounted(load)
</script>

<template>
  <Navbar />
  <div class="bg-slate-50 min-h-screen pb-20 pt-16">
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
          <p class="text-sm text-gray-500">Payments, revenue, and capture diagnostics.</p>
        </div>
        <button @click="load" :disabled="isLoading" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-60">
          {{ isLoading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>

      <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">{{ error }}</div>

      <!-- Headline stats -->
      <div class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Revenue captured</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">
            {{ formatMoney(stats.revenue_captured, stats.currency) }}
          </p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Succeeded</p>
          <p class="text-2xl font-bold text-emerald-600 mt-1">{{ stats.succeeded || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
          <p class="text-2xl font-bold text-yellow-600 mt-1">{{ stats.pending || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Failed</p>
          <p class="text-2xl font-bold text-red-600 mt-1">{{ stats.failed || 0 }}</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Refunded</p>
          <p class="text-2xl font-bold text-purple-600 mt-1">{{ stats.refunded || 0 }}</p>
        </div>
      </div>

      <!-- Daily activity (last 14 days) -->
      <div class="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Last 14 days</h2>
          <p class="text-xs text-gray-500">{{ daily.length }} days · peak {{ peakDailyCount }} txn</p>
        </div>
        <div class="flex items-end justify-between gap-1 h-32" v-if="daily.length">
          <div
            v-for="d in daily"
            :key="d.date"
            class="flex-1 flex flex-col items-center justify-end h-full group"
          >
            <div
              class="w-full rounded-t-md transition-colors"
              :class="d.count ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-gray-100'"
              :style="{ height: `${(d.count / peakDailyCount) * 100}%`, minHeight: d.count ? '4px' : '2px' }"
              :title="`${d.date}: ${d.count} txn / ${formatMoney(d.amount, stats.currency)}`"
            ></div>
            <span class="text-[10px] text-gray-400 mt-1 truncate">{{ shortDate(d.date) }}</span>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500">No activity yet.</p>
      </div>

      <!-- Top earners + failure reasons -->
      <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Top paying employers</h2>
            <p class="text-xs text-gray-500">By total captured amount.</p>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="(row, idx) in topEmployers" :key="row.user?.id" class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {{ idx + 1 }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ row.user?.company_name || row.user?.name || 'Employer' }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ row.txn_count }} transaction(s)</p>
                </div>
              </div>
              <p class="text-sm font-semibold text-emerald-600">{{ formatMoney(row.total_paid, stats.currency) }}</p>
            </div>
            <p v-if="!isLoading && topEmployers.length === 0" class="text-sm text-gray-500">No completed payments yet.</p>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Top failure reasons</h2>
            <p class="text-xs text-gray-500">From the last 50 failed payments.</p>
          </div>
          <div class="p-6 space-y-3">
            <div v-for="row in failureReasons" :key="row.reason" class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ row.reason }}</p>
              </div>
              <span class="text-xs font-bold px-2 py-1 bg-red-50 text-red-700 rounded-full">{{ row.count }}</span>
            </div>
            <p v-if="!isLoading && failureReasons.length === 0" class="text-sm text-gray-500">No failures recorded.</p>
          </div>
        </div>
      </div>

      <!-- Recent transactions -->
      <div class="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Recent transactions</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate / Job</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="p in recent" :key="p.id" class="hover:bg-gray-50">
                <td class="px-6 py-3 text-sm text-gray-700">{{ formatDate(p.created_at) }}</td>
                <td class="px-6 py-3 text-sm text-gray-900">{{ employerLabel(p) }}</td>
                <td class="px-6 py-3 text-sm">
                  <p class="font-medium text-gray-900">{{ candidateLabel(p) }}</p>
                  <p class="text-gray-500 text-xs">{{ jobLabel(p) }}</p>
                </td>
                <td class="px-6 py-3 text-sm font-medium">{{ formatMoney(p.amount, p.currency) }}</td>
                <td class="px-6 py-3">
                  <span :class="`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusClass(p.status)}`">{{ p.status }}</span>
                </td>
                <td class="px-6 py-3 text-right">
                  <button
                    v-if="p.status !== 'succeeded' && p.status !== 'completed'"
                    @click="verifyOne(p)"
                    :disabled="verifyingId === p.id"
                    class="text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-60"
                  >
                    {{ verifyingId === p.id ? 'Verifying…' : 'Verify' }}
                  </button>
                  <span v-else class="text-xs text-gray-400">—</span>
                </td>
              </tr>
              <tr v-if="!isLoading && recent.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-400">No transactions yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>
