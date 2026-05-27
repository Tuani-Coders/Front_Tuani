<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { login, resendCode, loginWithGoogle, error, loading } = useAuth()

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

const redirectTarget = computed(() => route.query.redirect || '/dashboard')
const googleReady = ref(false)
let googleTokenClient = null

const form = ref({
  username: '',
  password: ''
})

const oauthProviders = computed(() => [
  {
    id: 'google',
    label: 'Google',
    icon: 'G',
    enabled: Boolean(GOOGLE_CLIENT_ID && googleReady.value),
    action: handleGoogleLogin
  },
  {
    id: 'discord',
    label: 'Discord',
    icon: 'D',
    enabled: Boolean(DISCORD_CLIENT_ID),
    action: () => redirectToOAuth('discord')
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: 'GH',
    enabled: Boolean(GITHUB_CLIENT_ID),
    action: () => redirectToOAuth('github')
  }
])

onMounted(() => {
  if (GOOGLE_CLIENT_ID && window.google?.accounts?.oauth2) {
    googleTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      callback: async (response) => {
        if (!response.access_token) return
        await loginWithGoogle(response.access_token)
        router.push(redirectTarget.value)
      }
    })
    googleReady.value = true
  }
})

const handleLogin = async () => {
  try {
    await login(form.value.username, form.value.password)
    router.push(redirectTarget.value)
  } catch (err) {
    console.error('Error de login:', err)
    if (err.status === 403 && err.data?.requires_verification) {
      const email = err.data.email
      sessionStorage.setItem('temp_credentials', JSON.stringify({
        username: form.value.username,
        password: form.value.password
      }))
      try {
        await resendCode(email)
      } catch (resendErr) {
        console.error('Error al enviar código de verificación:', resendErr)
      }
      router.push({
        name: 'VerifyEmail',
        query: { email }
      })
    }
  }
}

const handleGoogleLogin = () => {
  if (!googleTokenClient) return
  googleTokenClient.requestAccessToken()
}

const redirectToOAuth = (provider) => {
  const clientId = provider === 'discord' ? DISCORD_CLIENT_ID : GITHUB_CLIENT_ID
  if (!clientId) return

  const callbackUrl = `${window.location.origin}/auth/callback/${provider}`
  const state = crypto.randomUUID()
  localStorage.setItem('oauth_state', state)
  localStorage.setItem('oauth_redirect', redirectTarget.value)

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    state
  })

  if (provider === 'discord') {
    params.set('scope', 'identify email')
    window.location.href = `https://discord.com/oauth2/authorize?${params.toString()}`
    return
  }

  params.set('scope', 'user:email')
  window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`
}
</script>

<template>
  <div class="auth-view view">
    <div class="auth-wrapper">
      <div class="auth-sidebar">
        <div class="sidebar-content">
          <div class="brand-info">
            <img src="../../assets/icons/penascal.png" alt="Logo Peñascal" class="sidebar-logo">
            <span class="brand-tagline">Peñascal</span>
          </div>
          <div class="sidebar-hero-text">
            <h2 class="sidebar-title">Creando oportunidades, tejiendo futuro</h2>
            <p class="sidebar-subtitle">Acceso para equipos autorizados, con contraseña, código interno u OAuth.</p>
          </div>
          <div class="sidebar-footer">
            <p class="sidebar-footer-text">© 2026 Grupo Peñascal · Compromiso social y ético</p>
          </div>
        </div>
      </div>

      <div class="auth-form-container">
        <div class="auth-form-card">
          <div class="auth-header text-center">
            <div class="mobile-logo-container">
              <img src="../../assets/icons/penascal.png" alt="Logo Peñascal" class="auth-logo">
            </div>
            <h1 class="headline-md">Entrar a la administración</h1>
            <p class="body-md text-muted">Elige cómo quieres iniciar sesión</p>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
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
                  placeholder="admin"
                  autocomplete="username"
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
                  autocomplete="current-password"
                >
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading || !form.username || !form.password"
            >
              <span v-if="!loading" class="button-content">
                Entrar
                <span class="material-symbols-outlined">arrow_forward</span>
              </span>
              <span v-else>Comprobando...</span>
            </button>
          </form>

          <div class="auth-divider">
            <span>O entra con OAuth</span>
          </div>

          <div class="oauth-grid">
            <button
              v-for="provider in oauthProviders"
              :key="provider.id"
              type="button"
              class="oauth-button"
              :disabled="loading || !provider.enabled"
              @click="provider.action"
            >
              <span class="oauth-mark">{{ provider.icon }}</span>
              <span>{{ provider.label }}</span>
            </button>
          </div>

          <div class="auth-footer text-center">
            <p class="body-md text-muted">
              Google usa token directo. Discord y GitHub vuelven por <strong>/auth/callback/:provider</strong>.
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

.button-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.button-content .material-symbols-outlined {
  font-size: 18px;
}

.admin-code-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  color: var(--color-on-surface-variant);
  font-weight: 700;
  cursor: pointer;
}

.admin-code-option input {
  width: 16px;
  height: 16px;
}

.admin-code-option .material-symbols-outlined {
  color: var(--color-primary);
  font-size: 20px;
}

.oauth-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.oauth-button {
  min-height: 48px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-sm);
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.oauth-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.oauth-mark {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-surface-container);
  font-size: 11px;
}

@media (max-width: 560px) {
  .oauth-grid {
    grid-template-columns: 1fr;
  }
}
</style>
