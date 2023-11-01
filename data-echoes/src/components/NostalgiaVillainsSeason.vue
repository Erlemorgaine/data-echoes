<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import groupBy from 'lodash/groupby'

const props = defineProps({
  villainsPerEpisode: {
    type: Object,
    required: true,
  },
  allEpisodes: {
    type: Object,
    required: true,
  },
  hoveredEpisode: Object,
})

const svgDimensions = {
  width: 1000,
  height: 50,
}
const distanceFromGoodies = 2

const orderedEpisodesWithVillains = ref()

const villainGroups = {
  'mojo-jojo': ['mojo-jojo-30', 'mojo-jojo'],
  him: ['him-30', 'him'],
  'princess-morbucks': ['princess-morbucks-30', 'princess-morbucks'],
  sedusa: ['sedusa-30', 'sedusa'],
  fuzzy: ['fuzzy-30', 'fuzzy'],
  'rowdyruff-boys': ['brick', 'butch', 'boomer'],
  'amoeba-boys': ['amoeba-1', 'amoeba-2', 'amoeba-3'],
  'gangreen-gang': ['gangreen-1', 'gangreen-2', 'gangreen-3', 'gangreen-4', 'gangreen-5'],
}

onMounted(() => {
  const allEpisodes = Object.keys(props.allEpisodes)

  orderedEpisodesWithVillains.value = allEpisodes.map((ep) => ({
    villains: props.villainsPerEpisode[ep] || [],
    episode: ep,
    size: props.allEpisodes[ep].size * svgDimensions.width,
    accumulatedSize: props.allEpisodes[ep].accumulatedSize * svgDimensions.width,
  }))

  orderedEpisodesWithVillains.value = orderedEpisodesWithVillains.value.map(
    (episode, i: number) => ({
      ...episode,
      villains: props.villainsPerEpisode[episode.episode]
        ? props.villainsPerEpisode[episode.episode].map((villain) => {
            const nextOccurrenceVillainIndex = allEpisodes.findIndex(
              (e, nextI) =>
                nextI > i &&
                props.villainsPerEpisode[e] &&
                props.villainsPerEpisode[e].find((vill) => vill.villain === villain.villain),
            )

            const epsBetweenOccurrences =
              nextOccurrenceVillainIndex < 0
                ? null
                : allEpisodes.slice(i, nextOccurrenceVillainIndex)

            // const sizeBetweenOccurrences = epsBetweenOccurrences?.reduce(
            //   (prev, next) => prev + props.allEpisodes[next].size * svgDimensions.width,
            //   0,
            // )

            const lastOccurrenceAccumulatedSize = epsBetweenOccurrences
              ? props.allEpisodes[epsBetweenOccurrences[epsBetweenOccurrences.length - 1]]
                  .accumulatedSize *
                  svgDimensions.width -
                episode.accumulatedSize
              : episode.size

            return {
              ...villain,
              villainColorName: villain.villain.replaceAll(' ', '-'),
              nrEpisodesBetweenOccurrences: epsBetweenOccurrences?.length,
              sizeBetweenOccurrences: lastOccurrenceAccumulatedSize || episode.size,
              singleOccurrence: !epsBetweenOccurrences,
            }
          })
        : [],
    }),
  )
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
        <g
          v-for="(episode, i) of orderedEpisodesWithVillains"
          :key="'ep-' + episode.episode"
          y="10"
          :x="i * 40"
        >
          <!-- <rect
            v-for="(villain, villainIndex) of episode.villains"
            :key="villain.villain"
            :width="episode.size"
            height="5"
            :y="15 + villainIndex * 10"
            :x="i * 40"
            :fill="`url(#${villain.villain})`"
            :opacity="hoveredEpisode && hoveredEpisode.episode !== episode.episode ? 0.3 : 1"
          /> -->

          <path
            v-for="(villain, villainIndex) of episode.villains"
            :key="villain.villain"
            :width="episode.size"
            :d="`M ${episode.accumulatedSize} ${distanceFromGoodies}
                 C ${episode.accumulatedSize} ${
                   distanceFromGoodies +
                   3 * (episode.villains.length - villainIndex + 1) +
                   3 * (villain.nrEpisodesBetweenOccurrences || 0)
                 }, 
                 ${episode.accumulatedSize + villain.sizeBetweenOccurrences} ${
                   distanceFromGoodies +
                   3 * (episode.villains.length - villainIndex + 1) +
                   3 * (villain.nrEpisodesBetweenOccurrences || 0)
                 }, 
                 ${
                   episode.accumulatedSize + villain.sizeBetweenOccurrences
                 } ${distanceFromGoodies}`"
            :fill="villain.singleOccurrence ? `url(#${villain.villainColorName})` : 'transparent'"
            :stroke="`url(#${villain.villainColorName})`"
            stroke-width="1"
            :opacity="hoveredEpisode && hoveredEpisode.episode !== episode.episode ? 0.3 : 1"
          />
        </g>
      </g>

      <defs>
        <linearGradient v-for="(gang, gangName) in villainGroups" :key="gangName" :id="gangName">
          <stop
            v-for="(villain, i) in gang"
            :key="villain"
            :offset="(gang.length > 1 ? 0 + (100 / (gang.length - 1)) * i : 0) + '%'"
            :stop-color="`var(--${villain})`"
          />
        </linearGradient>
      </defs>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.nostalgia-villains-season {
  width: var(--season-width);

  svg {
    overflow: visible;
  }
}
</style>
