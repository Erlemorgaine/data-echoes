<script setup lang="ts">
import { computed } from 'vue'
import { baseUrl } from '../../ultilities/globals'

import AppModal from '../general/AppModal.vue'
import type { Recipe } from './types/types'

const props = defineProps<{
  recipe: Recipe | null
}>()

const recipeKey = computed(() => props.recipe?.recipe?.replaceAll(' ', '_'))

const ingredientPercentages = computed(() => {
  if (props.recipe) {
    const total = Object.values(props.recipe.ingredient_counts).reduce((acc, val) => acc + val, 0)

    return Object.entries(props.recipe.ingredient_counts)
      .map(([ingredient, value]) => ({
        ingredient,
        percentage: `${(value / total) * 100}%`,
      }))
      .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage))
  }
  return []
})
</script>

<template>
  <AppModal
    class="recipe-modal-wrapper"
    :show="!!recipe"
    closeLabel="Close"
    @closeModal="$emit('closeModal')"
  >
    <template v-if="recipe">
      <div class="recipe-modal__top">
        <img
          :src="`${baseUrl}images/culture/recipes/${recipeKey}.webp`"
          alt=""
          class="recipe-modal__top__img"
        />
        <h1 class="recipe-modal__top__title">
          <div>{{ recipe.recipe }}</div>
          <div class="recipe-modal__top__title__value">Occurs {{ recipe.amount }} times</div>
        </h1>
      </div>

      <div class="recipe-modal__bottom">
        <ul class="recipe-modal__bottom__ingredients-chart">
          <li
            v-for="ingredient of ingredientPercentages"
            :key="ingredient.ingredient"
            class="recipe-modal__bottom__ingredients-chart__ingredient"
            :style="{
              '--ingredient-color': `var(--spice-${ingredient.ingredient.replaceAll(' ', '-')})`,
              '--ingredient-percentage': ingredient.percentage,
            }"
          ></li>
        </ul>

        <div class="recipe-modal__bottom__description">
          {{ recipe.description }}
        </div>

        <div class="recipe-modal__bottom__links">
          <p class="recipe-modal__bottom__links__text">Check out how to cook this dish at:</p>

          <ul>
            <li v-for="link of recipe.links" :key="link">
              <a
                class="recipe-modal__bottom__links__link"
                :href="link.link"
                target="_blank"
                rel="noopener noreferrer"
                >{{ link.site }}</a
              >
            </li>
          </ul>
        </div>
      </div>
    </template>
  </AppModal>
</template>

<style scoped lang="scss">
.recipe-modal-wrapper {
  --modal-size: 50vw;
  --half-modal: calc(var(--modal-size) * 0.5);

  background-color: transparent;
  color: var(--off-black);

  &::before {
    background-color: var(--bg-1-70);
  }

  :deep(.app-modal) {
    width: var(--modal-size);
    aspect-ratio: 1;
    border-radius: 50%;
    border: 0.5rem solid var(--spice-garlic);

    @include mobile {
      flex-direction: column;
    }

    .app-modal__close-button {
      left: 50%;
      top: calc(100% - 1rem);
      transform: translate(-50%, -50%);
      background-color: var(--off-white-70);
      width: fit-content;
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 1.5rem;
      padding: 1rem;
      font-weight: bold;
      mix-blend-mode: luminosity;
      transition: background-color 0.3s;

      &:hover {
        background-color: var(--off-white);
      }
    }
  }

  .recipe-modal {
    &__top {
      background-color: var(--spice-coconut-dark);
      border-radius: var(--half-modal) var(--half-modal) 0 0;
      height: 50%;
      text-align: center;
      padding: 2rem;
      overflow: hidden;
      position: relative;

      &__img {
        position: absolute;
        bottom: 6rem;
        left: 50%;
        transform: translateX(-50%);
        width: 11rem;
        z-index: 2;
      }

      &__title {
        position: absolute;
        width: 100%;
        height: 75%;
        left: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 0.5rem;
        z-index: 1;
        font-size: 2rem;
        line-height: 100%;

        &::first-letter {
          text-transform: uppercase;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(transparent, var(--spice-garlic));
          z-index: -1;
        }

        &__value {
          font-size: 1.5rem;
          font-weight: 700;
          font-family: WaitingfortheSunrise;
        }
      }
    }

    &__bottom {
      background-color: var(--spice-garlic);
      color: var(--text-color);
      border-radius: 0 0 var(--half-modal) var(--half-modal);
      height: 50%;
      padding: 1rem 2rem 1rem 2rem;
      text-align: center;

      &__ingredients-chart {
        display: flex;

        &__ingredient {
          width: var(--ingredient-percentage);
          height: 1rem;
          background-color: var(--ingredient-color);
        }
      }

      &__description {
        margin: 0 auto;
        margin-top: 1rem;
        width: 35ch;
      }

      &__links {
        margin-top: 1rem;

        &__text {
          margin-bottom: 0.5rem;
        }

        &__link {
          --line-color: var(--spice-coconut-dark);

          @include underline-hover;

          color: var(--spice-coconut-dark);
          position: relative;
          font-weight: 700;
          transition: color 0.3s;
        }
      }
    }
  }
}
</style>
