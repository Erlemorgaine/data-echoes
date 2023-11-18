<script setup></script>

<template>
  <div class="nostalgia-sources">
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
  </div>
</template>

<style lang="scss" scoped>
.nostalgia-sources {
  margin-top: 3rem;
  margin-bottom: -1rem;

  ul {
    display: flex;
    justify-content: center;
    gap: 3rem;
  }

  &__title {
    font-family: VinaSans;
    margin-bottom: 0.25rem;
    position: relative;
    padding: 0.25rem;
    text-align: center;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-image: linear-gradient(90deg, var(--blossom), var(--bubbles), var(--buttercup));
    }
  }

  &__source {
    font-size: 0.7rem;

    &:hover {
      color: var(--blossom);
    }
  }
}
</style>
