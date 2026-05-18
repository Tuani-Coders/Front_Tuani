<script setup>
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const data = {
  'grado-basico': {
    title: 'Grado Básico',
    eyebrow: 'Itinerarios iniciales',
    btnText: 'Ver Cursos de Grado Básico',
    link: '/formacion-profesional/grado-basico',
    text: 'En el Grado Básico de Peñascal aprenderás trabajando mediante un sistema práctico basado en proyectos reales. Esta metodología fomenta la motivación profesional y te permite elegir entre entrar al mercado laboral o continuar tu formación.',
    courses: ['Agrojardinería y Composiciones Florales', 'Electricidad y Electrónica', 'Fabricación y Montaje', 'Peluquería y Estética', 'Mantenimiento de Viviendas']
  },
  'grado-medio': {
    title: 'Grado Medio',
    eyebrow: 'Titulación técnica',
    btnText: 'Ver Cursos de Grado Medio',
    link: '/formacion-profesional/grado-medio',
    text: 'El Grado Medio ofrece una titulación técnica mediante un sistema educativo práctico que te acredita como experto en tu especialidad. Nuestra formación está plenamente orientada al empleo, logrando altísimas tasas de inserción laboral.',
    courses: ['Gestión Administrativa', 'Instalaciones Eléctricas y Automáticas', 'Mecanizado', 'Soldadura y Calderería', 'Cuidados Auxiliares de Enfermería']
  },
  'fp': {
    title: 'Formación Profesional',
    eyebrow: 'Aprender trabajando',
    btnText: 'Ver Formación',
    link: '/formacion-profesional',
    text: 'Bajo el lema "Aprender Trabajando", nuestra FP combina pedagogía innovadora con una sólida formación humana y técnica. La formación dual y las prácticas en empresas reales te brindan una experiencia inmejorable.',
    courses: ['Administración y Finanzas', 'Mecatrónica Industrial', 'Programación de la Producción en Fabricación Mecánica', 'Integración Social']
  },
  'empleo': {
    title: 'Formación para el empleo',
    eyebrow: 'Activación sociolaboral',
    btnText: 'Ver Formación',
    link: '/formacion-profesional/formacion-para-el-empleo',
    text: 'Ofrecemos cursos para personas ocupadas y desempleadas que buscan una verdadera activación sociolaboral mediante una metodología práctica. Nuestras instalaciones replican fielmente la maquinaria de las empresas.',
    courses: ['Certificado de Profesionalidad en Soldadura', 'Operaciones Auxiliares de Almacén', 'Limpieza de Superficies y Mobiliario', 'Atención Sociosanitaria']
  }
}

const activeKey = ref('grado-basico')
const selectedKey = ref('grado-basico')
const currentContent = ref({
  title: data['grado-basico'].title,
  eyebrow: data['grado-basico'].eyebrow,
  text: data['grado-basico'].text,
  btnText: data['grado-basico'].btnText,
  link: data['grado-basico'].link,
  showBtn: true
})
const isSliding = ref(false)
let slideTimeoutId = null

const updateContent = (key) => {
  window.clearTimeout(slideTimeoutId)
  isSliding.value = true
  
  slideTimeoutId = window.setTimeout(() => {
    const content = data[key]
    currentContent.value = {
      title: content.title,
      eyebrow: content.eyebrow,
      text: content.text,
      btnText: content.btnText,
      link: content.link,
      showBtn: true
    }
    
    selectedKey.value = key
    activeKey.value = key
    isSliding.value = false
  }, 400)
}

onUnmounted(() => {
  window.clearTimeout(slideTimeoutId)
})
</script>

