<script setup>
import { RouterLink } from 'vue-router';

const currentYear = new Date().getFullYear()

const resourceLinks = [
  { label: 'Formación', to: '/formacion-profesional' },
  { label: 'Empleo', to: '/la-cooperativa/servicio-de-orientacion' },
  { label: 'Empresas', to: '/la-cooperativa/cooperan-con-nosotros' }
]

const institutionalLinks = [
  { label: 'Transparencia', to: '/la-cooperativa' },
  { label: 'Equipo', to: '/la-cooperativa' },
  { label: 'Noticias', to: '/noticias' }
]
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <div class="footer-grid">
        <!-- Branding -->
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo">
            <img src="../../assets/icons/penascal.png" alt="Grupo Peñascal Logo" class="footer-logo-img">
          </RouterLink>
          <p class="brand-desc body-md">
            Somos una entidad de iniciativa social, sin ánimo de lucro y declarada de utilidad pública desde 1986.
          </p>
        </div>

        <!-- Links: Recursos -->
        <div class="footer-nav">
          <h4 class="label-lg">RECURSOS</h4>
          <ul class="footer-links">
            <li v-for="link in resourceLinks" :key="link.label">
              <RouterLink :to="link.to">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Links: Institucional -->
        <div class="footer-nav">
          <h4 class="label-lg">INSTITUCIONAL</h4>
          <ul class="footer-links">
            <li v-for="link in institutionalLinks" :key="link.label">
              <RouterLink :to="link.to">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>

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

      <div class="footer-bottom">
        <div class="legal-links">
          <RouterLink to="/">Aviso Legal</RouterLink>
          <RouterLink to="/">Política de Privacidad</RouterLink>
          <RouterLink to="/">Cookies</RouterLink>
        </div>
        <p class="copyright caption">
          &copy; {{ currentYear }} Grupo Peñascal Kooperatiba. Todos los derechos reservados.
        </p>
        <p class="made-by caption">
          Este sitio web ha sido creado por
          <RouterLink to="/creditos" class="tuani-link">Tuani Coders</RouterLink>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--color-primary);
  color: white;
  padding: 80px 0 40px;
  border-top: 4px solid var(--color-secondary);
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1.4fr) minmax(140px, 0.8fr) minmax(150px, 0.9fr) minmax(260px, 1.3fr);
  gap: var(--space-lg);
  margin-bottom: 60px;
  align-items: start;
}

/* ── Brand ────────────────────────────────────── */
.footer-logo {
  display: block;
  margin-bottom: var(--space-md);
}

.footer-logo-img {
  height: 60px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.brand-desc {
  color: rgba(255, 255, 255, 0.78);
  max-width: 300px;
}

/* ── Navs ─────────────────────────────────────── */
.footer-nav h4,
.footer-contact h4 {
  color: var(--color-on-primary-container);
  margin-bottom: var(--space-md);
  font-size: var(--label-lg-size);
  font-weight: var(--label-lg-weight);
  line-height: var(--label-lg-line-height);
  letter-spacing: var(--label-lg-tracking);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color var(--transition-base);
}

.footer-links a:hover {
  color: white;
  text-decoration: underline;
}

/* ── Contact ──────────────────────────────────── */
.contact-info {
  list-style: none;
  padding: 0;
}

.contact-info li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.8);
}

.contact-info .material-symbols-outlined {
  color: var(--color-on-primary-container);
  font-size: 20px;
}

.contact-info a {
  color: inherit;
  text-decoration: none;
  transition: color var(--transition-base);
}

.contact-info a:hover {
  color: white;
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  text-decoration: none;
}

.legal-links a:hover {
  color: white;
}

.copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  line-height: 20px;
}

.made-by {
  color: rgba(255, 255, 255, 0.6);
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
  color: white;
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
