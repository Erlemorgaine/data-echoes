<script setup lang="ts">
import villainsAll from '../assets/data/7-nostalgia/villains_all.json'
import villainsSeasons from '../assets/data/7-nostalgia/villains_seasons.json'
import villainEpisodes from '../assets/data/7-nostalgia/villains_episodes.json'

import goodAll from '../assets/data/7-nostalgia/good_all.json'
import goodSeasons from '../assets/data/7-nostalgia/good_seasons.json'
import goodEpisodes from '../assets/data/7-nostalgia/good_episodes.json'

import allEpisodes from '../assets/data/7-nostalgia/all_episodes.json'
import allSeasons from '../assets/data/7-nostalgia/all_seasons.json'

// import groupBy from 'lodash/groupby'
import sumBy from 'lodash/sumBy'
import { groupBy } from 'lodash'
import { computed, onMounted, ref } from 'vue'

import NostalgiaLegend from './NostalgiaLegend.vue'
import NostalgiaBubble from './NostalgiaBubble.vue'
import NostalgiaVillainsSeason from './NostalgiaVillainsSeason.vue'
import NostalgiaBarChart from './NostalgiaBarChart.vue'
import NostalgiaIntro from './NostalgiaIntro.vue'

import '../assets/scss/nostalgia.scss'

// Types
type Speaker = {
  speaker: string
  episode: string
  word_count_for_line: number
}

type EpisodeSpeakers =
  | Speaker[]
  | {
      speakers: Speaker[]
      sum: number
    }

type Episode = {
  [episodeNr: string]: {
    title: string
    speakers: Speaker[]
    sum: number
    size?: Number
    accumulatedSize?: Number
  }
}

type Season = {
  [season: string]: Episode
}

type SeasonalSpeakers = {
  [speaker: string]: number
}

type SpeakersAndTotal = {
  speakers: SeasonalSpeakers
  total: number
  totalKeySpeakers?: number
}

type SeasonWithSum = {
  [season: string]: SpeakersAndTotal
}

type SpeakersPerSeason = {
  [season: string]: { speaker: string; amount: number; size: number }[]
}

// TODO: Later on, experiment also with mayor, Ms Keane, Ms Bellum
const keySpeakers = ['blossom', 'bubbles', 'buttercup', 'professor', 'narrator']
const villains = villainsAll.map((v) => v.villain.trim())

const villainGroups = {
  'mojo-jojo': ['mojo-jojo-30', 'mojo-jojo'],
  him: ['him-30', 'him'],
  'princess-morbucks': ['princess-morbucks-30', 'princess-morbucks'],
  sedusa: ['sedusa-30', 'sedusa'],
  fuzzy: ['fuzzy-30', 'fuzzy'],
  'rowdyruff-boys': ['brick', 'butch', 'boomer'],
  'amoeba-boys': ['amoeba-1', 'amoeba-2', 'amoeba-3'],
  'gangreen-gang': ['gangreen-1', 'gangreen-2', 'gangreen-3', 'gangreen-4', 'gangreen-5'],
  'smith-family': ['marianne', 'harold', 'julie', 'bud'],
}

const seasonsWithEpisodes = ref<Season>({})
const seasonsWithSum = ref<SeasonWithSum>({})
const seasonsLastEpisode = ref<{ [season: string]: string }>({})
const totalSum = ref<number>(0)
const maxSeasonSum = ref<number>(0)
const titleTransform = ref({ scale: 1, translate: '0rem' })
const legendShown = ref(false)

const hoveredEpisode = ref<{ season: number; episode: string } | null>(null)
const hoveredSeasonSpeaker = ref<{ season: number; speaker: string } | null>(null)
const hoveredSpeaker = ref<{ speaker: string; isVillain: boolean }>()

const seasonChartGoodSpeakers = computed(() => {
  const speakersPerSeason: SpeakersPerSeason = {}

  Object.keys(seasonsWithSum.value).forEach((season) => {
    const total = seasonsWithSum.value[season].totalKeySpeakers || 1

    speakersPerSeason[season] = keySpeakers.map((speaker) => ({
      speaker,
      amount: seasonsWithSum.value[season].speakers[speaker],
      size: Math.round((seasonsWithSum.value[season].speakers[speaker] / total) * 100) / 100,
    }))

    speakersPerSeason[season].sort((a, b) => b.size - a.size)
  })

  return speakersPerSeason
})

