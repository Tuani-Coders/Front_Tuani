<script setup>
import { RouterLink } from 'vue-router'

const services = [
  {
    title: 'Formación Profesional',
    desc: 'Capacitación técnica de alta calidad adaptada a las necesidades reales del mercado laboral actual.',
    icon: 'school',
    link: '/formacion-profesional'
  },
  {
    title: 'Búsqueda de Empleo',
    desc: 'Orientación personalizada y herramientas para tu inserción en el mundo laboral.',
    icon: 'person_search',
    link: '/la-cooperativa/servicio-de-orientacion'
  },
  {
    title: 'Empresas de Inserción',
    desc: 'Unidades de producción real para el aprendizaje práctico en entornos profesionales.',
    icon: 'business_center',
    link: '/la-cooperativa/cooperan-con-nosotros'
  },
  {
    title: 'Intervención Social',
    desc: 'Acompañamiento integral para colectivos en situación de vulnerabilidad.',
    icon: 'diversity_1',
    link: '/la-cooperativa/que-hacemos'
  }
]

const news = [
  {
    title: 'Nueva convocatoria de cursos 2024',
    desc: 'Abrimos el plazo de inscripción para los nuevos módulos de automoción y hostelería.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Acuerdo con empresas locales',
    desc: 'Fortalecemos nuestra red de empresas colaboradoras para las prácticas del alumnado.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Historias de inserción laboral',
    desc: 'Entrevistamos a antiguos alumnos que hoy lideran sus propios proyectos.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'
  }
]
</script>

<template>
  <div class="home-view view">
    <!-- Hero Section: Grounded & Minimalist -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="headline-xl">Compromiso social y arraigo.</h1>
          <p class="body-lg text-muted">
            Trabajamos para generar oportunidades reales de inclusión social y laboral en nuestra comunidad.
          </p>
        </div>
      </div>
    </section>

    <!-- Services Grid: Structural Sturdiness -->
    <section class="section bg-surface services-section">
      <div class="container">
        <div class="services-grid">
          <RouterLink 
            v-for="service in services" 
            :key="service.title" 
            :to="service.link"
            class="service-card card"
          >
            <div class="card-icon">
              <span class="material-symbols-outlined">{{ service.icon }}</span>
            </div>
            <h3 class="headline-md">{{ service.title }}</h3>
            <p class="body-md text-muted">{{ service.desc }}</p>
          </RouterLink>
        </div>
        <div class="text-right mt-lg">
          <RouterLink to="/la-cooperativa/que-hacemos" class="btn-text">
            Ver todas <span class="material-symbols-outlined">chevron_right</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- News Section: Modern Tactile -->
    <section class="section news-section">
      <div class="container">
        <div class="news-grid">
          <div v-for="item in news" :key="item.title" class="news-item">
            <div class="news-image">
              <img :src="item.image" :alt="item.title" loading="lazy">
            </div>
            <div class="news-content">
              <h4 class="label-lg">ACTUALIDAD</h4>
              <h3 class="headline-md">{{ item.title }}</h3>
              <p class="body-md text-muted">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA: Institutional Strength -->
    <section class="section cta-section bg-primary text-white">
      <div class="container text-center">
        <p class="body-lg mb-md">
          Nuestro equipo está preparado para asesorarte en tu camino hacia el empleo o para colaborar con tu empresa.
        </p>
        <RouterLink to="/contacto" class="btn btn-secondary btn-lg">Contactar ahora</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  background-color: var(--color-surface);
}

/* ── Hero ─────────────────────────────────────── */
.hero-section {
  padding: 120px 0 80px;
  background-color: var(--color-surface);
  border-bottom: 2px solid var(--color-outline-variant);
}

.hero-content {
  max-width: 800px;
}

.hero-content h1 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  letter-spacing: -0.02em;
}

.hero-content p {
  font-size: 20px;
  line-height: 1.5;
  color: var(--color-on-surface-variant);
}

/* ── Services ─────────────────────────────────── */
.services-section {
  padding: 80px 0;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2px; /* For a 'built' feel with borders */
  background-color: var(--color-outline-variant);
  border: 2px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  overflow: hidden;
}

.service-card {
  background-color: var(--color-surface);
  padding: var(--space-lg);
  text-decoration: none;
  transition: background-color var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.service-card:hover {
  background-color: var(--color-surface-container-low);
}

.card-icon {
  color: var(--color-secondary);
}

.card-icon .material-symbols-outlined {
  font-size: 32px;
}

.service-card h3 {
  color: var(--color-on-surface);
}

.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-secondary);
  font-weight: 700;
  text-decoration: none;
}

/* ── News ─────────────────────────────────────── */
.news-section {
  padding: 80px 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

.news-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.news-image {
  aspect-ratio: 16/9;
  border-radius: var(--radius-default);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.news-item:hover img {
  transform: scale(1.05);
}

.news-content h4 {
  color: var(--color-secondary);
  margin-bottom: 4px;
}

.news-content h3 {
  margin-bottom: 8px;
  line-height: 1.2;
}

/* ── CTA ──────────────────────────────────────── */
.cta-section {
  padding: 100px 0;
}

.text-white {
  color: white;
}

.mb-md { margin-bottom: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.text-right { text-align: right; }
.text-center { text-align: center; }

/* ── Responsive ───────────────────────────────── */
@media (max-width: 992px) {
  .news-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
  .hero-section { padding: 100px 0 60px; }
}
</style>
