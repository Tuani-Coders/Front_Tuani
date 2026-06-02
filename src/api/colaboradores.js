import { apiRequest } from './client.js'

export const colaboradoresApi = {
  listPublished: (tipoColaboracion) => {
    const query = tipoColaboracion
      ? `?tipo_colaboracion=${encodeURIComponent(tipoColaboracion)}`
      : ''
    return apiRequest(`/colaboradores${query}`)
  },

  listByPagina: (paginaId) => apiRequest(`/colaboradores/pagina/${paginaId}`),

  get: (id) => apiRequest(`/colaboradores/${id}`),

  create: (payload) =>
    apiRequest('/colaboradores', { method: 'POST', body: payload, auth: true }),

  update: (id, payload) =>
    apiRequest(`/colaboradores/${id}`, { method: 'PUT', body: payload, auth: true }),

  remove: (id) =>
    apiRequest(`/colaboradores/${id}`, { method: 'DELETE', auth: true })
}
