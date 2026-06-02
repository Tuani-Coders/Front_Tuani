import { ref, watch } from 'vue'
import {
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
  ensureSampleCourses,
  ensureCourseImages,
  createCourseItem,
  updateCourseItem,
  deleteCourseItem,
  persistStudentsForCourse,
  getStudentsForCourse,
  syncCourseEnrollment,
  fetchCenters
} from '@/composables/useCourses.js'
import {
  collaborationsList,
  collabsLoading,
  collabsError,
  fetchPublishedCollaborators,
  fetchAdminCollaborators,
  ensureCollaboratorLogos,
  createCollaboratorItem,
  updateCollaboratorItem,
  deleteCollaboratorItem,
  setCollaboratorWorkflow
} from '@/composables/useCollaborators.js'

const messagesList = ref(JSON.parse(localStorage.getItem('pen_messages')) || INITIAL_MESSAGES)
const settings = ref(JSON.parse(localStorage.getItem('pen_settings')) || INITIAL_SETTINGS)

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
    ensureSampleCourses,
    ensureCourseImages,
    fetchCenters,
    createCourseItem,
    updateCourseItem,
    deleteCourseItem,
    persistStudentsForCourse,
    getStudentsForCourse,
    syncCourseEnrollment,
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
    messagesList,
    settings,
    addMessage
  }
}
