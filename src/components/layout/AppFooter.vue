<script setup>
<<<<<<< HEAD
=======
import { computed } from 'vue';
>>>>>>> f610b64b49f7ba410878bc7dbb93d6e23726a750
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const currentYear = new Date().getFullYear()

<<<<<<< HEAD
const resourceLinks = [
  { label: 'Formación', to: '/formacion-profesional' },
  { label: 'Empleo', to: '/la-cooperativa/servicio-de-orientacion' },
  { label: 'Empresas', to: '/la-cooperativa/cooperan-con-nosotros' }
]

const institutionalLinks = [
  { label: 'Transparencia', to: '/la-cooperativa' },
  { label: 'Equipo', to: '/la-cooperativa' },
  { label: 'Noticias', to: '/noticias' }
=======
const resourceLinks = computed(() => [
  { label: t('nav.training'), to: '/formacion-profesional' },
  { label: t('nav.employmentTraining'), to: '/la-cooperativa/servicio-de-orientacion' },
  { label: t('nav.partners'), to: '/la-cooperativa/cooperan-con-nosotros' }
])

const institutionalLinks = computed(() => [
  { label: t('footer.transparency'), to: '/la-cooperativa' },
  { label: t('footer.team'), to: '/la-cooperativa' },
  { label: t('nav.news'), to: '/noticias' }
])

const locations = [
  {
    name: 'BOLUETA - BILBAO',
    address: 'Ctra. Bilbao-Galdakao, 10 48004 BILBAO',
    phone: '944 029 300',
    email: 'info@grupopenascal.com',
    icon: 'location_on'
  },
  {
    name: 'SANTURTZI',
    address: 'Avda. Murrieta, 22 48980 SANTURTZI',
    phone: '944 835 158',
    email: 'santurtzi@grupopenascal.com',
    icon: 'location_on'
  },
  {
    name: 'TOLOSA - GIPUZKOA',
    address: 'Pol. Ind. Usabal, 20 20400 TOLOSA',
    phone: '943 654 444',
    email: 'gipuzkoa@grupopenascal.com',
    icon: 'location_on'
  }
>>>>>>> f610b64b49f7ba410878bc7dbb93d6e23726a750
]
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <!-- Main Footer Grid (3 flat columns matching reference style) -->
      <div class="footer-grid">
        
        <!-- Column 1: Branding & Actions -->
        <div class="footer-brand-col">
          <RouterLink to="/" class="footer-logo">
            <img src="../../assets/icons/penascal.png" alt="Grupo Peñascal Logo" class="footer-logo-img">
          </RouterLink>
          <p class="footer-slogan">Hezi landuz. Aprende trabajando.</p>
          <p class="brand-desc">
            {{ t('brand.description') }}
          </p>
          <div class="footer-actions">
            <RouterLink to="/contacto" class="btn-footer-outline">
              + información
            </RouterLink>
            <RouterLink to="/la-cooperativa" class="btn-footer-outline">
              Canal Ético
            </RouterLink>
          </div>
        </div>

        <!-- Column 2: Contacto / Enlaces -->
        <div class="footer-links-col">
          <h3 class="footer-section-title">Contacto</h3>
          
          <div class="footer-links-section">
            <h4 class="footer-subheading">{{ t('footer.resources') }}</h4>
            <ul class="footer-links-list">
              <li v-for="link in resourceLinks" :key="link.label">
                <RouterLink :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>

          <div class="footer-links-section">
            <h4 class="footer-subheading">{{ t('footer.institutional') }}</h4>
            <ul class="footer-links-list">
              <li v-for="link in institutionalLinks" :key="link.label">
                <RouterLink :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Column 3: Localización y Sedes -->
        <div class="footer-locations-col">
          <h3 class="footer-section-title">Localización</h3>
          
          <div class="locations-list">
            <div v-for="loc in locations" :key="loc.name" class="location-item">
              <h4 class="footer-subheading">{{ loc.name }}</h4>
              <p class="location-address">{{ loc.address }}</p>
              <div class="location-details">
                <span>Tel.: <a :href="'tel:' + loc.phone.replace(/\s/g, '')">{{ loc.phone }}</a></span>
                <span class="detail-separator">|</span>
                <span>Email: <a :href="'mailto:' + loc.email">{{ loc.email }}</a></span>
              </div>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <!-- Contacto -->
        <div class="footer-contact">
          <h4 class="label-lg">CONTACTO</h4>
          <ul class="contact-info">
            <li>
              <span class="material-symbols-outlined">location_on</span>
              <span>C/ Ctra. Bilbao-Galdakao, 10 48004 BILBAO</span>
            </li>
            <li>
              <span class="material-symbols-outlined">phone</span>
              <a href="tel:+34944029300">+34 944 029 300</a>
            </li>
            <li>
              <span class="material-symbols-outlined">mail</span>
              <a href="mailto:info@grupopenascal.com">info@grupopenascal.com</a>
            </li>
          </ul>
        </div>
      </div>

=======
      </div>
>>>>>>> f610b64b49f7ba410878bc7dbb93d6e23726a750

      <div class="footer-bottom">
        <div class="legal-links">
          <RouterLink to="/">{{ t('footer.legal') }}</RouterLink>
          <RouterLink to="/">{{ t('footer.privacy') }}</RouterLink>
          <RouterLink to="/">{{ t('footer.cookies') }}</RouterLink>
        </div>
        <p class="copyright caption">
          {{ t('footer.copyright', { year: currentYear }) }}
        </p>
        <p class="made-by caption">
          {{ t('footer.madeBy') }}
          <RouterLink to="/equipo" class="tuani-link">{{ t('footer.creator') }}</RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--color-primary); /* Forest Green #003429 */
  color: var(--color-on-primary);
  padding: 80px 0 40px;
  border-top: 4px solid var(--color-secondary);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.8fr;
  gap: 60px;
  margin-bottom: 60px;
}

