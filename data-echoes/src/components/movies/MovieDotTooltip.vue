<script setup lang="ts">
import { computed } from 'vue'
import type { MoviePerson } from './types/types'

const props = defineProps<{
  dotData: MoviePerson
}>()

const tooltipData = computed(() => [
  { label: 'Actor', value: props.dotData.name },
  { label: 'Movie', value: props.dotData.movie },
  { label: 'Year', value: props.dotData.year },
])
</script>

<template>
  <div class="movies-tooltip" aria-live="polite">
    <dl class="movies-tooltip__content">
      <div v-for="datum of tooltipData" :key="datum.label" class="movies-tooltip__content__datum">
        <dt>{{ datum.label }}:</dt>
        <dd>{{ datum.value }}</dd>
      </div>
    </dl>
  </div>
</template>

<style lang="scss" scoped>
.movies-tooltip {
  text-align: left;
  position: absolute;
  font-size: 0.875rem;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--black);
  border-top: 0.3rem solid;
  padding: 0.25rem 0.75rem;
  width: max-content;
  color: var(--white);
  box-shadow: -2px -1px 5px 1px var(--off-black-30);
  border-image: linear-gradient(
      -45deg,
      var(--black) 5%,
      var(--white) 5% 10%,
      var(--black) 10% 15%,
      var(--white) 15% 20%,
      var(--black) 20% 25%,
      var(--white) 25% 30%,
      var(--black) 30% 35%,
      var(--white) 35% 40%,
      var(--black) 40% 45%,
      var(--white) 45% 50%,
      var(--black) 50% 55%,
      var(--white) 55% 60%,
      var(--black) 60% 65%,
      var(--white) 65% 70%,
      var(--black) 70% 75%,
      var(--white) 75% 80%,
      var(--black) 80% 85%,
      var(--white) 85% 90%,
      var(--black) 90% 95%,
      var(--white) 95%
    )
    1;

  &__content {
    max-width: 15rem;

    &__datum {
      display: flex;

      dt {
        font-weight: 700;
        width: 4rem;
        flex-shrink: 0;
      }
    }
  }
}
</style>
