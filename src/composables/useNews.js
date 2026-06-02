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

export function mapNoticiaFromApi(item) {
  return {
    id: item.id,
    tag: item.tag,
    tagClass: tagToClass(item.tag),
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    date: formatNewsDate(item.created_at),
    status: item.publication_status,
    author: item.author || 'Administrador',
    image: item.image_icon || 'newspaper',
    imageUrl: item.image_url || '',
    imageName: item.image_name || '',
    additionalImages: item.additional_images || []
  }
}

export function mapNoticiaToApi(form) {
  return {
    title: form.title.trim(),
    tag: form.tag,
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    publication_status: form.status,
    author: form.author?.trim() || 'Administrador',
    image_icon: form.image || null,
    image_url: form.imageUrl || null,
    image_name: form.imageName || null,
    additional_images: (form.additionalImages || []).map((img) => ({
      url: img.url,
      name: img.name || ''
    }))
  }
}

export async function fetchPublishedNews(tag = null) {
  newsLoading.value = true
  newsError.value = null
  try {
    const response = await noticiasApi.listPublished(tag)
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
      response = await noticiasApi.listAdmin(tag)
    } catch (adminErr) {
      console.warn('Admin news endpoint failed, using public list:', adminErr.message)
      response = await noticiasApi.listPublished(tag)
    }
    newsList.value = (response.data || []).map(mapNoticiaFromApi)
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
  const response = await noticiasApi.create(mapNoticiaToApi(form))
  const mapped = mapNoticiaFromApi(response.data)
  newsList.value.unshift(mapped)
  return mapped
}

export async function updateNewsItem(id, form) {
  const response = await noticiasApi.update(id, mapNoticiaToApi(form))
  const mapped = mapNoticiaFromApi(response.data)
  const index = newsList.value.findIndex((item) => String(item.id) === String(id))
  if (index >= 0) {
    newsList.value[index] = mapped
  }
  return mapped
}

export async function deleteNewsItem(id) {
  await noticiasApi.remove(id)
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
