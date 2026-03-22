import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/home',
      redirect: '/',
      name: 'home-redirect',
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // Auth routes grouped under /auth
    {
      path: '/auth',
      name: 'auth',
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
      ],
    },
    // Redirect old paths to new auth paths
    {
      path: '/login',
      redirect: '/auth/login',
    },
    {
      path: '/register',
      redirect: '/auth/register',
    },
    {
      path: '/forgot-password',
      redirect: '/auth/forgot-password',
    },
    {
      path: '/reset-password',
      redirect: '/auth/reset-password',
    },
    // Protected routes (example - add more as needed)
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('../views/JobsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('../views/JobDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/applications',
      name: 'applications',
      component: () => import('../views/ApplicationsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

// Navigation guard for auth state
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn

  // If route requires authentication and user is not logged in
  if (to.meta.requiresAuth && !isLoggedIn) {
    // Save the intended destination
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // If trying to access guest-only pages (login, register, etc.) while logged in
  if (to.meta.guestOnly && isLoggedIn && !to.query.switch) {
    next('/')
    return
  }

  next()
})

// After navigation guard - scroll to top
router.afterEach((to, from) => {
  // Scroll to top on route change
  window.scrollTo(0, 0)
})

export default router
