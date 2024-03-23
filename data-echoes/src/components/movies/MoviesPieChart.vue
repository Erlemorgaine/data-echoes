<script setup lang="ts">
import type { MovieBarData } from './types/types'

defineProps<{
  segments: MovieBarData[]
  backgroundColor: string
}>()

function generateConicGradient(segments: MovieBarData[]) {
  let conicGradientString: string[] = []
  let startAngle = 0

  segments.forEach((segment) => {
    const endAngle = startAngle + segment.value * 360
    conicGradientString.push(`var(--${segment.id}) ${startAngle}deg ${endAngle}deg`)
    startAngle = endAngle
  })

  return conicGradientString.join(', ')
}
</script>

<template>
  <div class="movies-pie-chart">
    <div
      class="movies-pie-chart__chart"
      :style="{
        '--pie-color': backgroundColor,
        '--gradient-content': generateConicGradient(segments),
      }"
    >
      <div
        v-for="(segment, index) in segments"
        :key="index"
        class="movies-pie-chart__chart__segment"
      />
    </div>

    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.movies-pie-chart {
  --pie-width: 1.75rem;
  --pie-gap: 0.75rem;

  display: flex;
  align-items: flex-start;
  gap: var(--pie-gap);

  &__chart {
    width: var(--pie-width);
    aspect-ratio: 1;
    border-radius: 50%;
    position: relative;
    background-image: conic-gradient(var(--gradient-content));

    &__segment {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: rotate(0deg);
      transform-origin: 50% 50%;
    }
  }
}
</style>
