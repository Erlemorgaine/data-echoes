<script setup lang="ts">
import type { MovieBarData } from './types/types'
import MoviesPieChart from './MoviesPieChart.vue'
import MoviesBarChart from './MoviesBarChart.vue'

defineProps<{
  chartData: MovieBarData[]
  bipcOfTotal: number
  wonOfBipoc: number
  bipocOfWon: number
}>()

const statId = Math.round(Math.random() * 10000)
</script>

<template>
  <p :id="`movie-stats-${statId}`" class="sr-only">General stats for this category</p>
  <ul :aria-labelledby="`movie-stats-${statId}`">
    <!-- <li>
      <ul class="movies-stats__ethnicities">
        <li
          v-for="datum in chartData"
          :key="datum.id"
          :style="{ '--bar-color': `var(--${datum.id})` }"
          class="movies-stats__stat"
        >
          <span class="dot">
            <div class="sr-only">{{ datum.label }}</div>
          </span>
          <span class="value">{{ Math.round(datum.value * 100) }}%</span>
        </li>
      </ul>
    </li> -->

    <MoviesBarChart
      :title="`${Math.round(bipcOfTotal * 100)}% BIPOC`"
      subTitle="out of all nominees"
      :data="
        chartData.map((datum) => ({
          value: datum.value / bipcOfTotal,
          label: datum.label,
          id: datum.id,
        }))
      "
    />

    <MoviesBarChart
      :title="`${Math.round(bipocOfWon * 100)}% BIPOC`"
      subTitle="out of all winners"
      :data="[
        { value: bipocOfWon, id: 'african' },
        { value: 1 - bipocOfWon, id: 'gold' },
      ]"
      noValueLabel
    />

    <MoviesBarChart
      class="movies-stats__bipoc-winners"
      :style="{ '--bar-chart-size': bipocOfWon * 100 + '%' }"
      :title="`${Math.round(wonOfBipoc * 100)}% won`"
      subTitle="out of BIPOC nominees"
      :data="[
        { value: wonOfBipoc, id: 'gold' },
        { value: 1 - wonOfBipoc, id: 'african' },
      ]"
      lowCaption
      noValueLabel
    />
  </ul>
</template>

<style scoped lang="scss">
.movies-stats {
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  // box-shadow: 0.1rem 0.2rem 0.5rem 0.2rem hsla(26, 6%, 51%, 0.75);
  // padding: 0.5rem 0.75rem;
  // background-color: var(--silver-light);

  &__bipoc-winners {
    width: var(--bar-chart-size);
  }
}
</style>