const seasonChartAllSpeakers = computed(() => {
  const speakersPerSeason: SpeakersPerSeason = {}

  Object.entries(allSeasons).forEach(([season, total]) => {
    if (seasonChartGoodSpeakers.value[season]) {
      speakersPerSeason[season] = [
        ...keySpeakers.map((speaker) => ({
          speaker,
          amount: seasonsWithSum.value[season].speakers[speaker],
          size: Math.round((seasonsWithSum.value[season].speakers[speaker] / total) * 100) / 100,
        })),
        ...villains
          .map((speaker) => ({
            speaker,
            amount: villainsSeasons[season][speaker] || 0,
            size: Math.round((seasonsWithSum.value[season].speakers[speaker] / total) * 100) / 100,
          }))
          .filter((speaker) => !!speaker.amount),
      ]

      speakersPerSeason[season].sort((a, b) => b.size - a.size)
    }
  })

  return speakersPerSeason
})

onMounted(() => {
  window.addEventListener('scroll', getTitleTransform)
  seasonsWithSum.value = goodSeasons

  // seasonsWithEpisodes.value = groupBy(goodEpisodes, 'season')

  // Object.keys(seasonsWithEpisodes.value).forEach((season) => {
  //   seasonsWithEpisodes.value[season] = groupBy(seasonsWithEpisodes.value[season], 'episode_nr')
  // })

  // Object.keys(seasonsWithEpisodes.value).forEach((season) => {
  //   Object.keys(seasonsWithEpisodes.value[season]).forEach((episode) => {
  //     seasonsWithEpisodes.value[season][episode].sort(
  //       (a, b) => keySpeakers.indexOf(a.speaker) - keySpeakers.indexOf(b.speaker),
  //     )
  //   })
  // })

  // console.log(seasonsWithEpisodes.value)

  // const villains = groupBy(villainEpisodes, 'season')

  // Object.keys(villains).forEach((season) => {
  //   villains[season] = groupBy(villains[season], 'episode_nr')
  // })

  // Object.keys(villains).forEach((season) => {
  //   Object.keys(villains[season]).forEach((episode) => {
  //     villains[season][episode].sort(
  //       (a, b) => keySpeakers.indexOf(a.speaker) - keySpeakers.indexOf(b.speaker),
  //     )
  //   })
  // })

  // console.log(villains)

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

  // Get sum per episode
  Object.keys(goodEpisodes).forEach((season) => {
    type SeasonKey = keyof typeof goodEpisodes
    const seasonData: { [key: string]: EpisodeSpeakers } = goodEpisodes[season as SeasonKey]

    Object.keys(seasonData).forEach((episode) => {
      type EpisodeKey = keyof typeof seasonData

      seasonData[episode as EpisodeKey] = {
        title: seasonData[episode as EpisodeKey][0].episode,
        speakers: seasonData[episode as EpisodeKey] as Speaker[],
        sum: sumBy(
          seasonData[episode as EpisodeKey].filter((good: Speaker) =>
            keySpeakers.includes(good.speaker),
          ),
          'word_count_for_line',
        ),
      }

      // Loop towards last episode
      seasonsLastEpisode.value[season] = episode
    })

    goodEpisodes[season as SeasonKey] = getEpisodesWithAccumulatedSize(
      seasonData as Episode,
      season,
    )
  })

  seasonsWithEpisodes.value = goodEpisodes as unknown as Season

  totalSum.value = sumBy(
    goodAll.filter((good) => keySpeakers.includes(good.speaker)),
    'word_count_for_line',
  )
})

// function getSeasonsSize() {
//   return goodSeasons.reduce((prev, next) => {
//     if (prev[next.season]) {
//       prev[next.season].total += next.word_count_for_line
//       prev[next.season].speakers = {
//         ...prev[next.season].speakers,
//         [next.speaker]: next.word_count_for_line,
//       }
//     } else {
//       prev[next.season] = {
//         speakers: { [next.speaker]: next.word_count_for_line },
//         total: next.word_count_for_line,
//       }
//     }

//     return prev
//   }, {})
// }

function getSeasonSize(seasonNr: string | number) {
  return (seasonsWithSum.value[seasonNr].totalKeySpeakers || 1) / maxSeasonSum.value
}

