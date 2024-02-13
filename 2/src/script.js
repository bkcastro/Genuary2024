import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

// Shaders 
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

function generateRandomColor() {
    const r = Math.random() / 2;
    const g = Math.random() / 2;
    const b = Math.random() / 2;
    return new THREE.Color(r, g, b);
}

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}
//gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Geometry
const waterGeometry = new THREE.PlaneGeometry(10, 10, 180, 180)

// Colors
debugObject.depthColor = '#ab5454'
debugObject.surfaceColor = '#ff3737'


// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.144 },
        uBigWavesFrequency: { value: new THREE.Vector2(5.646, 2.939) },
        uBigWavesSpeed: { value: 1.442 },
        uDepthColorOld: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColorOld: { value: new THREE.Color(debugObject.surfaceColor) },
        uDepthColorNew: { value: generateRandomColor() },
        uSurfaceColorNew: { value: generateRandomColor() },
        uColorOffset: { value: .01 },
        uColorMultiplier: { value: 5 },
        uSmallWavesElevation: { value: 0.329 },
        uSmallWavesFrequency: { value: 1.531 },
        uSmallWavesSpeed: { value: 0.421 },
        uSmallIterations: { value: 1 },
    },
    wireframe: true,
})



gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(50).step(0.001).name('uBigWavesFrequencyX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(50).step(0.001).name('uBigWavesFrequencyY')

gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(4).step(0.001).name('uBigWavesSpeed')

gui.addColor(debugObject, 'depthColor').onChange(() => { waterMaterial.uniforms.uDepthColorNew.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { waterMaterial.uniforms.uSurfaceColorNew.value.set(debugObject.surfaceColor) })

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('uSmallWavesSpeed')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(5).step(1).name('uSmallIterations')

// Mesh
const water = new THREE.Points(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 4, 0)
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
renderer.setClearColor(0xffffff, 1); // Set background color to white

/**
 * Animate
 */
const clock = new THREE.Clock()

setInterval(() => {
    waterMaterial.uniforms.uDepthColorNew.value.set(generateRandomColor())
    waterMaterial.uniforms.uSurfaceColorNew.value.set(generateRandomColor())
}, 2000)


let angle = 0
const radius = 0.01
const speed = 0.01 / 2

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    setTimeout(function () {

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)

    }, 1000 / 30);


}

tick()