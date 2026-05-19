<script setup>
import DashboardShell from '../../components/dashboard/DashboardShell.vue'
import MetricCard from '../../components/dashboard/MetricCard.vue'

const metrics = [
  { label: 'Noticias publicadas', value: '24', trend: '+3 este mes', helper: '6 en portada', icon: 'newspaper', tone: 'green' },
  { label: 'Solicitudes pendientes', value: '8', trend: '4 requieren revisión', helper: 'Tiempo medio 1 día', icon: 'pending_actions', tone: 'red' },
  { label: 'Cursos activos', value: '16', trend: '2 empiezan pronto', helper: '3 plazas abiertas', icon: 'school', tone: 'stone' },
  { label: 'Contactos recibidos', value: '142', trend: '+18% semanal', helper: '32 sin responder', icon: 'forum', tone: 'green' }
]

const tasks = [
  { title: 'Revisar inscripciones de Formación para el Empleo', area: 'Formación', status: 'Alta', due: 'Hoy' },
  { title: 'Actualizar portada de la noticia sobre cooperativas', area: 'Noticias', status: 'Media', due: 'Mañana' },
  { title: 'Responder mensajes del formulario de contacto', area: 'Contacto', status: 'Alta', due: 'Hoy' },
  { title: 'Validar logos de entidades colaboradoras', area: 'Colabora', status: 'Baja', due: 'Viernes' }
]

const activity = [
  { time: '09:20', text: 'Nueva solicitud recibida desde Contacto' },
  { time: '10:05', text: 'Borrador de noticia guardado' },
  { time: '11:30', text: 'Curso de Grado Medio actualizado' },
  { time: '13:10', text: 'Usuario admin inició sesión' }
]

const contentModules = [
  { label: 'Noticias', value: '7 borradores', icon: 'article', tone: 'red' },
  { label: 'Formación', value: '3 fichas por revisar', icon: 'cast_for_education', tone: 'green' },
  { label: 'Colabora', value: '5 entidades pendientes', icon: 'handshake', tone: 'stone' }
]
</script>

<template>
  <DashboardShell>
    <section class="dashboard-hero">
      <div class="hero-copy">
        <p class="hero-kicker">Centro de mando</p>
        <h2>Gestiona contenido, solicitudes y actividad de la web desde un panel limpio.</h2>
        <p class="hero-text">La estructura queda preparada para conectar datos reales del backend por módulos.</p>
      </div>
      <div class="hero-actions">
        <RouterLink to="/" class="secondary-button">
          <span class="material-symbols-outlined">visibility</span>
          Ver web
        </RouterLink>
        <button class="dark-button" type="button">
          <span class="material-symbols-outlined">edit_square</span>
          Crear contenido
        </button>
      </div>
      <div class="hero-status-card">
        <span>Estado general</span>
        <strong>86%</strong>
        <div class="progress-track">
          <i></i>
        </div>
        <small>Contenido actualizado esta semana</small>
      </div>
    </section>

    <section class="metrics-grid" aria-label="Métricas principales">
      <MetricCard
        v-for="metric in metrics"
        :key="metric.label"
        v-bind="metric"
      />
    </section>

    <section class="dashboard-grid">
      <article class="work-panel">
        <div class="panel-header">
          <div>
            <p class="section-label">Trabajo pendiente</p>
            <h3>Prioridades de hoy</h3>
          </div>
          <button class="panel-icon-button" type="button" aria-label="Filtrar tareas">
            <span class="material-symbols-outlined">tune</span>
          </button>
        </div>

        <div class="task-list">
          <div v-for="task in tasks" :key="task.title" class="task-row">
            <span class="task-marker" :class="`task-marker--${task.status.toLowerCase()}`"></span>
            <div>
              <strong>{{ task.title }}</strong>
              <span>{{ task.area }}</span>
            </div>
            <div class="task-meta">
              <small>{{ task.status }}</small>
              <time>{{ task.due }}</time>
            </div>
          </div>
        </div>
      </article>

      <aside class="side-stack">
        <article class="modules-panel">
          <div class="panel-header compact">
            <div>
              <p class="section-label">Módulos</p>
              <h3>Áreas editables</h3>
            </div>
          </div>

          <div class="module-list">
            <button
              v-for="module in contentModules"
              :key="module.label"
              class="module-card"
              :class="`module-card--${module.tone}`"
              type="button"
            >
              <span class="material-symbols-outlined">{{ module.icon }}</span>
              <strong>{{ module.label }}</strong>
              <small>{{ module.value }}</small>
            </button>
          </div>
        </article>

        <article class="activity-panel">
        <div class="panel-header">
          <div>
            <p class="section-label">Actividad</p>
            <h3>Últimos movimientos</h3>
          </div>
        </div>

        <ol class="activity-list">
          <li v-for="item in activity" :key="`${item.time}-${item.text}`">
            <time>{{ item.time }}</time>
            <p>{{ item.text }}</p>
          </li>
        </ol>
        </article>
      </aside>
    </section>
  </DashboardShell>
</template>

