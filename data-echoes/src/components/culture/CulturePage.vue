<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import spices from './data/common-spices.json'
import recipes from './data/recipes.json'
import indonesiaPolygons from './data/indonesia_provinces_polygons.json'
import regl from 'regl'
import { lookAt, perspective } from 'gl-mat4'
import {
  Sections,
  type Spice,
  type Recipe,
  Position,
  type CoordinatesArray,
  type Coordinates,
  type NumberArray,
} from './types/types'
import { useScroll } from '@vueuse/core'

import SpiceLabel from './SpiceLabel.vue'
import SunburstViz from './SunburstViz.vue'
import IntroText from './IntroText.vue'
import VizTitle from './VizTitle.vue'
import SpiceModal from './SpiceModal.vue'

import './culture.scss'

// Ginger:

// East Java
// West Java
// Lampung

// Bay Leaf:

// West Nusa Tenggara
// East Java
// Bali

// Turmeric:

// East Java
// West Nusa Tenggara
// Bali

// Candlenut:

// North Sulawesi
// West Nusa Tenggara
// East Java

// Coriander:

// East Java
// Central Java
// West Java

// Galangal:

// East Java
// Central Java
// Bali

// Coconut:

// North Sulawesi
// North Sumatra
// West Nusa Tenggara

// Lemongrass:

// West Java
// Central Java
// East Java

// Tamarind:

// Central Java
// West Java
// East Java

// Nutmeg:

// North Maluku
// Maluku
// Papua

// Peanut:

// East Java
// West Java
// Central Java

// Kaffir Lime Leaf:

// West Java
// Bali
// East Java

// Chili Pepper:

// West Java
// East Java
// Central Java

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

// TODO: It seems a bunch of recipes don't have ingredients. Remove, also in notebook.

// TODO: https://en.antaranews.com/news/188014/tracing-eastern-indonesian-spice-routes
// https://www.igismap.com/indonesia-shapefile-download-free-map-country-boundary-line-province-polygon-shapefile/
// mapshaper.com
// https://ei-ado.aciar.gov.au/sites/default/files/docs/peanut_comm_brief.pdf

const allSpices = ref<Spice[]>([])
const allSpicesMidIndex = ref(0)

const canvasSize = ref({ width: window.innerWidth, height: window.innerWidth * 0.5 })
const scrollContainer = ref<HTMLElement | null>(null)

const breakpoint = window.innerHeight * 0.33
const currentSection = ref<Sections>(Sections.intro)
const introPercentage = ref(1)
const mapPercentage = ref(0)
const sunburstPercentage = ref(0)
const scrollELPosition = ref(Position.absolute)
const scrollELAbsoluteOffset = ref(0)

const spiceModalContent = ref<Spice | null>(null)

const ctaTexts = {
  [Sections.intro]: '',
  [Sections.map]: 'Click on a spice label to learn more',
  [Sections.sunburst]: 'Click on a sun ray to learn more about the recipe',
}

const { y, isScrolling } = useScroll(scrollContainer)

watch(y, () => {
  currentSection.value =
    y.value >= breakpoint * 2
      ? Sections.sunburst
      : y.value >= breakpoint
        ? Sections.map
        : Sections.intro

  const isIntro = currentSection.value === Sections.intro
  const isSunburst = currentSection.value === Sections.sunburst

  introPercentage.value = isIntro ? Math.min(1 - y.value / breakpoint, 1) : 0
  mapPercentage.value = isSunburst ? 0 : Math.min((y.value - breakpoint) / breakpoint, 1)
  sunburstPercentage.value = isSunburst ? Math.min((y.value - breakpoint * 2) / breakpoint, 1) : 0
})

watch(isScrolling, () => {
  if (isScrolling.value && scrollELPosition.value === Position.absolute) {
    scrollELPosition.value = Position.fixed
    scrollELAbsoluteOffset.value = 0
  } else if (!isScrolling.value && scrollELPosition.value === Position.fixed) {
    scrollELPosition.value = Position.absolute
    scrollELAbsoluteOffset.value = y.value
  }
})

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
      polygons: unpackNestedToCoordinatesArray(
        province.geometry.coordinates as CoordinatesArray,
      ).map((coord) => ({
        coordinates: latLongToCartesian(coord as Coordinates[]),
        colors: spiceColors,
      })),
    }
  })

  const allPolygons = provincesWithPolygons.map((p) => p.polygons).flat(1)

  const drawPolygon = (polygon: NumberArray) =>
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
        view: reglObj.prop('view' as never),
        projection: reglObj.prop('projection' as never),
        fillColor: reglObj.prop('fillColor' as never),
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

function unpackNestedToCoordinatesArray(coordinates: CoordinatesArray) {
  const coordinatesFlat: CoordinatesArray[] = []

  const unpack = (coords: CoordinatesArray) => {
    if (!Array.isArray(coords[0][0])) {
      // TODO: Added final point so that polygon can be closed, but doesnt seem to work well.

      const newCoordinates = [...coords, coords[coords.length - 1]] as CoordinatesArray[]
      coordinatesFlat.push(newCoordinates)
    } else {
      ;(coords as CoordinatesArray[]).forEach(unpack)
    }
  }

  unpack(coordinates)

  return coordinatesFlat
}

