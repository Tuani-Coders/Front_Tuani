import { apiRequest } from './client.js'

export const authApi = {
  register: (payload) =>
    apiRequest('/auth/register', { method: 'POST', body: payload }),

  verifyEmail: (payload) =>
    apiRequest('/auth/verify-email', { method: 'POST', body: payload }),

  resendCode: (payload) =>
    apiRequest('/auth/resend-code', { method: 'POST', body: payload }),

  login: (payload) =>
    apiRequest('/auth/login', { method: 'POST', body: payload }),

  oauthToken: (provider, payload) =>
    apiRequest(`/auth/oauth/${provider}`, { method: 'POST', body: payload }),

  oauthExchange: (provider, payload) =>
    apiRequest(`/auth/oauth/exchange/${provider}`, { method: 'POST', body: payload }),

  adminLoginInit: (payload) =>
    apiRequest('/auth/admin/login-init', { method: 'POST', body: payload, auth: true }),

  adminVerifyCode: (payload) =>
    apiRequest('/auth/admin/verify-code', { method: 'POST', body: payload, auth: true })
}

export function readAuthResponse(data) {
  return {
    userData: data.data ? data.data.user : data.user,
    tokenData: data.data ? data.data.access_token : data.access_token
  }
}
