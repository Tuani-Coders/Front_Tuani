import { createRouter, createWebHistory } from 'vue-router'
import i18n from '../i18n'

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
const NoticiaDetalleView = () => import('../views/NoticiaDetalleView.vue')
const ContactoView = () => import('../views/ContactoView.vue')
const LoginView = () => import('../views/auth/LoginView.vue')
const VerifyAdminView = () => import('../views/auth/VerifyAdminView.vue')
const VerifyEmailView = () => import('../views/auth/VerifyEmailView.vue')
const OAuthCallbackView = () => import('../views/auth/OAuthCallbackView.vue')
const DashboardView = () => import('../views/dashboard/DashboardView.vue')
const EquipoView = () => import('../views/EquipoView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: { titleKey: 'pages.home' }
  },

  /* ── Autenticación (Solo Admin) ─────────────── */
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { titleKey: 'pages.login' }
  },
  {
    path: '/verify-admin',
    name: 'VerifyAdmin',
    component: VerifyAdminView,
    meta: { titleKey: 'pages.verifyAdmin' }
  },
  {
    path: '/verificacion',
    name: 'VerifyEmail',
    component: VerifyEmailView,
    meta: { titleKey: 'pages.verifyEmail' }
  },
  {
    path: '/auth/callback/:provider',
    name: 'OAuthCallback',
    component: OAuthCallbackView,
    meta: { titleKey: 'pages.login' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      titleKey: 'pages.dashboard',
      layout: 'dashboard',
      requiresAuth: true
    }
  },

  /* ── Equipo ────────────────────────────────── */
  {
    path: '/equipo',
    name: 'Equipo',
    component: EquipoView,
    meta: { titleKey: 'pages.team' }
  },

  /* ── Formación ──────────────────────────────── */
  {
    path: '/formacion-profesional',
    name: 'Formación',
    component: FormacionView,
    meta: { titleKey: 'pages.training' }
  },
  {
    path: '/formacion-profesional/grado-basico',
    name: 'GradoBasico',
    component: GradoBasicoView,
    meta: { titleKey: 'pages.basicGrade' }
  },
  {
    path: '/formacion-profesional/grado-medio',
    name: 'GradoMedio',
    component: GradoMedioView,
    meta: { titleKey: 'pages.mediumGrade' }
  },
  {
    path: '/formacion-profesional/formacion-para-el-empleo',
    name: 'FormacionEmpleo',
    component: FormacionEmpleoView,
    meta: { titleKey: 'pages.employmentTraining' }
  },

  /* ── La Cooperativa ─────────────────────────── */
  {
    path: '/la-cooperativa',
    name: 'Cooperativa',
    component: CooperativaView,
    meta: { titleKey: 'pages.cooperative' }
  },
  {
    path: '/la-cooperativa/que-hacemos',
    name: 'QueHacemos',
    component: QueHacemosView,
    meta: { titleKey: 'pages.whatWeDo' }
  },
  {
    path: '/la-cooperativa/cooperan-con-nosotros',
    name: 'Cooperan',
    component: CooperanView,
    meta: { titleKey: 'pages.partners' }
  },
  {
    path: '/la-cooperativa/servicio-de-orientacion',
    name: 'Orientacion',
    component: OrientacionView,
    meta: { titleKey: 'pages.orientation' }
  },

  /* ── Colabora ───────────────────────────────── */
  {
    path: '/colabora',
    name: 'Colabora',
    component: ColaboraView,
    meta: { titleKey: 'pages.collaborate' }
  },
  {
    path: '/colabora/apoyando-proyectos',
    name: 'ApoyandoProyectos',
    component: ApoyandoProyectosView,
    meta: { titleKey: 'pages.supportProjects' }
  },
  {
    path: '/colabora/donando-productos',
    name: 'DonandoProductos',
    component: DonandoProductosView,
    meta: { titleKey: 'pages.donateProducts' }
  },
  {
    path: '/colabora/contratando-empresas',
    name: 'ContratandoEmpresas',
    component: ContratandoEmpresasView,
    meta: { titleKey: 'pages.hireCompanies' }
  },
  {
    path: '/colabora/apoyando-insercion',
    name: 'ApoyandoInsercion',
    component: ApoyandoInsercionView,
    meta: { titleKey: 'pages.supportInsertion' }
  },

  /* ── Noticias ───────────────────────────────── */
  {
    path: '/noticias',
    name: 'Noticias',
    component: NoticiasView,
    meta: { titleKey: 'pages.news' }
  },
  {
    path: '/noticias/:id',
    name: 'NoticiaDetalle',
    component: NoticiaDetalleView,
    meta: { titleKey: 'pages.news' }
  },

  /* ── Contacto ───────────────────────────────── */
  {
    path: '/contacto',
    name: 'Contacto',
    component: ContactoView,
    meta: { titleKey: 'pages.contact' }
  },

  /* ── 404 ────────────────────────────────────── */
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { titleKey: 'pages.notFound' }
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

  document.title = to.meta.titleKey
    ? i18n.global.t(to.meta.titleKey)
    : 'Grupo Peñascal Kooperatiba'
  next()
})

export default router
