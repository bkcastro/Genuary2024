import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const helper = new THREE.AxesHelper(10, 10)
scene.add(helper)


var n = 6
const angle = (2 * Math.PI) / n
var theta = 0;
const radius = 5;
const planes = [];

for (let i = 0; i < n; i++) {

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ color: "red", }));
    plane.position.set(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);

    plane.lookAt(new THREE.Vector3(0, 0, 0))
    planes.push(plane)
    scene.add(plane)

    theta += angle
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // theta += .002

    // planes.forEach((plane) => {
    //     plane.position.set(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
    //     plane.lookAt(new THREE.Vector3(0, 0, 0))
    //     theta += angle
    //     //console.log("hi")
    // })'

    camera.rotateY(.002)


    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()