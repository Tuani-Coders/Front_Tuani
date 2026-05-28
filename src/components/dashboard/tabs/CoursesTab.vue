<script setup>
import { ref, reactive, computed } from 'vue'
import { useContent } from '../../../composables/useContent'

const emit = defineEmits(['toast'])

const { coursesList } = useContent()

// --- State ---
const courseSearchQuery = ref('')
const expandedCourseId = ref('')

const isModalOpen = ref(false)
const modalType = ref('formacion') // 'formacion', 'alumno'
const modalMode = ref('create') // 'create', 'edit'
const editIndex = ref(-1)

const courseForm = reactive({
  id: '',
  name: '',
  category: 'Grado Básico',
  duration: '2000h',
  enrolled: 0,
  capacity: 15,
  status: 'Activo',
  imageUrl: '',
  imageName: ''
})

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

// --- Computed ---
const filteredCourses = computed(() => {
  if (!courseSearchQuery.value.trim()) return coursesList.value
  const query = courseSearchQuery.value.toLowerCase()
  return coursesList.value.filter(c => 
    c.name.toLowerCase().includes(query) || 
    c.id.toLowerCase().includes(query) ||
    c.category.toLowerCase().includes(query)
  )
})

const selectedCourse = computed(() => {
  return coursesList.value.find(course => course.id === selectedCourseId.value)
})

// --- Helpers ---
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

// --- Image Handling ---
const handleCourseImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    emit('toast', { message: 'Selecciona un archivo de imagen válido', type: 'error' })
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

// --- Course Modals ---
const openCreateModal = () => {
  modalType.value = 'formacion'
  modalMode.value = 'create'
  editIndex.value = -1
  courseForm.id = ''
  courseForm.name = ''
  courseForm.category = 'Grado Básico'
  courseForm.duration = '2000h'
  courseForm.enrolled = 0
  courseForm.capacity = 15
  courseForm.status = 'Activo'
  courseForm.imageUrl = ''
  courseForm.imageName = ''
  isModalOpen.value = true
}

const openEditModal = (item, index) => {
  modalType.value = 'formacion'
  modalMode.value = 'edit'
  editIndex.value = index
  courseForm.id = item.id || ''
  courseForm.name = item.name || ''
  courseForm.category = item.category || 'Grado Básico'
  courseForm.duration = item.duration || '2000h'
  courseForm.enrolled = item.enrolled || 0
  courseForm.capacity = item.capacity || 15
  courseForm.status = item.status || 'Activo'
  courseForm.imageUrl = item.imageUrl || ''
  courseForm.imageName = item.imageName || ''
  isModalOpen.value = true
}

const deleteCourse = (index) => {
  if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
    coursesList.value.splice(index, 1)
    emit('toast', { message: 'Curso eliminado correctamente', type: 'error' })
  }
}

// --- Student Modals & Logic ---
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
  if (!confirm('¿Estás seguro de que deseas desmatricular a este alumno?')) return
  const students = getCourseStudents(course)
  const studentIndex = students.findIndex(student => student.id === studentId)
  if (studentIndex === -1) return

  const [removedStudent] = students.splice(studentIndex, 1)
  course.students = students
  course.enrolled = Math.max(0, getCourseStudents(course).length)
  syncCourseStatus(course)
  emit('toast', { message: `${removedStudent.firstName} ${removedStudent.lastNames} eliminado del curso`, type: 'error' })
}

