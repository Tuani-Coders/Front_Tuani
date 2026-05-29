<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useContent } from '@/composables/useContent'

const emit = defineEmits(['toast'])

const {
  newsList,
  newsLoading,
  newsError,
  fetchAdminNews,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem
} = useContent()

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

// --- Modal State ---
const isModalOpen = ref(false)
const modalMode = ref('create') // 'create', 'edit'
const editId = ref(null)
const saving = ref(false)

onMounted(() => {
  fetchAdminNews()
})

const newGalleryUrl = ref('')

const newsForm = reactive({
  title: '',
  tag: 'Formación',
  excerpt: '',
  content: '',
  date: '',
  status: 'Publicado',
  author: 'Administrador',
  imageUrl: '',
  imageName: '',
  additionalImages: []
})

const handleNewsImageFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    emit('toast', { message: 'Selecciona un archivo de imagen válido', type: 'error' })
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

const handleAdditionalImagesUpload = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!file.type.startsWith('image/')) {
      emit('toast', { message: 'El archivo ' + file.name + ' no es una imagen válida', type: 'error' })
      continue
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (!newsForm.additionalImages) {
        newsForm.additionalImages = []
      }
      newsForm.additionalImages.push({
        url: reader.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  }
  event.target.value = ''
}

const addGalleryUrl = () => {
  if (!newGalleryUrl.value.trim()) return
  if (!newsForm.additionalImages) {
    newsForm.additionalImages = []
  }
  newsForm.additionalImages.push({
    url: newGalleryUrl.value.trim(),
    name: 'Imagen externa'
  })
  newGalleryUrl.value = ''
}

const removeAdditionalImage = (index) => {
  if (!newsForm.additionalImages) return
  newsForm.additionalImages.splice(index, 1)
}

const openCreateModal = () => {
  modalMode.value = 'create'
  editId.value = null
  newsForm.title = ''
  newsForm.tag = 'Formación'
  newsForm.excerpt = ''
  newsForm.content = ''
  newsForm.date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  newsForm.status = 'Publicado'
  newsForm.author = 'Administrador'
  newsForm.imageUrl = ''
  newsForm.imageName = ''
  newsForm.additionalImages = []
  newGalleryUrl.value = ''
  isModalOpen.value = true
}

const openEditModal = (item) => {
  modalMode.value = 'edit'
  editId.value = item.id
  newsForm.title = item.title || ''
  newsForm.tag = item.tag || 'Formación'
  newsForm.excerpt = item.excerpt || ''
  newsForm.content = item.content || ''
  newsForm.date = item.date || ''
  newsForm.status = item.status || 'Publicado'
  newsForm.author = item.author || 'Administrador'
  newsForm.imageUrl = item.imageUrl || ''
  newsForm.imageName = item.imageName || ''
  newsForm.additionalImages = item.additionalImages ? [...item.additionalImages] : []
  newGalleryUrl.value = ''
  isModalOpen.value = true
}

const saveModalData = async () => {
  if (!newsForm.title.trim() || !newsForm.excerpt.trim() || !newsForm.content.trim()) {
    emit('toast', { message: 'El título, el resumen y el contenido son obligatorios', type: 'error' })
    return
  }

  saving.value = true
  try {
    if (modalMode.value === 'create') {
      await createNewsItem(newsForm)
      emit('toast', { message: 'Noticia creada correctamente', type: 'success' })
    } else {
      await updateNewsItem(editId.value, newsForm)
      emit('toast', { message: 'Noticia actualizada correctamente', type: 'success' })
    }
    isModalOpen.value = false
  } catch (err) {
    emit('toast', { message: err.message || 'Error al guardar la noticia', type: 'error' })
  } finally {
    saving.value = false
  }
}

const deleteNews = async (item) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta noticia?')) return

  saving.value = true
  try {
    await deleteNewsItem(item.id)
    emit('toast', { message: 'Noticia eliminada correctamente', type: 'success' })
  } catch (err) {
    emit('toast', { message: err.message || 'Error al eliminar la noticia', type: 'error' })
  } finally {
    saving.value = false
  }
}

// Expose openCreateModal so parent component can open it
defineExpose({
  openCreateModal
})
</script>

