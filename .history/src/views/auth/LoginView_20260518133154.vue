<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { login, loginWithGoogle, loginWithDiscord, loginWithGithub, error, loading } = useAuth()

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

const handleDiscordLogin = () => {
  loginWithDiscord()
}

const handleGithubLogin = () => {
  loginWithGithub()
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
            
            <button type="button" @click="handleGoogleLogin" class="btn btn-outline w-100 btn-social btn-google" :disabled="loading">
              <img src="../../assets/icons/google.png" alt="Google" class="btn-icon">
              <span>Iniciar sesión con Google</span>
            </button>

            <button type="button" @click="handleDiscordLogin" class="btn btn-outline w-100 btn-social btn-discord" :disabled="loading">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Iniciar sesión con Discord</span>
            </button>

            <button type="button" @click="handleGithubLogin" class="btn btn-outline w-100 btn-social btn-github" :disabled="loading">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span>Iniciar sesión con GitHub</span>
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

.btn-social {
  font-weight: 600;
  margin-bottom: var(--space-sm);
}

.btn-google {
  color: #3c4043;
}

.btn-discord {
  color: #5865F2;
  border-color: #5865F2;
}

.btn-discord:hover {
  background: #f0f1ff;
  border-color: #4752c4;
}

.btn-github {
  color: #24292f;
  border-color: #d0d7de;
}

.btn-github:hover {
  background: #f6f8fa;
  border-color: #24292f;
}
</style>

