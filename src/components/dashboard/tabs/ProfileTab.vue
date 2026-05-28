<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuth } from '../../../composables/useAuth'

const emit = defineEmits(['toast'])

const { user, updateCurrentUser } = useAuth()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api'

// --- Constants ---
const avatarPresets = [
  { label: 'AP', color: '#b52424' },
  { label: 'MK', color: '#003429' },
  { label: 'IR', color: '#9a680d' },
  { label: 'LS', color: '#2e7d32' },
  { label: 'TU', color: '#475569' },
  { label: 'PE', color: '#7c2d12' }
]

// --- State ---
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

// --- Computed ---
const profileInitials = computed(() => {
  const source = `${profileForm.name} ${profileForm.lastNames}`.trim() || profileForm.username || 'Admin'
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
})

// --- Methods ---
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

// Watch user to update profile details if it loads late
watch(() => user.value, () => {
  loadProfileForm()
}, { immediate: true })

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
    emit('toast', { message: 'Selecciona una imagen válida para el perfil', type: 'error' })
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
    emit('toast', { message: 'El nombre de usuario y el email son obligatorios', type: 'error' })
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

  // Update locally first for immediate feedback
  updateCurrentUser(updates)

  // Sync with the server
  try {
    const tokenVal = localStorage.getItem('token')
    if (!tokenVal || !user.value?.id) {
      emit('toast', { message: 'Perfil actualizado localmente', type: 'success' })
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

    emit('toast', { message: 'Perfil actualizado y sincronizado correctamente', type: 'success' })
  } catch (err) {
    console.error('Error al sincronizar perfil:', err)
    emit('toast', { message: 'Perfil guardado localmente, pero no se pudo sincronizar: ' + err.message, type: 'warning' })
  }
}

// Initial load
loadProfileForm()
</script>

<template>
  <div class="fade-in">
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
</template>

<style scoped>
.fade-in {
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-editor-grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
}

.profile-preview-card {
  padding: 24px;
  background: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  align-self: start;
}

.profile-avatar-preview {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 800;
  color: #ffffff;
  overflow: hidden;
  border: 4px solid var(--color-surface-container-low);
  box-shadow: var(--shadow-sm);
}

.profile-avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-preview-card h2 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-on-surface);
  margin-bottom: 4px;
  word-break: break-all;
}

.profile-preview-card p {
  font-size: 13px;
  color: var(--color-on-surface-variant);
  margin-bottom: 16px;
}

.profile-form-card {
  padding: 24px;
  background: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.profile-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-surface-container-low);
  padding-bottom: 16px;
  margin-bottom: 20px;
}

.section-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 900;
  color: var(--color-secondary);
  margin-bottom: 3px;
}

.profile-section-header h3 {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-primary);
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

.profile-color-input {
  width: 100%;
  height: 48px;
  padding: 4px;
  background: var(--color-surface-container-low);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  cursor: pointer;
}

textarea.form-control-dash {
  resize: vertical;
}

.avatar-editor-panel {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px dashed var(--color-outline-variant);
}

.avatar-editor-panel h3 {
  font-size: 15px;
  font-weight: 800;
  color: var(--color-on-surface);
  margin-bottom: 14px;
}

.avatar-actions-row {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
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

.avatar-preset-grid {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.avatar-preset-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all var(--transition-base);
  border: 3px solid transparent;
}

.avatar-preset-button:hover {
  transform: scale(1.1);
}

.avatar-preset-button.active {
  border-color: var(--color-on-surface);
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
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
  .profile-editor-grid {
    grid-template-columns: 1fr;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group-full,
  .form-group-half {
    grid-column: span 1;
  }
}
</style>
