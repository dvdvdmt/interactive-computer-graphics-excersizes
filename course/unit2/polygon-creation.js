'use strict' // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
////////////////////////////////////////////////////////////////////////////////
// Polygon Creation Exercise
// Your task is to complete the function PolygonGeometry(sides)
// which takes 1 argument:
//   sides - how many edges the polygon has.
// Return the mesh that defines the minimum number of triangles necessary
// to draw the polygon.
// Radius of the polygon is 1. Center of the polygon is at 0, 0.
////////////////////////////////////////////////////////////////////////////////
/*global THREE, Coordinates, $, document*/

var camera, scene, renderer
var windowScale
const settings = {
  sides: 5,
  frames: false,
}

function setupGui() {
  var gui = new dat.GUI()

  var element = gui.add(settings, 'sides', 1, 100).step(1.0)
  element.name('Sides')
  var element = gui.add(settings, 'frames')
  element.name('Frames')
}

function getPolygonGeometry(sides) {
  var geo = new THREE.Geometry()

  // generate vertices
  for (var i = 0; i < sides; i++) {
    // YOUR CODE HERE
    //Save the vertex location - fill in the code
    geo.vertices.push(getVertexVector(i))
    if (i >= 2) {
      geo.faces.push(new THREE.Face3(0, i - 1, i))
    }
  }

  // Return the geometry object
  return geo

  function getVertexVector(number) {
    var angle = Math.PI / 2 + (number / sides) * 2 * Math.PI

    var x = Math.cos(angle)
    var y = Math.sin(angle)
    return new THREE.Vector3(x, y, 0)
  }
}

function init() {
  setupGui()
  // Setting up some parameters
  var canvasWidth = 846
  var canvasHeight = 494
  // For grading the window is fixed in size; here's general code:
  //var canvasWidth = window.innerWidth;
  //var canvasHeight = window.innerHeight;
  var canvasRatio = canvasWidth / canvasHeight
  // scene
  scene = new THREE.Scene()

  // Camera: Y up, X right, Z up
  windowScale = 4
  var windowWidth = windowScale * canvasRatio
  var windowHeight = windowScale

  camera = new THREE.OrthographicCamera(
    windowWidth / -2,
    windowWidth / 2,
    windowHeight / 2,
    windowHeight / -2,
    0,
    40
  )

  var focus = new THREE.Vector3(0, 1, 0)
  camera.position.x = focus.x
  camera.position.y = focus.y
  camera.position.z = 10
  camera.lookAt(focus)

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    preserveDrawingBuffer: true,
  })
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.setSize(canvasWidth, canvasHeight)
  renderer.setClearColorHex(0xffffff, 1.0)
}

function showGrids() {
  // Background grid and axes. Grid step size is 1, axes cross at 0, 0
  Coordinates.drawGrid({
    size: 100,
    scale: 1,
    orientation: 'z',
  })
  // Coordinates.drawAxes({axisLength:4,axisOrientation:"x",axisRadius:0.02});
  // Coordinates.drawAxes({axisLength:3,axisOrientation:"y",axisRadius:0.02});
}

function addToDOM() {
  var container = document.getElementById('container')
  var canvas = container.getElementsByTagName('canvas')
  if (canvas.length > 0) {
    container.removeChild(canvas[0])
  }
  container.appendChild(renderer.domElement)
}

let polygonMesh

function render() {
  if (polygonMesh) {
    scene.remove(polygonMesh)
  }
  let polygonGeometry = getPolygonGeometry(settings.sides)
  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.FrontSide,
    wireframe: settings.frames,
  })
  polygonMesh = new THREE.Mesh(polygonGeometry, material)
  scene.add(polygonMesh)
  renderer.render(scene, camera)
}

// Main body of the script

function animate() {
  requestAnimationFrame(animate)
  render()
}

init()
showGrids()
addToDOM()
render()
animate()
