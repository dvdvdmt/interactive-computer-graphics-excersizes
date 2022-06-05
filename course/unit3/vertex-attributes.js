'use strict' // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
/*global THREE, window, document, $*/
var camera, scene, renderer
var cameraControls
var clock = new THREE.Clock()

function fillScene() {
  scene = new THREE.Scene()

  var light = new THREE.DirectionalLight(0xffffff, 1.0)
  light.position.set(200, 400, 500)

  var light2 = new THREE.DirectionalLight(0xffffff, 1.0)
  light2.position.set(-400, 200, -300)

  scene.add(light)
  scene.add(light2)

  // Triangle Mesh
  var material, geometry, mesh
  material = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors,
    side: THREE.DoubleSide,
  })
  geometry = new THREE.Geometry()

  geometry.vertices.push(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1)
  )

  geometry.faces.push(new THREE.Face3(0, 1, 2))

  var color1 = new THREE.Color(0xff0000) // orange
  var color2 = new THREE.Color(0x00ff00) // olive
  var color3 = new THREE.Color(0x0000ff) // bright blue

  geometry.faces[0].vertexColors = [color1, color2, color3]

  mesh = new THREE.Mesh(geometry, material)

  Coordinates.drawAllAxes({
    axisLength: 5,
    axisRadius: 0.02,
    axisTess: 50,
  })

  scene.add(mesh)
}

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
  camera = new THREE.PerspectiveCamera(55, canvasRatio, 1, 4000)
  camera.position.set(5, 5, 5)

  // CONTROLS
  cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement)
  cameraControls.target.set(0, 0, 0)
}

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

  renderer.render(scene, camera)
}

try {
  init()
  fillScene()
  addToDOM()
  animate()
} catch (e) {
  var errorReport =
    'Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>'
  $('#container').append(errorReport + e)
}
