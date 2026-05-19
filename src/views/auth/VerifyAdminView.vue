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
      <div class="container auth-container">
        <div class="auth-card card shadow-md">
          <div class="auth-header text-center">
            <h1 class="headline-md">Verificación de seguridad</h1>
            <p class="body-md text-muted">
              Hemos enviado un código a <strong>{{ email }}</strong>
            </p>
            <div class="timer-box" :class="{ 'timer-warning': timeLeft < 60 }">
              <span class="timer-label">El código expira en:</span>
              <span class="timer-value">{{ formatTime(timeLeft) }}</span>
            </div>
          </div>

          <form @submit.prevent="handleVerify" class="auth-form">
            <div v-if="error" class="error-box">
              {{ error }}
            </div>

            <div class="form-group">
              <label for="code" class="label-md">Código de verificación</label>
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

            <button type="submit" class="btn btn-primary w-100" :disabled="loading || code.length < 6">
              <span v-if="!loading">Verificar y entrar</span>
              <span v-else>Verificando...</span>
            </button>

            <div class="auth-footer text-center">
              <div v-if="timeLeft > 0">
                <p class="resend-info">
                  ¿No recibiste el código?
                  <button
                    v-if="canResend"
                    type="button"
                    @click="resendCode"
                    class="link-resend"
                    :disabled="loading"
                  >
                    Reenviar ahora
                  </button>
                  <span v-else class="resend-wait">
                    Podrás reenviar cuando el código expire
                  </span>
                </p>
              </div>
              <div v-else>
                <p class="code-expired">Código expirado</p>
                <button
                  v-if="canResend"
                  type="button"
                  @click="resendCode"
                  class="link-resend"
                  :disabled="loading"
                >
                  Enviar nuevo código
                </button>
                <span v-else class="resend-wait">
                  Espera {{ formatTime(resendCooldown) }} para reenviar
                </span>
              </div>
              <br>
              <a
                href="#"
                class="link-forgot"
                @click.prevent="confirmExit('/login')"
              >
                Cancelar y volver al login
              </a>
            </div>
          </form>
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
.auth-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background-color: var(--color-surface);
  padding: var(--space-xl) var(--space-md);
}

.auth-container {
  max-width: 480px;
}

.auth-card {
  padding: var(--space-lg);
  background: white;
  border-radius: var(--radius-lg);
}

.auth-header {
  margin-bottom: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-xs);
  color: var(--color-on-surface);
  font-weight: 700;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
  font-family: var(--font-family);
  font-size: var(--body-md-size);
  text-align: center;
  letter-spacing: 8px;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
}

.code-input {
  font-size: 1.5rem;
  font-weight: 700;
}

.error-box {
  background: var(--color-secondary-container);
  color: var(--color-on-secondary-container);
  padding: var(--space-md);
  border-radius: var(--radius-default);
  margin-bottom: var(--space-md);
  font-size: var(--label-lg-size);
  text-align: center;
  border-left: 4px solid var(--color-secondary);
}

.link-forgot {
  color: var(--color-on-surface-variant);
  font-size: var(--label-lg-size);
  text-decoration: none;
}

.link-forgot:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.resend-wait {
  color: var(--color-on-surface-variant);
  font-size: var(--body-md-size);
  margin: 0;
}

.link-resend {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--body-md-size);
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.link-resend:hover {
  color: var(--color-on-primary-container);
}

.link-resend:disabled {
  color: var(--color-outline);
  cursor: not-allowed;
}

.auth-footer {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-outline-variant);
}

.timer-box {
  background: var(--color-primary-container);
  border-radius: var(--radius-default);
  padding: var(--space-md);
  margin-top: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.timer-label {
  font-size: var(--label-md-size);
  color: var(--color-on-primary-container);
}

.timer-value {
  font-size: var(--headline-md-size);
  font-weight: 700;
  color: var(--color-primary);
  font-family: monospace;
}

.timer-warning {
  background: var(--color-secondary-container);
}

.timer-warning .timer-value {
  color: var(--color-secondary);
}

.w-100 {
  width: 100%;
}

.text-center {
  text-align: center;
}

/* Modal de confirmacion */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
}

.modal-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  animation: modal-slide-in 0.2s ease-out;
}

@keyframes modal-slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-outline-variant);
}

.modal-header h3 {
  margin: 0;
  color: var(--color-on-surface);
}

.modal-body {
  padding: var(--space-lg);
}

.modal-body p {
  margin: 0 0 var(--space-md) 0;
  color: var(--color-on-surface-variant);
  line-height: 1.5;
}

.modal-timer {
  background: var(--color-secondary-container);
  border-radius: var(--radius-default);
  padding: var(--space-md);
  text-align: center;
}

.modal-timer .timer-label {
  display: block;
  font-size: var(--label-md-size);
  color: var(--color-on-secondary-container);
  margin-bottom: var(--space-xs);
}

.modal-timer .timer-value {
  font-size: var(--headline-sm-size);
  font-weight: 700;
  color: var(--color-secondary);
  font-family: monospace;
}

.modal-footer {
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  border-top: 1px solid var(--color-outline-variant);
}

.modal-footer .btn {
  padding: 12px 24px;
  border-radius: var(--radius-default);
  font-size: var(--label-lg-size);
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.modal-footer .btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.modal-footer .btn-primary:hover {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.modal-footer .btn-secondary {
  background: var(--color-surface-variant);
  color: var(--color-on-surface-variant);
  border: 1px solid var(--color-outline);
}

.modal-footer .btn-secondary:hover {
  background: var(--color-outline-variant);
}
</style>
