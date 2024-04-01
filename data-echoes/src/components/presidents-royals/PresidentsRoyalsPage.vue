<script setup lang="ts">
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Mesh,
  Vector3,
  BufferGeometry,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  BufferAttribute,
  LineBasicMaterial,
  Line,
  QuadraticBezierCurve3,
  LineSegments,
  CatmullRomCurve3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { COLORS } from './data/presidentsRoyalsColors.ts'

import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide,
  forceLink,
  forceX,
  forceY,
} from 'd3-force'
import { onMounted, onBeforeUnmount, ref } from 'vue'

import { nodes, links } from './data/network-data.json'

const canvasContainer = ref<HTMLElement | null>(null)
const nodeObject = ref({})

const linksLength = links.length

let renderer: WebGLRenderer | null
let scene: Scene | null
let controls: OrbitControls | null
let camera: PerspectiveCamera | null

let nodePlanes: Mesh[] = []
let linkLines: Line[] = []
let linksGeometry: InstancedBufferGeometry | null

let mouseDown = ref(false)
let mouseY = ref(0)

onMounted(() => {
  nodeObject.value = nodes.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  createScene()

  document.addEventListener('keydown', moveVizOnY)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', moveVizOnY)
})

function moveVizOnY(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    camera.position.y += 2
  } else if (event.key === 'ArrowUp') {
    camera.position.y -= 2
  }

  // controls.update()
}

function addRenderer(width: number, height: number) {
  if (canvasContainer.value) {
    const canvas = document.createElement('canvas')
    canvasContainer.value.appendChild(canvas)

    renderer = new WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(width, height)
  }
}

function addCamera(scene: Scene, width: number, height: number) {
  camera = new PerspectiveCamera(75, width / height, 0.1, 100)
  camera.position.set(0, 0, 5)
  scene.add(camera)
}

function addControls(camera: PerspectiveCamera, renderer: WebGLRenderer) {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = true
  controls.enablePan = true
  controls.minPolarAngle = Math.PI / 2 // Limit rotation to vertical plane
  controls.maxPolarAngle = Math.PI / 2 // Limit rotation to vertical plane

  controls.keys = {
    LEFT: 'ArrowLeft', //left arrow
    UP: 'ArrowUp', // up arrow
    RIGHT: 'ArrowRight', // right arrow
    BOTTOM: 'ArrowDown', // down arrow
  }

  controls.update()
}

function createNodePlanes(scene: Scene) {
  const planeGeometry = new PlaneGeometry(0.5, 0.5)
  const planeMaterial = new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide })

  // Create planes for each node in the nodes array
  nodePlanes = nodes.map((node) => {
    const material = planeMaterial.clone()
    const allegiances = node.data.allegiance
    const color: number[] = COLORS[allegiances && allegiances[0]] || COLORS.Other

    material.color.setRGB(color[0] / 255, color[1] / 255, color[2] / 255)

    const plane = new Mesh(planeGeometry, material)
    plane.position.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
    scene.add(plane)

    return plane
  })
}

function createLinkLines(scene: Scene) {
  //   // Create base geometry (line of length 1 along X-axis)
  //   const baseGeometry = new BufferGeometry()
  //   const vertices = new Float32Array([-0.5, 0.5, 0, 0.5, 0.5, 0])
  //   baseGeometry.setAttribute('position', new BufferAttribute(vertices, 3))

  //   // Create instanced geometry
  //   const instancedGeometry = new InstancedBufferGeometry()
  //   instancedGeometry.index = baseGeometry.index
  //   instancedGeometry.attributes = baseGeometry.attributes

  //   // Set up instanced attributes (length and position) for each link

  //   const instanceLengths = new Float32Array(linksLength)
  //   const instancePositions = new Float32Array(linksLength * 3)

  //   // Set instance properties (length and position)
  //   for (let i = 0; i < linksLength; i++) {
  //     instanceLengths[i] = Math.random() * 2
  //     instancePositions[i * 3] = Math.random() * 10 - 5 // X
  //     instancePositions[i * 3 + 1] = Math.random() * 10 - 5 // Y
  //     instancePositions[i * 3 + 2] = Math.random() * 10 - 5 // Z
  //   }

  //   instancedGeometry.setAttribute('length', new InstancedBufferAttribute(instanceLengths, 1))

  //   instancedGeometry.setAttribute(
  //     'positionOffset',
  //     new InstancedBufferAttribute(instancePositions, 3),
  //   )

  //   const lineMaterial = new LineMaterial({ color: 0xffffff })
  //   const lines = new Line(instancedGeometry, lineMaterial)
  //   scene.add(lines)
  //   linksGeometry = instancedGeometry

  // Create lines for each link in the links array
  const points: Vector3[] = []
  points.push(new Vector3(0, 0, 0))
  points.push(new Vector3(0, 0, -10))

  const lines: Record<string, LineMaterial> = {
    spouse: new LineBasicMaterial({ color: 0xffffff }),
    parent: new LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 }),
  }

  // TODO: Try to reuse the geometry somehow or at least make it more performant
  linkLines = links.map((link) => {
    const lineGeometry = new BufferGeometry()
    setCurvePoints(points, lineGeometry)

    const line = new Line(lineGeometry, lines[link.type])
    scene.add(line)

    return line
  })
}

