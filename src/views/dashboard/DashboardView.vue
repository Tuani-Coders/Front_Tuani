<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import MetricCard from '../../components/dashboard/MetricCard.vue'
import { useContent } from '../../composables/useContent'
import { useAuth } from '../../composables/useAuth'

const { 
  newsList, 
  coursesList, 
  collaborationsList, 
  messagesList, 
  settings 
} = useContent()

const { user, updateCurrentUser } = useAuth()

// --- Active Tab State ---
const activeTab = ref('Resumen')

// --- Toast Feedback State ---
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3500)
}

// --- Metrics & Dashboard Overview Data ---
const metrics = computed(() => {
  const publishedCount = newsList.value.filter(n => n.status === 'Publicado').length
  const draftCount = newsList.value.length - publishedCount
  const pendingCollabs = collaborationsList.value.filter(c => c.status === 'Pendiente').length
  const activeCourses = coursesList.value.filter(c => c.status === 'Activo').length
  const unreadMessages = messagesList.value.filter(m => m.status === 'Pendiente').length

  return [
    { label: 'Noticias publicadas', value: publishedCount.toString(), trend: `+${newsList.value.length} total`, helper: `${draftCount} en borrador`, icon: 'newspaper', tone: 'green' },
    { label: 'Solicitudes pendientes', value: pendingCollabs.toString(), trend: 'Requieren revisión', helper: 'Panel de colabora', icon: 'pending_actions', tone: 'red' },
    { label: 'Cursos activos', value: activeCourses.toString(), trend: `${coursesList.value.length} cursos total`, helper: 'Panel de formación', icon: 'school', tone: 'stone' },
    { label: 'Contactos recibidos', value: messagesList.value.length.toString(), trend: 'Buzón de contacto', helper: `${unreadMessages} sin responder`, icon: 'forum', tone: 'green' }
  ]
})

const getTodayDateValue = () => new Date().toISOString().split('T')[0]

const formatTaskDue = (dateValue) => {
  if (!dateValue) return 'Sin fecha'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const defaultTasks = [
  { id: 1, title: 'Revisar inscripciones de Formación para el Empleo', area: 'Formación', priority: 'Alta', assignee: 'Administrador', due: getTodayDateValue(), completed: false },
  { id: 2, title: 'Actualizar portada de la noticia sobre cooperativas', area: 'Noticias', priority: 'Media', assignee: 'Administrador', due: getTodayDateValue(), completed: false },
  { id: 3, title: 'Responder mensajes del formulario de contacto', area: 'Contacto', priority: 'Alta', assignee: 'Administrador', due: getTodayDateValue(), completed: false },
  { id: 4, title: 'Validar logos de entidades colaboradoras', area: 'Colabora', priority: 'Baja', assignee: 'Administrador', due: getTodayDateValue(), completed: false }
]

const tasks = ref(JSON.parse(localStorage.getItem('pen_tasks')) || defaultTasks)

const taskForm = reactive({
  title: '',
  area: 'Noticias',
  priority: 'Media',
  assignee: '',
  due: getTodayDateValue()
})

const activity = ref([
  { time: '09:20', text: 'Nueva solicitud recibida desde Contacto' },
  { time: '10:05', text: 'Borrador de noticia guardado' },
  { time: '11:30', text: 'Curso de Grado Medio actualizado' },
  { time: '13:10', text: 'Usuario admin inició sesión' }
])

const contentModules = computed(() => {
  const newsDrafts = newsList.value.filter(n => n.status === 'Borrador').length
  const pendingCollabs = collaborationsList.value.filter(c => c.status === 'Pendiente').length

  return [
    { label: 'Noticias', value: `${newsDrafts} borradores`, icon: 'article', tone: 'red' },
    { label: 'Formación', value: `${coursesList.value.length} cursos totales`, icon: 'cast_for_education', tone: 'green' },
    { label: 'Colabora', value: `${pendingCollabs} pendientes`, icon: 'handshake', tone: 'stone' }
  ]
})

// --- News Module State ---
const newsSearchQuery = ref('')

const filteredNews = computed(() => {
  if (!newsSearchQuery.value.trim()) return newsList.value
  const query = newsSearchQuery.value.toLowerCase()
  return newsList.value.filter(n => 
    n.title.toLowerCase().includes(query) || 
    (n.excerpt && n.excerpt.toLowerCase().includes(query)) || 
    n.tag.toLowerCase().includes(query)
  )
})

// --- Training Module State ---
const courseSearchQuery = ref('')
const expandedCourseId = ref('')

const getCourseEnrollment = (course) => {
  const studentsCount = Array.isArray(course.students) ? course.students.length : 0
  return Math.max(Number(course.enrolled) || 0, studentsCount)
}

const getCourseStudents = (course) => Array.isArray(course.students) ? course.students : []

const getCourseCapacity = (course) => Number(course.capacity) || 0

const getCourseOccupancy = (course) => {
  const capacity = getCourseCapacity(course)
  if (!capacity) return 0
  return Math.min(100, (getCourseEnrollment(course) / capacity) * 100)
}

const isCourseFull = (course) => {
  const capacity = getCourseCapacity(course)
  return capacity > 0 && getCourseEnrollment(course) >= capacity
}

const syncCourseStatus = (course) => {
  if (!course) return
  if (isCourseFull(course)) {
    course.status = 'Completo'
  } else if (course.status === 'Completo') {
    course.status = 'Activo'
  }
}

const toggleCourseStudents = (courseId) => {
  expandedCourseId.value = expandedCourseId.value === courseId ? '' : courseId
}

const filteredCourses = computed(() => {
  if (!courseSearchQuery.value.trim()) return coursesList.value
  const query = courseSearchQuery.value.toLowerCase()
  return coursesList.value.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.id.toLowerCase().includes(query) ||
    c.category.toLowerCase().includes(query)
  )
})

// --- Collaborations State ---
const collabSearchQuery = ref('')

const filteredCollabs = computed(() => {
  if (!collabSearchQuery.value.trim()) return collaborationsList.value
  const query = collabSearchQuery.value.toLowerCase()
  return collaborationsList.value.filter(c => 
    c.entity.toLowerCase().includes(query) || 
    c.type.toLowerCase().includes(query)
  )
})

// --- Messages State ---
const selectedMessageId = ref(1)
const selectedMessage = computed(() => {
  return messagesList.value.find(m => m.id === selectedMessageId.value)
})

const toggleMessageStatus = (msg) => {
  msg.status = msg.status === 'Pendiente' ? 'Leído' : 'Pendiente'
  showToast(`Mensaje marcado como ${msg.status.toLowerCase()}`)
}

const deleteMessage = (id) => {
  const index = messagesList.value.findIndex(m => m.id === id)
  if (index !== -1) {
    messagesList.value.splice(index, 1)
    if (selectedMessageId.value === id && messagesList.value.length > 0) {
      selectedMessageId.value = messagesList.value[0].id
    } else if (messagesList.value.length === 0) {
      selectedMessageId.value = null
    }
    showToast('Mensaje eliminado', 'error')
  }
}

const replyText = ref('')
const sendMockReply = () => {
  if (!replyText.value.trim()) return
  showToast(`Respuesta enviada a ${selectedMessage.value.email} con éxito`)
  replyText.value = ''
  selectedMessage.value.status = 'Leído'
}

// --- Settings Action ---
const saveSettings = () => {
  showToast('Configuración general guardada con éxito')
}

// --- Profile State ---
const avatarPresets = [
  { label: 'AP', color: '#b52424' },
  { label: 'MK', color: '#003429' },
  { label: 'IR', color: '#9a680d' },
  { label: 'LS', color: '#2e7d32' },
  { label: 'TU', color: '#475569' },
  { label: 'PE', color: '#7c2d12' }
]

const profileForm = reactive({
  username: '',
  email: '',
  name: '',
  lastNames: '',
  telefono: '',
  bio: '',
  avatarImage: '',
  avatarPreset: '',
  avatarColor: '#b52424'
})

const profileInitials = computed(() => {
  const source = `${profileForm.name} ${profileForm.lastNames}`.trim() || profileForm.username || 'Admin'
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
})

const loadProfileForm = () => {
  const currentUser = user.value || {}
  const profile = currentUser.profile || {}
  const profileSettings = currentUser.profileSettings || {}

  profileForm.username = currentUser.username || ''
  profileForm.email = currentUser.email || ''
  profileForm.name = profile.name || ''
  profileForm.lastNames = profile.lastNames || ''
  profileForm.telefono = profile.telefono || ''
  profileForm.bio = profile.bio || ''
  profileForm.avatarImage = profileSettings.avatarImage || ''
  profileForm.avatarPreset = profileSettings.avatarPreset || ''
  profileForm.avatarColor = profileSettings.avatarColor || avatarPresets[0].color
}

const selectAvatarPreset = (preset) => {
  profileForm.avatarPreset = preset.label
  profileForm.avatarColor = preset.color
  profileForm.avatarImage = ''
}

const useInitialsAvatar = () => {
  profileForm.avatarPreset = ''
  profileForm.avatarImage = ''
}

const handleProfileImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Selecciona una imagen válida para el perfil', 'error')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    profileForm.avatarImage = reader.result
    profileForm.avatarPreset = ''
  }
  reader.readAsDataURL(file)
}

