<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { verifyEmail, resendCode, error, loading } = useAuth()

const email = ref(route.query.email || '')
const code = ref('')

const handleVerify = async () => {
  try {
    await verifyEmail(email.value, code.value)
    alert('Email verificado correctamente. Ahora puedes iniciar sesión.')
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
    <div class="container auth-container">
      <div class="auth-card card shadow-md">
        <div class="auth-header text-center">
          <div class="icon-circle bg-primary-light text-primary mx-auto">
            <span class="material-symbols-outlined">mark_email_unread</span>
          </div>
          <h1 class="headline-md">Verifica tu cuenta</h1>
          <p class="body-md text-muted">Introduce el código de 6 dígitos que hemos enviado a tu email.</p>
        </div>

        <form @submit.prevent="handleVerify" class="auth-form">
          <div v-if="error" class="error-box">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="email" class="label-md">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              required 
              class="form-control" 
              :readonly="!!route.query.email"
            >
          </div>

          <div class="form-group">
            <label for="code" class="label-md">Código de verificación</label>
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

          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            <span v-if="!loading">Verificar Cuenta</span>
            <span v-else>Verificando...</span>
          </button>

          <div class="auth-footer text-center">
            <p class="body-md text-muted">
              ¿No has recibido el código? 
              <button type="button" class="btn-text" @click="handleResendCode" :disabled="loading">Reenviar código</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-view {
  display: flex;
  align-items: center;
  justify-content: center;
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

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-container-high);
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.icon-circle .material-symbols-outlined {
  font-size: 40px;
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
  transition: all var(--transition-base);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
}

.code-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  font-weight: 800;
  font-family: monospace;
  color: var(--color-primary);
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

.btn-text {
  background: none;
  border: none;
  color: var(--color-secondary);
  font-weight: 800;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
}

.btn-text:hover {
  text-decoration: underline;
}

.auth-footer {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-outline-variant);
}

.w-100 {
  width: 100%;
  justify-content: center;
}

.text-center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }
</style>

