<script setup lang="ts">
import villainsAll from '../assets/data/7-nostalgia/villains_all.json'
import villainsSeasons from '../assets/data/7-nostalgia/villains_seasons.json'
import villainEpisodes from '../assets/data/7-nostalgia/villains_episodes.json'

import goodAll from '../assets/data/7-nostalgia/good_all.json'
import goodSeasons from '../assets/data/7-nostalgia/good_seasons.json'
import goodEpisodes from '../assets/data/7-nostalgia/good_episodes.json'

// import groupBy from 'lodash/groupby'
import sumBy from 'lodash/sumBy'
import { computed, onMounted, ref } from 'vue'

import NostalgiaLegend from './NostalgiaLegend.vue'

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

// TODO: Later on, experiment also with mayor, Ms Keane, Ms Bellum
const keySpeakers = ['blossom', 'bubbles', 'buttercup', 'professor', 'narrator']

const seasonsWithEpisodes = ref<Season>({})
const seasonsWithSum = ref<SeasonWithSum>({})
const totalSum = ref<number>(0)
const maxSeasonSum = ref<number>(0)

const hoveredEpisode = ref<{ season: number; episode: string } | null>(null)
const hoveredSeasonSpeaker = ref<{ season: number; speaker: string } | null>(null)
const hoveredSpeaker = ref<string>()

const seasonChartSpeakers = computed(() => {
  const speakersPerSeason: {
    [season: string]: { speaker: string; amount: number; size: number }[]
  } = {}

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

onMounted(() => {
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

  // Get sum per episode
  Object.keys(goodEpisodes).forEach((season) => {
    type SeasonKey = keyof typeof goodEpisodes
    const seasonData: { [key: string]: EpisodeSpeakers } = goodEpisodes[season as SeasonKey]

    Object.keys(seasonData).forEach((episode) => {
      type EpisodeKey = keyof typeof seasonData

      seasonData[episode as EpisodeKey] = {
        speakers: seasonData[episode as EpisodeKey] as Speaker[],
        sum: sumBy(
          seasonData[episode as EpisodeKey].filter((good: Speaker) =>
            keySpeakers.includes(good.speaker),
          ),
          'word_count_for_line',
        ),
      }
    })
  })

  seasonsWithEpisodes.value = goodEpisodes as unknown as Season
  totalSum.value = sumBy(
    goodAll.filter((good) => keySpeakers.includes(good.speaker)),
    'word_count_for_line',
  )
  // seasonsWithSum.value = getSeasonsSize()

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

  // console.log(seasonsWithSum.value)
  // console.log(seasonsWithEpisodes.value)
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
</script>

<template>
  <div class="nostalgia-page">
    <h2 class="nostalgia-page__title">
      Talk of the Townsville
      <div class="nostalgia-page__title__sub">The Powerpuff girls, 1998 series</div>
    </h2>

    <section class="nostalgia-page__content">
      <div
        class="nostalgia-page__season-wrapper"
        v-for="(episodes, season, seasonIndex) of seasonsWithEpisodes"
        :key="'season' + season"
        :style="{
          '--season-size': getSeasonSize(season),
          '--season-index': seasonIndex,
          '--season-color': `var(--season-${season})`,
        }"
      >
        <h3 class="nostalgia-page__season-wrapper__title">S{{ season }}</h3>

        <div class="nostalgia-page__season">
          <button
            v-for="(episodeData, episode) of getEpisodesWithAccumulatedSize(episodes, season)"
            :key="'episode' + episode"
            :class="[
              'nostalgia-page__season__episode',
              {
                inactive:
                  hoveredEpisode &&
                  hoveredEpisode.season === season &&
                  hoveredEpisode.episode !== episode,
              },
            ]"
            :style="{
              '--episode-size': episodeData.size,
              '--episode-accumulated-size': episodeData.accumulatedSize * -1,
            }"
            @mouseenter="hoveredEpisode = { season, episode }"
            @focus="hoveredEpisode = { season, episode }"
            @mouseleave="hoveredEpisode = null"
            @blur="hoveredEpisode = null"
          >
            <template
              v-for="speaker of getSpeakersWithAccumulatedSize(
                episodeData.speakers,
                episodeData.sum,
              )"
            >
              <div
                v-if="keySpeakers.includes(speaker.speaker)"
                :key="speaker.speaker"
                :class="[
                  'nostalgia-page__season__episode__speaker',
                  {
                    inactive:
                      (hoveredSeasonSpeaker &&
                        hoveredSeasonSpeaker.season === season &&
                        hoveredSeasonSpeaker.speaker !== speaker.speaker) ||
                      (hoveredSpeaker && hoveredSpeaker !== speaker.speaker),
                    active:
                      (hoveredSeasonSpeaker &&
                        hoveredSeasonSpeaker.season === season &&
                        hoveredSeasonSpeaker.speaker === speaker.speaker) ||
                      (hoveredSpeaker && hoveredSpeaker === speaker.speaker),
                  },
                ]"
                :style="{
                  '--speaker-size': speaker.accumulatedSize,
                  '--speaker-children-size': speaker.childrenPercentage,
                  '--speaker-color': `var(--${speaker.speaker})`,
                  '--speaker-color-50': `var(--${speaker.speaker}-50)`,
                  '--speaker-z-index': keySpeakers.indexOf(speaker.speaker),
                }"
              >
                <span class="nostalgia-page__season__episode__speaker__size">
                  {{ speaker.size + '%' }}
                </span>
              </div>
            </template>
          </button>
        </div>

        <div class="nostalgia-page__season__total-chart">
          <div
            class="nostalgia-page__season__total-chart__speaker"
            v-for="speaker of seasonChartSpeakers[season]"
            :key="speaker.speaker"
            :style="{
              '--bar-color': `var(--${speaker.speaker || 'bunny'})`,
              '--bar-size': speaker.size,
              '--text-color': speaker.speaker === 'professor' ? '#fff' : '#000',
            }"
            @mouseenter="hoveredSeasonSpeaker = { season, speaker: speaker.speaker }"
            @mouseleave="hoveredSeasonSpeaker = ''"
          >
            <span class="nostalgia-page__season__total-chart__speaker__text">
              {{ speaker.speaker }}
              {{ Math.round(speaker.size * 100) }}%
            </span>
          </div>
        </div>
      </div>

      <NostalgiaLegend :keySpeakers="keySpeakers" @onSpeakerHover="hoveredSpeaker = $event" />
    </section>
  </div>