const saveProfile = async () => {
  if (!profileForm.username.trim() || !profileForm.email.trim()) {
    showToast('El nombre de usuario y el email son obligatorios', 'error')
    return
  }

  const updates = {
    username: profileForm.username.trim(),
    email: profileForm.email.trim(),
    profile: {
      name: profileForm.name.trim(),
      lastNames: profileForm.lastNames.trim(),
      telefono: profileForm.telefono.trim(),
      bio: profileForm.bio.trim()
    },
    profileSettings: {
      avatarImage: profileForm.avatarImage,
      avatarPreset: profileForm.avatarPreset,
      avatarColor: profileForm.avatarColor
    }
  }

  // Actualizar localmente primero para feedback inmediato
  updateCurrentUser(updates)

  // Sincronizar con el servidor
  try {
    const tokenVal = localStorage.getItem('token')
    if (!tokenVal || !user.value?.id) {
      showToast('Perfil actualizado localmente', 'success')
      return
    }

    const response = await fetch(`${API_BASE_URL}/users/${user.value.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokenVal}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: updates.username,
        email: updates.email,
        name: updates.profile.name,
        lastNames: updates.profile.lastNames,
        telefono: updates.profile.telefono
      })
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al sincronizar con el servidor')

    showToast('Perfil actualizado y sincronizado correctamente', 'success')
  } catch (err) {
    console.error('Error al sincronizar perfil:', err)
    showToast('Perfil guardado localmente, pero no se pudo sincronizar: ' + err.message, 'warning')
  }
}

loadProfileForm()

// --- User Management State ---
const userForm = reactive({
  id: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lastNames: '',
  telefono: '',
  role: 'user',
  rolId: '',
  is_verified: false
})

// --- Modals State ---
const isModalOpen = ref(false)
const modalType = ref('') // 'noticias', 'formación', 'colabora', 'usuarios'
const modalMode = ref('create') // 'create', 'edit'
const editIndex = ref(-1)

const newsForm = reactive({
  title: '',
  tag: 'Formación',
  excerpt: '',
  date: '',
  status: 'Publicado',
  author: 'Administrador',
  imageUrl: '',
  imageName: ''
})
const courseForm = reactive({ id: '', name: '', category: 'Grado Básico', duration: '2000h', enrolled: 0, capacity: 15, status: 'Activo', imageUrl: '', imageName: '' })
const collabForm = reactive({ entity: '', type: 'Apoyando Proyectos', date: '', status: 'Pendiente', imageUrl: '', imageName: '' })
const selectedCourseId = ref('')
const selectedStudentId = ref(null)
const studentForm = reactive({
  firstName: '',
  lastNames: '',
  phone: '',
  email: '',
  employmentStatus: 'Desempleado',
  dni: '',
  notes: ''
})

const selectedCourse = computed(() => {
  return coursesList.value.find(course => course.id === selectedCourseId.value)
})

const resetStudentForm = () => {
  selectedStudentId.value = null
  studentForm.firstName = ''
  studentForm.lastNames = ''
  studentForm.phone = ''
  studentForm.email = ''
  studentForm.employmentStatus = 'Desempleado'
  studentForm.dni = ''
  studentForm.notes = ''
}

const openStudentModal = (course) => {
  selectedCourseId.value = course.id
  modalType.value = 'alumno'
  modalMode.value = 'create'
  resetStudentForm()
  isModalOpen.value = true
}

const openEditStudentModal = (course, student) => {
  selectedCourseId.value = course.id
  selectedStudentId.value = student.id
  modalType.value = 'alumno'
  modalMode.value = 'edit'
  studentForm.firstName = student.firstName || ''
  studentForm.lastNames = student.lastNames || ''
  studentForm.phone = student.phone || ''
  studentForm.email = student.email || ''
  studentForm.employmentStatus = student.employmentStatus || 'Desempleado'
  studentForm.dni = student.dni || ''
  studentForm.notes = student.notes || ''
  isModalOpen.value = true
}

const deleteStudent = (course, studentId) => {
  const students = getCourseStudents(course)
  const studentIndex = students.findIndex(student => student.id === studentId)
  if (studentIndex === -1) return

  const [removedStudent] = students.splice(studentIndex, 1)
  course.students = students
  course.enrolled = Math.max(0, (Number(course.enrolled) || getCourseEnrollment(course) + 1) - 1)
  syncCourseStatus(course)
  showToast(`${removedStudent.firstName} ${removedStudent.lastNames} eliminado del curso`, 'error')
}

const handleNewsImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Selecciona un archivo de imagen válido', 'error')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    newsForm.imageUrl = reader.result
    newsForm.imageName = file.name
  }
  reader.readAsDataURL(file)
}

const clearNewsImage = () => {
  newsForm.imageUrl = ''
  newsForm.imageName = ''
}

const handleCourseImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Selecciona un archivo de imagen válido', 'error')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    courseForm.imageUrl = reader.result
    courseForm.imageName = file.name
  }
  reader.readAsDataURL(file)
}

const clearCourseImage = () => {
  courseForm.imageUrl = ''
  courseForm.imageName = ''
}

const handleCollabImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Selecciona un archivo de imagen válido', 'error')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    collabForm.imageUrl = reader.result
    collabForm.imageName = file.name
  }
  reader.readAsDataURL(file)
}

const clearCollabImage = () => {
  collabForm.imageUrl = ''
  collabForm.imageName = ''
}

const openModal = (type, mode = 'create', data = null, index = -1) => {
  modalType.value = type.toLowerCase()
  modalMode.value = mode
  editIndex.value = index
  isModalOpen.value = true

  if (modalType.value === 'noticias') {
    if (mode === 'edit' && data) {
      newsForm.title = data.title || ''
      newsForm.tag = data.tag || 'Formación'
      newsForm.excerpt = data.excerpt || ''
      newsForm.date = data.date || ''
      newsForm.status = data.status || 'Publicado'
      newsForm.author = data.author || 'Administrador'
      newsForm.imageUrl = data.imageUrl || ''
      newsForm.imageName = data.imageName || ''
    } else {
      newsForm.title = ''
      newsForm.tag = 'Formación'
      newsForm.excerpt = ''
      newsForm.date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      newsForm.status = 'Publicado'
      newsForm.author = 'Administrador'
      newsForm.imageUrl = ''
      newsForm.imageName = ''
    }
  } else if (modalType.value === 'formación' || modalType.value === 'formacion') {
    if (mode === 'edit' && data) {
      courseForm.id = data.id || ''
      courseForm.name = data.name || ''
      courseForm.category = data.category || 'Grado Básico'
      courseForm.duration = data.duration || '2000h'
      courseForm.enrolled = data.enrolled || 0
      courseForm.capacity = data.capacity || 15
      courseForm.status = data.status || 'Activo'
      courseForm.imageUrl = data.imageUrl || ''
      courseForm.imageName = data.imageName || ''
    } else {
      courseForm.id = ''
      courseForm.name = ''
      courseForm.category = 'Grado Básico'
      courseForm.duration = '2000h'
      courseForm.enrolled = 0
      courseForm.capacity = 15
      courseForm.status = 'Activo'
      courseForm.imageUrl = ''
      courseForm.imageName = ''
    }
  } else if (modalType.value === 'colabora') {
    if (mode === 'edit' && data) {
      collabForm.entity = data.entity || ''
      collabForm.type = data.type || 'Apoyando Proyectos'
      collabForm.date = data.date || ''
      collabForm.status = data.status || 'Pendiente'
      collabForm.imageUrl = data.imageUrl || ''
      collabForm.imageName = data.imageName || ''
    } else {
      collabForm.entity = ''
      collabForm.type = 'Apoyando Proyectos'
      collabForm.date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      collabForm.status = 'Pendiente'
      collabForm.imageUrl = ''
      collabForm.imageName = ''
    }
  } else if (modalType.value === 'usuarios' || modalType.value === 'usuario') {
    if (mode === 'edit' && data) {
      userForm.id = data.id
      userForm.username = data.username
      userForm.email = data.email
      userForm.password = ''
      userForm.confirmPassword = ''
      userForm.name = data.profile?.name || ''
      userForm.lastNames = data.profile?.lastNames || ''
      userForm.telefono = data.profile?.telefono || ''
      userForm.role = getGlobalRoleName(data)
      userForm.rolId = data.roleId || data.profile?.rolId || ''
      userForm.is_verified = data.is_verified || false
    } else {
      userForm.id = ''
      userForm.username = ''
      userForm.email = ''
      userForm.password = ''
      userForm.confirmPassword = ''
      userForm.name = ''
      userForm.lastNames = ''
      userForm.telefono = ''
      userForm.role = 'user'
      userForm.rolId = dbRoles.value[0]?.id || ''
      userForm.is_verified = true // Por defecto verificado si lo crea un admin
    }
  }
}

const handleActionClick = (tab) => {
  if (tab === 'Ajustes') {
    saveSettings()
  } else if (tab === 'Perfil') {
    saveProfile()
  } else {
    openModal(tab, 'create')
  }
}

const saveModalData = () => {
  if (modalType.value === 'noticias') {
    const tagClass = newsForm.tag === 'Formación' ? 'chip-green' : newsForm.tag === 'Empresas' ? 'chip-blue' : 'chip-amber'
    const newsData = { ...newsForm, tagClass }
    if (modalMode.value === 'create') {
      newsList.value.unshift({ id: Date.now(), ...newsData })
      showToast('Noticia publicada correctamente')
    } else {
      newsList.value[editIndex.value] = { ...newsList.value[editIndex.value], ...newsData }
      showToast('Noticia actualizada correctamente')
    }
  } else if (modalType.value === 'formación' || modalType.value === 'formacion') {
    if (modalMode.value === 'create') {
      coursesList.value.push({ ...courseForm })
      showToast('Curso añadido correctamente')
    } else {
      coursesList.value[editIndex.value] = { ...courseForm }
      showToast('Curso actualizado correctamente')
    }
  } else if (modalType.value === 'alumno') {
    saveStudentData()
    return
  } else if (modalType.value === 'colabora') {
    if (modalMode.value === 'create') {
      collaborationsList.value.unshift({ id: Date.now(), ...collabForm })
      showToast('Colaboración registrada correctamente')
    } else {
      collaborationsList.value[editIndex.value] = { ...collaborationsList.value[editIndex.value], ...collabForm }
      showToast('Colaboración actualizada correctamente')
    }
  } else if (modalType.value === 'usuarios' || modalType.value === 'usuario') {
    submitUserForm()
  }
  isModalOpen.value = false
}

const saveStudentData = () => {
  const course = selectedCourse.value
  if (!course) {
    showToast('No se ha encontrado el curso seleccionado', 'error')
    return
  }

  if (modalMode.value === 'create' && isCourseFull(course)) {
    showToast('El curso ya tiene el cupo completo', 'error')
    return
  }

  if (!studentForm.firstName.trim() || !studentForm.lastNames.trim() || !studentForm.phone.trim() || !studentForm.email.trim()) {
    showToast('Completa nombre, apellidos, teléfono y email del alumno', 'error')
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email.trim())) {
    showToast('Introduce un email válido para el alumno', 'error')
    return
  }

  const studentData = {
    id: modalMode.value === 'edit' ? selectedStudentId.value : Date.now(),
    firstName: studentForm.firstName.trim(),
    lastNames: studentForm.lastNames.trim(),
    phone: studentForm.phone.trim(),
    email: studentForm.email.trim(),
    employmentStatus: studentForm.employmentStatus,
    dni: studentForm.dni.trim(),
    notes: studentForm.notes.trim(),
    registeredAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  course.students = Array.isArray(course.students) ? course.students : []

  if (modalMode.value === 'edit') {
    const studentIndex = course.students.findIndex(student => student.id === selectedStudentId.value)
    if (studentIndex === -1) {
      showToast('No se ha encontrado el alumno seleccionado', 'error')
      return
    }

    course.students[studentIndex] = {
      ...course.students[studentIndex],
      ...studentData,
      registeredAt: course.students[studentIndex].registeredAt || studentData.registeredAt
    }
    showToast(`${studentData.firstName} ${studentData.lastNames} actualizado correctamente`)
  } else {
    const currentEnrollment = getCourseEnrollment(course)
    course.students.push(studentData)
    course.enrolled = currentEnrollment + 1
    showToast(`${studentData.firstName} ${studentData.lastNames} añadido a ${course.name}`)
  }

  syncCourseStatus(course)
  isModalOpen.value = false
}

const deleteNews = (index) => {
  newsList.value.splice(index, 1)
  showToast('Noticia eliminada correctamente', 'error')
}

const deleteCourse = (index) => {
  coursesList.value.splice(index, 1)
  showToast('Curso eliminado correctamente', 'error')
}

const deleteCollab = (index) => {
  collaborationsList.value.splice(index, 1)
  showToast('Colaboración eliminada correctamente', 'error')
}

const approveCollab = (index) => {
  collaborationsList.value[index].status = 'Aprobada'
  showToast('Colaboración aprobada con éxito')
}

const rejectCollab = (index) => {
  collaborationsList.value[index].status = 'Rechazada'
  showToast('Colaboración rechazada', 'error')
}

// --- ADMIN USER & ROLES API INTEGRATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

const usersList = ref([])
const dbRoles = ref([])
const usersLoading = ref(false)
const usersError = ref(null)
const userSearchQuery = ref('')

const fetchUsers = async () => {
  usersLoading.value = true
  usersError.value = null
  try {
    const tokenVal = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenVal}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios')
    usersList.value = data.data || []
  } catch (err) {
    usersError.value = err.message
    showToast(err.message, 'error')
  } finally {
    usersLoading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const tokenVal = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenVal}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (response.ok) {
      dbRoles.value = data.data || []
    }
  } catch (err) {
    console.error('Error fetching roles:', err)
  }
}

const getSystemRoleName = (userItem) => {
  return dbRoles.value.find(role => role.id === userItem.roleId)?.name || ''
}

const getGlobalRoleName = (userItem) => {
  return getSystemRoleName(userItem) === 'admin' ? 'admin' : 'user'
}

const submitUserForm = async () => {
  // Validaciones básicas
  if (!userForm.username || !userForm.email || !userForm.name || !userForm.lastNames || !userForm.rolId) {
    showToast('Por favor, rellena todos los campos obligatorios (*)', 'error')
    return
  }

  if (modalMode.value === 'create' && !userForm.password) {
    showToast('La contraseña es obligatoria para nuevos usuarios', 'error')
    return
  }

  if (userForm.password && userForm.password.length < 6) {
    showToast('La contraseña debe tener al menos 6 caracteres', 'error')
    return
  }

  if (userForm.password !== userForm.confirmPassword) {
    showToast('Las contraseñas no coinciden', 'error')
    return
  }

  usersLoading.value = true
  try {
    const tokenVal = localStorage.getItem('token')
    const url = modalMode.value === 'create' 
      ? `${API_BASE_URL}/users`
      : `${API_BASE_URL}/users/${userForm.id}`
      
    const method = modalMode.value === 'create' ? 'POST' : 'PUT'
    
    const bodyObj = {
      username: userForm.username,
      email: userForm.email,
      name: userForm.name,
      lastNames: userForm.lastNames,
      telefono: userForm.telefono,
      roleId: userForm.rolId,
      is_verified: userForm.is_verified
    }
    
    if (modalMode.value === 'create' || userForm.password) {
      bodyObj.password = userForm.password
    }
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${tokenVal}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyObj)
    })
    
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al guardar usuario')
    
    showToast(
      modalMode.value === 'create' ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente'
    )
    isModalOpen.value = false
    await fetchUsers()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    usersLoading.value = false
  }
}

const deleteUser = async (userId) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
  usersLoading.value = true
  try {
    const tokenVal = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokenVal}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error al eliminar usuario')
    
    showToast('Usuario eliminado correctamente')
    await fetchUsers()
  } catch (err) {
    showToast(err.message, 'error')
  } finally {
    usersLoading.value = false
  }
}

const filteredUsers = computed(() => {
  if (!userSearchQuery.value.trim()) return usersList.value
  const query = userSearchQuery.value.toLowerCase()
  return usersList.value.filter(u => 
    u.username.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query) ||
    (u.profile?.name && u.profile.name.toLowerCase().includes(query)) ||
    (u.profile?.lastNames && u.profile.lastNames.toLowerCase().includes(query)) ||
    getSystemRoleName(u).toLowerCase().includes(query)
  )
})

const availableTaskUsers = computed(() => {
  const mappedUsers = usersList.value.map(item => ({
    id: item.id,
    label: item.profile?.name
      ? `${item.profile.name} ${item.profile.lastNames || ''}`.trim()
      : item.username
  }))

  if (mappedUsers.length) return mappedUsers

  return [{
    id: user.value?.id || 'current-user',
    label: user.value?.profile?.name
      ? `${user.value.profile.name} ${user.value.profile.lastNames || ''}`.trim()
      : user.value?.username || 'Administrador'
  }]
})

const pendingTasks = computed(() => tasks.value.filter(task => !task.completed))
const completedTasks = computed(() => tasks.value.filter(task => task.completed))

const resetTaskForm = () => {
  taskForm.title = ''
  taskForm.area = 'Noticias'
  taskForm.priority = 'Media'
  taskForm.assignee = availableTaskUsers.value[0]?.label || 'Administrador'
  taskForm.due = getTodayDateValue()
}

const addTask = () => {
  if (!taskForm.title.trim()) {
    showToast('Escribe un título para la tarea', 'error')
    return
  }

  tasks.value.unshift({
    id: Date.now(),
    title: taskForm.title.trim(),
    area: taskForm.area,
    priority: taskForm.priority,
    assignee: taskForm.assignee || availableTaskUsers.value[0]?.label || 'Administrador',
    due: taskForm.due,
    completed: false
  })
  resetTaskForm()
  showToast('Tarea añadida correctamente')
}

const toggleTaskCompleted = (task) => {
  task.completed = !task.completed
  showToast(task.completed ? 'Tarea marcada como realizada' : 'Tarea reabierta')
}

const deleteTask = (taskId) => {
  const index = tasks.value.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    showToast('Tarea eliminada', 'error')
  }
}

watch(tasks, (val) => localStorage.setItem('pen_tasks', JSON.stringify(val)), { deep: true })

watch(activeTab, (newTab) => {
  if (newTab === 'Usuarios') {
    fetchUsers()
    fetchRoles()
  } else if (newTab === 'Perfil') {
    loadProfileForm()
  }
})

onMounted(() => {
  resetTaskForm()
  fetchUsers()
  if (activeTab.value === 'Usuarios') {
    fetchRoles()
  }
})
</script>

<template>
  <DashboardShell 
    :activeTab="activeTab" 
    @update:activeTab="activeTab = $event" 
    @action-click="handleActionClick"
  >
    <!-- ==========================================
         1. SECCIÓN: RESUMEN (DASHBOARD HOME)
         ========================================== -->
    <div v-if="activeTab === 'Resumen'" class="fade-in">
      <section class="dashboard-hero">
        <div class="hero-copy">
          <p class="hero-kicker">Centro de mando</p>
          <h2>Gestiona contenido, solicitudes y actividad de la web desde un panel limpio.</h2>
          <p class="hero-text">La estructura queda preparada para conectar datos reales del backend por módulos.</p>
        </div>
        <div class="hero-actions">
          <RouterLink to="/" class="secondary-button">
            <span class="material-symbols-outlined">visibility</span>
            Ver web
          </RouterLink>
          <button class="dark-button" type="button" @click="activeTab = 'Noticias'">
            <span class="material-symbols-outlined">edit_square</span>
            Crear contenido
          </button>
        </div>
        <div class="hero-status-card">
          <span>Estado general</span>
          <strong>86%</strong>
          <div class="progress-track">
            <i></i>
          </div>
          <small>Contenido actualizado esta semana</small>
        </div>
      </section>

      <section class="metrics-grid" aria-label="Métricas principales">
        <MetricCard
          v-for="metric in metrics"
          :key="metric.label"
          v-bind="metric"
        />
      </section>

      <section class="dashboard-grid">
        <article class="work-panel">
          <div class="panel-header">
            <div>
              <p class="section-label">Trabajo pendiente</p>
              <h3>Prioridades de hoy</h3>
            </div>
            <span class="task-counter">{{ pendingTasks.length }} pendientes</span>
          </div>

          <form class="task-create-form" @submit.prevent="addTask">
            <div class="task-title-field">
              <label class="label-md">Nueva tarea</label>
              <input type="text" v-model="taskForm.title" placeholder="Ej: Revisar nuevas matrículas">
            </div>
            <div>
              <label class="label-md">Área</label>
              <select v-model="taskForm.area">
                <option value="Noticias">Noticias</option>
                <option value="Formación">Formación</option>
                <option value="Colabora">Colabora</option>
                <option value="Mensajes">Mensajes</option>
                <option value="Usuarios">Usuarios</option>
              </select>
            </div>
            <div>
              <label class="label-md">Responsable</label>
              <select v-model="taskForm.assignee">
                <option v-for="taskUser in availableTaskUsers" :key="taskUser.id" :value="taskUser.label">
                  {{ taskUser.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="label-md">Prioridad</label>
              <select v-model="taskForm.priority">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div>
              <label class="label-md">Fecha</label>
              <input type="date" v-model="taskForm.due">
            </div>
            <button class="primary-button-accent task-submit-button" type="submit">
              <span class="material-symbols-outlined">add_task</span>
              Añadir
            </button>
          </form>

          <div class="task-list">
            <div v-for="task in pendingTasks" :key="task.id" class="task-row">
              <button class="task-check" type="button" title="Marcar como realizada" @click="toggleTaskCompleted(task)">
                <span class="material-symbols-outlined">radio_button_unchecked</span>
              </button>
              <span class="task-marker" :class="`task-marker--${task.priority.toLowerCase()}`"></span>
              <div>
                <strong>{{ task.title }}</strong>
                <span>{{ task.area }} · Responsable: {{ task.assignee }}</span>
              </div>
              <div class="task-meta">
                <small>{{ task.priority }}</small>
                <time>{{ formatTaskDue(task.due) }}</time>
              </div>
              <button class="task-delete" type="button" title="Eliminar tarea" @click="deleteTask(task.id)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
            <div v-if="pendingTasks.length === 0" class="tasks-empty-state">
              <span class="material-symbols-outlined">task_alt</span>
              No hay tareas pendientes.
            </div>
          </div>

          <div v-if="completedTasks.length" class="completed-task-panel">
            <strong>Realizadas</strong>
            <button
              v-for="task in completedTasks"
              :key="task.id"
              class="completed-task"
              type="button"
              @click="toggleTaskCompleted(task)"
              title="Reabrir tarea"
            >
              <span class="material-symbols-outlined">check_circle</span>
              {{ task.title }}
            </button>
          </div>
        </article>

        <aside class="side-stack">
          <article class="modules-panel">
            <div class="panel-header compact">
              <div>
                <p class="section-label">Módulos</p>
                <h3>Áreas editables</h3>
              </div>
            </div>

            <div class="module-list">
              <button
                v-for="module in contentModules"
                :key="module.label"
                class="module-card"
                :class="`module-card--${module.tone}`"
                type="button"
                @click="activeTab = module.label"
              >
                <span class="material-symbols-outlined">{{ module.icon }}</span>
                <strong>{{ module.label }}</strong>
                <small>{{ module.value }}</small>
              </button>
            </div>
          </article>

          <article class="activity-panel">
            <div class="panel-header">
              <div>
                <p class="section-label">Actividad</p>
                <h3>Últimos movimientos</h3>
              </div>
            </div>

            <ol class="activity-list">
              <li v-for="item in activity" :key="`${item.time}-${item.text}`">
                <time>{{ item.time }}</time>
                <p>{{ item.text }}</p>
              </li>
            </ol>
          </article>
        </aside>
      </section>
    </div>

    <!-- ==========================================
         2. SECCIÓN: NOTICIAS (GENT DE NOTICIAS)
         ========================================== -->
    <div v-else-if="activeTab === 'Noticias'" class="fade-in">
      <div class="table-controls">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input type="text" v-model="newsSearchQuery" placeholder="Buscar por título, categoría o texto...">
        </div>
        <button class="primary-button-accent" @click="openModal('noticias', 'create')">
          <span class="material-symbols-outlined">add</span>
          Publicar Noticia
        </button>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Categoría</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th class="actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredNews" :key="item.id">
              <td>
                <div class="news-thumb">
                  <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title">
                  <span v-else class="material-symbols-outlined">{{ item.image || 'image' }}</span>
                </div>
              </td>
              <td class="primary-cell">
                <div class="primary-cell-text">
                  <strong>{{ item.title }}</strong>
                  <span class="cell-excerpt">{{ item.excerpt }}</span>
                </div>
              </td>
              <td>
                <span class="table-chip chip-gray">{{ item.tag }}</span>
              </td>
              <td>{{ item.author }}</td>
              <td>{{ item.date }}</td>
              <td>
                <span :class="['table-chip', item.status === 'Publicado' ? 'chip-green' : 'chip-yellow']">
                  {{ item.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="action-btn edit" title="Editar Noticia" @click="openModal('noticias', 'edit', item, index)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="action-btn delete" title="Eliminar Noticia" @click="deleteNews(index)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredNews.length === 0">
              <td colspan="7" class="empty-state-row">
                <span class="material-symbols-outlined">find_in_page</span>
                No se encontraron noticias con los filtros aplicados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==========================================
         3. SECCIÓN: FORMACIÓN (CURSOS)
         ========================================== -->
    <div v-else-if="activeTab === 'Formación'" class="fade-in">
      <div class="table-controls">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input type="text" v-model="courseSearchQuery" placeholder="Buscar por código, nombre del curso...">
        </div>
        <button class="primary-button-accent" @click="openModal('formación', 'create')">
          <span class="material-symbols-outlined">add</span>
          Crear Curso
        </button>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre del Curso</th>
              <th>Categoría</th>
              <th>Duración</th>
              <th>Matrículas (Alumnos/Total)</th>
              <th>Estado</th>
              <th class="actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in filteredCourses" :key="item.id">
              <tr
                class="course-row-clickable"
                :class="{ 'course-row-clickable--open': expandedCourseId === item.id }"
                @click="toggleCourseStudents(item.id)"
              >
                <td class="code-cell">{{ item.id }}</td>
                <td class="primary-cell">
                  <div class="course-thumbnail" v-if="item.imageUrl">
                    <img :src="item.imageUrl" alt="Miniatura">
                  </div>
                  <div class="primary-cell-text">
                    <strong>{{ item.name }}</strong>
                  </div>
                </td>
                <td>
                  <span class="table-chip chip-gray">{{ item.category }}</span>
                </td>
                <td>{{ item.duration }}</td>
                <td>
                  <div class="progress-bar-cell">
                    <span class="progress-text">{{ getCourseEnrollment(item) }} / {{ item.capacity }}</span>
                    <div class="progress-bar-mini">
                      <span :style="{ width: getCourseOccupancy(item) + '%' }"></span>
                    </div>
                  </div>
                </td>
                <td>
                  <span :class="[
                    'table-chip', 
                    item.status === 'Activo' ? 'chip-green' : 
                    item.status === 'Completo' ? 'chip-red' : 'chip-yellow'
                  ]">
                    {{ item.status }}
                  </span>
                </td>
                <td class="actions-cell">
                  <button
                    class="action-btn view-students"
                    :title="expandedCourseId === item.id ? 'Ocultar alumnos' : 'Gestionar alumnos'"
                    @click.stop="toggleCourseStudents(item.id)"
                  >
                    <span class="material-symbols-outlined">
                      {{ expandedCourseId === item.id ? 'expand_less' : 'groups' }}
                    </span>
                  </button>
                  <button
                    class="action-btn add-student"
                    :title="isCourseFull(item) ? 'Cupo completo' : 'Añadir alumno al curso'"
                    :disabled="isCourseFull(item)"
                    @click.stop="openStudentModal(item)"
                  >
                    <span class="material-symbols-outlined">person_add</span>
                  </button>
                  <button class="action-btn edit" title="Editar Curso" @click.stop="openModal('formación', 'edit', item, index)">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="action-btn delete" title="Eliminar Curso" @click.stop="deleteCourse(index)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
              <tr v-if="expandedCourseId === item.id" class="students-row">
                <td colspan="7">
                  <div class="students-panel">
                    <div class="students-panel-header">
                      <div>
                        <strong>Alumnos apuntados</strong>
                        <span>{{ getCourseStudents(item).length }} registros guardados</span>
                      </div>
                      <button
                        class="secondary-button compact"
                        :disabled="isCourseFull(item)"
                        @click="openStudentModal(item)"
                      >
                        <span class="material-symbols-outlined">person_add</span>
                        Añadir alumno
                      </button>
                    </div>

                    <div v-if="getCourseStudents(item).length" class="students-table-wrap">
                      <table class="students-table">
                        <thead>
                          <tr>
                            <th>Nombre y apellidos</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>DNI / NIE</th>
                            <th>Estado</th>
                            <th>Fecha alta</th>
                            <th>Observaciones</th>
                            <th class="actions-col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="student in getCourseStudents(item)" :key="student.id">
                            <td class="student-name-cell">
                              <strong>{{ student.firstName }} {{ student.lastNames }}</strong>
                            </td>
                            <td>{{ student.email }}</td>
                            <td>{{ student.phone }}</td>
                            <td>{{ student.dni || 'Sin DNI/NIE' }}</td>
                            <td>
                              <span class="table-chip" :class="student.employmentStatus === 'Trabajando' ? 'chip-green' : 'chip-yellow'">
                                {{ student.employmentStatus }}
                              </span>
                            </td>
                            <td>{{ student.registeredAt || 'Sin fecha' }}</td>
                            <td class="student-notes-cell">{{ student.notes || 'Sin observaciones' }}</td>
                            <td class="actions-cell">
                              <button class="action-btn edit" title="Editar alumno" @click="openEditStudentModal(item, student)">
                                <span class="material-symbols-outlined">edit</span>
                              </button>
                              <button class="action-btn delete" title="Eliminar alumno" @click="deleteStudent(item, student.id)">
                                <span class="material-symbols-outlined">delete</span>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-else class="students-empty">
                      <span class="material-symbols-outlined">group_off</span>
                      Todavía no hay alumnos registrados en este curso.
                    </div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-if="filteredCourses.length === 0">
              <td colspan="7" class="empty-state-row">
                <span class="material-symbols-outlined">find_in_page</span>
                No se encontraron cursos con los filtros aplicados.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==========================================
         4. SECCIÓN: COLABORA (COLABORACIONES)
         ========================================== -->
    <div v-else-if="activeTab === 'Colabora'" class="fade-in">
      <div class="table-controls">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input type="text" v-model="collabSearchQuery" placeholder="Buscar entidad colaboradora...">
        </div>
        <button class="primary-button-accent" @click="openModal('colabora', 'create')">
          <span class="material-symbols-outlined">add</span>
          Añadir Entidad
        </button>
      </div>

      <div class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Entidad</th>
              <th>Tipo de Colaboración</th>
              <th>Fecha de Solicitud</th>
              <th>Estado</th>
              <th class="actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredCollabs" :key="item.id">
              <td class="primary-cell">
                <div class="collab-thumbnail" v-if="item.imageUrl">
                  <img :src="item.imageUrl" alt="Logo">
                </div>
                <div class="primary-cell-text">
                  <strong>{{ item.entity }}</strong>
                </div>
              </td>
              <td>{{ item.type }}</td>
              <td>{{ item.date }}</td>
              <td>
                <span :class="[
                  'table-chip',
                  item.status === 'Aprobada' ? 'chip-green' :
                  item.status === 'Rechazada' ? 'chip-red' : 'chip-yellow'
                ]">
                  {{ item.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  v-if="item.status === 'Pendiente'"
                  class="action-btn approve" 
                  title="Aprobar Solicitud" 
                  @click="approveCollab(index)"
                >
                  <span class="material-symbols-outlined">check</span>
                </button>
                <button 
                  v-if="item.status === 'Pendiente'"
                  class="action-btn reject" 
                  title="Rechazar Solicitud" 
                  @click="rejectCollab(index)"
                >
                  <span class="material-symbols-outlined">close</span>
                </button>
                <button class="action-btn edit" title="Editar" @click="openModal('colabora', 'edit', item, index)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="action-btn delete" title="Eliminar" @click="deleteCollab(index)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>
            <tr v-if="filteredCollabs.length === 0">
              <td colspan="5" class="empty-state-row">
                <span class="material-symbols-outlined">find_in_page</span>
                No se encontraron colaboraciones registradas.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==========================================
         5. SECCIÓN: MENSAJES (BUZÓN)
         ========================================== -->
    <div v-else-if="activeTab === 'Mensajes'" class="fade-in messages-tab-layout">
      <!-- Panel Izquierdo: Lista de Mensajes -->
      <div class="inbox-list-panel">
        <div class="inbox-header">
          <h3>Mensajes del formulario</h3>
          <span class="badge-count">{{ messagesList.length }}</span>
        </div>
        <div class="message-items">
          <div 
            v-for="msg in messagesList" 
            :key="msg.id"
            :class="['message-item-card', selectedMessageId === msg.id ? 'active' : '', msg.status === 'Pendiente' ? 'unread' : '']"
            @click="selectedMessageId = msg.id"
          >
            <div class="message-item-meta">
              <strong>{{ msg.name }}</strong>
              <time>{{ msg.date.split(' ')[0] }}</time>
            </div>
            <p class="message-item-subject">{{ msg.subject }}</p>
            <p class="message-item-excerpt">{{ msg.message.slice(0, 70) }}...</p>
            <span v-if="msg.status === 'Pendiente'" class="unread-dot"></span>
          </div>
          <div v-if="messagesList.length === 0" class="empty-inbox">
            <span class="material-symbols-outlined">drafts</span>
            No hay mensajes en la bandeja de entrada.
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Detalle del Mensaje Seleccionado -->
      <div class="inbox-detail-panel">
        <div v-if="selectedMessage" class="message-detail-content">
          <div class="detail-header">
            <div>
              <h2>{{ selectedMessage.subject }}</h2>
              <div class="sender-info">
                <strong>{{ selectedMessage.name }}</strong>
                <span>&lt;{{ selectedMessage.email }}&gt;</span>
                <span v-if="selectedMessage.phone" class="phone">| Tel: {{ selectedMessage.phone }}</span>
              </div>
            </div>
            <div class="detail-actions">
              <button 
                class="secondary-button compact"
                @click="toggleMessageStatus(selectedMessage)"
              >
                <span class="material-symbols-outlined">
                  {{ selectedMessage.status === 'Pendiente' ? 'mark_as_unread' : 'mark_chat_read' }}
                </span>
                {{ selectedMessage.status === 'Pendiente' ? 'Leído' : 'Pendiente' }}
              </button>
              <button 
                class="danger-button-outline"
                @click="deleteMessage(selectedMessage.id)"
              >
                <span class="material-symbols-outlined">delete</span>
                Eliminar
              </button>
            </div>
          </div>

          <div class="message-body">
            <p>{{ selectedMessage.message }}</p>
          </div>

          <!-- Formulario de Respuesta -->
          <div class="reply-section">
            <div class="reply-header">
              <span class="material-symbols-outlined">reply</span>
              <strong>Responder a {{ selectedMessage.name }}</strong>
            </div>
            <textarea 
              v-model="replyText" 
              placeholder="Escribe tu mensaje de respuesta aquí..." 
              rows="4"
              class="reply-textarea"
            ></textarea>
            <div class="reply-actions">
              <button 
                class="primary-button-accent"
                :disabled="!replyText.trim()"
                @click="sendMockReply"
              >
                Enviar Respuesta
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-detail-state">
          <span class="material-symbols-outlined">mail_outline</span>
          Selecciona un mensaje para ver el detalle.
        </div>
      </div>
    </div>

    <!-- ==========================================
         5a. SECCIÓN: PERFIL
         ========================================== -->
    <div v-else-if="activeTab === 'Perfil'" class="fade-in">
      <section class="profile-editor-grid">
        <article class="profile-preview-card">
          <div class="profile-avatar-preview" :style="{ background: profileForm.avatarColor }">
            <img v-if="profileForm.avatarImage" :src="profileForm.avatarImage" alt="Foto de perfil">
            <span v-else>{{ profileForm.avatarPreset || profileInitials }}</span>
          </div>
          <h2>{{ profileForm.name || profileForm.username || 'Administrador' }}</h2>
          <p>{{ profileForm.lastNames || 'Perfil de administración' }}</p>
          <span class="table-chip chip-green">Sesión activa</span>
        </article>

        <article class="profile-form-card">
          <div class="profile-section-header">
            <div>
              <p class="section-label">Cuenta</p>
              <h3>Editar perfil</h3>
            </div>
            <button class="primary-button-accent" type="button" @click="saveProfile">
              <span class="material-symbols-outlined">save</span>
              Guardar perfil
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group-half">
              <label class="label-md">Nombre de usuario *</label>
              <input type="text" class="form-control-dash" v-model="profileForm.username" placeholder="Ej: admin">
            </div>
            <div class="form-group-half">
              <label class="label-md">Email *</label>
              <input type="email" class="form-control-dash" v-model="profileForm.email" placeholder="Ej: admin@penascal.com">
            </div>
            <div class="form-group-half">
              <label class="label-md">Nombre</label>
              <input type="text" class="form-control-dash" v-model="profileForm.name" placeholder="Ej: Ane">
            </div>
            <div class="form-group-half">
              <label class="label-md">Apellidos</label>
              <input type="text" class="form-control-dash" v-model="profileForm.lastNames" placeholder="Ej: García López">
            </div>
            <div class="form-group-half">
              <label class="label-md">Teléfono</label>
              <input type="text" class="form-control-dash" v-model="profileForm.telefono" placeholder="Ej: 600123456">
            </div>
            <div class="form-group-half">
              <label class="label-md">Color de iniciales</label>
              <input type="color" class="profile-color-input" v-model="profileForm.avatarColor">
            </div>
            <div class="form-group-full">
              <label class="label-md">Descripción breve</label>
              <textarea class="form-control-dash" rows="3" v-model="profileForm.bio" placeholder="Cargo, área o notas internas del perfil..."></textarea>
            </div>
          </div>

          <div class="avatar-editor-panel">
            <div>
              <p class="section-label">Avatar</p>
              <h3>Elige cómo quieres aparecer</h3>
            </div>

            <div class="avatar-actions-row">
              <label class="file-upload-button">
                <span class="material-symbols-outlined">photo_camera</span>
                Subir foto nueva
                <input type="file" accept="image/*" @change="handleProfileImageFile">
              </label>
              <button class="secondary-button compact avatar-initials-button" type="button" @click="useInitialsAvatar">
                <span class="material-symbols-outlined">text_fields</span>
                Usar iniciales
              </button>
            </div>

            <div class="avatar-preset-grid">
              <button
                v-for="preset in avatarPresets"
                :key="`${preset.label}-${preset.color}`"
                class="avatar-preset-button"
                :class="{ active: profileForm.avatarPreset === preset.label && profileForm.avatarColor === preset.color && !profileForm.avatarImage }"
                :style="{ background: preset.color }"
                type="button"
                @click="selectAvatarPreset(preset)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>

    <!-- ==========================================
         5b. SECCIÓN: USUARIOS (GESTIÓN DE USUARIOS)
         ========================================== -->
    <div v-else-if="activeTab === 'Usuarios'" class="fade-in">
      <div class="table-controls">
        <div class="search-box">
          <span class="material-symbols-outlined">search</span>
          <input type="text" v-model="userSearchQuery" placeholder="Buscar por usuario, nombre, email o rol...">
        </div>
        <button class="primary-button-accent" @click="openModal('usuarios', 'create')">
          <span class="material-symbols-outlined">add</span>
          Crear Usuario
        </button>
      </div>

      <!-- Loading / Error States -->
      <div v-if="usersLoading && usersList.length === 0" class="loading-state-placeholder">
        <div class="loading-spinner"></div>
        <p>Cargando lista de usuarios de Peñascal...</p>
      </div>
      <div v-else-if="usersError" class="error-state-placeholder">
        <span class="material-symbols-outlined">error</span>
        <p>{{ usersError }}</p>
        <button class="secondary-button" @click="fetchUsers">Reintentar</button>
      </div>

      <div v-else class="data-table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Usuario / Nombre</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Rol Global</th>
              <th>Rol de Sistema</th>
              <th>Teléfono</th>
              <th class="actions-col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="primary-cell">
                <div class="user-cell-content">
                  <div class="user-avatar-placeholder">
                    {{ user.username.substring(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <strong>{{ user.username }}</strong>
                    <span class="cell-excerpt" v-if="user.profile?.name">
                      {{ user.profile.name }} {{ user.profile.lastNames }}
                    </span>
                    <span class="cell-excerpt text-muted" v-else>
                      Sin perfil asignado
                    </span>
                  </div>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="['table-chip', user.is_verified ? 'chip-green' : 'chip-red']">
                  {{ user.is_verified ? 'Verificado' : 'Pendiente' }}
                </span>
              </td>
              <td>
                <span :class="['table-chip', getGlobalRoleName(user) === 'admin' ? 'chip-amber' : 'chip-gray']">
                  {{ getGlobalRoleName(user) === 'admin' ? 'Administrador' : 'Usuario' }}
                </span>
              </td>
              <td>
                <span class="table-chip chip-blue" v-if="getSystemRoleName(user)">
                  {{ getSystemRoleName(user) }}
                </span>
                <span class="table-chip chip-red" v-else>
                  Ninguno
                </span>
              </td>
              <td>{{ user.profile?.telefono || 'No especificado' }}</td>
              <td>
                <div class="table-actions">
                  <button 
                    class="action-btn edit-btn" 
                    title="Editar usuario"
                    @click="openModal('usuarios', 'edit', user)"
                  >
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    class="action-btn delete-btn" 
                    title="Eliminar usuario"
                    @click="deleteUser(user.id)"
                  >
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="7" class="empty-table-placeholder">
                No se encontraron usuarios coincidentes.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ==========================================
         6. SECCIÓN: AJUSTES (CONFIGURACIÓN)
         ========================================== -->
    <div v-else-if="activeTab === 'Ajustes'" class="fade-in settings-tab-layout">
      <div class="settings-grid">
        <div class="settings-card">
          <h3>Configuración del Sitio</h3>
          <div class="form-grid">
            <div class="form-group-full">
              <label class="label-md">Nombre de la Entidad / Web</label>
              <input type="text" class="form-control-dash" v-model="settings.siteName">
            </div>
            <div class="form-group-full">
              <label class="label-md">Descripción SEO del Sitio</label>
              <textarea class="form-control-dash" rows="3" v-model="settings.description"></textarea>
            </div>
            <div class="form-group-split">
              <label class="checkbox-label-dash">
                <input type="checkbox" v-model="settings.isActive">
                <div>
                  <strong>Sitio web visible al público</strong>
                  <p>Si se desmarca, se mostrará una página de "En construcción".</p>
                </div>
              </label>
              <label class="checkbox-label-dash">
                <input type="checkbox" v-model="settings.isMaintenance">
                <div>
                  <strong>Modo Mantenimiento</strong>
                  <p>Solo los administradores podrán acceder a las vistas del sitio.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-card">
          <h3>Información de Contacto Pública</h3>
          <div class="form-grid">
            <div class="form-group-half">
              <label class="label-md">Email de contacto</label>
              <input type="email" class="form-control-dash" v-model="settings.siteEmail">
            </div>
            <div class="form-group-half">
              <label class="label-md">Teléfono público</label>
              <input type="text" class="form-control-dash" v-model="settings.sitePhone">
            </div>
            <div class="form-group-full">
              <label class="label-md">Dirección Física de la Sede</label>
              <input type="text" class="form-control-dash" v-model="settings.siteAddress">
            </div>
          </div>
        </div>

        <div class="settings-actions-panel">
          <button class="primary-button-accent btn-large" @click="saveSettings">
            <span class="material-symbols-outlined">save</span>
            Guardar Configuración General
          </button>
        </div>
      </div>
    </div>

    <!-- ==========================================
         MODAL DE CREACIÓN / EDICIÓN COMPARTIDO
         ========================================== -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-card fade-up">
        <div class="modal-header">
          <h2>
            {{ modalMode === 'create' ? 'Crear' : 'Editar' }} 
            {{ 
              modalType === 'noticias' ? 'Noticia' : 
              modalType === 'formación' || modalType === 'formacion' ? 'Curso' : 
              modalType === 'alumno' ? 'Alumno' :
              modalType === 'usuarios' || modalType === 'usuario' ? 'Usuario' : 'Colaborador' 
            }}
          </h2>
          <button class="modal-close-btn" @click="isModalOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Formulario Noticias -->
          <div v-if="modalType === 'noticias'" class="form-grid">
            <div class="form-group-full">
              <label class="label-md">Título de la noticia *</label>
              <input type="text" class="form-control-dash" v-model="newsForm.title" placeholder="Ej: Nueva convocatoria de cursos...">
            </div>
            <div class="form-group-half">
              <label class="label-md">Categoría *</label>
              <select class="form-control-dash" v-model="newsForm.tag">
                <option value="Formación">Formación</option>
                <option value="Empresas">Empresas</option>
                <option value="Institucional">Institucional</option>
              </select>
            </div>
            <div class="form-group-half">
              <label class="label-md">Estado de la Publicación *</label>
              <select class="form-control-dash" v-model="newsForm.status">
                <option value="Publicado">Publicado</option>
                <option value="Borrador">Borrador</option>
              </select>
            </div>
            <div class="form-group-full">
              <label class="label-md">Resumen / Entradilla de la noticia *</label>
              <textarea class="form-control-dash" rows="3" v-model="newsForm.excerpt" placeholder="Escribe un breve resumen de la noticia..."></textarea>
            </div>
            <div class="form-group-full">
              <label class="label-md">Imagen de la noticia</label>
              <div class="news-image-field">
                <div class="news-image-preview">
                  <img v-if="newsForm.imageUrl" :src="newsForm.imageUrl" alt="Vista previa de la noticia">
                  <span v-else class="material-symbols-outlined">image</span>
                </div>
                <div class="news-image-controls">
                  <input type="url" class="form-control-dash" v-model="newsForm.imageUrl" placeholder="Pega aquí el enlace de una imagen">
                  <label class="file-upload-button">
                    <span class="material-symbols-outlined">upload</span>
                    Subir imagen local
                    <input type="file" accept="image/*" @change="handleNewsImageFile">
                  </label>
                  <div class="image-helper-row">
                    <span>{{ newsForm.imageName || 'Puedes usar una URL o seleccionar una imagen de tu equipo.' }}</span>
                    <button v-if="newsForm.imageUrl" type="button" class="link-button" @click="clearNewsImage">
                      Quitar imagen
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group-half">
              <label class="label-md">Autor *</label>
              <input type="text" class="form-control-dash" v-model="newsForm.author">
            </div>
            <div class="form-group-half">
              <label class="label-md">Fecha de publicación</label>
              <input type="text" class="form-control-dash" v-model="newsForm.date" readonly>
            </div>
          </div>

          <!-- Formulario Formación -->
          <div v-else-if="modalType === 'formación' || modalType === 'formacion'" class="form-grid">
            <div class="form-group-half">
              <label class="label-md">Código de Curso *</label>
              <input type="text" class="form-control-dash" v-model="courseForm.id" placeholder="Ej: GM-SOL" :disabled="modalMode === 'edit'">
            </div>
            <div class="form-group-half">
              <label class="label-md">Categoría *</label>
              <select class="form-control-dash" v-model="courseForm.category">
                <option value="Grado Básico">Grado Básico</option>
                <option value="Grado Medio">Grado Medio</option>
                <option value="Empleo">Formación Empleo</option>
              </select>
            </div>
            <div class="form-group-full">
              <label class="label-md">Nombre Completo del Curso *</label>
              <input type="text" class="form-control-dash" v-model="courseForm.name" placeholder="Ej: Grado Medio en Soldadura y Calderería">
            </div>
            <div class="form-group-half">
              <label class="label-md">Duración Total *</label>
              <input type="text" class="form-control-dash" v-model="courseForm.duration" placeholder="Ej: 2000h">
            </div>
            <div class="form-group-half">
              <label class="label-md">Plazas Totales *</label>
              <input type="number" class="form-control-dash" v-model.number="courseForm.capacity">
            </div>
            <div class="form-group-half">
              <label class="label-md">Alumnos Matriculados *</label>
              <input type="number" class="form-control-dash" v-model.number="courseForm.enrolled">
            </div>
            <div class="form-group-half">
              <label class="label-md">Estado *</label>
              <select class="form-control-dash" v-model="courseForm.status">
                <option value="Activo">Activo</option>
                <option value="Completo">Completo</option>
                <option value="Borrador">Borrador</option>
              </select>
            </div>
            <div class="form-group-full">
              <label class="label-md">Imagen del curso</label>
              <div class="news-image-field">
                <div class="news-image-preview">
                  <img v-if="courseForm.imageUrl" :src="courseForm.imageUrl" alt="Vista previa del curso">
                  <span v-else class="material-symbols-outlined">image</span>
                </div>
                <div class="news-image-controls">
                  <input type="url" class="form-control-dash" v-model="courseForm.imageUrl" placeholder="Pega aquí el enlace de una imagen">
                  <label class="file-upload-button">
                    <span class="material-symbols-outlined">upload</span>
                    Subir imagen local
                    <input type="file" accept="image/*" @change="handleCourseImageFile">
                  </label>
                  <div class="image-helper-row">
                    <span>{{ courseForm.imageName || 'Puedes usar una URL o seleccionar una imagen de tu equipo.' }}</span>
                    <button v-if="courseForm.imageUrl" type="button" class="link-button" @click="clearCourseImage">
                      Quitar imagen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario Alta de Alumno -->
          <div v-else-if="modalType === 'alumno'" class="form-grid">
            <div class="form-group-full selected-course-summary">
              <span class="material-symbols-outlined">school</span>
              <div>
                <strong>{{ selectedCourse?.name }}</strong>
                <p>
                  {{ selectedCourse?.id }} · 
                  {{ modalMode === 'edit' ? 'Editando alumno inscrito' : `Plaza ${selectedCourse ? getCourseEnrollment(selectedCourse) + 1 : 0} de ${selectedCourse?.capacity}` }}
                </p>
              </div>
            </div>
            <div class="form-group-half">
              <label class="label-md">Nombre *</label>
              <input type="text" class="form-control-dash" v-model="studentForm.firstName" placeholder="Ej: Ane">
            </div>
            <div class="form-group-half">
              <label class="label-md">Apellidos *</label>
              <input type="text" class="form-control-dash" v-model="studentForm.lastNames" placeholder="Ej: García López">
            </div>
            <div class="form-group-half">
              <label class="label-md">Teléfono *</label>
              <input type="tel" class="form-control-dash" v-model="studentForm.phone" placeholder="Ej: 600123456">
            </div>
            <div class="form-group-half">
              <label class="label-md">Email *</label>
              <input type="email" class="form-control-dash" v-model="studentForm.email" placeholder="Ej: ane@email.com">
            </div>
            <div class="form-group-half">
              <label class="label-md">Estado laboral *</label>
              <select class="form-control-dash" v-model="studentForm.employmentStatus">
                <option value="Desempleado">Desempleado</option>
                <option value="Trabajando">Trabajando</option>
              </select>
            </div>
            <div class="form-group-half">
              <label class="label-md">DNI / NIE</label>
              <input type="text" class="form-control-dash" v-model="studentForm.dni" placeholder="Ej: 12345678A">
            </div>
            <div class="form-group-full">
              <label class="label-md">Observaciones importantes</label>
              <textarea class="form-control-dash" rows="3" v-model="studentForm.notes" placeholder="Disponibilidad, necesidades de apoyo, documentación pendiente..."></textarea>
            </div>
          </div>

          <!-- Formulario Colaboradores -->
          <div v-else-if="modalType === 'colabora'" class="form-grid">
            <div class="form-group-full">
              <label class="label-md">Nombre de la Entidad / Empresa *</label>
              <input type="text" class="form-control-dash" v-model="collabForm.entity" placeholder="Ej: Empresa S.A.">
            </div>
            <div class="form-group-full">
              <label class="label-md">Tipo de Colaboración *</label>
              <select class="form-control-dash" v-model="collabForm.type">
                <option value="Apoyando Proyectos">Apoyando Proyectos</option>
                <option value="Donando Productos">Donando Productos</option>
                <option value="Contratando Empresas">Contratando Empresas</option>
                <option value="Apoyando Inserción">Apoyando Inserción</option>
              </select>
            </div>
            <div class="form-group-half">
              <label class="label-md">Estado de Solicitud *</label>
              <select class="form-control-dash" v-model="collabForm.status">
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
            <div class="form-group-half">
              <label class="label-md">Fecha de Registro</label>
              <input type="text" class="form-control-dash" v-model="collabForm.date" readonly>
            </div>
            <div class="form-group-full">
              <label class="label-md">Logo o Imagen de la Colaboración</label>
              <div class="news-image-field">
                <div class="news-image-preview">
                  <img v-if="collabForm.imageUrl" :src="collabForm.imageUrl" alt="Vista previa del logo">
                  <span v-else class="material-symbols-outlined">handshake</span>
                </div>
                <div class="news-image-controls">
                  <input type="url" class="form-control-dash" v-model="collabForm.imageUrl" placeholder="Pega aquí el enlace de una imagen">
                  <label class="file-upload-button">
                    <span class="material-symbols-outlined">upload</span>
                    Subir logo local
                    <input type="file" accept="image/*" @change="handleCollabImageFile">
                  </label>
                  <div class="image-helper-row">
                    <span>{{ collabForm.imageName || 'Puedes usar una URL o seleccionar una imagen de tu equipo.' }}</span>
                    <button v-if="collabForm.imageUrl" type="button" class="link-button" @click="clearCollabImage">
                      Quitar logo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario Usuarios -->
          <div v-else-if="modalType === 'usuarios' || modalType === 'usuario'" class="form-grid">
            <div class="form-group-half">
              <label class="label-md">Nombre de usuario *</label>
              <input type="text" class="form-control-dash" v-model="userForm.username" placeholder="Ej: jdoe">
            </div>
            <div class="form-group-half">
              <label class="label-md">Email *</label>
              <input type="email" class="form-control-dash" v-model="userForm.email" placeholder="Ej: jdoe@penascal.com">
            </div>
            <div class="form-group-half">
              <label class="label-md">Contraseña {{ modalMode === 'create' ? '*' : '(dejar en blanco para conservar)' }}</label>
              <input type="password" class="form-control-dash" v-model="userForm.password" placeholder="Mínimo 6 caracteres">
            </div>
            <div class="form-group-half">
              <label class="label-md">Confirmar Contraseña {{ modalMode === 'create' ? '*' : '' }}</label>
              <input type="password" class="form-control-dash" v-model="userForm.confirmPassword" placeholder="Repite la contraseña">
            </div>
            <div class="form-group-half">
              <label class="label-md">Rol Global *</label>
              <select class="form-control-dash" v-model="userForm.role">
                <option value="user">Usuario normal</option>
                <option value="admin">Administrador global</option>
              </select>
            </div>
            <div class="form-group-half">
              <label class="label-md">Nombre (Perfil) *</label>
              <input type="text" class="form-control-dash" v-model="userForm.name" placeholder="Ej: Juan">
            </div>
            <div class="form-group-half">
              <label class="label-md">Apellidos (Perfil) *</label>
              <input type="text" class="form-control-dash" v-model="userForm.lastNames" placeholder="Ej: Pérez García">
            </div>
            <div class="form-group-half">
              <label class="label-md">Teléfono</label>
              <input type="text" class="form-control-dash" v-model="userForm.telefono" placeholder="Ej: 600123456">
            </div>
            <div class="form-group-half">
              <label class="label-md">Rol del Sistema *</label>
              <select class="form-control-dash" v-model="userForm.rolId">
                <option v-for="role in dbRoles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </div>
            <div class="form-group-full">
              <label class="checkbox-label-dash">
                <input type="checkbox" v-model="userForm.is_verified">
                <div>
                  <strong>Usuario verificado</strong>
                  <p>Si está marcado, el usuario podrá iniciar sesión sin verificar su email.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="secondary-button" @click="isModalOpen = false" :disabled="usersLoading">Cancelar</button>
          <button class="primary-button-accent" @click="saveModalData" :disabled="usersLoading">
            <template v-if="usersLoading">
              <div class="loading-spinner-sm"></div>
              <span>Procesando...</span>
            </template>
            <template v-else>
              {{ modalType === 'alumno' ? (modalMode === 'create' ? 'Añadir alumno' : 'Guardar alumno') : modalMode === 'create' ? 'Crear registro' : 'Guardar cambios' }}
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SISTEMA DE NOTIFICACIONES (TOAST)
         ========================================== -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast-message', `toast--${toast.type}`]">
        <span class="material-symbols-outlined">
          {{ toast.type === 'success' ? 'check_circle' : 'error' }}
        </span>
        <p>{{ toast.message }}</p>
      </div>
    </Transition>
  </DashboardShell>
</template>

<style scoped>
/* Transiciones */
.fade-in {
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-up {
  animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.97); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* ================================================================
   1. ESTILOS SECCIÓN GENERAL: RESUMEN
   ================================================================ */
.dashboard-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 220px;
  align-items: end;
  gap: 24px;
  margin-bottom: 20px;
  padding: 28px;
  border: 1px solid rgba(0, 52, 41, 0.16);
  border-radius: var(--radius-default);
  background:
    linear-gradient(130deg, rgba(181, 36, 36, 0.82) 0%, rgba(0, 52, 41, 0.96) 43%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  box-shadow: 0 24px 56px rgba(0, 52, 41, 0.2);
}

.dashboard-hero::after {
  content: '';
  position: absolute;
  inset: auto -80px -140px auto;
  width: 360px;
  height: 360px;
  border: 58px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.hero-copy,
.hero-actions,
.hero-status-card {
  position: relative;
  z-index: 1;
}

.hero-kicker,
.section-label {
  margin-bottom: 8px;
  color: var(--color-secondary-container);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0;
}

.dashboard-hero h2 {
  max-width: 760px;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0;
}

.hero-text {
  max-width: 620px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 15px;
  font-weight: 650;
}

.hero-actions {
  display: grid;
  gap: 10px;
}

.secondary-button,
.dark-button,
.panel-icon-button,
.primary-button-accent {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: var(--radius-default);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  transition: all var(--transition-base);
  border: 1px solid transparent;
  cursor: pointer;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.28);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.secondary-button.compact {
  min-height: 34px;
  padding: 0 12px;
  font-size: 12px;
  background: var(--color-surface-container);
  color: var(--color-on-surface);
  border-color: var(--color-outline-variant);
}

.secondary-button.compact:hover {
  background: var(--color-surface-container-high);
}

.dark-button {
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  border: 1px solid var(--color-surface-container-lowest);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-button:hover {
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  border-color: var(--color-primary-container);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.primary-button-accent {
  background: var(--color-secondary);
  color: var(--color-on-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.primary-button-accent:hover {
  background: var(--color-on-secondary-container);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.primary-button-accent:disabled {
  background: var(--color-outline-variant);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.danger-button-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: var(--radius-default);
  font-size: 12px;
  font-weight: 800;
  border: 1px solid var(--color-secondary-container);
  background: var(--color-surface-container-lowest);
  color: var(--color-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.danger-button-outline:hover {
  background: var(--color-secondary-container);
  border-color: var(--color-secondary);
  color: var(--color-on-secondary-container);
}

.hero-status-card {
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-default);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.hero-status-card span,
.hero-status-card small {
  display: block;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 800;
}

.hero-status-card strong {
  display: block;
  margin: 8px 0;
  color: #ffffff;
  font-size: 38px;
  line-height: 42px;
}

.progress-track {
  height: 8px;
  margin-bottom: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.progress-track i {
  display: block;
  width: 86%;
  height: 100%;
  border-radius: inherit;
  background: var(--color-surface-container-lowest);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
  gap: 16px;
}

.work-panel,
.activity-panel,
.modules-panel {
  min-width: 0;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.work-panel:hover,
.activity-panel:hover,
.modules-panel:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.panel-header.compact {
  padding-bottom: 14px;
}

.section-label {
  color: var(--color-secondary);
}

.panel-header h3 {
  font-size: 20px;
  line-height: 26px;
}

.panel-icon-button {
  width: 42px;
  padding: 0;
  border: 1px solid var(--color-outline-variant);
  color: var(--color-primary);
  background: var(--color-surface-container-lowest);
}

.task-counter {
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: rgba(0, 52, 41, 0.08);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 850;
}

.task-create-form {
  display: grid;
  grid-template-columns: minmax(180px, 1.4fr) minmax(120px, 0.8fr) minmax(150px, 1fr) 116px 110px auto;
  gap: 10px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--color-surface-container);
  background: var(--color-surface-container-low);
}

.task-create-form label {
  display: block;
  margin-bottom: 5px;
}

.task-create-form input,
.task-create-form select {
  width: 100%;
  min-height: 38px;
  padding: 8px 10px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface);
  font-family: var(--font-family);
  font-size: 13px;
  outline: 0;
}

.task-submit-button {
  align-self: end;
  min-height: 38px;
  padding: 0 12px;
}

.task-list {
  display: grid;
}

.task-row {
  display: grid;
  grid-template-columns: 34px 10px minmax(0, 1fr) 86px 34px;
  align-items: center;
  gap: 12px;
  min-height: 82px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.task-row:last-child {
  border-bottom: 0;
}

.task-marker {
  width: 10px;
  height: 42px;
  border-radius: 999px;
  background: var(--color-outline-variant);
}

.task-check,
.task-delete {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-outline);
  cursor: pointer;
  transition: all var(--transition-base);
}

.task-check:hover {
  border-color: #2e7d32;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.06);
}

.task-delete:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  background: rgba(181, 36, 36, 0.06);
}

.task-check span,
.task-delete span {
  margin: 0;
  font-size: 19px;
}

.task-marker--alta {
  background: var(--color-secondary);
}

.task-marker--media {
  background: #c48a18;
}

.task-marker--baja {
  background: var(--color-primary);
}

.task-row strong,
.task-row span {
  display: block;
}

.task-row strong {
  color: var(--color-on-surface);
  font-size: 15px;
  line-height: 21px;
}

.task-row span {
  margin-top: 4px;
  color: var(--color-on-surface-variant);
  font-size: 13px;
}

.task-meta {
  display: grid;
  justify-items: end;
  gap: 5px;
}

.task-row small {
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-container-low);
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 800;
}

.task-meta time {
  color: var(--color-outline);
  font-size: 12px;
  font-weight: 750;
}

.tasks-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 88px;
  color: var(--color-outline);
  font-size: 14px;
  font-weight: 750;
}

.completed-task-panel {
  display: grid;
  gap: 8px;
  padding: 14px 18px 18px;
  border-top: 1px solid var(--color-surface-container);
  background: rgba(46, 125, 50, 0.035);
}

.completed-task-panel > strong {
  color: #2e7d32;
  font-size: 12px;
  text-transform: uppercase;
}

.completed-task {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 8px 10px;
  border: 1px solid rgba(46, 125, 50, 0.16);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface-variant);
  font-size: 13px;
  font-weight: 750;
  text-align: left;
  text-decoration: line-through;
  cursor: pointer;
}

.completed-task span {
  color: #2e7d32;
  font-size: 19px;
}

.side-stack {
  display: grid;
  gap: 16px;
}

.module-list {
  display: grid;
  gap: 10px;
  padding: 14px;
}

.module-card {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  min-height: 68px;
  padding: 12px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
  text-align: left;
  transition: all var(--transition-base);
  cursor: pointer;
}

.module-card:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-container-lowest);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.module-card .material-symbols-outlined {
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-default);
  background: rgba(0, 52, 41, 0.1);
  color: var(--color-primary);
}

.module-card--red .material-symbols-outlined {
  background: rgba(181, 36, 36, 0.1);
  color: var(--color-secondary);
}

.module-card--stone .material-symbols-outlined {
  background: rgba(196, 138, 24, 0.12);
  color: #9a680d;
}

.module-card strong {
  color: var(--color-on-surface);
  font-size: 14px;
}

.module-card small {
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 750;
}

.profile-editor-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.36fr) minmax(0, 0.64fr);
  gap: 18px;
  align-items: start;
}

.profile-preview-card,
.profile-form-card {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
}

.profile-preview-card {
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 28px;
  text-align: center;
}

.profile-avatar-preview {
  display: grid;
  place-items: center;
  width: 132px;
  height: 132px;
  overflow: hidden;
  border: 4px solid #ffffff;
  border-radius: 32px;
  box-shadow: var(--shadow-md);
  color: #ffffff;
  font-size: 34px;
  font-weight: 900;
}

.profile-avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-preview-card h2 {
  color: var(--color-primary);
  font-size: 24px;
  line-height: 30px;
}

.profile-preview-card p {
  color: var(--color-on-surface-variant);
  font-size: 14px;
  font-weight: 700;
}

.profile-form-card {
  display: grid;
  gap: 20px;
  padding: 24px;
}

.profile-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-surface-container-low);
}

.profile-section-header h3,
.avatar-editor-panel h3 {
  color: var(--color-primary);
  font-size: 20px;
}

.profile-color-input {
  width: 100%;
  min-height: 44px;
  padding: 6px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
  cursor: pointer;
}

.avatar-editor-panel {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
}

.avatar-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.avatar-initials-button {
  border-color: var(--color-outline-variant);
}

.avatar-preset-grid {
  display: grid;
  grid-template-columns: repeat(6, 54px);
  gap: 10px;
}

.avatar-preset-button {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border: 3px solid transparent;
  border-radius: var(--radius-default);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: all var(--transition-base);
}

.avatar-preset-button:hover,
.avatar-preset-button.active {
  border-color: #ffffff;
  box-shadow: 0 0 0 2px var(--color-primary);
  transform: translateY(-2px);
}

.activity-list {
  display: grid;
  gap: 0;
}

.activity-list li {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.activity-list li:last-child {
  border-bottom: 0;
}

.activity-list time {
  color: var(--color-secondary);
  font-size: 13px;
  font-weight: 850;
}

.activity-list p {
  color: var(--color-on-surface-variant);
  font-size: 14px;
  line-height: 20px;
}

/* ================================================================
   2. ESTILOS COMUNES DE TABLAS DE DATOS Y FILTROS
   ================================================================ */
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 460px;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-sm);
}

.search-box span {
  color: var(--color-outline);
  font-size: 20px;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-on-surface);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
}

.search-box input::placeholder {
  color: var(--color-outline);
}

.data-table-container {
  overflow-x: auto;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-surface-container-low);
}

.data-table th {
  background: var(--color-surface-container-low);
  color: var(--color-on-surface);
  font-weight: 800;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
}

.data-table tbody tr:hover {
  background: rgba(0, 52, 41, 0.02);
}

.course-row-clickable {
  cursor: pointer;
}

.course-row-clickable:hover,
.course-row-clickable--open {
  background: rgba(0, 52, 41, 0.045) !important;
}

.primary-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 400px;
}

.primary-cell-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.course-thumbnail {
  flex-shrink: 0;
  width: 48px;
  height: 32px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  background: var(--color-surface-container-low);
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.collab-thumbnail {
  flex-shrink: 0;
  width: 48px;
  height: 32px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  background: var(--color-surface-container-low);
}

.collab-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: white;
}

.primary-cell strong {
  display: block;
  color: var(--color-on-surface);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.cell-excerpt {
  display: block;
  margin-top: 4px;
  color: var(--color-on-surface-variant);
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.code-cell {
  font-family: monospace;
  font-weight: 700;
  color: var(--color-secondary);
}

.news-thumb {
  display: grid;
  place-items: center;
  width: 68px;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
  color: var(--color-outline);
}

.news-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actions-col {
  text-align: right;
  width: 190px;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-outline);
  cursor: pointer;
  transition: all var(--transition-base);
}

.action-btn span {
  font-size: 18px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.action-btn.add-student:hover:not(:disabled) {
  border-color: #2e7d32;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.05);
}

.action-btn.view-students:hover {
  border-color: #9a680d;
  color: #9a680d;
  background: rgba(196, 138, 24, 0.08);
}

.action-btn.edit:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(0, 52, 41, 0.05);
}

.action-btn.delete:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  background: rgba(181, 36, 36, 0.05);
}

.action-btn.approve:hover {
  border-color: #2e7d32;
  color: #2e7d32;
  background: rgba(46, 125, 50, 0.05);
}

.action-btn.reject:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
  background: rgba(181, 36, 36, 0.05);
}

.empty-state-row {
  text-align: center;
  padding: 48px !important;
  color: var(--color-outline);
  font-size: 15px;
}

.empty-state-row span {
  display: block;
  font-size: 40px;
  margin-bottom: 8px;
}

.students-row td {
  padding: 0 20px 18px;
  background: rgba(0, 52, 41, 0.025);
}

.students-panel {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
}

.students-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-surface-container-low);
}

.students-panel-header strong,
.students-panel-header span {
  display: block;
}

.students-panel-header strong {
  color: var(--color-primary);
  font-size: 15px;
}

.students-panel-header span {
  margin-top: 3px;
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 700;
}

.students-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-surface-container-low);
  border-radius: var(--radius-default);
}

.students-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
}

.students-table th,
.students-table td {
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-surface-container-low);
  vertical-align: middle;
}

.students-table th {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.students-table tbody tr:last-child td {
  border-bottom: 0;
}

.students-table tbody tr:hover {
  background: rgba(0, 52, 41, 0.025);
}

.student-name-cell strong {
  color: var(--color-on-surface);
  font-size: 13px;
  line-height: 18px;
}

.student-notes-cell {
  max-width: 240px;
  color: var(--color-on-surface-variant);
  font-size: 12px;
  line-height: 18px;
}

.students-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 72px;
  color: var(--color-outline);
  font-size: 14px;
  font-weight: 700;
}

/* Chips / Badges */
.table-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.chip-green {
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
}

.chip-yellow {
  background: rgba(196, 138, 24, 0.12);
  color: #9a680d;
}

.chip-red {
  background: rgba(181, 36, 36, 0.1);
  color: var(--color-secondary);
}

.chip-gray {
  background: var(--color-surface-container);
  color: var(--color-on-surface-variant);
}

/* mini progress bar for course capacity */
.progress-bar-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 120px;
}

.progress-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-on-surface-variant);
}

.progress-bar-mini {
  height: 6px;
  background: var(--color-surface-container);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-mini span {
  display: block;
  height: 100%;
  background: var(--color-primary);
  border-radius: inherit;
}

/* ================================================================
   3. ESTILOS SECCIÓN: MENSAJES (BUZÓN DE ENTRADA)
   ================================================================ */
.messages-tab-layout {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 20px;
  min-height: calc(100vh - 200px);
}

.inbox-list-panel {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.inbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-surface-container);
  background: var(--color-surface-container-low);
}

.inbox-header h3 {
  font-size: 16px;
  font-weight: 800;
}

.badge-count {
  background: var(--color-secondary);
  color: var(--color-on-secondary);
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.message-items {
  flex: 1;
  overflow-y: auto;
  max-height: 580px;
}

.message-item-card {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-surface-container-low);
  cursor: pointer;
  transition: all var(--transition-base);
}

.message-item-card:hover {
  background: rgba(0, 52, 41, 0.02);
}

.message-item-card.active {
  background: rgba(0, 52, 41, 0.05);
  border-left: 4px solid var(--color-primary);
}

.message-item-card.unread {
  background: rgba(181, 36, 36, 0.02);
}

.message-item-card.unread::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 8px;
  width: 6px;
  height: 6px;
  background: var(--color-secondary);
  border-radius: 999px;
}

.message-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-item-meta strong {
  font-size: 14px;
  color: var(--color-on-surface);
}

.message-item-card.unread .message-item-meta strong {
  font-weight: 800;
}

.message-item-meta time {
  font-size: 11px;
  color: var(--color-outline);
}

.message-item-subject {
  font-size: 13px;
  font-weight: 750;
  color: var(--color-on-surface);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-item-card.unread .message-item-subject {
  color: var(--color-primary);
  font-weight: 800;
}

.message-item-excerpt {
  font-size: 12px;
  color: var(--color-on-surface-variant);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-inbox {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-outline);
}

.empty-inbox span {
  display: block;
  font-size: 32px;
  margin-bottom: 8px;
}

.inbox-detail-panel {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.message-detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.detail-header h2 {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.sender-info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: var(--color-on-surface-variant);
}

.sender-info strong {
  color: var(--color-on-surface);
}

.detail-actions {
  display: flex;
  gap: 8px;
}

.message-body {
  padding: 24px 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-on-surface);
  border-bottom: 1px solid var(--color-surface-container);
  white-space: pre-line;
}

.reply-section {
  margin-top: auto;
  padding-top: 20px;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-default);
  padding: 16px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--color-primary);
}

.reply-header span {
  font-size: 20px;
}

.reply-textarea {
  width: 100%;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  padding: 12px;
  font-family: var(--font-family);
  font-size: 14px;
  resize: vertical;
  background: var(--color-surface-container-lowest);
  outline: 0;
  transition: border-color var(--transition-base);
}

.reply-textarea:focus {
  border-color: var(--color-primary);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.empty-detail-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-outline);
}

.empty-detail-state span {
  font-size: 48px;
  margin-bottom: 12px;
}

/* ================================================================
   4. ESTILOS SECCIÓN: AJUSTES (CONFIGURACIÓN)
   ================================================================ */
.settings-grid {
  display: grid;
  gap: 20px;
  max-width: 780px;
}

.settings-card {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  padding: 24px;
}

.settings-card h3 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 18px;
  border-bottom: 1px solid var(--color-surface-container-low);
  padding-bottom: 10px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-group-full {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group-half {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group-split {
  grid-column: span 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 8px;
}

.news-image-field {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
}

.news-image-preview {
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-outline);
}

.news-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-image-controls {
  display: grid;
  align-content: start;
  gap: 10px;
}

.file-upload-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
  border: 1px dashed var(--color-primary);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-base);
}

.file-upload-button:hover {
  background: rgba(0, 52, 41, 0.05);
}

.file-upload-button input {
  display: none;
}

.image-helper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 700;
}

.link-button {
  border: 0;
  background: transparent;
  color: var(--color-secondary);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}

.selected-course-summary {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
}

.selected-course-summary .material-symbols-outlined {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-default);
  background: rgba(0, 52, 41, 0.1);
  color: var(--color-primary);
}

.selected-course-summary strong,
.selected-course-summary p {
  display: block;
}

.selected-course-summary strong {
  color: var(--color-on-surface);
  font-size: 14px;
  line-height: 20px;
}

.selected-course-summary p {
  margin-top: 3px;
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 700;
}

.form-control-dash {
  width: 100%;
  padding: 12px 14px;
  background: var(--color-surface-container-low);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  font-family: var(--font-family);
  font-size: 14px;
  color: var(--color-on-surface);
  transition: all var(--transition-base);
  outline: none;
}

.form-control-dash:focus {
  border-color: var(--color-primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 52, 41, 0.1);
}

textarea.form-control-dash {
  resize: vertical;
}

.checkbox-label-dash {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  padding: 14px;
  background: var(--color-surface-container-low);
  cursor: pointer;
  transition: all var(--transition-base);
}

.checkbox-label-dash input {
  margin-top: 3px;
  accent-color: var(--color-primary);
}

.checkbox-label-dash strong {
  display: block;
  font-size: 13px;
  color: var(--color-on-surface);
}

.checkbox-label-dash p {
  font-size: 11px;
  color: var(--color-on-surface-variant);
  margin-top: 2px;
}

.settings-actions-panel {
  display: flex;
  justify-content: flex-end;
}

.btn-large {
  padding: 14px 28px;
  font-size: 14px;
}

/* ================================================================
   5. MODAL POPUP
   ================================================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: #ffffff;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-surface-container-low);
  background: var(--color-surface-container-low);
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary);
}

.modal-close-btn {
  background: transparent;
  border: 0;
  color: var(--color-outline);
  cursor: pointer;
  display: inline-flex;
}

.modal-close-btn:hover {
  color: var(--color-secondary);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-surface-container-low);
  background: var(--color-surface-container-low);
}

/* ================================================================
   6. TOAST DE FEEDBACK
   ================================================================ */
.toast-message {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1010;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: var(--radius-default);
  background: #ffffff;
  color: var(--color-on-surface);
  box-shadow: var(--shadow-lg);
  border-left: 6px solid #2e7d32;
  font-weight: 700;
  font-size: 14px;
}

.toast--error {
  border-left-color: var(--color-secondary);
}

.toast-message span {
  font-size: 22px;
}

.toast--success span {
  color: #2e7d32;
}

.toast--error span {
  color: var(--color-secondary);
}

/* Transiciones del Toast */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.9);
}

/* Responsive general */
@media (max-width: 980px) {
  .messages-tab-layout {
    grid-template-columns: 1fr;
  }
  .inbox-list-panel {
    max-height: 320px;
  }
  .message-items {
    max-height: 240px;
  }
}

@media (max-width: 720px) {
  .dashboard-hero {
    grid-template-columns: 1fr;
    align-items: start;
    padding: 20px;
  }

  .dashboard-hero h2 {
    font-size: 23px;
    line-height: 30px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .hero-status-card {
    max-width: none;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .profile-editor-grid {
    grid-template-columns: 1fr;
  }

  .profile-section-header {
    align-items: stretch;
    flex-direction: column;
  }

  .avatar-preset-grid {
    grid-template-columns: repeat(3, 54px);
  }

  .task-create-form {
    grid-template-columns: 1fr;
  }

  .task-row {
    grid-template-columns: 34px 10px minmax(0, 1fr) 34px;
  }

  .task-meta {
    grid-column: 3;
    justify-items: start;
    display: flex;
  }
  
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group-full,
  .form-group-half,
  .form-group-split {
    grid-column: span 1;
  }
  
  .form-group-split {
    grid-template-columns: 1fr;
  }

  .news-image-field {
    grid-template-columns: 1fr;
  }

  .students-panel-header {
    align-items: stretch;
    flex-direction: column;
  }
}

/* User Tab Specific Styles */
.user-cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  border: 1px solid #cbd5e1;
}

.loading-state-placeholder,
.error-state-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: var(--color-surface-container-lowest);
  border-radius: 12px;
  border: 1px solid var(--color-outline-variant);
  gap: 16px;
  margin: 20px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #1e3a8a; /* Navy accent for Tuani */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner-sm {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-table-placeholder {
  text-align: center;
  padding: 40px !important;
  color: #64748b;
  font-style: italic;
}
</style>
