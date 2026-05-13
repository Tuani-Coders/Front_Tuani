<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="cooperativa-view view">
    <!-- Header Hero -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <span class="chip chip-green mb-sm">La Cooperativa</span>
          <h1 class="page-title">Quiénes Somos</h1>
          <p class="page-subtitle body-lg">
            Grupo Peñascal es una iniciativa social sin ánimo de lucro dedicada a la integración y el desarrollo personal, social y laboral de personas en situación de vulnerabilidad o exclusión.
          </p>
        </div>
      </div>
    </header>

    <!-- Misión y Valores -->
    <section class="section">
      <div class="container">
        <div class="mision-grid">
          <div class="mision-card card p-lg bg-surface-lowest">
            <span class="material-symbols-outlined display-icon text-primary mb-md">target</span>
            <h2 class="mb-sm">Nuestra Misión</h2>
            <p class="body-lg text-muted">
              Promover la inclusión social y laboral a través de la formación integral, la orientación personalizada y la creación de empleo en empresas de inserción, apostando por el desarrollo del entorno comunitario.
            </p>
          </div>
          
          <div class="valores-card">
            <h3 class="mb-md">Nuestros Valores</h3>
            <ul class="valores-list">
              <li class="valor-item card">
                <span class="material-symbols-outlined valor-icon">volunteer_activism</span>
                <div>
                  <h4 class="label-md">Compromiso Social</h4>
                  <p class="body-md text-muted">Trabajamos para y con las personas que más lo necesitan.</p>
                </div>
              </li>
              <li class="valor-item card">
                <span class="material-symbols-outlined valor-icon">diversity_1</span>
                <div>
                  <h4 class="label-md">Igualdad y Diversidad</h4>
                  <p class="body-md text-muted">Apostamos por una sociedad inclusiva donde todos sumamos.</p>
                </div>
              </li>
              <li class="valor-item card">
                <span class="material-symbols-outlined valor-icon">eco</span>
                <div>
                  <h4 class="label-md">Sostenibilidad</h4>
                  <p class="body-md text-muted">Desarrollamos proyectos viables con impacto positivo.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Historia Timeline -->
    <section class="section bg-surface-low">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Nuestra trayectoria</span>
          <h2>Más de 35 años de historia</h2>
        </div>

        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-year headline-md">1986</div>
            <div class="timeline-content card">
              <h4 class="label-md text-primary">El inicio</h4>
              <p class="body-md text-muted">Fundación en el barrio bilbaíno de Rekaldeberri (Peñascal) como respuesta al alto desempleo juvenil.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-year headline-md">1999</div>
            <div class="timeline-content card">
              <h4 class="label-md text-primary">Empresas de Inserción</h4>
              <p class="body-md text-muted">Creación de las primeras unidades productivas para generar empleo real de tránsito.</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-year headline-md">2010</div>
            <div class="timeline-content card">
              <h4 class="label-md text-primary">Expansión territorial</h4>
              <p class="body-md text-muted">Apertura de nuevos centros en Bizkaia, Gipuzkoa y Navarra para ampliar el impacto.</p>
            </div>
          </div>

          <div class="timeline-item">
            <div class="timeline-year headline-md">Actualidad</div>
            <div class="timeline-content card">
              <h4 class="label-md text-primary">Consolidación</h4>
              <p class="body-md text-muted">Un equipo de más de 200 profesionales atendiendo a más de 3.500 personas anualmente.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Transparencia -->
    <section class="section">
      <div class="container">
        <div class="transparencia-banner card">
          <div class="transparencia-content">
            <span class="material-symbols-outlined text-secondary display-icon mb-sm">fact_check</span>
            <h2>Compromiso con la Transparencia</h2>
            <p class="body-lg text-muted mb-md">
              Como entidad declarada de Utilidad Pública, gestionamos nuestros recursos con rigor y responsabilidad, rindiendo cuentas ante la sociedad.
            </p>
            <div class="doc-links">
              <a href="#" class="btn btn-secondary">
                <span class="material-symbols-outlined">download</span> Memoria Anual
              </a>
              <a href="#" class="btn btn-secondary">
                <span class="material-symbols-outlined">download</span> Cuentas Auditadas
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Header */
.page-header {
  background-color: var(--color-surface-container-low);
  padding: var(--space-xl) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-outline-variant);
}

.page-header-content {
  max-width: 800px;
}

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

.page-subtitle {
  color: var(--color-on-surface-variant);
}

/* Utilities */
.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.text-primary { color: var(--color-primary-container); }
.text-secondary { color: var(--color-secondary); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }
.bg-surface-lowest { background-color: var(--color-surface-container-lowest); }
.bg-surface-low { background-color: var(--color-surface-container-low); }
.p-lg { padding: var(--space-lg); }
.display-icon { font-size: 48px; }

/* Mision y Valores */
.mision-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.mision-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.valores-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.valor-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-surface-container-lowest);
}

.valor-icon {
  font-size: 32px;
  color: var(--color-secondary);
  background: var(--color-secondary-fixed);
  padding: 12px;
  border-radius: var(--radius-full);
}

/* Timeline */
.section-eyebrow {
  display: block;
  color: var(--color-primary-container);
  text-transform: uppercase;
  margin-bottom: var(--space-unit);
}

.timeline {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 60px;
  width: 2px;
  background: var(--color-outline-variant);
}

.timeline-item {
  display: flex;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  position: relative;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-year {
  width: 120px;
  color: var(--color-primary-container);
  font-weight: 800;
  text-align: right;
  flex-shrink: 0;
  position: relative;
}

.timeline-year::after {
  content: '';
  position: absolute;
  top: 8px;
  right: -29px; /* align with the line */
  width: 12px;
  height: 12px;
  background: var(--color-primary-container);
  border: 4px solid var(--color-surface-container-low);
  border-radius: 50%;
}

.timeline-content {
  flex: 1;
  padding: var(--space-md);
  background: var(--color-surface-container-lowest);
}

/* Transparencia */
.transparencia-banner {
  padding: var(--space-xl);
  text-align: center;
  background: linear-gradient(135deg, var(--color-surface-container-lowest), var(--color-secondary-fixed));
}

.transparencia-content {
  max-width: 700px;
  margin: 0 auto;
}

.doc-links {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive */
@media (max-width: 768px) {
  .mision-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .timeline::before {
    left: 20px;
  }

  .timeline-item {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .timeline-year {
    text-align: left;
    padding-left: 40px;
  }

  .timeline-year::after {
    left: 14px;
    right: auto;
  }
}
</style>
