// Types
export type Speaker = {
  speaker?: string
  villain?: string
  episode: string
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
  season: string | number
  episodeNr: string | number
  title?: string
  goodies: Speaker[]
  villains: Speaker[]
  goodiesTalking: number
  sumEpisode: number
} | null
