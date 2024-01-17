import * as THREE from 'three'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture8 = textureLoader.load('./textures/matcaps/8.png')
matcapTexture8.colorSpace = THREE.SRGBColorSpace

const matCapTexture4 = textureLoader.load('./textures/matcaps/4.png');
matCapTexture4.colorSpace = THREE.SRGBColorSpace;

const matCapTexture6 = textureLoader.load('./textures/matcaps/6.png')
matCapTexture6.colorSpace = THREE.SRGBColorSpace;
const matCapTexture2 = textureLoader.load('./textures/matcaps/2.png')
matCapTexture2.colorSpace = THREE.SRGBColorSpace;

class Core{
    constructor(propertys) {
        
        const material = new THREE.MeshPhysicalMaterial()
        material.color = new THREE.Color("#ff204d")
        material.metalness = 0
        material.transmission = 1
        material.ior = 1.5
        material.thickness = 0.5
        material.roughness = 0.3

        const rec1 = new THREE.BoxGeometry(2, 4, .4); 
        const rec2 = new THREE.BoxGeometry(4, 2, .4); 

        this.rec1Mesh = new THREE.Mesh(rec1, material);
        this.rec2Mesh = new THREE.Mesh(rec2, material);

        this.rec1Mesh.position.set(-1, 2, 0) 
        this.rec2Mesh.position.set(1, -1, .3)

        this.group = new THREE.Group() 
        this.group.add(this.rec1Mesh, this.rec2Mesh)
    }
    animation(uTime) {
        
        this.rec1Mesh.rotation.y = -uTime / 2;
        this.rec1Mesh.rotation.z = Math.sin(uTime / 2);
        
        this.rec2Mesh.rotation.x = uTime / 2;
        this.rec2Mesh.rotation.z = Math.cos(uTime);
    }
    addGUI(gui) {
        gui.add(material, 'metalness').min(0).max(1).step(0.0001)
        gui.add(material, 'roughness').min(0).max(1).step(0.0001)
        gui.add(material, 'transmission').min(0).max(1).step(0.0001)
        gui.add(material, 'ior').min(1).max(10).step(0.0001)
        gui.add(material, 'thickness').min(0).max(1).step(0.0001)
    }
}

class Stripes {
    constructor(frequency=4) {

        this.group = new THREE.Group(); 

        // Decide what color to use 
        const options = [matCapTexture2, matCapTexture6, matCapTexture4];
        const index = Math.floor(Math.random() * options.length);
        const material = new THREE.MeshMatcapMaterial()
        material.matcap = options[index]

        //console.log(index)
        for (var i  = 0; i < frequency; i++) {

            const geometry = new THREE.BoxGeometry(.5, 6, .5) 

            const mesh = new THREE.Mesh(geometry, material) 
            mesh.position.x = i;

            this.group.add(mesh);
        }

        this.group.scale.set(.4, .4);

    }
}

class Boxes{
    constructor() {

        this.group = new THREE.Group();

        const material = new THREE.MeshMatcapMaterial({ color: "#ffaaff"})
        material.matcap = matCapTexture4

        const box = new THREE.BoxGeometry(1, 1, 1)

        for (var i = 0; i < 3; i++) {

            for (var j = 0; j < 3; j++) {

                const mesh =  new THREE.Mesh(box, material) 

                mesh.position.x += i + (i*.5) 
                mesh.position.y = j + (j*.5);
                //mesh.position.z = i / j

                this.group.add(mesh)
            }
            
        }




        this.group.scale.set(.4, .4, .4)

        //for (var i = 0; i < )
    }
}

class Rectangles {
    constructor() {
        
    }
}



export {Core, Stripes, Boxes}