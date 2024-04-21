<script setup lang="ts">
import { computed } from 'vue'
import { baseUrl } from '../../ultilities/globals'
import { getTextColorForCssBgColorVar } from '../../ultilities/functions/color'

import AppModal from '../general/AppModal.vue'
import type { Spice } from './types/types'

const props = defineProps<{
  spice: Spice | null
}>()

const spiceKey = computed(() => props.spice?.translation.replaceAll(' ', '-'))
const spiceName = computed(() => props.spice?.name.split('/')[0])
const alternativeNames = computed(() => props.spice?.name.split('/').slice(1))
const colorVar = computed(() => `--spice-${spiceKey.value}`)
const textColor = computed(() => getTextColorForCssBgColorVar(colorVar.value))
</script>

<template>
  <AppModal
    class="spice-modal-wrapper"
    :style="{
      '--spice-color': `var(${colorVar})`,
      '--spice-color-dark': `var(--spice-${spiceKey}-dark)`,
      '--text-color': textColor,
    }"
    :show="!!spice"
    closeLabel="Close"
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

        <div class="spice-modal__bottom__description-wrapper">
          <div class="spice-modal__bottom__description">
            {{ spice.description }}
          </div>
        </div>

        <a class="spice-link" target="__blank" :href="spice.source">Source: Wikipedia</a>
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
    border: 0.5rem solid var(--spice-color);

    @include mobile {
      flex-direction: column;
    }

    .app-modal__close-button {
      left: 50%;
      top: calc(100% - 1rem);
      transform: translate(-50%, -50%);
      background-color: var(--off-white-70);
      width: fit-content;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1.5rem;
      padding: 1rem;
      font-weight: bold;
      mix-blend-mode: luminosity;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--off-white);
      }
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
      color: var(--text-color);
      border-radius: 0 0 var(--half-modal) var(--half-modal);
      height: 50%;
      padding: 1rem 2rem;

      &__metadata {
        display: flex;
        justify-content: center;
        gap: 3rem;
        padding-bottom: 0.75rem;
        border-bottom: var(--spice-color-dark) 2px solid;

        dt {
          font-weight: 700;
          font-size: 0.8rem;
        }
      }

      &__description-wrapper {
        &::before {
          content: '';
          width: 50%;
          height: calc(var(--modal-size) * 0.33);
          float: left;
          shape-outside: polygon(0 100%, 45% 100%, 20% 90%, 15% 76%, 0 50%);
          shape-margin: 7%;
        }
      }

      &__description {
        text-wrap: balance;
        padding-top: 1rem;
        text-align: center;
        position: relative;

        &::before {
          content: '';
          width: 50%;
          height: calc(var(--modal-size) * 0.33);
          float: right;
          shape-outside: polygon(100% 100%, 45% 100%, 78% 80%, 92% 76%, 100% 50%);
          shape-margin: 7%;
        }
      }

      .spice-link {
        --line-color: var(--text-color);

        display: block;
        width: fit-content;
        margin-inline: auto;
        color: var(--text-color);
        margin-top: 0.25rem;
      }
    }
  }
}
</style>
