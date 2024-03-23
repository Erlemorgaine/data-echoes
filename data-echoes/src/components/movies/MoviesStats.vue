<script setup lang="ts">
import type { MovieBarData } from './types/types'
import MoviesPieChart from './MoviesPieChart.vue'

defineProps<{
  chartData: MovieBarData[]
  total: number
  bipocWon: number
}>()
</script>

<template>
  <dl class="movies-stats">
    <div class="movies-stats__ethnicities">
      <div
        v-for="datum in chartData"
        :key="datum.id"
        :style="{ '--bar-color': `var(--${datum.id})` }"
        class="movies-stats__stat"
      >
        <dt class="dot">
          <span class="sr-only">{{ datum.label }}</span>
        </dt>
        <dd>{{ Math.round(datum.value * 100) }}%</dd>
      </div>
    </div>

    <div class="movies-stats__pie-stat">
      <MoviesPieChart
        background-color="var(--white)"
        :segments="[
          { value: total, id: 'african' },
          { value: 1 - total, id: 'white' },
        ]"
      >
        <dd>
          <span class="movies-stats__pie-stat__value">{{ Math.round(total * 100) }}%</span>
          BIPOC
        </dd>
      </MoviesPieChart>

      <dt>out of all nominees</dt>
    </div>

    <div class="movies-stats__pie-stat">
      <MoviesPieChart
        background-color="var(--african)"
        :segments="[
          { value: bipocWon, id: 'gold' },
          { value: 1 - bipocWon, id: 'african' },
        ]"
      >
        <dd>
          <span class="movies-stats__pie-stat__value">{{ Math.round(bipocWon * 100) }}%</span> won
        </dd>
      </MoviesPieChart>

      <dt>out of BIPOC nominees</dt>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.movies-stats {
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 0.1rem 0.2rem 0.5rem 0.2rem hsla(26, 6%, 51%, 0.75);
  padding: 0.5rem 0.75rem;
  background-color: var(--silver-light);

  &__ethnicities {
    --dot-size: 1rem;

    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }

  &__stat {
    display: flex;
    gap: 0.5rem;
    align-items: center;

    dd {
      font-weight: 700;
    }

    .dot {
      background-color: var(--bar-color);
    }
  }

  &__pie-stat {
    font-size: 0.875rem;
    margin-top: 1rem;
    max-width: calc(5 * var(--dot-size) + 4 * var(--dot-gap));

    dd {
      font-weight: 700;
    }

    &__value {
      font-weight: 900;
      font-size: 1.25rem;
      margin-right: 0.2rem;
    }
  }
}
</style>
