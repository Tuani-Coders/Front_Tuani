const FormacionView = () => import('@/views/formacion/FormacionView.vue')
const GradoBasicoView = () => import('@/views/formacion/GradoBasicoView.vue')
const GradoMedioView = () => import('@/views/formacion/GradoMedioView.vue')
const FormacionEmpleoView = () => import('@/views/formacion/FormacionEmpleoView.vue')

export default [
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
  }
]
