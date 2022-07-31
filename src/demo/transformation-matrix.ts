import * as THREE from 'three'
import {Pane} from 'tweakpane'

/*
The demo is about transformations and how we can use matrices to combine them.
*/

document.title = 'Transformations'

const camera = getOrthographicCamera()
const mesh = getBox()
const axesHelper = new THREE.AxesHelper(5)
const scene = new THREE.Scene()
scene.add(axesHelper)
scene.add(mesh)
scene.add(getContour(mesh.geometry))

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)
const params = initParams()


function getContour(geometry: THREE.BufferGeometry) {
  const edges = new THREE.EdgesGeometry(geometry)
  const material = new THREE.LineBasicMaterial({color: 0xffffff})
  return new THREE.LineSegments(edges, material)
}

function animation(time: number) {
  mesh.position.x = params.position.x
  mesh.position.y = params.position.y

  renderer.render(scene, camera)
}

function getBox() {
  const geometry = new THREE.BoxGeometry(5, 10, 0)
  const material = new THREE.MeshBasicMaterial({color: 0xcccccc})
  return new THREE.Mesh(geometry, material)
}

function getOrthographicCamera() {
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight
  const aspectRatio = screenWidth / screenHeight
  const minCameraSize = 50
  let cameraWidth = minCameraSize * aspectRatio
  let cameraHeight = minCameraSize
  if (aspectRatio < 1) {
    cameraWidth = minCameraSize
    cameraHeight = minCameraSize / aspectRatio
  }
  let halfCameraWidth = cameraWidth / 2
  let halfCameraHeight = cameraHeight / 2
  const result = new THREE.OrthographicCamera(
    -halfCameraWidth,
    halfCameraWidth,
    halfCameraHeight,
    -halfCameraHeight
  )
  result.position.z = 1
  return result
}

function initParams() {
  const params = {position: {x: 0, y: 0}}
  const pane = new Pane()
  pane.addInput(params, 'position', {
    x: {min: -100, max: 100},
    y: {min: -100, max: 100, inverted: true},
  })
  return params
}
