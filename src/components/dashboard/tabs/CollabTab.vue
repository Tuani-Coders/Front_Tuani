<script setup>
import { ref, reactive, computed } from 'vue'
import { useContent } from '@/composables/useContent'

const emit = defineEmits(['toast'])

const { collaborationsList } = useContent()

// --- State ---
const collabSearchQuery = ref('')

const isModalOpen = ref(false)
const modalMode = ref('create') // 'create', 'edit'
const editIndex = ref(-1)

const collabForm = reactive({
  entity: '',
  type: 'Apoyando Proyectos',
  date: '',
  status: 'Pendiente',
  imageUrl: '',
  imageName: ''
})

// --- Computed ---
const filteredCollabs = computed(() => {
  if (!collabSearchQuery.value.trim()) return collaborationsList.value
  const query = collabSearchQuery.value.toLowerCase()
  return collaborationsList.value.filter(c => 
    c.entity.toLowerCase().includes(query) || 
    c.type.toLowerCase().includes(query)
  )
})

// --- Image Handling ---
const handleCollabImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    emit('toast', { message: 'Selecciona un archivo de imagen válido', type: 'error' })
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

// --- Actions ---
const openCreateModal = () => {
  modalMode.value = 'create'
  editIndex.value = -1
  collabForm.entity = ''
  collabForm.type = 'Apoyando Proyectos'
  collabForm.date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  collabForm.status = 'Pendiente'
  collabForm.imageUrl = ''
  collabForm.imageName = ''
  isModalOpen.value = true
}

const openEditModal = (item, index) => {
  modalMode.value = 'edit'
  editIndex.value = index
  collabForm.entity = item.entity || ''
  collabForm.type = item.type || 'Apoyando Proyectos'
  collabForm.date = item.date || ''
  collabForm.status = item.status || 'Pendiente'
  collabForm.imageUrl = item.imageUrl || ''
  collabForm.imageName = item.imageName || ''
  isModalOpen.value = true
}

const deleteCollab = (index) => {
  if (confirm('¿Estás seguro de que deseas eliminar este colaborador?')) {
    collaborationsList.value.splice(index, 1)
    emit('toast', { message: 'Colaboración eliminada correctamente', type: 'error' })
  }
}

const approveCollab = (index) => {
  collaborationsList.value[index].status = 'Aprobada'
  emit('toast', { message: 'Colaboración aprobada con éxito', type: 'success' })
}

const rejectCollab = (index) => {
  collaborationsList.value[index].status = 'Rechazada'
  emit('toast', { message: 'Colaboración rechazada', type: 'error' })
}

const saveModalData = () => {
  if (!collabForm.entity.trim()) {
    emit('toast', { message: 'El nombre de la entidad es obligatorio', type: 'error' })
    return
  }

  if (modalMode.value === 'create') {
    collaborationsList.value.unshift({ id: Date.now(), ...collabForm })
    emit('toast', { message: 'Colaboración registrada correctamente', type: 'success' })
  } else {
    collaborationsList.value[editIndex.value] = { ...collaborationsList.value[editIndex.value], ...collabForm }
    emit('toast', { message: 'Colaboración actualizada correctamente', type: 'success' })
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
        <input type="text" v-model="collabSearchQuery" placeholder="Buscar por entidad o tipo de apoyo...">
      </div>
      <button class="primary-button-accent" @click="openCreateModal">
        <span class="material-symbols-outlined">add</span>
        Registrar Colaborador
      </button>
    </div>

    <div class="data-table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Entidad</th>
            <th>Tipo de Apoyo</th>
            <th>Fecha Registro</th>
            <th>Estado</th>
            <th class="actions-col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredCollabs" :key="item.id">
            <td class="primary-cell">
              <div class="collab-thumbnail">
                <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.entity">
                <span v-else class="material-symbols-outlined">handshake</span>
              </div>
              <div class="primary-cell-text">
                <strong>{{ item.entity }}</strong>
              </div>
            </td>
            <td>{{ item.type }}</td>
            <td>{{ item.date }}</td>
            <td>
              <span :class="['table-chip', item.status === 'Aprobada' ? 'chip-green' : item.status === 'Pendiente' ? 'chip-yellow' : 'chip-red']">
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
              <button class="action-btn edit" title="Editar Datos" @click="openEditModal(item, index)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="action-btn delete" title="Eliminar Registro" @click="deleteCollab(index)">
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="filteredCollabs.length === 0">
            <td colspan="5" class="empty-state-row">
              <span class="material-symbols-outlined">find_in_page</span>
              No se encontraron colaboradores registrados.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de creación/edición de colaboradores -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-card fade-up">
        <div class="modal-header">
          <h2>{{ modalMode === 'create' ? 'Crear' : 'Editar' }} Colaborador</h2>
          <button class="modal-close-btn" @click="isModalOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
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
        </div>

        <div class="modal-footer">
          <button class="secondary-button" @click="isModalOpen = false">Cancelar</button>
          <button class="primary-button-accent" @click="saveModalData">
            {{ modalMode === 'create' ? 'Crear registro' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>
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

.fade-up {
  animation: fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.97); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

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

/* Modal Popup Styles */
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

.primary-button-accent,
.secondary-button {
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

.secondary-button {
  background: var(--color-surface-container);
  color: var(--color-on-surface);
  border-color: var(--color-outline-variant);
}

.secondary-button:hover {
  background: var(--color-surface-container-high);
}

@media (max-width: 720px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group-full,
  .form-group-half {
    grid-column: span 1;
  }
  .news-image-field {
    grid-template-columns: 1fr;
  }
}
</style>
