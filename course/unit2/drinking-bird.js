'use strict' // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Drinking Bird Model exercise                                               //
// Your task is to complete the model for the drinking bird                   //
// Please work from the formal blueprint dimensions and positions shown at    //
// https://www.udacity.com/wiki/cs291/notes                                   //
//                                                                            //
// The following materials should be used:                                    //
// Hat and spine: cylinderMaterial (blue)                                     //
// Head and bottom body: sphereMaterial (red)                                 //
// Rest of body: cubeMaterial (orange)                                        //
//                                                                            //
// So that the exercise passes, and the spheres and cylinders look good,      //
// all SphereGeometry calls should be of the form:                            //
//     SphereGeometry( radius, 32, 16 );                                      //
// and CylinderGeometry calls should be of the form:                          //
//     CylinderGeometry( radiusTop, radiusBottom, height, 32 );               //
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer
var cameraControls, effectController
var clock = new THREE.Clock()
var gridX = false
var gridY = false
var gridZ = false
var axes = true
var ground = true
var wireframe = false

function init() {
  var canvasWidth = 846
  var canvasHeight = 494
  // For grading the window is fixed in size; here's general code:
  //var canvasWidth = window.innerWidth;
  //var canvasHeight = window.innerHeight;
  var canvasRatio = canvasWidth / canvasHeight

  // RENDERER
  renderer = new THREE.WebGLRenderer({antialias: true})
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.setSize(canvasWidth, canvasHeight)
  renderer.setClearColorHex(0xaaaaaa, 1.0)

  // CAMERA
  camera = new THREE.PerspectiveCamera(45, canvasRatio, 1, 40000)
  // CONTROLS
  cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement)

  camera.position.set(-480, 659, -619)
  cameraControls.target.set(4, 301, 92)

  fillScene()
}

// Supporting frame for the bird - base + legs + feet
function createSupport() {
  var cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xf07020,
    wireframe,
  })
  // base
  var cube
  cube = new THREE.Mesh(new THREE.CubeGeometry(20 + 64 + 110, 4, 2 * 77), cubeMaterial)
  cube.position.x = -45 // (20+32) - half of width (20+64+110)/2
  cube.position.y = 4 / 2 // half of height
  cube.position.z = 0 // centered at origin
  scene.add(cube)

  // right foot
  cube = new THREE.Mesh(new THREE.CubeGeometry(20 + 64 + 110, 52, 6), cubeMaterial)
  cube.position.x = -45 // (20+32) - half of width (20+64+110)/2
  cube.position.y = 52 / 2 // half of height
  cube.position.z = 77 + 6 / 2 // offset 77 + half of depth 6/2
  scene.add(cube)

  // right leg
  cube = new THREE.Mesh(new THREE.CubeGeometry(64, 334 + 52, 6), cubeMaterial)
  cube.position.x = 0 // centered on origin along X
  cube.position.y = (334 + 52) / 2
  cube.position.z = 77 + 6 / 2 // offset 77 + half of depth 6/2
  scene.add(cube)

  // left foot
  cube = new THREE.Mesh(new THREE.CubeGeometry(20 + 64 + 110, 52, 6), cubeMaterial)
  cube.position.x = -45 // (20+32) - half of width (20+64+110)/2
  cube.position.y = 52 / 2 // half of height
  cube.position.z = -(77 + 6 / 2) // offset 77 + half of depth 6/2
  scene.add(cube)

  // left leg
  cube = new THREE.Mesh(new THREE.CubeGeometry(64, 334 + 52, 6), cubeMaterial)
  cube.position.x = 0 // centered on origin along X
  cube.position.y = (334 + 52) / 2
  cube.position.z = -(77 + 6 / 2) // offset 77 + half of depth 6/2
  scene.add(cube)
}

// Body of the bird - body and the connector of body and head
function createBody() {
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xa00000,
    wireframe,
  })
  var cylinderMaterial = new THREE.MeshLambertMaterial({
    color: 0x0000d0,
    wireframe,
  })

  const bottomSphere = new THREE.Mesh(new THREE.SphereGeometry(58, 32, 16), sphereMaterial)
  bottomSphere.position.x = 0
  const spherePositionY = 160
  bottomSphere.position.y = spherePositionY
  bottomSphere.position.z = 0 // offset 77 + half of depth 6/2
  scene.add(bottomSphere)

  const cylinderHeight = 390
  const bodyCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(24, 24, cylinderHeight, 32),
    cylinderMaterial
  )
  bodyCylinder.position.x = 0
  bodyCylinder.position.y = spherePositionY + cylinderHeight / 2
  bodyCylinder.position.z = 0 // offset 77 + half of depth 6/2
  scene.add(bodyCylinder)
}

