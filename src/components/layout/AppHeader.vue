<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const { user, isLoggedIn, logout } = useAuth()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const activeDropdown = ref(null)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMenu = () => {
  mobileMenuOpen.value = false
  activeDropdown.value = null
}

const toggleDropdown = (label) => {
  activeDropdown.value = activeDropdown.value === label ? null : label
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navItems = [
  { label: 'Inicio', to: '/' },
  {
    label: 'Formación',
    to: '/formacion-profesional',
    children: [
      { label: 'Formación Profesional', to: '/formacion-profesional' },
      { label: 'Grado Básico', to: '/formacion-profesional/grado-basico' },
      { label: 'Grado medio', to: '/formacion-profesional/grado-medio' },
      { label: 'Formación para el Empleo', to: '/formacion-profesional/formacion-para-el-empleo' }
    ]
  },
  {
    label: 'La Cooperativa',
    to: '/la-cooperativa',
    children: [
      { label: 'Quiénes somos', to: '/la-cooperativa' },
      { label: 'Qué hacemos', to: '/la-cooperativa/que-hacemos' },
      { label: 'Cooperan con nosotros', to: '/la-cooperativa/cooperan-con-nosotros' },
      { label: 'Servicio de orientación', to: '/la-cooperativa/servicio-de-orientacion' }
    ]
  },
  {
    label: 'Colabora',
    to: '/colabora',
    children: [
      { label: 'Colabora apoyando proyectos sin recursos', to: '/colabora/apoyando-proyectos' },
      { label: 'Colabora donando productos y servicios', to: '/colabora/donando-productos' },
      { label: 'Colabora contratando empresas de inserción', to: '/colabora/contratando-empresas' },
      { label: 'Colabora apoyando la inserción laboral', to: '/colabora/apoyando-insercion' }
    ]
  },
  { label: 'Noticias', to: '/noticias' },
  { label: 'Contacto', to: '/contacto' }
]
</script>

<template>
  <header class="app-header" :class="{ 'header--scrolled': scrolled }">
    <!-- Top bar -->
    <div class="header-topbar">
      <div class="container topbar-inner">
        <div class="topbar-contact">
          <a href="tel:+34944029300" class="topbar-link">
            <span class="material-symbols-outlined">phone</span>
            +34 944 029 300
          </a>
          <a href="mailto:info@grupopenascal.com" class="topbar-link">
            <span class="material-symbols-outlined">mail</span>
            info@grupopenascal.com
          </a>
          <RouterLink to="/contacto" class="topbar-link topbar-location">
            <span class="material-symbols-outlined">location_on</span>
            <span>Ubicación</span>
          </RouterLink>
        </div>
        <div class="topbar-right">
          <div class="topbar-auth">
            <template v-if="isLoggedIn">
              <span class="user-greeting">Hola, <strong>{{ user?.username }}</strong></span>
              <button @click="logout" class="topbar-link logout-btn">
                <span class="material-symbols-outlined">logout</span>
                Salir
              </button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="topbar-link login-btn">
                <span class="material-symbols-outlined">account_circle</span>
                Entrar
              </RouterLink>
            </template>
          </div>
          <div class="topbar-social">
            <div class="lang-switcher">
              <button class="lang-btn active">ES</button>
              <button class="lang-btn">EU</button>
            </div>
            <a href="https://www.facebook.com/PenascalKoop/" target="_blank" rel="noopener" aria-label="Facebook" class="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://twitter.com/Penascalkoop" target="_blank" rel="noopener" aria-label="Twitter" class="social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Nav principal -->
    <nav class="header-nav" :class="{ 'nav--scrolled': scrolled }">
      <div class="container nav-inner">
        <RouterLink to="/" class="header-logo" @click="closeMenu">
          <img src="../../assets/icons/penascal.png" alt="Grupo Peñascal Logo" class="logo-img">
        </RouterLink>

        <button
          class="mobile-toggle"
          :class="{ active: mobileMenuOpen }"
          @click="toggleMenu"
          :aria-label="mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="nav-list" :class="{ open: mobileMenuOpen }">
          <li
            v-for="item in navItems"
            :key="item.label"
            :class="{ 'has-dropdown': item.children }"
            @mouseenter="item.children ? (activeDropdown = item.label) : null"
            @mouseleave="item.children ? (activeDropdown = null) : null"
          >
            <RouterLink
              v-if="!item.children"
              :to="item.to"
              class="nav-link"
              @click="closeMenu"
            >
              {{ item.label }}
            </RouterLink>

            <template v-else>
              <RouterLink
                :to="item.to"
                class="nav-link nav-parent"
                @click="closeMenu"
              >
                {{ item.label }}
                <span class="material-symbols-outlined dropdown-arrow" :class="{ rotated: activeDropdown === item.label }">expand_more</span>
              </RouterLink>
              <ul class="dropdown" :class="{ 'dropdown--open': activeDropdown === item.label }">
                <li v-for="child in item.children" :key="child.label">
                  <RouterLink :to="child.to" class="dropdown-link" @click="closeMenu">
                    {{ child.label }}
                  </RouterLink>
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-header);
}

