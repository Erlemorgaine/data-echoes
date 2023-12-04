<script setup lang="ts">
import { onMounted, ref } from 'vue'
import spices from './data/common-spices.json'
import indonesiaPolygons from './data/indonesia_provinces_polygons.json'
import regl from 'regl'
import { create } from 'gl-vec2'
import { lookAt, perspective } from 'gl-mat4'

import Spice from './Spice.vue'

//  {
//     "translation": "garlic",
//     "name": "bawang putih",
//     "count": 13869,
//     "color": [214, 205, 187, 1],
//     "regions": "jawa, sumatera"
//   },
//   {
//     "translation": "shallot",
//     "name": "bawang merah",
//     "count": 10302,
//     "color": [130, 69, 51, 1],
//     "regions": "jawa, sumatera, sulawesi"
//   },
//   {
//     "translation": "spring onion",
//     "name": "daun bawang",
//     "count": 3363,
//     "color": [124, 175, 46, 1],
//     "regions": ""
//   },
//   {
//     "translation": "onion",
//     "name": "bombay/bombai",
//     "count": 2785,
//     "color": [174, 111, 56, 1],
//     "regions": ""
//   },

import './culture.scss'

//TODO: cinnamon (kayu manis), cloves (cengeh)
// TODO: https://en.antaranews.com/news/188014/tracing-eastern-indonesian-spice-routes
// https://www.igismap.com/indonesia-shapefile-download-free-map-country-boundary-line-province-polygon-shapefile/
// mapshaper.com

const allSpices = ref([])
const allSpicesMidIndex = ref(0)
const canvasSize = ref({ width: window.innerWidth, height: window.innerWidth * 0.5 })

onMounted(() => {
  allSpices.value = spices.map((s) => ({ ...s, regions: s.regions.split(', ') }))
  allSpicesMidIndex.value = Math.round(spices.length * 0.5)

  const reglObj = regl({
    canvas: document.getElementById('indonesia-map') as HTMLCanvasElement,
  })

  const provincesWithPolygons = indonesiaPolygons.features.map((province) => {
    const spiceColors = allSpices.value
      .filter((spice) => spice.regions.includes(province.properties.ADM1_EN.toLowerCase()))
      .map((spice) => spice.color)

    return {
      ...province,
      polygons: unpackNestedToCoordinatesArray(province.geometry.coordinates).map((coord) => ({
        coordinates: latLongToCartesian(coord),
        colors: spiceColors,
      })),
    }
  })

  const allPolygons = provincesWithPolygons.map((p) => p.polygons).flat(1)

  const drawPolygon = (polygon) =>
    reglObj({
      vert: `
      precision mediump float;
      attribute vec3 position;
      uniform mat4 view, projection;

      void main() {
        gl_Position = projection * view * vec4(position, 1);
      }
    `,
      frag: `
      precision mediump float;
      uniform vec4 fillColor; 

      void main() {
        gl_FragColor = fillColor;
      }
    `,
      attributes: {
        position: polygon,
      },
      uniforms: {
        view: reglObj.prop('view'),
        projection: reglObj.prop('projection'),
        fillColor: reglObj.prop('fillColor'),
      },
      // Array with counts of coordinates for each separate polygon
      count: polygon.length,
      primitive: 'triangle fan',
    })

  let opacity = 0
  reglObj.clear({ color: [0, 0, 0, 0], depth: 1 })

  reglObj.frame(({ time }) => {
    const view = lookAt([], [0, 0, 3], [0, 0, 0], [0, 1, 0])
    const projection = perspective(
      [],
      Math.PI / 4,
      reglObj._gl.canvas.width / reglObj._gl.canvas.height,
      0.01,
      10.0,
    )

    if (opacity < 1) {
      allPolygons.forEach((polygon) => {
        drawPolygon(polygon.coordinates)({
          view,
          projection,
          fillColor: polygon.colors[0]?.length ? [...polygon.colors[0], 1] : [0, 0, 0, 1],
        })
      })
      opacity = 1 //time * 0.1
    }
  })
})

function unpackNestedToCoordinatesArray(coordinates) {
  const coordinatesFlat = []

  const unpack = (coords) => {
    if (!Array.isArray(coords[0][0])) {
      // Add final point so that polygon can be closed
      coordinatesFlat.push([...coords, coords[coords.length - 1]])
    } else {
      coords.forEach(unpack)
    }
  }

  unpack(coordinates)

  return coordinatesFlat
}

function latLongToCartesian(polygon) {
  return polygon.map(([lat, long]) => {
    const scale = 2.75
    // Convert to radians
    const latRad = (lat * Math.PI) / 180
    const longRad = (long * Math.PI) / 180

    // Convert to 3D Cartesian coordinates
    // const x = Math.cos(latRad) * Math.cos(longRad)
    // const y = Math.tan((Math.cos(latRad) * Math.sin(longRad)) * 2)
    // const y = Math.cos(latRad) * Math.sin(longRad)
    const z = Math.sin(latRad)

    const y = longRad
    const x = Math.tan(latRad / 2)

    // TODO: Tweak more so that it resembles Indonesia better
    return [x * scale * 0.5 - scale, y * scale + 0.125, z]
  })
}
</script>

<template>
  <div class="culture-page">
    <ul class="culture-page__spices" :style="{ '--amount-cols': allSpicesMidIndex }">
      <Spice
        v-for="spice of allSpices.slice(0, allSpicesMidIndex)"
        :key="spice.name"
        :name="spice.name"
        :translation="spice.translation"
        :count="spice.count"
      />
      <Spice
        v-for="spice of allSpices.slice(allSpicesMidIndex)"
        :key="spice.name"
        :name="spice.name"
        :translation="spice.translation"
        :count="spice.count"
        bottom
      />
    </ul>

    <canvas
      id="indonesia-map"
      class="culture-page__map"
      :width="canvasSize.width"
      :height="canvasSize.height"
    />
  </div>
</template>

<style scoped lang="scss">
.culture-page {
  width: 100%;
  position: fixed;
  top: 2rem;
  height: calc(100vh - 5rem);
  overflow: scroll;
  position: relative;

  &__map {
    width: 100%;
    transform: translateY(-3rem);
  }

  &__spices {
    position: absolute;
    top: 2rem;
    display: grid;
    grid-template-columns: repeat(var(--amount-cols), 1fr);
    gap: calc(100vh - 18rem) 0;
    width: 100%;

  }
}
</style>
