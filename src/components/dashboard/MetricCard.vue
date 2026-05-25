<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    default: ''
  },
  helper: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    default: 'green'
  }
})
</script>

<template>
  <article class="metric-card" :class="`metric-card--${tone}`">
    <div class="metric-card-top">
      <p>{{ label }}</p>
      <div class="metric-icon">
        <span class="material-symbols-outlined">{{ icon }}</span>
      </div>
    </div>

    <div class="metric-main">
      <strong>{{ value }}</strong>
      <span v-if="trend" class="metric-trend">{{ trend }}</span>
    </div>

    <div class="metric-footer">
      <span v-if="helper">{{ helper }}</span>
      <div class="sparkline" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  </article>
</template>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: 18px;
  min-height: 158px;
  padding: 20px;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.metric-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.metric-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: var(--color-primary);
}

.metric-card--red::before {
  background: var(--color-secondary);
}

.metric-card--stone::before {
  background: #c48a18;
}

.metric-card-top,
.metric-main,
.metric-footer {
  position: relative;
}

.metric-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.metric-icon {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-default);
  background: rgba(0, 52, 41, 0.1);
  color: var(--color-primary);
}

.metric-card--red .metric-icon {
  background: rgba(181, 36, 36, 0.11);
  color: var(--color-secondary);
}

.metric-card--stone .metric-icon {
  background: var(--color-surface-container);
  color: var(--color-on-surface-variant);
}

.metric-card p {
  color: var(--color-on-surface-variant);
  font-size: 13px;
  font-weight: 800;
  line-height: 18px;
}

.metric-card strong {
  display: block;
  color: var(--color-on-surface);
  font-size: 34px;
  line-height: 38px;
  letter-spacing: 0;
}

.metric-trend {
  display: block;
  margin-top: 6px;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 800;
}

.metric-card--red .metric-trend {
  color: var(--color-secondary);
}

.metric-footer {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 12px;
}

.metric-footer span {
  color: var(--color-on-surface-variant);
  font-size: 12px;
  font-weight: 700;
}

.sparkline {
  display: flex;
  align-items: end;
  gap: 3px;
  height: 26px;
}

.sparkline i {
  width: 5px;
  border-radius: 999px 999px 0 0;
  background: rgba(0, 52, 41, 0.24);
}

.metric-card--red .sparkline i {
  background: rgba(181, 36, 36, 0.24);
}

.metric-card--stone .sparkline i {
  background: rgba(196, 138, 24, 0.3);
}

.sparkline i:nth-child(1) { height: 10px; }
.sparkline i:nth-child(2) { height: 17px; }
.sparkline i:nth-child(3) { height: 13px; }
.sparkline i:nth-child(4) { height: 23px; }
.sparkline i:nth-child(5) { height: 19px; }
</style>
