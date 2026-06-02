import { ref } from 'vue'
import { coursesApi } from '@/api/courses.js'
import { centersApi } from '@/api/centers.js'

export const coursesList = ref([])
export const centersList = ref([])
export const coursesLoading = ref(false)
export const coursesError = ref(null)

const STUDENTS_STORAGE_KEY = 'pen_course_students'
const MAX_IMAGE_URL_LENGTH = 255

const loadStudentsMap = () => {
  try {
    return JSON.parse(localStorage.getItem(STUDENTS_STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

const saveStudentsForCourse = (courseId, students) => {
  const map = loadStudentsMap()
  map[courseId] = students
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(map))
}

export const getStudentsForCourse = (courseId) => {
  const map = loadStudentsMap()
  return Array.isArray(map[courseId]) ? map[courseId] : []
}

export const persistStudentsForCourse = (courseId, students) => {
  saveStudentsForCourse(courseId, students)
  const course = coursesList.value.find((item) => String(item.id) === String(courseId))
  if (course) {
    course.students = students
    course.enrolled = students.length
  }
}

const isLegacyEnglishCourse = (name = '') => {
  const normalized = name.toLowerCase()
  return (
    normalized.includes('python programming') ||
    normalized.includes('web development') ||
    normalized.includes('database course')
  )
}

const inferCategory = (item) => {
  const name = (item.name || '').toLowerCase()

  if (name.includes('grado medio') || name.includes('medium grade') || name.includes('soldadura') || name.includes('mecanizado')) {
    return 'Grado Medio'
  }
  if (name.includes('grado básico') || name.includes('grado basico') || name.includes('basic grade') || name.includes('cocina') || name.includes('electricidad')) {
    return 'Grado Básico'
  }
  if (name.includes('empleo') || name.includes('employment') || name.includes('sociosanitaria')) {
    return 'Empleo'
  }
  if (isLegacyEnglishCourse(item.name)) {
    return 'General'
  }

  return item.category || 'Grado Básico'
}

const isMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ''))

const DEFAULT_COURSE_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=640&q=80'

const SAMPLE_COURSE_DEFINITIONS = [
  {
    code: 'GB-COC-01',
    name: 'Grado Básico en Cocina',
    duration: '2000h',
    description: 'Formación práctica en cocina, manipulación de alimentos y servicio.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=640&q=80'
  },
  {
    code: 'GM-SOL-01',
    name: 'Grado Medio en Soldadura y Calderería',
    duration: '2000h',
    description: 'Itinerario técnico en procesos de soldadura, montaje y seguridad industrial.',
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=640&q=80'
  },
  {
    code: 'EMP-SOC-01',
    name: 'Formación para el Empleo en Atención Sociosanitaria',
    duration: '480h',
    description: 'Capacitación orientada a la inserción laboral en cuidados y atención a personas.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&q=80'
  },
  {
    code: 'GB-ELE-01',
    name: 'Grado Básico en Electricidad',
    duration: '2000h',
    description: 'Instalaciones eléctricas, seguridad y mantenimiento de equipos en entornos reales.',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=640&q=80'
  },
  {
    code: 'GM-MEC-01',
    name: 'Grado Medio en Mecanizado',
    duration: '2000h',
    description: 'Mecanizado por control numérico, lectura de planos y fabricación de piezas.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=640&q=80'
  },
  {
    code: 'EMP-HOS-01',
    name: 'Curso de Hostelería y Restauración',
    duration: '600h',
    description: 'Servicio en sala, barra y cocina para mejorar la empleabilidad en hostelería.',
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&q=80'
  },
  {
    code: 'EMP-WEB-01',
    name: 'Introducción a la Programación Web',
    duration: '320h',
    description: 'Fundamentos de HTML, CSS y JavaScript para iniciarse en desarrollo web.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=80'
  },
  {
    code: 'EMP-COM-01',
    name: 'Atención al Cliente y Comercio',
    duration: '240h',
    description: 'Técnicas de venta, atención al público y gestión básica de punto de venta.',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90edeacd0c5f?w=640&q=80'
  },
  {
    code: 'EMP-PRL-01',
    name: 'Prevención de Riesgos Laborales',
    duration: '60h',
    description: 'Normativa básica de prevención, equipos de protección y cultura de seguridad.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&q=80'
  },
  {
    code: 'EMP-DIG-01',
    name: 'Alfabetización Digital',
    duration: '120h',
    description: 'Uso de ordenador, correo electrónico, documentos y herramientas digitales básicas.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&q=80'
  },
  {
    code: 'GM-ADM-01',
    name: 'Grado Medio en Gestión Administrativa',
    duration: '2000h',
    description: 'Gestión documental, atención administrativa y ofimática aplicada al entorno laboral.',
    imageUrl: 'https://images.unsplash.com/photo-1454165804603-c3d57bc86b40?w=640&q=80'
  },
  {
    code: 'EMP-JAR-01',
    name: 'Jardinería y Espacios Verdes',
    duration: '300h',
    description: 'Mantenimiento de jardines, poda básica y cuidado de zonas verdes urbanas.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=640&q=80'
  }
]

const SAMPLE_IMAGE_BY_NAME = Object.fromEntries(
  SAMPLE_COURSE_DEFINITIONS.map((course) => [course.name.trim().toLowerCase(), course.imageUrl])
)

function extractCourseImage(item) {
  if (item?.image) return item.image
  if (item?.imagen) return item.imagen
  if (Array.isArray(item?.images) && item.images[0]?.url) return item.images[0].url
  return ''
}

function isUsableCourseImage(url) {
  if (!url || typeof url !== 'string') return false
  if (!/^https?:\/\//i.test(url.trim())) return false
  if (url.includes('example.com')) return false
  return url.trim().length <= MAX_IMAGE_URL_LENGTH
}

function pickCourseImageByName(name = '') {
  const key = name.trim().toLowerCase()
  if (SAMPLE_IMAGE_BY_NAME[key]) return SAMPLE_IMAGE_BY_NAME[key]

  if (key.includes('python')) {
    return 'https://images.unsplash.com/photo-1515879218367-d6cb04baf12a?w=640&q=80'
  }
  if (key.includes('web development') || key.includes('desarrollo web') || key.includes('programación')) {
    return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=80'
  }
  if (key.includes('database') || key.includes('base de datos')) {
    return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=640&q=80'
  }
  if (key.includes('cocina') || key.includes('hosteler')) {
    return SAMPLE_IMAGE_BY_NAME['grado básico en cocina'] || DEFAULT_COURSE_IMAGE
  }
  if (key.includes('soldadura') || key.includes('mecaniz')) {
    return SAMPLE_IMAGE_BY_NAME['grado medio en soldadura y calderería'] || DEFAULT_COURSE_IMAGE
  }
  if (key.includes('sociosanit') || key.includes('sanit')) {
    return SAMPLE_IMAGE_BY_NAME['formación para el empleo en atención sociosanitaria'] || DEFAULT_COURSE_IMAGE
  }

  return DEFAULT_COURSE_IMAGE
}

export function mapCourseFromApi(item) {
  const students = getStudentsForCourse(item.id)
  const code = item.code?.trim() || ''
  const imageUrl = extractCourseImage(item)

  return {
    id: item.id,
    code: isMongoId(code) ? '' : code,
    name: item.name,
    category: inferCategory(item),
    duration: item.duration || '',
    enrolled: students.length,
    capacity: 15,
    status: item.status ? 'Activo' : 'Inactivo',
    imageUrl: isUsableCourseImage(imageUrl) ? imageUrl : '',
    imageName: '',
    description: item.description || '',
    centerId: item.centerId,
    centerName: item.center?.name || '',
    students
  }
}

export function mapCourseToApi(form) {
  const payload = {
    name: form.name.trim(),
    description: form.description?.trim() || '',
    duration: form.duration?.trim() || '',
    centerId: form.centerId
  }

  const code = form.code?.trim() || form.id?.trim() || ''
  if (code) payload.code = code

  const imageUrl = (form.imageUrl || '').trim()
  if (/^https?:\/\//i.test(imageUrl) && imageUrl.length <= MAX_IMAGE_URL_LENGTH) {
    payload.image = imageUrl
  }

  return payload
}

export async function fetchCenters() {
  try {
    const response = await centersApi.list()
    centersList.value = response.data || []
  } catch (err) {
    console.error('Error loading centers:', err)
  }
}

export async function fetchPublishedCourses() {
  coursesLoading.value = true
  coursesError.value = null
  try {
    const response = await coursesApi.listPublished()
    coursesList.value = (response.data || []).map(mapCourseFromApi)
  } catch (err) {
    coursesError.value = err.message
    console.error('Error loading published courses:', err)
  } finally {
    coursesLoading.value = false
  }
}

export async function fetchAdminCourses() {
  coursesLoading.value = true
  coursesError.value = null
  try {
    await fetchCenters()
    let response
    try {
      response = await coursesApi.listAdmin()
    } catch (adminErr) {
      console.warn('Admin courses endpoint failed, using public list:', adminErr.message)
      response = await coursesApi.listPublished()
    }
    coursesList.value = (response.data || []).map(mapCourseFromApi)
  } catch (err) {
    coursesError.value = err.message
    coursesList.value = []
    console.error('Error loading admin courses:', err)
  } finally {
    coursesLoading.value = false
  }
}

export async function ensureSampleCourses() {
  await fetchCenters()
  if (!centersList.value.length) return false

  const pickCenterId = (index) => centersList.value[index % centersList.value.length]?.id
  const sampleCourses = SAMPLE_COURSE_DEFINITIONS.map((sample, index) => ({
    ...sample,
    centerId: pickCenterId(index)
  }))

  const existingNames = new Set(coursesList.value.map((course) => (course.name || '').trim().toLowerCase()))
  let createdAny = false

  for (const sample of sampleCourses) {
    if (!sample.centerId) continue
    if (existingNames.has(sample.name.trim().toLowerCase())) continue
    try {
      await coursesApi.create(mapCourseToApi(sample))
      existingNames.add(sample.name.trim().toLowerCase())
      createdAny = true
    } catch (err) {
      console.warn('No se pudo crear curso de ejemplo:', sample.name, err.message)
    }
  }

  if (createdAny) {
    const response = await coursesApi.listAdmin()
    coursesList.value = (response.data || []).map(mapCourseFromApi)
  }

  return createdAny
}

export async function ensureCourseImages() {
  let updatedAny = false

  for (const course of [...coursesList.value]) {
    const targetImage = pickCourseImageByName(course.name)
    if (!isUsableCourseImage(targetImage)) continue
    if (isUsableCourseImage(course.imageUrl)) continue

    try {
      await coursesApi.update(
        course.id,
        mapCourseToApi({
          code: course.code,
          name: course.name,
          description: course.description,
          duration: course.duration,
          centerId: course.centerId,
          imageUrl: targetImage
        })
      )
      updatedAny = true
    } catch (err) {
      console.warn('No se pudo actualizar imagen del curso:', course.name, err.message)
    }
  }

  if (updatedAny) {
    const response = await coursesApi.listAdmin()
    coursesList.value = (response.data || []).map(mapCourseFromApi)
  }

  return updatedAny
}

export async function createCourseItem(form) {
  const response = await coursesApi.create(mapCourseToApi(form))
  const mapped = mapCourseFromApi(response.data)
  mapped.students = []
  coursesList.value.unshift(mapped)
  return mapped
}

export async function updateCourseItem(courseId, form) {
  const response = await coursesApi.update(courseId, mapCourseToApi(form))
  const mapped = mapCourseFromApi(response.data)
  const index = coursesList.value.findIndex((item) => String(item.id) === String(courseId))
  if (index >= 0) {
    mapped.students = coursesList.value[index].students || getStudentsForCourse(courseId)
    mapped.enrolled = mapped.students.length
    coursesList.value[index] = mapped
  }
  return mapped
}

export async function deleteCourseItem(courseId) {
  await coursesApi.remove(courseId)
  coursesList.value = coursesList.value.filter((item) => String(item.id) !== String(courseId))
  const map = loadStudentsMap()
  delete map[courseId]
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(map))
}

export async function syncCourseEnrollment(courseId) {
  const course = coursesList.value.find((item) => String(item.id) === String(courseId))
  if (!course) return
  course.enrolled = getStudentsForCourse(courseId).length
}

export function useCourses() {
  return {
    coursesList,
    centersList,
    coursesLoading,
    coursesError,
    fetchCenters,
    fetchPublishedCourses,
    fetchAdminCourses,
    ensureSampleCourses,
    ensureCourseImages,
    createCourseItem,
    updateCourseItem,
    deleteCourseItem,
    persistStudentsForCourse,
    getStudentsForCourse,
    syncCourseEnrollment,
    mapCourseFromApi,
    mapCourseToApi
  }
}
