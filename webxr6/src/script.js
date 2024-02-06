import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ARButton } from 'three/addons/webxr/ARButton.js';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import { render } from 'react-dom';


// Canvas
//const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 600000
parameters.size = 0.005
parameters.radius = 5
parameters.branches = 40
parameters.spin = 1
parameters.randomness = 0.1
parameters.randomnessPower = 10
parameters.insideColor = '#3cf440'
parameters.outsideColor = '#0147eb'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const scales = new Float32Array(parameters.count * 1)
    const random = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3

        // Position
        const radius = Math.random() * parameters.radius

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        positions[i3] = Math.cos(branchAngle) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle) * radius

        // Random 
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        random[i3] = randomX
        random[i3 + 1] = randomY
        random[i3 + 2] = randomZ

        // Color
        const mixedColor = insideColor.clone()
        mixedColor.lerp(outsideColor, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        // Scale
        scales[i] = Math.random()
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 3))

    /**
     * Material
     */
    // material = new THREE.PointsMaterial({
    //     size: parameters.size,
    //     sizeAttenuation: true,
    //     depthWrite: false,
    //     blending: THREE.AdditiveBlending,
    //     vertexColors: true
    // })

    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            uSize: { value: 30 * renderer.getPixelRatio() },
            uTime: { value: 0 },
        }
    })
    /**
     * Points
     */
    points = new THREE.Points(geometry, material)

    //points.rotateX(Math.PI/10)
    scene.add(points)
}

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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 30)
// camera.position.x = 8
// camera.position.y = 1
// camera.position.z = 0
// camera.lookAt(new THREE.Vector3(0, 0, 0))
//scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */

const container = document.createElement('div');
document.body.appendChild(container);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);


document.body.appendChild(ARButton.createButton(renderer));

generateGalaxy()

// setInterval(() => {
//     parameters.radius += 0.1/10
//     generateGalaxy()
// }, 1000/30)

/**
 * Animate
 */
const clock = new THREE.Clock()

renderer.setAnimationLoop(function () {

    const elapsedTime = clock.getElapsedTime()

    material.uniforms.uTime.value = elapsedTime;
    // Update controls
    //controls.update()


    renderer.render(scene, camera);

});