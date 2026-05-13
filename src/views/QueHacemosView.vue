<script setup>
import { RouterLink } from 'vue-router'

const pillars = [
  {
    icon: 'school',
    title: 'Formación para la vida',
    desc: 'No solo enseñamos oficios, acompañamos en el crecimiento personal y social de cada individuo.',
    color: 'green'
  },
  {
    icon: 'work_history',
    title: 'Empleo con Propósito',
    desc: 'Creamos entornos de trabajo reales donde el aprendizaje se transforma en experiencia profesional.',
    color: 'blue'
  },
  {
    icon: 'handshake',
    title: 'Intervención Cercana',
    desc: 'Acompañamiento integral para superar barreras y construir proyectos de vida autónomos.',
    color: 'amber'
  }
]

const impacts = [
  { label: 'Inserción laboral', value: '70', suffix: '%' },
  { label: 'Personas atendidas', value: '3.500', suffix: '+' },
  { label: 'Empresas colaboradoras', value: '500', suffix: '+' },
  { label: 'Años de impacto', value: '38', suffix: '' }
]
</script>

<template>
  <div class="que-hacemos-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <span class="chip chip-blue mb-sm">Actividad</span>
          <h1 class="page-title">Qué Hacemos</h1>
          <p class="page-subtitle body-lg">
            Nuestra labor se centra en transformar vidas a través de la educación, el empleo digno y el apoyo social continuo.
          </p>
        </div>
      </div>
    </header>

    <!-- Pilares de Acción -->
    <section class="section action-pillars">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Nuestro Enfoque</span>
          <h2>Pilares de nuestra intervención</h2>
        </div>

        <div class="pillars-grid">
          <div v-for="pillar in pillars" :key="pillar.title" class="pillar-card card">
            <div class="pillar-icon-wrap" :class="'pillar-icon--' + pillar.color">
              <span class="material-symbols-outlined">{{ pillar.icon }}</span>
            </div>
            <h3>{{ pillar.title }}</h3>
            <p class="body-md text-muted">{{ pillar.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Impacto Section -->
    <section class="section impact-section bg-surface-container">
      <div class="container">
        <div class="impact-content">
          <div class="impact-text">
            <h2>Impacto que transforma</h2>
            <p class="body-lg text-muted mb-lg">
              Los números reflejan nuestro compromiso, pero las historias de éxito de cada persona son nuestro verdadero motor.
            </p>
            <div class="impact-stats-grid">
              <div v-for="stat in impacts" :key="stat.label" class="impact-stat">
                <div class="stat-value headline-lg">{{ stat.value }}<span class="stat-suffix">{{ stat.suffix }}</span></div>
                <div class="stat-label caption">{{ stat.label }}</div>
              </div>
            </div>
          </div>
          <div class="impact-visual">
            <div class="image-stack">
              <div class="image-box bg-primary-fixed">
                <span class="material-symbols-outlined">diversity_1</span>
              </div>
              <div class="image-box bg-secondary-fixed">
                <span class="material-symbols-outlined">trending_up</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Áreas Detalladas -->
    <section class="section areas-detalladas">
      <div class="container">
        <div class="area-block">
          <div class="area-info">
            <span class="chip chip-green mb-sm">Educación</span>
            <h3>Formación Profesional y Básica</h3>
            <p class="body-md text-muted mb-md">
              Ofrecemos itinerarios formativos adaptados a diferentes niveles, desde el Grado Básico hasta el Grado Medio, además de formación específica para el empleo y certificados de profesionalidad.
            </p>
            <ul class="check-list mb-lg">
              <li><span class="material-symbols-outlined">check</span>Talleres industriales propios</li>
              <li><span class="material-symbols-outlined">check</span>Metodología práctica (aprender haciendo)</li>
              <li><span class="material-symbols-outlined">check</span>Orientación académica personalizada</li>
            </ul>
            <RouterLink to="/formacion-profesional" class="btn btn-primary">Ver oferta formativa</RouterLink>
          </div>
          <div class="area-visual">
            <div class="visual-placeholder">
              <span class="material-symbols-outlined">school</span>
            </div>
          </div>
        </div>

        <div class="area-block area-block--reverse">
          <div class="area-info">
            <span class="chip chip-blue mb-sm">Empleo</span>
            <h3>Empresas de Inserción</h3>
            <p class="body-md text-muted mb-md">
              Gestionamos unidades productivas reales en sectores como hostelería, automoción y servicios, donde las personas pueden realizar su primer contacto con el mercado laboral en un entorno protegido.
            </p>
            <ul class="check-list mb-lg">
              <li><span class="material-symbols-outlined">check</span>Contratos de inserción</li>
              <li><span class="material-symbols-outlined">check</span>Entornos de producción real</li>
              <li><span class="material-symbols-outlined">check</span>Tránsito al mercado laboral ordinario</li>
            </ul>
            <RouterLink to="/la-cooperativa/cooperan-con-nosotros" class="btn btn-primary">Nuestras empresas</RouterLink>
          </div>
          <div class="area-visual">
            <div class="visual-placeholder visual-placeholder--blue">
              <span class="material-symbols-outlined">business_center</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="section">
      <div class="container">
        <div class="cta-final-card">
          <div class="cta-inner">
            <h2>¿Quieres saber más?</h2>
            <p class="body-lg">Estamos encantados de explicarte en detalle nuestra forma de trabajar.</p>
            <div class="cta-btns">
              <RouterLink to="/contacto" class="btn btn-primary btn-lg">Contactar ahora</RouterLink>
              <RouterLink to="/la-cooperativa" class="btn btn-secondary btn-lg">Más sobre nosotros</RouterLink>
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
.text-center { text-align: center; }
.text-muted { color: var(--color-on-surface-variant); }

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

.page-subtitle {
  color: var(--color-on-surface-variant);
}

/* Pillars */
.section-eyebrow {
  display: block;
  color: var(--color-primary-container);
  text-transform: uppercase;
  margin-bottom: var(--space-unit);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.pillar-card {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
}

.pillar-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-unit);
}

.pillar-icon-wrap .material-symbols-outlined {
  font-size: 32px;
}

.pillar-icon--green { background: var(--color-primary-fixed); color: var(--color-primary); }
.pillar-icon--blue { background: var(--color-secondary-fixed); color: var(--color-secondary); }
.pillar-icon--amber { background: var(--color-tertiary-fixed); color: var(--color-tertiary); }

/* Impact Section */
.impact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.impact-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.impact-stat {
  padding: var(--space-md);
  background: var(--color-surface-container-lowest);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-outline-variant);
}

