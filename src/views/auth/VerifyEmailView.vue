<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { verifyEmail, resendCode, login, error, loading } = useAuth()

const email = ref(route.query.email || '')
const code = ref('')

const handleVerify = async () => {
  try {
    await verifyEmail(email.value, code.value)
    
    // Auto-login using temporary credentials
    const tempCredsStr = sessionStorage.getItem('temp_credentials')
    if (tempCredsStr) {
      try {
        const creds = JSON.parse(tempCredsStr)
        if (creds.username && creds.password) {
          await login(creds.username, creds.password)
          sessionStorage.removeItem('temp_credentials')
          router.push('/dashboard')
          return
        }
      } catch (loginErr) {
        console.error('Error auto-logging in after verification:', loginErr)
      }
    }
    
    // Fallback if no credentials stored
    router.push('/login')
  } catch (err) {
    console.error('Error de verificación:', err)
  }
}

const handleResendCode = async () => {
  if (!email.value) {
    alert('Por favor, introduce tu correo electrónico primero.')
    return
  }
  try {
    const res = await resendCode(email.value)
    alert(res.message || 'Código reenviado. Revisa tu email.')
  } catch (err) {
    console.error('Error al reenviar código:', err)
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
            <h1 class="headline-md">Verificación de email</h1>
            <p class="body-md text-muted">Introduce el código de 6 dígitos enviado a tu correo.</p>
          </div>

          <form @submit.prevent="handleVerify" class="auth-form">
            <div v-if="error" class="error-box">
              {{ error }}
            </div>

            <div class="form-group">
              <label for="email" class="label-md">Email</label>
              <div class="input-icon-wrapper">
                <span class="material-symbols-outlined input-icon">mail</span>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  required 
                  class="form-control" 
                  :readonly="!!route.query.email"
                >
              </div>
            </div>

            <div class="form-group">
              <label for="code" class="label-md">Código de verificación</label>
              <div class="input-icon-wrapper">
                <span class="material-symbols-outlined input-icon">key</span>
                <input 
                  type="text" 
                  id="code" 
                  v-model="code" 
                  required 
                  class="form-control code-input" 
                  placeholder="123456" 
                  maxlength="6"
                >
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="!loading" style="display: inline-flex; align-items: center; gap: 8px;">
                Verificar cuenta
                <span class="material-symbols-outlined" style="font-size: 18px;">verified_user</span>
              </span>
              <span v-else>Verificando...</span>
            </button>

            <div class="auth-footer text-center">
              <p class="body-md text-muted" style="margin: 0;">
                ¿No has recibido el código? <br>
                <button type="button" class="link-resend" @click="handleResendCode" :disabled="loading">Reenviar código</button>
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

