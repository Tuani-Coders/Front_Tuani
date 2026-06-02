import { ref } from 'vue'
import { noticiasApi } from '@/api/noticias.js'

export const newsList = ref([])
export const newsLoading = ref(false)
export const newsError = ref(null)

const tagToClass = (tag) => {
  if (tag === 'Formación') return 'chip-green'
  if (tag === 'Empresas') return 'chip-blue'
  return 'chip-amber'
}

const formatNewsDate = (isoDate) => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STATUS_TO_API = {
  Publicado: 'published',
  Borrador: 'draft',
  Archivado: 'archived'
}

const STATUS_FROM_API = {
  published: 'Publicado',
  draft: 'Borrador',
  archived: 'Archivado'
}
const MAX_IMAGE_URL_LENGTH = 255
const MAX_GALLERY_URL_LENGTH = 500
const AUTHOR_OVERRIDES_KEY = 'news_author_overrides'

const normalizeTag = (value) => (value || '').trim().toLowerCase()

function isValidHttpUrl(value) {
  if (!value || typeof value !== 'string') return false
  return value.startsWith('http://') || value.startsWith('https://')
}

function loadAuthorOverrides() {
  try {
    const raw = localStorage.getItem(AUTHOR_OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAuthorOverrides(overrides) {
  localStorage.setItem(AUTHOR_OVERRIDES_KEY, JSON.stringify(overrides))
}

function getAuthorOverride(newsId) {
  const overrides = loadAuthorOverrides()
  return overrides[String(newsId)] || ''
}

function setAuthorOverride(newsId, authorName) {
  const key = String(newsId)
  const overrides = loadAuthorOverrides()
  const normalized = (authorName || '').trim()

  if (normalized) {
    overrides[key] = normalized
  } else {
    delete overrides[key]
  }

  saveAuthorOverrides(overrides)
}

function parsePotentialJson(raw) {
  if (typeof raw !== 'string') return null
  const text = raw.trim()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    // Some responses may come with python-like quotes; try a safe normalization.
    try {
      return JSON.parse(text.replace(/'/g, '"'))
    } catch {
      return null
    }
  }
}

function pickAuthorName(authorValue) {
  if (!authorValue) return 'Administrador'

  if (typeof authorValue === 'object') {
    const source = Array.isArray(authorValue) ? authorValue[0] : authorValue
    if (!source) return 'Administrador'
    const name = source.name || ''
    const lastNames = source.lastNames || ''
    const full = `${name} ${lastNames}`.trim()
    return full || 'Administrador'
  }

  if (typeof authorValue === 'string') {
    const parsed = parsePotentialJson(authorValue)
    if (parsed) return pickAuthorName(parsed)
    // If it is a plain non-JSON name, keep it.
    if (!authorValue.includes('{') && !authorValue.includes('[')) {
      return authorValue.trim() || 'Administrador'
    }
  }

  return 'Administrador'
}

let cachedCategories = null
let cachedPages = null

async function getCategories() {
  if (cachedCategories) return cachedCategories
  const response = await noticiasApi.listCategories()
  cachedCategories = response.data || []
  return cachedCategories
}

async function getPages() {
  if (cachedPages) return cachedPages
  const response = await noticiasApi.listPages()
  cachedPages = response.data || []
  return cachedPages
}

function getFallbackTag(item) {
  if (item.category?.name) return item.category.name
  if (item.tag) return item.tag
  return 'Institucional'
}

export function mapNoticiaFromApi(item) {
  const tag = getFallbackTag(item)
  const authorOverride = getAuthorOverride(item.id)
  return {
    id: item.id,
    tag,
    tagClass: tagToClass(tag),
    title: item.title,
    excerpt: item.summary || '',
    content: item.body || '',
    date: formatNewsDate(item.created_at),
    status: STATUS_FROM_API[item.publication_status] || 'Borrador',
    author: authorOverride || pickAuthorName(item.author),
    image: item.image ? 'newspaper' : 'newspaper',
    imageUrl: item.image || '',
    imageName: '',
    additionalImages: item.images || [],
    categoryNewsId: item.categoryNewsId || item.category?.id || null,
    paginaContenidoId: item.paginaContenidoId || item.pagina_contenido?.id || null
  }
}

async function resolveRelationIds(form, currentIds = {}) {
  const [categories, pages] = await Promise.all([getCategories(), getPages()])
  const wantedTag = normalizeTag(form.tag)

  const categoryByTag = categories.find(
    (category) => normalizeTag(category.name) === wantedTag
  )
  const fallbackCategory = categories[0]
  const categoryNewsId =
    categoryByTag?.id ||
    currentIds.categoryNewsId ||
    fallbackCategory?.id ||
    null

  const paginaContenidoId =
    currentIds.paginaContenidoId ||
    pages[0]?.id ||
    null

  if (!categoryNewsId || !paginaContenidoId) {
    throw new Error('No se pudo resolver la categoría o la página de contenido para guardar la noticia')
  }

  return { categoryNewsId, paginaContenidoId }
}

export async function mapNoticiaToApi(form, currentIds = {}) {
  const { categoryNewsId, paginaContenidoId } = await resolveRelationIds(form, currentIds)
  const payload = {
    title: form.title.trim(),
    summary: form.excerpt.trim(),
    body: form.content.trim(),
    publication_status: STATUS_TO_API[form.status] || 'draft',
    categoryNewsId,
    paginaContenidoId
  }

  const imageUrl = (form.imageUrl || '').trim()
  if (isValidHttpUrl(imageUrl) && imageUrl.length <= MAX_IMAGE_URL_LENGTH) {
    payload.image = imageUrl
  }

  const normalizedImages = (form.additionalImages || [])
    .map((img) => ({
      url: (img?.url || '').trim(),
      alt: (img?.name || '').trim()
    }))
    .filter((img) => isValidHttpUrl(img.url) && img.url.length <= MAX_GALLERY_URL_LENGTH)

  if (normalizedImages.length > 0) {
    payload.images = normalizedImages
  }

  return payload
}

export async function fetchPublishedNews(tag = null) {
  newsLoading.value = true
  newsError.value = null
  try {
    let categoryId = null
    if (tag) {
      const categories = await getCategories()
      const match = categories.find((category) => normalizeTag(category.name) === normalizeTag(tag))
      categoryId = match?.id || null
    }

    const response = await noticiasApi.listPublished(categoryId)
    newsList.value = (response.data || []).map(mapNoticiaFromApi)
  } catch (err) {
    newsError.value = err.message
    console.error('Error loading published news:', err)
  } finally {
    newsLoading.value = false
  }
}

export async function fetchAdminNews(tag = null) {
  newsLoading.value = true
  newsError.value = null
  try {
    let response
    try {
      response = await noticiasApi.listAdmin()
    } catch (adminErr) {
      console.warn('Admin news endpoint failed, using public list:', adminErr.message)
      response = await noticiasApi.listPublished()
    }
    let mappedNews = (response.data || []).map(mapNoticiaFromApi)

    if (tag) {
      const normalizedTag = normalizeTag(tag)
      mappedNews = mappedNews.filter((item) => normalizeTag(item.tag) === normalizedTag)
    }

    newsList.value = mappedNews
  } catch (err) {
    newsError.value = err.message
    newsList.value = []
    console.error('Error loading admin news:', err)
  } finally {
    newsLoading.value = false
  }
}

export async function fetchNewsById(id, { admin = false } = {}) {
  const response = admin
    ? await noticiasApi.getAdmin(id)
    : await noticiasApi.getPublished(id)
  return mapNoticiaFromApi(response.data)
}

export async function createNewsItem(form) {
  const payload = await mapNoticiaToApi(form)
  const response = await noticiasApi.create(payload)
  setAuthorOverride(response.data?.id, form.author)
  const mapped = mapNoticiaFromApi(response.data)
  newsList.value.unshift(mapped)
  return mapped
}

export async function updateNewsItem(id, form) {
  const current = newsList.value.find((item) => String(item.id) === String(id))
  const payload = await mapNoticiaToApi(form, {
    categoryNewsId: current?.categoryNewsId || null,
    paginaContenidoId: current?.paginaContenidoId || null
  })
  const response = await noticiasApi.update(id, payload)
  setAuthorOverride(id, form.author)
  const mapped = mapNoticiaFromApi(response.data)
  const index = newsList.value.findIndex((item) => String(item.id) === String(id))
  if (index >= 0) {
    newsList.value[index] = mapped
  }
  return mapped
}

export async function deleteNewsItem(id) {
  await noticiasApi.remove(id)
  setAuthorOverride(id, '')
  newsList.value = newsList.value.filter((item) => String(item.id) !== String(id))
}

export function useNews() {
  return {
    newsList,
    newsLoading,
    newsError,
    fetchPublishedNews,
    fetchAdminNews,
    fetchNewsById,
    createNewsItem,
    updateNewsItem,
    deleteNewsItem,
    mapNoticiaFromApi,
    mapNoticiaToApi
  }
}
