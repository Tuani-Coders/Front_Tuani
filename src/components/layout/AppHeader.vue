<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth'
import { setLocale, SUPPORTED_LOCALES } from '../../i18n'

const { user, isLoggedIn, logout } = useAuth()
const { t, locale } = useI18n()
const mobileMenuOpen = ref(false)
const scrolled = ref(false)
const activeDropdown = ref(null)
const headerRef = ref(null)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMenu = () => {
  mobileMenuOpen.value = false
  activeDropdown.value = null
}

const toggleDropdown = (key) => {
  activeDropdown.value = activeDropdown.value === key ? null : key
}

const windowWidth = ref(window.innerWidth)
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

const handleClickOutside = (event) => {
  if (mobileMenuOpen.value && headerRef.value && !headerRef.value.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('click', handleClickOutside)
})

const languages = SUPPORTED_LOCALES

const changeLocale = (nextLocale) => {
  setLocale(nextLocale)
}

const navItems = computed(() => [
  { key: 'home', label: t('nav.home'), to: '/' },
  {
    key: 'training',
    label: t('nav.training'),
    to: '/formacion-profesional',
    children: [
      { key: 'professionalTraining', label: t('nav.professionalTraining'), to: '/formacion-profesional' },
      { key: 'basicGrade', label: t('nav.basicGrade'), to: '/formacion-profesional/grado-basico' },
      { key: 'mediumGrade', label: t('nav.mediumGrade'), to: '/formacion-profesional/grado-medio' },
      { key: 'employmentTraining', label: t('nav.employmentTraining'), to: '/formacion-profesional/formacion-para-el-empleo' }
    ]
  },
  {
    key: 'cooperative',
    label: t('nav.cooperative'),
    to: '/la-cooperativa',
    children: [
      { key: 'whoWeAre', label: t('nav.whoWeAre'), to: '/la-cooperativa' },
      { key: 'whatWeDo', label: t('nav.whatWeDo'), to: '/la-cooperativa/que-hacemos' },
      { key: 'partners', label: t('nav.partners'), to: '/la-cooperativa/cooperan-con-nosotros' },
      { key: 'orientation', label: t('nav.orientation'), to: '/la-cooperativa/servicio-de-orientacion' }
    ]
  },
  {
    key: 'collaborate',
    label: t('nav.collaborate'),
    to: '/colabora',
    children: [
      { key: 'supportProjects', label: t('nav.supportProjects'), to: '/colabora/apoyando-proyectos' },
      { key: 'donateProducts', label: t('nav.donateProducts'), to: '/colabora/donando-productos' },
      { key: 'hireCompanies', label: t('nav.hireCompanies'), to: '/colabora/contratando-empresas' },
      { key: 'supportInsertion', label: t('nav.supportInsertion'), to: '/colabora/apoyando-insercion' }
    ]
  },
  { key: 'news', label: t('nav.news'), to: '/noticias' },
  { key: 'contact', label: t('nav.contact'), to: '/contacto' }
])

const handleNavClick = (item, event) => {
  if (window.innerWidth <= 1100 && item.children) {
    event.preventDefault()
    toggleDropdown(item.key)
  } else {
    closeMenu()
  }
}
</script>

