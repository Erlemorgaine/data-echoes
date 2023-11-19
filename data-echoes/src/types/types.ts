// Types
export type Speaker = {
  speaker?: string
  villain?: string
  episode?: string
  word_count_for_line: number
}

export type SpeakerWithSize = {
  speaker: string
  size: number
}

export type EpisodeSpeakers =
  | Speaker[]
  | {
      speakers: Speaker[]
      sum: number
      title?: string
      size?: number
      totalEpisodeSum?: number
    }

export type EpisodeContent = {
  title: string
  speakers: Speaker[]
  sum: number
  size?: number
  accumulatedSize?: number
  totalEpisodeSum?: number
  episodeCenter?: number
  episode?: string | number
  word_count_for_line?: number
}

export type Episode = {
  [episodeNr: string]: EpisodeContent
}

export type RawEpisode = {
  [episodeNr: string]: Speaker[]
}

export type DataEpisode = {
  [episodeNr: string]: EpisodeMetaData
}

export type EpisodeMetaData = {
  episode: string
  description: string
  word_count_for_line: number
  imdbLink?: string
  fandomLink?: string
}

export type Season = {
  [season: string]: Episode
}

export type SeasonalSpeakers = {
  [speaker: string]: number
}

export type SpeakersAndTotal = {
  speakers: SeasonalSpeakers
  total: number
  totalKeySpeakers?: number
}

export type SeasonWithSum = {
  [season: string]: SpeakersAndTotal
}

export type SpeakersPerSeason = {
  [season: string]: { speaker: string; amount: number; size: number }[]
}

export type Villain = {
  villain: string
  episode: string
  word_count_for_line: number
}

export type VillainsPerEpisode = {
  [episode: string]: Villain[]
}

export type HoveredSpeaker = { speaker: string; isVillain: boolean }

export type ModalData = {
  season: string
  episode: string
  description: string
  episodeNr: string | number
  title?: string
  topSpeakers: Speaker[]
  sumEpisode: number
  imdbLink?: string
  fandomLink?: string
} | null

export type TopEpisode = {
  season: number | string
  sumEpisode?: number
  episode_nr: string
  word_count_for_line: number
  episode: string
}

export type ModalTopEpisode = TopEpisode & {
  speakerAmount: number
  speakerPercentage: number
  speakers: Speaker[]
}

export type SpeakerModalData = {
  speaker: string
  imgLink: string
  episodes: ModalTopEpisode[]
} | null
