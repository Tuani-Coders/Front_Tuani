import { createRouter, createWebHistory } from 'vue-router'

/* ── Vistas (lazy-loaded) ──────────────────────── */
const HomeView = () => import('../views/HomeView.vue')
const FormacionView = () => import('../views/FormacionView.vue')
const GradoBasicoView = () => import('../views/GradoBasicoView.vue')
const GradoMedioView = () => import('../views/GradoMedioView.vue')
const FormacionEmpleoView = () => import('../views/FormacionEmpleoView.vue')
const CooperativaView = () => import('../views/CooperativaView.vue')
const QueHacemosView = () => import('../views/QueHacemosView.vue')
const CooperanView = () => import('../views/CooperanView.vue')
const OrientacionView = () => import('../views/OrientacionView.vue')
const ColaboraView = () => import('../views/ColaboraView.vue')
const ApoyandoProyectosView = () => import('../views/ApoyandoProyectosView.vue')
const DonandoProductosView = () => import('../views/DonandoProductosView.vue')
const ContratandoEmpresasView = () => import('../views/ContratandoEmpresasView.vue')
const ApoyandoInsercionView = () => import('../views/ApoyandoInsercionView.vue')
const NoticiasView = () => import('../views/NoticiasView.vue')
const ContactoView = () => import('../views/ContactoView.vue')
const LoginView = () => import('../views/auth/LoginView.vue')
const VerifyAdminView = () => import('../views/auth/VerifyAdminView.vue')
const DashboardView = () => import('../views/dashboard/DashboardView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: { title: 'Inicio - Peñascal Koop.' }
  },

  /* ── Autenticación (Solo Admin) ─────────────── */
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Iniciar Sesión - Peñascal Koop.' }
  },
  {
    path: '/verify-admin',
    name: 'VerifyAdmin',
    component: VerifyAdminView,
    meta: { title: 'Verificación Admin - Peñascal Koop.' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      title: 'Dashboard - Peñascal Koop.',
      layout: 'dashboard',
      requiresAuth: true
    }
  },

  /* ── Formación ──────────────────────────────── */
  {
    path: '/formacion-profesional',
    name: 'Formación',
    component: FormacionView,
    meta: { title: 'Formación Profesional - Peñascal Koop.' }
  },
  {
    path: '/formacion-profesional/grado-basico',
    name: 'GradoBasico',
    component: GradoBasicoView,
    meta: { title: 'Grado Básico - Peñascal Koop.' }
  },
  {
    path: '/formacion-profesional/grado-medio',
    name: 'GradoMedio',
    component: GradoMedioView,
    meta: { title: 'Grado Medio - Peñascal Koop.' }
  },
  {
    path: '/formacion-profesional/formacion-para-el-empleo',
    name: 'FormacionEmpleo',
    component: FormacionEmpleoView,
    meta: { title: 'Formación para el Empleo - Peñascal Koop.' }
  },

  /* ── La Cooperativa ─────────────────────────── */
  {
    path: '/la-cooperativa',
    name: 'Cooperativa',
    component: CooperativaView,
    meta: { title: 'Quiénes Somos - Peñascal Koop.' }
  },
  {
    path: '/la-cooperativa/que-hacemos',
    name: 'QueHacemos',
    component: QueHacemosView,
    meta: { title: 'Qué Hacemos - Peñascal Koop.' }
  },
  {
    path: '/la-cooperativa/cooperan-con-nosotros',
    name: 'Cooperan',
    component: CooperanView,
    meta: { title: 'Cooperan con Nosotros - Peñascal Koop.' }
  },
  {
    path: '/la-cooperativa/servicio-de-orientacion',
    name: 'Orientacion',
    component: OrientacionView,
    meta: { title: 'Servicio de Orientación - Peñascal Koop.' }
  },

  /* ── Colabora ───────────────────────────────── */
  {
    path: '/colabora',
    name: 'Colabora',
    component: ColaboraView,
    meta: { title: 'Colabora - Peñascal Koop.' }
  },
  {
    path: '/colabora/apoyando-proyectos',
    name: 'ApoyandoProyectos',
    component: ApoyandoProyectosView,
    meta: { title: 'Apoyando Proyectos - Peñascal Koop.' }
  },
  {
    path: '/colabora/donando-productos',
    name: 'DonandoProductos',
    component: DonandoProductosView,
    meta: { title: 'Donando Productos - Peñascal Koop.' }
  },
  {
    path: '/colabora/contratando-empresas',
    name: 'ContratandoEmpresas',
    component: ContratandoEmpresasView,
    meta: { title: 'Contratando Empresas - Peñascal Koop.' }
  },
  {
    path: '/colabora/apoyando-insercion',
    name: 'ApoyandoInsercion',
    component: ApoyandoInsercionView,
    meta: { title: 'Apoyando Inserción - Peñascal Koop.' }
  },

  /* ── Noticias ───────────────────────────────── */
  {
    path: '/noticias',
    name: 'Noticias',
    component: NoticiasView,
    meta: { title: 'Noticias - Peñascal Koop.' }
  },

  /* ── Contacto ───────────────────────────────── */
  {
    path: '/contacto',
    name: 'Contacto',
    component: ContactoView,
    meta: { title: 'Contacto - Peñascal Koop.' }
  },

  /* ── 404 ────────────────────────────────────── */
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: 'Página no encontrada - Peñascal Koop.' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

/* Actualizar título de la pestaña en cada navegación */
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  document.title = to.meta.title || 'Grupo Peñascal Kooperatiba'
  next()
})

export default router
