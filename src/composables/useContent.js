import { ref, watch } from 'vue'
import {
  INITIAL_COLLABS,
  INITIAL_MESSAGES,
  INITIAL_SETTINGS
} from '@/data/contentMock.js'
import {
  newsList,
  fetchPublishedNews,
  fetchAdminNews,
  fetchNewsById,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
  newsLoading,
  newsError
} from '@/composables/useNews.js'
import {
  coursesList,
  centersList,
  coursesLoading,
  coursesError,
  fetchPublishedCourses,
  fetchAdminCourses,
  createCourseItem,
  updateCourseItem,
  deleteCourseItem,
  persistStudentsForCourse,
  getStudentsForCourse,
  syncCourseEnrollment,
  fetchCenters
} from '@/composables/useCourses.js'

const loadAndMigrate = (key, initialData) => {
  const stored = localStorage.getItem(key)
  if (!stored) return initialData

  try {
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return initialData

    return parsed.map(item => {
      const match = initialData.find(initItem => initItem.id === item.id)
      if (match) {
        const isWikimedia = item.imageUrl && item.imageUrl.includes('upload.wikimedia.org')
        return {
          ...match,
          ...item,
          imageUrl: (isWikimedia || !item.imageUrl) ? match.imageUrl : item.imageUrl,
          imageName: (isWikimedia || !item.imageName) ? match.imageName : item.imageName,
          additionalImages: item.additionalImages || match.additionalImages || []
        }
      }
      return item
    })
  } catch {
    return initialData
  }
}

const collaborationsList = ref(loadAndMigrate('pen_collabs', INITIAL_COLLABS))
const messagesList = ref(JSON.parse(localStorage.getItem('pen_messages')) || INITIAL_MESSAGES)
const settings = ref(JSON.parse(localStorage.getItem('pen_settings')) || INITIAL_SETTINGS)

watch(collaborationsList, (val) => localStorage.setItem('pen_collabs', JSON.stringify(val)), { deep: true })
watch(messagesList, (val) => localStorage.setItem('pen_messages', JSON.stringify(val)), { deep: true })
watch(settings, (val) => localStorage.setItem('pen_settings', JSON.stringify(val)), { deep: true })

export function useContent() {
  const addMessage = (msg) => {
    messagesList.value.unshift({
      id: Date.now(),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'Pendiente',
      ...msg
    })
  }

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
    coursesList,
    centersList,
    coursesLoading,
    coursesError,
    fetchPublishedCourses,
    fetchAdminCourses,
    fetchCenters,
    createCourseItem,
    updateCourseItem,
    deleteCourseItem,
    persistStudentsForCourse,
    getStudentsForCourse,
    syncCourseEnrollment,
    collaborationsList,
    messagesList,
    settings,
    addMessage
  }
}
