<script setup lang="ts">
import { onMounted, ref } from 'vue'
import groupBy from 'lodash/groupby'

const props = defineProps({
  villainsPerEpisode: {
    type: Object,
    required: true,
  },
  allEpisodes: {
    type: Object,
    required: true,
  },
})

const svgDimensions = {
  width: 1000,
  height: 100,
}

const orderedEpisodesWithVillains = ref()

onMounted(() => {
  let allEpisodes = Object.keys(props.allEpisodes).map((ep) => +ep)
  allEpisodes.sort((a, b) => a - b)

  orderedEpisodesWithVillains.value = allEpisodes.map((ep) => ({
    villains: props.villainsPerEpisode[ep]
      ? props.villainsPerEpisode[ep].map((villain) => ({
          ...villain,
          villain: villain.villain.replaceAll(' ', '-'),
        }))
      : [],
    episode: ep,
  }))

  console.log(orderedEpisodesWithVillains.value)
})
</script>

<template>
  <div class="nostalgia-villains-season">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`0 0 ${svgDimensions.width} ${svgDimensions.height}`"
      preserveAspectRatio="none"
    >
      <g>
        <rect
          v-for="(episode, i) of orderedEpisodesWithVillains"
          :key="'ep-' + episode.episode"
          width="30"
          height="30"
          y="10"
          :x="i * 40"
          :fill="`var(--${episode.villains[0]?.villain})`"
          :opacity="episode.villains[0] ? 1 : 0"
        />
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.nostalgia-villains-season {
  width: var(--chart-width);
}
</style>
