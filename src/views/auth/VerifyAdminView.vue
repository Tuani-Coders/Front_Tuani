<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { verifyAdminCode, error, loading } = useAuth()

const code = ref('')
const email = ref('')

onMounted(() => {
  email.value = route.query.email || ''
  if (!email.value) {
    router.push('/login')
  }
})

const handleVerify = async () => {
  try {
    await verifyAdminCode(code.value)
    router.push('/')
  } catch (err) {
    console.error('Error de verificación:', err)
  }
}
</script>

<template>
  <div class="auth-view view">
    <div class="container auth-container">
      <div class="auth-card card shadow-md">
        <div class="auth-header text-center">
          <h1 class="headline-md">Verificación de seguridad</h1>
          <p class="body-md text-muted">
            Hemos enviado un código a <strong>{{ email }}</strong>
          </p>
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
            <RouterLink to="/login" class="link-forgot">
              Volver al login
            </RouterLink>
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

.auth-footer {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-outline-variant);
}

.w-100 {
  width: 100%;
}

.text-center {
  text-align: center;
}
</style>