const saveStudentData = () => {
  const course = selectedCourse.value
  if (!course) {
    emit('toast', { message: 'No se ha encontrado el curso seleccionado', type: 'error' })
    return
  }

  if (modalMode.value === 'create' && isCourseFull(course)) {
    emit('toast', { message: 'El curso ya tiene el cupo completo', type: 'error' })
    return
  }

  if (!studentForm.firstName.trim() || !studentForm.lastNames.trim() || !studentForm.phone.trim() || !studentForm.email.trim()) {
    emit('toast', { message: 'Completa nombre, apellidos, teléfono y email del alumno', type: 'error' })
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email.trim())) {
    emit('toast', { message: 'Introduce un email válido para el alumno', type: 'error' })
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
      emit('toast', { message: 'No se ha encontrado el alumno seleccionado', type: 'error' })
      return
    }

    course.students[studentIndex] = {
      ...course.students[studentIndex],
      ...studentData,
      registeredAt: course.students[studentIndex].registeredAt || studentData.registeredAt
    }
    emit('toast', { message: `${studentData.firstName} ${studentData.lastNames} actualizado correctamente`, type: 'success' })
  } else {
    course.students.push(studentData)
    course.enrolled = course.students.length
    emit('toast', { message: `${studentData.firstName} ${studentData.lastNames} añadido a ${course.name}`, type: 'success' })
  }

  syncCourseStatus(course)
  isModalOpen.value = false
}

// --- Save Course or Student Data ---
const saveModalData = () => {
  if (modalType.value === 'alumno') {
    saveStudentData()
    return
  }

  if (!courseForm.id.trim() || !courseForm.name.trim()) {
    emit('toast', { message: 'El código y el nombre del curso son obligatorios', type: 'error' })
    return
  }

  if (modalMode.value === 'create') {
    coursesList.value.push({ ...courseForm, students: [] })
    emit('toast', { message: 'Curso añadido correctamente', type: 'success' })
  } else {
    // Keep existing students list when editing a course
    const existingStudents = coursesList.value[editIndex.value]?.students || []
    coursesList.value[editIndex.value] = { ...courseForm, students: existingStudents }
    emit('toast', { message: 'Curso actualizado correctamente', type: 'success' })
  }
  isModalOpen.value = false
}

defineExpose({
  openCreateModal
})
</script>

