import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/job-post',
      name: 'job-post',
      component: () => import('../views/JobPostPageView.vue'),
    },
  ],
})

export default router
