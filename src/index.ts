import * as THREE from 'three'

/** The original task is here https://learn.udacity.com/courses/cs291/lessons/d53da22e-ac4f-4047-9035-b5ee0f55fc77/concepts/11b2edd8-aef4-4789-bae9-69c08f4b8e0c
 * But it doesn't work with the most recent three js API.
 * Thanks for the documentation on BufferGeometry I solved the issue.
 * */

// init

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
camera.position.z = 5

const scene = new THREE.Scene()
// const mesh = getBoxMesh()
const mesh = getSquareMesh()
scene.add(mesh)

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.render(scene, camera)
renderer.setAnimationLoop(animation)
document.body.appendChild(renderer.domElement)

function animation(time: number) {
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  renderer.render(scene, camera)
}

function getSquareMesh() {
  const geometry = new THREE.BufferGeometry()
  // create a simple square shape. We duplicate the top left and bottom right
  // vertices because each vertex needs to appear once per triangle.
  // prettier-ignore
  const vertices = new Float32Array([
    //  first surface
    0, 0, 0,
    1, 0, 0,
    1, 1, 0,
    1, 1, 0,
    0, 1, 0,
    0, 0, 0,

    // second surface
    0, 0, 0,
    1, 1, 0,
    1, 0, 0,
    0, 0, 0,
    0, 1, 0,
    1, 1, 0,
  ])

  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  const material = new THREE.MeshBasicMaterial({color: 0x0000ff})
  return new THREE.Mesh(geometry, material)
}

function getBoxMesh() {
  const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
  const material = new THREE.MeshNormalMaterial()

  return new THREE.Mesh(geometry, material)
}
