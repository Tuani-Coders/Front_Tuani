<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacy: false
})

const submitForm = () => {
  // Mock form submission
  alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.')
  form.name = ''
  form.email = ''
  form.phone = ''
  form.subject = ''
  form.message = ''
  form.privacy = false
}

const openGoogleMaps = () => {
  window.open('https://www.google.com/maps/search/?api=1&query=43.24747658263299,-2.906910497859511', '_blank')
}
</script>

<template>
  <div class="contacto-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <span class="chip chip-blue mb-sm">Contacto</span>
          <h1 class="page-title">Hablemos</h1>
          <p class="page-subtitle body-lg">
            Estamos aquí para ayudarte. Rellena el formulario o utiliza nuestra información de contacto directa.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          
          <!-- Info Panel -->
          <div class="contact-info">
            <div class="info-card">
              <h3>Información principal</h3>
              <p class="body-md text-muted mb-md">Nuestra sede central en Bilbao.</p>
              
              <ul class="contact-list">
                <li>
                  <div class="icon-wrap">
                    <span class="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 class="label-md">Dirección</h4>
                    <p class="body-md">Barrio Peñascal, s/n. 48002 Bilbao</p>
                  </div>
                </li>
                <li>
                  <div class="icon-wrap">
                    <span class="material-symbols-outlined">phone</span>
                  </div>
                  <div>
                    <h4 class="label-md">Teléfono</h4>
                    <a href="tel:+34944430000" class="body-md link">+34 944 43 00 00</a>
                  </div>
                </li>
                <li>
                  <div class="icon-wrap">
                    <span class="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 class="label-md">Email</h4>
                    <a href="mailto:info@grupopenascal.com" class="body-md link">info@grupopenascal.com</a>
                  </div>
                </li>
                <li>
                  <div class="icon-wrap">
                    <span class="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 class="label-md">Horario</h4>
                    <p class="body-md">Lunes a Viernes: 8:00 - 15:00</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Interactive Map -->
            <div class="map-interactive card" @click="openGoogleMaps">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d11623.156550974864!2d-2.906910497859511!3d43.24747658263299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1715764000000!5m2!1ses!2ses"
                width="100%"
                height="240"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
              ></iframe>
              <div class="map-hint">
                <span class="material-symbols-outlined">open_in_new</span>
                <span class="caption">Ver en Google Maps</span>
              </div>
            </div>
          </div>

          <!-- Form Panel -->
          <div class="contact-form-panel">
            <div class="card form-card">
              <h2>Envíanos un mensaje</h2>
              <form @submit.prevent="submitForm" class="contact-form">
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="name" class="label-md">Nombre y apellidos *</label>
                    <input type="text" id="name" v-model="form.name" required class="form-control" placeholder="Tu nombre">
                  </div>
                </div>

                <div class="form-row split">
                  <div class="form-group">
                    <label for="email" class="label-md">Email *</label>
                    <input type="email" id="email" v-model="form.email" required class="form-control" placeholder="tu@email.com">
                  </div>
                  <div class="form-group">
                    <label for="phone" class="label-md">Teléfono</label>
                    <input type="tel" id="phone" v-model="form.phone" class="form-control" placeholder="Tu teléfono">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="subject" class="label-md">Asunto *</label>
                    <select id="subject" v-model="form.subject" required class="form-control">
                      <option value="" disabled>Selecciona un asunto</option>
                      <option value="formacion">Información sobre cursos</option>
                      <option value="orientacion">Servicio de orientación</option>
                      <option value="empresas">Colaboración para empresas</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="message" class="label-md">Mensaje *</label>
                    <textarea id="message" v-model="form.message" required class="form-control" rows="5" placeholder="¿En qué podemos ayudarte?"></textarea>
                  </div>
                </div>

                <div class="form-row checkbox-row">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="form.privacy" required>
                    <span class="caption">He leído y acepto la <RouterLink to="/politica-de-privacidad" class="link">Política de Privacidad</RouterLink> *</span>
                  </label>
                </div>

                <button type="submit" class="btn btn-primary btn-submit">
                  Enviar Mensaje
                  <span class="material-symbols-outlined">send</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Page Header */
.page-header {
  background-color: var(--color-surface-container-low);
  padding: var(--space-xl) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-outline-variant);
}

.page-header-content {
  max-width: 800px;
}

.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mt-sm { margin-top: var(--space-sm); }

.page-title {
  margin-bottom: var(--space-md);
  color: var(--color-on-surface);
}

.page-subtitle {
  color: var(--color-on-surface-variant);
}

.text-muted {
  color: var(--color-on-surface-variant);
}

.link {
  color: var(--color-primary-container);
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: text-decoration-color var(--transition-fast);
}

.link:hover {
  text-decoration-color: var(--color-primary-container);
}

/* Contact Grid */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-xl);
}

/* Info Panel */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.info-card {
  background: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.info-card h3 {
  color: var(--color-on-surface);
  margin-bottom: 4px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.icon-wrap {
  width: 40px;
  height: 40px;
  background: var(--color-primary-fixed);
  color: var(--color-primary-container);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-wrap .material-symbols-outlined {
  font-size: 20px;
}

.contact-list h4 {
  color: var(--color-on-surface);
  margin-bottom: 2px;
}

.contact-list p, .contact-list a {
  color: var(--color-on-surface-variant);
}

.map-interactive {
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: var(--radius-lg);
}

.map-interactive iframe {
  pointer-events: none;
}

.map-hint {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: var(--color-primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--shadow-md);
  opacity: 0.9;
}

/* Form Panel */
.form-card {
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-surface-container-lowest);
}

.form-card h2 {
  margin-bottom: var(--space-md);
  color: var(--color-on-surface);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-row {
  width: 100%;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-control {
  padding: 12px 16px;
  background: var(--color-surface-container-low);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  font-family: var(--font-family);
  font-size: var(--body-md-size);
  color: var(--color-on-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-control::placeholder {
  color: var(--color-outline);
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary-container);
  box-shadow: 0 0 0 3px var(--color-primary-fixed);
  background: var(--color-surface-container-lowest);
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.checkbox-row {
  margin-top: var(--space-sm);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  margin-top: 2px;
  accent-color: var(--color-primary-container);
}

.btn-submit {
  margin-top: var(--space-sm);
  padding: 14px 28px;
  font-size: var(--body-md-size);
  align-self: flex-start;
}

/* Responsive */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .form-card {
    padding: var(--space-lg);
  }
}

@media (max-width: 640px) {
  .split {
    grid-template-columns: 1fr;
  }
  
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
