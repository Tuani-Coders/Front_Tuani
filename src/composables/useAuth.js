import { computed, ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

// Estado para verificacion de admin
const pendingVerification = ref(false)
const pendingEmail = ref('')

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

  // Paso 1: Verificar admin y enviar codigo
  const loginInit = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login-init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error en la verificación')
      
      // Guardar estado de verificacion pendiente
      pendingVerification.value = true
      pendingEmail.value = email
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail.value, code })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Código incorrecto')
      
      // Guardar auth y limpiar estado pendiente
      const userData = data.data ? data.data.user : data.user
      const tokenData = data.data ? data.data.access_token : data.access_token
      setAuth(userData, tokenData)
      pendingVerification.value = false
      pendingEmail.value = ''
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
    setAuth,
    register,
    verifyEmail,
    resendCode,
    loginInit,
    verifyAdminCode,
    logout
  }
}
