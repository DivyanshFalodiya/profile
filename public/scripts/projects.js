// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

class Projects {
    constructor(setup) {
        this.setup = setup;
        this.projectDetails = document.querySelector('#project-details');
        this.plane = this.createPlane();
    }

    createPlane() {
        const planeGeometry = new THREE.PlaneGeometry(10, 10, 64, 64);
        const planeMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                isTexture: { value: false },
                imgTexture: {},
                u_time: { value: 0, type: 'f' },
            },
            blending: THREE.AdditiveBlending,
        });

        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -10;
        plane.scale.set(0, 0, 0);
        this.setup.scene.add(plane);

        new THREE.TextureLoader().load('https://picsum.photos/500', (image) => {
            planeMaterial.uniforms.imgTexture.value = image;
            planeMaterial.uniforms.isTexture.value = true;
            gsap.to(plane.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.45,
                onComplete: () => {
                    gsap.to(this.projectDetails, { opacity: 1, duration: 0.5 });
                },
            });
        });

        return plane;
    }

    updatePlane() {
        let positions = this.plane.geometry.attributes.position.array;
        let count = this.plane.geometry.attributes.position.count;
        for (let i = 2; i < count * 3; i += 3) {
            let x = positions[i - 2],
                y = positions[i - 1];
            positions[i] =
                Math.sin(x + y + this.setup.clock.getElapsedTime()) * 0.2;
        }
        this.plane.geometry.attributes.position.array = positions;
        this.plane.geometry.attributes.position.needsUpdate = true;
    }

    stop() {
        this.projectDetails.style.opacity = 0;
        gsap.to(this.plane.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.45,
            onComplete: () => {
                this.setup.scene.remove(this.plane);
                this.plane.geometry.dispose();
                this.plane.material.dispose();
            },
        });
    }
    render() {
        this.updatePlane();
    }
}

export default Projects;
