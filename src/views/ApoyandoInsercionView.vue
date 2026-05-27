<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '../composables/useContent'

const { collaborationsList } = useContent()

const approvedEntities = computed(() => {
  return collaborationsList.value.filter(
    c => c.type === 'Apoyando Inserción' && c.status === 'Aprobada'
  )
})

const modalities = [
  {
    title: 'Prácticas (FCT)',
    desc: 'Acoge alumnos para sus 400 horas de prácticas obligatorias. Sin coste salarial para la empresa.',
    icon: 'school'
  },
  {
    title: 'Contrato en Alternancia',
    desc: 'Combina formación y trabajo remunerado con importantes bonificaciones en la seguridad social.',
    icon: 'history_edu'
  },
  {
    title: 'Bolsa de Empleo',
    desc: 'Publica tus ofertas y nosotros preseleccionamos a los candidatos que mejor encajan.',
    icon: 'person_search'
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
            <span class="current">Acompañando la inserción</span>
          </nav>
          <h1 class="page-title headline-xl">Apoyando la inserción laboral</h1>
          <p class="page-subtitle body-lg">
            El empleo es el motor definitivo de la inclusión social. Ayúdanos a completar el ciclo formativo.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <div class="intro-text mb-xl">
          <h2>Tu empresa como agente de cambio</h2>
          <p class="body-lg text-muted">
            La formación no es completa si no hay una oportunidad real de demostrar lo aprendido. Buscamos empresas comprometidas que quieran abrir sus puertas a nuevos talentos con ganas de trabajar.
          </p>
        </div>

        <div class="modalities-grid">
          <div v-for="mod in modalities" :key="mod.title" class="modality-card card p-lg">
            <div class="modality-header mb-md">
              <span class="material-symbols-outlined text-primary display-md">{{ mod.icon }}</span>
              <h3 class="mt-sm">{{ mod.title }}</h3>
            </div>
            <p class="body-md text-muted mb-md">{{ mod.desc }}</p>
            <RouterLink to="/contacto" class="btn btn-ghost mt-auto">Consultar condiciones</RouterLink>
          </div>
        </div>

        <div class="values-section mt-xl p-xl bg-primary-container text-white rounded-lg">
          <div class="row d-flex gap-xl align-center">
            <div class="col">
              <h3>¿Qué aportamos a tu empresa?</h3>
              <ul class="check-list-white mt-md">
                <li><strong>Acompañamiento:</strong> Seguimiento técnico durante todo el periodo de inserción.</li>
                <li><strong>Preselección:</strong> Perfiles que cumplen con tus requisitos técnicos y de actitud.</li>
                <li><strong>Asesoría:</strong> Información sobre ayudas y subvenciones por contratación social.</li>
              </ul>
            </div>
            <div class="col-visual">
              <span class="material-symbols-outlined giant-icon">handshake</span>
            </div>
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
      </div>
    </section>

    <!-- CTA -->
    <section class="section bg-primary">
      <div class="container">
        <div class="accent-card text-center">
          <h2 class="accent-card-title justify-center">
            <span class="material-symbols-outlined">business_center</span>
            ¿Quieres colaborar?
          </h2>
          <div class="accent-card-content">
            <p class="body-lg mb-md">Tu empresa puede marcar la diferencia en la vida de muchas personas.</p>
            <div class="actions justify-center">
              <RouterLink to="/contacto" class="btn cta-panel-btn">
                Quiero ser empresa colaboradora
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
.page-header { background-color: var(--color-surface-container-low); padding: var(--space-xl) 0 var(--space-lg); border-bottom: 1px solid var(--color-outline-variant); }
.page-title { color: var(--color-on-surface); margin-bottom: var(--space-md); }
.page-subtitle { color: var(--color-on-surface-variant); }
.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mb-xl { margin-bottom: var(--space-xl); }
.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-xl { margin-top: var(--space-xl); }
.mt-auto { margin-top: auto; }
.p-lg { padding: var(--space-lg); }
.p-xl { padding: var(--space-xl); }
.text-muted { color: var(--color-on-surface-variant); }
.text-white { color: white; }
.text-center { text-align: center; }
.text-primary { color: var(--color-primary); }
.display-md { font-size: 40px; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.gap-xl { gap: var(--space-xl); }
.rounded-lg { border-radius: var(--radius-lg); }

.modalities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.modality-card { display: flex; flex-direction: column; height: 100%; }

.check-list-white { list-style: none; padding-left: 0; display: flex; flex-direction: column; gap: var(--space-sm); }
.check-list-white li { position: relative; padding-left: 28px; }
.check-list-white li::before { content: "check"; font-family: 'Material Symbols Outlined'; position: absolute; left: 0; color: var(--color-primary-fixed); }

.giant-icon { font-size: 120px; opacity: 0.2; }

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

@media (max-width: 992px) {
  .modalities-grid { grid-template-columns: 1fr; }
  .row { flex-direction: column; text-align: center; }
  .col-visual { display: none; }
}
</style>
