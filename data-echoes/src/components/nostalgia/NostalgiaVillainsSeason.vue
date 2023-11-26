<script setup lang="ts">
import { onMounted, ref } from 'vue'
// import groupBy from 'lodash/groupby'

import type {
  Episode,
  EpisodeContent,
  VillainsPerEpisode,
  Villain,
  HoveredSpeaker,
} from './types/types'

const props = defineProps<{
  villainsPerEpisode: VillainsPerEpisode
  allEpisodes: Episode
  hoveredEpisode?: { season: string | number; episode: string | number } | null
  hoveredSpeaker?: HoveredSpeaker
  villainGroups: { [key: string]: string[] }
}>()

const svgDimensions = {
  width: 1000,
  height: 30,
}
const distanceFromGoodies = 2
const villainStrokeOffset = 2

const orderedEpisodesWithVillains = ref()

onMounted(() => {
  type EpisodeKey = keyof typeof props.allEpisodes
  type VillainEpisodeKey = keyof typeof props.villainsPerEpisode

  const allEpisodes = Object.keys(props.allEpisodes)
  const occurredPreviously: { [key: string]: string } = {}

  orderedEpisodesWithVillains.value = allEpisodes.map((ep) => {
    const accumulatedSize =
      (props.allEpisodes[ep as EpisodeKey].accumulatedSize || 0) * svgDimensions.width
    const size = (props.allEpisodes[ep as EpisodeKey].size || 0) * svgDimensions.width

    return {
      villains: props.villainsPerEpisode[ep as VillainEpisodeKey] || [],
      episode: ep,
      size,
      accumulatedSize,
      episodeCenter: accumulatedSize + size * 0.5,
      // totalEpisodeSum: props.allEpisodes[ep as EpisodeKey].totalEpisodeSum,
    }
  })

  orderedEpisodesWithVillains.value = orderedEpisodesWithVillains.value.map(
    (episode: EpisodeContent, i: number) => {
      return {
        ...episode,
        villains: props.villainsPerEpisode[episode.episode as VillainEpisodeKey]
          ? props.villainsPerEpisode[episode.episode as VillainEpisodeKey].map(
              (villain: Villain) => {
                const nextOccurrenceVillainIndex = allEpisodes.findIndex(
                  (e, nextI) =>
                    nextI > i &&
                    props.villainsPerEpisode[e as VillainEpisodeKey] &&
                    props.villainsPerEpisode[e as VillainEpisodeKey].find(
                      (vill: Villain) => vill.villain === villain.villain,
                    ),
                )

                const epsBetweenOccurrences =
                  nextOccurrenceVillainIndex < 0
                    ? null
                    : allEpisodes.slice(i, nextOccurrenceVillainIndex + 1)

                const nextEpisodeNr = epsBetweenOccurrences
                  ? epsBetweenOccurrences[epsBetweenOccurrences.length - 1]
                  : null

                const nextOccurrenceEpisode: EpisodeContent | null = epsBetweenOccurrences
                  ? props.allEpisodes[nextEpisodeNr as EpisodeKey]
                  : null

                const nextOccurrenceAccumulatedSize: number = nextOccurrenceEpisode
                  ? (nextOccurrenceEpisode.accumulatedSize || 1) * svgDimensions.width -
                    (episode.accumulatedSize || 0)
                  : episode.size || 0

                const previousOccurrence = occurredPreviously[villain.villain]
                occurredPreviously[villain.villain] = episode.episode as string

                const sizeBetweenOccurrences: number =
                  nextOccurrenceAccumulatedSize || episode.size || 0

                // console.log(villain.word_count_for_line, episode.totalEpisodeSum, episode.size)

                return {
                  ...villain,
                  villainColorName: villain.villain.replaceAll(' ', '-'),
                  nrEpisodesBetweenOccurrences: epsBetweenOccurrences?.length,
                  sizeBetweenOccurrences,
                  singleOccurrence: !epsBetweenOccurrences && !previousOccurrence, // TODO: Don't activate if villain was previous occurrent
                  previousOccurrence,
                  nextOccurrenceCenter: nextOccurrenceEpisode
                    ? (episode.accumulatedSize || 0) +
                      sizeBetweenOccurrences +
                      (nextOccurrenceEpisode?.size || 0) * svgDimensions.width * 0.5
                    : episode.episodeCenter,

                  ...(nextOccurrenceEpisode
                    ? {
                        nextEpisodeNr,
                        nextOccurrenceSize: nextOccurrenceEpisode.size,
                        // startWidth:
                        //   (villain.word_count_for_line / (episode.totalEpisodeSum || 1)) *
                        //   (episode.size || 1),
                        // endWidth:
                        //   (villain.word_count_for_line /
                        //     (nextOccurrenceEpisode.totalEpisodeSum || 1)) *
                        //   (nextOccurrenceEpisode.size || 1),
                      }
                    : {}),
                }
              },
            )
          : [],
      }
    },
  )
})

function getVillainOpacity(villain: string, episode: string, nextEpisode: string = '') {
  if (props.hoveredEpisode) {
    return props.hoveredEpisode.episode === episode || props.hoveredEpisode.episode === nextEpisode
      ? 1
      : 0
  } else if (props.hoveredSpeaker && props.hoveredSpeaker.isVillain) {
    return villain === props.hoveredSpeaker.speaker ? 1 : 0
  }

  return 1
}
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
          <template v-for="(villain, villainIndex) of episode.villains" :key="villain.villain">
            <!-- TODO: Size of circle based on #words spoken -->
            <circle
              v-if="villain.singleOccurrence"
              :cx="episode.episodeCenter"
              :cy="7"
              :r="5"
              :fill="`url(#${villain.villainColorName})`"
              :opacity="getVillainOpacity(villain.villain, episode.episode)"
            ></circle>
            <path
              v-else
              :width="episode.size"
              :d="`M ${episode.episodeCenter} ${distanceFromGoodies}
                 C ${episode.episodeCenter} ${
                   distanceFromGoodies +
                   villainStrokeOffset * (episode.villains.length - villainIndex + 1) +
                   villainStrokeOffset * (villain.nrEpisodesBetweenOccurrences || 0)
                 }, 
                 ${villain.nextOccurrenceCenter} ${
                   distanceFromGoodies +
                   villainStrokeOffset * (episode.villains.length - villainIndex + 1) +
                   villainStrokeOffset * (villain.nrEpisodesBetweenOccurrences || 0)
                 }, 
                 ${villain.nextOccurrenceCenter} ${distanceFromGoodies}`"
              :fill="villain.singleOccurrence ? `url(#${villain.villainColorName})` : 'transparent'"
              :stroke="`url(#${villain.villainColorName})`"
              :stroke-width="2"
              :opacity="getVillainOpacity(villain.villain, episode.episode, villain.nextEpisodeNr)"
            />
            <!-- :stroke-width="villain.startWidth" -->
          </template>
        </g>
      </g>

      <defs>
        <linearGradient
          v-for="(gang, gangName) in villainGroups"
          :key="'gang-' + gangName"
          :id="gangName.toString()"
        >
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
