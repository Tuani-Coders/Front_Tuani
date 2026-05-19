<script setup>
// Página del equipo de desarrollo - Tuani Coders
</script>

<template>
  <div class="equipo-view view">
    <div class="container">
      <div class="equipo-card card">
        <h1 class="headline-lg text-center">Tuani Coders</h1>
        <p class="body-lg text-center text-muted">
          Equipo de desarrollo detrás de este proyecto
        </p>

        <div class="team-grid">
          <!-- Frontend -->
          <div class="team-section">
            <h2 class="headline-sm">Desarrollo Frontend</h2>
            <div class="team-member">
              <span class="material-symbols-outlined">code</span>
              <div class="member-info">
                <span class="label-lg">Yeremis Yesus</span>
                <span class="label-lg">Gino</span>
              </div>
            </div>
          </div>

          <!-- Backend -->
          <div class="team-section">
            <h2 class="headline-sm">Desarrollo Backend</h2>
            <div class="team-member">
              <span class="material-symbols-outlined">dns</span>
              <div class="member-info">
                <span class="label-lg">Achraf RZZ</span>
                <span class="label-lg">Luis Alfonso</span>
                <span class="label-lg">Yo Andress</span>
              </div>
            </div>
          </div>
        </div>

        <div class="equipo-footer">
          <p class="body-sm text-center text-muted">
            Proyecto desarrollado con dedicación para Peñascal Kooperatiba
          </p>
          <RouterLink to="/" class="btn btn-primary">
            Volver al inicio
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.equipo-view {
  min-height: 60vh;
  padding: var(--space-xl) var(--space-md);
  background-color: var(--color-surface);
}

.equipo-card {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-xl);
}

.equipo-card h1 {
  margin-bottom: var(--space-xs);
}

.equipo-card > p {
  margin-bottom: var(--space-xl);
}

.team-grid {
  display: grid;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.team-section {
  padding: var(--space-lg);
  background: var(--color-surface-container-low);
  border-radius: var(--radius-default);
}

.team-section h2 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--color-primary-container);
}

.team-member {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) 0;
}

.team-member .material-symbols-outlined {
  color: var(--color-primary);
  font-size: 28px;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.equipo-footer {
  text-align: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-outline-variant);
}

.equipo-footer p {
  margin-bottom: var(--space-md);
}
</style>
