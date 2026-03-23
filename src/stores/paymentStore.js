import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePaymentStore = defineStore('payments', () => {
  // Load from localStorage if available
  const stored = JSON.parse(localStorage.getItem('vuelance_payments') || '[]')
  const payments = ref(stored)

  // Save to localStorage whenever payments change
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

  const getPaymentByApplicationId = (applicationId) => {
    return payments.value.find(p => p.applicationId === applicationId && p.status === 'completed')
  }

  const hasUnlockedContact = (applicationId) => {
    return payments.value.some(
      p => p.applicationId === applicationId && p.status === 'completed'
    )
  }

  // Actions
  const createPayment = (applicationId, jobTitle, candidateName, amount = 4.99) => {
    const payment = {
      id: 'PAY-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      applicationId,
      jobTitle,
      candidateName,
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
      description: `Contact unlock for ${payment.candidateName} - ${payment.jobTitle}`,
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
    getPaymentByApplicationId,
    hasUnlockedContact,
    createPayment,
    completePayment,
    failPayment,
  }
})