function setCurvePoints(points: Vector3[], geometry: BufferGeometry) {
  let curve = new CatmullRomCurve3(points, false, 'catmullrom', 0.2)
  const curvePoints = curve.getPoints(30)

  geometry.setFromPoints(curvePoints)
}

function createScene() {
  if (canvasContainer.value) {
    // Setup for scene
    const { width, height } = canvasContainer.value.getBoundingClientRect()
    scene = new Scene()

    addRenderer(width, height)
    addCamera(scene, width, height)
    addControls(camera, renderer)

    // Objects in scene
    createNodePlanes(scene)
    createLinkLines(scene)

    animate()
    forceNetwork()
  }
}

function animate() {
  // Render
  if (renderer) renderer.render(scene, camera)

  // controls && controls.update()

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

/**
 * Determines y position of nodes, based on generation of person in node
 * @param node
 */
function getYForNode(node) {
  const generationsCount = Math.max(node.data.generationsBefore, node.data.mostGenerationsSpouse)
  return -generationsCount * 4 + 30
}

// TODO: Maybe just remove the entire force graph and do everything programmatically
function forceNetwork() {
  const alpha = -0.1

  const ticked = () => {
    // Update link positions
    linkLines.forEach((line, index) => {
      const link = links[index]

      const source = nodeObject.value[link.source.id]
      const target = nodeObject.value[link.target.id]

      if (source && target) {
        // TODO: Find a way to take advantage of z to make it less of a mess
        const updatedVertices = [
          new Vector3(source.x, getYForNode(source), source.y),
          new Vector3(source.x, getYForNode(target), source.y),
          new Vector3(target.x, getYForNode(target), target.y),
        ]

        setCurvePoints(updatedVertices, line.geometry)

        // for (let i = 0; i < updatedVertices.length; i++) {
        //   const point = updatedVertices[i]
        //   line.geometry.attributes.position.setXYZ(i, point.x, point.y, point.z)
        // }

        // line.geometry.attributes.position.needsUpdate = true
      }
    })

    // // Update instance properties (length and position)
    // for (let i = 0; i < linksLength; i++) {
    //   linksGeometry.attributes.length.setX(i, Math.random() * 2 + 1) // Random length between 1 and 3
    //   linksGeometry.attributes.positionOffset.setXYZ(i, source.x, source.y, 0)
    // }

    // // Notify Three.js that attributes have changed
    // linksGeometry.attributes.length.needsUpdate = true
    // linksGeometry.attributes.positionOffset.needsUpdate = true

    nodes.forEach((node) => {
      if (node.data.spouse) {
        // TODO: Handle for multiple spouses
        const spouse = nodes.find((d) => d.id === node.data.spouse[0])
        if (spouse) {
          const dx = spouse.x - node.x
          const dy = spouse.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const desiredDistance = 1 // Set your desired distance
          const discrepancy = distance - desiredDistance

          // Calculate the adjustment needed
          const adjustmentRatio = (discrepancy / distance) * alpha
          const adjustX = dx * adjustmentRatio
          const adjustY = dy * adjustmentRatio

          // Apply the adjustment
          node.x -= adjustX
          // node.y -= adjustY
          spouse.x += adjustX
          // spouse.y += adjustY

          // node.x = adjustX - 5
          node.y = spouse.y
        }
      }

      nodePlanes[node.index].position.set(node.x, getYForNode(node), node.y)
    })
  }

  const simulation = forceSimulation(nodes)
    .force('center', forceCenter(0, 0))
    .force('charge', forceManyBody().strength(0))
    .force('collide', forceCollide().radius(0.5).strength(0.5).iterations(5))
    .force(
      'link',
      forceLink(links).id((d) => d.id),
    )
    .force('x', forceX())
    .force('y', forceY())

  simulation.on('tick', ticked)
}
</script>

<template>
  <div class="presidents-royals-page">
    <div ref="canvasContainer" class="presidents-royals-page__container" />
  </div>
</template>

<style lang="scss" scoped>
.presidents-royals-page {
  &__container {
    width: 100%;
    height: 100vh;
  }
}
</style>
