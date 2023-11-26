<script setup lang="ts">
import villainsAll from '../../assets/data/7-nostalgia/villains_all.json'
import villainEpisodes from '../../assets/data/7-nostalgia/villains_episodes.json'
import villainTop from '../../assets/data/7-nostalgia/villains_top.json'

import goodAll from '../../assets/data/7-nostalgia/good_all.json'
import goodSeasons from '../../assets/data/7-nostalgia/good_seasons.json'
import goodEpisodes from '../../assets/data/7-nostalgia/good_episodes.json'
import goodTop from '../../assets/data/7-nostalgia/good_top.json'

import allEpisodes from '../../assets/data/7-nostalgia/all_episodes.json'

// import groupBy from 'lodash/groupby'
import sumBy from 'lodash/sumBy'
import { computed, nextTick, onMounted, ref } from 'vue'

import NostalgiaLegend from './NostalgiaLegend.vue'
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

import '../../assets/scss/nostalgia.scss'
import NostalgiaSources from './NostalgiaSources.vue'
import NostalgiaSpeakerModal from './NostalgiaSpeakerModal.vue'

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
  titleTransform.value.scale =
    Math.max(Math.pow((window.innerHeight - window.scrollY) / window.innerHeight, 1.95), 0.75) ||
    0.75

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

<style lang="scss">
.nostalgia-page {
  /* Good guys */
  --professor: #484848;
  --professor-light: #e0e0e0;
  --professor-50: #48484855;
  --buttercup: #63d540;
  --buttercup-light: #e4ffdc;
  --buttercup-50: #63d54055;
  --bubbles: #66e1fb;
  --bubbles-light: #97e0ef;
  --bubbles-50: #66e1fb55;
  --blossom: #e382a4;
  --blossom-light: #fae1ea;
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
  --him-light: #cf8370;
  --him-30: #fe330033;
  --fuzzy: #f0649d;
  --fuzzy-light: #d5d287;
  --fuzzy-30: #f0649d33;
  --princess-morbucks: #ffff00;
  --princess-morbucks-light: #ffffbc;
  --princess-morbucks-30: #ffff0033;
  --brick: #b43026;
  --brick-30: #b4302633;
  --butch: #40854e;
  --butch-30: #40854e33;
  --boomer: #3f65b1;
  --boomer-30: #3f65b133;
  --rowdyruff-boys: #40854e;
  --rowdyruff-boys-light: #d6bc8a;
  --junior: #8fe4dd;
  --junior-30: #8fe4dd33;
  --slim: #158e98;
  --slim-30: #158e9833;
  --bossman: #8c999a;
  --bossman-30: #8c999a33;
  --amoeba-boys: #158e98;
  --amoeba-boys-light: #b9ede9;
  --sedusa: #8b1429;
  --sedusa-light: #da9ea9;
  --sedusa-30: #8b142933;
  --snake: #bdd93e;
  --snake-30: #bdd93e33;
  --billy: #1d7f51;
  --billy-30: #1d7f5133;
  --ace: #18429b;
  --ace-30: #18429b33;
  --grubber: #96459b;
  --grubber-30: #96459b33;
  --arturo: #871a41;
  --arturo-30: #871a4133;
  --gangreen-gang: #96459b;
  --marianne: #3d4ba0;
  --marianne-30: #3d4ba033;
  --harold: #c03021;
  --harold-30: #c0302133;
  --julie: #d1b14a;
  --julie-30: #d1b14a33;
  --bud: #418124;
  --bud-30: #41812433;
  --smith-family: #d1b14a;

  --others: #f3b0b2;
  --roach-coach: #6f4f4b;
  --253: #ca4328;
  --octi: #9894ca;
  --boogie-man: #74849c;
  --major-man: #f2c588;
  --rainbow: #dc557e;
  --wednesday: #dec2b4;
  --lenny: #fbe1e5;
  --whitfield: #5b7c9a;
  --ruler: #386d32;
  --sandman: #8c96cd;
  --reporter: #7198bc;
  --mike: #b87843;
  --mary: #d086a2;
  --mastermind: #6e1111;
  --captain: #3d53ab;
  --lefty: #a01a17;
  --mitch: #7e331e;
  --cop: #0e62b1;
  --thief: #912222;
  --femme-fatale: #576595;
  --bernie: #ceaf30;
  --teacher: #bd700c;
  --major-glory: #2f4ba8;
  --shaquille: #7e321e;
  --dick: #dbc56b;
  --robin: #027e98;
  --monster: #6b9015;
  --talking-dog: #dadbd6;
  --mr-green: #b2c14b;
  --gnome: #f75e61;
  --guide: #a9f1ff;
  --brian: #b49a69;
  --stanley: #7cc790;
  --sandra: #cb385a;
  --max: #efe9c4;
  --mopey: #994f99;
  --karr: #cfecee;
  --master: #f4bc09;
  --farouk: #536d82;
  --mask-scara: #b1a6d4;
  --governor: #7e3d2c;
  --crack: #c61624;
  --mr-willy: #f7992f;
  --madame-argentina: #fae447;

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
