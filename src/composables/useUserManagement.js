import { ref, reactive, computed } from 'vue'
import { usersApi, rolesApi } from '@/api/users.js'

export function useUserManagement(options = {}) {
  const { onToast } = options

  const usersList = ref([])
  const dbRoles = ref([])
  const usersLoading = ref(false)
  const usersError = ref(null)
  const userSearchQuery = ref('')
  const isModalOpen = ref(false)
  const modalMode = ref('create')

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
    is_verified: true
  })

  const getSystemRoleName = (userItem) => {
    return dbRoles.value.find(role => role.id === userItem.roleId)?.name || ''
  }

  const getGlobalRoleName = (userItem) => {
    return getSystemRoleName(userItem) === 'admin' ? 'admin' : 'user'
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

  const fetchUsers = async () => {
    usersLoading.value = true
    usersError.value = null
    try {
      const data = await usersApi.list()
      usersList.value = data.data || []
    } catch (err) {
      usersError.value = err.message
      if (onToast) onToast({ message: err.message, type: 'error' })
    } finally {
      usersLoading.value = false
    }
  }

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.list()
      dbRoles.value = data.data || []
    } catch (err) {
      console.error('Error fetching roles:', err)
    }
  }

  const openCreateModal = () => {
    modalMode.value = 'create'
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
    userForm.is_verified = true
    isModalOpen.value = true
  }

  const openEditModal = (userItem) => {
    modalMode.value = 'edit'
    userForm.id = userItem.id
    userForm.username = userItem.username
    userForm.email = userItem.email
    userForm.password = ''
    userForm.confirmPassword = ''
    userForm.name = userItem.profile?.name || ''
    userForm.lastNames = userItem.profile?.lastNames || ''
    userForm.telefono = userItem.profile?.telefono || ''
    userForm.role = getGlobalRoleName(userItem)
    userForm.rolId = userItem.roleId || userItem.profile?.rolId || ''
    userForm.is_verified = userItem.is_verified || false
    isModalOpen.value = true
  }

  const submitUserForm = async () => {
    if (!userForm.username || !userForm.email || !userForm.name || !userForm.lastNames || !userForm.rolId) {
      if (onToast) onToast({ message: 'Por favor, rellena todos los campos obligatorios (*)', type: 'error' })
      return
    }

    if (modalMode.value === 'create' && !userForm.password) {
      if (onToast) onToast({ message: 'La contraseña es obligatoria para nuevos usuarios', type: 'error' })
      return
    }

    if (userForm.password && userForm.password.length < 6) {
      if (onToast) onToast({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' })
      return
    }

    if (userForm.password !== userForm.confirmPassword) {
      if (onToast) onToast({ message: 'Las contraseñas no coinciden', type: 'error' })
      return
    }

    usersLoading.value = true
    try {
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

      if (modalMode.value === 'create') {
        await usersApi.create(bodyObj)
      } else {
        await usersApi.update(userForm.id, bodyObj)
      }

      if (onToast) {
        onToast({
          message: modalMode.value === 'create' ? 'Usuario creado correctamente' : 'Usuario actualizado correctamente',
          type: 'success'
        })
      }
      isModalOpen.value = false
      await fetchUsers()
    } catch (err) {
      if (onToast) onToast({ message: err.message, type: 'error' })
    } finally {
      usersLoading.value = false
    }
  }

  const deleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
    usersLoading.value = true
    try {
      await usersApi.remove(userId)
      if (onToast) onToast({ message: 'Usuario eliminado correctamente', type: 'success' })
      await fetchUsers()
    } catch (err) {
      if (onToast) onToast({ message: err.message, type: 'error' })
    } finally {
      usersLoading.value = false
    }
  }

  return {
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
  }
}
