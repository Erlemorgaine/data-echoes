<script setup lang="ts">
defineProps<{
  data: { value: number; label?: string; id: string }[]
  title?: string
  subTitle?: string
  large?: boolean
  lowCaption?: boolean
  noValueLabel?: boolean
}>()
</script>

<template>
  <figure :class="['movies-bar-chart', { large, 'low-caption': lowCaption }]">
    <figcaption v-if="title" class="movies-bar-chart__title">
      <span>{{ title }}</span>
      <span v-if="subTitle">{{ subTitle }}</span>
    </figcaption>

    <div class="movies-bar-chart__chart">
      <div
        role="meter"
        v-for="item in data"
        :key="item.label + item.id"
        :class="['movies-bar-chart__chart__bar', item.id]"
        :style="{ '--percentage': item.value * 100 + '%', '--bar-color': `var(--${item.id})` }"
      >
        <span v-if="!noValueLabel">{{ Math.round(item.value * 100) }}%</span>
      </div>
    </div>
  </figure>
</template>

<style scoped lang="scss">
.movies-bar-chart {
  width: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  &.large {
    gap: 0.75rem;
  }

  &.low-caption {
    flex-direction: column-reverse;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }

  &__title {
    span {
      width: max-content;
    }

    span:first-child {
      display: block;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 100%;
    }
  }

  &__chart {
    display: flex;
    overflow: hidden;
    font-size: 0.75rem;

    // .large & {
    box-shadow: 2px 2px 8px 2px color-mix(in srgb, var(--latino), transparent);
    border-radius: 0.25rem;
    // }

    .large & {
      font-size: 0.875rem;
    }

    &__bar {
      height: calc(var(--dot-size) * 0.75);
      width: var(--percentage);
      background-color: var(--bar-color);
      font-weight: 700;
      position: relative;

      .large & {
        height: var(--dot-size);
      }

      &.african,
      &.latino {
        color: var(--white);
      }

      span {
        position: absolute;
        left: 0.25rem;
        bottom: 0rem;
      }
    }
  }
}
</style>
