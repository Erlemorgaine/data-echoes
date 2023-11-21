<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { baseUrl } from '../../ultilities/globals'
import p5 from 'p5'
import sumBy from 'lodash/sumBy'

const black = '#181818'
const black50 = '#181818aa'
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

const vizWinterRef = ref(null)
const vizPreciousRef = ref(null)

const audioContext = ref<AudioContext | null>(null) // Holds details associated to audio
const audio = ref<HTMLAudioElement | null>(null) // Contains html audio node
const frequencySignals = ref([])

onMounted(() => {
  initializeAudio()
})

function initializeAudio() {
  audio.value = document.getElementById('music-tori') as HTMLAudioElement
  audioContext.value = new AudioContext()

  audio.value.onstop = () => {}
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
    frequencySignals.value = frequencyBands.map(({ frequency, color }) => {
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
        color,
        data,
        filter,
      }
    })

    // analyzerNode.value = audioContext.value.createAnalyser()
    // analyzerData.value = new Float32Array(analyzerNode.value.fftSize)

    // source.connect(analyzerNode.value)

    new p5(setupCanvasWinter, vizWinterRef.value)
    new p5(setupCanvasPrecious, vizPreciousRef.value)
  }
}

function pauseAudio() {
  audio.value?.pause()
  audioContext.value?.close() // TODO: Maybe not necessary if only pausing
}

function setupCanvasWinter(p) {
  let startTime
  let odd = false

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.5, window.innerHeight)
    p.background(white)
    startTime = p.millis()
    p.frameRate(60)
  }

  p.draw = () => {
    if (frequencySignals.value.length && !audio.value.paused) {
      //   p.noFill()
      //   p.stroke(black)
      p.noStroke()
      p.fill(black50)

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

      const elapsedTime = p.millis() - startTime
      // Amplitude for x position: map domain to range

      // Map each item in the array to a y position

      frequencySignals.value.forEach(({ analyser, data, color }, i) => {
        analyser.getFloatTimeDomainData(data)

        // p.fill(color)

        // These numbers approximate dots walking on the beat (tiny bit too slow though)
        if ((p.frameCount + 23) % 47 === 0 && i == 1) {
          // Get the waveform

          const amplitudeSum = sumBy(data)

          const y = p.map(elapsedTime, 0, winterDuration, window.innerHeight, 0)
          const radius = p.map(Math.abs(amplitudeSum), 0, 15, 2, 30)
          const roadWidth = p.map(elapsedTime, 0, winterDuration, window.innerWidth * 0.05, 0)
          const roadCurve = p.map(elapsedTime, 0, winterDuration, 0.000005, 0.0001)
          const roadRadius = p.map(elapsedTime, 0, winterDuration, window.innerWidth * 0.2, 20)

          let x = odd ? xBoundaries[0] - roadWidth : xBoundaries[1] + roadWidth
          x += Math.cos(elapsedTime * roadCurve) * roadRadius
          x -= i * 20

          p.circle(x, y, radius)
          odd = !odd
        }
      })
    }
  }
}

function setupCanvasPrecious(p) {
  let startTime

  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.5, window.innerHeight)
    p.background(black)
    startTime = p.millis()
  }

  p.draw = () => {}
}
</script>

<template>
  <div class="music-page">
    <button class="music-page__play-btn" @click="playAudio">Start experience</button>
    <audio id="music-tori" :src="`${baseUrl}music/tori-winter.mp3`" />

    <div id="music-viz" class="music-page__viz-winter" ref="vizWinterRef"></div>
    <div id="music-viz" class="music-page__viz-precious" ref="vizPreciousRef"></div>
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
</style>
