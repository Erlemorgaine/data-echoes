<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useMeta } from 'vue-meta'

useMeta({
  title: '',
})
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{
      content ? `Data Echoes | ${content}` : 'Data Echoes'
    }}</template>
  </metainfo>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  min-height: 100vh;
}
</style>

<style>
body {
  width: 100%;
  /* overflow: hidden; */
  background-color: var(--color-background);
}
</style>
