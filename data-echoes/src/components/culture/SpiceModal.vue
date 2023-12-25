<script setup lang="ts">
import { computed } from 'vue'
import { baseUrl } from '../../ultilities/globals'

import AppModal from '../general/AppModal.vue'
import type { Spice } from './types/types'

const props = defineProps<{
  spice: Spice | null
}>()

const spiceKey = computed(() => props.spice?.translation.replaceAll(' ', '-'))
const spiceName = computed(() => props.spice?.name.split('/')[0])
const alternativeNames = computed(() => props.spice?.name.split('/').slice(1))
</script>

<template>
  <AppModal
    class="spice-modal-wrapper"
    :style="{
      '--spice-color': `var(--spice-${spiceKey})`,
      '--spice-color-dark': `var(--spice-${spiceKey}-dark)`,
    }"
    :show="!!spice"
    @closeModal="$emit('closeModal')"
  >
    <template v-if="spice">
      <div class="spice-modal__top">
        <img
          :src="`${baseUrl}images/culture/${spiceKey}_reduced.webp`"
          alt=""
          class="spice-modal__top__img"
        />
        <h1 class="spice-modal__top__title">{{ spiceName }}</h1>
      </div>

      <div class="spice-modal__bottom">
        <dl class="spice-modal__bottom__metadata">
          <div v-if="alternativeNames?.length">
            <dt>Also occurs by the name(s)</dt>
            <dd>{{ alternativeNames.join(', ') }}</dd>
          </div>

          <div>
            <dt>English name</dt>
            <dd>{{ spice.translation }}</dd>
          </div>

          <div>
            <dt>Occurs in recipes</dt>
            <dd>{{ spice.count }} times</dd>
          </div>
        </dl>

        <div class="spice-modal__bottom__description">
            
        </div>
      </div>
    </template>
  </AppModal>
</template>

<style scoped lang="scss">
.spice-modal-wrapper {
  --modal-size: 50vw;
  --half-modal: calc(var(--modal-size) * 0.5);

  background-color: transparent;

  &::before {
    background-color: var(--bg-1-70);
  }

  :deep(.app-modal) {
    width: var(--modal-size);
    aspect-ratio: 1;
    border-radius: 50%;

    @include mobile {
      flex-direction: column;
    }

    .app-modal__close-button {
      // TODO
    }
  }

  .spice-modal {
    &__top {
      background-color: var(--spice-color);
      border-radius: var(--half-modal) var(--half-modal) 0 0;
      height: 50%;
      //   color: var(--off-white);
      text-align: center;
      padding: 2rem;
      overflow: hidden;
      position: relative;

      &__img {
        position: absolute;
        bottom: -33%;
        left: 0;
        width: 100%;
      }

      &__title {
        position: absolute;
        width: 100%;
        height: 50%;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 0.5rem;
        color: var(--off-white);
        z-index: 1;
        // font-family: WaitingfortheSunrise;
        font-size: 2rem;

        &::first-letter {
          text-transform: uppercase;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(transparent, var(--spice-color-dark));
          z-index: -1;
        }
      }
    }

    &__bottom {
      background-color: var(--spice-color);
      border-radius: 0 0 var(--half-modal) var(--half-modal);
      height: 50%;
      padding: 1rem 2rem;

      &__metadata {
        display: flex;
        justify-content: center;
        gap: 3rem;

        dt {
          font-weight: 700;
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>
