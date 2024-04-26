export type GOTCharacter = {
  name: string
  allegiance: string[]
  url: string
  mother: string | null
  father: string | null
  spouse: string[] | null
  motherRumored: string | null
  fatherRumored: string | null
  generationsBefore: number
  mostGenerationsSpouse: number
}

export type TreeNode = {
  id: string
  data: GOTCharacter
  index: number
  x: number
  y: number
  vy: number
  vx: number
}
