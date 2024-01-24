export type Spice = {
  regions: string[]
  translation: string
  name: string
  count: number
  color: number[]
}

export enum Sections {
  intro = 'intro',
  map = 'map',
  sunburst = 'sunburst',
}

export enum Position {
  fixed = 'fixed',
  absolute = 'absolute',
}
