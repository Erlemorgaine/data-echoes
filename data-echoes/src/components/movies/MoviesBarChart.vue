<script setup lang="ts">
defineProps<{
  data: { value: number; label: string; id: string }[]
  title?: string
}>()
</script>

<template>
  <figure class="movies-bar-chart">
    <figcaption class="movies-bar-chart__title">{{ title }}</figcaption>

    <div class="movies-bar-chart__chart">
      <div
        role="meter"
        v-for="item in data"
        :key="item.label"
        :class="['movies-bar-chart__chart__bar', item.id]"
        :style="{ '--percentage': item.value * 100 + '%', '--bar-color': `var(--${item.id})` }"
      >
        {{ Math.round(item.value * 100) }}%
      </div>
    </div>
  </figure>
</template>

<style scoped lang="scss">
.movies-bar-chart {
  width: 100%;
  margin-top: 2rem;

  &__title {
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  &__chart {
    font-size: 0.875rem;
    display: flex;
    box-shadow: 2px 2px 8px 2px var(--latino);
    border-radius: 0.5rem;
    overflow: hidden;

    &__bar {
      height: var(--dot-size);
      width: var(--percentage);
      background-color: var(--bar-color);
      font-weight: 700;
      padding-left: 0.25rem;
      padding-top: 0.2rem;

      &.african,
      &.latino {
        color: var(--white);
      }
    }
  }
}
</style>
