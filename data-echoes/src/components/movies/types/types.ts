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
}

export type MoviePersonKey = keyof MoviePerson
