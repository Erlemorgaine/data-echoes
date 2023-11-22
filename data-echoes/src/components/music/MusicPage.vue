<!-- <script setup lang="ts">
import { onMounted, ref } from 'vue'
import { baseUrl } from '../../ultilities/globals'
import p5 from 'p5'
type P5 = import('p5')
import sumBy from 'lodash/sumBy'

// Source: https://p5js.org/zh-Hans/examples/simulate-snowflakes.html
class Snowflake {
  // Properties
  private posX: number
  private posY: number
  private initialangle: number
  private size: number
  private radius: number

  // Constructor
  constructor(
    private p: P5,
    private snowflakes: Snowflake[],
  ) {
    // Initialize coordinates
    this.posX = 0
    this.posY = p.random(-50, 0)
    this.initialangle = p.random(0, 2 * p.PI)
    this.size = p.random(2, 7)

    // Radius of snowflake spiral
    // Chosen so the snowflakes are uniformly spread out in area
    this.radius = p.sqrt(p.random(p.pow(p.width * 0.5, 2)))
  }

  // Methods

  update(time: number): void {
    // X position follows a circle
    const w = 0.05 // Angular speed
    const angle = w * time + this.initialangle
    this.posX = this.p.width / 2 + this.radius * this.p.sin(angle)

    // Different size snowflakes fall at slightly different Y speeds
    this.posY += this.p.pow(this.size, 0.5) * 0.75

    // Delete snowflake if past end of screen
    if (this.posY > this.p.height) {
      const index = this.snowflakes.indexOf(this)
      this.snowflakes.splice(index, 1)
    }
  }

  display(): void {
    this.p.ellipse(this.posX, this.posY, this.size)
  }
}

class Flower {
  // Properties
  private posX: number
  private posY: number
  private flowerOpacity: number
  private petalSizes: number[]

  // Constructor
  constructor(
    private p: P5,
    private x: number,
    private y: number,
    private opacity: number,
  ) {
    // Initialize coordinates
    this.posX = x
    this.posY = y
    this.flowerOpacity = opacity
    this.petalSizes = [p.random(4, 7), p.random(3, 5), p.random(4, 7)]
  }

  // Methods

  update(time: number): void {
    // TODO: Wave flower? Or no update
  }

  display(): void {
    // TODO: leaves
    // TODO: curved stem
    this.p.line(this.posX, this.posY, this.posX, this.posY - 30)

    this.p.fill(0, this.flowerOpacity)

    // TODO: More transparent patterns the more they diverge from the road, base eon distance from road x rather than absolute x
    // Petals
    this.petalSizes.map((size, i) => {
      this.p.circle(this.posX + 4 * (i - 1), this.posY + 4 * Math.abs(i - 1), size)
    })
  }
}

class Tree {}

class Bird {}

const black = '#181818'
const black50 = '#181818aa'
const black30 = '#18181833'
const white = '#f2f2f2'
const winterDuration = 1000 * 60 * 6

const xBoundaries = [
  window.innerWidth * 0.25 - window.innerWidth * 0.005,
  window.innerWidth * 0.25 + window.innerWidth * 0.005,
]

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
const frequencySignals = ref([])

onMounted(() => {
  initializeAudio()
})

function initializeAudio() {
  audio.value = document.getElementById('music-tori') as HTMLAudioElement
  audioContext.value = new AudioContext()
}

