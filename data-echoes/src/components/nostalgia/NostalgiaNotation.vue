<script setup lang="ts">
defineProps<{
  position: { x: string; y: string }
  text: string
  line1Position?: { x: string; y: string }
  line2Position?: { x: string; y: string }
  lineHeight: string
  topLine?: boolean
}>()
</script>

<template>
  <p
    :class="[
      'nostalgia-notation',
      { topline: topLine, 'horizontal-line': !!line2Position, 'vertical-line': !!line1Position },
    ]"
    :style="{
      '--x': position.x,
      '--y': position.y,

      '--line-height': lineHeight,

      ...(line1Position
        ? {
            '--line-1-x': line1Position.x,
            '--line-1-y': line1Position.y,
          }
        : {}),

      ...(line2Position
        ? {
            '--line-2-x': line2Position.x,
            '--line-2-y': line2Position.y,
          }
        : {}),
    }"
    v-html="text"
  />
</template>

<style scoped lang="scss">
.nostalgia-notation {
  position: absolute;
  top: var(--y);
  left: var(--x);
  max-width: 14rem;
  font-size: 0.8rem;
  font-style: italic;

  &.vertical-line::before {
    content: '';
    position: absolute;
    top: calc(var(--line-1-y) + 0.5rem);
    left: var(--line-1-x);
    width: 1px;
    height: var(--line-height);
    background-color: var(--off-white);
    z-index: 1;
  }

  &.horizontal-line::after {
    content: '';
    position: absolute;
    top: calc(var(--line-2-y) + 0.5rem);
    left: var(--line-2-x);
    height: 1px;
    width: var(--line-height);
    background-color: var(--off-white);
    z-index: 1;
  }

  &.topline::before {
    top: initial;
    bottom: calc(var(--line-1-y) + 0.5rem);
  }
}
</style>
