const ColaboraView = () => import('@/views/colabora/ColaboraView.vue')
const ApoyandoProyectosView = () => import('@/views/colabora/ApoyandoProyectosView.vue')
const DonandoProductosView = () => import('@/views/colabora/DonandoProductosView.vue')
const ContratandoEmpresasView = () => import('@/views/colabora/ContratandoEmpresasView.vue')
const ApoyandoInsercionView = () => import('@/views/colabora/ApoyandoInsercionView.vue')

export default [
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
  }
]
