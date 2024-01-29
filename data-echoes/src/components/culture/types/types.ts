export type Spice = {
  regions: string[]
  translation: string
  name: string
  count: number
  color: number[]
  description?: string
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

export type Recipe = {
  recipe: string
  amount: number
  ingredient_counts: { [k: string]: number }
  description?: string
  links: string[]
}
