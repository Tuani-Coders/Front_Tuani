const DashboardView = () => import('@/views/dashboard/DashboardView.vue')

export default [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      titleKey: 'pages.dashboard',
      layout: 'dashboard',
      requiresAuth: true
    }
  }
]
