import { ref } from 'vue'
import { colaboradoresApi } from '@/api/colaboradores.js'
import { noticiasApi } from '@/api/noticias.js'

export const collaborationsList = ref([])
export const collabsLoading = ref(false)
export const collabsError = ref(null)

const MAX_LOGO_URL_LENGTH = 255
const WORKFLOW_OVERRIDES_KEY = 'collab_workflow_overrides'
const LOGO_NAME_OVERRIDES_KEY = 'collab_logo_name_overrides'
const TYPE_OVERRIDES_KEY = 'collab_type_overrides'

const TYPE_CONFIG = {
  'Apoyando Proyectos': { slug: 'apoyando-proyectos', collaboration_type: 'patrocinio' },
  'Donando Productos': { slug: 'donando-productos', collaboration_type: 'patrocinio' },
  'Contratando Empresas': { slug: 'contratando-empresas', collaboration_type: 'empleo' },
  'Apoyando Inserción': { slug: 'apoyando-insercion', collaboration_type: 'practicas' }
}

const SLUG_TO_TYPE = Object.fromEntries(
  Object.entries(TYPE_CONFIG).map(([label, cfg]) => [cfg.slug, label])
)

const WORKFLOW_FROM_API_STATUS = {
  true: 'Aprobada',
  false: 'Rechazada'
}

let cachedPages = null

function isValidHttpUrl(value) {
  if (!value || typeof value !== 'string') return false
  return value.startsWith('http://') || value.startsWith('https://')
}

