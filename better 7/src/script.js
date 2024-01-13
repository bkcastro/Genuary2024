import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
gui.hide();

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

// Set the background color of the scene
scene.background = new THREE.Color(0xffffff); // 0xffffff is the color white in hexadecimal

const geometry = new THREE.CylinderGeometry( 1, 1, 20, 32, 50 , true); 

const material = new THREE.ShaderMaterial({
    vertexShader: vertex, 
    fragmentShader: fragment, 
    uniforms: {
        uSize: { value: 4 * renderer.getPixelRatio() },
        uTime: { value: 0 },
        color1: { value: new THREE.Color("red") },
        color2: { value: new THREE.Color("#05ff50") },
        uDuration: { value: 5 },
    },
    wireframe: true, 
})


let mesh = new THREE.Mesh( geometry, material );

mesh.rotateZ(-Math.PI / 2);

scene.add( mesh )

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

    material.uniforms.uTime.value = elapsedTime

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