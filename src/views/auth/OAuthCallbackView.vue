<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { setAuth } = useAuth()

const loading = ref(true)
const error = ref(null)
const provider = ref('')

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

onMounted(async () => {
  provider.value = route.params.provider
  const code = route.query.code
  
  if (!code) {
    error.value = 'No se recibió código de autorización'
    loading.value = false
    return
  }
  
  try {
    let accessToken
    
    if (provider.value === 'discord') {
      accessToken = await exchangeDiscordCode(code)
    } else if (provider.value === 'github') {
      accessToken = await exchangeGithubCode(code)
    } else {
      throw new Error('Proveedor no soportado')
    }
    
    if (!accessToken) {
      throw new Error('No se pudo obtener token de acceso')
    }
    
    // Send access token to backend
    const response = await fetch(`${API_BASE_URL}/auth/oauth/${provider.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || `Error en login con ${provider.value}`)
    }
    
    // Save auth data
    const userData = data.data ? data.data.user : data.user
    const tokenData = data.data ? data.data.access_token : data.access_token
    setAuth(userData, tokenData)
    
    // Redirect to home
    router.push('/')
    
  } catch (err) {
    console.error('OAuth error:', err)
    error.value = err.message || 'Error al iniciar sesión'
    loading.value = false
  }
})

async function exchangeDiscordCode(code) {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
  const clientSecret = import.meta.env.VITE_DISCORD_CLIENT_SECRET
  const redirectUri = `${window.location.origin}/auth/callback/discord`
  
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri
  })
  
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  })
  
  if (!response.ok) {
    throw new Error('Error al obtener token de Discord')
  }
  
  const data = await response.json()
  return data.access_token
}

async function exchangeGithubCode(code) {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET
  const redirectUri = `${window.location.origin}/auth/callback/github`
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri
    })
  })
  
  if (!response.ok) {
    throw new Error('Error al obtener token de GitHub')
  }
  
  const data = await response.json()
  return data.access_token
}
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
  background: white;
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