function formatCollabDate(isoDate) {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function loadWorkflowOverrides() {
  try {
    const raw = localStorage.getItem(WORKFLOW_OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveWorkflowOverrides(overrides) {
  localStorage.setItem(WORKFLOW_OVERRIDES_KEY, JSON.stringify(overrides))
}

function getWorkflowOverride(id) {
  return loadWorkflowOverrides()[String(id)] || null
}

function setWorkflowOverride(id, workflowStatus) {
  const key = String(id)
  const overrides = loadWorkflowOverrides()
  if (workflowStatus) {
    overrides[key] = workflowStatus
  } else {
    delete overrides[key]
  }
  saveWorkflowOverrides(overrides)
}

function loadLogoNameOverrides() {
  try {
    const raw = localStorage.getItem(LOGO_NAME_OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setLogoNameOverride(id, imageName) {
  const key = String(id)
  const overrides = loadLogoNameOverrides()
  const normalized = (imageName || '').trim()
  if (normalized) {
    overrides[key] = normalized
  } else {
    delete overrides[key]
  }
  localStorage.setItem(LOGO_NAME_OVERRIDES_KEY, JSON.stringify(overrides))
}

function loadTypeOverrides() {
  try {
    const raw = localStorage.getItem(TYPE_OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setTypeOverride(id, typeLabel) {
  const key = String(id)
  const overrides = loadTypeOverrides()
  if (typeLabel && TYPE_CONFIG[typeLabel]) {
    overrides[key] = typeLabel
  } else {
    delete overrides[key]
  }
  localStorage.setItem(TYPE_OVERRIDES_KEY, JSON.stringify(overrides))
}

function getTypeOverride(id) {
  return loadTypeOverrides()[String(id)] || null
}

function resolveWorkflowStatus(item) {
  const override = getWorkflowOverride(item.id)
  if (override) return override
  return WORKFLOW_FROM_API_STATUS[item.status === true] || 'Pendiente'
}

async function getPages() {
  if (cachedPages) return cachedPages
  const response = await noticiasApi.listPages()
  cachedPages = response.data || []
  return cachedPages
}

function inferTypeFromItem(item, pagesBySlug) {
  const typeOverride = getTypeOverride(item.id)
  if (typeOverride) return typeOverride

  const pageId = item.paginaContenidoId
  const page = pagesBySlug.byId[pageId]
  if (page?.slug && SLUG_TO_TYPE[page.slug]) {
    return SLUG_TO_TYPE[page.slug]
  }

  if (item.collaboration_type === 'empleo') return 'Contratando Empresas'
  if (item.collaboration_type === 'practicas') return 'Apoyando Inserción'
  if (item.collaboration_type === 'patrocinio') {
    return 'Apoyando Proyectos'
  }

  return 'Apoyando Proyectos'
}

export function mapCollaboratorFromApi(item, pagesBySlug = { byId: {}, bySlug: {} }) {
  const workflowStatus = resolveWorkflowStatus(item)
  const logoNames = loadLogoNameOverrides()

  return {
    id: item.id,
    entity: item.name || '',
    type: inferTypeFromItem(item, pagesBySlug),
    date: formatCollabDate(item.created_at),
    status: workflowStatus,
    apiStatus: item.status === true,
    imageUrl: item.logo || '',
    imageName: logoNames[String(item.id)] || '',
    description: item.description || '',
    email: item.email || '',
    phone: item.phone || '',
    website: item.website || '',
    collaboration_type: item.collaboration_type || '',
    paginaContenidoId: item.paginaContenidoId || null
  }
}

async function buildPagesIndex() {
  const pages = await getPages()
  const byId = {}
  const bySlug = {}
  for (const page of pages) {
    byId[page.id] = page
    if (page.slug) bySlug[page.slug] = page
  }
  return { byId, bySlug, list: pages }
}

async function resolvePaginaAndType(form, currentIds = {}) {
  const pagesIndex = await buildPagesIndex()
  const config = TYPE_CONFIG[form.type] || TYPE_CONFIG['Apoyando Proyectos']
  const page = pagesIndex.bySlug[config.slug] || pagesIndex.list[0]

  if (!page?.id && !currentIds.paginaContenidoId) {
    throw new Error('No se encontró una página de contenido para asociar el colaborador')
  }

  return {
    paginaContenidoId: currentIds.paginaContenidoId || page?.id || null,
    collaboration_type: config.collaboration_type
  }
}

export async function mapCollaboratorToApi(form, currentIds = {}) {
  const { paginaContenidoId, collaboration_type } = await resolvePaginaAndType(form, currentIds)

  const payload = {
    name: form.entity.trim(),
    description: (form.description || '').trim(),
    collaboration_type,
    paginaContenidoId
  }

  const email = (form.email || '').trim()
  if (email) payload.email = email

  const phone = (form.phone || '').trim()
  if (phone) payload.phone = phone

  const website = (form.website || '').trim()
  if (website) payload.website = website

  const logoUrl = (form.imageUrl || '').trim()
  if (isValidHttpUrl(logoUrl) && logoUrl.length <= MAX_LOGO_URL_LENGTH) {
    payload.logo = logoUrl
  }

  return payload
}

export async function fetchPublishedCollaborators(sectionType = null) {
  collabsLoading.value = true
  collabsError.value = null
  try {
    const config = sectionType ? TYPE_CONFIG[sectionType] : null
    const [response, pagesIndex] = await Promise.all([
      config
        ? colaboradoresApi.listPublished(config.collaboration_type)
        : colaboradoresApi.listPublished(),
      buildPagesIndex()
    ])
    let mapped = (response.data || []).map((item) => mapCollaboratorFromApi(item, pagesIndex))
    if (sectionType) {
      mapped = mapped.filter((item) => item.type === sectionType)
    }
    collaborationsList.value = mapped.filter((item) => item.status === 'Aprobada')
  } catch (err) {
    collabsError.value = err.message
    collaborationsList.value = []
    console.error('Error loading published collaborators:', err)
  } finally {
    collabsLoading.value = false
  }
}

export async function fetchAdminCollaborators() {
  collabsLoading.value = true
  collabsError.value = null
  try {
    const pagesIndex = await buildPagesIndex()
    const response = await colaboradoresApi.listPublished()
    const mapped = (response.data || []).map((item) =>
      mapCollaboratorFromApi(item, pagesIndex)
    )
    for (const item of mapped) {
      if (!getTypeOverride(item.id)) {
        setTypeOverride(item.id, item.type)
      }
    }
    collaborationsList.value = mapped.map((item) => ({
      ...item,
      type: getTypeOverride(item.id) || item.type
    }))
  } catch (err) {
    collabsError.value = err.message
    collaborationsList.value = []
    console.error('Error loading admin collaborators:', err)
  } finally {
    collabsLoading.value = false
  }
}

const DEMO_LOGO_BY_TYPE = {
  'Apoyando Proyectos': 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
  'Donando Productos': 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&q=80',
  'Contratando Empresas': 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&q=80',
  'Apoyando Inserción': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80'
}

function needsLogoFix(url) {
  if (!url) return true
  return url.includes('example.com') || url.startsWith('data:')
}

export async function ensureCollaboratorLogos() {
  const token = localStorage.getItem('token')
  if (!token) return

  await fetchAdminCollaborators()

  for (const item of [...collaborationsList.value]) {
    if (!needsLogoFix(item.imageUrl)) continue
    const fallbackLogo = DEMO_LOGO_BY_TYPE[item.type] || DEMO_LOGO_BY_TYPE['Apoyando Proyectos']
    try {
      await colaboradoresApi.update(item.id, { logo: fallbackLogo })
    } catch (err) {
      console.warn('No se pudo actualizar logo de', item.entity, err.message)
    }
  }

  await fetchAdminCollaborators()
}

export async function createCollaboratorItem(form) {
  const payload = await mapCollaboratorToApi(form)
  const response = await colaboradoresApi.create(payload)
  const mapped = mapCollaboratorFromApi(response.data, await buildPagesIndex())
  setWorkflowOverride(mapped.id, form.status || 'Pendiente')
  setTypeOverride(mapped.id, form.type)
  if (form.imageName) setLogoNameOverride(mapped.id, form.imageName)
  mapped.status = form.status || 'Pendiente'
  mapped.type = form.type
  collaborationsList.value = [mapped, ...collaborationsList.value]
  return mapped
}

export async function updateCollaboratorItem(id, form) {
  if (form.status === 'Rechazada') {
    await deleteCollaboratorItem(id)
    return null
  }

  const current = collaborationsList.value.find((c) => String(c.id) === String(id))
  const payload = await mapCollaboratorToApi(form, {
    paginaContenidoId: current?.paginaContenidoId
  })
  const response = await colaboradoresApi.update(id, payload)
  const pagesIndex = await buildPagesIndex()
  const mapped = mapCollaboratorFromApi(response.data, pagesIndex)
  setWorkflowOverride(id, form.status)
  setTypeOverride(id, form.type)
  if (form.imageName) setLogoNameOverride(id, form.imageName)
  mapped.status = form.status
  mapped.type = form.type
  const index = collaborationsList.value.findIndex((c) => String(c.id) === String(id))
  if (index !== -1) {
    collaborationsList.value[index] = mapped
  }
  return mapped
}

export async function deleteCollaboratorItem(id) {
  await colaboradoresApi.remove(id)
  const workflowOverrides = loadWorkflowOverrides()
  delete workflowOverrides[String(id)]
  saveWorkflowOverrides(workflowOverrides)
  const typeOverrides = loadTypeOverrides()
  delete typeOverrides[String(id)]
  localStorage.setItem(TYPE_OVERRIDES_KEY, JSON.stringify(typeOverrides))
  collaborationsList.value = collaborationsList.value.filter((c) => String(c.id) !== String(id))
}

export async function setCollaboratorWorkflow(id, workflowStatus) {
  if (workflowStatus === 'Rechazada') {
    await deleteCollaboratorItem(id)
    return
  }

  setWorkflowOverride(id, workflowStatus)
  const item = collaborationsList.value.find((c) => String(c.id) === String(id))
  if (item) {
    item.status = workflowStatus
    item.apiStatus = true
  }
}

export function useCollaborators() {
  return {
    collaborationsList,
    collabsLoading,
    collabsError,
    fetchPublishedCollaborators,
    fetchAdminCollaborators,
    ensureCollaboratorLogos,
    createCollaboratorItem,
    updateCollaboratorItem,
    deleteCollaboratorItem,
    setCollaboratorWorkflow,
    mapCollaboratorFromApi,
    mapCollaboratorToApi
  }
}