</template>

<style>
.nostalgia-page {
  --off-white: #eeeeee;
  --off-white-50: #eeeeee55;
  --off-white-30: #eeeeee33;
  --off-white-10: #eeeeee11;

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
  // background-image: radial-gradient(var(--bg-1) 33%, var(--bg-2) 33% 67%, var(--bg-3) 67% 100%);

  &__title {
    font-family: PPG;
    font-size: 3rem;
    max-width: 30rem;
    line-height: 100%;
    color: var(--blossom);
    transform: translateX(-0.5rem);
    position: absolute;
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
  &__content {
  }
  &__season-wrapper {
    --season-total-width: 150%;
    --season-width: calc(var(--season-total-width) * var(--season-size));

    position: relative;
    margin-bottom: 1rem;
    padding-left: 1rem;
    // transform: translateX(calc(var(--season-index) * 4%));

    &__title {
      position: absolute;
      font-family: VinaSans;
      color: var(--off-white);
      padding-top: 1rem;
      bottom: -0.25rem;
      left: -1rem;
      font-size: 1.2rem;
      letter-spacing: 0.05em;

      // &:after {
      //   content: '';
      //   background-color: var(--off-white);
      //   width: 1px;
      //   height: 2rem;
      //   position: absolute;
      //   top: 100%;
      //   left: 1.75rem;
      // }
    }
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

    @container season (width > 1px) {
      &__episode {
        font-family: VinaSans;
        color: var(--off-white);
        position: relative;
        width: calc(100% * var(--episode-size));

        aspect-ratio: 1;
        aspect-ratio: 2;
        left: calc(var(--episode-accumulated-size) * 100cqw);
        transition: opacity 0.3s;

        &:focus {
          outline: none;
        }

        &:hover {
          z-index: 10;
        }

        &.inactive {
          opacity: 0.2;
        }

        &__speaker {
          position: absolute;
          top: 50%;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -50%);
          // background-color: var(--speaker-color);
          background-image: radial-gradient(
            transparent 0% var(--speaker-children-size),
            var(--speaker-color) var(--speaker-children-size) 100%
          );
          width: calc(100% * var(--speaker-size));
          aspect-ratio: 1;
          border-radius: 50%;
          z-index: var(--speaker-z-index);
          transition: opacity 0.7s;

          &__size {
            position: absolute;
            bottom: calc(100% + 0.2rem);
            transform: translateX(-35%);
            opacity: 0;
          }

          &.inactive {
            opacity: 0;
          }

          &.active {
            background-image: radial-gradient(
              transparent 5% var(--speaker-children-size),
              var(--speaker-color-50) var(--speaker-children-size),
              var(--speaker-color),
              var(--off-white)
            );

            .nostalgia-page__season__episode__speaker__size {
              opacity: 1;
            }
          }
        }
      }
    }

    &__total-chart {
      width: calc(var(--season-width) * 0.53);
      display: flex;
      font-size: 0.9rem;
      // font-weight: bold;
      text-transform: uppercase;
      line-height: 120%;

      &__speaker {
        font-family: VinaSans;
        background-color: var(--bar-color);
        width: calc(100% * var(--bar-size));
        color: var(--text-color, black);
        padding: 0 0.5rem 0.1rem 0.5rem;
        white-space: nowrap;
        overflow: hidden;
        transform: skew(-35deg);

        &__text {
          transform: skew(35deg);
        }
      }
    }
  }
}
</style>