function latLongToCartesian(polygon: Coordinates[]) {
  return polygon.map(([lat, long]: Coordinates) => {
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
  <div
    :class="['culture-page', currentSection]"
    ref="scrollContainer"
    :style="{
      '--map-opacity': currentSection === Sections.intro ? Math.pow(1 - introPercentage, 2) : 1,
      '--el-position': scrollELPosition,
      '--el-absolute-offset': scrollELAbsoluteOffset + 'px',
    }"
  >
    <div :class="['culture-page__content']">
      <IntroText
        class="culture-page__content__intro"
        :style="{
          '--intro-opacity': Math.pow(introPercentage, 4),
          '--intro-scale': introPercentage,
        }"
      />

      <canvas
        id="indonesia-map"
        class="culture-page__content__map"
        :width="canvasSize.width"
        :height="canvasSize.height"
      />

      <ul
        class="culture-page__content__spices"
        :style="{
          '--amount-cols': allSpicesMidIndex,
          '--spice-translation':
            (mapPercentage < 0 ? mapPercentage : Math.max(0, mapPercentage - 0.15)) * 100 + 'vw',
        }"
      >
        <SpiceLabel
          v-for="spice of allSpices.slice(0, allSpicesMidIndex)"
          :key="spice.name"
          :name="spice.name"
          :translation="spice.translation"
          :count="spice.count"
          @showSpiceModal="spiceModalContent = spice"
        />
        <SpiceLabel
          v-for="spice of allSpices.slice(allSpicesMidIndex)"
          :key="spice.name"
          :name="spice.name"
          :translation="spice.translation"
          :count="spice.count"
          @showSpiceModal="spiceModalContent = spice"
          bottom
        />
      </ul>

      <!-- TODO: Move this + map to other component -->

      <VizTitle
        class="culture-page__content__title"
        :style="{ '--cta-opacity': mapPercentage && mapPercentage >= 0 ? 1 : 0 }"
        title="The 14 spices most occurring in Indonesian recipes"
        subTitle="and the top 3 geographical locations where
        they are cultivated"
      />

      <div
        class="culture-page__content__cta"
        :style="{ '--cta-opacity': mapPercentage >= 0 ? 1 : 0 }"
      >
        {{ ctaTexts[currentSection] || '' }}
      </div>

      <SunburstViz
        class="culture-page__content__sunburst"
        :style="{
          '--sunburst-ratio': sunburstPercentage,
        }"
        :recipes="recipes as Recipe[]"
      />
    </div>

    <SpiceModal :spice="spiceModalContent" @closeModal="spiceModalContent = null" />
  </div>
</template>

<style scoped lang="scss">
.culture-page {
  --top-padding: 5rem;
  --absolute-offset: calc(var(--el-absolute-offset) - var(--title-height));
  --fixed-viz-top: calc(50vh + max(0px, var(--absolute-offset)));
  --el-standard-width: calc(100vw - var(--theme-padding) * 2);

  height: calc(100vh - var(--top-padding));
  position: relative;
  color: var(--off-white);
  overflow: auto;

  // Hide scrollbar
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }

  &__content {
    height: calc(200vh - var(--top-padding));
    width: var(--el-standard-width);
    overflow: hidden;
    position: relative;
    z-index: 100;

    // > * {
    //   pointer-events: none;
    // }

    &__intro {
      position: absolute;
      top: 0;
      width: 100%;
      opacity: var(--intro-opacity);
      transform: scale(var(--intro-scale));

      .intro & {
        pointer-events: initial;
      }
    }

    &__map {
      @include center;

      top: var(--fixed-viz-top);
      position: var(--el-position);
      width: calc(100vw - var(--theme-padding) * 2);
      opacity: var(--map-opacity);

      .map & {
        pointer-events: initial;
      }

      .sunburst & {
        display: none;
      }
    }

    &__spices {
      @keyframes fade-in {
        from {
          opacity: 0;
        }
      }

      --sunburst-gap: 5vh;

      top: calc(var(--fixed-viz-top) - 35vh);
      left: 50%;
      transform: translateX(-50%);
      position: var(--el-position);
      display: grid;
      grid-template-columns: repeat(var(--amount-cols), 1fr);
      gap: calc(100vh - 17rem) 0;
      width: var(--el-standard-width);
      opacity: var(--map-opacity);

      @include low-screen {
        gap: calc(100vh - 15rem) 0;
      }

      .sunburst & {
        grid-template-columns: none;
        grid-template-rows: repeat(var(--amount-cols), 1fr);
        gap: var(--sunburst-gap) 70vw;
        animation: fade-in 0.7s;
      }

      .map &,
      .sunburst & {
        pointer-events: initial;
      }
    }

    &__cta {
      position: var(--el-position);
      width: 10rem;
      text-align: center;
      opacity: var(--cta-opacity);
      font-family: WaitingfortheSunrise;
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
      transition: opacity 0.5s;

      .map & {
        top: calc(var(--fixed-viz-top) - 20vh);
        right: calc(50% - 35vw);
        transform: rotate(10deg);
      }

      .sunburst & {
        top: calc(var(--fixed-viz-top) - 25vh);
        right: calc(50% - 25vw);
        transform: rotate(10deg);
      }
    }

    &__title {
      position: var(--el-position);
      opacity: var(--cta-opacity);
      transition: opacity 0.5s;

      .map & {
        top: calc(var(--fixed-viz-top) + 25vh);
        left: calc(50% - 47vw);
      }
    }

    &__sunburst {
      position: var(--el-position);
      top: calc(var(--fixed-viz-top) + 5vh);
      left: calc(50% - 5vw);
      width: calc(50vw - var(--theme-padding) * 2);
      transform: translate(-50%, -50%);
      display: none;

      .sunburst & {
        display: initial;
        pointer-events: initial;
      }
    }
  }
}
</style>
