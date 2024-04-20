<script setup lang="ts">
import villainsAll from './data/villains_all.json'
import villainEpisodes from './data/villains_episodes.json'
import villainTop from './data/villains_top.json'

import goodAll from './data/good_all.json'
import goodSeasons from './data/good_seasons.json'
import goodEpisodes from './data/good_episodes.json'
import goodTop from './data/good_top.json'

import allEpisodes from './data/all_episodes.json'

// import groupBy from 'lodash/groupby'
import sumBy from 'lodash/sumBy'
import { computed, nextTick, onMounted, ref } from 'vue'

import NostalgiaLegend from './NostalgiaLegend.vue'
import NostalgiaNotation from './NostalgiaNotation.vue'
import NostalgiaBubble from './NostalgiaBubble.vue'
import NostalgiaVillainsSeason from './NostalgiaVillainsSeason.vue'
import NostalgiaBarChart from './NostalgiaBarChart.vue'
import NostalgiaIntro from './NostalgiaIntro.vue'
import NostalgiaEpisodeModal from './NostalgiaEpisodeModal.vue'

import type {
  SpeakersPerSeason,
  Season,
  SeasonWithSum,
  Episode,
  EpisodeSpeakers,
  RawEpisode,
  DataEpisode,
  EpisodeMetaData,
  Speaker,
  HoveredSpeaker,
  SpeakerWithSize,
  ModalData,
  SpeakerModalData,
  Villain,
  TopEpisode,
} from './types/types'

import NostalgiaSources from './NostalgiaSources.vue'
import NostalgiaSpeakerModal from './NostalgiaSpeakerModal.vue'

import './nostalgia.scss'
import { lowScreenHeight } from '@/ultilities/globals'

// TODO: Later on, experiment also with mayor, Ms Keane, Ms Bellum
const keySpeakers = ['blossom', 'bubbles', 'buttercup', 'professor', 'narrator']
const villains = Object.keys(villainsAll)

const villainGroups: { [key: string]: string[] } = {
  'mojo-jojo': ['mojo-jojo-30', 'mojo-jojo'],
  him: ['him-30', 'him'],
  'princess-morbucks': ['princess-morbucks-30', 'princess-morbucks'],
  sedusa: ['sedusa-30', 'sedusa'],
  fuzzy: ['fuzzy-30', 'fuzzy'],
  'rowdyruff-boys': ['brick', 'butch', 'boomer'],
  'amoeba-boys': ['junior', 'slim', 'bossman'],
  'gangreen-gang': ['snake', 'billy', 'ace', 'grubber', 'arturo'],
  'smith-family': ['marianne', 'harold', 'julie', 'bud'],
}

const seasonsWithEpisodes = ref<Season>({})
const seasonsWithSum = ref<SeasonWithSum>({})
const seasonsLastEpisode = ref<{ [season: string]: string }>({})
const totalSum = ref<number>(0)
const maxSeasonSum = ref<number>(0)
const titleTransform = ref({ scale: 1, translate: '0rem' })
const legendShown = ref(false)
const episodeModalData = ref<ModalData>(null)
const speakerModalData = ref<SpeakerModalData>(null)

const hoveredEpisode = ref<{ season: number | string; episode: string | number } | null>(null)
const hoveredSeasonSpeaker = ref<{ season: number | string; speaker: string } | null>(null)
const hoveredSpeaker = ref<HoveredSpeaker>()

const seasonChartGoodSpeakers = computed(() => {
  const speakersPerSeason: SpeakersPerSeason = {}

  Object.keys(seasonsWithSum.value).forEach((season) => {
    const total = seasonsWithSum.value[season].totalKeySpeakers || 1

    speakersPerSeason[season] = keySpeakers.map((speaker) => ({
      speaker,
      amount: seasonsWithSum.value[season].speakers[speaker],
      size: Math.round((seasonsWithSum.value[season].speakers[speaker] / total) * 100) / 100,
    }))

    speakersPerSeason[season].sort((a: SpeakerWithSize, b: SpeakerWithSize) => b.size - a.size)
  })

  return speakersPerSeason
})

