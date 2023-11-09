<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import NostalgiaBubble from './NostalgiaBubble.vue'
import { sumBy } from 'lodash'

const props = defineProps({
  season: String,
  episodeNr: String,
  episode: String,
  description: String,

  goodies: {
    type: Array,
    default: () => [],
  },
  villains: {
    type: Array,
    default: () => [],
  },
  goodiesTalking: Number,
  sumEpisode: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['closeModal'])

const dialogRef = ref()

const speakers = computed(() => {
  const sumTopSpeakers = sumBy(props.goodies, 'word_count_for_line')

  const topSpeakersPlusOthers = [
    ...props.goodies,
    { speaker: 'others', word_count_for_line: props.sumEpisode - sumTopSpeakers },
  ]
  topSpeakersPlusOthers.sort((a, b) => a.word_count_for_line - b.word_count_for_line)

  console.log(topSpeakersPlusOthers)

  return topSpeakersPlusOthers
})

watch(
  () => props.episode,
  () => {
    if (props.episode) openModal()

    console.log(props.villains)
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
  <dialog class="nostalgia-episode-modal" ref="dialogRef" @close="closeModal">
    <button @click="closeModal" class="nostalgia-episode-modal__close-button">X</button>

    <template v-if="episode">
      <div class="nostalgia-episode-modal__bubble-wrapper">
        <NostalgiaBubble
          :key="'episode' + episode"
          class="nostalgia-episode-modal__bubble"
          :season="season"
          :episodeData="{ size: 1, accumulatedSize: 0, speakers, sum: sumEpisode }"
        />
      </div>

      <div class="nostalgia-episode-modal__content">
        <h2 class="nostalgia-episode-modal__content__title">{{ episode }}</h2>
        <p class="nostalgia-episode-modal__content__description">{{ description }}</p>

        <ul class="nostalgia-episode-modal__content__speakers">
          <li
            class="nostalgia-episode-modal__content__speakers__speaker"
            v-for="speaker of speakers"
            :key="speaker.speaker"
            :style="{ '--speaker-color': `var(--${speaker.speaker.replaceAll(' ', '-')})` }"
          >
            <span class="marker" />
            {{ speaker.speaker }}
          </li>
        </ul>
      </div>
    </template>
  </dialog>
</template>

<style scoped lang="scss">
.nostalgia-episode-modal {
  box-shadow: -2px -1px 5px 1px var(--off-white-30);
  background-color: rgb(25, 25, 25);
  border: 1px solid;
  border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
  color: var(--off-white);
  padding: 1.5rem 2rem 1.75rem 2rem;
  max-width: 65%;
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
    }

    &__speakers {
      font-family: VinaSans;
      margin-top: 1rem;
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      &__speaker {
        display: flex;
        align-items: baseline;
        margin-bottom: 0.5rem;

        .marker {
          width: 0.8rem;
          aspect-ratio: 1;
          background-color: var(--speaker-color);
          margin-right: 0.5rem;
        }
      }
    }
  }

  /* Style the backdrop behind the modal */
  &::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
