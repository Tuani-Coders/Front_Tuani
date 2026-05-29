<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'Resumen'
  }
})

const emit = defineEmits(['update:activeTab', 'change-tab', 'action-click'])

const { user, logout } = useAuth()
const router = useRouter()

const navItems = [
  { label: 'Resumen', icon: 'dashboard' },
  { label: 'Noticias', icon: 'article' },
  { label: 'Formación', icon: 'school' },
  { label: 'Colabora', icon: 'volunteer_activism' },
  { label: 'Mensajes', icon: 'mail' },
  { label: 'Usuarios', icon: 'group' },
  { label: 'Ajustes', icon: 'settings' }
]

const handleLogout = () => {
  logout()
  router.push('/login')
}

const userInitials = computed(() => {
  const profile = user.value?.profile || {}
  const source = `${profile.name || ''} ${profile.lastNames || ''}`.trim() || user.value?.username || 'Administrador'
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
})

const avatarStyle = computed(() => ({
  background: user.value?.profileSettings?.avatarColor || 'var(--color-secondary)'
}))
</script>

<template>
  <div class="dashboard-shell">
    <aside class="dashboard-sidebar" aria-label="Navegación del dashboard">
      <RouterLink to="/" class="dashboard-brand">
        <span class="brand-mark">
          <img src="../../assets/icons/penascal.png" alt="Grupo Peñascal" class="brand-logo">
        </span>
        <span>
          <strong>Peñascal</strong>
          <small>Administración web</small>
        </span>
      </RouterLink>

      <div class="sidebar-status">
        <span class="status-dot"></span>
        Sitio publicado
      </div>

      <nav class="dashboard-nav">
        <button
          v-for="item in navItems"
          :key="item.label"
          class="dashboard-nav-item"
          :class="{ active: activeTab === item.label }"
          type="button"
          @click="emit('update:activeTab', item.label); emit('change-tab', item.label)"
        >
          <span class="material-symbols-outlined">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="admin-chip" type="button" @click="emit('update:activeTab', 'Perfil'); emit('change-tab', 'Perfil')">
          <span class="admin-avatar" :style="avatarStyle">
            <img v-if="user?.profileSettings?.avatarImage" :src="user.profileSettings.avatarImage" alt="">
            <span v-else>{{ user?.profileSettings?.avatarPreset || userInitials }}</span>
          </span>
          <div>
            <strong>{{ user?.username || 'Administrador' }}</strong>
            <span>Editar perfil</span>
          </div>
        </button>
        <button class="logout-action" type="button" @click="handleLogout">
          <span class="material-symbols-outlined">logout</span>
          Salir
        </button>
      </div>
    </aside>

    <section class="dashboard-panel">
      <header class="dashboard-topbar">
        <div>
          <p class="eyebrow">
            {{ activeTab === 'Resumen' ? 'Grupo Peñascal Kooperatiba' : 'Administración / ' + activeTab }}
          </p>
          <h1>
            {{
              activeTab === 'Resumen' ? 'Panel de control' :
              activeTab === 'Noticias' ? 'Gestión de Noticias' :
              activeTab === 'Formación' ? 'Oferta Formativa' :
              activeTab === 'Colabora' ? 'Colaboraciones' :
              activeTab === 'Mensajes' ? 'Buzón de Mensajes' :
              activeTab === 'Usuarios' ? 'Gestión de Usuarios' :
              activeTab === 'Perfil' ? 'Mi Perfil' :
              'Configuración General'
            }}
          </h1>
        </div>

        <div class="topbar-actions">
          <label class="search-control">
            <span class="material-symbols-outlined">search</span>
            <input type="search" placeholder="Buscar contenido">
          </label>
          <button class="icon-button notification-button" type="button" aria-label="Notificaciones">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <RouterLink to="/" class="icon-button" aria-label="Ver página pública">
            <span class="material-symbols-outlined">open_in_new</span>
          </RouterLink>
          <button
            v-if="activeTab !== 'Mensajes'"
            class="primary-action"
            type="button"
            @click="emit('action-click', activeTab)"
          >
            <span class="material-symbols-outlined">
              {{
                activeTab === 'Ajustes' ? 'save' :
                activeTab === 'Resumen' ? 'add' : 'add_circle'
              }}
            </span>
            {{
              activeTab === 'Resumen' || activeTab === 'Noticias' ? 'Nueva noticia' :
              activeTab === 'Formación' ? 'Nuevo curso' :
              activeTab === 'Colabora' ? 'Nueva entidad' :
              activeTab === 'Usuarios' ? 'Nuevo usuario' :
              activeTab === 'Perfil' ? 'Guardar perfil' :
              'Guardar'
            }}
          </button>
        </div>
      </header>

      <main class="dashboard-main">
        <slot />
      </main>
    </section>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 292px minmax(0, 1fr);
  background:
    radial-gradient(circle at 24% -10%, rgba(181, 36, 36, 0.12), transparent 28%),
    linear-gradient(135deg, rgba(0, 52, 41, 0.08), transparent 38%),
    var(--color-surface);
}

