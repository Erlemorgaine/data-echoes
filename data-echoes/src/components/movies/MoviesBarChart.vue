<script setup lang="ts">
defineProps<{
  data: { value: number; label: string; id: string }[]
  title?: string
}>()
</script>

<template>
  <figure class="movies-bar-chart">
    <figcaption>{{ title }}</figcaption>

    <div
      role="meter"
      v-for="item in data"
      :key="item.label"
      class="movies-bar-chart__bar"
      :style="{ '--percentage': item.value * 100 + '%', '--bar-color': `var(--${item.id})` }"
    >
      <!-- {{ item.label }} -->
    </div>
  </figure>
</template>

<style scoped lang="scss">
.movies-bar-chart {
  width: 100%;
  display: flex;

  &__bar {
    height: var(--dot-size);
    width: var(--percentage);
    background-color: var(--bar-color);
  }
}
</style>
