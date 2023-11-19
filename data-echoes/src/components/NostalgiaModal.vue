<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['closeModal', 'navigate'])

const dialogRef = ref()

watch(
  () => props.show,
  () => {
    if (props.show) {
      openModal()
    } else {
      dialogRef.value.close()
    }

    document.body.style.overflow = props.show ? 'hidden' : 'initial'
  },
)

function openModal() {
  dialogRef.value.showModal()
}

function closeModal() {
  dialogRef.value.close()
  emit('closeModal')
}
</script>

 <template>
  <dialog class="nostalgia-modal-wrapper" ref="dialogRef" @close="closeModal">
    <div class="nostalgia-modal">
      <button @click="closeModal" class="nostalgia-modal__close-button">X</button>

      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.nostalgia-modal-wrapper {
  width: fit-content;
  padding: 0;

  /* Style the backdrop behind the modal */
  &::backdrop {
    background-image: linear-gradient(45deg, #e382a488, #66e1fb88, #63d54088);
    backdrop-filter: blur(0.5rem);
  }
}
.nostalgia-modal {
  box-shadow: -2px -1px 5px 1px var(--off-white-30);
  background-color: rgb(25, 25, 25);
  border: 1px solid;
  border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
  color: var(--off-white);
  padding: 1.5rem 2rem 2.5rem 2rem;
  max-width: min(65vw, 55rem);
  display: flex;
  position: relative;

  @include mobile {
    width: 100%;
    max-width: initial;
    padding: 1rem;
    flex-direction: column;
  }

  &__close-button {
    position: absolute;
    top: 0.25rem;
    right: 1rem;
    font-family: PPG;
    z-index: 1;

    &:hover {
      color: #e382a4;
    }
  }
}
</style>
