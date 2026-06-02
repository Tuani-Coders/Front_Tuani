import { createRouter, createWebHistory } from 'vue-router'
import i18n from '@/i18n'
import publicRoutes from './routes/public.js'
import authRoutes from './routes/auth.js'
import dashboardRoutes from './routes/dashboard.js'
import formacionRoutes from './routes/formacion.js'
import cooperativaRoutes from './routes/cooperativa.js'
import colaboraRoutes from './routes/colabora.js'
import noticiasRoutes from './routes/noticias.js'

const routes = [
  ...publicRoutes.filter(route => route.name !== 'NotFound'),
  ...authRoutes,
  ...dashboardRoutes,
  ...formacionRoutes,
  ...cooperativaRoutes,
  ...colaboraRoutes,
  ...noticiasRoutes,
  ...publicRoutes.filter(route => route.name === 'NotFound')
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  document.title = to.meta.titleKey
    ? i18n.global.t(to.meta.titleKey)
    : 'Grupo Peñascal Kooperatiba'
  next()
})

export default router
