<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { login, loginWithGoogle, error, loading } = useAuth()

let tokenClient = null
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await login(form.value.username, form.value.password)
    router.push('/')
  } catch (err) {
    console.error('Error de login:', err)
  }
}

onMounted(() => {
  // Inicializar Google Token Client
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
  } else {
    console.error('Google SDK no cargado')
  }
})

const handleGoogleLogin = () => {
  if (tokenClient) {
    tokenClient.requestAccessToken()
  } else {
    alert('El servicio de Google no está disponible en este momento.')
  }
}
</script>

<template>
  <div class="auth-view view">
    <div class="container auth-container">
      <div class="auth-card card shadow-md">
        <div class="auth-header text-center">
          <img src="../../assets/icons/penascal.png" alt="Logo" class="auth-logo">
          <h1 class="headline-md">Bienvenido de nuevo</h1>
          <p class="body-md text-muted">Entra en tu área personal de Peñascal</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div v-if="error" class="error-box">
            {{ error }}
          </div>

          <div class="form-group">
            <label for="username" class="label-md">Nombre de usuario</label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              required 
              class="form-control" 
              placeholder="Ej: juancarlos"
            >
          </div>

          <div class="form-group">
            <div class="d-flex justify-between align-center mb-xs">
              <label for="password" class="label-md mb-0">Contraseña</label>
            </div>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              required 
              class="form-control" 
              placeholder="••••••••"
            >
            <div class="text-right mt-xs">
              <RouterLink to="/forgot-password" class="link-forgot">¿Olvidaste tu contraseña?</RouterLink>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else>Cargando...</span>
          </button>

          <div class="social-auth">
            <div class="divider">
              <span>O continúa con</span>
            </div>
            
            <button type="button" @click="handleGoogleLogin" class="btn btn-outline w-100 btn-google" :disabled="loading">
              <img src="../../assets/icons/google.png" alt="Google" class="btn-icon">
              <span>Google</span>
            </button>
          </div>

          <div class="auth-footer text-center">
            <p class="body-md text-muted">
              ¿Aún no tienes cuenta? 
              <RouterLink to="/register" class="link-primary">Regístrate gratis</RouterLink>
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

.auth-logo {
  height: 64px;
  margin-bottom: var(--space-md);
  object-fit: contain;
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

.link-primary {
  color: var(--color-secondary);
  font-weight: 800;
  text-decoration: none;
}

.link-primary:hover {
  text-decoration: underline;
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
  justify-content: center;
}

.d-flex { display: flex; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.mb-0 { margin-bottom: 0; }
.mb-xs { margin-bottom: 4px; }
.mt-xs { margin-top: 4px; }

/* Social Auth Styles */
.social-auth {
  margin-top: var(--space-lg);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: var(--space-md);
  color: var(--color-on-surface-variant);
  font-size: var(--label-md-size);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-outline-variant);
}

.divider:not(:empty)::before {
  margin-right: var(--space-sm);
}

.divider:not(:empty)::after {
  margin-left: var(--space-sm);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--color-outline-variant);
  color: var(--color-on-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.btn-outline:hover {
  background: var(--color-surface-container-low);
  border-color: var(--color-outline);
}

.btn-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.btn-google {
  font-weight: 600;
}
</style>

