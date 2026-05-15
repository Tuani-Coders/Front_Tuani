<script setup>
import { RouterLink } from 'vue-router'

const collabTypes = [
  {
    title: 'Prácticas (FCT)',
    desc: 'Acoge a alumnos en su fase final de formación para realizar prácticas no laborales en tu empresa.',
    icon: 'assignment_turned_in'
  },
  {
    title: 'Contratación',
    desc: 'Accede a nuestra bolsa de empleo con perfiles técnicos cualificados y acompañamiento en la inserción.',
    icon: 'handshake'
  },
  {
    title: 'Proyectos Sociales',
    desc: 'Colabora en iniciativas de Responsabilidad Social Corporativa (RSC) con impacto local directo.',
    icon: 'volunteer_activism'
  }
]
</script>

<template>
  <div class="cooperan-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <span class="chip chip-blue mb-sm">Empresas</span>
          <h1 class="page-title">Cooperan con Nosotros</h1>
          <p class="page-subtitle body-lg">
            Construimos puentes entre la formación y el mercado laboral real gracias a una red de más de 500 empresas colaboradoras.
          </p>
        </div>
      </div>
    </header>

    <!-- Propuesta de Valor -->
    <section class="section intro">
      <div class="container">
        <div class="intro-grid">
          <div class="intro-content">
            <h2>Uniendo talento y oportunidad</h2>
            <p class="body-md text-muted mb-md">
              La colaboración con el tejido empresarial es fundamental para nuestra misión. No solo proporcionamos perfiles técnicos preparados, sino que facilitamos una integración laboral exitosa y sostenible.
            </p>
            <div class="perks-grid">
              <div class="perk-card card">
                <span class="material-symbols-outlined text-primary">groups</span>
                <p class="label-md">Bolsa de empleo</p>
              </div>
              <div class="perk-card card">
                <span class="material-symbols-outlined text-primary">verified_user</span>
                <p class="label-md">Candidatos filtrados</p>
              </div>
              <div class="perk-card card">
                <span class="material-symbols-outlined text-primary">support_agent</span>
                <p class="label-md">Seguimiento técnico</p>
              </div>
            </div>
          </div>
          <div class="intro-visual">
            <div class="visual-box bg-surface-container-highest">
              <span class="material-symbols-outlined display-icon">hub</span>
              <p class="caption mt-sm">Red de Colaboración</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modalidades -->
    <section class="section bg-surface-container-low modalities">
      <div class="container">
        <div class="section-header text-center">
          <span class="section-eyebrow label-md">Cómo colaborar</span>
          <h2>Vías de cooperación</h2>
        </div>

        <div class="modalities-grid">
          <div v-for="type in collabTypes" :key="type.title" class="modality-card card">
            <div class="modality-icon">
              <span class="material-symbols-outlined">{{ type.icon }}</span>
            </div>
            <h3>{{ type.title }}</h3>
            <p class="body-md text-muted">{{ type.desc }}</p>
            <RouterLink to="/contacto" class="btn btn-ghost mt-auto">Saber más <span class="material-symbols-outlined">chevron_right</span></RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Empresas de Inserción -->
    <section class="section insertion-companies">
      <div class="container">
        <div class="insertion-card card bg-primary-container text-white">
          <div class="insertion-content">
            <h2>Nuestras Empresas de Inserción</h2>
            <p class="body-lg mb-lg">
              Son unidades productivas propias que funcionan bajo lógica de mercado pero con un fin social: proporcionar experiencia laboral real a personas en proceso de inserción.
            </p>
            <div class="sectors-grid">
              <div class="sector-item">
                <span class="material-symbols-outlined">restaurant</span>
                <span>Hostelería y Catering</span>
              </div>
              <div class="sector-item">
                <span class="material-symbols-outlined">directions_car</span>
                <span>Automoción y Talleres</span>
              </div>
              <div class="sector-item">
                <span class="material-symbols-outlined">home_repair_service</span>
                <span>Mantenimiento y Reformas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Entidades Colaboradoras -->
    <section class="section bg-surface-container-low">
      <div class="container">
        <div class="section-header text-center mb-xl">
          <h2>Entidades que hacen posible nuestro trabajo</h2>
          <p class="body-lg text-muted">Agradecemos el apoyo de las instituciones públicas y organizaciones privadas.</p>
        </div>

        <div class="entities-grid">
          <!-- Públicas -->
          <div class="entities-column">
            <h3 class="mb-lg border-bottom pb-sm">Entidades Públicas</h3>
            <ul class="entities-list">
              <li>FSE-Fondo Social Europeo (FSE+, Proyecto SENDOTU)</li>
              <li>FEDER- Fondo Europeo de Desarrollo Regional</li>
              <li>SEPE - Servicio Público de Empleo Estatal</li>
              <li>Gobierno Vasco (Empleo, Educación, Lanbide)</li>
              <li>Gobierno de Navarra (Servicio Navarro de Empleo)</li>
              <li>Diputación Foral de Bizkaia (Acción Social, Empleo)</li>
              <li>Diputación Foral de Gipuzkoa (Política Social)</li>
              <li>Ayuntamiento de Bilbao (Bilbao Ekintza, Salud, Acción Social)</li>
              <li>Ayuntamiento de Tolosa (Tolosaldea Garatzen)</li>
              <li>Mancomunidad Lea-Artibai</li>
              <li>Behargintza (Galdakao, Basauri, Txorierri, Getxolan)</li>
            </ul>
          </div>

          <!-- Privadas -->
          <div class="entities-column">
            <h3 class="mb-lg border-bottom pb-sm">Organizaciones Privadas</h3>
            <ul class="entities-list">
              <li>Obra Social BBK</li>
              <li>Fundación Bancaria "la Caixa" (Incorpora, Pobreza Infantil)</li>
              <li>Fundación Víctor Tapia y Dolores Sainz</li>
              <li>CEPES, Confederación Empresarial Española</li>
              <li>Fundación Accenture</li>
              <li>Porticus Iberia</li>
              <li>Erkide, Federación de Cooperativas</li>
              <li>ROBODK, Software de simulación</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Simple -->
    <section class="section testimonial">
      <div class="container">
        <div class="testimonial-box text-center">
          <span class="material-symbols-outlined quote-icon">format_quote</span>
          <blockquote class="headline-md">
            "Colaborar con Peñascal nos permite incorporar personal con una base técnica sólida y, sobre todo, con una actitud y compromiso excepcionales."
          </blockquote>
          <cite class="caption mt-md">— Empresa del sector Industrial (Bizkaia)</cite>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container">
        <div class="cta-box card text-center border-secondary">
          <h2 class="mb-sm">¿Tu empresa quiere sumarse?</h2>
          <p class="body-lg text-muted mb-lg">Únete a la red de empresas que apuestan por el talento local y la responsabilidad social.</p>
          <div class="cta-actions justify-center">
            <RouterLink to="/contacto" class="btn btn-primary btn-lg">Contactar con Empresas</RouterLink>
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
.mb-lg { margin-bottom: var(--space-lg); }
.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.mt-auto { margin-top: auto; }
.text-muted { color: var(--color-on-surface-variant); }
.text-primary { color: var(--color-primary-container); }
.text-white { color: white; }
.text-center { text-align: center; }
.justify-center { justify-content: center; }

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

