const LoginView = () => import('@/views/auth/LoginView.vue')
const VerifyAdminView = () => import('@/views/auth/VerifyAdminView.vue')
const VerifyEmailView = () => import('@/views/auth/VerifyEmailView.vue')
const OAuthCallbackView = () => import('@/views/auth/OAuthCallbackView.vue')

export default [
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
  }
]
