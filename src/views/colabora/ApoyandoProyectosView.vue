<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '@/composables/useContent'

const { collaborationsList } = useContent()

const approvedEntities = computed(() => {
  return collaborationsList.value.filter(
    c => c.type === 'Apoyando Proyectos' && c.status === 'Aprobada'
  )
})

const projects = [
  {
    title: 'Apoyo a la Infancia',
    desc: 'Programas de refuerzo educativo y alimentación saludable para niños y niñas en riesgo de exclusión.',
    icon: 'child_care'
  },
  {
    title: 'Vivienda Social',
    desc: 'Iniciativas para facilitar el acceso a una vivienda digna y acompañamiento en la autonomía residencial.',
    icon: 'home'
  },
  {
    title: 'Brecha Digital',
    desc: 'Dotación de equipos informáticos y formación en competencias digitales básicas para familias.',
    icon: 'devices'
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
            <span class="current">Proyectos sin recursos</span>
          </nav>
          <h1 class="page-title headline-xl">Apoyando proyectos sin recursos</h1>
          <p class="page-subtitle body-lg">
            Tu solidaridad nos permite sostener iniciativas vitales que no cuentan con financiación pública suficiente.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <div class="intro-text mb-xl">
          <h2>Transformando realidades</h2>
          <p class="body-lg text-muted">
            En Peñascal creemos que nadie debe quedarse atrás. Por eso, destinamos recursos a proyectos de intervención directa que responden a necesidades urgentes de nuestra comunidad.
          </p>
        </div>

        <div class="projects-grid">
          <div v-for="project in projects" :key="project.title" class="project-card card p-lg">
            <div class="icon-circle bg-amber-fixed mb-md">
              <span class="material-symbols-outlined">{{ project.icon }}</span>
            </div>
            <h3>{{ project.title }}</h3>
            <p class="body-md text-muted">{{ project.desc }}</p>
          </div>
        </div>

        <div class="impact-box card bg-surface-container mt-xl p-xl">
          <div class="impact-content">
            <h3>¿Cómo se utiliza tu ayuda?</h3>
            <ul class="check-list mt-md">
              <li><span class="material-symbols-outlined">check</span> 100% de la donación destinada directamente al proyecto.</li>
              <li><span class="material-symbols-outlined">check</span> Seguimiento y reporte periódico de resultados.</li>
              <li><span class="material-symbols-outlined">check</span> Transparencia total avalada por auditorías externas.</li>
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
          <RouterLink to="/contacto" class="btn btn-primary btn-lg">Quiero colaborar económicamente</RouterLink>
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
.p-xl { padding: var(--space-xl); }
.text-muted { color: var(--color-on-surface-variant); }
.text-center { text-align: center; }

.projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.icon-circle { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--color-on-amber-fixed); }
.icon-circle .material-symbols-outlined { font-size: 32px; }

.check-list { list-style: none; display: flex; flex-direction: column; gap: var(--space-sm); }
.check-list li { display: flex; align-items: center; gap: var(--space-sm); color: var(--color-on-surface); }
.check-list .material-symbols-outlined { color: var(--color-primary); font-size: 20px; }

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
  .projects-grid { grid-template-columns: 1fr; }
}
</style>
