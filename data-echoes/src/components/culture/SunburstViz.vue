<script setup lang="ts">
import { partition, stratify } from 'd3-hierarchy'
import { arc } from 'd3-shape'
import { create } from 'd3-selection'
import { onMounted } from 'vue'

const startAngle = 0
const endAngle = Math.PI * 2
const size = Math.min(window.innerWidth, window.innerHeight) * 0.9
const radius = size * 0.5
const padding = 2

const props = defineProps<{ recipes: unknown[] }>()

onMounted(() => {
    const sunburstData = dataToSunBburstData(props.recipes)
    createSunburst(sunburstData)
})

function dataToSunBburstData(data) {
    return data;
}

// Source: https://observablehq.com/@d3/sunburst-component
function createSunburst(data) {
  // TODO: For the data to work,
  // - There needs to be an (insignificant) parent node
  // -- Each recipe should be a child of the parent node
  // --- each spice needs to be a child of the previous spice, the first spice is a child of the recipe.
  // Write recursive function to take care of that.

  // !!IMPORTANT!! Good to realize that the sunburst will be more like a spiral, if we work from most to least recipes.
  // We can normalize the recipe proportions, but this will result in a donut-like chart, since all proportions will add up to 1.
  // Experiment to see what works best.

  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  // TODO: Add an artificial root parent
  const root = stratify()
    .id((d) => d.recipe)
    .parentId((d) => d.parentId)(data)

  // Compute the values of internal nodes by aggregating from the leaves.
  // TODO: We probably don't need this since all segments are the same size
  root.count()

  // TODO: Sort leaves by amount of recipe
  root.sort((a, b) => descending(a.amount, b.amount))

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

  const svg = create('svg')
    .attr('viewBox', [size / 2, size / 2, size, size])
    .attr('text-anchor', 'middle')

  const cell = svg.selectAll('a').data(root.descendants()).join('a')
  // TODO: Possibly unnecessary
  //   .attr("xlink:href", link == null ? null : d => link(d.data, d))
  //   .attr("target", link == null ? null : linkTarget);

  cell
    .append('path')
    .attr('d', vizArc)
    .attr('fill', (d) => d.color)

  // Add label
  cell
    .filter((d) => ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
    .append('text')
    .attr('transform', (d) => {
      if (!d.depth) return
      const x = (((d.x0 + d.x1) / 2 + startAngle) * 180) / Math.PI
      const y = (d.y0 + d.y1) / 2
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`
    })
    .attr('dy', '0.32em')
  //   .text(d => label(d.data, d));

  cell.append('title')
  //   .text(d => title(d.data, d));

  return svg.node()
}
</script>

<template>
  <div class="sunburst-viz"></div>
</template>

<style scoped>
.sunburst-viz {
}
</style>
