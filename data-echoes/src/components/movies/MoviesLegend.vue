<script setup lang="ts">
import { Origin } from './types/types'

const allOrigins = Object.values(Origin)
</script>

<template>
  <figure class="legend">
    <ul class="legend__items">
      <li
        v-for="origin of allOrigins"
        :key="origin"
        class="legend__items__item"
        :style="{ '--origin-color': `var(--${origin})` }"
      >
        <div class="dot" />
        {{ origin }}
      </li>

      <li class="legend__items__item">
        <div class="won-shadow">
          <div class="won" />
        </div>

        winner
      </li>
    </ul>
  </figure>
</template>

<style scoped lang="scss">
.legend {
  display: flex;
  align-items: center;
  gap: 1rem;

  &__title {
    font-weight: bold;
  }

  &__items {
    display: flex;
    gap: 0.75rem;

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;

      
    }
  }
}
</style>
