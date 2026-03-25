import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeScreenView.vue'),
    },
    // Auth Routes
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/RegisterView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../views/ForgotPasswordView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../views/ResetPasswordView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'callback/:provider',
          name: 'oauth-callback',
          component: () => import('../views/auth/OAuthCallback.vue'),
          meta: { guestOnly: true },
        },
      ],
    },
    {
      path: '/login',
      redirect: '/auth/login',
    },
    {
      path: '/register',
      redirect: '/auth/register',
    },
    // Main Routes
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/JobsListView.vue'),
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('../views/JobDetailView.vue'),
      props: true,
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../views/CompaniesView.vue'),
    },
    // Protected Routes - Profile & Dashboard
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/candidate/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/candidate/CandidateDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    // Employer Routes
    {
      path: '/employer',
      meta: { requiresAuth: true, role: 'employer' },
      children: [
        {
          path: '',
          redirect: '/employer/dashboard'
        },
        {
          path: 'dashboard',
          name: 'employer-dashboard',
          component: () => import('../views/employer/EmployerDashboardView.vue'),
        },
        {
          path: 'post-job',
          name: 'job-post',
          component: () => import('../views/employer/PostJobView.vue'),
        },
        {
          path: 'job-post',
          redirect: '/employer/post-job'
        },
        {
          path: 'applications',
          name: 'view-applications',
          component: () => import('../views/employer/ViewApplicationsView.vue'),
        },
        {
          path: 'settings',
          name: 'company-settings',
          component: () => import('../views/employer/CompanySettingsView.vue'),
        },
        {
          path: 'payments',
          name: 'payment-history',
          component: () => import('../views/employer/PaymentHistoryView.vue'),
        },
      ],
    },
    // Standalone post-job route (accessible without /employer prefix for direct access)
    {
      path: '/post-job',
      redirect: '/employer/post-job'
    },
    // Candidate Routes
    {
      path: '/candidate',
      meta: { requiresAuth: true, role: 'candidate' },
      children: [
        {
          path: 'dashboard',
          name: 'candidate-dashboard',
          component: () => import('../views/candidate/CandidateDashboardView.vue'),
        },
        {
          path: 'profile',
          name: 'candidate-profile',
          component: () => import('../views/candidate/ProfileView.vue'),
        },
        {
          path: 'applications',
          name: 'my-applications',
          component: () => import('../views/candidate/MyApplicationsView.vue'),
        },
        {
          path: 'saved-jobs',
          name: 'saved-jobs',
          component: () => import('../views/candidate/SavedJobsView.vue'),
        },
      ],
    },
    // Admin Routes
    {
      path: '/admin',
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboardView.vue'),
        },
        {
          path: 'pending-jobs',
          name: 'pending-jobs',
          component: () => import('../views/admin/PendingJobsView.vue'),
        },
        {
          path: 'users',
          name: 'user-management',
          component: () => import('../views/admin/UserManagementView.vue'),
        },
      ],
    },
    // Apply Job Route
    {
      path: '/apply/:id',
      name: 'apply-job',
      component: () => import('../views/ApplyJobView.vue'),
      props: true,
    },
    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation Guards
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const user = authStore.user
  const isAuthenticated = authStore.isAuthenticated

  // Helper function to get redirect path based on role
  const getRoleRedirect = () => {
    if (!user?.role) return { name: 'home' }
    if (user.role === 'candidate') return { name: 'candidate-dashboard' }
    if (user.role === 'employer') return { name: 'employer-dashboard' }
    if (user.role === 'admin') return { name: 'admin-dashboard' }
    return { name: 'home' }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Clear any orphaned storage data
      localStorage.clear()
      sessionStorage.clear()
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Check role-based access
    if (to.meta.role && user?.role !== to.meta.role) {
      return getRoleRedirect()
    }
  }

  // Check if route is for guests only (login, register)
  if (to.meta.guestOnly) {
    if (isAuthenticated) {
      return getRoleRedirect()
    }
  }

  // No redirect needed
  return true
})

export default router
