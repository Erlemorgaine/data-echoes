export enum Origin {
  African = 'african',
  Latino = 'latino',
  Asian = 'asian',
  White = 'white',
}

export interface MoviePerson {
  name: string
  year: number
  movie: string
  origin: Origin
  descent: string // TODO: Array
  won: boolean
}

export type MoviePersonKey = keyof MoviePerson

export type MovieBarData = { id: string; label?: string; value: number }
