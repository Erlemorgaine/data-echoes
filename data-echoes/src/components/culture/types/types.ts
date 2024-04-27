import type { HierarchyNode } from "d3-hierarchy"

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

export type SunburstData = {
  child: string
  parent: string | undefined
  amountRecipe: number | undefined
  count: number
  ingredient: string | undefined
  recipe: string | undefined
}

export type RecursiveSunburstData = SunburstData | RecursiveSunburstData[]
export interface RecipeNode extends HierarchyNode<SunburstData> {
  x0: number
  x1: number
  y0: number
  y1: number
  id: string
  data: SunburstData
}

export type NumberArray = number[][] | NumberArray[]

export type Coordinates = [number, number]

export type CoordinatesArray = Coordinates[] | CoordinatesArray[]
