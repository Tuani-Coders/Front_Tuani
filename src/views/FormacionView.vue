<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="formacion-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/" class="link">Inicio</RouterLink>
            <span class="separator">/</span>
            <span class="current">Formación</span>
          </nav>
          <h1 class="page-title headline-xl">Programas Formativos</h1>
          <p class="page-subtitle body-lg">
            Capacitación técnica de alta calidad adaptada a las necesidades reales del mercado laboral actual.
          </p>
        </div>
      </div>
    </header>

    <!-- Oferta Formativa -->
    <section class="section oferta-formativa">
      <div class="container">
        <div class="section-header">
          <h2 class="headline-xl">Nuestra oferta</h2>
          <p class="body-lg text-muted">Descubre nuestros programas diseñados para la inserción laboral efectiva.</p>
        </div>

        <div class="cards-grid">
          <!-- Grado Básico -->
          <div class="card formativa-card">
            <div class="card-image bg-primary-container">
              <span class="material-symbols-outlined display-icon">school</span>
            </div>
            <div class="card-content">
              <h3 class="headline-md">Grado Básico</h3>
              <p class="body-md">Para jóvenes que quieren iniciarse en una profesión y obtener la titulación básica obligatoria.</p>
              <ul class="features-list">
                <li><span class="material-symbols-outlined">check_circle</span> Mantenimiento de Vehículos</li>
                <li><span class="material-symbols-outlined">check_circle</span> Cocina y Restauración</li>
                <li><span class="material-symbols-outlined">check_circle</span> Fabricación y Montaje</li>
              </ul>
              <RouterLink to="/formacion-profesional/grado-basico" class="btn btn-secondary mt-auto">
                Ver Grado Básico
              </RouterLink>
            </div>
          </div>

          <!-- Grado Medio -->
          <div class="card formativa-card">
            <div class="card-image bg-secondary">
              <span class="material-symbols-outlined display-icon">engineering</span>
            </div>
            <div class="card-content">
              <h3 class="headline-md">Grado Medio</h3>
              <p class="body-md">Especialización técnica para adquirir competencias profesionales completas y acceso al empleo.</p>
              <ul class="features-list">
                <li><span class="material-symbols-outlined">check_circle</span> Mecanizado Industrial</li>
                <li><span class="material-symbols-outlined">check_circle</span> Gastronomía Profesional</li>
                <li><span class="material-symbols-outlined">check_circle</span> Electromecánica</li>
              </ul>
              <RouterLink to="/formacion-profesional/grado-medio" class="btn btn-secondary mt-auto">
                Ver Grado Medio
              </RouterLink>
            </div>
          </div>

          <!-- Formación para el Empleo -->
          <div class="card formativa-card">
            <div class="card-image bg-tertiary">
              <span class="material-symbols-outlined display-icon">work_history</span>
            </div>
            <div class="card-content">
              <h3 class="headline-md">Formación para el Empleo</h3>
              <p class="body-md">Cursos intensivos dirigidos a personas desempleadas para la mejora de su empleabilidad inmediata.</p>
              <ul class="features-list">
                <li><span class="material-symbols-outlined">check_circle</span> Certificados de Profesionalidad</li>
                <li><span class="material-symbols-outlined">check_circle</span> Formación 100% subvencionada</li>
                <li><span class="material-symbols-outlined">check_circle</span> Orientación laboral directa</li>
              </ul>
              <RouterLink to="/formacion-profesional/formacion-para-el-empleo" class="btn btn-secondary mt-auto">
                Ver Formación Empleo
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Metodología: Basque Style -->
    <section class="section bg-surface metodologia">
      <div class="container">
        <div class="metodologia-grid">
          <div class="metodologia-content">
            <span class="section-eyebrow label-lg">Cómo enseñamos</span>
            <h2 class="headline-xl">Metodología Peñascal</h2>
            <p class="body-lg mb-lg">
              Apostamos por una formación práctica y humana, donde el alumno es el centro de un proceso de aprendizaje basado en la realidad industrial.
            </p>
            <div class="perks-list">
              <div class="perk-item card">
                <span class="material-symbols-outlined">psychology</span>
                <p class="label-lg">Tutorización individual</p>
              </div>
              <div class="perk-item card">
                <span class="material-symbols-outlined">home_repair_service</span>
                <p class="label-lg">Talleres especializados</p>
              </div>
              <div class="perk-item card">
                <span class="material-symbols-outlined">handshake</span>
                <p class="label-lg">Red de 500+ empresas</p>
              </div>
            </div>
          </div>
          <div class="metodologia-visual">
            <div class="visual-box border-stone">
              <span class="material-symbols-outlined">architecture</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta-banner bg-primary text-white">
          <div class="cta-inner">
            <h2 class="headline-lg">¿Necesitas orientación?</h2>
            <p class="body-lg">Nuestro servicio de orientación te ayudará a elegir el itinerario más adecuado para tu situación personal y profesional.</p>
            <RouterLink to="/la-cooperativa/servicio-de-orientacion" class="btn btn-secondary mt-md">Solicitar Cita</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  background-color: var(--color-surface-container-low);
  padding: 100px 0 60px;
  border-bottom: 2px solid var(--color-outline-variant);
}

.page-header-content {
  max-width: 800px;
}

.mb-sm { margin-bottom: var(--space-sm); }
.mb-lg { margin-bottom: var(--space-lg); }
.mb-md { margin-bottom: var(--space-md); }
.mt-auto { margin-top: auto; }
.mt-md { margin-top: var(--space-md); }

.page-title {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.section-header {
  margin-bottom: 60px;
  text-align: center;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.formativa-card {
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  overflow: hidden;
}

.formativa-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.card-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-image .display-icon {
  font-size: 80px;
}

.card-content {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-on-surface-variant);
}

.features-list .material-symbols-outlined {
  color: var(--color-primary);
}

/* Metodología */
.metodologia-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-xl);
  align-items: center;
}

.perks-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.perk-item {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast);
}

.perk-item:hover {
  transform: translateX(8px);
}

.perk-item .material-symbols-outlined {
  color: var(--color-secondary);
}

.visual-box {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface-container);
  box-shadow: var(--shadow-md);
}

.visual-box .material-symbols-outlined {
  font-size: 100px;
  color: var(--color-outline-variant);
}

.border-stone {
  border: 2px dashed var(--color-outline);
}

/* CTA */
.cta-banner {
  padding: 80px;
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
}

.cta-banner h2 { color: white; }

.text-white { color: white; }

@media (max-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(2, 1fr); }
  .cta-banner { padding: 40px; }
}

@media (max-width: 768px) {
  .cards-grid { grid-template-columns: 1fr; }
  .metodologia-grid { grid-template-columns: 1fr; }
  .page-header { padding: 80px 0 40px; }
}
</style>
