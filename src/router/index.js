import { createRouter, createWebHistory } from 'vue-router'

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
      name: 'login',
      component: LoginPage,
      meta: {
        titleKey: 'pages.login.title',
      },
    },
    {
      path: '/dashboard',
      component: DashboardPage,
      children: [
        {
          path: '',
          name: 'dashboard',
          redirect: '/dashboard/monitoring',
        },
        {
          path: 'monitoring',
          name: 'monitoring',
          component: MonitoringTab,
          meta: {
            titleKey: 'pages.dashboard.title',
          },
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: AnalyticsTab,
          meta: {
            titleKey: 'pages.dashboard.title',
          },
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsTab,
          meta: {
            titleKey: 'pages.dashboard.title',
          },
        },
      ],
    },
  ],
})

export default router
