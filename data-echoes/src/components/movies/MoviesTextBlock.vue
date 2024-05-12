<script setup lang="ts">
defineProps<{ title?: string; paragraphs: string[] }>()
</script>

<template>
  <div class="movies-text-block">
    <h3 v-if="title" class="movies-text-block__title">{{ title }}</h3>

    <p
      class="movies-text-block__text"
      v-for="paragraph of paragraphs"
      :key="paragraph.slice(0, 10)"
      v-html="paragraph"
    />
  </div>
</template>

<style scoped lang="scss">
.movies-text-block {
  margin-bottom: 4rem;

  &__title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 900;
    padding-bottom: 2vh;
  }

  &__text {
    max-width: 40rem;
    margin-inline: auto;
    margin-bottom: 1rem;
  }
}
</style>
