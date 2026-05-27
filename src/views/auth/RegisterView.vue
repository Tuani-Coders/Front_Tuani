<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { register, loginWithGoogle, error, loading } = useAuth()

let tokenClient = null
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    sessionStorage.setItem('temp_credentials', JSON.stringify({
      username: form.value.username,
      password: form.value.password
    }))
    await register(form.value.username, form.value.email, form.value.password)
    router.push({ name: 'VerifyEmail', query: { email: form.value.email } })
  } catch (err) {
    console.error('Error de registro:', err)
  }
}

onMounted(() => {
  if (typeof google !== 'undefined') {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      callback: async (response) => {
        if (response.access_token) {
          try {
            await loginWithGoogle(response.access_token)
            router.push('/')
          } catch (err) {
            console.error('Error login Google:', err)
          }
        }
      },
    })
  }
})

const handleGoogleLogin = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken()
  } else {
    alert('El servicio de Google no está disponible')
  }
}
</script>

<template>
  <div class="auth-view view">
    <div class="auth-wrapper">
      <!-- Brand Sidebar -->
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <div class="brand-info">
            <img src="../../assets/icons/penascal.png" alt="Logo Peñascal" class="sidebar-logo">
            <span class="brand-tagline">Peñascal</span>
          </div>
          <div class="sidebar-hero-text">
            <h2 class="sidebar-title">Creando oportunidades, tejiendo futuro</h2>
            <p class="sidebar-subtitle">Acceso exclusivo para el personal de administración e instructores autorizados.</p>
          </div>
          <div class="sidebar-footer">
            <p class="sidebar-footer-text">© 2026 Grupo Peñascal · Compromiso social y ético</p>
          </div>
        </div>
      </div>

      <!-- Form Container -->
      <div class="auth-form-container">
        <div class="auth-form-card">
          <div class="auth-header text-center">
            <div class="mobile-logo-container">
              <img src="../../assets/icons/penascal.png" alt="Logo Peñascal" class="auth-logo">
            </div>
            <h1 class="headline-md">Crear una cuenta</h1>
            <p class="body-md text-muted">Únete a la administración de Peñascal Kooperatiba</p>
          </div>

          <form @submit.prevent="handleRegister" class="auth-form">
            <div v-if="error" class="error-box">
              {{ error }}
            </div>

            <div class="form-group">
              <label for="username" class="label-md">Nombre de usuario</label>
              <div class="input-icon-wrapper">
                <span class="material-symbols-outlined input-icon">person</span>
                <input 
                  type="text" 
                  id="username" 
                  v-model="form.username" 
                  required 
                  class="form-control" 
                  placeholder="Ej: juancarlos"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="label-md">Correo electrónico</label>
              <div class="input-icon-wrapper">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  required 
                  class="form-control" 
                  placeholder="tu@grupopenascal.com"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="password" class="label-md">Contraseña</label>
              <div class="input-icon-wrapper">
                <span class="material-symbols-outlined input-icon">lock</span>
                <input 
                  type="password" 
                  id="password" 
                  v-model="form.password" 
                  required 
                  class="form-control" 
                  placeholder="••••••••"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="label-md">Confirmar contraseña</label>
              <div class="input-icon-wrapper">
                <span class="material-symbols-outlined input-icon">lock_reset</span>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="form.confirmPassword" 
                  required 
                  class="form-control" 
                  placeholder="••••••••"
                >
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="!loading" style="display: inline-flex; align-items: center; gap: 8px;">
                Registrarse
                <span class="material-symbols-outlined" style="font-size: 18px;">person_add</span>
              </span>
              <span v-else>Procesando...</span>
            </button>

            <div class="social-auth">
              <div class="auth-divider" style="margin-block: var(--space-md);">
                <span>O regístrate con</span>
              </div>
              
              <button type="button" @click="handleGoogleLogin" class="btn btn-outline w-100 btn-google" :disabled="loading" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700;">
                <img src="../../assets/icons/google.png" alt="Google" class="btn-icon" style="height: 18px; width: 18px;">
                <span>Google Workspace</span>
              </button>
            </div>

            <div class="auth-footer text-center">
              <p class="body-md text-muted" style="margin: 0; margin-top: var(--space-md);">
                ¿Ya tienes una cuenta? <br>
                <RouterLink to="/login" class="link-resend" style="font-weight: 700; text-decoration: underline;">Inicia sesión aquí</RouterLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-100 {
  width: 100%;
}
</style>

