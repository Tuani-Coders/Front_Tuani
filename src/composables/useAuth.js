import { computed, ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

// Estado para verificacion de admin
const pendingVerification = ref(false)
const pendingEmail = ref('')
const pendingExpiresAt = ref(null)

// Estado global (fuera de la función para persistir entre componentes)
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const token = ref(localStorage.getItem('token') || null)
const loading = ref(false)
const error = ref(null)

const readAuthResponse = (data) => ({
  userData: data.data ? data.data.user : data.user,
  tokenData: data.data ? data.data.access_token : data.access_token
})

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

  const updateCurrentUser = (updates) => {
    const nextUser = {
      ...(user.value || {}),
      ...updates,
      profile: {
        ...(user.value?.profile || {}),
        ...(updates.profile || {})
      },
      profileSettings: {
        ...(user.value?.profileSettings || {}),
        ...(updates.profileSettings || {})
      }
    }

    user.value = nextUser
    localStorage.setItem('user', JSON.stringify(nextUser))
    return nextUser
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
      if (!response.ok) {
        const loginError = new Error(data.message || 'Error al iniciar sesión')
        loginError.status = response.status
        loginError.data = data.data
        throw loginError
      }

      const { userData, tokenData } = readAuthResponse(data)
      setAuth(userData, tokenData)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginWithOAuthToken = async (provider, accessToken) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/oauth/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `Error al iniciar sesión con ${provider}`)

      const { userData, tokenData } = readAuthResponse(data)
      setAuth(userData, tokenData)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = (accessToken) => loginWithOAuthToken('google', accessToken)

  const handleOAuthCallback = async (provider, code) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/oauth/exchange/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `Error al conectar con ${provider}`)

      const { userData, tokenData } = readAuthResponse(data)
      setAuth(userData, tokenData)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Paso 1: solicitar codigo admin. El backend exige JWT, asi que debe existir token.
  const loginInit = async (email) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login-init`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error en la verificación')

      // Guardar estado de verificacion pendiente con tiempo de expiracion
      pendingVerification.value = true
      pendingEmail.value = email
      pendingExpiresAt.value = data.data?.expires_at || null
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Paso 2: Verificar codigo y completar login
  const verifyAdminCode = async (code) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/verify-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Código incorrecto')
      
      // Guardar auth y limpiar estado pendiente
      const userData = data.data ? data.data.user : data.user
      const tokenData = data.data ? data.data.access_token : data.access_token
      setAuth(userData, tokenData)
      pendingVerification.value = false
      pendingEmail.value = ''
      pendingExpiresAt.value = null
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
    pendingVerification,
    pendingEmail,
    pendingExpiresAt,
    setAuth,
    register,
    login,
    verifyEmail,
    resendCode,
    loginWithOAuthToken,
    loginWithGoogle,
    handleOAuthCallback,
    loginInit,
    verifyAdminCode,
    updateCurrentUser,
    logout
  }
}
