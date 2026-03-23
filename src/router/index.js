import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeScreenView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
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
    // Employer Routes
    {
      path: '/employer',
      meta: { requiresAuth: true, role: 'employer' },
      children: [
        {
          path: 'dashboard',
          name: 'employer-dashboard',
          component: () => import('../views/employer/EmployerDashboardView.vue'),
        },
       {
      path: '/job-post',
      name: 'job-post',
      component: () => import('../views/employer/PostJobView.vue'),
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
          path: 'payment/:applicationId',
          name: 'payment-checkout',
          component: () => import('../views/employer/PaymentCheckoutView.vue'),
          props: true,
        },
        {
          path: 'payments',
          name: 'payment-history',
          component: () => import('../views/employer/PaymentHistoryView.vue'),
        },
      ],
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
          name: 'profile',
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
    }
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
router.beforeEach((to, from, next) => {
  // In production: check authentication and roles
  // const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Would redirect to login if not authenticated
    // if (!authStore.isAuthenticated) {
    //   next({ name: 'login', query: { redirect: to.fullPath } })
    //   return
    // }
    
    // Check role-based access
    // if (to.meta.role && authStore.user?.role !== to.meta.role) {
    //   next({ name: 'home' })
    //   return
    // }
  }
  
  next()
})

export default router
