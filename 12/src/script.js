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
//gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const helper = new THREE.AxesHelper(10);
scene.add(helper)

const debugObject = {
    color: "#ece2bd",
    recColor: "#ece2bd"
}

// Set the background color of the scene
scene.background = new THREE.Color(debugObject.color);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const material = new THREE.ShaderMaterial({
    wireframe: true,

    vertexColors: true,
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uTime: { value: 0 },
    }
})
const geometry = new THREE.BoxGeometry(1, 1, 1)
const mesh = new THREE.Mesh(geometry, material)

const cubes = []
const group = new THREE.Group();

function grid(width, height, padding) {

    for (let i = -width / 2; i < width / 2; i++) {
        for (let j = -height / 2; j < height / 2; j++) {
            const clone = mesh.clone();
            clone.position.set(i * padding, j * padding, 0);
            cubes.push(clone)
            //group.add(clone)
            scene.add(clone)
        }
    }
}

grid(6, 5, 4)
//scene.add(group)

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //   // Update camera aspect ratio
    //   camera.left = sizes.width / -2;
    //   camera.right = sizes.width / 2;
    //   camera.top = sizes.height / 2;
    //   camera.bottom = sizesheight / -2;

    // Update camera projection matrix
    //camera.aspect = width / height;
    camera.updateProjectionMatrix();


    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(0, 1.3, 0)
// scene.add(camera)

const camera = new THREE.OrthographicCamera(sizes.width / -100, sizes.width / 100, sizes.height / 100, sizes.height / -100, 0.01, 100);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
camera.position.set(0, 0, 1)
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

    // Update controls
    controls.update()

    cubes.forEach((cube) => {
        cube.rotation.x = Math.sin(elapsedTime)
        cube.rotation.y = Math.cos(elapsedTime)
    })

    // Render
    renderer.render(scene, camera)

    setTimeout(function () {

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)

    }, 1000 / 30);


}

tick()