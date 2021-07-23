// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
// import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { FilmPass } from './three/examples/jsm/postprocessing/FilmPass.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';

class Projects {
    constructor(setup) {
        this.setup = setup;
        this.meshes = [];
        this.addPlane();
    }

    addPlane() {
        const planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 10, 10);
        const planeMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                imgTexture: {
                    value: new THREE.TextureLoader().load(
                        '../images/index_back.jpg'
                    ),
                },
                u_time: {
                    type: 'f',
                    value: 0,
                },
            },
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -10;
        this.setup.scene.add(plane);

        this.meshes.push(plane);
    }

    stop() {
        this.meshes.forEach((mesh) => {
            this.setup.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
    }
    render() {}
}

export default Projects;
