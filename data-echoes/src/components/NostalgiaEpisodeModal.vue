<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import NostalgiaBubble from './NostalgiaBubble.vue'
import { sumBy } from 'lodash'

import type { Speaker, ModalData } from '../types/types'

const props = defineProps<{
  data: ModalData | null
}>()

const emit = defineEmits(['closeModal'])

const dialogRef = ref()

const speakers = computed((): Speaker[] => {
  if (props.data) {
    const sumTopSpeakers = sumBy(props.data.goodies, 'word_count_for_line')
    const othersWordCount = props.data.sumEpisode - sumTopSpeakers
    const topSpeakersPlusOthers = [...props.data.goodies]

    if (othersWordCount) {
      topSpeakersPlusOthers.push({
        speaker: 'others',
        word_count_for_line: othersWordCount,
        episode: props.data.episode,
      })
    }
    topSpeakersPlusOthers.sort((a, b) => a.word_count_for_line - b.word_count_for_line)

    // console.log(topSpeakersPlusOthers)

    return topSpeakersPlusOthers
  }

  return []
})

watch(
  () => props.data,
  () => {
    if (props.data) openModal()

    document.body.style.overflow = props.data ? 'hidden' : 'initial'
  },
)

function openModal() {
  dialogRef.value.showModal()
}

function closeModal() {
  dialogRef.value.close()
  emit('closeModal')
}
</script>

<template>
  <dialog class="nostalgia-episode-modal-wrapper" ref="dialogRef" @close="closeModal">
    <div v-if="data" class="nostalgia-episode-modal">
      <button @click="closeModal" class="nostalgia-episode-modal__close-button">X</button>

      <div class="nostalgia-episode-modal__bubble-wrapper">
        <NostalgiaBubble
          :key="'episode' + data.episode"
          class="nostalgia-episode-modal__bubble"
          :season="data.season"
          :episodeData="{ title: '', size: 1, accumulatedSize: 0, speakers, sum: data.sumEpisode }"
        />
      </div>

      <div class="nostalgia-episode-modal__content">
        <h2 class="nostalgia-episode-modal__content__title">
          {{ data.episode }}
          <span class="episode-sum">- {{ data.sumEpisode }} words</span>
        </h2>
        <p class="nostalgia-episode-modal__content__description">{{ data.description }}</p>

        <ul class="nostalgia-episode-modal__content__speakers">
          <li
            class="nostalgia-episode-modal__content__speakers__speaker"
            v-for="speaker of [...speakers].reverse()"
            :key="speaker.speaker"
            :style="{
              '--speaker-color': speaker.speaker
                ? `var(--${speaker.speaker.replaceAll(' ', '-')})`
                : '',
            }"
          >
            <span class="marker">
              {{ Math.round((speaker.word_count_for_line / data.sumEpisode) * 1000) / 10 }}%
            </span>
            <span>{{ speaker.speaker }}</span>
          </li>
        </ul>
      </div>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.nostalgia-episode-modal-wrapper {
  width: fit-content;
  padding: 0;

  /* Style the backdrop behind the modal */
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
}
.nostalgia-episode-modal {
  box-shadow: -2px -1px 5px 1px var(--off-white-30);
  background-color: rgb(25, 25, 25);
  border: 1px solid;
  border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
  color: var(--off-white);
  padding: 1.5rem 2rem 1.75rem 2rem;
  max-width: 65vw;
  display: flex;
  align-items: center;

  &__close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  &__bubble-wrapper {
    padding: 1rem;
  }

  &__bubble {
    width: 20vw;
    height: 25vw;
    flex-shrink: 0;
    container: season / inline-size;
  }

  &__content {
    padding-left: 2rem;

    &__title {
      font-family: VinaSans;
      font-size: 2rem;
      margin-bottom: 0.75rem;

      .episode-sum {
        opacity: 0.7;
        font-size: 1.2rem;
        letter-spacing: 0.03em;
      }
    }

    &__speakers {
      font-family: VinaSans;
      margin-top: 1.5rem;
      columns: 2;
      column-fill: balance;

      &__speaker {
        display: flex;
        align-items: baseline;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;

        .marker {
          background-image: linear-gradient(90deg, transparent 10%, var(--speaker-color));
          margin-right: 0.5rem;
          width: 3rem;
        }
      }
    }
  }
}
</style>