<template>
  <header class="app-header" :class="{ 'header--scrolled': scrolled }">
    <!-- Top bar -->
    <div class="header-topbar">
      <div class="container topbar-inner">
        <div class="topbar-contact">
          <a href="tel:+34944029300" class="topbar-link">
            <span class="material-symbols-outlined">phone</span>
            {{ t('common.phone') }}
          </a>
          <a href="mailto:info@grupopenascal.com" class="topbar-link">
            <span class="material-symbols-outlined">mail</span>
            {{ t('common.email') }}
          </a>
          <RouterLink to="/contacto" class="topbar-link topbar-location">
            <span class="material-symbols-outlined">location_on</span>
            <span>{{ t('common.location') }}</span>
          </RouterLink>
        </div>
        <div class="topbar-right">
          <div class="topbar-auth">
            <template v-if="isLoggedIn">
              <span class="user-greeting">
                {{ t('auth.hello') }} <strong>{{ user?.username }}</strong>
              </span>
              <RouterLink to="/dashboard" class="topbar-link dashboard-link">
                <span class="material-symbols-outlined">dashboard</span>
                {{ t('auth.dashboard') }}
              </RouterLink>
              <button @click="logout" class="topbar-link logout-btn">
                <span class="material-symbols-outlined">logout</span>
                {{ t('auth.logout') }}
              </button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="topbar-link login-btn">
                <span class="material-symbols-outlined">account_circle</span>
                {{ t('auth.login') }}
              </RouterLink>
            </template>
          </div>
          <div class="topbar-social">
            <div class="lang-switcher">
              <button
                v-for="lang in languages"
                :key="lang"
                class="lang-btn"
                :class="{ active: locale === lang }"
                type="button"
                :aria-label="`${t('languages.label')}: ${t(`languages.${lang}`)}`"
                :aria-pressed="locale === lang"
                @click="changeLocale(lang)"
              >
                {{ t(`languages.${lang}`) }}
              </button>
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
    <nav ref="headerRef" class="header-nav" :class="{ 'nav--scrolled': scrolled }">
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
            :key="item.key"
            :class="{ 'has-dropdown': item.children }"
            @mouseenter="item.children && windowWidth <= 1100 ? (activeDropdown = item.key) : null"
            @mouseleave="item.children && windowWidth <= 1100 ? (activeDropdown = null) : null"
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
                @click="handleNavClick(item, $event)"
              >
                {{ item.label }}
                <span class="material-symbols-outlined dropdown-arrow" :class="{ rotated: activeDropdown === item.key }">expand_more</span>
              </RouterLink>
              <ul class="dropdown" :class="{ 'dropdown--open': activeDropdown === item.key }">
                <li v-for="child in item.children" :key="child.key">
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

.dashboard-link {
  color: var(--color-primary) !important;
  font-weight: 800;
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
  color: var(--color-on-primary);
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
  color: var(--color-on-primary);
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
  background-color: rgba(var(--color-primary-rgb), 0.18);
  color: var(--color-on-primary);
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

@media (min-width: 1101px) {
  .has-dropdown:hover .dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .has-dropdown:hover .dropdown-arrow {
    transform: rotate(180deg);
  }
}

.dropdown {
  position: absolute;
  top: calc(100% + 0px);
  left: 0;
  min-width: 260px;
  background: var(--color-surface-container-lowest);
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
  z-index: 1001;
}

.mobile-toggle span {
  display: block;
  width: 26px;
  height: 3px;
  background: var(--color-on-primary);
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
@media (max-width: 1100px) {
  .header-topbar {
    display: none;
  }

  .mobile-toggle {
    display: flex;
    order: 1; /* Keep toggle on the left if preferred, or use absolute */
  }

  .nav-inner {
    justify-content: center;
    position: relative;
  }

  .header-logo {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo-img {
    height: 60px; /* Slightly larger as requested */
  }

  .mobile-toggle {
    position: absolute;
    right: 16px; /* Put hamburger on the right */
  }

  .nav-list {
    position: fixed;
    top: 80px; /* Fixed height of our header nav */
    left: 16px;
    right: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    background: var(--color-surface-container-lowest);
    padding: var(--space-md) 0;
    transform: translateY(-20px);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    overflow-y: auto;
    z-index: 1000;
    border-radius: var(--radius-lg);
    box-shadow: 0 20px 48px rgba(0, 52, 41, 0.3);
    max-height: 80vh;
  }

  .nav-list.open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-list .nav-link {
    color: var(--color-primary);
    padding: 16px 24px;
    border-bottom: 1px solid var(--color-surface-container);
    border-radius: 0;
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .nav-list .nav-link:hover,
  .nav-list .nav-link.router-link-active {
    background-color: var(--color-surface-container-low);
    color: var(--color-primary);
  }

  .nav-list .dropdown {
    position: static;
    box-shadow: none;
    border: none;
    padding: 0;
    opacity: 1;
    visibility: visible;
    transform: none;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    background: var(--color-surface-container-low);
    width: 100%;
    display: block; /* Ensure it's not hidden by display: none if any */
  }

  .nav-list .dropdown--open {
    max-height: 1000px; /* Large enough for all sub-items */
    padding: 12px 0;
    margin-bottom: 8px;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .dropdown-link {
    padding: 12px 24px;
    text-align: center;
    border-bottom: 1px solid var(--color-outline-variant);
    color: var(--color-on-surface);
  }

  .dropdown-link:last-child {
    border-bottom: none;
  }
}

@media (max-width: 480px) {
  .topbar-contact a:last-child {
    display: none;
  }
}
</style>
