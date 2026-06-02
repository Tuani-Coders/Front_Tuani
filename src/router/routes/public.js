const HomeView = () => import('@/views/public/HomeView.vue')
const EquipoView = () => import('@/views/public/EquipoView.vue')
const ContactoView = () => import('@/views/public/ContactoView.vue')
const NotFoundView = () => import('@/views/public/NotFoundView.vue')

export default [
  {
    path: '/',
    name: 'Inicio',
    component: HomeView,
    meta: { titleKey: 'pages.home' }
  },
  {
    path: '/equipo',
    name: 'Equipo',
    component: EquipoView,
    meta: { titleKey: 'pages.team' }
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: ContactoView,
    meta: { titleKey: 'pages.contact' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { titleKey: 'pages.notFound' }
  }
]
