<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useContent } from '@/composables/useContent'

const activeImage = ref(null)
const detailItem = ref(null)
const detailLoading = ref(false)

const route = useRoute()
const router = useRouter()
const { newsList, fetchPublishedNews, fetchNewsById } = useContent()

const loadDetail = async () => {
  const idParam = String(route.params.id)
  const cached = newsList.value.find((item) => String(item.id) === idParam)
  if (cached) {
    detailItem.value = cached
    return
  }

  detailLoading.value = true
  try {
    if (!newsList.value.length) {
      await fetchPublishedNews()
      const fromList = newsList.value.find((item) => String(item.id) === idParam)
      if (fromList) {
        detailItem.value = fromList
        return
      }
    }
    detailItem.value = await fetchNewsById(idParam)
  } catch {
    detailItem.value = null
  } finally {
    detailLoading.value = false
  }
}

onMounted(loadDetail)
watch(() => route.params.id, loadDetail)

const newsItem = computed(() => detailItem.value)

// Split content by newlines to render paragraphs nicely
const paragraphs = computed(() => {
  if (!newsItem.value || !newsItem.value.content) return []
  return newsItem.value.content.split('\n').filter(p => p.trim() !== '')
})

const goBack = () => {
  router.push('/noticias')
}
</script>

<template>
  <div class="noticia-detalle-view view fade-in">
    <div v-if="newsItem">
      <!-- Header de la Noticia -->
      <header class="page-header">
        <div class="container">
          <div class="page-header-content">
            <nav class="breadcrumb mb-sm">
              <RouterLink to="/" class="link">Inicio</RouterLink>
              <span class="separator">/</span>
              <RouterLink to="/noticias" class="link">Noticias</RouterLink>
              <span class="separator">/</span>
              <span class="current">{{ newsItem.title }}</span>
            </nav>
            
            <div class="news-meta-top mb-sm">
              <span class="chip" :class="newsItem.tagClass || 'chip-green'">{{ newsItem.tag }}</span>
              <span class="news-date caption">{{ newsItem.date }}</span>
            </div>
            
            <h1 class="page-title headline-xl">{{ newsItem.title }}</h1>
            
            <div class="news-author-row">
              <div class="author-avatar">
                <span class="material-symbols-outlined">person</span>
              </div>
              <div class="author-info">
                <span class="author-name">Por <strong>{{ newsItem.author || 'Administrador' }}</strong></span>
                <span class="author-role caption">Grupo Peñascal</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Cuerpo de la Noticia -->
      <section class="section">
        <div class="container detail-container">
          <div class="back-link-wrapper">
            <button @click="goBack" class="btn btn-ghost back-btn">
              <span class="material-symbols-outlined">arrow_back</span>
              Volver a noticias
            </button>
          </div>

          <div class="detail-grid">
            <!-- Contenido Principal -->
            <article class="news-content-card card">
              <div class="news-hero-image">
                <img v-if="newsItem.imageUrl" :src="newsItem.imageUrl" :alt="newsItem.title" class="news-photo">
                <div v-else class="news-placeholder">
                  <span class="material-symbols-outlined">{{ newsItem.image || 'school' }}</span>
                </div>
              </div>

              <div class="news-body">
                <!-- Entradilla destacada -->
                <p class="body-lg news-excerpt">{{ newsItem.excerpt }}</p>
                
                <hr class="divider">
                
                <!-- Párrafos de la noticia -->
                <div class="news-paragraphs">
                  <p v-for="(p, idx) in paragraphs" :key="idx" class="body-md paragraph">
                    {{ p }}
                  </p>
                </div>

                <!-- Galería de imágenes adicionales -->
                <div v-if="newsItem.additionalImages && newsItem.additionalImages.length > 0" class="news-gallery-section">
                  <h3 class="gallery-section-title">Galería de imágenes</h3>
                  <div class="news-gallery-grid-detail">
                    <div v-for="(img, idx) in newsItem.additionalImages" :key="idx" class="gallery-item-detail" @click="activeImage = img.url">
                      <img :src="img.url" :alt="img.name || 'Imagen adicional'" class="gallery-photo-detail">
                      <div class="gallery-overlay-detail">
                        <span class="material-symbols-outlined">zoom_in</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <!-- Sidebar Lateral Informativo -->
            <aside class="news-sidebar">
              <div class="sidebar-card card">
                <h3 class="sidebar-title">Grupo Peñascal</h3>
                <p class="body-sm sidebar-desc">
                  Somos una entidad de iniciativa social sin ánimo de lucro dedicada a la inserción social y laboral de personas en situación de vulnerabilidad.
                </p>
                <div class="sidebar-links">
                  <RouterLink to="/la-cooperativa/que-hacemos" class="link-item">
                    <span class="material-symbols-outlined">info</span>
                    ¿Qué hacemos?
                  </RouterLink>
                  <RouterLink to="/formacion-profesional" class="link-item">
                    <span class="material-symbols-outlined">school</span>
                    Nuestra oferta formativa
                  </RouterLink>
                  <RouterLink to="/contacto" class="link-item">
                    <span class="material-symbols-outlined">mail</span>
                    Contacta con nosotros
                  </RouterLink>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>

    <!-- Estado Noticia No Encontrada -->
    <div v-else class="container empty-container section text-center">
      <span class="material-symbols-outlined empty-icon">find_in_page</span>
      <h2 class="headline-md">Noticia no encontrada</h2>
      <p class="body-md mb-md">La noticia solicitada no existe o ha sido dada de baja.</p>
      <RouterLink to="/noticias" class="btn btn-primary">Volver al listado</RouterLink>
    </div>
    <!-- Lightbox Modal -->
    <Transition name="fade">
      <div v-if="activeImage" class="lightbox" @click="activeImage = null">
        <div class="lightbox-content" @click.stop>
          <img :src="activeImage" alt="Vista ampliada" class="lightbox-img">
          <button class="lightbox-close" @click="activeImage = null" title="Cerrar">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn var(--transition-base);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.page-header {
  background-color: var(--color-surface-container-low);
  padding: var(--space-xl) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-outline-variant);
}

