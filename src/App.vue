<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import VoiceAccessibility from './components/VoiceAccessibility.vue'

const route = useRoute()
const isDashboardLayout = computed(() => route.meta.layout === 'dashboard')
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
    <VoiceAccessibility />
  </div>
</template>

<style scoped>
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#content {
  flex: 1;
  /* offset for fixed header: topbar (30px) + nav (72px) */
  margin-top: 102px;
}

.dashboard-wrapper {
  background: var(--color-surface);
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
