<script setup lang="ts">
import { partition, stratify, type HierarchyNode } from 'd3-hierarchy'
import { arc } from 'd3-shape'
import { select } from 'd3-selection'
import { descending } from 'd3-array'
import { computed, onMounted, ref } from 'vue'
import VizTitle from './VizTitle.vue'
import RecipeModal from './RecipeModal.vue'
import type { Recipe, RecipeWithAmount } from './types/types'

type SunburstData = {
  child: string
  parent: string | undefined
  amountRecipe: number | undefined
  count: number
  ingredient: string | undefined
  recipe: string | undefined
}[]

type RecursiveSunburstData = SunburstData | RecursiveSunburstData[]

const props = defineProps<{ recipes: Recipe[] }>()

const startAngle = Math.PI * 0.5
const endAngle = Math.PI * 2.5
const size = Math.min(window.innerWidth, window.innerHeight) * 0.5
const radius = size * 0.3
const padding = 1

const spiceToColor = {
  asam: 'var(--spice-tamarind)',
  daunjeruk: 'var(--spice-kaffir-lime-leaf)',
  jahe: 'var(--spice-ginger)',
  kacang: 'var(--spice-peanut)',
  kemiri: 'var(--spice-candlenut)',
  kunyit: 'var(--spice-turmeric)',
  pala: 'var(--spice-nutmeg)',
  salam: 'var(--spice-bay-leaf)',
  ketumbar: 'var(--spice-coriander)',
  'cabe-cabai-rawit': 'var(--spice-chili)',
  'lada-merica': 'var(--spice-pepper)',
  'lengkuas-laos': 'var(--spice-galangal)',
  'serai-sereh': 'var(--spice-lemongrass)',
  'kelapa-santan': 'var(--spice-coconut)',
}

const modelContent = ref<Recipe | null>(null)

const recipesObject = computed(() =>
  props.recipes.reduce((prevObj: { [k: string]: Recipe }, nextRecipe: Recipe) => {
    prevObj[nextRecipe.recipe] = nextRecipe
    return prevObj
  }, {}),
)

onMounted(() => {
  const sunburstData = dataToParentChildLinks(props.recipes)
  createSunburst(sunburstData)
})

// For the data to work,
// - There needs to be an (insignificant) parent node
// -- Each recipe should be a child of the parent node
// --- each spice needs to be a child of the previous spice, the first spice is a child of the recipe.

function dataToParentChildLinks(data: Recipe[]): RecursiveSunburstData {
  const parentNode = {
    child: 'root',
    count: 1,
    parent: undefined,
    amountRecipe: undefined,
    ingredient: undefined,
    recipe: undefined,
  }

  const recipeNodes = data
    // .slice(0, 50)
    .map((recipe: Recipe) => {
      // First, create array of (same) spices for each spice count
      const allIngredients = Object.keys(recipe.ingredient_counts)

        .map((ingredient) => {
          // Calculate on log scale, otherwise the differences are too big
          // (unfortunately mostly because there is 1 outlier: tongseng kambing).
          const ingredientCount = recipe.ingredient_counts[ingredient]
          const arrayLength = ingredientCount ? Math.ceil(Math.log10(ingredientCount)) : 0

          return Array(arrayLength).fill(ingredient)
        })
        .flat(2)

      return [
        {
          child: recipe.recipe,
          recipe: recipe.recipe,
          parent: parentNode.child,
          amountRecipe: recipe.amount,
          count: 1,
          ingredient: undefined,
        },
        ...allIngredients.map((ingredient, i) => ({
          child: `${ingredient}-${i}-${recipe.recipe}`,
          recipe: recipe.recipe,
          parent: i ? `${allIngredients[i - 1]}-${[i - 1]}-${recipe.recipe}` : recipe.recipe,
          ingredient,
          count: 1,
          amountRecipe: undefined,
        })),
      ]
    })
    .flat(3)

  return [parentNode, ...recipeNodes]
}

// Source: https://observablehq.com/@d3/sunburst-component
function createSunburst(data: RecursiveSunburstData) {
  // !!IMPORTANT!! Good to realize that the sunburst will be more like a spiral, if we work from most to least recipes.
  // We can normalize the recipe proportions, but this will result in a donut-like chart, since all proportions will add up to 1.
  // Experiment to see what works best.
  const root = stratify()
    .id((d: RecipeWithAmount) => d.child)
    .parentId((d: RecipeWithAmount) => d.parent)(data) as HierarchyNode<RecipeWithAmount>

  // Compute the values of internal nodes by aggregating from the leaves.
  root.count()
  root.sort((a: HierarchyNode<RecipeWithAmount>, b: HierarchyNode<RecipeWithAmount>) =>
    descending(a.data.amountRecipe, b.data.amountRecipe),
  )

  // Compute partition layout
  partition().size([endAngle - startAngle, radius])(root)

  // Construct an arc generator.
  const vizArc = arc()
    .startAngle((d) => d.x0 + startAngle)
    .endAngle((d) => d.x1 + startAngle)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, (2 * padding) / radius))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0 - padding + (d.id === 'root' ? 0 : 40))
    .outerRadius((d) => d.y1 - padding + 40)

  const svg = select('#sunburst-viz-svg')

  svg
    .selectAll('path')
    .data(root.descendants())
    .join('path')
    .attr('d', vizArc)
    .attr('class', 'sunburst-viz__viz__node')
    .attr('role', 'button')
    .attr('tabindex', '0')
    .style('--depth', (d) => Math.max(d.depth - 1, 0) / 100)
    .attr('fill', (d) => spiceToColor[d.data.ingredient as keyof typeof spiceToColor] || 'transparent')
    .on('click', (e, d) => {
      modelContent.value = recipesObject.value[d.data.recipe]
    })

  // // Add label
  // cell
  //   .filter((d) => ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
  //   .append('text')
  //   .attr('transform', (d) => {
  //     if (!d.depth) return
  //     const x = (((d.x0 + d.x1) / 2 + startAngle) * 180) / Math.PI
  //     const y = (d.y0 + d.y1) / 2
  //     return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
  //   })
  //   .attr('dy', '0.32em')
  //   .text(d => label(d.data, d));

  // cell.append('title')
  //   .text(d => title(d.data, d));

  return svg.node()
}
</script>

<template>
  <div class="sunburst-viz">
    <svg
      id="sunburst-viz-svg"
      class="sunburst-viz__viz"
      :viewBox="`${size * -0.3} ${size * -0.3} ${size * 0.6} ${size * 0.6}`"
      text-anchor="middle"
    ></svg>

    <VizTitle
      class="sunburst-viz__title"
      title="Top 50 recipes"
      subTitle="most commonly found in the dataset"
    />

    <RecipeModal :recipe="modelContent" @closeModal="modelContent = null" />
  </div>
</template>

<style scoped lang="scss">
.sunburst-viz {
  width: 50%;
  aspect-ratio: 0.9;

  &__viz {
    overflow: visible;

    :deep(.sunburst-viz__viz__node) {
      // 0.36 is the observed highest depth
      --node-opacity: calc(var(--sunburst-ratio) * 0.36 / var(--depth));

      opacity: calc(var(--node-opacity) * var(--node-opacity) * var(--node-opacity));

      &:hover {
        cursor: pointer;
      }

      &:focus {
        outline: none;
      }

      &:focus-visible {
        outline: 1px solid steelblue;
      }
    }
  }

  &__title {
    @include center;

    max-width: 11rem;
    text-align: center;
    top: 46%;
  }
}
</style>
