<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { baseUrl } from '../../ultilities/globals'
import p5 from 'p5'

type P5 = import('p5')
import sumBy from 'lodash/sumBy'

import { Flower, Snowflake } from './MusicObjects'
import type { FrequencySignal, VizTypes } from './types/types'

const black = '#181818'
const black50 = '#181818aa'
const black30 = '#18181833'
const white = '#f2f2f2'
const winterDuration = 1000 * 60 * 6
const canvasWidth = window.innerWidth > 1024 ? window.innerWidth * 0.5 : window.innerWidth

const onboardingTexts = {
  winter: [
    'The amplitudes of the mid frequencies are used to size the dots with which the <strong>path</strong> is drawn',
    'When the low frequency amplitudes reach a certain threshold, a tiny <strong>flower</strong> is drawn next to the path. The amplitude value decides both the distance of the flower from the path, and the flower opacity.',
    'Other elements will be drawn into or removed from the canvas in accordance with to the <strong>song lyrics</strong>.',
  ],
  precious: [],
}

const xBoundaries = [canvasWidth * 0.5 - canvasWidth * 0.01, canvasWidth * 0.5 + canvasWidth * 0.01]

// Isolate specific bands of (center!) frequency
const frequencyBands = [
  { frequency: 55 /*, color: '#22A722'*/ },
  { frequency: 570 /*, color: '#E84420'*/ },
  { frequency: 1020 /*, color: '#F4CD00'*/ },
]

const vizWinterTrailRef = ref<HTMLElement | undefined>(undefined)
const vizWinterLandscapeRef = ref<HTMLElement | undefined>(undefined)
const vizPreciousRef = ref<HTMLElement | undefined>(undefined)

const audioContext = ref<AudioContext | null>(null) // Holds details associated to audio
const audio = ref<HTMLAudioElement | undefined>(undefined) // Contains html audio node
const frequencySignals = ref<FrequencySignal[]>([])
const experienceStarted = ref(false)
const currentText = ref('')
const currentViz = ref<VizTypes | ''>('')

onMounted(() => {
  initializeAudio()
})

function initializeAudio() {
  audio.value = document.getElementById('music-tori') as HTMLAudioElement
  audioContext.value = new AudioContext()
}

async function playAudio(viz: VizTypes) {
  experienceStarted.value = true
  currentViz.value = viz

  if (audio.value && audioContext.value) {
    // Apparently this needs to happen, otherwise the sound won't play
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }

    audio.value.play()
    playOnboardingTexts()

    // This is for sources that are being streamed
    const source = audioContext.value.createMediaElementSource(audio.value)
    source.connect(audioContext.value.destination) // Wire source to speaker

    // For each frequency we want to isolate, we will create
    // its own analyser and filter nodes
    frequencySignals.value = frequencyBands.map(({ frequency }) => {
      const analyser = audioContext.value!.createAnalyser()
      analyser.smoothingTimeConstant = 1 // Smoothes a bit between the data

      // Create FFT data
      const data = new Float32Array(analyser.fftSize)

      // Create a filter that will only allow a band of data through
      const filter = audioContext.value!.createBiquadFilter()
      filter.frequency.value = frequency
      filter.Q.value = 1
      filter.type = 'bandpass'

      source.connect(filter)
      filter.connect(analyser)

      return {
        analyser,
        data,
        filter,
      }
    })

    new p5(setupCanvasWinterTrail, vizWinterTrailRef.value)
    new p5(setupCanvasWinterLandscape, vizWinterLandscapeRef.value)
    new p5(setupCanvasPrecious, vizPreciousRef.value)
  }
}

function playOnboardingTexts() {
  setTimeout(() => {
    const currentVizTexts = onboardingTexts[currentViz.value as VizTypes]
    let currentIndex = 0
    currentText.value = currentVizTexts[currentIndex]

    const interval = setInterval(() => {
      currentIndex++
      const nextText = currentVizTexts[currentIndex]

      if (nextText) {
        currentText.value = nextText
      } else {
        currentText.value = ''
        clearInterval(interval)
      }
    }, 8000)
  }, 2000)
}

// TODO: Use later
// function pauseAudio() {
//   audio.value?.pause()
//   audioContext.value?.close() // TODO: Maybe not necessary if only pausing
// }

