<script setup lang="ts">
import type { MoviePerson } from './types/types.ts'

defineProps<{ title: string; nominees: MoviePerson[] }>()
</script>

<template>
  <figure class="movies-dot-chart">
    <figcaption class="movies-dot-chart__title">{{ title }}</figcaption>

    <ul class="movies-dot-chart__chart">
      <li
        v-for="nominee of nominees"
        :key="`${nominee.name}-${nominee.year}`"
        :style="{ '--origin-color': `var(--${nominee.origin})` }"
      >
        <button :aria-label="nominee.name" class="dot">
          <div v-if="nominee.won" class="won" />
        </button>
      </li>
    </ul>
  </figure>
</template>

<style scoped lang="scss">
.movies-dot-chart {
  &__title {
    font-weight: 900;
    font-size: 0.85rem;
    padding-bottom: 0.1rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    text-align: center;
  }

  &__chart {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
}
</style>
