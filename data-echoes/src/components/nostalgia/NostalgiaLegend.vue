<script setup>
import { baseUrl } from '../../ultilities/globals'

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
    <div class="nostalgia-legend__cta">Click on a character to see their top episodes</div>

    <div
      v-for="(group, i) of [keySpeakers, villains]"
      :key="'group-' + i"
      :class="['nostalgia-legend__group', { villains: i == 1 }]"
    >
      <button
        v-for="speaker of group"
        :key="'legend-' + speaker"
        :style="{
          '--speaker-color': `var(--${speaker.replaceAll(' ', '-')})`,
          ...(i == 1 ? { '--speaker-gradient': getVillainGradient(speaker) } : {}),
          '--bg-color': `var(--${speaker.replaceAll(' ', '-')}-light, var(--julie))`,
        }"
        @mouseenter="$emit('onSpeakerHover', { speaker, isVillain: i == 1 })"
        @mouseleave="$emit('onSpeakerHover', null)"
        @click="$emit('showSpeakerData', speaker)"
      >
        <div :class="['nostalgia-legend__speaker', speaker]">
          <img
            :src="`${baseUrl}images/nostalgia/small-${speaker.replaceAll(' ', '-')}.webp`"
            alt=""
            class="nostalgia-legend__speaker__img"
          />
          {{ speaker }}
        </div>
      </button>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.nostalgia-legend {
  position: fixed;
  top: 11.5rem;
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

  @include low-screen {
    top: 9rem;
  }

  @include mobile {
    position: relative;
    top: initial;
    right: initial;
    margin-top: 2rem;
  }

  &__group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    @include mobile {
      display: flex;
      flex-direction: column;
    }
  }

  &__speaker {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    // padding-right: 1rem;
    translate: -2rem 0;
    z-index: 1;
    color: #000;

    &.professor {
      color: var(--off-white);
    }
    &:focus {
      outline: none;
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
      transform: skew(-30deg);
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
      width: max(3.5vw, 2.5rem);
      aspect-ratio: 1;
      border: 2px solid var(--speaker-color);
      margin-right: 0.5rem;
      flex-shrink: 0;
      position: relative;
      background-color: var(--off-white);
      object-fit: cover;
      background-color: var(--bg-color);
    }
  }

  &__cta {
    position: absolute;
    right: 0rem;
    top: -1.75rem;
    font-size: 0.8rem;
    font-style: italic;
    font-family: Poppins;
  }
}
</style>
