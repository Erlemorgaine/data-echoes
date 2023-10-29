<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const Nostalgia = defineAsyncComponent(() => import('../components/NostalgiaPage.vue'))

const route = useRoute()

const themes = {
  nostalgia: Nostalgia,
}
</script>

<template>
  <div class="theme-view">
    <h1 class="theme-view__theme">{{ route.params.theme }}</h1>
    <Suspense>
      <template #default>
        <component :is="themes[route.params.theme]" />
      </template>
      <template #fallback> Loading ... </template>
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
.theme-view {
  padding: 0rem 2.5em;
  overflow: hidden;
  position: relative;
  transform: translate(0, 0);
  position: relative;

  &__theme {
    font-size: 1.5rem;
    // text-transform: capitalize;
    padding-bottom: 0.5rem;
    margin-left: auto;
    text-align: right;
    padding-top: 1rem;
    padding-right: 0rem;
  }
}
</style>