.page-header-content {
  max-width: 900px;
}

.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }

.news-meta-top {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.news-date {
  color: var(--color-outline);
}

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
  line-height: 1.2;
}

.news-author-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: var(--space-md);
}

.author-avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary-container);
  color: var(--color-on-primary-container);
}

.author-avatar span {
  font-size: 20px;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 14px;
  color: var(--color-on-surface);
}

.author-role {
  color: var(--color-outline);
  font-size: 11px;
}

/* Cuerpo de la noticia */
.detail-container {
  max-width: 1140px;
  margin: 0 auto;
}

.back-link-wrapper {
  margin-bottom: var(--space-md);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-left: 0;
  color: var(--color-outline);
}

.back-btn:hover {
  color: var(--color-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: var(--space-lg);
  align-items: start;
}

.news-content-card {
  padding: 0;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.news-hero-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 420px;
  overflow: hidden;
  background: var(--color-surface-container-low);
  border-bottom: 1px solid var(--color-outline-variant);
}

.news-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-outline);
}

.news-placeholder span {
  font-size: 64px;
}

.news-body {
  padding: var(--space-lg);
}

.news-excerpt {
  font-weight: 700;
  line-height: 1.6;
  color: var(--color-primary);
}

.divider {
  margin: var(--space-md) 0;
  border: 0;
  border-top: 1px solid var(--color-outline-variant);
}

.news-paragraphs {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.paragraph {
  line-height: 1.7;
  color: var(--color-on-surface-variant);
  text-align: justify;
}

/* Sidebar */
.news-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.sidebar-card {
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  background: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

.sidebar-desc {
  color: var(--color-on-surface-variant);
  margin-bottom: var(--space-md);
  line-height: 1.5;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-default);
  color: var(--color-on-surface);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.link-item span {
  font-size: 18px;
  color: var(--color-primary);
}

.link-item:hover {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

/* Noticia No Encontrada */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: var(--space-sm);
}

.empty-icon {
  font-size: 64px;
  color: var(--color-outline);
}

/* Responsive */
@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* Gallery Section in Detail View */
.news-gallery-section {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-outline-variant);
}

.gallery-section-title {
  font-size: var(--body-lg-size);
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.news-gallery-grid-detail {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-md);
}

.gallery-item-detail {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-outline-variant);
  cursor: pointer;
  background: var(--color-surface-container-low);
}

.gallery-photo-detail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.gallery-item-detail:hover .gallery-photo-detail {
  transform: scale(1.05);
}

.gallery-overlay-detail {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 52, 41, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.gallery-item-detail:hover .gallery-overlay-detail {
  opacity: 1;
}

.gallery-overlay-detail span {
  color: white;
  font-size: 28px;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 85%;
}

.lightbox-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.lightbox-close span {
  font-size: 32px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .news-body {
    padding: var(--space-md);
  }
  .paragraph {
    text-align: left;
  }
}
</style>
