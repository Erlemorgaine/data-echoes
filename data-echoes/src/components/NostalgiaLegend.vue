<script setup>
defineProps({
  keySpeakers: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <aside class="nostalgia-legend">
    <div
      class="nostalgia-legend__speaker"
      v-for="speaker of keySpeakers"
      :key="'legend-' + speaker"
      :style="{ '--speaker-color': `var(--${speaker})` }"
      @mouseenter="$emit('onSpeakerHover', speaker)"
      @mouseleave="$emit('onSpeakerHover', '')"
    >
      <img :src="`/images/${speaker}.webp`" alt="" class="nostalgia-legend__speaker__img" />
      {{ speaker }}
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.nostalgia-legend {
  position: fixed;
  top: 15rem;
  right: 2rem;
  padding: 1rem;
  padding-right: 1.5rem;
  border-radius: 0.2rem;
  font-family: VinaSans;
  color: var(--off-white);
  box-shadow: -2px -2px 5px 1px var(--off-white-30);
  background-color: var(--off-white-10);
  border: 1px solid;
  border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
  filter: drop-shadow(-2px -2px 5px var(--off-white-50));

  &__speaker {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-right: 2rem;
    translate: -2rem 0;
    z-index: 1;

    &:not(:nth-child(4)) {
      color: #000;
    }

    &::after {
      content: '';
      position: absolute;
      width: calc(100% + 0.5rem);
      height: 80%;
      top: 10%;
      left: 1.5rem;
      transform: skew(-35deg);
      background-image: linear-gradient(90deg, var(--speaker-color) 25%, transparent);
      z-index: -1;
    }

    &__img {
      border-radius: 50%;
      width: 3rem;
      aspect-ratio: 1;
      border: 2px solid var(--speaker-color);
      margin-right: 1rem;
      flex-shrink: 0;
      position: relative;
      background-color: var(--off-white);
      object-fit: cover;
      // object-position: 50% 0%;
    }
  }
}
</style>