function setupCanvasWinterTrail(p: P5) {
  let startTime: number
  let odd = false

  p.setup = () => {
    p.createCanvas(canvasWidth, window.innerHeight)
    p.background(white)
    startTime = p.millis()
    p.frameRate(60)
  }

  p.draw = () => {
    if (frequencySignals.value.length && !audio.value?.paused) {
      p.noStroke()
      p.fill(black50)

      const elapsedTime = p.millis() - startTime
      const onSecond = (p.frameCount + 23) % 12 === 0

      if (onSecond) {
        odd = !odd
      }

      // Map each item in the array to a y position

      frequencySignals.value.forEach(({ analyser, data }, i) => {
        analyser.getFloatTimeDomainData(data)

        const roadWidth = p.map(elapsedTime, 0, winterDuration, canvasWidth * 0.1, 0)
        const roadCurve = p.map(elapsedTime, 0, winterDuration, 0.000005, 0.0001)
        const roadRadius = p.map(elapsedTime, 0, winterDuration, canvasWidth * 0.4, 20)
        const amplitudeSum = sumBy(data)

        let x = odd ? xBoundaries[0] - roadWidth : xBoundaries[1] + roadWidth
        x += Math.cos(elapsedTime * roadCurve) * roadRadius - 20
        const y = p.map(
          elapsedTime,
          0,
          winterDuration,
          window.innerHeight,
          window.innerHeight * 0.1,
        )

        if (i == 0 && amplitudeSum > 3) {
          // Start at fixed offset, so that road line is never crossed. NB it could be crossed if e.g. sum = 3.001
          const randOffset =
            (odd ? -20 : 20) + (odd ? -40 : 40) * (amplitudeSum - 3) * p.pow(amplitudeSum - 3, 0.7)
          const flowerX = x + randOffset
          const flowerY = y // window.innerHeight * 0.5 + amplitudeSum * 20
          const flower = new Flower(p, flowerX, flowerY, 225 - Math.abs(randOffset))

          flower.display() // draw snowflake
        }

        // These numbers approximate dots walking on the beat (tiny bit too slow though)
        if (onSecond && i == 1) {
          // Get the waveform

          const radius = p.map(Math.abs(amplitudeSum), 0, 25, 2, 30)

          p.circle(x, y, radius)
        }
      })
    }
  }
}

function setupCanvasWinterLandscape(p: P5) {
  let startTime: number
  let snowflakes: Snowflake[] = []
  let ctx: CanvasRenderingContext2D
  // let sun: Sun

  p.setup = () => {
    const canvas = p.createCanvas(canvasWidth, window.innerHeight)
    ctx = (canvas as any).drawingContext // Dirty type fix, can't seem to find the correct type to be able for Typescript to recognise drawingContext

    startTime = p.millis()
    p.frameRate(60)
  }

  p.draw = () => {
    if (frequencySignals.value.length && !audio.value?.paused) {
      ctx.clearRect(0, 0, p.width, p.height)
      p.noStroke()
      p.fill(black30)

      // const elapsedTime = p.millis() - startTime

      let t = p.frameCount / 60
      const elapsedTime = p.millis() - startTime

      if (elapsedTime < 1000 * 127) {
        snowflakes.push(new Snowflake(p, snowflakes)) // append snowflake object
      }

      snowflakes.forEach((flake) => {
        flake.update(t) // update snowflake position
        flake.display() // draw snowflake
      })

      // TODO: Better sun
      // if (elapsedTime > 1000 * 137) {
      //   if (!sun) {
      //     sun = new Sun(p)
      //   }

      //   sun.display()
      // }
    }
  }
}

// TODO: Add code to visualize Precious things
function setupCanvasPrecious(p: P5) {
  let startTime: number

  p.setup = () => {
    p.createCanvas(canvasWidth, window.innerHeight)
    p.background(black)
    startTime = p.millis()
  }

  p.draw = () => {
    // analyzerNode.value.getFloatTimeDomainData(analyzerData.value)
    // // beginShape to endShape creates a polygon shape
    // p.beginShape()
    // const dataLength = analyzerData.value.length - 1
    // analyzerData.value.forEach((amplitude, i) => {
    //   // Amplitude goes from -1 to 1
    //   // Amplitude for x position: map domain to range
    //   const x = p.map(amplitude, -1, 1, xBoundaries[0], xBoundaries[1])
    //   // Map each item in the array to a y position
    //   const y = p.map(i, 0, dataLength, window.innerHeight, window.innerHeight * 0.5)
    //   p.vertex(x, y)
    //   if (!(i % 80)) p.circle(x, y, 10)
    // })
    // p.endShape()
  }
}
</script>

