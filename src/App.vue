<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
const { t, locale } = useI18n()
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')

watchEffect(() => {
  document.title = route.meta.titleKey
    ? t(route.meta.titleKey)
    : 'Grupo Peñascal Kooperatiba'
  document.documentElement.lang = locale.value
})
</script>

<template>
  <div id="app-wrapper" :class="{ 'dashboard-wrapper': isDashboardLayout }">
    <AppHeader v-if="!isDashboardLayout" />
    <main id="content" :class="{ 'dashboard-content': isDashboardLayout }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter v-if="!isDashboardLayout" />
  </div>
</template>

<style scoped>
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-image: linear-gradient(rgba(232, 242, 235, 0.93), rgba(232, 242, 235, 0.93)), url('@/assets/icons/fondo.PNG');
  background-size: 360px;
  background-attachment: fixed;
  background-repeat: repeat;
}

#content {
  flex: 1;
  /* offset for fixed header: topbar (30px) + nav (72px) */
  margin-top: 102px;
}

.dashboard-wrapper {
  background: var(--color-surface) !important;
  background-image: none !important;
}

#content.dashboard-content {
  margin-top: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
