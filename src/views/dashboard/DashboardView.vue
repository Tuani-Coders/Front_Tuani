<script setup>
import { ref, onMounted } from 'vue'
import { useContent } from '@/composables/useContent'
import DashboardShell from '@/components/dashboard/DashboardShell.vue'
import SummaryTab from '@/components/dashboard/tabs/SummaryTab.vue'
import NewsTab from '@/components/dashboard/tabs/NewsTab.vue'
import CoursesTab from '@/components/dashboard/tabs/CoursesTab.vue'
import CollabTab from '@/components/dashboard/tabs/CollabTab.vue'
import MessagesTab from '@/components/dashboard/tabs/MessagesTab.vue'
import ProfileTab from '@/components/dashboard/tabs/ProfileTab.vue'
import UsersTab from '@/components/dashboard/tabs/UsersTab.vue'
import SettingsTab from '@/components/dashboard/tabs/SettingsTab.vue'

const { fetchAdminNews, fetchAdminCourses } = useContent()

onMounted(() => {
  fetchAdminNews()
  fetchAdminCourses()
})

// --- Active Tab State ---
const activeTab = ref('Resumen')

// --- Toast System ---
const toast = ref({ show: false, message: '', type: 'success' })
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const handleToast = (payload) => {
  showToast(payload.message, payload.type)
}

// --- Component Refs for Global Actions ---
const newsTabRef = ref(null)
const coursesTabRef = ref(null)
const collabTabRef = ref(null)
const usersTabRef = ref(null)
const profileTabRef = ref(null)
const settingsTabRef = ref(null)

const handleActionClick = (tab) => {
  if (tab === 'Resumen') {
    activeTab.value = 'Noticias'
    setTimeout(() => {
      newsTabRef.value?.openCreateModal()
    }, 50)
  } else if (tab === 'Noticias') {
    newsTabRef.value?.openCreateModal()
  } else if (tab === 'Formación') {
    coursesTabRef.value?.openCreateModal()
  } else if (tab === 'Colabora') {
    collabTabRef.value?.openCreateModal()
  } else if (tab === 'Usuarios') {
    usersTabRef.value?.openCreateModal()
  } else if (tab === 'Perfil') {
    profileTabRef.value?.saveProfile()
  } else if (tab === 'Ajustes') {
    settingsTabRef.value?.saveSettings()
  }
}
</script>

<template>
  <DashboardShell 
    :activeTab="activeTab" 
    @update:activeTab="activeTab = $event" 
    @action-click="handleActionClick"
  >
    <!-- 1. RESUMEN -->
    <SummaryTab 
      v-if="activeTab === 'Resumen'" 
      @change-tab="activeTab = $event"
      @toast="handleToast"
    />

    <!-- 2. NOTICIAS -->
    <NewsTab 
      v-else-if="activeTab === 'Noticias'" 
      ref="newsTabRef"
      @toast="handleToast"
    />

    <!-- 3. FORMACIÓN (CURSOS) -->
    <CoursesTab 
      v-else-if="activeTab === 'Formación'" 
      ref="coursesTabRef"
      @toast="handleToast"
    />

    <!-- 4. COLABORA -->
    <CollabTab 
      v-else-if="activeTab === 'Colabora'" 
      ref="collabTabRef"
      @toast="handleToast"
    />

    <!-- 5. MENSAJES -->
    <MessagesTab 
      v-else-if="activeTab === 'Mensajes'" 
      @toast="handleToast"
    />

    <!-- 6. PERFIL -->
    <ProfileTab 
      v-else-if="activeTab === 'Perfil'" 
      ref="profileTabRef"
      @toast="handleToast"
    />

    <!-- 7. USUARIOS -->
    <UsersTab 
      v-else-if="activeTab === 'Usuarios'" 
      ref="usersTabRef"
      @toast="handleToast"
    />

    <!-- 8. AJUSTES -->
    <SettingsTab 
      v-else-if="activeTab === 'Ajustes'" 
      ref="settingsTabRef"
      @toast="handleToast"
    />

    <!-- SISTEMA DE NOTIFICACIONES (TOAST) -->
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
/* Transiciones del Toast */
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
</style>
