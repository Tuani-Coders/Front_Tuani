<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="colabora-view view">
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/" class="link">Inicio</RouterLink>
            <span class="separator">/</span>
            <span class="current">Colabora</span>
          </nav>
          <h1 class="page-title headline-xl">Colabora con nosotros</h1>
          <p class="page-subtitle body-lg">
            Existen muchas formas de formar parte de la familia Peñascal. Tu apoyo es clave para seguir generando oportunidades.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <div class="colabora-grid">
          <!-- Voluntariado -->
          <div class="card colabora-card">
            <div class="icon-header bg-amber-fixed">
              <span class="material-symbols-outlined">volunteer_activism</span>
            </div>
            <div class="p-lg">
              <h3>Voluntariado</h3>
              <p class="body-md text-muted mb-md">Comparte tus conocimientos técnicos o acompaña a personas en su proceso de aprendizaje. Tu tiempo es el regalo más valioso.</p>
              <RouterLink to="/contacto" class="btn btn-secondary">Quiero ser voluntario</RouterLink>
            </div>
          </div>

          <!-- Socios/Donaciones -->
          <div class="card colabora-card">
            <div class="icon-header bg-primary-fixed">
              <span class="material-symbols-outlined">favorite</span>
            </div>
            <div class="p-lg">
              <h3>Aportaciones</h3>
              <p class="body-md text-muted mb-md">Apoya económicamente nuestros proyectos de intervención social o dona equipamiento técnico para nuestros talleres.</p>
              <RouterLink to="/contacto" class="btn btn-secondary">Hacer una aportación</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Transparencia CTA -->
    <section class="section bg-primary">
      <div class="container">
        <div class="accent-card text-center">
          <h2 class="accent-card-title justify-center">Compromiso Ético</h2>
          <div class="accent-card-content">
            <p class="body-lg mb-md">Todas las colaboraciones se gestionan bajo estrictos criterios de transparencia y ética social.</p>
            <div class="cta-actions justify-center">
              <RouterLink to="/la-cooperativa" class="btn btn-outline-white">Leer sobre transparencia <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span></RouterLink>
            </div>
          </div>
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
.mb-lg { margin-bottom: var(--space-lg); }
.mb-md { margin-bottom: var(--space-md); }
.p-lg { padding: var(--space-lg); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }

.colabora-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); }
.colabora-card { 
  height: 100%; 
  display: flex; 
  flex-direction: column; 
  box-shadow: var(--shadow-md); 
  transition: all var(--transition-base);
  overflow: hidden;
}
.colabora-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}
.icon-header { height: 120px; display: flex; align-items: center; justify-content: center; }
.icon-header .material-symbols-outlined { font-size: 48px; }

@media (max-width: 768px) {
  .colabora-grid { grid-template-columns: 1fr; }
}
</style>