<template>
  <div class="music-page">
    <audio id="music-tori" :src="`${baseUrl}music/tori-winter.mp3`" />

    <div :class="['music-page__canvases', { visible: experienceStarted }]">
      <div class="music-page__viz-winter" ref="vizWinterTrailRef"></div>
      <div class="music-page__viz-winter" ref="vizWinterLandscapeRef"></div>
      <div class="music-page__viz-precious" ref="vizPreciousRef"></div>
    </div>

    <Transition name="fade">
      <div v-if="!experienceStarted" class="music-page__intro-text">
        <p class="music-page__intro-text__paragraph">
          Here, you will find two visualizations based on the songs "Winter" and "Precious things",
          from the <a class="link" href=""><em>Little Earthquakes</em></a> album by
          <a class="link" href="">Tori Amos</a>.
        </p>

        <p class="music-page__intro-text__paragraph">
          The visualizations have been made in <strong>P5.js</strong>, and are drawn according to
          different frequency ranges and their amplitudes.
        </p>

        <p class="music-page__intro-text__paragraph">
          Rather than providing a rigorous and clean analysis of the musical data, these
          visualizations are meant to be taken in at leisure as a
          <strong>multi-sensory</strong> experience of the songs.
        </p>

        <button class="music-page__intro-text__play-btn" @click="playAudio('winter')">
          Start experience
        </button>
      </div>
    </Transition>

    <Transition name="fade">
      <p
        :class="['music-page__onboarding-text', currentViz]"
        :key="currentText"
        v-html="currentText"
      />
    </Transition>

    <p v-if="currentViz" class="music-page__wip">Work in progress</p>
  </div>
</template>

<style lang="scss" scoped>
.music-page {
  &__canvases {
    opacity: 0;
    transition: opacity 0.5s 0.25s;

    &.visible {
      opacity: 1;
    }
  }

  &__intro-text {
    @include center;

    max-width: 34rem;
    text-align: center;
    top: 48%;
    border-top: 1px solid;
    border-bottom: 1px solid;
    padding: 2rem 1rem;
    border-image: linear-gradient(90deg, transparent, var(--off-black), transparent) 30;

    @include mobile {
      width: calc(100% - 4rem);
    }

    .link {
      font-weight: 700;

      &:hover {
        opacity: 0.7;
      }
    }

    &__paragraph {
      margin-bottom: 0.75rem;
    }

    &__play-btn {
      @include underline-hover;

      --line-color: var(--off-black);

      font-family: WaitingfortheSunrise;
      font-size: 1.5rem;
      font-weight: 700;
      z-index: 1;
      position: relative;
      margin-top: 1.5rem;
    }
  }

  &__viz-winter,
  &__viz-precious {
    position: absolute;
    inset: 0;
    width: 50vw;
    height: 100vh;

    @include mobile {
      width: 100vw;
    }
  }

  &__viz-precious {
    left: 50vw;

    @include mobile {
      left: 0;
      display: none; // TODO: This will change later, when the viz is done
    }
  }

  &__onboarding-text {
    position: absolute;
    max-width: 38vw;
    top: 10vh;
    z-index: 1;
    background-color: var(--vt-c-white-mute);

    @include mobile {
      max-width: calc(100% - 12vw);
    }

    &.winter {
      left: 6vw;
    }

    :deep(strong) {
      font-family: WaitingfortheSunrise;
      // font-weight: 400;
      font-size: 1.5rem;
    }
  }

  &__wip {
    position: absolute;
    font-size: 2rem;
    font-family: WaitingfortheSunrise;
    top: 45%;
    right: 25vw;
    transform: translateX(50%);
    color: var(--off-white);
    z-index: 1;

    @include mobile {
      display: none; // TODO: This will change later, when the viz is done
    }
  }
}
</style>
