const CooperativaView = () => import('@/views/cooperativa/CooperativaView.vue')
const QueHacemosView = () => import('@/views/cooperativa/QueHacemosView.vue')
const CooperanView = () => import('@/views/cooperativa/CooperanView.vue')
const OrientacionView = () => import('@/views/cooperativa/OrientacionView.vue')

export default [
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
  }
]