/* ── Topbar ───────────────────────────────────── */
.header-topbar {
  background-color: var(--color-surface-container-low);
  color: var(--color-on-surface);
  font-size: var(--caption-size);
  font-weight: 600;
  padding: 8px 0;
  transition: transform var(--transition-base);
  border-bottom: 1px solid var(--color-outline-variant);
}

.header--scrolled .header-topbar {
  transform: translateY(-100%);
  position: absolute;
}

.topbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-xl);
}

.topbar-auth {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding-right: var(--space-md);
  border-right: 1px solid var(--color-outline-variant);
}

.user-greeting {
  color: var(--color-on-surface-variant);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
}

.login-btn {
  color: var(--color-primary) !important;
  font-weight: 700;
}

.topbar-contact {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.topbar-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-on-surface-variant);
  transition: color var(--transition-fast);
  text-decoration: none;
}

.topbar-link:hover {
  color: var(--color-primary);
}

.topbar-link .material-symbols-outlined {
  font-size: 14px;
}

.topbar-location {
  color: var(--color-primary);
  font-weight: 700;
  background: rgba(var(--color-primary-rgb), 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.topbar-location:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
}

.topbar-social {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.lang-switcher {
  display: flex;
  gap: 4px;
  margin-right: var(--space-sm);
}

.lang-btn {
  background: transparent;
  border: 1px solid var(--color-outline-variant);
  color: var(--color-on-surface);
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lang-btn.active, .lang-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-on-surface-variant);
  transition: color var(--transition-fast);
}

.social-icon:hover {
  color: var(--color-primary);
}

/* ── Nav ──────────────────────────────────────── */
.header-nav {
  background-color: var(--color-primary);
  transition: all var(--transition-base);
}

.nav--scrolled {
  box-shadow: var(--shadow-lg);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

/* ── Logo ─────────────────────────────────────── */
.header-logo {
  display: flex;
  align-items: center;
  height: 100%;
}

.logo-img {
  height: 52px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

/* ── Nav list ─────────────────────────────────── */
.nav-list {
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-default);
  transition: all var(--transition-fast);
  white-space: nowrap;
  text-decoration: none;
  font-family: var(--font-family);
  cursor: pointer;
  background: none;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.dropdown-arrow {
  font-size: 18px;
  transition: transform var(--transition-fast);
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* ── Dropdown ─────────────────────────────────── */
.has-dropdown {
  position: relative;
}

.dropdown {
  position: absolute;
  top: calc(100% + 0px);
  left: 0;
  min-width: 260px;
  background: white;
  border-top: 3px solid var(--color-secondary); /* Acento rojo Peñascal */
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  padding: var(--space-sm) 0;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all var(--transition-base);
  list-style: none;
  z-index: 100;
}

.dropdown--open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-link {
  display: block;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.dropdown-link:hover {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
  padding-left: 24px;
}

/* ── Mobile toggle ────────────────────────────── */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none;
  border: none;
  padding: 4px;
}

.mobile-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-on-surface);
  border-radius: 2px;
  transition: all var(--transition-base);
}

.mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 768px) {
  .header-topbar {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .nav-list {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    background: var(--color-surface-container-lowest);
    padding: var(--space-md);
    transform: translateX(100%);
    transition: transform var(--transition-base);
    overflow-y: auto;
  }

  .nav-list.open {
    transform: translateX(0);
  }

  .dropdown {
    position: static;
    box-shadow: none;
    border: none;
    padding-left: var(--space-md);
    opacity: 1;
    visibility: visible;
    transform: none;
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--transition-base);
  }

  .dropdown--open {
    max-height: 400px;
  }
}

@media (max-width: 480px) {
  .topbar-contact a:last-child {
    display: none;
  }
}
</style>