onMounted(() =>
  nextTick(() => {
    window.addEventListener('scroll', getTitleTransform)
    seasonsWithSum.value = goodSeasons

    // Calculate sum of key speakers for seasons
    Object.keys(goodSeasons).forEach((season) => {
      type SeasonKey = keyof typeof goodSeasons

      const seasonWithSum = seasonsWithSum.value[season as SeasonKey]
      const keySpeakerSum = Object.keys(seasonWithSum.speakers)
        .filter((speaker) => keySpeakers.includes(speaker))
        .reduce((prev, next) => prev + seasonWithSum.speakers[next], 0)

      seasonWithSum.totalKeySpeakers = keySpeakerSum
      maxSeasonSum.value = keySpeakerSum > maxSeasonSum.value ? keySpeakerSum : maxSeasonSum.value
    })

    let newSeasons: Season = {}

    // Get sum per episode
    Object.keys(goodEpisodes).forEach((season) => {
      type SeasonKey = keyof typeof goodEpisodes | keyof typeof allEpisodes
      const seasonData: { [key: string]: EpisodeSpeakers } = goodEpisodes[season as SeasonKey]
      const allEpisodesSeasonData: { [key: string]: EpisodeMetaData } =
        allEpisodes[season as SeasonKey]

      Object.keys(seasonData).forEach((episode) => {
        type EpisodeKey = keyof typeof seasonData | keyof typeof allEpisodesSeasonData

        const speakers = seasonData[episode as EpisodeKey] as Speaker[]

        if (speakers.length) {
          seasonData[episode as EpisodeKey] = {
            title: speakers[0].episode,
            speakers,
            sum: sumBy(
              (seasonData[episode as EpisodeKey] as Speaker[]).filter(
                (good: Speaker) => good.speaker && keySpeakers.includes(good.speaker),
              ),
              'word_count_for_line',
            ),
            size: 0,
            totalEpisodeSum: allEpisodesSeasonData[episode as EpisodeKey]?.word_count_for_line,
          }

          // Loop towards last episode
          seasonsLastEpisode.value[season] = episode
        }
      })

      newSeasons[season as SeasonKey] = getEpisodesWithAccumulatedSize(
        seasonData as Episode,
        season,
      )
    })

    seasonsWithEpisodes.value = newSeasons

    totalSum.value = sumBy(
      Object.keys(goodAll).filter((speaker) => keySpeakers.includes(speaker)),
      'word_count_for_line',
    )
  }),
)

function getSeasonSize(seasonNr: string | number) {
  return (seasonsWithSum.value[seasonNr].totalKeySpeakers || 1) / maxSeasonSum.value
}

function getEpisodesWithAccumulatedSize(allEpisodes: Episode, seasonNr: string | number): Episode {
  const episodes = { ...allEpisodes }
  let previousAccumulation = 0

  Object.keys(episodes).forEach((episode) => {
    const size = episodes[episode].sum / (seasonsWithSum.value[seasonNr].totalKeySpeakers || 1)
    episodes[episode].size = size

    episodes[episode].accumulatedSize = previousAccumulation
    previousAccumulation += size * 0.5
  })

  return episodes
}

function getTitleTransform() {
  const smallScale = window.innerHeight < lowScreenHeight ? 0.6 : 0.75

  titleTransform.value.scale =
    Math.max(
      Math.pow((window.innerHeight - window.scrollY) / window.innerHeight, 1.95),
      smallScale,
    ) || smallScale

  titleTransform.value.translate = (1 - titleTransform.value.scale) * -15 + 'rem'
  legendShown.value = window.scrollY > 100
}

