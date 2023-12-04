<script setup lang="ts">
import { computed } from 'vue'
import { baseUrl } from '../../ultilities/globals'

const props = defineProps<{
  bottom?: boolean
  name: string
  translation: string
  count: number
}>()

const allNames = computed(() => props.name.split('/'))
</script>

<template>
  <li :class="['spice', { bottom, top: !bottom }]">
    <img
      :src="`${baseUrl}images/culture/${translation.replaceAll(' ', '-')}_reduced.webp`"
      alt=""
      class="spice__img"
    />
    <div class="spice__details">
      <div class="spice__details__name-indonesian">
        {{ allNames[0] }}

        <span v-if="allNames.length > 1" class="alternatives"
          >({{ allNames.slice(1, allNames.length).join(', ') }})</span
        >
      </div>
      <div class="spice__details__name-english">
        {{ translation }}
      </div>
    </div>
  </li>
</template>

<style scoped lang="scss">
.spice {
  display: flex;
  gap: 0.5rem;
  width: fit-content;
  justify-self: center;

  &.bottom {
    transform: translateX(100%);
  }

  &__img {
    width: 3rem;
  }

  &__details {
    &__name-indonesian {
      font-weight: 700;

      .alternatives {
        font-size: 0.7rem;
        font-style: italic;
      }
    }

    &__name-english {
      font-size: 0.8rem;
    }
  }
}
</style>
