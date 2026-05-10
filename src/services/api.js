/**
 * Single Laravel API client used everywhere in the SPA.
 *
 * Token persistence lives in src/stores/auth.js — this module just
 * reads the current token from localStorage on every request and
 * fires a window event on 401 so the auth store can react.
 */

import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() || 'http://127.0.0.1:8000/api'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const token =
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Let axios pick the right Content-Type for FormData uploads.
  if (config.data instanceof FormData) delete config.headers['Content-Type']
  return config
})

http.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      sessionStorage.removeItem(USER_KEY)
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  },
)

/** Pull a friendly message out of any axios error. */
export function apiErrorMessage(err, fallback = 'Something went wrong.') {
  const data = err?.response?.data
  if (data?.errors && typeof data.errors === 'object') {
    const first = Object.values(data.errors)[0]
    if (Array.isArray(first) && first.length) return first[0]
  }
  return data?.message || err?.message || fallback
}

// ── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (payload) => http.post('/register', payload).then((r) => r.data),
  login: (payload) => http.post('/login', payload).then((r) => r.data),
  logout: () => http.post('/logout').then((r) => r.data),
  me: () => http.get('/me').then((r) => r.data),
}

// ── Public / homepage ───────────────────────────────────────────────────────
export const publicApi = {
  homeData: () => http.get('/home-data').then((r) => r.data),
}

// ── Profile ─────────────────────────────────────────────────────────────────
export const profileApi = {
  show: () => http.get('/profile').then((r) => r.data),
  update: (payload) => {
    // POST /profile may receive multipart for resume/avatar uploads.
    if (payload instanceof FormData) {
      return http.post('/profile', payload).then((r) => r.data)
    }
    return http.post('/profile', payload).then((r) => r.data)
  },
}

// ── Jobs ────────────────────────────────────────────────────────────────────
export const jobApi = {
  list: (params = {}) => http.get('/jobs', { params }).then((r) => r.data),
  // Admin: include `status: 'pending' | 'rejected'`. Employer: include
  // `mine: 1` plus optional status. Otherwise the public list returns
  // approved jobs only.
  show: (id) => http.get(`/jobs/${id}`).then((r) => r.data),
  create: (payload) => http.post('/jobs', payload).then((r) => r.data),
  update: (id, payload) => http.put(`/jobs/${id}`, payload).then((r) => r.data),
  destroy: (id) => http.delete(`/jobs/${id}`).then((r) => r.data),
  approve: (id) => http.post(`/jobs/${id}/approve`).then((r) => r.data),
  reject: (id, reason) =>
    http.post(`/jobs/${id}/reject`, { reason }).then((r) => r.data),
}

// ── Applications ────────────────────────────────────────────────────────────
export const applicationApi = {
  listForJob: (jobId, params = {}) =>
    http.get(`/jobs/${jobId}/applications`, { params }).then((r) => r.data),
  apply: (jobId, payload) =>
    http.post(`/jobs/${jobId}/applications`, payload).then((r) => r.data),
  show: (jobId, applicationId) =>
    http
      .get(`/jobs/${jobId}/applications/${applicationId}`)
      .then((r) => r.data),
  update: (jobId, applicationId, payload) =>
    http
      .put(`/jobs/${jobId}/applications/${applicationId}`, payload)
      .then((r) => r.data),
  withdraw: (jobId, applicationId) =>
    http
      .delete(`/jobs/${jobId}/applications/${applicationId}`)
      .then((r) => r.data),
  updateStatus: (applicationId, status, rejection_reason = null) =>
    http
      .post(`/applications/${applicationId}/status`, {
        status,
        rejection_reason,
      })
      .then((r) => r.data),
}

// ── Payments (PayPal) ───────────────────────────────────────────────────────
export const paymentApi = {
  createOrder: (applicationId, amount, currency = 'USD') =>
    http
      .post(`/applications/${applicationId}/payment/paypal/create`, {
        amount,
        currency,
      })
      .then((r) => r.data),
  captureOrder: (applicationId, paypalOrderId) =>
    http
      .post(`/applications/${applicationId}/payment/paypal/capture`, {
        paypal_order_id: paypalOrderId,
      })
      .then((r) => r.data),
  show: (paymentId) => http.get(`/payments/${paymentId}`).then((r) => r.data),
  list: (params = {}) => http.get('/payments', { params }).then((r) => r.data),
}

// ── Comments ────────────────────────────────────────────────────────────────
export const commentApi = {
  listForJob: (jobId, params = {}) =>
    http.get(`/jobs/${jobId}/comments`, { params }).then((r) => r.data),
  add: (jobId, content) =>
    http.post(`/jobs/${jobId}/comments`, { content }).then((r) => r.data),
  update: (jobId, commentId, content) =>
    http
      .put(`/jobs/${jobId}/comments/${commentId}`, { content })
      .then((r) => r.data),
  destroy: (jobId, commentId) =>
    http.delete(`/jobs/${jobId}/comments/${commentId}`).then((r) => r.data),
  approve: (commentId) =>
    http.post(`/comments/${commentId}/approve`).then((r) => r.data),
}

// ── Categories ──────────────────────────────────────────────────────────────
export const categoryApi = {
  list: () => http.get('/categories').then((r) => r.data),
  create: (payload) => http.post('/categories', payload).then((r) => r.data),
  update: (id, payload) =>
    http.put(`/categories/${id}`, payload).then((r) => r.data),
  destroy: (id) => http.delete(`/categories/${id}`).then((r) => r.data),
}

// ── Companies (aggregated employers) ────────────────────────────────────────
export const companyApi = {
  list: (params = {}) =>
    http.get('/companies', { params }).then((r) => r.data),
  show: (id) => http.get(`/companies/${id}`).then((r) => r.data),
}

// ── Dashboards ──────────────────────────────────────────────────────────────
export const candidateApi = {
  dashboard: () => http.get('/candidate/dashboard').then((r) => r.data),
  applications: () => http.get('/candidate/applications').then((r) => r.data),
}

export const adminApi = {
  dashboard: () => http.get('/admin/dashboard').then((r) => r.data),
  users: (params = {}) =>
    http.get('/admin/users', { params }).then((r) => r.data),
  deleteUser: (id) => http.delete(`/admin/users/${id}`).then((r) => r.data),
  updateUserRole: (id, role) =>
    http.post(`/admin/users/${id}/role`, { role }).then((r) => r.data),
}

export default http
