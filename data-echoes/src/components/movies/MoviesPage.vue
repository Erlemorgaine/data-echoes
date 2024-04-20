<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MovieBarData, MoviePerson, MoviePersonKey } from './types/types'

import actors from './data/Academy_Award_for_Best_Actor.json'
import actresses from './data/Academy_Award_for_Best_Actress.json'
import directors from './data/Academy_Award_for_Best_Director.json'
import supportingActors from './data/Academy_Award_for_Best_Supporting_Actor.json'
import supportingActresses from './data/Academy_Award_for_Best_Supporting_Actress.json'
import generalStats from './data/movie-stats.json'

import MoviesDotChart from './MoviesDotChart.vue'
import MoviesLegend from './MoviesLegend.vue'
import MoviesStats from './MoviesStats.vue'
import USAChart from './USAChart.vue'

import './movies.scss'

type StatKey = keyof typeof generalStats

const sortKeys: MoviePersonKey[] = ['year', 'origin', 'name']
const sortOrderKeys = ['won', 'origin', 'year', 'name']

const categories = ref<{ id: StatKey; title: string; data: MoviePerson[] }[]>([
  { id: 'director', title: 'Best Director', data: directors as MoviePerson[] },
  { id: 'actor', title: 'Best Actor', data: actors as MoviePerson[] },
  { id: 'actress', title: 'Best Actress', data: actresses as MoviePerson[] },
  {
    id: 'supportingActor',
    title: 'Best Supporting Actor',
    data: supportingActors as MoviePerson[],
  },
  {
    id: 'supportingActress',
    title: 'Best Supporting Actress',
    data: supportingActresses as MoviePerson[],
  },
])

const ethnicityLabels: Record<string, string> = {
  fractionTotal: 'Total',
  fractionAfrican: 'African',
  fractionAsian: 'Asian',
  fractionLatino: 'Latino',
  fractionWonOfBIPOC: 'WonOfBIPOC',
  fractionBIPOCOfWon: 'BIPOCOfWon',
}

const sortKey = ref<MoviePersonKey>('year')
sortData(sortKey.value)

watch(sortKey, sortData)

// TODO: I want to know how the data compares to the general american population
// https://en.wikipedia.org/wiki/Race_and_ethnicity_in_the_United_States

// TODO: What about middle eastern or native american? Add OTHER category
// TODO: Let balls fly in, and animate order
// TODO: Tooltip for each datapoint
// TODO: After each dot chart, write some insights.

function sortData(key: MoviePersonKey) {
  // Remove the provided key from the sortOrder array
  const secondaryKeys = sortOrderKeys.filter((k) => k !== key)

  const compareValues = (a: string | number | boolean, b: string | number | boolean) => {
    if (typeof a === 'string' && typeof b === 'string') {
      return a.localeCompare(b)
    } else {
      if (a < b) return -1
      if (a > b) return 1
    }
    return 0
  }

  const sortFunction = (a: MoviePerson, b: MoviePerson) => {
    // Primary sort
    let result = compareValues(a[key], b[key])
    if (result !== 0) return result

    // Secondary sort based on remaining keys
    for (let i = 0; i < secondaryKeys.length; i++) {
      const secondaryKey = secondaryKeys[i] as MoviePersonKey
      result = compareValues(a[secondaryKey], b[secondaryKey])
      if (result !== 0) return result
    }

    // Equal according to all criteria
    return 0
  }

  // Return the sorted array
  categories.value.forEach((category) => {
    category.data.sort(sortFunction)
  })
}

function getGeneralCategoryStats(categoryId: StatKey): MovieBarData[] {
  const statsArray = Object.entries(generalStats[categoryId])
    .filter(([key]) => !['fractionWonOfBIPOC', 'fractionBIPOCOfWon', 'fractionTotal'].includes(key))
    .map(([key, value]) => ({
      value: value as number,
      label: ethnicityLabels[key],
      id: key.replace('fraction', '').toLowerCase(),
    }))

  statsArray.sort((a, b) => b.value - a.value)

  return statsArray
}
</script>

<template>
  <div class="movie-page">
    <h2 class="movie-page__title">#OscarsSo<span>White</span></h2>

    <div class="movie-page__top">
      <MoviesLegend />

      <div role="group" class="movie-page__sort-options">
        <legend>Sort data by</legend>

        <label v-for="option of sortKeys" :key="option">
          <input
            type="radio"
            name="sort"
            v-model="sortKey"
            :value="option"
            :checked="sortKey === option"
          />

          {{ option }}
        </label>
      </div>
    </div>

    <section class="movie-page__categories">
      <h3 class="sr-only">Nominees for categories that get the most media visibility</h3>
      <div
        v-for="category in categories"
        :key="category.id"
        class="movie-page__categories__category"
      >
        <MoviesDotChart :title="category.title" :nominees="category.data" />

        <MoviesStats
          :chartData="getGeneralCategoryStats(category.id)"
          :bipcOfTotal="generalStats[category.id].fractionTotal || 0"
          :wonOfBipoc="generalStats[category.id].fractionWonOfBIPOC || 0"
          :bipocOfWon="generalStats[category.id].fractionBIPOCOfWon || 0"
        />
      </div>
    </section>

    <USAChart :stats="generalStats.USA" />
  </div>
</template>

<style scoped lang="scss">
.movie-page {
  background-color: var(--silver);
  padding-bottom: 2rem;
  max-width: 75rem;
  margin: 0 auto;

  &__title {
    text-align: center;
    margin-bottom: 1rem;
    font-family: Miltonian;
    font-size: 2rem;

    span {
      color: #fff;
    }
  }

  &__top {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5vw;
    margin: 0 auto;
    margin-bottom: 1.75rem;
    // background-color: var(--white-20);
    padding: 1rem;
    width: fit-content;
    // border: 4px solid var(--white-50);
    border-radius: 1rem;
  }

  &__sort-options {
    --border-image: conic-gradient(
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
    );

    display: flex;
    align-items: center;

    legend {
      font-weight: bold;
      margin-right: 1rem;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      margin-right: 0.75rem;

      input[type='radio'] {
        -webkit-appearance: none;
        appearance: none;
        cursor: pointer;
        width: 1.25rem;
        aspect-ratio: 1;
        border: double 0.2em transparent;
        border-radius: 50%;
        background-image: conic-gradient(var(--white), var(--white)), var(--border-image);
        background-origin: border-box;
        background-clip: content-box, border-box;
        transition: background-color 0.3s ease-in-out;

        &:checked {
          background-image: conic-gradient(var(--black), var(--black)), var(--border-image);
          border-image-slice: 1;
        }

        &:focus-visible {
          outline: none;
          box-shadow: 0 0 0 0.2em var(--black);
        }
      }
    }
  }

  &__categories {
    display: flex;
    justify-content: space-between;
    max-width: 80rem;
    margin: 0 auto;

    &__category {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>
