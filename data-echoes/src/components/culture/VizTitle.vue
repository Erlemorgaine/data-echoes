<script setup lang="ts">
defineProps<{
  title: string
  subTitle: string
}>()
</script>

<template>
  <h2 class="viz-title">
    <strong>{{ title }}</strong> {{ subTitle }}
  </h2>
</template>

<style scoped lang="scss">
.viz-title {
  position: absolute;
  font-weight: normal;
  font-size: 1rem;
  line-height: 1.3;

  strong {
    display: block;
    font-size: 1.25rem;
  }
}
</style>
