<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { loginInit, verifyAdminCode, error, loading } = useAuth()

const canResend = ref(false)
const resendCooldown = ref(300) // 5 minutos entre reenvios
const resendTimer = ref(null)

const code = ref('')
const email = ref('')
const expiresAt = ref(null) // timestamp de expiracion del backend
const timeLeft = ref(0) // segundos restantes reales
const timerInterval = ref(null)

// Modal de confirmacion para salir
const showExitModal = ref(false)
const pendingNavigation = ref(null)
const isRefreshing = ref(false)

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const calculateTimeLeft = () => {
  if (!expiresAt.value) return 0
  const now = Date.now() / 1000 // segundos
  const remaining = Math.max(0, Math.floor(expiresAt.value - now))
  return remaining
}

onMounted(() => {
  email.value = route.query.email || ''
  expiresAt.value = parseFloat(route.query.expires) || null
  code.value = route.query.code || ''

  if (!email.value) {
    router.push('/login')
    return
  }

  // Si hay expires, calcular tiempo restante
  if (expiresAt.value) {
    timeLeft.value = calculateTimeLeft()
    if (timeLeft.value <= 0) {
      router.push('/login')
      return
    }
    // Iniciar contador regresivo
    timerInterval.value = setInterval(() => {
      timeLeft.value = calculateTimeLeft()
      if (timeLeft.value <= 0) {
        clearInterval(timerInterval.value)
      }
    }, 1000)
  }

  // Iniciar cooldown de reenvio (5 minutos)
  resendCooldown.value = 300
  resendTimer.value = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--
    } else {
      canResend.value = true
      clearInterval(resendTimer.value)
    }
  }, 1000)

  // Alerta si intenta salir de la pagina
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  if (resendTimer.value) {
    clearInterval(resendTimer.value)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const handleBeforeUnload = (e) => {
  // Si aun no ha verificado, mostrar alerta nativa para cerrar/pegar pestaña
  if (timeLeft.value > 0 && !isRefreshing.value) {
    e.preventDefault()
    e.returnValue = '¿Seguro que quieres salir? Necesitas el código para completar el login.'
    return e.returnValue
  }
}

// Confirmacion para navegacion interna (clic en enlaces)
const confirmExit = (navigationTarget) => {
  if (timeLeft.value > 0) {
    pendingNavigation.value = navigationTarget
    showExitModal.value = true
    return false
  }
  return true
}

const stayOnPage = () => {
  showExitModal.value = false
  pendingNavigation.value = null
}

const leavePage = () => {
  showExitModal.value = false
  if (pendingNavigation.value) {
    router.push(pendingNavigation.value)
  }
}

const resendCode = async () => {
  if (!canResend.value) return
  try {
    error.value = null
    const result = await loginInit(email.value)
    // Actualizar timestamp de expiracion
    expiresAt.value = result.data?.expires_at || (Date.now() / 1000 + 300)
    timeLeft.value = calculateTimeLeft()

    // Reiniciar cooldown
    canResend.value = false
    resendCooldown.value = 300
    resendTimer.value = setInterval(() => {
      if (resendCooldown.value > 0) {
        resendCooldown.value--
      } else {
        canResend.value = true
        clearInterval(resendTimer.value)
      }
    }, 1000)
  } catch (err) {
    console.error('Error reenviando:', err)
  }
}

const handleVerify = async () => {
  try {
    await verifyAdminCode(code.value)
    router.push(route.query.redirect || '/dashboard')
  } catch (err) {
    console.error('Error de verificación:', err)
  }
}
</script>

<template>
  <div>
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
              <h1 class="headline-md">Verificación</h1>
              <p class="body-md text-muted" style="margin-bottom: var(--space-md);">
                Hemos enviado un código a <strong>{{ email }}</strong>
              </p>
              <div class="timer-box" :class="{ 'timer-warning': timeLeft < 60 }">
                <span class="timer-label">Expira en:</span>
                <span class="timer-value">{{ formatTime(timeLeft) }}</span>
              </div>
            </div>

            <form @submit.prevent="handleVerify" class="auth-form">
              <div v-if="error" class="error-box">
                {{ error }}
              </div>

              <div class="form-group">
                <label for="code" class="label-md">Código de 6 dígitos</label>
                <div class="input-icon-wrapper">
                  <span class="material-symbols-outlined input-icon">key</span>
                  <input
                    type="text"
                    id="code"
                    v-model="code"
                    required
                    maxlength="6"
                    class="form-control code-input"
                    placeholder="123456"
                  >
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading || code.length < 6">
                <span v-if="!loading" style="display: inline-flex; align-items: center; gap: 8px;">
                  Verificar y entrar
                  <span class="material-symbols-outlined" style="font-size: 18px;">lock_open</span>
                </span>
                <span v-else>Verificando...</span>
              </button>

              <div class="auth-footer text-center">
                <div v-if="timeLeft > 0">
                  <p class="resend-info" style="margin-bottom: var(--space-sm);">
                    ¿No recibiste el código?<br>
                    <button
                      v-if="canResend"
                      type="button"
                      @click="resendCode"
                      class="link-resend"
                      :disabled="loading"
                    >
                      Reenviar ahora
                    </button>
                    <span v-else class="resend-wait" style="font-size: 13px; color: var(--color-outline);">
                      Podrás reenviar cuando el actual expire.
                    </span>
                  </p>
                </div>
                <div v-else>
                  <p class="code-expired" style="color: var(--color-secondary); font-weight: 700; margin-bottom: var(--space-sm);">Código expirado</p>
                  <button
                    v-if="canResend"
                    type="button"
                    @click="resendCode"
                    class="link-resend"
                    :disabled="loading"
                  >
                    Enviar nuevo código
                  </button>
                  <span v-else class="resend-wait" style="font-size: 13px; color: var(--color-outline);">
                    Espera {{ formatTime(resendCooldown) }} para reenviar.
                  </span>
                </div>
                
                <div class="auth-divider" style="margin-block: var(--space-md);">
                  <span>Opciones</span>
                </div>

                <a
                  href="#"
                  class="link-resend"
                  style="font-size: 14px;"
                  @click.prevent="confirmExit('/login')"
                >
                  Cancelar y volver
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmacion para salir -->
    <div v-if="showExitModal" class="modal-overlay" @click="stayOnPage">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3 class="headline-sm">¿Seguro que quieres salir?</h3>
        </div>
        <div class="modal-body">
          <p class="body-md">
            Necesitas el código de verificación para completar el login.
            Si sales ahora, perderás el acceso y deberás solicitar un nuevo código.
          </p>
          <div class="modal-timer" v-if="timeLeft > 0">
            <span class="timer-label">Tiempo restante:</span>
            <span class="timer-value">{{ formatTime(timeLeft) }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="stayOnPage" class="btn btn-primary">
            Quedarme y verificar
          </button>
          <button @click="leavePage" class="btn btn-secondary">
            Salir igualmente
          </button>
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
