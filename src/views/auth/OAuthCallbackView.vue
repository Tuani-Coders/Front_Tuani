<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { handleOAuthCallback } = useAuth()

const loading = ref(true)
const error = ref(null)
const provider = ref('')

onMounted(async () => {
  provider.value = route.params.provider
  const code = route.query.code
  const state = route.query.state
  const savedState = localStorage.getItem('oauth_state')
  const redirectTo = localStorage.getItem('oauth_redirect') || '/dashboard'

  if (!code) {
    error.value = 'No se recibió código de autorización'
    loading.value = false
    return
  }

  if (savedState && state !== savedState) {
    error.value = 'La respuesta OAuth no coincide con la sesión iniciada'
    loading.value = false
    return
  }

  try {
    await handleOAuthCallback(provider.value, code)
    localStorage.removeItem('oauth_state')
    localStorage.removeItem('oauth_redirect')
    router.push(redirectTo)
  } catch (err) {
    console.error('OAuth error:', err)
    error.value = err.message || 'Error al iniciar sesión'
    loading.value = false
  }
})
</script>

<template>
  <div class="oauth-callback view">
    <div class="container">
      <div class="callback-card card shadow-md text-center">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <h2 class="headline-sm">Conectando con {{ provider }}...</h2>
          <p class="body-md text-muted">Por favor espera mientras completamos tu inicio de sesión</p>
        </div>
        
        <div v-else-if="error" class="error-state">
          <div class="error-icon">❌</div>
          <h2 class="headline-sm">Error de autenticación</h2>
          <p class="body-md text-muted">{{ error }}</p>
          <button @click="router.push('/login')" class="btn btn-primary mt-md">
            Volver al login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.oauth-callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  background-color: var(--color-surface);
  padding: var(--space-xl) var(--space-md);
}

.callback-card {
  max-width: 480px;
  padding: var(--space-xl);
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-lg);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-outline-variant);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
}

.text-center {
  text-align: center;
}

.mt-md {
  margin-top: var(--space-md);
}
</style>
