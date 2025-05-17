import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/utils/authService'

import DashboardPage from '../pages/DashboardPage.vue'
import LoginPage from '../pages/LoginPage.vue'
import MonitoringTab from '../pages/Dashboard/MonitoringTab.vue'
import AnalyticsTab from '../pages/Dashboard/AnalyticsTab.vue'
import SettingsTab from '../pages/Dashboard/SettingsTab.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        titleKey: 'pages.login.title',
      },
    },
    {
      path: '/dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          redirect: '/dashboard/monitoring',
          meta: { requiresAuth: true },
        },
        {
          path: 'monitoring',
          name: 'monitoring',
          component: MonitoringTab,
          meta: {
            titleKey: 'pages.dashboard.title',
            requiresAuth: true,
          },
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: AnalyticsTab,
          meta: {
            titleKey: 'pages.dashboard.title',
            requiresAuth: true,
          },
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsTab,
          meta: {
            titleKey: 'pages.dashboard.title',
            requiresAuth: true,
          },
        },
      ],
    },
  ],
})

// Global navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = useAuth()
  if (to.meta.requiresAuth) {
    const isAuth = await isAuthenticated()
    if (!isAuth) {
      next({ path: '/login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
