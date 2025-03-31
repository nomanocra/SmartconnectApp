import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: {
        title: 'SmartConnect - Login',
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../pages/DashboardPage.vue'),
      meta: {
        title: 'SmartConnect - Dashboard',
      },
    },
  ],
})

// Navigation Guard pour mettre à jour le titre
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'SmartConnect'
  next()
})

export default router