function setModalData({ season, episode }: { season: string; episode: string }) {
  speakerModalData.value = null

  type SeasonKey = keyof typeof allEpisodes

  const goodEps: Episode = seasonsWithEpisodes.value[season as SeasonKey]
  const villainEps: RawEpisode = villainEpisodes[season as SeasonKey]
  const allEps: DataEpisode = allEpisodes[season as SeasonKey]

  type EpisodeKey = keyof typeof goodEps | keyof typeof villainEps | keyof typeof allEps

  episodeModalData.value = {
    season: season || '',
    episodeNr: episode,
    ...allEps[episode as EpisodeKey],
    topSpeakers: goodEps[episode as EpisodeKey].speakers,
    sumEpisode: allEps[episode as EpisodeKey].word_count_for_line || 0,
    imdbLink: allEps[episode as EpisodeKey].imdbLink,
    fandomLink: allEps[episode as EpisodeKey].fandomLink,
  }
}

function setModalDataFromModal(direction: number, season: string, episodeNr: string) {
  type SeasonKey = keyof typeof allEpisodes

  let nextSeason = season
  let nextEpisode = episodeNr
  const seasonEpisodes = Object.keys(allEpisodes[season as SeasonKey])

  const episodeIndex = seasonEpisodes.indexOf(episodeNr)
  const newEpisodeIndex = episodeIndex + direction
  nextEpisode = seasonEpisodes[newEpisodeIndex]

  if (!nextEpisode) {
    if (newEpisodeIndex == -1) {
      nextSeason = (+season - 1).toString()
      const prevSeasonEpisodes = Object.keys(allEpisodes[nextSeason as SeasonKey])
      nextEpisode = prevSeasonEpisodes[prevSeasonEpisodes.length - 1]
    } else {
      nextSeason = (+season + 1).toString()
      nextEpisode = Object.keys(allEpisodes[nextSeason as SeasonKey])[0]
    }
  }

  setModalData({ season: nextSeason, episode: nextEpisode })
}

function getEpisodeVillains(season: string | number, episode: string | number) {
  type SeasonKey = keyof typeof villainEpisodes
  const villainSeason = villainEpisodes[season as SeasonKey]
  type EpisodeKey = keyof typeof villainSeason

  return villainSeason[episode as EpisodeKey]
    ? (villainSeason[episode as EpisodeKey] as Array<Villain>).map((v: Villain) => v.villain)
    : []
}

function onModalClose() {
  episodeModalData.value = null
  hoveredEpisode.value = null
}

function showSpeakerModal(speaker: string) {
  type GoodTopKey = keyof typeof goodTop
  type VillainTopKey = keyof typeof villainTop
  type SeasonKey = keyof typeof seasonsWithEpisodes.value
  type SeasonAllKey = keyof typeof allEpisodes
  type SpeakerKey = keyof typeof goodAll
  type VillainKey = keyof typeof villainsAll

  const speakerTopData = goodTop[speaker as GoodTopKey] || villainTop[speaker as VillainTopKey]

  const topDataWithEpisodeSpeakers = speakerTopData.topEpisodes.map((ep: TopEpisode) => {
    const season = ep.season
    const goodEps: Episode = seasonsWithEpisodes.value[season as SeasonKey]
    const allEps: DataEpisode = allEpisodes[season as SeasonAllKey]

    type EpisodeKey = keyof typeof goodEps

    const speakers = goodEps[ep.episode_nr as EpisodeKey].speakers

    const sumEpisode = allEps[ep.episode_nr as EpisodeKey].word_count_for_line || 0
    const sumTopSpeakers = sumBy(speakers, 'word_count_for_line')
    const othersWordCount = sumEpisode - sumTopSpeakers
    const topSpeakersPlusOthers = [...speakers].map((s) => ({
      speaker: s.speaker,
      word_count_for_line: s.word_count_for_line,
    }))

    if (othersWordCount) {
      topSpeakersPlusOthers.push({
        speaker: 'others',
        word_count_for_line: othersWordCount,
      })
    }
    topSpeakersPlusOthers.sort((a, b) => a.word_count_for_line - b.word_count_for_line)

    return {
      ...ep,
      sumEpisode,
      speakers: topSpeakersPlusOthers,
      speakerAmount: ep.word_count_for_line,
      speakerPercentage: Math.round((ep.word_count_for_line / sumEpisode) * 1000) / 10,
    }
  })

  speakerModalData.value = {
    speaker,
    speakerTotal: goodAll[speaker as SpeakerKey] || villainsAll[speaker as VillainKey],
    imgLink: speakerTopData.imgLink,
    episodes: topDataWithEpisodeSpeakers,
  }
}
</script>

