import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let geometry = new THREE.CylinderGeometry(3, 3, 1, 60, 60);
const material = new THREE.MeshBasicMaterial( { color: 0xe21d1d } );
let mesh = new THREE.Mesh( geometry, material );
mesh.rotateX(Math.PI / 2);
scene.add( mesh );


gui.addColor(material, 'color')

material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
            #include <common>

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
    )


    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
    
            float angle = position.y * 0.3;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.yz;
        `
    )
}

let star = null;

function generateStar() {

    if (star != null) {

    }
}   

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000)
camera.position.set(400,0, 0)
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


let angle = 0 
const radius = 0.01
const speed = 0.01/4

let height = 1
let goBack = false
const cap = 600; 

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // Calculate the camera's new position
    // angle += speed;
    // camera.position.x = Math.sin(angle) * radius;
    // camera.position.z = Math.cos(angle) * radius;

    // // Make the camera look at the center of the scene
    // camera.lookAt(scene.position);

    scene.remove(mesh) 
    geometry.dispose() 


    if (goBack) {
        height -= .5
    } else {
        height += .5
    }
    

    if (height >= cap || height <= 0) {
        //console.log("hi")
        if(!goBack) {
            goBack = true
        } else {
            goBack = false
        }
    }

    //console.log(height)

    geometry = new THREE.CylinderGeometry(10, 10, height, 50, 50)
    mesh = new THREE.Mesh( geometry, material )
    mesh.rotateX(Math.PI / 2);
    scene.add(mesh)
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