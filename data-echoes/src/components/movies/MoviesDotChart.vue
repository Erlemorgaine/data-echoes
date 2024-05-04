<script setup lang="ts">
import type { MoviePerson } from './types/types.ts'
import MovieDotTooltip from './MovieDotTooltip.vue'
import { ref } from 'vue'

defineProps<{
  title: string
  nominees: MoviePerson[]
  showHashtagLine?: boolean
  yearSelected: Boolean
}>()

const tooltipData = ref<MoviePerson | null>(null)
</script>

<template>
  <figure class="movies-dot-chart">
    <figcaption class="movies-dot-chart__title">{{ title }}</figcaption>

    <Transition name="fade">
      <div v-if="showHashtagLine && yearSelected" class="movies-dot-chart__hashtag-line">
        <strong>2015</strong>Year of hashtag
      </div>
    </Transition>

    <ul :class="['movies-dot-chart__chart', { 'year-selected': yearSelected }]">
      <li
        v-for="nominee of nominees"
        :class="['year-' + nominee.year]"
        :key="`${nominee.name}-${nominee.year}`"
        :style="{ '--origin-color': `var(--${nominee.origin})` }"
      >
        <button
          class="dot"
          @mouseenter="tooltipData = nominee"
          @focus="tooltipData = nominee"
          @mouseleave="tooltipData = null"
          @blur="tooltipData = null"
        >
          <span class="sr-only">{{ nominee.name }}</span>
          <MovieDotTooltip
            v-if="
              tooltipData && tooltipData.name + tooltipData.year === nominee.name + nominee.year
            "
            :dotData="nominee"
          />
          <div v-if="nominee.won" class="won" />
        </button>
      </li>
    </ul>
  </figure>
</template>

<style scoped lang="scss">
.movies-dot-chart {
  --fade-duration: 0.3s;

  position: relative;

  &__title {
    font-weight: 900;
    font-size: 0.85rem;
    padding-bottom: 0.1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    text-align: center;
  }

  &__hashtag-line {
    position: absolute;
    top: calc(var(--dot-size) * 6 + 0.15rem);
    left: -1rem;
    font-size: 0.75rem;
    transform: translateX(-100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 5rem;
    text-align: right;

    &::after {
      content: '';
      position: absolute;
      bottom: -0.25rem;
      left: 0;
      width: min(100vw, clamp(65rem, 85vw, 75.5rem));
      height: 1px;
      background: var(--off-black-30);
    }
  }

  &__chart {
    display: grid;
    grid-template-columns: repeat(5, var(--dot-size));
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 0.5rem;

    .year-2015 {
      transition: padding 0.3s ease-in-out;
    }

    &.year-selected {
      .year-2015 {
        padding-bottom: 0.5rem;
      }
    }
  }
}
</style>
