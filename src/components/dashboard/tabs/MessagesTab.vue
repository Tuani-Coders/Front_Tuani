<script setup>
import { ref, computed } from 'vue'
import { useContent } from '../../../composables/useContent'

const emit = defineEmits(['toast'])

const { messagesList } = useContent()

// --- State ---
const selectedMessageId = ref(messagesList.value[0]?.id || null)
const replyText = ref('')

// --- Computed ---
const selectedMessage = computed(() => {
  return messagesList.value.find(m => m.id === selectedMessageId.value)
})

// --- Actions ---
const toggleMessageStatus = (msg) => {
  msg.status = msg.status === 'Pendiente' ? 'Leído' : 'Pendiente'
  emit('toast', { message: `Mensaje marcado como ${msg.status.toLowerCase()}`, type: 'success' })
}

const deleteMessage = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
    const index = messagesList.value.findIndex(m => m.id === id)
    if (index !== -1) {
      messagesList.value.splice(index, 1)
      if (selectedMessageId.value === id && messagesList.value.length > 0) {
        selectedMessageId.value = messagesList.value[0].id
      } else if (messagesList.value.length === 0) {
        selectedMessageId.value = null
      }
      emit('toast', { message: 'Mensaje eliminado', type: 'error' })
    }
  }
}

const sendMockReply = () => {
  if (!replyText.value.trim()) return
  emit('toast', { message: `Respuesta enviada a ${selectedMessage.value.email} con éxito`, type: 'success' })
  replyText.value = ''
  selectedMessage.value.status = 'Leído'
}
</script>

<template>
  <div class="fade-in messages-tab-layout">
    <!-- Panel Izquierdo: Lista de Mensajes -->
    <div class="inbox-list-panel">
      <div class="inbox-header">
        <h3>Mensajes del formulario</h3>
        <span class="badge-count">{{ messagesList.length }}</span>
      </div>
      <div class="message-items">
        <div 
          v-for="msg in messagesList" 
          :key="msg.id"
          :class="['message-item-card', selectedMessageId === msg.id ? 'active' : '', msg.status === 'Pendiente' ? 'unread' : '']"
          @click="selectedMessageId = msg.id"
        >
          <div class="message-item-meta">
            <strong>{{ msg.name }}</strong>
            <time>{{ msg.date.split(' ')[0] }}</time>
          </div>
          <p class="message-item-subject">{{ msg.subject }}</p>
          <p class="message-item-excerpt">{{ msg.message.slice(0, 70) }}...</p>
          <span v-if="msg.status === 'Pendiente'" class="unread-dot"></span>
        </div>
        <div v-if="messagesList.length === 0" class="empty-inbox">
          <span class="material-symbols-outlined">drafts</span>
          No hay mensajes en la bandeja de entrada.
        </div>
      </div>
    </div>

    <!-- Panel Derecho: Detalle del Mensaje Seleccionado -->
    <div class="inbox-detail-panel">
      <div v-if="selectedMessage" class="message-detail-content">
        <div class="detail-header">
          <div>
            <h2>{{ selectedMessage.subject }}</h2>
            <div class="sender-info">
              <strong>{{ selectedMessage.name }}</strong>
              <span>&lt;{{ selectedMessage.email }}&gt;</span>
              <span v-if="selectedMessage.phone" class="phone">| Tel: {{ selectedMessage.phone }}</span>
            </div>
          </div>
          <div class="detail-actions">
            <button 
              class="secondary-button compact"
              @click="toggleMessageStatus(selectedMessage)"
            >
              <span class="material-symbols-outlined">
                {{ selectedMessage.status === 'Pendiente' ? 'mark_as_unread' : 'mark_chat_read' }}
              </span>
              {{ selectedMessage.status === 'Pendiente' ? 'Leído' : 'Pendiente' }}
            </button>
            <button 
              class="danger-button-outline"
              @click="deleteMessage(selectedMessage.id)"
            >
              <span class="material-symbols-outlined">delete</span>
              Eliminar
            </button>
          </div>
        </div>

        <div class="message-body">
          <p>{{ selectedMessage.message }}</p>
        </div>

        <!-- Formulario de Respuesta -->
        <div class="reply-section">
          <div class="reply-header">
            <span class="material-symbols-outlined">reply</span>
            <strong>Responder a {{ selectedMessage.name }}</strong>
          </div>
          <textarea 
            v-model="replyText" 
            placeholder="Escribe tu mensaje de respuesta aquí..." 
            rows="4"
            class="reply-textarea"
          ></textarea>
          <div class="reply-actions">
            <button 
              class="primary-button-accent"
              :disabled="!replyText.trim()"
              @click="sendMockReply"
            >
              Enviar Respuesta
              <span class="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-detail-state">
        <span class="material-symbols-outlined">mail_outline</span>
        Selecciona un mensaje para ver el detalle.
      </div>
    </div>
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

