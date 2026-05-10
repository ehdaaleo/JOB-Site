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

    // Auth
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
      ],
    },
    { path: '/login', redirect: '/auth/login' },
    { path: '/register', redirect: '/auth/register' },

    // Public
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
    {
      path: '/companies/:id',
      name: 'company-detail',
      component: () => import('../views/CompanyDetailView.vue'),
      props: true,
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/PricingPage.vue'),
    },

    // Protected — generic profile + dashboard shortcuts
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/candidate/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      redirect: () => {
        // Use store at navigation time, not at module load.
        const auth = useAuthStore()
        return auth.dashboardRoute
      },
      meta: { requiresAuth: true },
    },

    // Apply for a job (candidate only)
    {
      path: '/apply/:id',
      name: 'apply-job',
      component: () => import('../views/ApplyJobView.vue'),
      props: true,
      meta: { requiresAuth: true, role: 'candidate' },
    },

    // Employer
    {
      path: '/employer',
      meta: { requiresAuth: true, role: 'employer' },
      children: [
        { path: '', redirect: '/employer/dashboard' },
        {
          path: 'dashboard',
          name: 'employer-dashboard',
          component: () =>
            import('../views/employer/EmployerDashboardView.vue'),
        },
        {
          path: 'manage-jobs',
          name: 'manage-jobs',
          component: () => import('../views/employer/ManageJobsView.vue'),
        },
        {
          path: 'post-job',
          name: 'job-post',
          component: () => import('../views/employer/PostJobView.vue'),
        },
        {
          path: 'jobs/:id/edit',
          name: 'edit-job',
          component: () => import('../views/employer/PostJobView.vue'),
          props: true,
        },
        {
          path: 'applications',
          name: 'view-applications',
          component: () =>
            import('../views/employer/ViewApplicationsView.vue'),
        },
        {
          path: 'applications/:applicationId/checkout',
          name: 'application-checkout',
          component: () => import('../views/CheckoutView.vue'),
          props: true,
        },
        {
          path: 'settings',
          name: 'company-settings',
          component: () =>
            import('../views/employer/CompanySettingsView.vue'),
        },
        {
          path: 'payments',
          name: 'payment-history',
          component: () => import('../views/employer/PaymentHistoryView.vue'),
        },
      ],
    },

    // Candidate
    {
      path: '/candidate',
      meta: { requiresAuth: true, role: 'candidate' },
      children: [
        { path: '', redirect: '/candidate/dashboard' },
        {
          path: 'dashboard',
          name: 'candidate-dashboard',
          component: () =>
            import('../views/candidate/CandidateDashboardView.vue'),
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

    // Admin
    {
      path: '/admin',
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        { path: '', redirect: '/admin/dashboard' },
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

    {
      path: '/access-denied',
      name: 'access-denied',
      component: () => import('../views/AccessDeniedView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(_to, _from, saved) {
    return saved || { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAuth && to.meta.role && auth.userRole !== to.meta.role) {
    return { name: 'access-denied' }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return auth.dashboardRoute
  }

  return true
})

export default router
