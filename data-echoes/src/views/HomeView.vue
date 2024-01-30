<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { useMeta } from 'vue-meta'

const themes = [
  'Nostalgia',
  'Music',
  'Culture',
  'Presidents & Royals',
  'Movies',
  'Books',
  'Travel',
  'Nature',
  'Myths and Legends',
  'Community',
  'Olympics',
  'Fearless',
]
const activeThemes = ['Nostalgia', 'Music', 'Culture', 'Presidents & Royals']

useMeta({
  title: 'Home',
})

const animated = ref(!!sessionStorage.getItem('animation-played'))

onMounted(() =>
  nextTick(() => {
    sessionStorage.setItem('animation-played', 'true')
  }),
)
</script>

<template>
  <main :class="['home-view', { animate: !animated }]">
    <div class="home-view__content-wrapper">
      <h1 class="home-view__title">Data echoes</h1>
      <div class="home-view__content">
        <div class="home-view__content__intro">
          <p>
            <span class="capital">Welcome!</span> I'm Erle, mostly-frontend developer and data
            enthusiast, and this is my fan-project-turned-into-personal-website. To be precise, a
            fan-project based on the book <a href="https://www.datasketch.es/">Data Sketches</a>,
            which was born out of a collaboration between
            <a href="https://shirleywu.studio/">Shirley Wu</a> and
            <a href="https://www.visualcinnamon.com/">Nadieh Bremer</a>, and harbours a collection
            of data visualizations that are beautiful and immensely inspiring. So inspiring that I
            decided to take it as a starting point of my own personal journey to get better at data
            analysis and visualization.
          </p>
          <p>
            My aim is to follow the twelve categories that Shirley and Nadieh chose for Data
            Sketches, and put my own spin on them: choose a topic and dataset that seems exciting /
            interesting / worth exploring, try to come up with a fitting visualization, and learn
            something new in the process.
          </p>
          <p>
            In the links below the visualizations will gradually start to show up (in non-definite
            order). Some might take very long to finish, some hopefully less so. I might never
            finish, but for sure I plan to have fun trying!
          </p>
        </div>

        <div class="home-view__content__themes">
          <RouterLink
            v-for="(theme, i) of themes"
            :key="theme"
            :class="[
              'home-view__content__themes__link',
              { disabled: !activeThemes.includes(theme) },
            ]"
            :to="{
              name: 'theme',
              params: { theme: theme.toLowerCase().replaceAll('& ', '').replaceAll(' ', '-') },
            }"
          >
            <span>{{ `${i + 1}.` }}</span>

            {{ theme }}
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.home-view {
  @keyframes fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes grow-up {
    0% {
      opacity: 0;
      transform: scale(3) translateY(6rem);
      animation-timing-function: ease-out;
    }
    30% {
      opacity: 1;
      transform: scale(2) translateY(5rem);
      animation-timing-function: ease-out;
    }
    60% {
      transform: scale(2) translateY(5rem);
      animation-timing-function: ease-in-out;
    }
  }

  @keyframes scale-in-out {
    0% {
      transform-origin: left center;
      transform: scale(0);
    }
    49% {
      transform-origin: left center;
    }
    50% {
      transform: scale(1);
      transform-origin: right center;
    }
    100% {
      transform: scale(0);
      transform-origin: right center;
    }
  }

  z-index: 1;
  color: var(--off-white);
  height: 100vh;
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
        var(--home-yellow-80),
        var(--home-green-50) 30%,
        var(--home-blue-50)
      ),
      radial-gradient(
        circle at 75% 90%,
        var(--home-yellow),
        var(--home-green-90),
        var(--home-blue-90) 70%
      );
    z-index: -1;
    transform-origin: center;

    .animate & {
      animation: spin-around 40s linear infinite;
    }

    @include mobile {
      width: 120vh;
      height: 120vh;
    }
  }

  &__content-wrapper {
    position: relative;
    top: 45%;
    left: 50%;
    max-width: 55rem;
    transform: translate(-50%, -50%);

    @include mobile {
      top: 2rem;
      width: calc(100% - 2rem);
      transform: translateX(-50%);
    }
  }

  &__title {
    font-family: WaitingfortheSunrise;
    text-transform: uppercase;
    font-size: 4rem;
    text-align: center;
    margin: 0 auto;
    margin-bottom: 1rem;
    position: relative;
    width: fit-content;

    .animate & {
      animation: grow-up 2.7s 0.5s backwards;
    }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      left: 0;
      bottom: 0.8rem;
      background-image: linear-gradient(90deg, transparent, var(--off-white), transparent);
      animation: scale-in-out 1s 1.3s both;
    }

    @include mobile {
      font-size: 2rem;

      &::after {
        bottom: 0.2rem;
      }
    }
  }

  &__content {
    box-shadow: -2px -2px 5px 1px var(--off-white-30);
    background-color: var(--off-white-10);
    border: 1px solid;
    border-image: linear-gradient(90deg, var(--off-white-30), transparent) 30;
    filter: drop-shadow(-2px -2px 5px var(--off-white-50));
    padding: 2rem 3rem;
    animation: fade-in 1s ease-out backwards;

    .animate & {
      animation-delay: 3s;
    }

    @include mobile {
      padding: 2rem 1.5rem;
      max-height: calc(100vh - 8rem);
      overflow: auto;
    }

    &__intro {
      p {
        margin-bottom: 0.75rem;
      }

      .capital {
        font-weight: 600;

        &::first-letter {
          font-family: WaitingfortheSunrise;
          font-size: 1.75rem;
          line-height: 0.5;
        }
      }

      a {
        font-weight: 600;

        &:hover {
          // color: var(--home-green-light);
          // text-shadow: -0.15rem 0.15rem 0rem hsla(187, 58%, 20%, 0.96);
          text-shadow: -0.15rem 0.15rem 0.1rem rgba(246, 237, 207, 0.4);
        }
      }
    }

    &__themes {
      columns: 4;
      column-fill: balance;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 1.5rem;
      border-top: 0.1rem solid;
      padding-top: 1.5rem;
      padding-right: 1rem;
      border-image: linear-gradient(
          90deg,
          transparent 20%,
          var(--off-white-70) 40%,
          var(--off-white-70) 60%,
          transparent 80%
        )
        30;

      @include mobile {
        columns: 2;
      }

      &__link {
        @include underline-hover;

        position: relative;
        display: flex;
        align-items: baseline;
        width: fit-content;
        gap: 0.5rem;
        line-height: 1.1;

        @include mobile {
          align-items: center;
          margin-bottom: 0.15rem;

          &:nth-child(-n + 6) {
            text-align: right;
            margin-left: auto;
            flex-direction: row-reverse;
          }
        }

        span {
          font-family: WaitingfortheSunrise;
          font-size: 1.5rem;
          line-height: 120%;
          width: 1.25rem;
          letter-spacing: 0.15rem;
        }

        &.disabled {
          opacity: 0.5;
          pointer-events: none;
        }
      }
    }
  }
}
</style>
