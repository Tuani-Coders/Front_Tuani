import { apiRequest } from './client.js'

function withTagQuery(path, tag) {
  if (!tag) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}tag=${encodeURIComponent(tag)}`
}

export const noticiasApi = {
  listPublished: (tag) => apiRequest(withTagQuery('/noticias', tag)),

  listAdmin: (tag) => apiRequest(withTagQuery('/noticias/admin', tag), { auth: true }),

  getPublished: (id) => apiRequest(`/noticias/${id}`),

  getAdmin: (id) => apiRequest(`/noticias/admin/${id}`, { auth: true }),

  create: (payload) =>
    apiRequest('/noticias', { method: 'POST', body: payload, auth: true }),

  update: (id, payload) =>
    apiRequest(`/noticias/${id}`, { method: 'PUT', body: payload, auth: true }),

  remove: (id) =>
    apiRequest(`/noticias/${id}`, { method: 'DELETE', auth: true })
}
