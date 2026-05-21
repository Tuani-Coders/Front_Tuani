<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '../composables/useContent'

const { coursesList } = useContent()

const specialties = computed(() => {
  const activeGB = coursesList.value.filter(c => c.category === 'Grado Básico' && c.status === 'Activo')
  
  // If there are no active courses in localstorage yet, return some defaults so the page is not empty
  if (activeGB.length === 0) {
    return [
      { title: 'Cocina y Restauración', desc: 'Iníciate en el mundo de la hostelería cocinando en nuestra escuela-restaurante.', icon: 'restaurant' },
      { title: 'Mantenimiento de Vehículos', desc: 'Aprende las bases de la mecánica y electricidad del automóvil en talleres reales.', icon: 'directions_car' }
    ]
  }
  
  return activeGB.map(c => {
    let icon = 'school'
    let desc = 'Formación profesional básica adaptada con talleres prácticos y simulaciones de entornos reales.'
    
    const nameLower = c.name.toLowerCase()
    if (nameLower.includes('cocina') || nameLower.includes('restau') || nameLower.includes('hostel')) {
      icon = 'restaurant'
      desc = 'Iníciate en el mundo de la hostelería cocinando en nuestra escuela-restaurante.'
    } else if (nameLower.includes('vehí') || nameLower.includes('auto')) {
      icon = 'directions_car'
      desc = 'Aprende las bases de la mecánica y electricidad del automóvil en talleres reales.'
    } else if (nameLower.includes('solda') || nameLower.includes('fabri') || nameLower.includes('metal') || nameLower.includes('mecaniz')) {
      icon = 'precision_manufacturing'
      desc = 'Descubre el mundo del metal, la soldadura y el montaje industrial.'
    } else if (nameLower.includes('elec')) {
      icon = 'electric_bolt'
      desc = 'Aprende sobre instalaciones eléctricas, automatismos y circuitos electrónicos básicos.'
    } else if (nameLower.includes('comer') || nameLower.includes('venta') || nameLower.includes('almac')) {
      icon = 'store'
      desc = 'Aprende gestión de almacén, atención al cliente y técnicas de venta.'
    }
    
    return {
      title: c.name,
      desc: desc,
      icon: icon
    }
  })
})
</script>

<template>
  <div class="grado-basico-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/formacion-profesional" class="link">Formación</RouterLink>
            <span class="separator">/</span>
            <span class="current">Grado Básico</span>
          </nav>
          <h1 class="page-title headline-xl">Formación Profesional de Grado Básico</h1>
          <p class="page-subtitle body-lg">
            Una oportunidad para retomar tus estudios, aprender un oficio y obtener el título de Graduado en ESO.
          </p>
        </div>
      </div>
    </header>

    <!-- Introducción -->
    <section class="section intro">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-content">
            <h2>¿Qué es el Grado Básico?</h2>
            <p class="body-md text-muted mb-md">
              Son ciclos formativos de dos años de duración dirigidos a jóvenes que prefieren un aprendizaje práctico y quieren orientarse hacia el mundo laboral o continuar con un Grado Medio.
            </p>
            <div class="benefits-grid">
              <div class="benefit-item">
                <span class="material-symbols-outlined benefit-icon">school</span>
                <p class="label-md">Título de Graduado en ESO</p>
              </div>
              <div class="benefit-item">
                <span class="material-symbols-outlined benefit-icon">work</span>
                <p class="label-md">Título Profesional Básico</p>
              </div>
              <div class="benefit-item">
                <span class="material-symbols-outlined benefit-icon">trending_up</span>
                <p class="label-md">Acceso a Grado Medio</p>
              </div>
            </div>
          </div>
          <div class="intro-visual">
            <div class="info-card bg-primary-fixed">
              <span class="material-symbols-outlined display-icon">lightbulb</span>
              <h3>Aprender Haciendo</h3>
              <p class="body-md">El 70% de la formación se realiza en talleres prácticos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Especialidades -->
    <section class="section bg-surface-container specialties">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Nuestra Oferta</span>
          <h2>Especialidades disponibles</h2>
        </div>

        <div class="specialties-grid">
          <div v-for="specialty in specialties" :key="specialty.title" class="specialty-card card">
            <div class="specialty-icon">
              <span class="material-symbols-outlined">{{ specialty.icon }}</span>
            </div>
            <h3>{{ specialty.title }}</h3>
            <p class="body-md text-muted">{{ specialty.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Requisitos -->
    <section class="section requirements">
      <div class="container">
        <div class="requirements-box card">
          <div class="requirements-header">
            <span class="material-symbols-outlined">info</span>
            <h2>Requisitos de acceso</h2>
          </div>
          <ul class="requirements-list">
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              <div>
                <h4 class="label-md">Edad</h4>
                <p class="body-md text-muted">Tener entre 15 y 17 años cumplidos en el año natural.</p>
              </div>
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              <div>
                <h4 class="label-md">Nivel académico</h4>
                <p class="body-md text-muted">Haber cursado el primer ciclo de ESO (o excepcionalmente 2º de ESO).</p>
              </div>
            </li>
            <li>
              <span class="material-symbols-outlined">check_circle</span>
              <div>
                <h4 class="label-md">Recomendación</h4>
                <p class="body-md text-muted">Contar con la recomendación del equipo docente de tu centro actual.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta-card bg-surface-container-low border-primary">
          <div class="cta-content">
            <h2>¿Te interesa empezar?</h2>
            <p class="body-lg text-muted">El periodo de preinscripción suele ser en mayo/junio. Llámanos y te informamos sin compromiso.</p>
          </div>
          <div class="cta-actions">
            <a href="tel:+34944430000" class="btn btn-primary btn-lg">
              <span class="material-symbols-outlined">phone</span>
              Llamar ahora
            </a>
            <RouterLink to="/contacto" class="btn btn-secondary btn-lg">Solicitar info</RouterLink>
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
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }

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

.page-subtitle {
  color: var(--color-on-surface-variant);
}

/* Intro */
.intro-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-xl);
  align-items: center;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.benefit-item {
  text-align: center;
}

.benefit-icon {
  font-size: 32px;
  color: var(--color-primary-container);
  margin-bottom: 8px;
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
  background: var(--color-primary-fixed);
  color: var(--color-primary-container);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Requirements */
.requirements-box {
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.requirements-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.requirements-header .material-symbols-outlined {
  color: var(--color-secondary);
  font-size: 32px;
}

.requirements-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.requirements-list li {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.requirements-list .material-symbols-outlined {
  color: var(--color-primary-container);
  font-size: 24px;
}

/* CTA */
.border-primary {
  border: 1px solid var(--color-primary-container);
}

.cta-card {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-xl);
  box-shadow: var(--shadow-md);
}

.cta-actions {
  display: flex;
  gap: var(--space-md);
}

.btn-lg { padding: 14px 28px; }

/* Responsive */
@media (max-width: 992px) {
  .intro-grid { grid-template-columns: 1fr; }
  .cta-card { flex-direction: column; text-align: center; }
}

@media (max-width: 768px) {
  .specialties-grid { grid-template-columns: 1fr; }
  .benefits-grid { grid-template-columns: 1fr; }
  .cta-actions { flex-direction: column; width: 100%; }
}
</style>
