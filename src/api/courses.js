import { apiRequest } from './client.js'

export const coursesApi = {
  listPublished: () => apiRequest('/cursos-formaciones'),

  // Backend currently exposes a single listing endpoint.
  listAdmin: () => apiRequest('/cursos-formaciones', { auth: true }),

  listByCenter: (centerId) => apiRequest(`/cursos-formaciones/centro/${centerId}`),

  getPublished: (courseId) => apiRequest(`/cursos-formaciones/${courseId}`),

  getAdmin: (courseId) => apiRequest(`/cursos-formaciones/${courseId}`, { auth: true }),

  create: (payload) =>
    apiRequest('/cursos-formaciones', { method: 'POST', body: payload, auth: true }),

  update: (courseId, payload) =>
    apiRequest(`/cursos-formaciones/${courseId}`, { method: 'PUT', body: payload, auth: true }),

  remove: (courseId) =>
    apiRequest(`/cursos-formaciones/${courseId}`, { method: 'DELETE', auth: true })
}
