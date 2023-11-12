<script setup lang="ts">
import type { EpisodeContent } from '../types/types'

defineProps<{
  episodeData: EpisodeContent
  episode?: string | number
}>()
</script>

<template>
  <div class="nostalgia-tooltip">
    <span class="nostalgia-tooltip__ep-nr">{{ episode }}</span> {{ episodeData.title }}
  </div>
</template>

<style lang="scss" scoped>
.nostalgia-tooltip {
  position: absolute;
  top: -2.25rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 0.2rem;
  box-shadow: -2px -1px 5px 1px var(--off-white-30);
  background-color: rgb(40, 40, 40);
  border: 1px solid;
  border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
  padding: 0.1rem 0.5rem 0.25rem 0.5rem;
  width: max-content;

  &__ep-nr {
    opacity: 0.7;
    padding-right: 0.25rem;
  }
}
</style>
