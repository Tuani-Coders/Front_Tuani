<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found-view view">
    <div class="container content">
      <span class="material-symbols-outlined error-icon">error_outline</span>
      <h1 class="headline-xl">404</h1>
      <h2 class="mb-md">Página no encontrada</h2>
      <p class="body-lg text-muted mb-lg">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <RouterLink to="/" class="btn btn-primary btn-lg">Volver al inicio</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-xl) 0;
}

.content {
  max-width: 500px;
}

.error-icon {
  font-size: 80px;
  color: var(--color-error);
  margin-bottom: var(--space-md);
}

.mb-md { margin-bottom: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.text-muted { color: var(--color-on-surface-variant); }
</style>