.dashboard-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 22px 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 32%),
    var(--color-primary);
  color: var(--color-on-primary);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.dashboard-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  letter-spacing: 0;
}

.dashboard-brand strong,
.dashboard-brand small {
  display: block;
}

.dashboard-brand strong {
  color: var(--color-on-primary);
  font-size: 17px;
  line-height: 21px;
}

.dashboard-brand small {
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 700;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-default);
  background: rgba(255, 255, 255, 0.1);
}

.brand-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.sidebar-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 7px 10px;
  border-radius: var(--radius-default);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.76);
  font-size: 12px;
  font-weight: 800;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #79d29c;
  box-shadow: 0 0 0 4px rgba(121, 210, 156, 0.14);
}

.dashboard-nav {
  display: grid;
  gap: 7px;
  margin-top: 8px;
}

.dashboard-nav-item,
.logout-action {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 46px;
  padding: 10px 13px;
  border-radius: var(--radius-default);
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  font-weight: 800;
  text-align: left;
  transition: background var(--transition-base), color var(--transition-base), transform var(--transition-base);
}

.dashboard-nav-item:hover,
.dashboard-nav-item.active,
.logout-action:hover {
  background: rgba(255, 255, 255, 0.13);
  color: #ffffff;
}

.dashboard-nav-item.active {
  background: #ffffff;
  color: var(--color-primary);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
}

.dashboard-nav-item .material-symbols-outlined,
.logout-action .material-symbols-outlined {
  font-size: 21px;
}

.sidebar-footer {
  margin-top: auto;
  display: grid;
  gap: 12px;
}

.admin-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-default);
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-on-primary);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-base);
}

.admin-chip:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.admin-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-default);
  background: var(--color-secondary);
  color: var(--color-on-secondary);
  font-size: 15px;
  font-weight: 900;
  overflow: hidden;
}

.admin-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-chip strong,
.admin-chip span {
  display: block;
}

.admin-chip strong {
  font-size: 13px;
}

.admin-chip span {
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
}

.dashboard-panel {
  min-width: 0;
}

.dashboard-topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 96px;
  padding: 20px 34px;
  border-bottom: 1px solid var(--color-outline-variant);
  background: rgba(248, 250, 247, 0.9);
  backdrop-filter: blur(18px);
}

.eyebrow {
  margin-bottom: 2px;
  color: var(--color-secondary);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.dashboard-topbar h1 {
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-control {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(32vw, 340px);
  min-height: 44px;
  padding: 0 13px;
  border: 1px solid rgba(0, 52, 41, 0.14);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-on-surface-variant);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.search-control:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 52, 41, 0.15);
}

.search-control span {
  font-size: 21px;
}

.search-control input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-on-surface);
  font-size: 14px;
  font-weight: 700;
}

.search-control input::placeholder {
  color: var(--color-outline);
}

.icon-button,
.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-lowest);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.icon-button {
  width: 44px;
  height: 44px;
}

.icon-button:hover {
  border-color: var(--color-primary);
  color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.notification-button {
  position: relative;
}

.notification-button::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 11px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-secondary);
}

.primary-action {
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  background: var(--color-secondary);
  color: var(--color-on-secondary);
  border: 1px solid var(--color-secondary);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.primary-action:hover {
  background: var(--color-on-secondary-container);
  border-color: var(--color-on-secondary-container);
  color: var(--color-secondary-container);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.dashboard-main {
  padding: 30px 34px 42px;
}

@media (max-width: 980px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    position: static;
    height: auto;
    padding: 14px 16px;
    gap: 14px;
  }

  .dashboard-brand,
  .sidebar-footer,
  .sidebar-status {
    display: none;
  }

  .dashboard-nav {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 2px;
  }

  .dashboard-nav-item {
    width: auto;
    min-width: max-content;
  }

  .dashboard-topbar {
    min-height: auto;
    align-items: flex-start;
    padding: 18px 16px;
  }

  .topbar-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .search-control {
    width: min(48vw, 300px);
  }

  .dashboard-main {
    padding: 18px 16px 32px;
  }
}

@media (max-width: 640px) {
  .dashboard-topbar {
    display: grid;
  }

  .topbar-actions {
    justify-content: flex-start;
  }

  .dashboard-topbar h1 {
    font-size: 26px;
    line-height: 32px;
  }

  .search-control {
    width: 100%;
  }

  .primary-action {
    flex: 1;
  }
}
</style>