<template>
  <div class="fade-in">
    <div class="table-controls">
      <div class="search-box">
        <span class="material-symbols-outlined">search</span>
        <input type="text" v-model="courseSearchQuery" placeholder="Buscar por código, nombre o categoría...">
      </div>
      <button class="primary-button-accent" @click="openCreateModal">
        <span class="material-symbols-outlined">add</span>
        Añadir Curso
      </button>
    </div>

    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Categoría</th>
            <th>Duración</th>
            <th>Ocupación</th>
            <th>Estado</th>
            <th class="actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in filteredCourses" :key="item.id">
            <tr 
              :class="[
                'course-row-clickable', 
                expandedCourseId === item.id ? 'course-row-clickable--open' : ''
              ]"
              @click="toggleCourseStudents(item.id)"
            >
              <td class="primary-cell">
                <div class="course-thumbnail">
                  <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name">
                  <span v-else class="material-symbols-outlined">school</span>
                </div>
                <div class="primary-cell-text">
                  <strong>{{ item.name }}</strong>
                  <span class="cell-excerpt code-cell">{{ item.id }}</span>
                </div>
              </td>
              <td>
                <span class="table-chip chip-gray">{{ item.category }}</span>
              </td>
              <td>{{ item.duration }}</td>
              <td>
                <div class="progress-bar-cell">
                  <span class="progress-text">{{ getCourseEnrollment(item) }} / {{ getCourseCapacity(item) }} plazas</span>
                  <div class="progress-bar-mini">
                    <span :style="{ width: `${getCourseOccupancy(item)}%` }"></span>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['table-chip', item.status === 'Activo' ? 'chip-green' : item.status === 'Completo' ? 'chip-yellow' : 'chip-red']">
                  {{ item.status }}
                </span>
              </td>
              <td class="actions-cell" @click.stop>
                <button 
                  class="action-btn add-student" 
                  title="Matricular Alumno" 
                  @click="openStudentModal(item)"
                  :disabled="isCourseFull(item)"
                >
                  <span class="material-symbols-outlined">person_add</span>
                </button>
                <button 
                  class="action-btn view-students" 
                  title="Ver Alumnos Inscritos" 
                  @click="toggleCourseStudents(item.id)"
                >
                  <span class="material-symbols-outlined">group</span>
                </button>
                <button class="action-btn edit" title="Editar Curso" @click="openEditModal(item, index)">
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="action-btn delete" title="Eliminar Curso" @click="deleteCourse(index)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </td>
            </tr>

            <!-- Desplegable de alumnos inscritos en este curso -->
            <tr v-if="expandedCourseId === item.id" class="students-row" :key="`${item.id}-students`">
              <td colspan="6">
                <div class="students-panel">
                  <div class="students-panel-header">
                    <div>
                      <strong>Alumnos Inscritos en el Curso</strong>
                      <span>{{ getCourseStudents(item).length }} registros guardados</span>
                    </div>
                  </div>

                  <div v-if="getCourseStudents(item).length" class="students-table-wrap">
                    <table class="students-table">
                      <thead>
                        <tr>
                          <th>Nombre del Alumno</th>
                          <th>DNI/NIE</th>
                          <th>Teléfono</th>
                          <th>Email</th>
                          <th>Situación</th>
                          <th>Notas</th>
                          <th class="actions-col">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="student in getCourseStudents(item)" :key="student.id">
                          <td class="student-name-cell">
                            <strong>{{ student.firstName }} {{ student.lastNames }}</strong>
                          </td>
                          <td><span class="code-cell">{{ student.dni || 'Sin especificar' }}</span></td>
                          <td>{{ student.phone }}</td>
                          <td>{{ student.email }}</td>
                          <td>
                            <span :class="['table-chip', student.employmentStatus === 'Trabajando' ? 'chip-green' : 'chip-yellow']">
                              {{ student.employmentStatus }}
                            </span>
                          </td>
                          <td class="student-notes-cell">{{ student.notes || 'Ninguna' }}</td>
                          <td class="actions-cell">
                            <button class="action-btn edit" title="Editar Ficha de Alumno" @click="openEditStudentModal(item, student)">
                              <span class="material-symbols-outlined">edit</span>
                            </button>
                            <button class="action-btn delete" title="Eliminar Alumno" @click="deleteStudent(item, student.id)">
                              <span class="material-symbols-outlined">person_remove</span>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="students-empty">
                    <span class="material-symbols-outlined">group_off</span>
                    No hay ningún alumno matriculado en este curso todavía.
                  </div>
                </div>
              </td>
            </tr>
          </template>
          <tr v-if="filteredCourses.length === 0">
            <td colspan="6" class="empty-state-row">
              <span class="material-symbols-outlined">find_in_page</span>
              No se encontraron cursos con los filtros aplicados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modales para Curso / Alumno -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-card fade-up">
        <div class="modal-header">
          <h2>
            {{ modalMode === 'create' ? 'Crear' : 'Editar' }} 
            {{ modalType === 'alumno' ? 'Alumno' : 'Curso' }}
          </h2>
          <button class="modal-close-btn" @click="isModalOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Formulario Formación -->
          <div v-if="modalType === 'formacion'" class="form-grid">
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

          <!-- Formulario Alta / Edición de Alumno -->
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
        </div>

        <div class="modal-footer">
          <button class="secondary-button" @click="isModalOpen = false">Cancelar</button>
          <button class="primary-button-accent" @click="saveModalData">
            {{ modalType === 'alumno' ? (modalMode === 'create' ? 'Añadir alumno' : 'Guardar alumno') : modalMode === 'create' ? 'Crear registro' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-row-clickable {
  cursor: pointer;
}

.course-row-clickable:hover,
.course-row-clickable--open {
  background: rgba(0, 52, 41, 0.045) !important;
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

.code-cell {
  font-family: monospace;
  font-weight: 700;
  color: var(--color-secondary);
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

.chip-red {
  background: rgba(181, 36, 36, 0.1);
  color: var(--color-secondary);
}

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

@media (max-width: 720px) {
  .news-image-field {
    grid-template-columns: 1fr;
  }
}
</style>
