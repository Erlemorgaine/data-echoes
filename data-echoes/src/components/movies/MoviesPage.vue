<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MoviePerson, MoviePersonKey } from './types/types'

import actors from './data/Academy_Award_for_Best_Actor.json'
import actresses from './data/Academy_Award_for_Best_Actress.json'
import directors from './data/Academy_Award_for_Best_Director.json'
import supportingActors from './data/Academy_Award_for_Best_Supporting_Actor.json'
import supportingActresses from './data/Academy_Award_for_Best_Supporting_Actress.json'

import MoviesDotChart from './MoviesDotChart.vue'

import './movies.scss'
import MoviesLegend from './MoviesLegend.vue'

const sortKeys: MoviePersonKey[] = ['year', 'origin', 'name']

const categories = ref([
  { title: 'Best Director', data: directors as MoviePerson[] },
  { title: 'Best Actor', data: actors as MoviePerson[] },
  { title: 'Best Actress', data: actresses as MoviePerson[] },
  { title: 'Best Supporting Actor', data: supportingActors as MoviePerson[] },
  { title: 'Best Supporting Actress', data: supportingActresses as MoviePerson[] },
])

const sortKey = ref<MoviePersonKey>('year')
sortData(sortKey.value)

watch(sortKey, sortData)

// TODO: I want to know how the data compares to the general american population

// White	59.3%
// Hispanic and Latino	18.9%
// Black	12.6%
// Asian	 5.9%
// https://en.wikipedia.org/wiki/Race_and_ethnicity_in_the_United_States

// TODO: Also add percentages
// TODO: Also add winners with a yellow mark in the circle
// TODO: What about middle eastern or native american? Add OTHER category
// TODO: Let balls fly in, and animate order
function sortData(sortKey: MoviePersonKey) {
  categories.value.forEach((category) => {
    category.data.sort((a: MoviePerson, b: MoviePerson) => {
      if (typeof a[sortKey] === 'string') {
        return a[sortKey].localeCompare(b[sortKey])
      } else {
        return a[sortKey] - b[sortKey]
      }
    })
  })
}
</script>

<template>
  <div class="movie-page">
    <h1 class="movie-page__title">#OscarsSo<span>White</span></h1>

    <div class="movie-page__top">
      <MoviesLegend />

      <fieldset class="movie-page__sort-options">
        <legend>Sort data by</legend>

        <label v-for="option of sortKeys" :key="option">
          <input type="radio" name="sortKey" v-model="sortKey" :value="option" />

          {{ option }}
        </label>
      </fieldset>
    </div>

    <div class="movie-page__categories">
      <MoviesDotChart
        v-for="category in categories"
        :key="category.title"
        :title="category.title"
        :nominees="category.data"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.movie-page {
  background-color: var(--silver);

  &__title {
    text-align: center;
    margin-bottom: 1rem;
    font-family: GravitasOne;
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
    margin-bottom: 2rem;
  }

  &__sort-options {
    display: flex;

    legend {
      font-weight: bold;
      // font-size: 0.8rem;
    }
  }

  &__categories {
    display: flex;
    justify-content: space-between;
    max-width: 80rem;
    margin: 0 auto;
  }
}
</style>