.messages-tab-layout {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 20px;
  min-height: calc(100vh - 200px);
}

.inbox-list-panel {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.inbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-surface-container);
  background: var(--color-surface-container-low);
}

.inbox-header h3 {
  font-size: 16px;
  font-weight: 800;
}

.badge-count {
  background: var(--color-secondary);
  color: var(--color-on-secondary);
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 999px;
}

.message-items {
  flex: 1;
  overflow-y: auto;
  max-height: 580px;
}

.message-item-card {
  position: relative;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-surface-container-low);
  cursor: pointer;
  transition: all var(--transition-base);
}

.message-item-card:hover {
  background: rgba(0, 52, 41, 0.02);
}

.message-item-card.active {
  background: rgba(0, 52, 41, 0.05);
  border-left: 4px solid var(--color-primary);
}

.message-item-card.unread {
  background: rgba(181, 36, 36, 0.02);
}

.message-item-card.unread::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 8px;
  width: 6px;
  height: 6px;
  background: var(--color-secondary);
  border-radius: 999px;
}

.message-item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.message-item-meta strong {
  font-size: 14px;
  color: var(--color-on-surface);
}

.message-item-card.unread .message-item-meta strong {
  font-weight: 800;
}

.message-item-meta time {
  font-size: 11px;
  color: var(--color-outline);
}

.message-item-subject {
  font-size: 13px;
  font-weight: 750;
  color: var(--color-on-surface);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-item-card.unread .message-item-subject {
  color: var(--color-primary);
  font-weight: 800;
}

.message-item-excerpt {
  font-size: 12px;
  color: var(--color-on-surface-variant);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-inbox {
  padding: 40px 20px;
  text-align: center;
  color: var(--color-outline);
}

.empty-inbox span {
  display: block;
  font-size: 32px;
  margin-bottom: 8px;
}

.inbox-detail-panel {
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-lg);
  background: var(--color-surface-container-lowest);
  box-shadow: var(--shadow-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.message-detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--color-surface-container);
}

.detail-header h2 {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.sender-info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  color: var(--color-on-surface-variant);
}

.sender-info strong {
  color: var(--color-on-surface);
}

.detail-actions {
  display: flex;
  gap: 8px;
}

.message-body {
  padding: 24px 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-on-surface);
  border-bottom: 1px solid var(--color-surface-container);
  white-space: pre-line;
}

.reply-section {
  margin-top: auto;
  padding-top: 20px;
  background: var(--color-surface-container-low);
  border-radius: var(--radius-default);
  padding: 16px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: var(--color-primary);
}

.reply-header span {
  font-size: 20px;
}

.reply-textarea {
  width: 100%;
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-default);
  padding: 12px;
  font-family: var(--font-family);
  font-size: 14px;
  resize: vertical;
  background: var(--color-surface-container-lowest);
  outline: 0;
  transition: border-color var(--transition-base);
}

.reply-textarea:focus {
  border-color: var(--color-primary);
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.empty-detail-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-outline);
}

.empty-detail-state span {
  font-size: 48px;
  margin-bottom: 12px;
}

.danger-button-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 18px;
  border-radius: var(--radius-default);
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  transition: all var(--transition-base);
  border: 1px solid var(--color-secondary);
  background: transparent;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
}

.danger-button-outline:hover {
  background: rgba(181, 36, 36, 0.06);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 980px) {
  .messages-tab-layout {
    grid-template-columns: 1fr;
  }
  .inbox-list-panel {
    max-height: 320px;
  }
  .message-items {
    max-height: 240px;
  }
}
</style>
