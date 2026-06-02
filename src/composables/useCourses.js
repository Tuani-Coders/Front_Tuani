import { ref } from 'vue'
import { coursesApi } from '@/api/courses.js'
import { centersApi } from '@/api/centers.js'

export const coursesList = ref([])
export const centersList = ref([])
export const coursesLoading = ref(false)
export const coursesError = ref(null)

const STUDENTS_STORAGE_KEY = 'pen_course_students'

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

export function mapCourseFromApi(item) {
  const students = getStudentsForCourse(item.id)
  const enrolled = Math.max(Number(item.enrolled) || 0, students.length)
  const code = item.code?.trim() || ''

  return {
    id: item.id,
    code: isMongoId(code) ? '' : code,
    name: item.name,
    category: inferCategory(item),
    duration: item.duration || '',
    enrolled,
    capacity: Number(item.capacity) || 15,
    status: item.course_status || 'Activo',
    imageUrl: item.image || '',
    imageName: '',
    description: item.description || '',
    centerId: item.centerId,
    centerName: item.center?.name || '',
    students
  }
}

export function mapCourseToApi(form) {
  return {
    code: form.code?.trim() || form.id?.trim() || null,
    name: form.name.trim(),
    description: form.description?.trim() || '',
    category: form.category,
    duration: form.duration?.trim() || '',
    image: form.imageUrl || null,
    enrolled: Number(form.enrolled) || 0,
    capacity: Number(form.capacity) || 15,
    course_status: form.status,
    centerId: form.centerId
  }
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
    mapped.enrolled = Math.max(mapped.enrolled, mapped.students.length)
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
  await coursesApi.update(courseId, {
    enrolled: getStudentsForCourse(courseId).length,
    course_status: course.status
  })
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
