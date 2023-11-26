<script setup lang="ts">
import type { HoveredSpeaker } from './types/types'

defineProps<{
  seasonChartSpeakers: { speaker: string; amount: number; size: number }[]
  title: string
  season: string | number
  leftSkewed?: boolean
  hoveredSpeaker?: HoveredSpeaker
}>()
</script>

<template>
  <div :class="['nostalgia-bar-chart', { 'left-skewed': leftSkewed }]">
    <h3 v-if="title" class="nostalgia-bar-chart__title">{{ title }}</h3>
    <div
      v-for="speaker of seasonChartSpeakers"
      :key="speaker.speaker"
      :class="[
        'nostalgia-bar-chart__speaker',
        {
          inactive:
            !!hoveredSpeaker &&
            !hoveredSpeaker.isVillain &&
            hoveredSpeaker.speaker !== speaker.speaker,
        },
      ]"
      :style="{
        '--bar-color': `var(--${speaker.speaker || 'bunny'})`,
        '--bar-size': speaker.size,
        '--text-color': speaker.speaker === 'professor' ? '#fff' : '#000',
      }"
      @mouseenter="$emit('setHoveredSeasonSpeaker', { season, speaker: speaker.speaker })"
      @mouseleave="$emit('setHoveredSeasonSpeaker', null)"
    >
      <span class="nostalgia-bar-chart__speaker__text">
        <!-- {{ speaker.speaker }} -->

        {{ Math.round(speaker.size * 100) }}%
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nostalgia-bar-chart {
  position: relative;
  width: var(--chart-width);
  display: flex;
  font-size: 0.8rem;
  // font-weight: bold;
  text-transform: uppercase;
  line-height: 120%;

  &__title {
    position: absolute;
    font-family: VinaSans;
    color: var(--off-white);
    top: -0.1rem;
    left: -2rem;
    font-size: 1.2rem;
    letter-spacing: 0.05em;

    // &:after {
    //   content: '';
    //   background-color: var(--off-white);
    //   width: 1px;
    //   height: 2rem;
    //   position: absolute;
    //   top: 100%;
    //   left: 1.75rem;
    // }
  }

  &__speaker {
    font-family: VinaSans;
    background-color: var(--bar-color);
    width: calc(100% * var(--bar-size));
    color: var(--text-color, black);
    padding: 0 0.5rem 0.1rem 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    transform: skew(-35deg);

    &.inactive {
      opacity: 0.2;
    }

    .left-skewed & {
      transform: skew(35deg);
    }

    &__text {
      transform: skew(35deg);

      .left-skewed & {
        transform: skew(-35deg);
      }
    }
  }
}
</style>
