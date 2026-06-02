const NoticiasView = () => import('@/views/noticias/NoticiasView.vue')
const NoticiaDetalleView = () => import('@/views/noticias/NoticiaDetalleView.vue')

export default [
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
  }
]
