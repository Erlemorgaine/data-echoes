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

let renderer: WebGLRenderer | null
let scene: Scene | null
let controls: OrbitControls | null
let camera: PerspectiveCamera | null

let nodePlanes: Mesh[] = []

onMounted(() => {
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
    nodePlanes = nodes.map((node) => {
      const material = planeMaterial.clone()
      material.color.setRGB(Math.random(), Math.random(), Math.random())

      const plane = new Mesh(planeGeometry, material)
      plane.position.set(Math.random() * 2, Math.random() * 2, Math.random() * 2)
      scene.add(plane)

      return plane
    })

    // const points: Vector3[] = []
    // points.push(new Vector3(0, 0, 0))
    // points.push(new Vector3(0, 0, -10))

    // const lineGeometry = new BufferGeometry().setFromPoints(points)
    // const lineMaterial = new LineBasicMaterial({ color: 0x0000ff })
    // const line = new Line(lineGeometry, lineMaterial)

    // scene.add(line)

    animate()
    forceNetwork(width, height)
  }
}

function animate() {
  // Render
  if (renderer) renderer.render(scene, camera)

  // controls && controls.update()

  // Call tick again on the next frame
  window.requestAnimationFrame(animate)
}

function forceNetwork(width, height) {
  const ticked = () => {
    // link
    //   .attr('x1', (d) => d.source.x)
    //   .attr('y1', (d) => d.source.y)
    //   .attr('x2', (d) => d.target.x)
    //   .attr('y2', (d) => d.target.y)

    nodes.forEach((node) => {
      nodePlanes[node.index].position.set(node.x, node.y, node.z || 0)
    })
  }

  const simulation = forceSimulation(nodes)
    .force('center', forceCenter(width / 2, height / 2))
    .force('charge', forceManyBody().strength(-20))
    .force('collide', forceCollide().radius(5).strength(1).iterations(2))
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
