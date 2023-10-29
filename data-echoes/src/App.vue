<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  min-height: 100vh;
}
</style>

<style>
body {
  width: 100vw;
  /* overflow: hidden; */
}
</style>
