<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '../composables/useContent'

const { coursesList } = useContent()

const specialties = computed(() => {
  const activeGM = coursesList.value.filter(c => c.category === 'Grado Medio' && c.status === 'Activo')
  
  if (activeGM.length === 0) {
    return [
      { title: 'Mecanizado', desc: 'Especialízate en procesos de fabricación por arranque de viruta, control numérico (CNC) y metrología.', icon: 'settings_suggest' },
      { title: 'Cocina y Gastronomía', desc: 'Domina las técnicas culinarias profesionales, gestión de cocina y seguridad alimentaria.', icon: 'outdoor_grill' }
    ]
  }
  
  return activeGM.map(c => {
    let icon = 'engineering'
    let desc = 'Ciclo formativo oficial de grado medio con alta empleabilidad y prácticas en empresas líderes.'
    
    const nameLower = c.name.toLowerCase()
    if (nameLower.includes('cocina') || nameLower.includes('gastro') || nameLower.includes('hostel')) {
      icon = 'outdoor_grill'
      desc = 'Domina las técnicas culinarias profesionales, gestión de cocina y seguridad alimentaria.'
    } else if (nameLower.includes('mecaniz') || nameLower.includes('solda') || nameLower.includes('calder')) {
      icon = 'settings_suggest'
      desc = 'Especialízate en procesos de fabricación por arranque de viruta, control numérico (CNC), soldadura y metrología.'
    } else if (nameLower.includes('vehí') || nameLower.includes('electromec') || nameLower.includes('auto')) {
      icon = 'car_repair'
      desc = 'Formación avanzada en diagnosis de averías, sistemas eléctricos y mantenimiento de motores.'
    } else if (nameLower.includes('comer') || nameLower.includes('venta') || nameLower.includes('activi')) {
      icon = 'payments'
      desc = 'Gestión integral del comercio, marketing en el punto de venta y operaciones de almacenaje.'
    }
    
    return {
      title: c.name,
      desc: desc,
      icon: icon,
      image: c.imageUrl
    }
  })
})
</script>