.stat-value {
  color: var(--color-primary-container);
  font-weight: 800;
}

.stat-suffix {
  font-size: 0.6em;
  margin-left: 2px;
}

.image-stack {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.image-box {
  width: 180px;
  height: 180px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-box .material-symbols-outlined {
  font-size: 64px;
}

/* Áreas */
.area-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
  margin-bottom: var(--space-xl);
}

.area-block--reverse {
  direction: rtl;
}

.area-block--reverse .area-info {
  direction: ltr;
}

.area-block--reverse .area-visual {
  direction: ltr;
}

.visual-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
  background: var(--color-primary-fixed);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.visual-placeholder--blue {
  background: var(--color-secondary-fixed);
  color: var(--color-secondary);
}

.visual-placeholder .material-symbols-outlined {
  font-size: 80px;
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
  color: var(--color-primary-container);
  font-size: 20px;
}

/* CTA Final */
.cta-final-card {
  background: var(--color-primary-container);
  color: var(--color-on-primary);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  text-align: center;
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
}

.cta-inner h2 { color: var(--color-on-primary); margin-bottom: var(--space-sm); }
.cta-inner p { opacity: 0.9; margin-bottom: var(--space-lg); }

.cta-btns {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

.btn-lg { padding: 14px 28px; }

/* Responsive */
@media (max-width: 992px) {
  .pillars-grid { grid-template-columns: 1fr; }
  .impact-content { grid-template-columns: 1fr; }
  .area-block { grid-template-columns: 1fr; gap: var(--space-lg); }
  .area-block--reverse { direction: ltr; }
}

@media (max-width: 640px) {
  .cta-btns { flex-direction: column; }
  .image-stack { flex-direction: column; align-items: center; }
}
</style>
