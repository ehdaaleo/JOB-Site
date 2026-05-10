import { defineStore } from 'pinia'
import { ref } from 'vue'
import { paymentApi, apiErrorMessage } from '@/services/api'

/**
 * Thin wrapper around the PayPal create/capture endpoints.
 * The Laravel controller flow is:
 *   1. employer POSTs /applications/{id}/payment/paypal/create with {amount,currency}
 *      → response: { data: { payment_id, paypal_order_id, approval_url, status } }
 *   2. employer is redirected to approval_url (PayPal hosted page)
 *   3. on return, employer POSTs /applications/{id}/payment/paypal/capture with {paypal_order_id}
 *      → response: { data: Payment }
 *
 * No state is persisted in localStorage — the backend is the source of truth.
 */
export const usePaymentStore = defineStore('payments', () => {
  const isLoading = ref(false)
  const error = ref(null)
  const lastOrder = ref(null) // { payment_id, paypal_order_id, approval_url }
  const lastPayment = ref(null)

  async function createOrder(applicationId, amount, currency = 'USD') {
    isLoading.value = true
    error.value = null
    try {
      const res = await paymentApi.createOrder(applicationId, amount, currency)
      lastOrder.value = res.data ?? res
      return lastOrder.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'Could not start PayPal payment.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function captureOrder(applicationId, paypalOrderId) {
    isLoading.value = true
    error.value = null
    try {
      const res = await paymentApi.captureOrder(applicationId, paypalOrderId)
      lastPayment.value = res.data ?? res
      return lastPayment.value
    } catch (err) {
      error.value = apiErrorMessage(err, 'PayPal capture failed.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPayment(paymentId) {
    isLoading.value = true
    error.value = null
    try {
      const res = await paymentApi.show(paymentId)
      return res.data ?? res
    } catch (err) {
      error.value = apiErrorMessage(err, 'Failed to load payment.')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    isLoading,
    error,
    lastOrder,
    lastPayment,
    createOrder,
    captureOrder,
    fetchPayment,
    clearError,
  }
})
