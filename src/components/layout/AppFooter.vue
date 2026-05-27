<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const currentYear = new Date().getFullYear()

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
]
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <!-- Branding & Desc -->
      <div class="footer-header">
        <RouterLink to="/" class="footer-logo">
          <img src="../../assets/icons/penascal.png" alt="Grupo Peñascal Logo" class="footer-logo-img">
        </RouterLink>
        <p class="brand-desc body-lg">
          {{ t('brand.description') }}
        </p>
      </div>

      <!-- Main Footer Grid (Cards) -->
      <div class="footer-grid">
        <!-- Sedes (From Reference Image) -->
        <div v-for="loc in locations" :key="loc.name" class="accent-card">
          <h4 class="accent-card-title">
            <span class="material-symbols-outlined">{{ loc.icon }}</span>
            {{ loc.name }}
          </h4>
          <div class="accent-card-content">
            <ul class="accent-card-list">
              <li>
                <span>{{ loc.address }}</span>
              </li>
              <li>
                <span class="material-symbols-outlined">phone</span>
                <a :href="'tel:' + loc.phone.replace(/\s/g, '')">{{ loc.phone }}</a>
              </li>
              <li>
                <span class="material-symbols-outlined">mail</span>
                <a :href="'mailto:' + loc.email">{{ loc.email }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Links: Recursos -->
        <div class="accent-card">
          <h4 class="accent-card-title">
            <span class="material-symbols-outlined">hub</span>
            {{ t('footer.resources') }}
          </h4>
          <div class="accent-card-content">
            <ul class="accent-card-list">
              <li v-for="link in resourceLinks" :key="link.label">
                <RouterLink :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Links: Institucional -->
        <div class="accent-card">
          <h4 class="accent-card-title">
            <span class="material-symbols-outlined">corporate_fare</span>
            {{ t('footer.institutional') }}
          </h4>
          <div class="accent-card-content">
            <ul class="accent-card-list">
              <li v-for="link in institutionalLinks" :key="link.label">
                <RouterLink :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

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
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: 80px 0 40px;
  border-top: 4px solid var(--color-secondary);
}

.footer-header {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  margin-bottom: 60px;
  align-items: stretch;
}

/* ── Brand ────────────────────────────────────── */
.footer-logo {
  display: inline-block;
}

.footer-logo-img {
  height: 60px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.brand-desc {
  color: var(--color-on-primary);
  opacity: 0.78;
  max-width: 600px;
}

/* ── Bottom ───────────────────────────────────── */
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
}

.legal-links a:hover {
  color: var(--color-on-primary);
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
  font-style: italic;
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

/* ── Responsive ───────────────────────────────── */
@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand,
  .footer-contact {
    max-width: 520px;
  }
}

@media (max-width: 576px) {
  .app-footer {
    padding: 56px 0 32px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 32px;
    margin-bottom: 40px;
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
