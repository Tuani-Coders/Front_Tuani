<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '../composables/useContent'

const { coursesList } = useContent()

const courses = computed(() => {
  const activeEmpleo = coursesList.value.filter(c => c.category === 'Empleo' && c.status === 'Activo')
  
  if (activeEmpleo.length === 0) {
    return [
      { title: 'Operaciones de Restaurante y Bar', level: 'Certificado Nivel 1', duration: '290h', icon: 'local_bar' },
      { title: 'Mantenimiento de Sistemas Eléctricos', level: 'Certificado Nivel 2', duration: '420h', icon: 'electrical_services' }
    ]
  }
  
  return activeEmpleo.map(c => {
    let icon = 'work_history'
    let level = 'Certificado Profesional'
    
    const nameLower = c.name.toLowerCase()
    if (nameLower.includes('restaurante') || nameLower.includes('cocina') || nameLower.includes('bar') || nameLower.includes('camer')) {
      icon = 'local_bar'
      level = 'Certificado Nivel 1'
    } else if (nameLower.includes('eléctric') || nameLower.includes('electrici')) {
      icon = 'electrical_services'
      level = 'Certificado Nivel 2'
    } else if (nameLower.includes('solda')) {
      icon = 'mode_fan'
      level = 'Certificado Nivel 2'
    } else if (nameLower.includes('admin') || nameLower.includes('gestión')) {
      icon = 'description'
      level = 'Certificado Nivel 2'
    } else if (nameLower.includes('social') || nameLower.includes('sanitaria') || nameLower.includes('domicilio')) {
      icon = 'volunteer_activism'
      level = 'Certificado Nivel 2'
    }
    
    return {
      title: c.name,
      level: level,
      duration: c.duration,
      icon: icon,
      image: c.imageUrl
    }
  })
})
</script>

<template>
  <div class="formacion-empleo-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/formacion-profesional" class="link">Formación</RouterLink>
            <span class="separator">/</span>
            <span class="current">Formación para el Empleo</span>
          </nav>
          <h1 class="page-title headline-xl">Formación para el Empleo</h1>
          <p class="page-subtitle body-lg">
            Cursos prácticos y Certificados de Profesionalidad diseñados para mejorar tu empleabilidad y conectarte con el mercado laboral actual.
          </p>
        </div>
      </div>
    </header>

    <!-- Explicación -->
    <section class="section intro">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-content">
            <h2>Certificados de Profesionalidad</h2>
            <p class="body-md text-muted mb-md">
              Son titulaciones oficiales con validez en todo el territorio nacional que acreditan que una persona tiene las capacidades para desempeñar una profesión. Es la vía más rápida y directa para volver al mundo laboral con una garantía oficial.
            </p>
            <div class="key-features">
              <div class="feature">
                <span class="material-symbols-outlined">verified</span>
                <div>
                  <h4 class="label-md">Título Oficial</h4>
                  <p class="caption">Acreditado por el SEPE / Lanbide.</p>
                </div>
              </div>
              <div class="feature">
                <span class="material-symbols-outlined">timer</span>
                <div>
                  <h4 class="label-md">Formación Intensiva</h4>
                  <p class="caption">Enfoque 100% práctico y ágil.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="intro-visual">
            <div class="highlight-card bg-amber-fixed">
              <span class="material-symbols-outlined display-icon">workspace_premium</span>
              <h3>Impulsa tu carrera</h3>
              <p class="body-md">Formación gratuita para personas desempleadas cofinanciada por fondos europeos y autonómicos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Catálogo Mock -->
    <section class="section bg-surface-container courses">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Oferta Actual</span>
          <h2>Próximas convocatorias</h2>
        </div>

        <div class="courses-grid">
          <div v-for="course in courses" :key="course.title" class="course-card card">
            <div class="course-image-header" v-if="course.image">
              <img :src="course.image" :alt="course.title">
            </div>
            <div class="course-icon-wrap" v-else>
              <span class="material-symbols-outlined">{{ course.icon }}</span>
            </div>
            <div class="course-info">
              <span class="label-md text-primary">{{ course.level }}</span>
              <h3>{{ course.title }}</h3>
              <div class="course-meta">
                <span class="material-symbols-outlined">schedule</span>
                <span class="caption">Duración: {{ course.duration }}</span>
              </div>
            </div>
            <RouterLink to="/contacto" class="btn btn-secondary mt-auto">Consultar plaza</RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Pasos para inscribirse -->
    <section class="section steps">
      <div class="container">
        <div class="section-header text-center">
          <h2>¿Cómo inscribirse?</h2>
        </div>
        
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number">1</div>
            <h4 class="label-md">Infórmate</h4>
            <p class="body-md text-muted">Elige el curso que mejor se adapte a tu perfil y objetivos.</p>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <h4 class="label-md">Inscripción</h4>
            <p class="body-md text-muted">A través de Lanbide o contactando directamente con nosotros.</p>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <h4 class="label-md">Selección</h4>
            <p class="body-md text-muted">Realizamos una pequeña entrevista para confirmar tu idoneidad para el curso.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-primary">
      <div class="container">
        <div class="accent-card text-center">
          <h2 class="accent-card-title justify-center">
            <span class="material-symbols-outlined">help_outline</span>
            ¿Necesitas ayuda para decidir?
          </h2>
          <div class="accent-card-content">
            <p class="body-lg mb-md">Nuestro servicio de orientación te ayudará a elegir el itinerario más adecuado para tu situación.</p>
            <div class="cta-actions justify-center">
              <RouterLink to="/la-cooperativa/servicio-de-orientacion" class="btn cta-panel-btn">
                Servicio de Orientación
                <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </RouterLink>
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
.mb-lg { margin-bottom: var(--space-lg); }
.mt-auto { margin-top: auto; }
.text-muted { color: var(--color-on-surface-variant); }
.text-primary { color: var(--color-primary-container); }
.text-white { color: white; }
.text-center { text-align: center; }
.justify-center { justify-content: center; }

