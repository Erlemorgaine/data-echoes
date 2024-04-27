<script setup lang="ts">
import AppModal from '../general/AppModal.vue'

defineProps<{
  show: boolean
}>()

defineEmits(['closeModal'])
</script>

<template>
  <AppModal class="nostalgia-modal-wrapper" :show="show" @closeModal="$emit('closeModal')">
    <slot></slot>
  </AppModal>
</template>

<style scoped lang="scss">
.nostalgia-modal-wrapper {
  &::before {
    background-image: linear-gradient(45deg, #e382a488, #66e1fb88, #63d54088);
  }

  :deep(.app-modal) {
    background-color: rgb(25, 25, 25);
    border: 1px solid;
    border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
    color: var(--off-white);
    padding: 1.5rem 2rem 2.5rem 2rem;
    max-width: min(70vw, 60rem);
    min-height: 33rem;
    display: flex;

    @include mobile {
      flex-direction: column;
    }

    .app-modal__close-button {
      font-family: PPG;

      &:hover {
        color: #e382a4;
      }
    }
  }
}
</style>