<style scoped>
.dashboard-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 220px;
  align-items: end;
  gap: 24px;
  margin-bottom: 20px;
  padding: 28px;
  border: 1px solid rgba(0, 52, 41, 0.16);
  border-radius: var(--radius-default);
  background:
    linear-gradient(130deg, rgba(181, 36, 36, 0.82) 0%, rgba(0, 52, 41, 0.96) 43%, var(--color-primary-container) 100%);
  color: var(--color-on-primary);
  box-shadow: 0 24px 56px rgba(0, 52, 41, 0.2);
}

.dashboard-hero::after {
  content: '';
  position: absolute;
  inset: auto -80px -140px auto;
  width: 360px;
  height: 360px;
  border: 58px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
}

.hero-copy,
.hero-actions,
.hero-status-card {
  position: relative;
  z-index: 1;
}

.hero-kicker,
.section-label {
  margin-bottom: 8px;
  color: var(--color-secondary-container);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0;
}

.dashboard-hero h2 {
  max-width: 760px;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: 0;
}

.hero-text {
  max-width: 620px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 15px;
  font-weight: 650;
}

.hero-actions {
  display: grid;
  gap: 10px;
}

.secondary-button,
.dark-button,
.panel-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: var(--radius-default);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  transition: all var(--transition-base);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.28);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.24);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.dark-button {
  background: #ffffff;
  color: var(--color-primary);
  border: 1px solid #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dark-button:hover {
  background: var(--color-primary-container);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.hero-status-card {
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-default);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.hero-status-card span,
.hero-status-card small {
  display: block;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 800;
}

.hero-status-card strong {
  display: block;
  margin: 8px 0;
  color: #ffffff;
  font-size: 38px;
  line-height: 42px;
}

.progress-track {
  height: 8px;
  margin-bottom: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
}

.progress-track i {
  display: block;
  width: 86%;
  height: 100%;
  border-radius: inherit;
  background: #ffffff;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
  gap: 16px;
}

.work-panel,
.activity-panel,
.modules-panel {
  min-width: 0;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.work-panel:hover,
.activity-panel:hover,
.modules-panel:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.panel-header.compact {
  padding-bottom: 14px;
}

.section-label {
  color: var(--color-secondary);
}

.panel-header h3 {
  font-size: 20px;
  line-height: 26px;
}

.panel-icon-button {
  width: 42px;
  padding: 0;
  border: 1px solid var(--color-outline-variant);
  color: var(--color-primary);
}

.task-list {
  display: grid;
}

.task-row {
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) 86px;
  align-items: center;
  gap: 14px;
  min-height: 82px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.task-row:last-child {
  border-bottom: 0;
}

.task-marker {
  width: 10px;
  height: 42px;
  border-radius: 999px;
  background: var(--color-outline-variant);
}

.task-marker--alta {
  background: var(--color-secondary);
}

.task-marker--media {
  background: #c48a18;
}

.task-marker--baja {
  background: var(--color-primary);
}

.task-row strong,
.task-row span {
  display: block;
}

.task-row strong {
  color: var(--color-on-surface);
  font-size: 15px;
  line-height: 21px;
}

.task-row span {
  margin-top: 4px;
  color: var(--color-on-surface-variant);
  font-size: 13px;
}

.task-meta {
  display: grid;
  justify-items: end;
  gap: 5px;
}

.task-row small {
  padding: 5px 9px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-container-low);
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 800;
}

.task-meta time {
  color: var(--color-outline);
  font-size: 12px;
  font-weight: 750;
}

.side-stack {
  display: grid;
  gap: 16px;
}

.module-list {
  display: grid;
  gap: 10px;
  padding: 14px;
}

.module-card {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr);
  align-items: center;
  column-gap: 12px;
  min-height: 68px;
  padding: 12px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  background: var(--color-surface-container-low);
  text-align: left;
  transition: all var(--transition-base);
}

.module-card:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-container-lowest);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.module-card .material-symbols-outlined {
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-default);
  background: rgba(0, 52, 41, 0.1);
  color: var(--color-primary);
}

.module-card--red .material-symbols-outlined {
  background: rgba(181, 36, 36, 0.1);
  color: var(--color-secondary);
}

.module-card--stone .material-symbols-outlined {
  background: rgba(196, 138, 24, 0.12);
  color: #9a680d;
}

.module-card strong {
  color: var(--color-on-surface);
  font-size: 14px;
}

.module-card small {
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 750;
}

.activity-list {
  display: grid;
  gap: 0;
}

.activity-list li {
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.activity-list li:last-child {
  border-bottom: 0;
}

.activity-list time {
  color: var(--color-secondary);
  font-size: 13px;
  font-weight: 850;
}

.activity-list p {
  color: var(--color-on-surface-variant);
  font-size: 14px;
  line-height: 20px;
}

@media (max-width: 1180px) {
  .dashboard-hero {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
  }

  .hero-status-card {
    max-width: 320px;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .dashboard-hero {
    padding: 20px;
  }

  .dashboard-hero h2 {
    font-size: 23px;
    line-height: 30px;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .hero-status-card {
    max-width: none;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .task-row {
    grid-template-columns: 10px minmax(0, 1fr);
  }

  .task-meta {
    grid-column: 2;
    justify-items: start;
    display: flex;
  }
}
</style>