async function playAudio() {
  if (audio.value && audioContext.value) {
    // Apparently this needs to happen, otherwise the sound won't play
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }

    audio.value.play()

    // This is for sources that are being streamed
    const source = audioContext.value.createMediaElementSource(audio.value)
    source.connect(audioContext.value.destination) // Wire source to speaker

    // For each frequency we want to isolate, we will create
    // its own analyser and filter nodes
    frequencySignals.value = frequencyBands.map(({ frequency }) => {
      const analyser = audioContext.value.createAnalyser()
      analyser.smoothingTimeConstant = 1 // Smoothes a bit between the data

      // Create FFT data
      const data = new Float32Array(analyser.fftSize)

      // Create a filter that will only allow a band of data through
      const filter = audioContext.value.createBiquadFilter()
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

    // analyzerNode.value = audioContext.value.createAnalyser()
    // analyzerData.value = new Float32Array(analyzerNode.value.fftSize)

    // source.connect(analyzerNode.value)

    new p5(setupCanvasWinterTrail, vizWinterTrailRef.value)
    new p5(setupCanvasWinterLandscape, vizWinterLandscapeRef.value)
    new p5(setupCanvasPrecious, vizPreciousRef.value)
  }
}

function pauseAudio() {
  audio.value?.pause()
  audioContext.value?.close() // TODO: Maybe not necessary if only pausing
}

function setupCanvasWinterTrail(p: P5) {
  let startTime: number
  let odd = false

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.5, window.innerHeight)
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

        const roadWidth = p.map(elapsedTime, 0, winterDuration, window.innerWidth * 0.05, 0)
        const roadCurve = p.map(elapsedTime, 0, winterDuration, 0.000005, 0.0001)
        const roadRadius = p.map(elapsedTime, 0, winterDuration, window.innerWidth * 0.2, 20)
        const amplitudeSum = sumBy(data)

        let x = odd ? xBoundaries[0] - roadWidth : xBoundaries[1] + roadWidth
        x += Math.cos(elapsedTime * roadCurve) * roadRadius - 20
        const y = p.map(elapsedTime, 0, winterDuration, window.innerHeight, 0)

        // TODO: Figure out why sometimes flower go inside road
        if (i == 0 && amplitudeSum > 3) {
          // const rand = p.random(1, 5)
          const randOffset = (odd ? -40 : 40) * (Math.abs(amplitudeSum) - 3)
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
  let ctx

  p.setup = () => {
    const canvas = p.createCanvas(window.innerWidth * 0.5, window.innerHeight)
    ctx = canvas.drawingContext

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
    }
  }
}

function setupCanvasPrecious(p: P5) {
  let startTime: number

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.5, window.innerHeight)
    p.background(black)
    startTime = p.millis()
  }

  p.draw = () => {
    //   analyzerNode.value.getFloatTimeDomainData(analyzerData.value)
    // beginShape to endShape creates a polygon shape
    //   p.beginShape()
    //   const dataLength = analyzerData.value.length - 1
    //   analyzerData.value.forEach((amplitude, i) => {
    // Amplitude goes from -1 to 1
    // Amplitude for x position: map domain to range
    // const x = p.map(amplitude, -1, 1, xBoundaries[0], xBoundaries[1])
    // Map each item in the array to a y position
    // const y = p.map(i, 0, dataLength, window.innerHeight, window.innerHeight * 0.5)
    // p.vertex(x, y)
    //     if (!(i % 80)) p.circle(x, y, 10)
    //   })
    //   p.endShape()
  }
}
</script>

<template>
  <div class="music-page">
    <button class="music-page__play-btn" @click="playAudio">Start experience</button>
    <audio id="music-tori" :src="`${baseUrl}music/tori-winter.mp3`" />

    <div class="music-page__viz-winter" ref="vizWinterTrailRef"></div>
    <div class="music-page__viz-winter" ref="vizWinterLandscapeRef"></div>
    <div class="music-page__viz-precious" ref="vizPreciousRef"></div>
  </div>
</template>

<style lang="scss" scoped>
.music-page {
  &__play-btn {
    font-family: WaitingfortheSunrise;
    font-size: 1.5rem;
    font-weight: 700;
    position: absolute;
    z-index: 1;
  }

  &__viz-winter,
  &__viz-precious {
    position: absolute;
    inset: 0;
    width: 50vw;
    height: 100vh;
  }

  &__viz-precious {
    left: 50vw;
  }
}
</style> -->
