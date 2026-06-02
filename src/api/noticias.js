import { apiRequest } from './client.js'

function withCategoryQuery(path, categoryId) {
  if (!categoryId) return path
  const separator = path.includes('?') ? '&' : '?'
  return `${path}${separator}category=${encodeURIComponent(categoryId)}`
}

export const noticiasApi = {
  listPublished: (categoryId) => apiRequest(withCategoryQuery('/news', categoryId)),

  listAdmin: () => apiRequest('/news/admin', { auth: true }),

  getPublished: (id) => apiRequest(`/news/${id}`),

  // Backend does not expose /news/admin/:id at the moment.
  getAdmin: (id) => apiRequest(`/news/${id}`, { auth: true }),

  create: (payload) =>
    apiRequest('/news', { method: 'POST', body: payload, auth: true }),

  update: (id, payload) =>
    apiRequest(`/news/${id}`, { method: 'PUT', body: payload, auth: true }),

  remove: (id) =>
    apiRequest(`/news/${id}`, { method: 'DELETE', auth: true }),

  listCategories: () => apiRequest('/category-news'),

  listPages: () => apiRequest('/paginas-contenido')
}
