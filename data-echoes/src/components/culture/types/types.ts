import type { DefaultArcObject } from 'd3-shape'

export type Spice = {
  regions: string[]
  translation: string
  name: string
  count: number
  color: number[]
  description?: string
  source?: string
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

export interface Recipe {
  recipe: string
  amount: number
  ingredient_counts: Record<string, number>
  description?: string
  links: { link: string; site: string }[]
}

export type RecipeWithAmount = Recipe & {
  amountRecipe: number
  parent: string
  child: string
  ingredient: string
}

export interface RecipeNode extends DefaultArcObject {
  x0: number
  x1: number
  y0: number
  y1: number
  data: RecipeWithAmount
}

export type NumberArray = number[][] | NumberArray[]

export type Coordinates = [number, number]

export type CoordinatesArray = Coordinates[] | CoordinatesArray[]
