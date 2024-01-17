import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import { Core, Stripes, Boxes } from './objects.js'
import css from 'styled-jsx/css'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })


// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const debugObject = {
    color: "#ece2bd",
    recColor: "#ece2bd"
}

// Set the background color of the scene
scene.background = new THREE.Color(debugObject.color);

gui
    .addColor(debugObject, 'color')
    .onChange(() =>
    {
        scene.background.set(debugObject.color)
    })

const light = new THREE.AmbientLight( 0x404040, 120 ); // soft white light
scene.add( light );


for (var i = 0; i < 50; i++) {
    const stripes = new Stripes(5); 

    const x = Math.random() * 40- 20
    const y = Math.random() * 40- 20
    const z = Math.random() * 40- 20

    stripes.group.position.set(x, y, z)

    if (Math.random() > 0.5) {
        stripes.group.rotateY(Math.PI/2) 
    }

    scene.add(stripes.group);
}

for (var i = 0; i < 50; i++) {
    const boxes = new Boxes();

    const x = Math.random() * 40- 20
    const y = Math.random() * 40- 20
    const z = Math.random() * 40- 20

    boxes.group.position.set(x, y, z)

    if (Math.random() > 0.5) {
        boxes.group.rotateY(Math.PI/2) 
    }

    scene.add(boxes.group);
}

window.addEventListener('resize', () =>
{
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,18)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    
    // Render
    renderer.render(scene, camera)

    setTimeout( function() {

         // Call tick again on the next frame
        window.requestAnimationFrame(tick)

    }, 1000 / 60 );
   
}

tick()