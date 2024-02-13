import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

// Debug
const gui = new GUI({ width: 340 })
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const helper = new THREE.AxesHelper(10);
scene.add(helper)

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

function grid(width, height, padding) {

    for (let i = -width / 2; i < width / 2; i++) {
        for (let j = -height / 2; j < height / 2; j++) {
            const clone = mesh.clone();
            clone.position.set(i * padding, j * padding, 0);
            cubes.push(clone)
            scene.add(clone)
        }
    }
}

grid(6, 5, 4)

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.OrthographicCamera(sizes.width / -100, sizes.width / 100, sizes.height / 100, sizes.height / -100, 0.01, 1000);
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
camera.position.set(0, 0, 1)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0xffffff, 0); // Set background color to white

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