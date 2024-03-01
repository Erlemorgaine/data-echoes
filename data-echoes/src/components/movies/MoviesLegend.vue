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
        {{ origin }}
      </li>
    </ul>
  </figure>
</template>

<style scoped lang="scss">
.legend {
  &__items {
    display: flex;
    font-size: 0.8rem;
    font-weight: bold;

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--origin-color);
      width: 5rem;
      height: 1.75rem;

      &:first-child {
        border-radius: 1rem 0 0 1rem;
      }

      &:last-child {
        border-radius: 0 1rem 1rem 0;
      }

      &:nth-child(1),
      &:nth-child(2) {
        color: #fff;
      }
    }
  }
}
</style>
