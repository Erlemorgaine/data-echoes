<script setup lang="ts">
import NostalgiaBubble from './NostalgiaBubble.vue'

import type { ModalData } from '../types/types'
import NostalgiaModal from './NostalgiaModal.vue'

defineProps<{
  data: ModalData | null
}>()

defineEmits(['closeModal', 'navigate'])

const baseUrl = import.meta.env.MODE === 'development' ? '/' : import.meta.env.BASE_URL
</script>

<template>
  <NostalgiaModal :show="!!data" @closeModal="$emit('closeModal')">
    <div v-if="data" class="nostalgia-episode-modal">
      <div class="nostalgia-episode-modal__bubbles">
        <div
          v-for="episode of data.episodes"
          :key="episode.episode"
          class="nostalgia-episode-modal__bubbles__bubble-content"
        >
          <NostalgiaBubble
            class="nostalgia-episode-modal__bubble"
            :season="episode.season"
            :episodeData="{
              title: '',
              size: 1,
              accumulatedSize: 0,
              speakers: episode.speakers,
              sum: episode.sumEpisode,
            }"
          />

          <div class="nostalgia-episode-modal__bubbles__bubble-content__episode">
            {{ episode.episode }}
          </div>
          <div class="nostalgia-episode-modal__bubbles__bubble-content__numbers">
            <span class="nostalgia-episode-modal__bubbles__bubble-content__words">
              {{ episode.speakerAmount }} ({{ episode.speakerPercentage }}%)
            </span>
            out of
            <span class="nostalgia-episode-modal__bubbles__bubble-content__words">
              {{ episode.sumEpisode }}
            </span>
          </div>
        </div>
      </div>

      <div class="nostalgia-episode-modal__content">
        <img
          :src="`${baseUrl}images/${data.speaker.replaceAll(' ', '-')}.webp`"
          alt=""
          class="nostalgia-episode-modal__content__img"
        />
        <h2 class="nostalgia-episode-modal__content__title">{{ data.speaker }}</h2>
      </div>
    </div>
  </NostalgiaModal>
</template>

<style scoped lang="scss">
.nostalgia-episode-modal {
  display: flex;
  flex-direction: row-reverse;

  &__close-button {
    position: absolute;
    top: 0.25rem;
    right: 1rem;
    font-family: PPG;

    &:hover {
      color: #e382a4;
    }
  }

  &__bubbles {
    padding: 1rem;
    position: relative;
    display: grid;
    // grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    font-family: VinaSans;

    &__bubble-content {
      display: grid;
      gap: 0rem 1rem;
      grid-template-columns: 3.5rem 1fr;
      grid-template-areas:
        'bubble episode'
        'bubble numbers';
      align-items: center;

      &__episodes,
      &__numbers {
        width: 10rem;
      }

      &__episode {
        grid-area: episode;
        line-height: 1.1;
        margin-bottom: 0.25rem;
        align-self: flex-end;
        font-size: 1.1rem;
      }

      &__numbers {
        grid-area: numbers;
        font-size: 0.8rem;
      }
    }
  }

  &__bubble {
    width: var(--bubble-size, 3rem);
    aspect-ratio: 1;
    container: season / inline-size;
    position: relative;
    display: block;
    grid-area: bubble;

    :deep(.nostalgia-bubble__wrapper) {
      top: 0;
      height: 100%;
    }
  }

  &__content {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: 1.5rem;

    &__title {
      text-align: center;
      font-family: VinaSans;
      font-size: 2rem;
    }

    &__img {
      height: 33vh;
      max-width: 17.5vw;
      object-fit: contain;
      margin: 0 auto;
      display: block;
      margin-bottom: 1rem;
    }
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    font-family: VinaSans;
    // color: var(--off-black);
  }
}
</style>
