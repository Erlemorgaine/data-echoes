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
// TODO: What about middle eastern or native american? Add OTHER category
// TODO: Let balls fly in, and animate order
// TODO: Tooltip for each datapoints
// TODO: After each dot chart, write some insights.
// TODO: Always sort in the same way?
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
    margin: 0 auto;
    margin-bottom: 2rem;
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
          // Outer blue border
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
  }
}
</style>
