<script setup lang="ts">
import { computed } from 'vue'

import NostalgiaBubble from './NostalgiaBubble.vue'
import startCase from 'lodash/startCase'
import sumBy from 'lodash/sumBy'

import type { Speaker, ModalData } from './types/types'
import NostalgiaModal from './NostalgiaModal.vue'

const props = defineProps<{
  data: ModalData | null
}>()

defineEmits(['closeModal', 'navigate'])

const fandomLink = computed(
  () =>
    `https://powerpuffgirls.fandom.com/wiki/${
      props.data?.fandomLink ||
      startCase(props.data?.episode)
        .replaceAll(' ', '_')
        .replaceAll('_A_', '_a_')
        .replaceAll('_For_', '_for_')
        .replaceAll('_And_', '_and_')
        .replaceAll('_The_', '_the_')
        .replaceAll('_With_', '_with_')
        .replaceAll('_Is_', '_is_')
        .replaceAll('_Of_', '_of_')
        .replaceAll('_On_', '_on_')
        .replaceAll('_Are_', '_are_')
        .replaceAll('_In_', '_in_')
    }`,
)

const speakers = computed((): Speaker[] => {
  if (props.data) {
    const sumTopSpeakers = sumBy(props.data.topSpeakers, 'word_count_for_line')
    const othersWordCount = props.data.sumEpisode - sumTopSpeakers
    const topSpeakersPlusOthers = [...props.data.topSpeakers]

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
</script>

<template>
  <NostalgiaModal :show="!!data" @closeModal="$emit('closeModal')">
    <template v-if="data">
      <div class="nostalgia-episode-modal__bubble-wrapper">
        <div class="nostalgia-episode-modal__bubble-wrapper__season">season {{ data.season }}</div>
        <div class="nostalgia-episode-modal__bubble-wrapper__episode">
          episode {{ +data.episodeNr }}
        </div>
        <NostalgiaBubble
          :key="'episode' + data.episode"
          class="nostalgia-episode-modal__bubble"
          :season="data.season"
          :episodeData="{ title: '', size: 1, accumulatedSize: 0, speakers, sum: data.sumEpisode }"
          disabled
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
            <span class="word-count">({{ speaker.word_count_for_line }})</span>
          </li>
        </ul>

        <div class="nostalgia-episode-modal__content__sources">
          <div class="nostalgia-episode-modal__content__sources__title">Sources:</div>
          <a
            target="__blank"
            :href="`https://imdb.com${data.imdbLink}`"
            class="nostalgia-episode-modal__content__sources__link"
            >IMDb</a
          >
          <a
            target="__blank"
            :href="fandomLink"
            class="nostalgia-episode-modal__content__sources__link"
            >Powerpuff Girls Wiki</a
          >
        </div>
      </div>

      <div class="nostalgia-episode-modal__footer">
        <button
          class="nostalgia-episode-modal__footer__nav-btn prev"
          @click="$emit('navigate', -1, data.season, data.episodeNr)"
        >
          Previous episode
        </button>
        <button
          class="nostalgia-episode-modal__footer__nav-btn next"
          @click="$emit('navigate', 1, data.season, data.episodeNr)"
        >
          Next episode
        </button>
      </div>
    </template>
  </NostalgiaModal>
</template>

<style scoped lang="scss">
.nostalgia-episode-modal {
  &__bubble-wrapper {
    padding: 1rem;
    position: relative;

    &__season,
    &__episode {
      position: absolute;
      font-family: VinaSans;
      top: 0.2rem;
      // font-size: 0.8rem;
      right: 0rem;
      letter-spacing: 0.05em;

      @include mobile {
        right: initial;
        left: 0;
        top: -0.5rem;
      }
    }

    &__episode {
      top: 1.2rem;

      @include mobile {
        top: 0.7rem;
      }
    }
  }

  &__bubble {
    width: 20vw;
    height: 25vw;
    flex-shrink: 0;
    container: season / inline-size;
    top: 50%;
    transform: translateY(-50%);
    position: relative;

    @include mobile {
      width: 100%;
      height: calc(100vw - 7rem);
      top: initial;
      transform: initial;
    }
  }

  &__content {
    padding-left: 2rem;
    padding-right: 1rem;

    @include mobile {
      padding: 0;
    }

    &__title {
      font-family: VinaSans;
      font-size: 2.4rem;
      line-height: 1.1;
      margin-bottom: 0.75rem;
      font-weight: 400;

      .episode-sum {
        opacity: 0.7;
        font-size: 1.3rem;
        letter-spacing: 0.03em;
      }
    }

    &__speakers {
      @include powerpuff-line;

      position: relative;
      font-family: VinaSans;
      margin-top: 1.5rem;
      columns: 2;
      column-fill: balance;
      padding-bottom: 2rem;

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

        .word-count {
          opacity: 0.7;
          margin-left: 0.4rem;
          font-size: 0.9rem;
          letter-spacing: 0.06em;
        }
      }
    }

    &__sources {
      display: flex;
      gap: 1rem;
      align-items: baseline;
      position: relative;
      z-index: 1;

      @include mobile {
        padding-bottom: 3rem;
      }

      &__title {
        font-family: VinaSans;
      }

      &__link {
        display: block;
        font-size: 0.8rem;

        &:hover {
          color: var(--blossom);
        }
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
    padding: 0rem 2rem 1rem 2rem;
    font-family: VinaSans;
    z-index: 1;
    // color: var(--off-black);

    &__nav-btn {
      padding: 0.25rem 0.5rem;
      position: relative;
      background-color: rgb(25, 25, 25);
      transition: transform 0.5s;
      transform-origin: bottom center;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        width: 0;
        height: 0;
        border-top: 0.82rem solid transparent;
        border-bottom: 0.82rem solid transparent;
      }

      &.prev {
        // background-image: linear-gradient(90deg, #e382a4, #66e1fb, transparent);
        padding-right: 1.5rem;
        filter: drop-shadow(-4px 1px 3px var(--bubbles));

        &::after {
          right: 100%;
          border-right: 0.5rem solid rgb(25, 25, 25);
        }

        &:hover {
          // color: var(--bubbles);
          transform: translateX(-0.25rem) scale(1.08);
        }
      }

      &.next {
        // background-image: linear-gradient(90deg, transparent, #66e1fb, #63d540);
        padding-left: 1.5rem;
        filter: drop-shadow(4px 1px 3px var(--buttercup));

        &::after {
          left: 100%;
          border-left: 0.5rem solid rgb(25, 25, 25);
        }

        &:hover {
          // color: var(--buttercup);
          transform: translateX(0.25rem) scale(1.08);
        }
      }
    }
  }
}
</style>
