import seedrandom from 'seedrandom'

type P5 = import('p5')

// Source: https://p5js.org/zh-Hans/examples/simulate-snowflakes.html
export class Snowflake {
  private posX: number
  private posY: number
  private initialAngle: number
  private size: number
  private radius: number

  constructor(
    private p: P5,
    private snowflakes: Snowflake[],
  ) {
    this.posX = 0
    this.posY = p.random(-50, 0)
    this.initialAngle = p.random(0, 2 * p.PI)
    this.size = p.random(2, 7)

    // Radius of snowflake spiral
    // Chosen so the snowflakes are uniformly spread out in area
    this.radius = p.sqrt(p.random(p.pow(p.width * 0.5, 2)))
  }

  // Methods

  update(time: number): void {
    // X position follows a circle
    const w = 0.05 // Angular speed
    const angle = w * time + this.initialAngle
    this.posX = this.p.width / 2 + this.radius * this.p.sin(angle)

    // Different size snowflakes fall at slightly different Y speeds
    this.posY += this.p.pow(this.size, 0.5) * 0.75

    // Delete snowflake if past end of screen
    if (this.posY > this.p.height) {
      const index = this.snowflakes.indexOf(this)
      this.snowflakes.splice(index, 1)
    }
  }

  display(): void {
    this.p.ellipse(this.posX, this.posY, this.size)
  }
}

export class Flower {
  private posX: number
  private posY: number
  private flowerOpacity: number
  private petalSizes: number[]

  constructor(
    private p: P5,
    private x: number,
    private y: number,
    private opacity: number,
  ) {
    this.posX = x
    this.posY = y
    this.flowerOpacity = opacity
    this.petalSizes = [p.random(4, 7), p.random(3, 5), p.random(4, 7)]
  }

  // Methods

  update(): void {
    // TODO: Wave flower? Or no update
  }

  display(): void {
    this.p.line(this.posX, this.posY, this.posX, this.posY - 30)

    this.p.fill(0, this.flowerOpacity)

    // Petals
    this.petalSizes.map((size, i) => {
      this.p.circle(this.posX + 4 * (i - 1), this.posY + 4 * Math.abs(i - 1), size)
    })
  }
}

export class Sun {
  private x: number
  private y: number
  private radius: number
  private opacity: number

  constructor(private p: P5) {
    this.x = window.innerWidth * 0.425
    this.y = window.innerHeight * 0.07
    this.radius = 20
    this.opacity = 1
  }

  display(): void {
    this.p.fill(0, this.opacity)

    this.p.circle(this.x, this.y, this.radius * 3)
    // this.p.circle(this.x, this.y, this.radius * 2)
    // this.p.circle(this.x, this.y, this.radius)

    if (this.opacity < 200) {
      this.opacity++
    }
  }
}

export class Tree {
  private x: number
  private y: number
  private size: number
  private angle: number
  private lineWidth: number
  private time: number = 0
  private treeId: number

  static treeIdCounter: number = 0

  static setTreeId() {
    this.treeIdCounter++
  }

  constructor(
    private p: P5,
    x: number,
    y: number,
    size: number,
    angle: number,
    lineWidth: number,
  ) {
    this.x = x
    this.y = y
    this.size = size
    this.angle = angle
    this.lineWidth = lineWidth

    this.treeId = Tree.treeIdCounter
    Tree.setTreeId()
  }

  branch(len: number, angle: number, prevBranchNr: number): void {
    const branchNr = prevBranchNr + 1
    const timeToBranch = this.time - branchNr * 2000 - this.treeId * 90000 - 20000
    const opacity = Math.min(Math.max(0, timeToBranch / 1000), 100)
    const branchWidth = Math.max(1, this.lineWidth / Math.sqrt(branchNr))

    this.p.stroke(0, 0, 0, opacity)
    this.p.strokeWeight(branchWidth)
    this.p.line(0, 0, 0, -len)
    this.p.translate(0, -len)

    if (len > this.size / 8) {
      // Recursive left
      this.p.push()
      this.p.rotate(angle)
      this.branch(len * 0.75, angle, branchNr)
      this.p.pop()

      // Recursive right
      this.p.push()
      this.p.rotate(-angle)
      this.branch(len * 0.75, angle, branchNr)
      this.p.pop()
    }
  }

  update(time: number): void {
    this.time = time
  }

  display(): void {
    this.p.translate(this.x, this.y)
    this.branch(this.size, this.angle, 0)
  }
}

export class Bird {}
