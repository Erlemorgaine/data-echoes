<script setup lang="ts">
// import { onClickOutside } from '@vueuse/core'
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  closeLabel?: string
}>()

const emit = defineEmits(['closeModal'])

const animationDurationMs = 300
const dialogRef = ref()
const innerDialogRef = ref()

// onClickOutside(innerDialogRef, () => closeModal())

watch(
  () => props.show,
  () => {
    if (props.show) {
      openModal()
    } else {
      dialogRef.value.close()
    }

    document.body.style.overflow = props.show ? 'hidden' : 'initial'
  },
)

function openModal() {
  dialogRef.value.showModal()
}

function closeModal() {
  dialogRef.value.close()

  setTimeout(() => {
    emit('closeModal')
  }, animationDurationMs)
}
</script>

<template>
  <dialog
    class="app-modal-wrapper"
    ref="dialogRef"
    :style="{ '--animation-time': animationDurationMs / 1000 + 's' }"
    @close="closeModal"
  >
    <div class="app-modal" ref="innerDialogRef">
      <button @click="closeModal" class="app-modal__close-button">{{ closeLabel || 'X' }}</button>

      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.app-modal-wrapper {
  display: block;
  position: fixed;
  padding: 0;
  pointer-events: none;
  overflow: visible;
  opacity: 0;
  border: none;
  transition: opacity var(--animation-time);

  // Use before, not backdrop, to make animation work
  &::before {
    @include center;

    content: '';
    display: block;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(0.5rem);
    opacity: 0;
    transition: opacity var(--animation-time);
  }

  &[open] {
    position: absolute;
    pointer-events: inherit;
    opacity: 1;
    width: fit-content;

    &::before {
      opacity: 1;
    }
  }

  .app-modal {
    position: relative;

    @include mobile {
      width: 100%;
      max-width: initial;
      padding: 1rem;
    }

    &__close-button {
      position: absolute;
      top: 0.25rem;
      right: 1rem;
      z-index: 1;
    }
  }
}
</style>
