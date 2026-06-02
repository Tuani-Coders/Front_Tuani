import { computed, ref } from 'vue'
import { ApiError } from '@/api/client.js'
import { authApi, readAuthResponse } from '@/api/auth.js'

const pendingVerification = ref(false)
const pendingEmail = ref('')
const pendingExpiresAt = ref(null)

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

  const withAuthCall = async (fn) => {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = (username, email, password) =>
    withAuthCall(() => authApi.register({ username, email, password }))

  const verifyEmail = (email, code) =>
    withAuthCall(() => authApi.verifyEmail({ email, code }))

  const resendCode = (email) =>
    withAuthCall(() => authApi.resendCode({ email }))

  const login = async (username, password) => {
    loading.value = true
    error.value = null
    try {
      const data = await authApi.login({ username, password })
      const { userData, tokenData } = readAuthResponse(data)
      setAuth(userData, tokenData)
      return data
    } catch (err) {
      if (err instanceof ApiError) {
        const loginError = new Error(err.message)
        loginError.status = err.status
        loginError.data = err.data
        error.value = err.message
        throw loginError
      }
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
      const data = await authApi.oauthToken(provider, { access_token: accessToken })
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
      const data = await authApi.oauthExchange(provider, { code })
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

  const loginInit = async (email) => {
    loading.value = true
    error.value = null
    try {
      const data = await authApi.adminLoginInit({ email })
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

  const verifyAdminCode = async (code) => {
    loading.value = true
    error.value = null
    try {
      const data = await authApi.adminVerifyCode({ code })
      const { userData, tokenData } = readAuthResponse(data)
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
