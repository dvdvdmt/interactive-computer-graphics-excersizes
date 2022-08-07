import * as THREE from 'three'
import {Pane} from 'tweakpane'
import {Matrix4} from 'three'

/*
The demo is about transformations and how we can use matrices to combine them.
*/

document.title = 'Transformations'

let isRenderingNeeded = true
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

function getTransformationMatrix() {
  const result = new Matrix4()
  // Translation in XY coordinate plane
  const tx = params.position.x
  const ty = params.position.y
  // Rotation around Z axis. The plane XY is rotated around Z axis counterclockwise,
  // as a consequence all the points in it get the new coordinates,
  // which looks like they are rotated in clockwise direction.
  const {PI, cos, sin} = Math
  const theta = params.rotation * (PI / 2)
  const scale = params.scale
  // prettier-ignore
  result.set(
    scale*cos(theta), -scale*sin(theta), 0, tx,
    scale*sin(theta), scale*cos(theta), 0, ty,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ) // Scale and rotation matrices are multiplied but the transition part left intact.

  return result
}

function animation(time: number) {
  if (!isRenderingNeeded) {
    return
  }
  if (params.useMatrix) {
    mesh.matrixAutoUpdate = false
    mesh.matrix = getTransformationMatrix()
  } else {
    mesh.matrixAutoUpdate = true
    mesh.position.x = params.position.x
    mesh.position.y = params.position.y
    mesh.rotation.z = params.rotation * (Math.PI / 180)
    mesh.scale.x = params.scale
    mesh.scale.y = params.scale
  }
  renderer.render(scene, camera)
  isRenderingNeeded = false
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
  const params = {useMatrix: false, position: {x: 0, y: 0}, rotation: 0, scale: 1}
  const pane = new Pane()
  pane.addInput(params, 'useMatrix')
  pane.addInput(params, 'position', {
    x: {min: camera.left, max: camera.right},
    y: {min: camera.bottom, max: camera.top, inverted: true},
  })
  pane.addInput(params, 'rotation', {
    min: -180,
    max: 180,
  })
  pane.addInput(params, 'scale', {
    min: 0.1,
    max: 4,
  })
  pane.on('change', () => {
    isRenderingNeeded = true
  })
  return params
}
