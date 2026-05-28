<script setup>
import { onMounted } from 'vue'
import { useUserManagement } from '../../../composables/useUserManagement'

const emit = defineEmits(['toast'])

const {
  usersList,
  dbRoles,
  usersLoading,
  usersError,
  userSearchQuery,
  filteredUsers,
  userForm,
  modalMode,
  isModalOpen,
  getSystemRoleName,
  getGlobalRoleName,
  fetchUsers,
  fetchRoles,
  openCreateModal,
  openEditModal,
  submitUserForm,
  deleteUser
} = useUserManagement({
  onToast: (toastObj) => emit('toast', toastObj)
})

onMounted(() => {
  fetchUsers()
  fetchRoles()
})

defineExpose({
  openCreateModal,
  fetchUsers
})
</script>

<template>
  <div class="fade-in">
    <div class="table-controls">
      <div class="search-box">
        <span class="material-symbols-outlined">search</span>
        <input type="text" v-model="userSearchQuery" placeholder="Buscar por usuario, nombre, email o rol...">
      </div>
      <button class="primary-button-accent" @click="openCreateModal">
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
            <td class="actions-cell">
              <button 
                class="action-btn edit" 
                title="Editar usuario" 
                @click="openEditModal(user)"
              >
                <span class="material-symbols-outlined">edit</span>
              </button>
              <button 
                class="action-btn delete" 
                title="Eliminar usuario" 
                @click="deleteUser(user.id)"
                :disabled="usersLoading"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="7" class="empty-state-row">
              <span class="material-symbols-outlined">group_off</span>
              No se encontraron usuarios que coincidan con la búsqueda.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para Usuarios -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-card fade-up">
        <div class="modal-header">
          <h2>{{ modalMode === 'create' ? 'Crear' : 'Editar' }} Usuario</h2>
          <button class="modal-close-btn" @click="isModalOpen = false">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-grid">
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
          <button class="primary-button-accent" @click="submitUserForm" :disabled="usersLoading">
            <template v-if="usersLoading">
              <div class="loading-spinner-sm"></div>
              <span>Procesando...</span>
            </template>
            <template v-else>
              {{ modalMode === 'create' ? 'Crear registro' : 'Guardar cambios' }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
}

.user-cell-content strong {
  display: block;
  color: var(--color-on-surface);
  font-size: 14px;
}

.cell-excerpt {
  display: block;
  margin-top: 3px;
  color: var(--color-on-surface-variant);
  font-size: 12px;
}

.text-muted {
  color: var(--color-outline);
  font-style: italic;
}
</style>
