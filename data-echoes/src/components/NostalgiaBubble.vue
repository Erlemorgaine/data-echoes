<template>
  <button
    v-for="(episodeData, episode) of episodes"
    :key="'episode' + episode"
    :class="[
      'nostalgia-bubble',
      {
        inactive:
          hoveredEpisode && hoveredEpisode.season === season && hoveredEpisode.episode !== episode,
      },
    ]"
    :style="{
      '--episode-size': episodeData.size,
      '--episode-accumulated-size': episodeData.accumulatedSize * -1,
    }"
    @mouseenter="$emit('onEpisodeHover', { season, episode })"
    @focus="$emit('onEpisodeHover', { season, episode })"
    @mouseleave="$emit('onEpisodeHover', null)"
    @blur="$emit('onEpisodeHover', null)"
  >
    <template
      v-for="speaker of getSpeakersWithAccumulatedSize(episodeData.speakers, episodeData.sum)"
    >
      <div
        v-if="keySpeakers.includes(speaker.speaker)"
        :key="speaker.speaker"
        :class="[
          'nostalgia-bubble__speaker',
          {
            inactive:
              (hoveredSeasonSpeaker &&
                hoveredSeasonSpeaker.season === season &&
                hoveredSeasonSpeaker.speaker !== speaker.speaker) ||
              (hoveredSpeaker && hoveredSpeaker !== speaker.speaker),
            active:
              (hoveredSeasonSpeaker &&
                hoveredSeasonSpeaker.season === season &&
                hoveredSeasonSpeaker.speaker === speaker.speaker) ||
              (hoveredSpeaker && hoveredSpeaker === speaker.speaker),
          },
        ]"
        :style="{
          '--speaker-size': speaker.accumulatedSize,
          '--speaker-children-size': speaker.childrenPercentage,
          '--speaker-color': `var(--${speaker.speaker})`,
          '--speaker-color-50': `var(--${speaker.speaker}-50)`,
          '--speaker-z-index': keySpeakers.indexOf(speaker.speaker),
        }"
      >
        <span class="nostalgia-bubble__speaker__size">
          {{ speaker.size + '%' }}
        </span>
      </div>
    </template>
  </button>
</template>

<script setup>
defineProps({
  season: {
    type: String,
    required: true,
  },
  episodes: {
    type: Object,
    required: true,
  },
  keySpeakers: {
    type: Array,
    required: true,
  },
  getSpeakersWithAccumulatedSize: Function,
  hoveredEpisode: { season: String, episode: String },
  hoveredSpeaker: String,
  hoveredSeasonSpeaker: { season: String, speaker: String },
})

defineEmits(['onEpisodeHover'])
</script>

<style lang="scss" scoped>
@container season (width > 1px) {
  .nostalgia-bubble {
    font-family: VinaSans;
    color: var(--off-white);
    position: relative;
    width: calc(100% * var(--episode-size));

    aspect-ratio: 1;
    aspect-ratio: 2;
    left: calc(var(--episode-accumulated-size) * 100cqw);
    transition: opacity 0.3s;

    &:focus {
      outline: none;
    }

    &:hover {
      z-index: 10;
    }

    &.inactive {
      opacity: 0.2;
    }

    &__speaker {
      position: absolute;
      top: 50%;
      top: 100%;
      left: 50%;
      transform: translate(-50%, -50%);
      // background-color: var(--speaker-color);
      background-image: radial-gradient(
        transparent 0% var(--speaker-children-size),
        var(--speaker-color) var(--speaker-children-size) 100%
      );
      width: calc(100% * var(--speaker-size));
      aspect-ratio: 1;
      border-radius: 50%;
      z-index: var(--speaker-z-index);
      transition: opacity 0.5s;

      &__size {
        position: absolute;
        bottom: calc(100% + 0.2rem);
        transform: translateX(-35%);
        opacity: 0;
      }

      &.inactive {
        opacity: 0;
      }

      &.active {
        background-image: radial-gradient(
          transparent 5% var(--speaker-children-size),
          var(--speaker-color-50) var(--speaker-children-size),
          var(--speaker-color),
          var(--off-white)
        );

        .nostalgia-bubble__speaker__size {
          opacity: 1;
        }
      }
    }
  }
}
</style>
