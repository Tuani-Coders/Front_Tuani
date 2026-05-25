<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { loginInit, error, loading } = useAuth()

const form = ref({
  email: ''
})

const handleLogin = async () => {
  try {
    // Paso 1: Enviar email para verificar admin y enviar codigo
    const result = await loginInit(form.value.email)
    // Redirigir a pagina de verificacion con timestamp de expiracion
    const expiresAt = result.data?.expires_at || (Date.now() / 1000 + 300)
    router.push({
      path: '/verify-admin',
      query: {
        email: form.value.email,
        expires: expiresAt,
        code: result.data?.code || '',
        redirect: route.query.redirect || '/dashboard'
      }
    })
  } catch (err) {
    console.error('Error de login:', err)
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
            <h1 class="headline-md">Entrar a la administración</h1>
            <p class="body-md text-muted">Accede a tu panel de gestión de Peñascal</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <div v-if="error" class="error-box">
              {{ error }}
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
                  placeholder="admin@ejemplo.com"
                >
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading || !form.email">
              <span v-if="!loading" style="display: inline-flex; align-items: center; gap: 8px;">
                Enviar código de acceso
                <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
              </span>
              <span v-else>Enviando...</span>
            </button>
          </form>

          <div class="auth-divider">
            <span>Seguridad</span>
          </div>

          <div class="auth-footer text-center">
            <p class="body-md text-muted" style="margin: 0;">
              Por razones de seguridad, te enviaremos un código de verificación de un solo uso a tu bandeja de entrada.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w-100 {
  width: 100%;
  justify-content: center;
}
</style>
