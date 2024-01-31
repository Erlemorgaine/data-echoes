<script setup lang="ts">
import type { random } from 'lodash'
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
  LineBasicMaterial,
  Line,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import {
  forceSimulation,
  forceCenter,
  forceManyBody,
  forceCollide,
  forceLink,
  forceX,
  forceY,
} from 'd3-force'
import { onMounted, ref } from 'vue'

import { nodes, links } from './data/network-data.json'

const canvasContainer = ref<HTMLElement | null>(null)
const nodeObject = ref({})

let renderer: WebGLRenderer | null
let scene: Scene | null
let controls: OrbitControls | null
let camera: PerspectiveCamera | null

let nodePlanes: Mesh[] = []
let linkLines: Line[] = []

onMounted(() => {
  nodeObject.value = nodes.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})
  createScene()
})

function createScene() {
  if (canvasContainer.value) {
    const { width, height } = canvasContainer.value.getBoundingClientRect()

    const canvas = document.createElement('canvas')
    canvasContainer.value.appendChild(canvas)

    scene = new Scene()

    renderer = new WebGLRenderer({ canvas })
    renderer.setSize(width, height)

    camera = new PerspectiveCamera(75, width / height, 0.1, 100)
    camera.position.set(0, 0, 5)
    scene.add(camera)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enableZoom = true

    controls.update()

    const planeGeometry = new PlaneGeometry(0.5, 0.5)
    const planeMaterial = new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide })

    // Create planes for each node in the nodes array
    nodePlanes = nodes.map(() => {
      const material = planeMaterial.clone()
      material.color.setRGB(Math.random(), Math.random(), Math.random())

      const plane = new Mesh(planeGeometry, material)
      plane.position.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      scene.add(plane)

      return plane
    })

    // Create lines for each link in the links array
    const points: Vector3[] = []
    points.push(new Vector3(0, 0, 0))
    points.push(new Vector3(0, 0, -10))

    const lineMaterial = new LineBasicMaterial({ color: 0xffffff })

    // TODO: Try to reuse the geometry somehow or at least make it more performant
    linkLines = links.map(() => {
      const lineGeometry = new BufferGeometry().setFromPoints(points)
      const line = new Line(lineGeometry, lineMaterial)
      scene.add(line)

      return line
    })

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

function forceNetwork() {
  const ticked = () => {
    // Update link positions
    linkLines.forEach((line, index) => {
      const link = links[index]

      const source = nodeObject.value[link.source.id]
      const target = nodeObject.value[link.target.id]

      if (source && target) {
        // TODO: Find a way to take advantage of z to make it less of a mess
        const updatedVertices = [
          new Vector3(source.x, source.y, 0),
          new Vector3(target.x, target.y, 0),
        ]

        line.geometry.setFromPoints(updatedVertices)
      }
    })

    nodes.forEach((node) => {
      nodePlanes[node.index].position.set(node.x, node.y, node.z || 0)
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
