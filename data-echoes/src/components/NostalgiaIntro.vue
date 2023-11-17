<template>
  <section class="nostalgia-intro">
    <p>
      For me it was immediately clear: for the theme <span class="color">Nostalgia</span> I had to
      do something with the <span class="color">Powerpuff Girls</span>. As a kid, I spent hours and
      hours watching the adventures of <span class="color blossom">Blossom</span>,
      <span class="color bubbles">Bubbles</span> and <span class="color buttercup">Buttercup</span>,
      inventing new adventures, enacting them with my sisters, and drawing comics about them.
    </p>
    <p>
      Even years after having stopped watching <span class="color">Cartoon Network</span>, I
      remembered the series fondly. This was first of all because this was a rare instance of a
      (Western kids) series that had multiple girl protagonists who were both girly and badass, and
      didn't need any love interests. Second of all, I realized that the series used pretty adult
      humor sometimes, and could be downright hilarious also when watching it as a grown-up.
    </p>
    <p>
      My first thought when brainstorming for this visualization, was: could I do something with the
      transcripts? Luckily, I easily found almost all transcripts at
      <a class="color" href="https://powerpuffgirls.fandom.com/">powerpuffgirls.fandom.com</a>. From
      there, I decided that the central question would be:
      <span class="color">Who are the biggest talkers in Townsville?</span>
    </p>

    <p>
      Below you will find the result. It was a lot of fun to make, and hopefully also a lot of fun
      to explore!
    </p>

    <button class="nostalgia-intro__scroll">
      &#8681; Scroll down for an explanation of the viz
    </button>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.nostalgia-intro {
  width: 60%;
  max-width: 55rem;
  padding-bottom: 2rem;
  line-height: 140%;
  padding-top: 3rem;

  @include mobile {
    width: 100%;
  }

  p {
    margin-bottom: 0.75rem;

    &::first-letter {
      font-family: VinaSans;
      font-size: 1.75rem;
      margin-right: 0.05rem;
    }
  }

  a {
    &:hover {
      color: var(--blossom);
    }
  }

  .color {
    font-weight: 800;
  }

  .blossom {
    color: var(--blossom);
  }

  .bubbles {
    color: var(--bubbles);
  }

  .buttercup {
    color: var(--buttercup);
  }

  &__scroll {
    font-family: VinaSans;
    letter-spacing: 0.1rem;
    font-size: 1.1rem;

    &:hover {
      color: var(--blossom);
    }
  }
}
</style>