function getEpisodesWithAccumulatedSize(allEpisodes: Episode, seasonNr: string | number) {
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

function getSpeakersWithAccumulatedSize(allSpeakers: Speaker[], episodeSum: number) {
  const keySpeakersData = allSpeakers.filter((speaker) => keySpeakers.includes(speaker.speaker))

  return keySpeakersData.map((speaker, i) => {
    const previousSpeakersAccumulation = keySpeakersData
      .slice(0, i)
      .reduce((prev, next) => prev + next.word_count_for_line / episodeSum, 0)

    const nextSpeakersAccumulation = keySpeakersData
      .slice(i + 1)
      .reduce((prev, next) => prev + next.word_count_for_line / episodeSum, 0)

    const size = speaker.word_count_for_line / episodeSum

    return {
      ...speaker,
      childrenPercentage:
        // * 70 because we will use it in an radial gradient, and radial gradients calculate the outer circle from the square element's corners instead of its edges
        Math.round((nextSpeakersAccumulation / (size + nextSpeakersAccumulation)) * 70) + '%',
      accumulatedSize: 1 - previousSpeakersAccumulation,
      size: Math.round(size * 100),
    }
  })
  // return speakerCount / episodeSum
}

function getTitleTransform() {
  titleTransform.value.scale =
    Math.max(Math.pow((window.innerHeight - window.scrollY) / window.innerHeight, 1.95), 0.75) ||
    0.75

  titleTransform.value.translate = (1 - titleTransform.value.scale) * -14 + 'rem'
  legendShown.value = window.scrollY > 100
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
      <div
        class="nostalgia-page__season-wrapper"
        v-for="(episodes, season, seasonIndex) of seasonsWithEpisodes"
        :key="'season' + season"
        :style="{
          '--season-size': getSeasonSize(season),
          '--season-index': seasonIndex,
          '--season-color': `var(--season-${season})`,
          '--last-episode-size': episodes[seasonsLastEpisode[season]].size,
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
            :getSpeakersWithAccumulatedSize="getSpeakersWithAccumulatedSize"
            :hoveredEpisode="hoveredEpisode"
            :hoveredSpeaker="hoveredSpeaker"
            :hoveredSeasonSpeaker="hoveredSeasonSpeaker"
            @onEpisodeHover="hoveredEpisode = $event"
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
          :villainsPerEpisode="villainEpisodes[season]"
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
      />
    </section>
  </div>
</template>

<style>
.nostalgia-page {
  /* Good guys */
  --professor: #484848;
  --professor-50: #48484855;
  --buttercup: #63d540;
  --buttercup-50: #63d54055;
  --bubbles: #66e1fb;
  --bubbles-50: #66e1fb55;
  --blossom: #e382a4;
  --blossom-50: #e382a455;
  --narrator: #f8f6ed;
  --narrator-50: #f8f6ed55;
  --bubbles-yellow: #f6da4a;
  --bubbles-yellow-50: #f6da4a55;
  --bunny: #b487c4;
  --bunny-50: #b487c455;
  --blossom-orange: #e57033;
  --blossom-orange-50: #e5703355;
  --ms-keane: #fcbb64;
  --mayor: #8467a7;
  --ms-bellum: #dd0d0c;

  /* Villains */
  --mojo-jojo: #b4dd19;
  --mojo-jojo-30: #b4dd1933;
  --him: #fe3300;
  --him-30: #fe330033;
  --fuzzy: #f0649d;
  --fuzzy-30: #f0649d33;
  --princess-morbucks: #ffff00;
  --princess-morbucks-30: #ffff0033;
  --brick: #b43026;
  --brick-30: #b4302633;
  --butch: #40854e;
  --butch-30: #40854e33;
  --boomer: #3f65b1;
  --boomer-30: #3f65b133;
  --amoeba-1: #8fe4dd;
  --amoeba-1-30: #8fe4dd33;
  --amoeba-2: #158e98;
  --amoeba-2-30: #158e9833;
  --amoeba-3: #8c999a;
  --amoeba-3-30: #8c999a33;
  --sedusa: #8b1429;
  --sedusa-30: #8b142933;
  --gangreen-1: #bdd93e;
  --gangreen-1-30: #bdd93e33;
  --gangreen-2: #1d7f51;
  --gangreen-2-30: #1d7f5133;
  --gangreen-3: #18429b;
  --gangreen-3-30: #18429b33;
  --gangreen-4: #96459b;
  --gangreen-4-30: #96459b33;
  --gangreen-5: #871a41;
  --gangreen-5-30: #871a4133;
  --marianne: #3d4ba0;
  --marianne-30: #3d4ba033;
  --harold: #c03021;
  --harold-30: #c0302133;
  --julie: #d1b14a;
  --julie-30: #d1b14a33;
  --bud: #418124;
  --bud-30: #41812433;

  --season-1: var(--blossom-50);
  --season-2: var(--bubbles-50);
  --season-3: var(--buttercup-50);
  --season-4: var(--bunny-50);
  --season-5: var(--bubbles-yellow-50);
  --season-6: var(--blossom-orange-50);

  --bg-1: #ffbfba;
  --bg-2: #ffd1cf;
  --bg-3: #ffdde5;
  /* --bg-4: #fff2b0; */
}
</style>

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
  }

  &__season {
    position: relative;
    color: var(--professor);
    width: var(--season-total-width);
    display: flex;
    overflow: hidden;

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