<template>
  <section class="oferta-formativa section">
    <div class="container">
      <header class="section-header">
        <div class="section-heading">
          <h2 class="headline-xl">Formación y empleo</h2>
          <p class="body-lg">
            Elige un itinerario y descubre cómo acompañamos cada proceso con aprendizaje práctico, orientación y conexión con empresas.
          </p>
        </div>
      </header>
      
      <div class="nav-buttons">
        <div class="nav-item">
          <button 
            class="main-btn" 
            :class="{ active: activeKey === 'grado-basico' }"
            type="button"
            @click="updateContent('grado-basico')"
          >
            Grado Básico
          </button>
        </div>
        <div class="nav-item">
          <button 
            class="main-btn" 
            :class="{ active: activeKey === 'grado-medio' }"
            type="button"
            @click="updateContent('grado-medio')"
          >
            Grado Medio
          </button>
        </div>
        <div class="nav-item">
          <button 
            class="main-btn" 
            :class="{ active: activeKey === 'fp' }"
            type="button"
            @click="updateContent('fp')"
          >
            Formación Profesional
          </button>
        </div>
        <div class="nav-item">
          <button 
            class="main-btn" 
            :class="{ active: activeKey === 'empleo' }"
            type="button"
            @click="updateContent('empleo')"
          >
            Formación para el empleo
          </button>
        </div>
      </div>

      <div class="display-card" :class="{ sliding: isSliding }">
        <div class="image-container">
          <span class="image-label">Formación</span>
          <div class="image-placeholder"></div>
        </div>
        <div class="info-content">
          <span class="content-kicker">{{ currentContent.eyebrow }}</span>
          <h2 class="title-line">{{ currentContent.title }}</h2>
          <p class="description-text">
            {{ currentContent.text }}
          </p>
          <ul class="course-list" v-if="selectedKey">
            <li v-for="course in data[selectedKey].courses" :key="course">
              {{ course }}
            </li>
          </ul>
          <div class="cta-container" v-if="currentContent.showBtn">
            <RouterLink class="cta-button" :to="currentContent.link">
              {{ currentContent.btnText }}
              <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.oferta-formativa {
  background-color: var(--color-surface);
  padding: 72px 0 88px;
  border-bottom: 2px solid var(--color-outline-variant);
}

.section-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--space-lg);
}

.content-kicker {
  color: var(--color-secondary);
  font-size: 13px;
  font-weight: 800;
  line-height: 20px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-heading {
  max-width: 820px;
}

.section-heading h2 {
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

.section-heading p {
  color: var(--color-on-surface-variant);
}

.nav-buttons {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
  overflow: visible;
}

.nav-item {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
}

.main-btn {
  min-height: 72px;
  background: white;
  border: 1px solid var(--color-outline-variant);
  color: var(--color-primary);
  padding: 16px 24px;
  border-radius: var(--radius-lg);
  font-size: var(--label-lg-size);
  font-weight: 800;
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: center;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: var(--shadow-md);
}

.main-btn.active {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.main-btn:hover:not(.active) {
  background: white;
  color: var(--color-secondary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}


.display-card {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1fr);
  gap: 2px;
  background: var(--color-outline-variant);
  border: 2px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.display-card.sliding {
  opacity: 0;
  transform: translateX(24px);
}

.image-container {
  min-height: 430px;
  background: var(--color-surface-container);
  position: relative;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/oferta-formativa.png');
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
}

.display-card:hover .image-placeholder {
  transform: scale(1.05);
}

.image-label {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
  color: white;
  background: rgba(0, 52, 41, 0.82);
  border-left: 4px solid var(--color-secondary);
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 1;
}

.info-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 430px;
  background: var(--color-surface-container-lowest);
  padding: clamp(28px, 4vw, 56px);
}

.title-line {
  color: var(--color-primary);
  margin: 6px 0 var(--space-md);
}

.description-text {
  color: var(--color-on-surface-variant);
  font-size: var(--body-lg-size);
  line-height: var(--body-lg-line-height);
  margin-bottom: var(--space-md);
}

.course-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  margin-bottom: var(--space-lg);
  color: var(--color-on-surface);
}

.course-list li {
  position: relative;
  padding-left: 18px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
}

.course-list li::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 0;
  width: 7px;
  height: 7px;
  background: var(--color-secondary);
  border-radius: 2px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--color-secondary);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: var(--radius-default);
  font-weight: 700;
  font-size: var(--label-lg-size);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: var(--label-lg-tracking);
}

.cta-button:hover {
  background: var(--color-on-secondary-container);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.cta-button .material-symbols-outlined {
  font-size: 20px;
}

@media (max-width: 768px) {
  .oferta-formativa {
    padding: 48px 0;
  }

  .section-header {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .nav-buttons {
    grid-template-columns: 1fr;
    gap: 12px;
    background: transparent;
    border: 0;
  }

  .main-btn {
    border: 1px solid var(--color-outline-variant);
    border-radius: var(--radius-default);
    min-height: 56px;
  }

  .display-card {
    grid-template-columns: 1fr;
  }

  .image-container,
  .info-content {
    min-height: auto;
  }

  .image-container {
    aspect-ratio: 4 / 3;
  }

  .course-list {
    grid-template-columns: 1fr;
  }
}
</style>
