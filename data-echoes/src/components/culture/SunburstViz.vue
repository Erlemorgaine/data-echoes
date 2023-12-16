<script setup lang="ts">
import { partition, stratify } from 'd3-hierarchy'
import { arc } from 'd3-shape'
import { select } from 'd3-selection'
import { descending } from 'd3-array'
import { onMounted } from 'vue'

const startAngle = 0
const endAngle = Math.PI * 2
const size = Math.min(window.innerWidth, window.innerHeight) * 0.9
const radius = size * 0.3
const padding = 0

const spiceToColor = {
  asam: 'var(--spice-tamarind)',
  daunjeruk: 'var(--spice-kaffir-lime-leaf)',
  jahe: 'var(--spice-ginger)',
  kacang: 'var(--spice-peanut)',
  kemiri: 'var(--spice-candlenut)',
  kunyit: 'var(--spice-turmeric)',
  pala: 'var(--spice-nutmeg)',
  salam: 'var(--spice-bay-leaf)',
  'cabe-cabai-rawit': 'var(--spice-chili)',
  'lada-merica': 'var(--spice-pepper)',
  'lengkuas-laos': 'var(--spice-galangal)',
  'serai-sereh': 'var(--spice-lemongrass)',
  'kelapa-santan': 'var(--spice-coconut)',
}

const props = defineProps<{ recipes: unknown[] }>()

onMounted(() => {
  const sunburstData = dataToParentChildLinks(props.recipes)
  createSunburst(sunburstData)
})

// For the data to work,
// - There needs to be an (insignificant) parent node
// -- Each recipe should be a child of the parent node
// --- each spice needs to be a child of the previous spice, the first spice is a child of the recipe.
function dataToParentChildLinks(data) {
  const parentNode = { child: 'root', count: 1 }
  const recipeNodes = data
    .map((recipe) => {
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
        { child: recipe.recipe, parent: parentNode.child, amountRecipe: recipe.amount, count: 1 },
        ...allIngredients.map((ingredient, i) => ({
          child: `${ingredient}-${i}-${recipe.recipe}`,
          parent: i ? `${allIngredients[i - 1]}-${[i - 1]}-${recipe.recipe}` : recipe.recipe,
          ingredient,
          count: 1,
        })),
      ]
    })
    .flat(3)

  return [parentNode, ...recipeNodes]
}

// Source: https://observablehq.com/@d3/sunburst-component
function createSunburst(data) {
  // !!IMPORTANT!! Good to realize that the sunburst will be more like a spiral, if we work from most to least recipes.
  // We can normalize the recipe proportions, but this will result in a donut-like chart, since all proportions will add up to 1.
  // Experiment to see what works best.
  const root = stratify()
    .id((d) => d.child)
    .parentId((d) => d.parent)(data)

  // Compute the values of internal nodes by aggregating from the leaves.
  root.count()
  root.sort((a, b) => descending(a.data.amountRecipe, b.data.amountRecipe))

  console.log(startAngle, endAngle, radius)
  console.log(root.descendants())

  // COmpute partition layout
  partition().size([endAngle - startAngle, radius])(root)

  // Construct an arc generator.
  const vizArc = arc()
    .startAngle((d) => d.x0 + startAngle)
    .endAngle((d) => d.x1 + startAngle)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, (2 * padding) / radius))
    .padRadius(radius / 2)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1 - padding)

  const svg = select('#sunburst-viz-svg')

  const cell = svg
    .selectAll('path')
    .data(root.descendants())
    .join('path')
    .attr('d', vizArc)
    .attr('fill', (d) => spiceToColor[d.data.ingredient] || 'transparent')
    .attr('stroke', (d) => spiceToColor[d.data.ingredient] || 'transparent')
  // TODO: Possibly unnecessary
  //   .attr("xlink:href", link == null ? null : d => link(d.data, d))
  //   .attr("target", link == null ? null : linkTarget);

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
      :viewBox="`${size / -2} ${size / -2} ${size} ${size}`"
      text-anchor="middle"
    ></svg>
  </div>
</template>

<style scoped>
.sunburst-viz {
}
</style>
