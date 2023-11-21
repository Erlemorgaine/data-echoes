<script setup lang="ts">
import type { Speaker, EpisodeContent, HoveredSpeaker } from '../../types/types.ts'
import NostalgiaTooltip from './NostalgiaTooltip.vue'

import { computed } from 'vue'

const props = defineProps<{
  season: string | number
  episode?: string | number
  episodeData: EpisodeContent
  keySpeakers?: string[]
  episodeVillains?: string[]
  hoveredEpisode?: { season: string | number; episode: string | number } | null
  hoveredSpeaker?: HoveredSpeaker
  hoveredSeasonSpeaker?: { season: string | number; speaker: string } | null
  halfBubble?: boolean
  disabled?: boolean
}>()

defineEmits(['onEpisodeHover', 'openModal'])

const episodeVillainHovered = computed(
  () =>
    props.hoveredSpeaker &&
    props.hoveredSpeaker.isVillain &&
    props.episodeVillains?.includes(props.hoveredSpeaker.speaker),
)

const inactive = computed(
  () =>
    props.hoveredEpisode &&
    props.hoveredEpisode.season === props.season &&
    props.hoveredEpisode.episode !== props.episode,
)

const active = computed(
  () =>
    (props.hoveredEpisode &&
      props.hoveredEpisode.season === props.season &&
      props.hoveredEpisode.episode === props.episode) ||
    episodeVillainHovered.value,
)

const speakersWithAccumulatedSize = computed(() => {
  const keySpeakersData = props.keySpeakers
    ? props.episodeData.speakers.filter(
        (speaker: Speaker) =>
          props.keySpeakers && speaker.speaker && props.keySpeakers.includes(speaker.speaker),
      )
    : props.episodeData.speakers

  return keySpeakersData.map((speaker: Speaker, i: number) => {
    const previousSpeakersAccumulation = keySpeakersData
      .slice(0, i)
      .reduce(
        (prev: number, next: Speaker) => prev + next.word_count_for_line / props.episodeData.sum,
        0,
      )

    const nextSpeakersAccumulation = keySpeakersData
      .slice(i + 1)
      .reduce(
        (prev: number, next: Speaker) => prev + next.word_count_for_line / props.episodeData.sum,
        0,
      )

    const size = speaker.word_count_for_line / props.episodeData.sum

    return {
      ...speaker,
      childrenPercentage:
        // * 70 because we will use it in an radial gradient, and radial gradients calculate the outer circle from the square element's corners instead of its edges
        Math.round((nextSpeakersAccumulation / (size + nextSpeakersAccumulation)) * 70) + '%',
      accumulatedSize: 1 - previousSpeakersAccumulation,
      size: Math.round(size * 100),
    }
  })
  // return speakerCount / episodeSum
})

function getBubbleActive(speaker: Speaker) {
  return (
    (props.hoveredSeasonSpeaker &&
      props.hoveredSeasonSpeaker.season === props.season &&
      props.hoveredSeasonSpeaker.speaker === speaker.speaker) ||
    (props.hoveredSpeaker &&
      !props.hoveredSpeaker.isVillain &&
      props.hoveredSpeaker.speaker === speaker.speaker) ||
    episodeVillainHovered.value
  )
}

function getBubbleInactive(speaker: Speaker) {
  return (
    (props.hoveredSeasonSpeaker &&
      props.hoveredSeasonSpeaker.season === props.season &&
      props.hoveredSeasonSpeaker.speaker !== speaker.speaker) ||
    (props.hoveredSpeaker &&
      !props.hoveredSpeaker.isVillain &&
      props.hoveredSpeaker.speaker !== speaker.speaker) ||
    (props.hoveredSpeaker &&
      props.hoveredSpeaker.isVillain &&
      !props.episodeVillains?.includes(props.hoveredSpeaker.speaker))
  )
}
</script>

<template>
  <button
    :class="['nostalgia-bubble', { inactive }]"
    :style="{
      '--episode-size': episodeData.size,
      '--episode-accumulated-size': (episodeData.accumulatedSize || 0) * -1,
    }"
    :disabled="disabled"
    @mouseenter="$emit('onEpisodeHover', { season, episode })"
    @focus="$emit('onEpisodeHover', { season, episode })"
    @mouseleave="$emit('onEpisodeHover', null)"
    @blur="$emit('onEpisodeHover', null)"
    @click="$emit('openModal', { season, episode })"
  >
    <NostalgiaTooltip
      v-if="episode && episodeData"
      :class="['nostalgia-bubble__tooltip', { show: active }]"
      :episodeData="episodeData"
      :episode="episode"
      :hideTitle="hoveredSpeaker && hoveredSpeaker.isVillain"
    />

    <div class="nostalgia-bubble__wrapper">
      <div
        v-for="speaker of speakersWithAccumulatedSize"
        :key="speaker.speaker"
        :class="[
          'nostalgia-bubble__speaker',
          {
            'half-bubble': halfBubble,
            inactive: getBubbleInactive(speaker),
            active: getBubbleActive(speaker),
            villain: hoveredSpeaker && hoveredSpeaker.isVillain,
          },
        ]"
        :style="{
          '--speaker-size': speaker.accumulatedSize,
          '--speaker-children-size': speaker.childrenPercentage,
          '--speaker-color': speaker.speaker
            ? `var(--${speaker.speaker.replaceAll(' ', '-')})`
            : '',
          '--speaker-color-50': `var(--${speaker.speaker}-50)`,
          '--speaker-z-index':
            keySpeakers && speaker.speaker ? keySpeakers.indexOf(speaker.speaker) : 1,
        }"
      >
        <span class="nostalgia-bubble__speaker__size">
          {{ speaker.size + '%' }}
        </span>
      </div>
    </div>
  </button>
</template>

<style lang="scss" scoped>
@container season (width > 1px) {
  .nostalgia-bubble {
    font-family: VinaSans;
    color: var(--off-white);
    position: relative;
    width: calc(100% * var(--episode-size));

    aspect-ratio: 1;
    aspect-ratio: 2;
    left: calc(var(--episode-accumulated-size) * 100cqw);
    transition: opacity 0.3s;

    &:focus {
      outline: none;
    }

    &:hover {
      z-index: 10;
    }

    &.inactive {
      opacity: 0.2;
    }

    &__tooltip {
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }

    &__wrapper {
      position: absolute;
      inset: 0;
      top: -1rem;
      width: 100%;
      height: calc(100% + 1rem);
      overflow: hidden;
    }

    &__speaker {
      position: absolute;
      top: 50%;

      left: 50%;
      transform: translate(-50%, -50%);
      // background-color: var(--speaker-color);
      background-image: radial-gradient(
        transparent 0% var(--speaker-children-size),
        var(--speaker-color) var(--speaker-children-size) 100%
      );
      width: calc(100% * var(--speaker-size));
      aspect-ratio: 1;
      border-radius: 50%;
      z-index: var(--speaker-z-index);
      // transition: opacity 0.5s;

      &.half-bubble {
        top: 100%;
      }

      &__size {
        position: absolute;
        bottom: calc(100% + 0.2rem);
        transform: translateX(-35%);
        opacity: 0;
      }

      &.inactive {
        opacity: 0;
      }

      &.active:not(.villain) {
        background-image: radial-gradient(
          transparent 5% var(--speaker-children-size),
          var(--speaker-color-50) var(--speaker-children-size),
          var(--speaker-color),
          var(--off-white)
        );

        .nostalgia-bubble__speaker__size {
          opacity: 1;
        }
      }
    }
  }
}
</style>
