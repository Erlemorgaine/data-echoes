<script setup>
const props = defineProps({
  keySpeakers: {
    type: Array,
    default: () => [],
  },
  villains: {
    type: Array,
    default: () => [],
  },
  villainGroups: Object,
})

const baseUrl = import.meta.env.MODE === 'development' ? '/' : import.meta.env.BASE_URL

function getVillainGradient(speaker) {
  return (
    props.villainGroups[speaker.replaceAll(' ', '-')].reduce((prev, next, i) => {
      return prev + `, var(--${next.replace('-30', '')})`
    }, 'linear-gradient(-90deg, transparent 20%') + ')'
  )
}
</script>

<template>
  <aside class="nostalgia-legend">
    <div
      v-for="(group, i) of [keySpeakers, villains]"
      :key="'group-' + i"
      :class="['nostalgia-legend__group', { villains: i == 1 }]"
    >
      <div
        class="nostalgia-legend__speaker"
        v-for="speaker of group"
        :key="'legend-' + speaker"
        :style="{
          '--speaker-color': `var(--${speaker.replaceAll(' ', '-')})`,
          ...(i == 1 ? { '--speaker-gradient': getVillainGradient(speaker) } : {}),
        }"
        @mouseenter="$emit('onSpeakerHover', { speaker, isVillain: i == 1 })"
        @mouseleave="$emit('onSpeakerHover', null)"
      >
        <img
          :src="`${baseUrl}images/${speaker.replaceAll(' ', '-')}.webp`"
          alt=""
          class="nostalgia-legend__speaker__img"
        />
        {{ speaker }}
      </div>
    </div>

    <!-- <div class="nostalgia-legend__group">
      <div
        class="nostalgia-legend__speaker"
        v-for="speaker of villains"
        :key="'legend-' + speaker"
        :style="{ '--speaker-color': `var(--${speaker})` }"
        @mouseenter="$emit('onSpeakerHover', speaker)"
        @mouseleave="$emit('onSpeakerHover', '')"
      >
        <img :src="`/images/${speaker}.webp`" alt="" class="nostalgia-legend__speaker__img" />
        {{ speaker }}
      </div>
    </div> -->
  </aside>
</template>

<style lang="scss" scoped>
.nostalgia-legend {
  position: fixed;
  top: 10.25rem;
  right: 2rem;
  padding: 1rem 0.75rem 0.5rem 0.5rem;
  border-radius: 0.2rem;
  font-family: VinaSans;
  color: var(--off-white);
  box-shadow: -2px -2px 5px 1px var(--off-white-30);
  background-color: var(--off-white-10);
  border: 1px solid;
  border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
  filter: drop-shadow(-2px -2px 5px var(--off-white-50));
  display: flex;
  flex-direction: column;
  gap: 3vh;
  transition: opacity 0.5s;

  &__group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  &__speaker {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    // padding-right: 1rem;
    translate: -2rem 0;
    z-index: 1;

    &:focus {
      outline: none;
    }

    &:not(:nth-child(4)) {
      color: #000;
    }

    .villains & {
      color: var(--off-white);
    }

    &::after {
      content: '';
      position: absolute;
      width: calc(100%);
      height: 80%;
      top: 10%;
      left: 1.75rem;
      transform: skew(-35deg);
      background-image: linear-gradient(90deg, var(--speaker-color) 25%, transparent);
      z-index: -1;

      .villains & {
        background: transparent;
        border: 0.2rem solid;
        border-image: var(--speaker-gradient) 30;
      }
    }

    &__img {
      border-radius: 50%;
      width: 3.5vw;
      aspect-ratio: 1;
      border: 2px solid var(--speaker-color);
      margin-right: 0.5rem;
      flex-shrink: 0;
      position: relative;
      background-color: var(--off-white);
      object-fit: cover;
      // object-position: 50% 0%;
    }
  }
}
</style>