/* Intro */
.intro-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: var(--space-xl);
  align-items: center;
}

.perks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.perk-card {
  padding: var(--space-md);
  text-align: center;
  background: var(--color-surface-container-lowest);
}

.perk-card .material-symbols-outlined {
  font-size: 28px;
  margin-bottom: 4px;
}

.visual-box {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-outline);
}

.display-icon {
  font-size: 64px;
}

/* Modalities */
.section-eyebrow {
  display: block;
  color: var(--color-primary-container);
  text-transform: uppercase;
  margin-bottom: var(--space-unit);
}

.modalities-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.modality-card {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background: var(--color-surface-container-lowest);
}

.modality-icon {
  width: 48px;
  height: 48px;
  background: var(--color-secondary-fixed);
  color: var(--color-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Insertion Companies */
.insertion-card {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
}

.insertion-card h2 { color: white; margin-bottom: var(--space-md); }

.sectors-grid {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.sector-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: var(--radius-full);
}

.sector-item .material-symbols-outlined {
  color: var(--color-primary-fixed);
}

/* Entities Section */
.entities-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
}

.entities-column h3 {
  color: var(--color-primary);
  font-size: 1.25rem;
}

.entities-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.entities-list li {
  position: relative;
  padding-left: 20px;
  font-size: 0.95rem;
  color: var(--color-on-surface-variant);
}

.entities-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-secondary);
  font-weight: bold;
}

.border-bottom { border-bottom: 2px solid var(--color-outline-variant); }
.pb-sm { padding-bottom: var(--space-sm); }
.mb-xl { margin-bottom: var(--space-xl); }

/* Testimonial */
.quote-icon {
  font-size: 48px;
  color: var(--color-outline-variant);
  margin-bottom: var(--space-sm);
}

.testimonial-box blockquote {
  max-width: 800px;
  margin: 0 auto;
  font-style: italic;
  color: var(--color-on-surface);
}

/* CTA */
.border-secondary {
  border: 1px solid var(--color-secondary);
}

.cta-box {
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
}

.cta-actions {
  display: flex;
  gap: var(--space-md);
}

.btn-lg { padding: 14px 28px; }

/* Responsive */
@media (max-width: 992px) {
  .intro-grid { grid-template-columns: 1fr; }
  .modalities-grid { grid-template-columns: 1fr; }
  .entities-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .perks-grid { grid-template-columns: 1fr; }
  .sectors-grid { flex-direction: column; gap: var(--space-sm); }
  .cta-actions { flex-direction: column; }
}
</style>