/* ── Branding Column ── */
.footer-brand-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.footer-logo-img {
  height: 52px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.footer-slogan {
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 700;
  font-style: italic;
  color: var(--color-on-primary);
  margin-top: -8px;
  opacity: 0.9;
}

.brand-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.6;
}

.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 220px;
  margin-top: var(--space-sm);
}

.btn-footer-outline {
  display: inline-block;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: transparent;
  color: var(--color-secondary); /* Accent color */
  font-weight: 700;
  font-size: 14px;
  padding: 10px 16px;
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all 0.25s ease;
}

.btn-footer-outline:hover {
  border-color: var(--color-secondary);
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--color-on-primary);
}

/* ── Section Titles (Underlined) ── */
.footer-section-title {
  font-family: var(--font-family);
  font-size: 24px;
  font-weight: 800;
  font-style: italic;
  color: var(--color-on-primary);
  margin-bottom: 24px;
  position: relative;
  padding-bottom: 8px;
}

.footer-section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-secondary); /* Terracotta underline */
}

/* ── Subheadings ── */
.footer-subheading {
  color: var(--color-secondary); /* Terracotta */
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}

/* ── Links Column ── */
.footer-links-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.footer-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links-list a {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  text-decoration: none;
  transition: color var(--transition-base), padding-left var(--transition-base);
}

.footer-links-list a:hover {
  color: var(--color-secondary);
  padding-left: 4px;
}

/* ── Locations Column ── */
.footer-locations-col {
  display: flex;
  flex-direction: column;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.location-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.location-item .footer-subheading {
  margin-bottom: 2px;
}

.location-address {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  line-height: 1.5;
}

.location-details {
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.location-details a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: color var(--transition-base);
}

.location-details a:hover {
  color: var(--color-secondary);
}

.detail-separator {
  opacity: 0.3;
}

/* ── Bottom Section ── */
.footer-bottom {
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.legal-links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.legal-links a {
  color: var(--color-on-primary);
  opacity: 0.62;
  font-size: 13px;
  text-decoration: none;
  transition: opacity var(--transition-base);
}

.legal-links a:hover {
  opacity: 1;
}

.copyright {
  color: var(--color-on-primary);
  opacity: 0.56;
  font-size: 13px;
  line-height: 20px;
}

.made-by {
  color: var(--color-on-primary);
  opacity: 0.68;
  font-size: 13px;
  line-height: 20px;
}

.tuani-link {
  color: var(--color-secondary);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-base);
}

.tuani-link:hover {
  color: var(--color-on-primary);
  text-decoration: underline;
}

<<<<<<< HEAD
/* ── Language Switcher Section ────────────────── */
.footer-language-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 1.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.footer-language-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 0.75rem;
}

.footer-lang-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.footer-lang-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 52px;
}

.footer-lang-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

/* ── Responsive ───────────────────────────────── */
@media (max-width: 992px) {
=======
/* ── Responsive breakpoints ── */
@media (max-width: 1024px) {
>>>>>>> f610b64b49f7ba410878bc7dbb93d6e23726a750
  .footer-grid {
    grid-template-columns: 1.2fr 1fr;
    gap: 40px;
  }
  .footer-locations-col {
    grid-column: span 2;
  }
  .locations-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  .footer-locations-col {
    grid-column: span 1;
  }
  .locations-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .footer-actions {
    max-width: 100%;
  }
}

@media (max-width: 576px) {
  .app-footer {
    padding: 56px 0 32px;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  .legal-links {
    justify-content: center;
    gap: 12px 20px;
  }
}
</style>
