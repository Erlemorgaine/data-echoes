<script setup></script>

<template>
  <footer class="nostalgia-sources">
    <div id="sources-title" class="nostalgia-sources__title">Sources</div>
    <ul>
      <li
        v-for="(link, source) of {
          'IMDb: The Powerpuff Girls (TV Series 1998–2004)':
            'https://www.imdb.com/title/tt0175058/',
          'Powerpuff Girls Wiki | Transcripts':
            'https://powerpuffgirls.fandom.com/wiki/Powerpuff_Girls_Wiki',
          'The Rowdyruff Net | Reviews & Transcripts': 'http://www.rowdyruff.net/reviews.shtml',
          'TV Tropes: The Powerpuff Girls (1998)':
            'https://tvtropes.org/pmwiki/pmwiki.php/WesternAnimation/ThePowerpuffGirls1998',
        }"
        :key="source"
        aria-labelledby="sources-title"
        class="nostalgia-sources__source"
      >
        <a :href="link">{{ source }}</a>
      </li>
    </ul>
  </footer>
</template>

<style lang="scss" scoped>
.nostalgia-sources {
  margin-top: 3rem;
  margin-bottom: -1rem;
  width: 100%;

  @media screen and (min-width: 1440px) {
    width: calc(100% + 3vw);
    margin-left: -3vw;
  }

  ul {
    display: flex;
    justify-content: center;
    gap: 3rem;

    @include mobile {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  &__title {
    font-family: VinaSans;
    margin-bottom: 0.25rem;
    position: relative;
    padding: 0.25rem;
    text-align: center;

    @include powerpuff-line;
  }

  &__source {
    font-size: 0.7rem;

    &:hover {
      color: var(--blossom);
    }
  }
}
</style>
