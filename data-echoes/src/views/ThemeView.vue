<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const Nostalgia = defineAsyncComponent(() => import('../components/NostalgiaPage.vue'))

const route = useRoute()

const themes = {
  nostalgia: Nostalgia,
}

type ThemesKey = keyof typeof themes
</script>

<template>
  <div class="theme-view">
    <h1 class="theme-view__theme">{{ route.params.theme }}</h1>
    <RouterLink class="theme-view__back-btn" :to="{ name: 'home' }">home</RouterLink>
    <Suspense>
      <template #default>
        <component :is="themes[route.params.theme as ThemesKey]" />
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

  &__theme {
    font-size: 1.5rem;
    // text-transform: capitalize;
    padding-bottom: 0.5rem;
    margin-left: auto;
    text-align: right;
    padding-top: 1rem;
    padding-right: 0rem;
  }

  &__back-btn {
    font-size: 1.5rem;
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-weight: 700;
    transition: color 0.5s;

    &:hover {
      color: var(--off-white);
    }
  }
}
</style>
