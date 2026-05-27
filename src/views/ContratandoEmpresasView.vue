<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '../composables/useContent'

const { collaborationsList } = useContent()

const approvedEntities = computed(() => {
  return collaborationsList.value.filter(
    c => c.type === 'Contratando Empresas' && c.status === 'Aprobada'
  )
})

const services = [
  {
    name: 'Peñascal Catering',
    desc: 'Servicios de catering para eventos corporativos y celebraciones con menús de alta calidad y fin social.',
    icon: 'restaurant'
  },
  {
    name: 'Talleres Peñascal',
    desc: 'Fabricación metálica, carpintería and mantenimiento industrial con estándares de mercado.',
    icon: 'settings'
  },
  {
    name: 'Peñascal Servicios',
    desc: 'Limpieza, mantenimiento de edificios, jardinería y reformas integrales para comunidades y empresas.',
    icon: 'cleaning_services'
  }
]
</script>

<template>
  <div class="colabora-section-view view">
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/" class="link">Inicio</RouterLink>
            <span class="separator">/</span>
            <RouterLink to="/colabora" class="link">Colabora</RouterLink>
            <span class="separator">/</span>
            <span class="current">Contratando empresas</span>
          </nav>
          <h1 class="page-title headline-xl">Contratando empresas de inserción</h1>
          <p class="page-subtitle body-lg">
            Convierte tus costes operativos en inversión social de alto impacto.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <div class="intro-text mb-xl">
          <h2>Calidad profesional con alma social</h2>
          <p class="body-lg text-muted">
            Nuestras Empresas de Inserción (EI) compiten en el mercado libre ofreciendo servicios de máxima calidad. Al contratarlas, estás cumpliendo con la LGD (Ley General de Discapacidad) y potenciando tu Responsabilidad Social Corporativa.
          </p>
        </div>

        <div class="services-list">
          <div v-for="service in services" :key="service.name" class="service-horizontal card p-lg mb-md d-flex gap-lg align-center">
            <div class="service-icon-bg">
              <span class="material-symbols-outlined">{{ service.icon }}</span>
            </div>
            <div class="service-info">
              <h3>{{ service.name }}</h3>
              <p class="body-md text-muted">{{ service.desc }}</p>
            </div>
            <div class="service-action ms-auto">
              <RouterLink to="/contacto" class="btn btn-ghost">Solicitar presupuesto</RouterLink>
            </div>
          </div>
        </div>

        <div class="benefits-grid mt-xl">
          <div class="benefit card p-lg border-primary">
            <h4>Ventajas para tu empresa</h4>
            <ul class="check-list mt-md">
              <li><span class="material-symbols-outlined">verified</span> Cumplimiento de cuotas legales (LGD).</li>
              <li><span class="material-symbols-outlined">verified</span> Mejora de la imagen de marca y reputación.</li>
              <li><span class="material-symbols-outlined">verified</span> Calidad certificada en todos los procesos.</li>
              <li><span class="material-symbols-outlined">verified</span> Precios competitivos de mercado.</li>
            </ul>
          </div>
        </div>

        <div v-if="approvedEntities.length > 0" class="collab-entities mt-xl card p-lg">
          <h3 class="mb-md text-center">Empresas colaboradoras en esta modalidad</h3>
          <div class="entities-tags">
            <span v-for="entity in approvedEntities" :key="entity.id" class="entity-tag" :class="{ 'has-logo': entity.imageUrl }">
              <img v-if="entity.imageUrl" :src="entity.imageUrl" :alt="entity.entity" class="entity-logo">
              <span v-else>{{ entity.entity }}</span>
            </span>
          </div>
        </div>

        <div class="actions mt-xl text-center">
          <RouterLink to="/la-cooperativa/cooperan-con-nosotros" class="btn btn-primary btn-lg">Conocer nuestra red de empresas</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-header { background-color: var(--color-surface-container-low); padding: var(--space-xl) 0 var(--space-lg); border-bottom: 1px solid var(--color-outline-variant); }
.page-title { color: var(--color-on-surface); margin-bottom: var(--space-md); }
.page-subtitle { color: var(--color-on-surface-variant); }
.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.mb-xl { margin-bottom: var(--space-xl); }
.mt-md { margin-top: var(--space-md); }
.mt-xl { margin-top: var(--space-xl); }
.p-lg { padding: var(--space-lg); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.gap-lg { gap: var(--space-lg); }
.ms-auto { margin-left: auto; }

.service-icon-bg { width: 80px; height: 80px; background: var(--color-secondary-fixed); color: var(--color-secondary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.service-icon-bg .material-symbols-outlined { font-size: 40px; }

.border-primary { border: 1px solid var(--color-primary); }

.check-list { list-style: none; display: flex; flex-direction: column; gap: var(--space-sm); }
.check-list li { display: flex; align-items: center; gap: var(--space-sm); }
.check-list .material-symbols-outlined { color: var(--color-primary); }

.entities-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.entity-tag {
  background: var(--color-surface-container);
  color: var(--color-on-surface);
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-weight: 600;
  border: 1px solid var(--color-outline-variant);
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.entity-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.entity-tag.has-logo {
  background: var(--color-surface-container-lowest);
  padding: 6px 12px;
}
.entity-logo {
  max-height: 24px;
  max-width: 100px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .service-horizontal { flex-direction: column; text-align: center; }
  .service-action { margin-left: 0; margin-top: var(--space-md); }
}
</style>
