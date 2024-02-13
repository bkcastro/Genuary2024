import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { XRButton } from 'three/addons/webxr/XRButton.js';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

import GUI from 'lil-gui'

// Debug
const gui = new GUI()
gui.hide();

// Scene
const scene = new THREE.Scene()

//scene.add(new THREE.AxesHelper(10, 10));

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 100000
parameters.size = .01
parameters.radius = 1
parameters.branches = 80
parameters.spin = 1
parameters.randomness = 0.08
parameters.randomnessPower = .01
parameters.insideColor = '#000000'//'#0d0909'
parameters.outsideColor = '#f21ee2' //'#95e8e6'
parameters.translate = [0, 0, 0];

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
        const randomX = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius) + parameters.translate[0]
        const randomY = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius) + parameters.translate[0]
        const randomZ = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius) + parameters.translate[0]

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

    material = new THREE.ShaderMaterial({
        depthWrite: false,
        //blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            uSize: { value: 2 * renderer.getPixelRatio() },
            uTime: { value: 0 },
        }
    })
    /**
     * Points
     */
    points = new THREE.Points(geometry, material)

    points.position.set(0, 0, 0);
    points.scale.set(.1, .1, .1);

    //points.rotateX(Math.PI/10)
    scene.add(points)
}

gui.add(parameters, 'count').min(100).max(20000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(100).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 20
camera.position.y = 30
camera.position.z = 10
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

const container = document.getElementById("container");

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);
renderer.setClearColor(new THREE.Color(0xffffFF));


// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.add(controls);

generateGalaxy()

/**
 * Animate
 */
const clock = new THREE.Clock()

renderer.setAnimationLoop(function () {

    const elapsedTime = clock.getElapsedTime()

    if (elapsedTime < 100) {
        material.uniforms.uTime.value = elapsedTime / 1000;
    }

    // Update controls
    //controls.update()


    renderer.render(scene, camera);

});