<template>
  <div class="nostalgia-page">
    <h2
      class="nostalgia-page__title"
      :style="{
        '--title-scale': titleTransform.scale,
        '--title-translate': titleTransform.translate,
      }"
    >
      Talk of the Townsville
      <div class="nostalgia-page__title__sub">The Powerpuff girls, 1998-2005 series</div>
    </h2>

    <NostalgiaIntro />

    <section class="nostalgia-page__content">
      <NostalgiaNotation
        text="Each <strong>bar</strong> represents a full <strong>season</strong>. The length of the line is relative to the largest season"
        :position="{ x: '0%', y: '-5rem' }"
        :line1Position="{ x: '0%', y: '100%' }"
        line-height="5rem"
      />

      <NostalgiaNotation
        text="Each <strong>bubble</strong> represents an <strong>episode</strong>. The size of the bubble represents the amount of words spoken by the 5 major speakers"
        :position="{ x: '25%', y: '-7rem' }"
        :line1Position="{ x: '45%', y: '100%' }"
        line-height="3.5rem"
      />

      <NostalgiaNotation
        text="Percentage spoken by the <strong>5 major speakers</strong> in the whole season"
        :position="{ x: '51.5%', y: '-1rem' }"
        :line1Position="{ x: '45%', y: '100%' }"
        :line2Position="{ x: 'calc(45% - 3.75rem)', y: 'calc(100% + 3.75rem)' }"
        line-height="3.75rem"
      />

      <NostalgiaNotation
        text="Each <strong>line color</strong> represents a <strong>villain</strong>. The lines connect the episodes in which this villain speaks"
        :position="{ x: '52%', y: '12%' }"
        :line2Position="{ x: '-2.5rem', y: '0%' }"
        line-height="2rem"
      />

      <NostalgiaNotation
        text="A <strong>single dot</strong> means the villain spoke only in one episode this season"
        :position="{ x: '0%', y: '14.5%' }"
        :line1Position="{ x: '30%', y: '-1.5rem' }"
        line-height="1rem"
      />

      <div
        class="nostalgia-page__season-wrapper"
        v-for="(episodes, season, seasonIndex) of seasonsWithEpisodes"
        :key="'season' + season"
        :style="{
          '--season-size': getSeasonSize(season),
          '--season-index': seasonIndex,
          '--season-color': `var(--season-${season})`,
          '--last-episode-size': episodes[seasonsLastEpisode[season]]?.size || 0,
        }"
      >
        <div class="nostalgia-page__season">
          <NostalgiaBubble
            v-for="(episodeData, episode) of episodes"
            :key="'episode' + episode"
            :episodeData="episodeData"
            :season="season"
            :episode="episode"
            :keySpeakers="keySpeakers"
            :episode-villains="getEpisodeVillains(season, episode)"
            :hoveredEpisode="hoveredEpisode"
            :hoveredSpeaker="hoveredSpeaker"
            :hoveredSeasonSpeaker="hoveredSeasonSpeaker"
            @onEpisodeHover="hoveredEpisode = $event"
            @openModal="setModalData"
            halfBubble
          />
        </div>

        <NostalgiaBarChart
          :seasonChartSpeakers="seasonChartGoodSpeakers[season]"
          :title="`S${season}`"
          :season="season"
          :hoveredSpeaker="hoveredSpeaker"
          @setHoveredSeasonSpeaker="hoveredSeasonSpeaker = $event"
        />

        <!-- TODO: Esthetic of below chart isn't great, maybe work only with borders and white text -->

        <!-- <NostalgiaBarChart
          class=""
          :season-chart-speakers="seasonChartAllSpeakers[season]"
          :season="seasonChartAllSpeakers"
          leftSkewed
        /> -->

        <NostalgiaVillainsSeason
          :allEpisodes="episodes"
          :villainsPerEpisode="villainEpisodes[season as unknown as keyof typeof villainEpisodes]"
          :hoveredEpisode="
            hoveredEpisode && hoveredEpisode.season == season ? hoveredEpisode : null
          "
          :hovered-speaker="hoveredSpeaker"
          :villainGroups="villainGroups"
        />
      </div>

      <NostalgiaLegend
        :class="{ 'legend-hide': !legendShown }"
        :keySpeakers="keySpeakers"
        :villains="villains"
        :villainGroups="villainGroups"
        @onSpeakerHover="hoveredSpeaker = $event"
        @showSpeakerData="showSpeakerModal"
      />

      <NostalgiaEpisodeModal
        :data="episodeModalData"
        @closeModal="onModalClose"
        @navigate="setModalDataFromModal"
      />

      <NostalgiaSpeakerModal
        :data="speakerModalData"
        @closeModal="speakerModalData = null"
        @openEpisodeModal="setModalData"
      />
    </section>

    <NostalgiaSources />
  </div>
