<script setup lang="ts">
import { computed } from 'vue'
import MoviesBarChart from './MoviesBarChart.vue'
import MoviesTextBlock from './MoviesTextBlock.vue'

const props = defineProps<{
  stats: {
    fractionWhite: number
    fractionHispanicLatino: number
    fractionBlack: number
    fractionAsian: number
  }
}>()

const otherPercentage = computed(
  () =>
    1 -
    props.stats.fractionAsian -
    props.stats.fractionBlack -
    props.stats.fractionHispanicLatino -
    props.stats.fractionWhite,
)

const bipocPercentage = computed(
  () =>
    props.stats.fractionAsian +
    props.stats.fractionBlack +
    props.stats.fractionHispanicLatino +
    otherPercentage.value,
)
</script>

<template>
  <section class="usa-chart">
    <MoviesTextBlock
      title="So how does this compare to a national level?"
      :paragraphs="[
        `Since the Oscars are an award show based in the USA, and mostly focused on the USA film industry (for some notable examples, see <a href='https://collider.com/foreign-movies-that-won-oscars/'>this Collider article</a>) I was interested in how these numbers compare to the general layout of the US population.`,

        `The data comes from the 2021 estimates of the <a href='https://usafacts.org/'><i>Race and ethnicity in the United States</i></a> Wikipedia article, which takes its data from the <a href='https://usafacts.org/'>USA Facts</a> site.`,
      ]"
    />

    <MoviesBarChart
      title="2021 estimates of self-identified ethnicity"
      :data="[
        {
          value: otherPercentage,
          label: 'Other',
          id: 'other',
        },
        { value: stats.fractionAsian, label: 'Asian', id: 'asian' },
        { value: stats.fractionBlack, label: 'Black', id: 'african' },
        { value: stats.fractionHispanicLatino, label: 'Hispanic and Latino', id: 'latino' },
        { value: stats.fractionWhite, label: 'White', id: 'white' },
      ]"
    />

    <div
      class="usa-chart__bipoc-line"
      :style="{ '--percentage-bipoc': bipocPercentage * 100 + '%' }"
    >
      <strong>{{ Math.round(bipocPercentage * 1000) / 10 }}%</strong> of the population identifies
      as non-white
    </div>
  </section>
</template>

<style scoped lang="scss">
.usa-chart {
  padding-block: 5rem;

  &__bipoc-line {
    width: var(--percentage-bipoc);
    height: 2px;
    border-top: 2px solid var(--black);
    padding-top: 0.25rem;
    margin-top: 1rem;
    position: relative;
    padding-left: 0.5rem;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      transform: translateY(-50%);
      height: 1rem;
      width: 2px;
      background-color: var(--black);
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }
}
</style>
