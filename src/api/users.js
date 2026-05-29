import { apiRequest } from './client.js'

export const usersApi = {
  list: () => apiRequest('/users', { auth: true }),

  get: (userId) => apiRequest(`/users/${userId}`, { auth: true }),

  create: (payload) =>
    apiRequest('/users', { method: 'POST', body: payload, auth: true }),

  update: (userId, payload) =>
    apiRequest(`/users/${userId}`, { method: 'PUT', body: payload, auth: true }),

  remove: (userId) =>
    apiRequest(`/users/${userId}`, { method: 'DELETE', auth: true })
}

export const rolesApi = {
  list: () => apiRequest('/roles', { auth: true })
}
