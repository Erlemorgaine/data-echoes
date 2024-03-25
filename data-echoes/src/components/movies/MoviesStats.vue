<script setup lang="ts">
import type { MovieBarData } from './types/types'
import MoviesPieChart from './MoviesPieChart.vue'

defineProps<{
  chartData: MovieBarData[]
  bipcOfTotal: number
  wonOfBipoc: number
  bipocOfWon: number
}>()
</script>

<template>
  <dl>
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

    <div class="movies-stats">
      <div class="movies-stats__pie-stat">
        <MoviesPieChart
          background-color="var(--white)"
          :segments="[
            { value: bipcOfTotal, id: 'african' },
            { value: 1 - bipcOfTotal, id: 'white' },
          ]"
        >
          <dd>
            <span class="movies-stats__pie-stat__value">{{ Math.round(bipcOfTotal * 100) }}%</span>
            BIPOC
          </dd>
        </MoviesPieChart>

        <dt>out of all nominees</dt>
      </div>

      <div class="movies-stats__pie-stat">
        <MoviesPieChart
          background-color="var(--white)"
          :segments="[
            { value: bipocOfWon, id: 'african' },
            { value: 1 - bipocOfWon, id: 'gold' },
          ]"
        >
          <dd>
            <span class="movies-stats__pie-stat__value">{{ Math.round(bipocOfWon * 100) }}%</span>
            BIPOC
          </dd>
        </MoviesPieChart>

        <dt>out of all winners</dt>
      </div>

      <div class="movies-stats__pie-stat">
        <MoviesPieChart
          background-color="var(--african)"
          :segments="[
            { value: wonOfBipoc, id: 'gold' },
            { value: 1 - wonOfBipoc, id: 'african' },
          ]"
        >
          <dd>
            <span class="movies-stats__pie-stat__value">{{ Math.round(wonOfBipoc * 100) }}%</span>
            won
          </dd>
        </MoviesPieChart>

        <dt>out of BIPOC nominees</dt>
      </div>
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
    padding: 0.25rem 0.5rem 0rem 0.5rem;
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
    max-width: calc(5 * var(--dot-size) + 4 * var(--dot-gap));

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }

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
