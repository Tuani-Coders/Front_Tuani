import { computed, ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

// Estado global (fuera de la función para persistir entre componentes)
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const token = ref(localStorage.getItem('token') || null)
const loading = ref(false)
const error = ref(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value)

  const setAuth = (userData, jwtToken) => {
    user.value = userData
    token.value = jwtToken
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
    if (jwtToken) {
      localStorage.setItem('token', jwtToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const register = async (username, email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error en el registro')
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const verifyEmail = async (email, code) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error en la verificación')
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resendCode = async (email) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error al reenviar código')
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (username, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error en el login')
      
      // La respuesta del backend según GUIA_AUTH tiene { access_token, user } dentro de data
      const userData = data.data ? data.data.user : data.user
      const tokenData = data.data ? data.data.access_token : data.access_token
      setAuth(userData, tokenData)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginWithDiscord = () => {
    const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/discord`)
    const scope = encodeURIComponent('identify email')
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
  }

  const loginWithGithub = () => {
    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback/github`)
    const scope = encodeURIComponent('user:email')
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`
  }

  const loginWithGoogle = async (googleAccessToken) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/oauth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: googleAccessToken })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error en el login con Google')
      
      const userData = data.data ? data.data.user : data.user
      const tokenData = data.data ? data.data.access_token : data.access_token
      setAuth(userData, tokenData)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isLoggedIn,
    register,
    verifyEmail,
    resendCode,
    login,
    loginWithGoogle,
    loginWithDiscord,
    loginWithGithub,
    logout
  }
}
