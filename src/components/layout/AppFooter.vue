<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const currentYear = new Date().getFullYear()

// Initialize Google Translate in footer
onMounted(() => {
  initializeFooterGoogleTranslate();
});

function initializeFooterGoogleTranslate() {
  // Check if Google Translate script is already loaded
  if (window.google && window.google.translate) {
    createFooterGoogleTranslateWidget();
  } else {
    // If script exists but not loaded yet, wait for it
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.translate) {
          createFooterGoogleTranslateWidget();
          clearInterval(checkInterval);
        }
      }, 200);
      setTimeout(() => clearInterval(checkInterval), 5000);
    } else {
      // Load Google Translate script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInitFooter';
      script.async = true;
      document.head.appendChild(script);

      window.googleTranslateElementInitFooter = function () {
        createFooterGoogleTranslateWidget();
      };
    }
  }
}

function createFooterGoogleTranslateWidget() {
  if (!window.google || !window.google.translate) {
    return;
  }

  const translateElement = document.getElementById('footer-google-translate-element');
  if (!translateElement) {
    return;
  }

  // Clear any existing content
  translateElement.innerHTML = '';

  // Initialize Google Translate
  new window.google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'en,fr,eu,ar',
    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    autoDisplay: false,
    multilanguagePage: true
  }, 'footer-google-translate-element');

  // Style the Google Translate widget
  setTimeout(() => {
    const select = document.querySelector('#footer-google-translate-element select');
    if (select) {
      select.style.width = '100%';
      select.style.maxWidth = '300px';
      select.style.padding = '12px 16px';
      select.style.borderRadius = 'var(--radius-default)';
      select.style.border = '2px solid var(--color-outline-variant)';
      select.style.background = 'var(--color-surface-container-low)';
      select.style.color = 'var(--color-on-surface)';
      select.style.fontFamily = 'var(--font-family)';
      select.style.fontSize = 'var(--body-md-size)';
    }
  }, 200);
}

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
          Somos una entidad de iniciativa social, sin ánimo de lucro y declarada de utilidad pública desde 1986.
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
            RECURSOS
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
            INSTITUCIONAL
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

      <!-- Google Translate Section -->
      <div class="footer-translate-section">
        <h4 class="footer-translate-title">Traducir página</h4>
        <p class="footer-translate-description">
          ¿Eres de otro país o no encuentras tu idioma? Puedes usar Google Translate para traducir esta página a cualquier idioma del mundo.
        </p>
        <div id="footer-google-translate-element" class="footer-google-translate-wrapper"></div>
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
          <RouterLink to="/equipo" class="tuani-link">Tuani Coders</RouterLink>
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
  color: rgba(255, 255, 255, 0.78);
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

/* ── Google Translate Section ─────────────────── */
.footer-translate-section {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 1.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 2rem;
}

.footer-translate-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 0.75rem;
}

.footer-translate-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 1rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.footer-google-translate-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

#footer-google-translate-element {
  display: inline-block;
}

#footer-google-translate-element select {
  padding: 12px 16px;
  border-radius: var(--radius-default);
  border: 2px solid var(--color-outline-variant);
  background: var(--color-surface-container-low);
  color: var(--color-on-surface);
  font-family: var(--font-family);
  font-size: var(--body-md-size);
  min-width: 200px;
  max-width: 300px;
  width: 100%;
  transition: all var(--transition-base);
}

#footer-google-translate-element select:focus {
  outline: none;
  border-color: var(--color-secondary);
  background: #ffffff;
}

#footer-google-translate-element .goog-te-combo {
  width: 100% !important;
  max-width: 300px !important;
  padding: 12px 16px !important;
  border-radius: var(--radius-default) !important;
  border: 2px solid var(--color-outline-variant) !important;
  background: var(--color-surface-container-low) !important;
  color: var(--color-on-surface) !important;
  font-family: var(--font-family) !important;
  font-size: var(--body-md-size) !important;
  transition: all var(--transition-base) !important;
}

#footer-google-translate-element .goog-te-combo:focus {
  outline: none !important;
  border-color: var(--color-secondary) !important;
  background: #ffffff !important;
}

/* Hide Google Translate banner in footer */
.footer-translate-section + .goog-te-banner-frame {
  display: none !important;
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