/* Breadcrumb is now global in utilities.css */

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

/* Intro */
.intro-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-xl);
  align-items: center;
}

.key-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.feature .material-symbols-outlined {
  color: var(--color-tertiary);
  font-size: 28px;
}

.highlight-card {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  text-align: center;
}

.display-icon {
  font-size: 48px;
  margin-bottom: var(--space-sm);
}

/* Courses */
.section-eyebrow {
  display: block;
  color: var(--color-primary-container);
  text-transform: uppercase;
  margin-bottom: var(--space-unit);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.course-card {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: var(--color-surface-container-lowest);
}

.course-icon-wrap {
  width: 56px;
  height: 56px;
  background: var(--color-tertiary-fixed);
  color: var(--color-tertiary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.course-image-header {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
}

.course-image-header img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-icon-wrap .material-symbols-outlined {
  font-size: 32px;
}

.course-info h3 {
  margin-top: 4px;
  margin-bottom: 8px;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-outline);
}

.course-meta .material-symbols-outlined {
  font-size: 16px;
}

/* Steps */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.step-item {
  text-align: center;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--color-primary-container);
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-weight: 800;
}

/* CTA */
.cta-box {
  background: var(--color-primary);
  border-top: 4px solid var(--color-secondary);
  color: var(--color-on-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-sm);
}

.cta-box h2 { 
  color: var(--color-on-primary);
  text-transform: uppercase;
  font-size: var(--label-lg-size);
  font-weight: 800;
  letter-spacing: 0.05em;
}

.cta-box p {
  color: var(--color-on-primary);
  opacity: 0.82;
}

.cta-actions {
  display: flex;
  gap: var(--space-md);
}

.btn-lg { padding: 14px 28px; }

/* Responsive */
@media (max-width: 992px) {
  .intro-grid { grid-template-columns: 1fr; }
  .courses-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .cta-actions { flex-direction: column; }
}
</style>
