<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import MetricCard from '../MetricCard.vue'
import { useContent } from '../../../composables/useContent'
import { useAuth } from '../../../composables/useAuth'

const emit = defineEmits(['change-tab', 'toast'])

const { 
  newsList, 
  coursesList, 
  collaborationsList, 
  messagesList 
} = useContent()

const { user } = useAuth()

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

// --- Available Users for Tasks ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'
const usersList = ref([])

const fetchUsers = async () => {
  try {
    const tokenVal = localStorage.getItem('token')
    if (!tokenVal) return
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenVal}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    if (response.ok) {
      usersList.value = data.data || []
    }
  } catch (err) {
    console.error('Error fetching users for tasks:', err)
  }
}

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
    emit('toast', { message: 'Escribe un título para la tarea', type: 'error' })
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
  emit('toast', { message: 'Tarea añadida correctamente', type: 'success' })
}

const toggleTaskCompleted = (task) => {
  task.completed = !task.completed
  emit('toast', { message: task.completed ? 'Tarea marcada como realizada' : 'Tarea reabierta', type: 'success' })
}

const deleteTask = (taskId) => {
  const index = tasks.value.findIndex(task => task.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    emit('toast', { message: 'Tarea eliminada', type: 'error' })
  }
}

watch(tasks, (val) => localStorage.setItem('pen_tasks', JSON.stringify(val)), { deep: true })

onMounted(() => {
  fetchUsers()
  resetTaskForm()
})
</script>

<template>
  <div class="fade-in">
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
        <button class="dark-button" type="button" @click="emit('change-tab', 'Noticias')">
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
              @click="emit('change-tab', module.label)"
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
</template>

<style scoped>
.fade-in {
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

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

.panel-header h3 {
  font-size: 20px;
  line-height: 26px;
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
}
</style>
