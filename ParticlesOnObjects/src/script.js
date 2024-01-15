import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
gui.hide();


const gltfLoader = new GLTFLoader()
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
scene.background = new THREE.Color(0xffffff); 


const light = new THREE.AmbientLight( 0x404040, 20 ); // soft white light
scene.add( light );


function createParticles(model) {
    const geometry = new THREE.BufferGeometry();
    let vertices = [];

    model.traverse(function(child) {
        console.log('Hi')
        if (child.isMesh) {
            const meshVertices = child.geometry.attributes.position.array;
            for (let i = 0; i < meshVertices.length; i += 3) {
                vertices.push(meshVertices[i], meshVertices[i + 1], meshVertices[i + 2]);
            }
        }
    });

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ color: 0x000000, size: 0.01 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

gltfLoader.load(
    '/models/skeleton/skeleton3.glb',
    (gltf) =>
    {
        gltf.scene.rotation.z = Math.PI * 0.5
        console.log(gltf.scene.children[0])
        createParticles(gltf.scene.children[0]);
        //scene.add(gltf.scene)
    }
)



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