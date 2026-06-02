const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function getAuthToken() {
  return localStorage.getItem('token')
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    auth = false,
    headers: extraHeaders = {}
  } = options

  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders
  }

  if (auth) {
    const token = getAuthToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.message || 'Error en la petición', {
      status: response.status,
      data
    })
  }

  return data
}
