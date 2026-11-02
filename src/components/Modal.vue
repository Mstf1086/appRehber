<template>
  <Teleport to="body">
    <div class="modal-overlay" v-if="show" @click.self="handleOverlayClick">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? titleId : undefined"
        @keydown.esc="emit('close')"
      >
        <button class="modal-close" @click="emit('close')" aria-label="Kapat">&times;</button>

        <h3 v-if="title" :id="titleId" class="modal-title">{{ title }}</h3>

        <div class="modal-content">
          <slot></slot>
        </div>

        <div v-if="confirmText" class="modal-footer">
          <button type="button" class="modal-btn-cancel" @click="emit('close')">
            {{ cancelText }}
          </button>
          <button type="button" class="modal-btn-confirm" @click="emit('confirm')">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useId } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: 'İptal'
  }
})

const emit = defineEmits(['close', 'confirm'])
const titleId = useId()

const handleOverlayClick = () => {
  if (props.closeOnClickOutside) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  color: #333;
}

.modal-title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.modal-content {
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-btn-cancel,
.modal-btn-confirm {
  padding: 0.7rem 1.4rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.modal-btn-cancel:hover {
  background-color: #7f8c8d;
}

.modal-btn-confirm {
  background-color: #27ae60;
  color: white;
}

.modal-btn-confirm:hover {
  background-color: #219150;
}

@media (max-width: 480px) {
  .modal-footer {
    flex-direction: column-reverse;
  }

  .modal-btn-cancel,
  .modal-btn-confirm {
    width: 100%;
  }
}
</style>
