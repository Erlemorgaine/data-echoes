<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { baseUrl } from '../../ultilities/globals'
import p5 from 'p5'

const audioContext = ref<AudioContext | null>(null) // Holds details associated to audio
const audio = ref<HTMLAudioElement | null>(null) // Contains html audio node
const analyzerNode = ref(null)

const vizRef = ref(null)

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

    new p5(setupCanvas, vizRef.value)
    audio.value.play()

    // This is for sources that are being streamed
    const source = audioContext.value.createMediaElementSource(audio.value)
    source.connect(audioContext.value.destination) // Wire source to speaker

    analyzerNode.value = audioContext.value.createAnalyzer()
    analyzerData = new Float32Array(analyzerNode.value.fftSize)
  }
}

function pauseAudio() {
  audio.value?.pause()
  audioContext.value?.close() // TODO: Maybe not necessary if only pausing
}

function setupCanvas(p) {
  p.setup = () => {
    p.createCanvas(window.innerWidth * 0.5, window.innerHeight)
    p.background(`#f2f2f2`)
  }

  p.draw = () => {
    // TODO
  }
}
</script>

<template>
  <div class="music-page">
    <button class="music-page__play-btn" @click="playAudio">Start experience</button>
    <audio id="music-tori" :src="`${baseUrl}music/tori-winter.mp3`" />

    <div id="music-viz" class="music-page__viz" ref="vizRef"></div>
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

  &__viz {
    position: absolute;
    inset: 0;
    width: 50vw;
    height: 100vh;
  }
}
</style>
