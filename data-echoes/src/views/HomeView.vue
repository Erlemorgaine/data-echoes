<script setup lang="ts">
const themes = [
  'Nostalgia',
  // 'Presidents & Royals',
  // 'Movies',
  // 'Music',
]
const activeThemes = ['Nostalgia']
</script>

<template>
  <main class="home-view">
    <div class="home-view__content">
      <h1 class="home-view__content__title">Data echoes</h1>

      <div class="home-view__content__intro">
        <p><span class="capital">Welcome!</span> This is</p>
      </div>

      <div class="home-view__content__themes">
        <RouterLink
          v-for="(theme, i) of themes"
          :key="theme"
          class="home-view__content__themes__link"
          :to="{ name: 'theme', params: { theme: theme.toLowerCase() } }"
          :disabled="!activeThemes.includes(theme)"
        >
          <span>{{ `${i + 1}.` }}</span>

          {{ theme }}
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home-view {
  z-index: 1;
  color: var(--off-white);
  max-height: 100vh;
  overflow: hidden;
  position: relative;

  &::after {
    @keyframes spin-around {
      to {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    content: '';
    position: absolute;
    width: 120vw;
    height: 120vw;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background-image: radial-gradient(
        circle at 5% 30%,
        rgba(208, 169, 52, 0.8),
        rgba(20, 117, 110, 0.5) 30%,
        rgba(8, 56, 119, 0.5)
      ),
      radial-gradient(
        circle at 75% 90%,
        rgba(208, 169, 52, 1),
        rgba(20, 117, 110, 0.9),
        rgba(8, 56, 119, 0.9) 70%
      );
    z-index: -1;
    transform-origin: center;
    animation: spin-around 40s linear infinite;
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: -2px -2px 5px 1px var(--off-white-30);
    background-color: var(--off-white-10);
    border: 1px solid;
    border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
    filter: drop-shadow(-2px -2px 5px var(--off-white-50));
    padding: 2rem 4rem;

    &__title {
      font-family: WaitingfortheSunrise;
      text-transform: uppercase;
      font-size: 4rem;
    }

    &__intro {
    }

    &__themes {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-weight: bold;
      text-transform: uppercase;

      &__link {
        position: relative;

        span {
          font-family: WaitingfortheSunrise;
          font-size: 1.5rem;
          line-height: 120%;
          padding-right: 0.5rem;
          width: 1.25rem;
          letter-spacing: 0.15rem;
        }

        &::after {
          content: '';
          position: absolute;
          top: 90%;
          left: 0;
          height: 1px;
          width: 100%;
          background-color: var(--off-white);
          transform: scaleX(0);
          transition: transform 0.5s ease-out;
        }

        &:hover::after {
          transform: scaleX(1);
        }
      }
    }
  }
}
</style>