<template>
  <div class="grado-medio-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/formacion-profesional" class="link">Formación</RouterLink>
            <span class="separator">/</span>
            <span class="current">Grado Medio</span>
          </nav>
          <h1 class="page-title headline-xl">Formación Profesional de Grado Medio</h1>
          <p class="page-subtitle body-lg">
            Especialización técnica de calidad para acceder con garantías al mercado laboral o continuar hacia un Grado Superior.
          </p>
        </div>
      </div>
    </header>

    <!-- Introducción -->
    <section class="section intro">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-visual">
            <div class="info-card bg-secondary-fixed">
              <span class="material-symbols-outlined display-icon">engineering</span>
              <h3>Profesionalización</h3>
              <p class="body-md">Formación técnica avanzada conectada directamente con las necesidades de la industria actual.</p>
            </div>
          </div>
          <div class="intro-content">
            <h2>Ciclos de Grado Medio</h2>
            <p class="body-md text-muted mb-md">
              Nuestros ciclos de Grado Medio tienen una duración de 2.000 horas (2 años) e incluyen un periodo fundamental de Formación en Centros de Trabajo (FCT) en empresas líderes del sector.
            </p>
            <div class="perks-list">
              <div class="perk-item">
                <span class="material-symbols-outlined">verified</span>
                <p class="body-md">Título de Técnico/a Oficial</p>
              </div>
              <div class="perk-item">
                <span class="material-symbols-outlined">business</span>
                <p class="body-md">Prácticas en empresas reales</p>
              </div>
              <div class="perk-item">
                <span class="material-symbols-outlined">trending_up</span>
                <p class="body-md">Alta tasa de empleabilidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Especialidades -->
    <section class="section bg-surface-container specialties">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Áreas Técnicas</span>
          <h2>Especialidades de Grado Medio</h2>
        </div>

        <div class="specialties-grid">
          <div v-for="specialty in specialties" :key="specialty.title" class="specialty-card card">
            <div class="specialty-image" v-if="specialty.image">
              <img :src="specialty.image" :alt="specialty.title">
            </div>
            <div class="specialty-icon icon--blue" v-else>
              <span class="material-symbols-outlined">{{ specialty.icon }}</span>
            </div>
            <h3>{{ specialty.title }}</h3>
            <p class="body-md text-muted">{{ specialty.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Requisitos y Salidas -->
    <section class="section req-salidas">
      <div class="container">
        <div class="req-salidas-grid">
          <div class="card p-lg">
            <h3>Requisitos de acceso</h3>
            <ul class="check-list mt-md">
              <li><span class="material-symbols-outlined">check</span>Título de Graduado en ESO</li>
              <li><span class="material-symbols-outlined">check</span>Título de Formación Profesional Básica</li>
              <li><span class="material-symbols-outlined">check</span>Superar la prueba de acceso a ciclos formativos</li>
              <li><span class="material-symbols-outlined">check</span>Título de Técnico o Técnico Auxiliar</li>
            </ul>
          </div>
          <div class="card p-lg border-secondary">
            <h3>Salidas profesionales</h3>
            <p class="body-md text-muted mt-md">
              Al finalizar, estarás cualificado para incorporarte directamente al mercado laboral en tu sector de especialización o para acceder a:
            </p>
            <ul class="check-list mt-sm">
              <li><span class="material-symbols-outlined">arrow_forward</span>Ciclos de Grado Superior</li>
              <li><span class="material-symbols-outlined">arrow_forward</span>Bachillerato</li>
              <li><span class="material-symbols-outlined">arrow_forward</span>Cursos de especialización técnica</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta-banner-blue">
          <div class="cta-inner">
            <h2>Especialízate con Peñascal</h2>
            <p class="body-lg">Nuestros talleres e instructores te preparan para los retos reales de tu futura profesión.</p>
            <div class="cta-btns mt-lg">
              <RouterLink to="/contacto" class="btn btn-primary btn-lg">Solicitar Información</RouterLink>
              <RouterLink to="/la-cooperativa/cooperan-con-nosotros" class="btn btn-ghost btn-lg text-white">Empresas colaboradoras</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  background-color: var(--color-surface-container-low);
  padding: var(--space-xl) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-outline-variant);
}

.page-header-content {
  max-width: 800px;
}

.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }
.text-white { color: white; }
.p-lg { padding: var(--space-lg); }

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--caption-size);
}
.breadcrumb .separator { color: var(--color-outline); }
.breadcrumb .current { color: var(--color-on-surface); font-weight: 600; }
.breadcrumb .link { color: var(--color-primary-container); }

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

/* Intro */
.intro-grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: var(--space-xl);
  align-items: center;
}

.info-card {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.display-icon {
  font-size: 48px;
  margin-bottom: var(--space-sm);
}

.perks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.perk-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-on-surface);
}

.perk-item .material-symbols-outlined {
  color: var(--color-secondary);
}

/* Specialties */
.section-eyebrow {
  display: block;
  color: var(--color-primary-container);
  text-transform: uppercase;
  margin-bottom: var(--space-unit);
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.specialty-card {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.specialty-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.specialty-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.specialty-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--space-xs);
  border: 1px solid var(--color-outline-variant);
}

.specialty-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon--blue {
  background: var(--color-secondary-fixed);
  color: var(--color-secondary);
}

/* Req & Salidas */
.req-salidas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.border-secondary {
  border-top: 4px solid var(--color-secondary);
}

.check-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.check-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-on-surface-variant);
}

.check-list .material-symbols-outlined {
  color: var(--color-secondary);
  font-size: 20px;
}

/* CTA */
.cta-banner-blue {
  background-color: var(--color-secondary);
  color: white;
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  text-align: center;
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
}

.cta-inner h2 { color: white; margin-bottom: var(--space-sm); }

.cta-btns {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.btn-lg { padding: 14px 28px; }

/* Responsive */
@media (max-width: 992px) {
  .intro-grid { grid-template-columns: 1fr; }
  .req-salidas-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .specialties-grid { grid-template-columns: 1fr; }
  .cta-btns { flex-direction: column; }
}
</style>
