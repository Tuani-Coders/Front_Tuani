<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useContent } from '@/composables/useContent'

const { newsList, newsLoading, fetchPublishedNews } = useContent()

onMounted(() => {
  fetchPublishedNews()
})

const categories = [
  { id: 'all', label: 'Todas', icon: 'apps' },
  { id: 'formacion', label: 'Formación', icon: 'school' },
  { id: 'empresas', label: 'Empresas', icon: 'business' },
  { id: 'institucional', label: 'Institucional', icon: 'corporate_fare' }
]

const activeCategory = ref('all')

const publishedNews = computed(() => {
  return newsList.value.filter(n => n.status === 'Publicado')
})

const filteredNews = computed(() => {
  if (activeCategory.value === 'all') return publishedNews.value
  return publishedNews.value.filter(item => 
    item.tag && item.tag.toLowerCase() === activeCategory.value
  )
})
</script>

<template>
  <div class="noticias-view view">
    <!-- Header -->
    <header class="page-header">
      <div class="container">
        <div class="page-header-content">
          <nav class="breadcrumb mb-sm">
            <RouterLink to="/" class="link">Inicio</RouterLink>
            <span class="separator">/</span>
            <span class="current">Noticias</span>
          </nav>
          <h1 class="page-title headline-xl">Noticias</h1>
          <p class="page-subtitle body-lg">
            Mantente al día de todas las novedades, cursos, convenios y la actividad institucional del Grupo Peñascal.
          </p>
        </div>
      </div>
    </header>

    <section class="section">
      <div class="container">
        <!-- Filtros -->
        <div class="filters-bar">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="filter-btn"
            :class="{ 'active': cat.id === activeCategory }"
            @click="activeCategory = cat.id"
          >
            <span class="material-symbols-outlined filter-btn-icon">{{ cat.icon }}</span>
            {{ cat.label }}
          </button>
        </div>

        <!-- Grid de Noticias -->
        <div class="news-grid">
          <RouterLink 
            v-for="item in filteredNews" 
            :key="item.id" 
            :to="'/noticias/' + item.id" 
            class="news-card card"
          >
            <div class="news-card-image">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" class="news-card-photo">
              <div class="news-card-placeholder">
                <span class="material-symbols-outlined">{{ item.image || 'school' }}</span>
              </div>
            </div>
            <div class="news-card-body">
              <div class="news-meta">
                <span class="chip" :class="item.tagClass || 'chip-green'">{{ item.tag }}</span>
                <span class="news-date caption">{{ item.date }}</span>
              </div>
              <h3 class="news-card-title">{{ item.title }}</h3>
              <p class="body-md news-card-excerpt">{{ item.excerpt }}</p>
              <div class="news-card-footer">
                <span class="btn btn-ghost news-card-link">
                  Leer artículo
                  <span class="material-symbols-outlined">arrow_forward</span>
                </span>
              </div>
            </div>
          </RouterLink>
        </div>
        
        <!-- Paginación Mock -->
        <div class="pagination">
          <button class="btn btn-secondary" disabled>Anterior</button>
          <div class="page-numbers">
            <span class="page-number active">1</span>
            <span class="page-number">2</span>
            <span class="page-number">3</span>
          </div>
          <button class="btn btn-secondary">Siguiente</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Header */
.page-header {
  background-color: var(--color-surface-container-low);
  padding: var(--space-xl) 0 var(--space-lg);
  border-bottom: 1px solid var(--color-outline-variant);
}

.page-header-content {
  max-width: 800px;
}

.mb-sm { margin-bottom: var(--space-sm); }

.page-title {
  color: var(--color-on-surface);
  margin-bottom: var(--space-md);
}

.page-subtitle {
  color: var(--color-on-surface-variant);
}

/* Filtros */
.filters-bar {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-full);
  background: var(--color-surface-container);
  color: var(--color-on-surface-variant);
  font-family: var(--font-family);
  font-size: var(--label-md-size);
  font-weight: 700;
  border: 1px solid var(--color-outline-variant);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn-icon {
  font-size: 18px;
}

.filter-btn:hover {
  background: var(--color-surface-container-highest);
  color: var(--color-on-surface);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.filter-btn.active {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(0, 52, 41, 0.15);
}

/* News Grid */
.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg) var(--space-md);
  margin-bottom: var(--space-xl);
}

.news-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  background: var(--color-surface-container-lowest);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border-color: var(--color-primary);
}

.news-card-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--color-outline-variant);
}

.news-card-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-surface-container-low);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.news-card-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.news-card-photo + .news-card-placeholder {
  display: none;
}

.news-card:hover .news-card-placeholder,
.news-card:hover .news-card-photo {
  transform: scale(1.06);
}

.news-card-placeholder .material-symbols-outlined {
  font-size: 48px;
  color: var(--color-outline);
}

.news-card-body {
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
}

.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.news-date {
  color: var(--color-outline);
  font-size: var(--body-sm-size);
}

.news-card-title {
  font-size: var(--body-lg-size);
  font-weight: 800;
  color: var(--color-on-surface);
  line-height: 1.3;
  margin-top: 4px;
  transition: color var(--transition-fast);
}

.news-card:hover .news-card-title {
  color: var(--color-primary);
}

.news-card-excerpt {
  color: var(--color-on-surface-variant);
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.news-card-footer {
  margin-top: auto;
  padding-top: var(--space-xs);
}

.news-card-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 800;
  font-size: 13px;
  transition: color var(--transition-fast);
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.news-card:hover .news-card-link {
  color: var(--color-primary-variant);
}

.news-card-link span {
  font-size: 18px;
  transition: transform var(--transition-fast);
}

.news-card:hover .news-card-link span {
  transform: translateX(4px);
}

/* Paginación */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-outline-variant);
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-default);
  font-weight: 600;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-number:hover {
  background: var(--color-surface-container);
}

.page-number.active {
  background: var(--color-primary-container);
  color: var(--color-on-primary);
}

/* Responsive */
@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-bar {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }
  
  .filter-btn {
    flex-shrink: 0;
  }
}
</style>
