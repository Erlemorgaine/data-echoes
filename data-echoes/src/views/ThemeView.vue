<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { computed, defineAsyncComponent } from 'vue'
import { useMeta } from 'vue-meta'
import capitalize from 'lodash/capitalize'

const Nostalgia = defineAsyncComponent(() => import('../components/nostalgia/NostalgiaPage.vue'))
const Movies = defineAsyncComponent(() => import('../components/movies/MoviesPage.vue'))
const Music = defineAsyncComponent(() => import('../components/music/MusicPage.vue'))
const Culture = defineAsyncComponent(() => import('../components/culture/CulturePage.vue'))
const PresidentsRoyals = defineAsyncComponent(
  () => import('../components/presidents-royals/PresidentsRoyalsPage.vue'),
)

const route = useRoute()

const themes = {
  nostalgia: { component: Nostalgia, dark: true },
  music: { component: Music, dark: false },
  culture: { component: Culture, dark: true },
  ['presidents-royals']: { component: PresidentsRoyals, dark: true },
  movies: { component: Movies, dark: false },
}

type ThemesKey = keyof typeof themes

const themesKey = computed(() => route.params.theme)

useMeta({
  title: capitalize(route.params.theme as string).replaceAll('-', ' '),
})
</script>

<template>
  <article
    id="theme-view"
    :class="['theme-view', themesKey, { dark: themes[themesKey as ThemesKey].dark }]"
  >
    <h1 class="theme-view__theme">{{ route.params.theme }}</h1>
    <RouterLink class="theme-view__back-btn" :to="{ name: 'home' }">home</RouterLink>
    <Suspense>
      <template #default>
        <component :is="themes[route.params.theme as ThemesKey].component" />
      </template>
      <template #fallback> Loading ... </template>
    </Suspense>
  </article>
</template>

<style lang="scss" scoped>
.theme-view {
  --theme-padding: 2.5rem;
  --title-height: 3.75rem;

  padding: 0rem var(--theme-padding);
  overflow: hidden;
  position: relative;
  color: var(--vt-c-black);
  background-color: var(--vt-c-white-mute);
  min-height: 100vh;

  &.dark {
    color: var(--color-text);
    background: var(--color-background);
  }

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
    font-weight: 600;
    transition:
      color 0.5s,
      opacity 0.5s;
    z-index: 2;
    text-decoration: underline;

    &:hover {
      opacity: 0.6;
    }

    .dark & {
      &:hover {
        opacity: 1;
        color: var(--off-white);
      }
    }
  }
}
</style>
