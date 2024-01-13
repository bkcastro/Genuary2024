import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

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

function getRandomAsciiChar() {
    // Generate a random number between 32 and 126
    const asciiCode = Math.floor(Math.random() * (127 - 32) + 32);

    // Convert the ASCII code to a character
    return String.fromCharCode(asciiCode);
}

function randomPointInSphere(radius) {
    let u = Math.random();
    let v = Math.random();
    let theta = u * 2.0 * Math.PI; // Angle around the X-axis
    let phi = Math.acos(2.0 * v - 1.0); // Angle from the Z-axis down
    let r = Math.cbrt(Math.random()) * radius; // Cube root to ensure uniform distribution

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);

    let x = r * sinPhi * cosTheta;
    let y = r * sinPhi * sinTheta;
    let z = r * cosPhi;

    return { x, y, z };
}

console.log(randomPointInSphere(500))

// Load font 
const loader = new FontLoader();

let asciis = [] 
let nameArray = []
let nameGroup = new THREE.Group
const material = new THREE.LineBasicMaterial({color: new THREE.Color("black")})
const nameMaterial = new THREE.LineBasicMaterial({color: new THREE.Color("red")})

function generateASCII(font) {

    var scale = 500; 

    for (var i = 0; i < 400; i++) {

        const geometry = new TextGeometry( getRandomAsciiChar(), {
            font: font,
            size: 40,
            height: 5,
        } );

        const randomX = Math.random() * 2 * Math.PI; // Rotation around X axis
        const randomY = Math.random() * 2 * Math.PI; // Rotation around Y axis
        const randomZ = Math.random() * 2 * Math.PI; // Rotation around Z axis   

        const point = randomPointInSphere(scale)

        const mesh = new THREE.Mesh( geometry, material )
        mesh.position.set(point.x, point.y, point.z)
        mesh.rotation.set(randomX, randomY, randomZ);
        asciis.push(mesh)
        scene.add( mesh )
    }

    let name = "bkcastro" 
    scale -= 100

    let cursor = -84;

    for (var i = 0; i < name.length; i++) {
        const geometry = new TextGeometry( name[i], {
            font: font,
            size: 40,
            height: 5,
        } );

        geometry.computeBoundingBox();

        const x = (Math.random()*scale*2)-scale
        const y = (Math.random()*scale*2)-scale
        const z = (Math.random()*scale*2)-scale   

        // const randomX = Math.random() * 2 * Math.PI; // Rotation around X axis
        // const randomY = Math.random() * 2 * Math.PI; // Rotation around Y axis
        // const randomZ = Math.random() * 2 * Math.PI; // Rotation around Z axis   
        
        const mesh = new THREE.Mesh( geometry, nameMaterial )
        mesh.position.set(x, y, z)
        //mesh.rotation.set(randomX, randomY, randomZ);
        scene.add( mesh )
        //nameGroup.add(mesh)
        nameArray.push({ initialPosition: new THREE.Vector3(x, y, z), targetPosition: new THREE.Vector3(cursor, 0, 0), mesh })
        cursor += geometry.boundingBox.max.x + 3
    }
}

loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    generateASCII(font)    
} );

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1500)
camera.position.set(0,0,1000)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()

let duration = 10; // Duration of the movement in seconds

let angle = 0 
const radius = 1000
const speed = 0.01

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    nameArray.forEach((value) => {
       
        let t = elapsedTime / duration;
        t = Math.min(t, 1); // Clamp value to 1
        value.mesh.position.lerpVectors(value.initialPosition, value.targetPosition, t);
        console.log(value.mesh.position)
        //value.mesh.lookAt(camera.position)
    })

    asciis.forEach((mesh) => {
        const randomX = Math.random() * 2 * Math.PI; // Rotation around X axis
        const randomY = Math.random() * 2 * Math.PI; // Rotation around Y axis
        const randomZ = Math.random() * 2 * Math.PI; // Rotation around Z axis   
        mesh.rotation.set(randomX, randomY, randomZ);
    })

    // // Calculate the camera's new position
    //     angle += speed;
    //     camera.position.x = Math.sin(angle) * radius;
    //     camera.position.z = Math.cos(angle) * radius;

    // // Make the camera look at the center of the scene
    // camera.lookAt(scene.position);
    // //console.log(height)

    
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