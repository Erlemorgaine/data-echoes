<script setup lang="ts">
import type { MoviePerson } from './types/types.ts'
import MovieDotTooltip from './MovieDotTooltip.vue'
import { computed, ref } from 'vue'

const props = defineProps<{
  title: string
  nominees: MoviePerson[]
  showHashtagLine?: boolean
  yearSelected: Boolean
}>()

const tooltipData = ref<MoviePerson | null>(null)
const years = computed(() => [...new Set(props.nominees.map((nominee) => nominee.year))])
</script>

<template>
  <figure class="movies-dot-chart">
    <figcaption class="movies-dot-chart__title">{{ title }}</figcaption>

    <Transition name="fade">
      <div v-if="showHashtagLine && yearSelected" class="movies-dot-chart__year-axis">
        <template v-for="year of years" :key="year">
          <div v-if="year === 2015" class="year hashtag">
            <strong>{{ year }}</strong>
            <div>#OscarsSoWhite</div>
          </div>

          <strong v-else class="year">{{ year }}</strong>
        </template>
      </div>
    </Transition>

    <ul :class="['movies-dot-chart__chart', { 'year-selected': yearSelected }]">
      <li
        v-for="nominee of nominees"
        :class="[
          'year-' + nominee.year,
          { 'double-director': yearSelected && nominee.name === 'Daniel Scheinert' },
        ]"
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
  --fade-duration: 0.2s;

  position: relative;

  &__title {
    font-weight: 900;
    font-size: 0.85rem;
    padding-bottom: 0.1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    text-align: center;
  }

  &__year-axis {
    position: absolute;
    top: 2.65rem;
    left: -1rem;
    font-size: 0.75rem;
    transform: translateX(-100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: right;

    .year {
      display: block;
      height: calc(var(--dot-gap) + var(--dot-size));
      opacity: 0.5;

      strong {
        display: block;
        font-weight: 900;
        margin-bottom: 0.112rem;
      }

      &.hashtag {
        position: relative;
        height: calc(var(--dot-gap) * 2.5 + var(--dot-size));
        opacity: 1;

        &::after {
          --raw-chart-width: calc(25 * var(--dot-size) + 20 * var(--dot-gap));

          content: '';
          position: absolute;
          bottom: calc(var(--dot-gap) * 1.75);
          left: calc(100% + 0.75rem);
          width: calc(
            var(--raw-chart-width) +
              (max(75rem, 100vw) - var(--raw-chart-width) - var(--theme-padding) * 2) * 0.5
          );
          height: 1px;
          background: var(--off-black-30);
        }
      }
    }

    strong {
      font-size: 0.7rem;
      letter-spacing: 0.05rem;
    }
  }

  &__chart {
    display: grid;
    grid-template-columns: repeat(5, var(--dot-size));
    gap: var(--dot-gap);
    justify-content: center;
    margin-bottom: 0.5rem;

    .year-2015 {
      transition: padding 0.3s ease-in-out;
    }

    &.year-selected {
      .year-2015 {
        padding-bottom: calc(var(--dot-gap) * 1.5);
      }
    }

    .double-director {
      position: absolute;
      bottom: calc(var(--dot-size) + var(--dot-gap) * 2);
      right: calc((var(--dot-size) + var(--dot-gap)) * -1);
    }
  }
}
</style>
