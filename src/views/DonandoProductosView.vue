<script setup>
import { RouterLink } from 'vue-router'

const categories = [
  {
    title: 'Maquinaria y Herramientas',
    items: ['Tornos y fresadoras', 'Equipos de soldadura', 'Herramienta manual', 'Maquinaria de hostelería'],
    icon: 'construction'
  },
  {
    title: 'Informática y Tecnología',
    items: ['Ordenadores y portátiles', 'Impresoras y escáneres', 'Componentes de red', 'Software con licencia'],
    icon: 'computer'
  },
  {
    title: 'Mobiliario y Otros',
    items: ['Mesas y sillas de oficina', 'Estanterías industriales', 'Vehículos comerciales', 'Excedentes de stock'],
    icon: 'inventory'
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
            <span class="current">Donando productos</span>
          </nav>
          <h1 class="page-title headline-xl">Donando productos y servicios</h1>
          <p class="page-subtitle body-lg">
            Da una segunda vida a tus activos ayudando en la formación de futuros profesionales.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <div class="intro-text mb-xl">
          <h2>Economía circular con impacto social</h2>
          <p class="body-lg text-muted">
            Muchas empresas renuevan sus equipos cuando todavía tienen una vida útil valiosa para la enseñanza. Tus donaciones nos permiten mantener nuestros talleres a la vanguardia tecnológica.
          </p>
        </div>

        <div class="categories-grid">
          <div v-for="cat in categories" :key="cat.title" class="category-card card p-lg">
            <div class="d-flex align-center gap-md mb-md">
              <span class="material-symbols-outlined text-primary display-sm">{{ cat.icon }}</span>
              <h3>{{ cat.title }}</h3>
            </div>
            <ul class="item-list">
              <li v-for="item in cat.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>

        <div class="process-section mt-xl">
          <h3 class="text-center mb-lg">¿Cómo es el proceso?</h3>
          <div class="steps-grid">
            <div class="step">
              <span class="step-num">1</span>
              <h4>Contacto</h4>
              <p class="body-sm">Cuéntanos qué quieres donar y su estado.</p>
            </div>
            <div class="step">
              <span class="step-num">2</span>
              <h4>Valoración</h4>
              <p class="body-sm">Nuestro equipo técnico evalúa la utilidad pedagógica.</p>
            </div>
            <div class="step">
              <span class="step-num">3</span>
              <h4>Recogida</h4>
              <p class="body-sm">Coordinamos la logística para retirar el material.</p>
            </div>
            <div class="step">
              <span class="step-num">4</span>
              <h4>Certificación</h4>
              <p class="body-sm">Emitimos el certificado de donación para deducción fiscal.</p>
            </div>
          </div>
        </div>

        <div class="actions mt-xl text-center">
          <RouterLink to="/contacto" class="btn btn-primary btn-lg">Tengo material para donar</RouterLink>
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
.mb-xl { margin-bottom: var(--space-xl); }
.mt-xl { margin-top: var(--space-xl); }
.p-lg { padding: var(--space-lg); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }
.text-primary { color: var(--color-primary); }
.display-sm { font-size: 32px; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.gap-md { gap: var(--space-md); }

.categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.item-list { list-style: none; padding-left: 0; }
.item-list li { padding: 4px 0; border-bottom: 1px solid var(--color-outline-variant); color: var(--color-on-surface-variant); font-size: 0.9rem; }
.item-list li:last-child { border-bottom: none; }

.steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); }
.step { text-align: center; position: relative; }
.step-num { width: 32px; height: 32px; background: var(--color-primary); color: white; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: var(--space-sm); }

@media (max-width: 992px) {
  .categories-grid { grid-template-columns: 1fr; }
  .steps-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
