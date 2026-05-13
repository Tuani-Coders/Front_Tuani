<script setup>
import { RouterLink } from 'vue-router'

const services = [
  {
    title: 'Itinerarios Personalizados',
    desc: 'Diseñamos contigo una hoja de ruta adaptada a tus intereses, capacidades y situación personal.',
    icon: 'route'
  },
  {
    title: 'Búsqueda de Empleo',
    desc: 'Te enseñamos a redactar tu CV, preparar entrevistas y utilizar portales de empleo de forma eficaz.',
    icon: 'manage_search'
  },
  {
    title: 'Acompañamiento Social',
    desc: 'Apoyo integral para resolver dificultades personales o familiares que puedan frenar tu inserción.',
    icon: 'psychology'
  },
  {
    title: 'Pruebas de Acceso',
    desc: 'Información y apoyo para inscribirte en las pruebas de acceso a ciclos de Grado Medio o Superior.',
    icon: 'edit_note'
  }
]
</script>

<template>
  <div class="orientacion-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <span class="chip chip-green mb-sm">Servicio Gratuito</span>
          <h1 class="page-title">Servicio de Orientación</h1>
          <p class="page-subtitle body-lg">
            Te acompañamos en la toma de decisiones sobre tu futuro profesional y personal, ofreciéndote herramientas para alcanzar tus metas.
          </p>
        </div>
      </div>
    </header>

    <!-- Enfoque -->
    <section class="section intro">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-visual">
            <div class="image-placeholder bg-primary-fixed">
              <span class="material-symbols-outlined display-icon">groups_3</span>
            </div>
          </div>
          <div class="intro-content">
            <h2>No estás solo en tu camino</h2>
            <p class="body-md text-muted mb-md">
              Nuestro equipo de orientadores y trabajadores sociales trabaja de forma cercana y humanizada. Creemos en el potencial de cada persona y nuestro objetivo es que encuentres el lugar donde mejor puedas desarrollarte.
            </p>
            <div class="stats-mini">
              <div class="stat">
                <span class="headline-md">100%</span>
                <span class="caption">Personalizado</span>
              </div>
              <div class="stat">
                <span class="headline-md">Gratis</span>
                <span class="caption">Sin coste</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Servicios Detallados -->
    <section class="section bg-surface-container-low services-list">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Qué ofrecemos</span>
          <h2>Cómo podemos ayudarte</h2>
        </div>

        <div class="services-grid">
          <div v-for="service in services" :key="service.title" class="service-item card">
            <div class="service-icon">
              <span class="material-symbols-outlined">{{ service.icon }}</span>
            </div>
            <div class="service-text">
              <h3>{{ service.title }}</h3>
              <p class="body-md text-muted">{{ service.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Perfil del Equipo -->
    <section class="section team-profile">
      <div class="container">
        <div class="team-card card">
          <div class="team-info">
            <h2>Un equipo multidisciplinar</h2>
            <p class="body-lg text-muted mb-lg">
              Contamos con psicólogos, pedagogos y trabajadores sociales con amplia experiencia en la inserción sociolaboral.
            </p>
            <ul class="check-list">
              <li><span class="material-symbols-outlined">check</span>Atención en castellano y euskera</li>
              <li><span class="material-symbols-outlined">check</span>Red de contactos con servicios sociales</li>
              <li><span class="material-symbols-outlined">check</span>Seguimiento tras la inserción</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta-box card text-center border-primary">
          <h2 class="mb-sm">Pide tu cita hoy mismo</h2>
          <p class="body-lg text-muted mb-lg">Puedes venir a vernos o llamarnos para concertar una primera entrevista de acogida.</p>
          <div class="cta-actions justify-center">
            <RouterLink to="/contacto" class="btn btn-primary btn-lg">Solicitar Cita</RouterLink>
            <a href="tel:+34944430000" class="btn btn-secondary btn-lg">Llamar 944 43 00 00</a>
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
.mb-lg { margin-bottom: var(--space-lg); }
.mt-md { margin-top: var(--space-md); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }
.justify-center { justify-content: center; }

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

/* Intro */
.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.image-placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary-container);
}

.display-icon {
  font-size: 80px;
}

.stats-mini {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-md);
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat span:first-child {
  color: var(--color-primary-container);
  font-weight: 800;
}

/* Services */
.section-eyebrow {
  display: block;
  color: var(--color-primary-container);
  text-transform: uppercase;
  margin-bottom: var(--space-unit);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.service-item {
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-md);
  background: var(--color-surface-container-lowest);
}

.service-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-fixed);
  color: var(--color-primary-container);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Team Card */
.team-card {
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--color-surface-container-lowest), var(--color-surface-container-high));
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
}

.check-list .material-symbols-outlined {
  color: var(--color-primary-container);
}

/* CTA */
.border-primary {
  border: 1px solid var(--color-primary-container);
}

.cta-box {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
}

.cta-actions {
  display: flex;
  gap: var(--space-md);
}

.btn-lg { padding: 14px 28px; }

/* Responsive */
@media (max-width: 992px) {
  .intro-grid { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .cta-actions { flex-direction: column; }
  .stats-mini { justify-content: center; }
}
</style>