// Head of the bird - head + hat
function createHead() {
  var sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0xa00000,
    wireframe,
  })
  var cylinderMaterial = new THREE.MeshLambertMaterial({
    color: 0x0000d0,
    wireframe,
  })

  const headSphere = new THREE.Mesh(new THREE.SphereGeometry(52, 32, 16), sphereMaterial)
  headSphere.position.x = 0
  const headSpherePositionY = 550
  headSphere.position.y = headSpherePositionY
  headSphere.position.z = 0
  scene.add(headSphere)

  const cylinderBaseHeight = 10
  const hatBaseCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(71, 71, cylinderBaseHeight, 32),
    cylinderMaterial
  )
  hatBaseCylinder.position.x = 0
  hatBaseCylinder.position.y = headSpherePositionY + 40 + cylinderBaseHeight / 2
  hatBaseCylinder.position.z = 0
  scene.add(hatBaseCylinder)

  const hatTopHeight = 70
  const hatTopCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(40, 40, hatTopHeight, 32),
    cylinderMaterial
  )
  hatTopCylinder.position.x = 0
  hatTopCylinder.position.y = hatBaseCylinder.position.y + cylinderBaseHeight / 2 + hatTopHeight / 2
  hatTopCylinder.position.z = 0
  scene.add(hatTopCylinder)
}

function createDrinkingBird() {
  // MODELS
  // base + legs + feet
  createSupport()

  // body + body/head connector
  createBody()

  // head + hat
  createHead()
}

function fillScene() {
  // SCENE
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x808080, 3000, 6000)
  // LIGHTS
  var ambientLight = new THREE.AmbientLight(0x222222)
  var light = new THREE.DirectionalLight(0xffffff, 1.0)
  light.position.set(200, 400, 500)

  var light2 = new THREE.DirectionalLight(0xffffff, 1.0)
  light2.position.set(-400, 200, -300)

  scene.add(ambientLight)
  scene.add(light)
  scene.add(light2)

  if (ground) {
    Coordinates.drawGround({size: 1000})
  }
  if (gridX) {
    Coordinates.drawGrid({
      size: 1000,
      scale: 0.01,
    })
  }
  if (gridY) {
    Coordinates.drawGrid({
      size: 1000,
      scale: 0.01,
      orientation: 'y',
    })
  }
  if (gridZ) {
    Coordinates.drawGrid({
      size: 1000,
      scale: 0.01,
      orientation: 'z',
    })
  }
  if (axes) {
    Coordinates.drawAllAxes({
      axisLength: 300,
      axisRadius: 2,
      axisTess: 50,
    })
  }
  createDrinkingBird()
}

//
function addToDOM() {
  var container = document.getElementById('container')
  var canvas = container.getElementsByTagName('canvas')
  if (canvas.length > 0) {
    container.removeChild(canvas[0])
  }
  container.appendChild(renderer.domElement)
}

function animate() {
  window.requestAnimationFrame(animate)
  render()
}

function render() {
  var delta = clock.getDelta()
  cameraControls.update(delta)
  if (
    effectController.newGridX !== gridX ||
    effectController.newGridY !== gridY ||
    effectController.newGridZ !== gridZ ||
    effectController.newGround !== ground ||
    effectController.newAxes !== axes ||
    effectController.newWireframe !== wireframe
  ) {
    gridX = effectController.newGridX
    gridY = effectController.newGridY
    gridZ = effectController.newGridZ
    ground = effectController.newGround
    axes = effectController.newAxes
    wireframe = effectController.newWireframe

    fillScene()
  }
  renderer.render(scene, camera)
}

function setupGui() {
  effectController = {
    newGridX: gridX,
    newGridY: gridY,
    newGridZ: gridZ,
    newGround: ground,
    newAxes: axes,
    newWireframe: wireframe,
  }

  var gui = new dat.GUI()
  gui.add(effectController, 'newGridX').name('Show XZ grid')
  gui.add(effectController, 'newGridY').name('Show YZ grid')
  gui.add(effectController, 'newGridZ').name('Show XY grid')
  gui.add(effectController, 'newGround').name('Show ground')
  gui.add(effectController, 'newAxes').name('Show axes')
  gui.add(effectController, 'newWireframe').name('Wireframe')
}

try {
  init()
  setupGui()
  addToDOM()
  animate()
} catch (e) {
  var errorReport =
    'Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>'
  $('#container').append(errorReport + e)
}