<template>
  <div class="fade-in">
    <div class="table-controls">
      <div class="search-box">
        <span class="material-symbols-outlined">search</span>
        <input type="text" v-model="newsSearchQuery" placeholder="Buscar por título, categoría o texto...">
      </div>
      <button class="primary-button-accent" @click="openCreateModal">
        <span class="material-symbols-outlined">add</span>
        Publicar Noticia
      </button>
    </div>

    <div v-if="newsError" class="news-error-banner">
      <span class="material-symbols-outlined">error</span>
      <p>{{ newsError }}</p>
      <button type="button" class="secondary-button" @click="fetchAdminNews()">Reintentar</button>
    </div>

    <div v-if="newsLoading" class="news-loading">
      <span class="material-symbols-outlined spin">progress_activity</span>
      <p>Cargando noticias...</p>
    </div>

    <div class="data-table-container" v-else>
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
              <button class="action-btn edit" title="Editar Noticia" @click="openEditModal(item)">
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button class="action-btn delete" title="Eliminar Noticia" @click="deleteNews(item)">
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

    <!-- Modal de creación/edición de noticias -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-card fade-up">
        <div class="modal-header">
          <h2>{{ modalMode === 'create' ? 'Crear' : 'Editar' }} Noticia</h2>
          <button class="modal-close-btn" @click="isModalOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
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
              <label class="label-md">Descripción detallada / Cuerpo de la noticia *</label>
              <textarea class="form-control-dash" rows="6" v-model="newsForm.content" placeholder="Escribe el cuerpo completo de la noticia (puedes estructurarla con saltos de línea)..."></textarea>
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
            <div class="form-group-full">
              <label class="label-md">Imágenes adicionales para la galería de la noticia</label>
              <div class="news-gallery-field">
                <div class="news-gallery-grid" v-if="newsForm.additionalImages && newsForm.additionalImages.length > 0">
                  <div v-for="(img, idx) in newsForm.additionalImages" :key="idx" class="gallery-thumb-wrapper">
                    <img :src="img.url" class="gallery-thumb" :alt="img.name">
                    <button type="button" class="remove-gallery-img" @click="removeAdditionalImage(idx)" title="Eliminar imagen">
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                </div>
                <div class="gallery-upload-controls">
                  <div class="gallery-url-row">
                    <input type="url" class="form-control-dash" v-model="newGalleryUrl" placeholder="Pega el enlace de una imagen adicional..." @keydown.enter.prevent="addGalleryUrl">
                    <button type="button" class="secondary-button" @click="addGalleryUrl">Añadir URL</button>
                  </div>
                  <label class="file-upload-button-gallery">
                    <span class="material-symbols-outlined">upload</span>
                    Seleccionar imágenes locales adicionales (múltiples)
                    <input type="file" accept="image/*" multiple @change="handleAdditionalImagesUpload">
                  </label>
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

.chip-yellow {
  background: rgba(196, 138, 24, 0.12);
  color: #9a680d;
}

/* Gallery Styles */
.news-gallery-field {
  display: grid;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
}

.news-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
}

.gallery-thumb-wrapper {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius-default);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  background: var(--color-surface-container-lowest);
}

.gallery-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-gallery-img {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.remove-gallery-img:hover {
  background: rgba(220, 53, 69, 0.9);
}

.remove-gallery-img span {
  font-size: 14px;
}

.gallery-upload-controls {
  display: grid;
  gap: 10px;
}

.gallery-url-row {
  display: flex;
  gap: 10px;
}

.gallery-url-row input {
  flex: 1;
}

.file-upload-button-gallery {
  display: flex;
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
  text-align: center;
}

.file-upload-button-gallery:hover {
  background: rgba(0, 52, 41, 0.05);
}

.file-upload-button-gallery input {
  display: none;
}

.news-error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 14px 16px;
  border: 1px solid rgba(181, 36, 36, 0.35);
  border-radius: var(--radius-default);
  background: rgba(181, 36, 36, 0.08);
  color: var(--color-secondary);
}

.news-error-banner p {
  flex: 1;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}

.news-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 16px;
  color: var(--color-on-surface-variant);
}

.news-loading .spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 720px) {
  .news-image-field {
    grid-template-columns: 1fr;
  }
}
</style>
