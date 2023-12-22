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
const spiceKey = computed(() => props.translation.replaceAll(' ', '-'))
</script>

<template>
  <li :style="{ '--spice-color': `var(--spice-${spiceKey})` }">
    <button
      :class="['spice-label', { bottom, top: !bottom }]"
      @click="$emit('showSpiceModal', { name, translation, count })"
    >
      <img
        :src="`${baseUrl}images/culture/${spiceKey}_reduced.webp`"
        alt=""
        class="spice-label__img"
      />
      <div class="spice-label__details">
        <div class="spice-label__details__name-indonesian">
          {{ allNames[0] }}

          <span v-if="allNames.length > 1" class="alternatives"
            >({{ allNames.slice(1, allNames.length).join(', ') }})</span
          >
        </div>
        <div class="spice-label__details__name-english">
          {{ translation }}
        </div>
      </div>
    </button>
  </li>
</template>

<style scoped lang="scss">
.spice-label {
  --img-size: 3rem;

  display: flex;
  width: fit-content;
  justify-self: center;
  position: relative;
  text-align: left;
  transform: translateX(var(--spice-translation));

  &.bottom {
    transform: translateX(calc(var(--spice-translation) * -1));
  }

  .sunburst & {
    justify-self: flex-start;
    width: 12rem;

    &.bottom {
      transform: translate(
        calc(100vw - var(--theme-padding) * 2 - 100%),
        calc(var(--sunburst-gap) * (var(--amount-cols) - 1) * -1 - 23.5rem)
      );
      flex-direction: row-reverse;
      text-align: right;

      .spice-label__img {
        border-radius: 0 50% 50% 0;
      }

      .spice-label__details {
        padding-left: 0;
        padding-right: 0.5rem;
      }
    }
  }

  &__img {
    width: 3rem;
    border-radius: 50% 0 0 50%;
    overflow: hidden;
  }

  &__details {
    padding-left: 0.5rem;
    border-bottom: 0.3rem solid var(--spice-color);

    .sunburst & {
      flex-grow: 1;
    }

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