</template>

<style scoped lang="scss">
.nostalgia-page {
  padding-bottom: 2rem;
  color: var(--off-white);
  // background-image: radial-gradient(var(--bg-1) 33%, var(--bg-2) 33% 67%, var(--bg-3) 67% 100%);

  @media screen and (min-width: 1440px) {
    padding-left: 3vw;
  }

  &__title {
    font-family: PPG;
    font-size: 3rem;
    max-width: 30rem;
    line-height: 100%;
    color: var(--blossom);
    transform-origin: right bottom;
    transform: translate(-0.5rem, var(--title-translate)) scale(var(--title-scale));
    position: fixed;
    right: 2rem;
    top: 3rem;
    text-align: right;
    z-index: 1;

    &__sub {
      font-family: VinaSans;
      color: var(--off-white);
      font-size: 1.5rem;
      padding-top: 0.5rem;
      letter-spacing: 0.05em;
    }

    @include mobile {
      position: relative;
      font-size: 2rem;
      text-align: left;
      margin: 0 auto;
      top: 1rem;
      right: initial;
      transform: initial;

      &__sub {
        font-size: 1rem;
      }
    }
  }

  &__content {
    position: relative;
  }

  &__season-wrapper {
    --season-total-width: 125%;
    --season-width: calc(var(--season-total-width) * var(--season-size));
    --chart-width: calc(
      var(--season-width) * 0.5 + var(--season-width) * var(--last-episode-size) * 0.5
    ); // TODO: Understand how to better calculate this size (has to do with episodes shift)

    position: relative;
    margin-bottom: 1rem;
    padding-left: 1rem;
    // transform: translateX(calc(var(--season-index) * 4%));

    @include mobile {
      --season-total-width: 200%;
    }
  }

  &__season {
    position: relative;
    color: var(--professor);
    width: var(--season-total-width);
    display: flex;
    // overflow: hidden;

    align-items: center;
    align-items: flex-end;

    padding-top: 1rem;
    width: var(--season-width);
    border-bottom: 0.25rem solid var(--vt-c-black);
    container: season / inline-size;

    &::after {
      content: '';
      position: absolute;
      left: 0%;
      top: 0;
      width: 100vw;
      height: calc(100% + 2.2rem);
      // background-image: linear-gradient(90deg, transparent 30%, var(--season-color));
    }
  }

  .legend-hide {
    opacity: 0;
    pointer-events: none;
  }
}
</style>
