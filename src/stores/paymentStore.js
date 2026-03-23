import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePaymentStore = defineStore('payments', () => {
  const stored = JSON.parse(localStorage.getItem('vuelance_payments') || '[]')
  const payments = ref(stored)

  const persist = () => {
    localStorage.setItem('vuelance_payments', JSON.stringify(payments.value))
  }

  // Getters
  const allPayments = computed(() => payments.value)

  const completedPayments = computed(() =>
    payments.value.filter(p => p.status === 'completed')
  )

  const pendingPayments = computed(() =>
    payments.value.filter(p => p.status === 'pending')
  )

  const getPaymentById = (id) => {
    return payments.value.find(p => p.id === id)
  }

  // Actions
  const createPayment = (jobTitle, companyName, amount = 9.99) => {
    const payment = {
      id: 'PAY-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      jobTitle,
      companyName,
      amount,
      currency: 'USD',
      method: 'paypal',
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
      paypalOrderId: null,
      receipt: null,
    }
    payments.value.push(payment)
    persist()
    return payment
  }

  const completePayment = (paymentId, paypalOrderId) => {
    const payment = payments.value.find(p => p.id === paymentId)
    if (!payment) return null

    payment.status = 'completed'
    payment.completedAt = new Date().toISOString()
    payment.paypalOrderId = paypalOrderId || 'PAYPAL-' + Date.now()
    payment.receipt = {
      receiptNumber: 'REC-' + Date.now().toString(36).toUpperCase(),
      transactionId: payment.paypalOrderId,
      date: payment.completedAt,
      description: `Job posting fee: ${payment.jobTitle} - ${payment.companyName}`,
      amount: payment.amount,
      currency: payment.currency,
      method: 'PayPal',
    }
    persist()
    return payment
  }

  const failPayment = (paymentId, reason) => {
    const payment = payments.value.find(p => p.id === paymentId)
    if (!payment) return null

    payment.status = 'failed'
    payment.failReason = reason || 'Payment was declined or cancelled.'
    persist()
    return payment
  }

  return {
    payments,
    allPayments,
    completedPayments,
    pendingPayments,
    getPaymentById,
    createPayment,
    completePayment,
    failPayment,
  }
})
