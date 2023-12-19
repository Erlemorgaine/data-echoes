<script setup lang="ts"></script>

<template>
  <section class="intro-text">
    <!-- TODO: Add nice images of spices or recipes -->
    <h2 class="intro-text__title first">The Background</h2>
    <p class="intro-text__paragraph">
      When I think of my grandmother, one word that comes immediately to mind is:
      <strong>food</strong>.
    </p>
    <p class="intro-text__paragraph">
      My grandparents are the direct descendants of a long, complex, and brutal colonial history
      between Indonesia - where they were born - and the Netherlands - where they ended up, after
      Indonesia's independence in 1945 and the acknowledgement of that independence by the Dutch
      government in 1949. Both of them are <strong>"Indisch"</strong>: they have both European and
      Indonesian blood, and grew up in a culture that had distinct influences from both sides. The
      food that my grandmother used to cook, was not at all the same as the food that I ate in
      traditionally Dutch households: it contained a lot of spices, was extremely varied, and came
      into overabundance.
    </p>
    <p class="intro-text__paragraph">
      And it was delicious!! Sadly my grandma is too old to cook now, and besides, I live in Italy -
      another country that has great food, but Indonesian restaurants are hard, if not impossible,
      to find here. Whenever I return to the Netherlands, I cannot wait to satisfy my food cravings
      at one of the many Indonesian takeaway places that can be found in the major Dutch cities. But
      since I spend most of my time in Italy, missing Indonesian food, this visualization is an
      <strong>ode to the rich culinary culture of Indonesia</strong>.
    </p>
    <h2 class="intro-text__title second">The Data</h2>
    <p class="intro-text__paragraph">
      The visualization is made up of two parts. The <strong>first part</strong> is meant to give an
      idea of the spices most commonly used in Indonesian dishes, and in which provinces of
      Indonesia they can be found most commonly. The <strong>second part</strong> shows how these
      spices are used in common Indonesian dishes. To determine the "most common" spices and "most
      common" recipes, I used the
      <a href="https://www.kaggle.com/datasets/canggih/indonesian-food-recipes/"
        >Indonesian Food Recipes dataset on Kaggle</a
      >, a dataset with over 15000 (non-unique) recipes.<sup><a href="#fn1">1</a></sup> To determine
      the 50 most common recipes out of all recipes that contained the 8 most occurring spices, I
      considered only the recipes that didn't clearly belong to another country's cuisine.<sup
        ><a href="#fn2">2</a></sup
      >
    </p>

    <button class="intro-text__scroll-btn">
      Click here or scroll down to see the visualization
    </button>

    <sup class="intro-text__footnote" id="fn1">
      1. It looks like the recipes have been scraped off the Indonesian version of
      <a href="https://cookpad.com/">Cookpad</a>.
    </sup>
    <sup class="intro-text__footnote" id="fn2">
      2. This didn't have a large effect on the top 50 anyway; although Japanese, Korean, Italian
      and American dishes seemed pretty popular, they rarely made it to the top 50, although one of
      the big favorites was "chicken nuggets".
    </sup>
  </section>
</template>

<style scoped lang="scss">
.intro-text {
  padding: 0 10vw;

  &__paragraph {
    margin-bottom: 0.5rem;

    strong {
      color: var(--spice-galangal);
    }

    a {
      font-weight: bold;
      color: var(--spice-galangal);
      text-decoration: underline;

      &:hover {
        color: var(--spice-lemongrass);
      }
    }
  }

  &__title {
    font-family: WaitingfortheSunrise;
    width: fit-content;
    margin: 2rem auto 0.5rem auto;
    font-size: 1.75rem;

    &.first {
      background: -webkit-linear-gradient(
        0deg,
        var(--spice-galangal),
        var(--spice-ginger),
        var(--spice-turmeric)
      );

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &.second {
      background: -webkit-linear-gradient(
        0deg,
        var(--spice-lemongrass) 10%,
        var(--spice-candlenut),
        var(--spice-galangal)
      );

      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  &__footnote {
    display: block;
  }
}
</style>
