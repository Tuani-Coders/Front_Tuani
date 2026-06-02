import { apiRequest } from './client.js'

export const centersApi = {
  list: () => apiRequest('/centros'),

  get: (centerId) => apiRequest(`/centros/${centerId}`)
}
