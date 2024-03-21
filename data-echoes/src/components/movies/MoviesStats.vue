<script setup lang="ts">
import type { MovieBarData } from './types/types'

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

    <!-- TODO: Do add bar charts here, makes it more visually clear -->
    <div class="movies-stats__stat">
      <dd>{{ Math.round(total * 100) }}%</dd>
      <dt>of all nominees</dt>
    </div>

    <div class="movies-stats__stat">
      <dd>{{ Math.round(bipocWon * 100) }}%</dd>
      <dt>of them won</dt>
    </div>
  </dl>
</template>

<style scoped lang="scss">
.movies-stats {
  margin-top: 0.5rem;

  &__ethnicities {
    --dot-size: 1rem;

    display: flex;
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
}
</style>
