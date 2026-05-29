<script setup>
import { useContent } from '@/composables/useContent'

const emit = defineEmits(['toast'])

const { settings } = useContent()

const saveSettings = () => {
  emit('toast', { message: 'Configuración general guardada con éxito', type: 'success' })
}
</script>

<template>
  <div class="fade-in settings-tab-layout">
    <div class="settings-grid">
      <div class="settings-card">
        <h3>Ajustes Generales del Sitio</h3>
        <div class="form-grid">
          <div class="form-group-full">
            <label class="label-md">Nombre del Sitio / Portal *</label>
            <input type="text" class="form-control-dash" v-model="settings.siteName">
          </div>
          <div class="form-group-full">
            <label class="label-md">Descripción o Eslogan del pie de página</label>
            <textarea class="form-control-dash" rows="3" v-model="settings.description"></textarea>
          </div>
          <div class="form-group-full">
            <label class="checkbox-label-dash">
              <input type="checkbox" v-model="settings.isActive">
              <div>
                <strong>Portal Activo</strong>
                <p>Si se desmarca, el portal público dejará de mostrar información.</p>
              </div>
            </label>
          </div>
          <div class="form-group-full">
            <label class="checkbox-label-dash">
              <input type="checkbox" v-model="settings.isMaintenance">
              <div>
                <strong>Modo Mantenimiento</strong>
                <p>Solo los administradores podrán acceder a las vistas del sitio.</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <h3>Información de Contacto Pública</h3>
        <div class="form-grid">
          <div class="form-group-half">
            <label class="label-md">Email de contacto</label>
            <input type="email" class="form-control-dash" v-model="settings.siteEmail">
          </div>
          <div class="form-group-half">
            <label class="label-md">Teléfono público</label>
            <input type="text" class="form-control-dash" v-model="settings.sitePhone">
          </div>
          <div class="form-group-full">
            <label class="label-md">Dirección Física de la Sede</label>
            <input type="text" class="form-control-dash" v-model="settings.siteAddress">
          </div>
        </div>
      </div>

      <div class="settings-actions-panel">
        <button class="primary-button-accent btn-large" @click="saveSettings">
          <span class="material-symbols-outlined">save</span>
          Guardar Configuración General
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-grid {
  display: grid;
  gap: 24px;
}

.settings-card {
  padding: 24px;
  background: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.settings-card h3 {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-surface-container-low);
}

.settings-actions-panel {
  display: flex;
  justify-content: flex-end;
}

.btn-large {
  padding: 0 24px;
  font-size: 14px;
}
</style>
