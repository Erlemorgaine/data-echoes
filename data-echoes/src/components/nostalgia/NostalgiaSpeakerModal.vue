<script setup lang="ts">
import NostalgiaBubble from './NostalgiaBubble.vue'

import type { SpeakerModalData } from './types/types'
import NostalgiaModal from './NostalgiaModal.vue'

defineProps<{
  data: SpeakerModalData | null
}>()

defineEmits(['closeModal', 'navigate', 'openEpisodeModal'])

const baseUrl = import.meta.env.MODE === 'development' ? '/' : import.meta.env.BASE_URL
const seriesTotal = 137275
</script>

<template>
  <NostalgiaModal :show="!!data" @closeModal="$emit('closeModal')">
    <div
      v-if="data"
      class="nostalgia-speaker-modal"
      :style="{ '--speaker-color': `var(--${data.speaker.replaceAll(' ', '-')})` }"
    >
      <div class="nostalgia-speaker-modal__bubbles">
        <div class="nostalgia-speaker-modal__bubbles__title">
          Top 5 <span>episodes with most words spoken</span>
        </div>
        <button
          v-for="episode of data.episodes"
          :key="episode.episode"
          class="nostalgia-speaker-modal__bubbles__bubble-content"
          @click="
            $emit('openEpisodeModal', { season: episode.season, episode: episode.episode_nr })
          "
        >
          <span class="nostalgia-speaker-modal__bubbles__bubble-content__episode-nr"
            >s{{ episode.season }} E{{ episode.episode_nr }}</span
          >
          <NostalgiaBubble
            class="nostalgia-speaker-modal__bubble"
            :season="episode.season"
            :episodeData="{
              title: '',
              size: 1,
              accumulatedSize: 0,
              speakers: episode.speakers,
              sum: episode.sumEpisode || 0,
            }"
          />

          <div class="nostalgia-speaker-modal__bubbles__bubble-content__episode">
            <span>{{ episode.episode }}</span>
          </div>
          <div class="nostalgia-speaker-modal__bubbles__bubble-content__numbers">
            <span class="value">
              {{ episode.speakerAmount }}
            </span>
            ({{ episode.speakerPercentage }}%) out of
            <span class="value">
              {{ episode.sumEpisode }}
            </span>
          </div>
        </button>
      </div>

      <div class="nostalgia-speaker-modal__content">
        <h2 class="nostalgia-speaker-modal__content__title">
          {{ data.speaker }}
        </h2>
        <div class="nostalgia-speaker-modal__content__numbers">
          speaks
          <span class="value">{{ data.speakerTotal }}</span> words (<span class="value"
            >{{ Math.round((data.speakerTotal / seriesTotal) * 1000) / 10 }}%</span
          >) <br />in the entire series
        </div>

        <picture>
          <img
            :src="`${baseUrl}images/nostalgia/${data.speaker.replaceAll(' ', '-')}.webp`"
            alt=""
            class="nostalgia-speaker-modal__content__img"
          />
          <caption class="nostalgia-speaker-modal__content__source">
            Source:
            <a target="__blank" :href="data.imgLink">Powerpuff Wiki</a>
          </caption>
        </picture>
      </div>
    </div>
  </NostalgiaModal>
</template>

<style scoped lang="scss">
.nostalgia-speaker-modal {
  display: flex;
  flex-direction: row-reverse;

  @include mobile {
    flex-direction: column-reverse;
  }

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
    padding: 0.5rem 1rem;
    position: relative;
    display: grid;
    // grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    font-family: VinaSans;
    margin-bottom: auto;

    &__title {
      @include powerpuff-line;

      font-size: 1.5rem;
      position: relative;
      width: 100%;
      padding-bottom: 1rem;

      span {
        font-size: 1rem;
        opacity: 0.7;
        margin-left: 0.25rem;
      }
    }

    &__bubble-content {
      display: grid;
      gap: 0rem 1rem;
      grid-template-columns: 2.75rem 3.5rem 1fr;
      grid-template-areas:
        'epnr bubble episode'
        'epnr bubble numbers';
      align-items: center;
      text-align: left;
      position: relative;
      z-index: 1;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        transform: translateX(-1rem) skew(-20deg);
        height: 100%;
        width: 110%;
        background-image: linear-gradient(
          90deg,
          var(--speaker-color) -10%,
          transparent 20%,
          transparent 80%,
          var(--speaker-color) 110%
        );
        z-index: -1;
        opacity: 0;
      }

      &:hover::after {
        opacity: 1;
      }

      &__episodes,
      &__numbers {
        width: 10rem;
      }

      &__episode-nr {
        opacity: 0.7;
        font-size: 0.95rem;
        flex-shrink: 0;
        grid-area: epnr;
      }

      &__episode {
        grid-area: episode;
        line-height: 1.1;
        margin-bottom: 0.25rem;
        align-self: flex-end;
        font-size: 1.1rem;
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
      }

      &__numbers {
        grid-area: numbers;
        font-size: 0.8rem;
        font-family: Poppins;

        .value {
          font-weight: 900;
        }
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
    min-width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    picture {
      position: relative;
      padding: 0rem 2.5rem;
    }

    &__source {
      font-family: VinaSans;
      width: 100%;
      display: block;

      a {
        font-family: Poppins;
        font-size: 0.8rem;

        &:hover {
          color: var(--blossom);
        }
      }
    }

    &__title {
      text-align: center;
      font-family: VinaSans;
      font-size: 2rem;
      font-weight: 400;
    }

    &__numbers {
      width: 100%;
      padding-bottom: 1rem;
      padding-top: 0.25rem;
      text-align: center;
      line-height: 1.1rem;

      .value {
        font-weight: 700;
      }
    }

    &__img {
      height: 33vh;
      max-width: 17.5vw;
      object-fit: contain;
      margin: 0 auto;
      display: block;
      margin-bottom: 1rem;

      @include mobile {
        width: 100%;
        max-width: initial;
      }
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
