// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';

class Projects {
    constructor(setup) {
        this.setup = setup;
        this.id = this.getID();
        this.project = null;
        this.projectDetails = document.querySelector('#project-details');
        this.loader = document.querySelector('#loader');
        this.loader.style.display = 'block';
        this.fetchProject().then((res) => {
            this.project = res;
            this.plane = this.createPlane(this.project.image);
        });

        // Delete
        try {
            this.deleteButton = document.querySelector(
                '#project-delete-button'
            );
            this.deleteButton.addEventListener(
                'click',
                this.handleDelete.bind(this)
            );
        } catch {}
    }

    async fetchProject() {
        try {
            const res = await fetch(`/api/projects/${this.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data;
        } catch {
            console.log('Something went wrong');
            return null;
        }
    }

    getID() {
        let id = window.location.pathname;
        id = id.slice(6, id.length);
        if (id[id.length - 1] == '/') id = id.slice(0, id.length - 1);
        return id;
    }

    createPlane(url) {
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

        new THREE.TextureLoader().load(url, (image) => {
            planeMaterial.uniforms.imgTexture.value = image;
            planeMaterial.uniforms.isTexture.value = true;
            gsap.to(plane.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.45,
                onComplete: () => {
                    this.loader.style.display = 'none';
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
                Math.sin(x + y + this.setup.clock.getElapsedTime() * 2) * 0.2;
        }
        this.plane.geometry.attributes.position.array = positions;
        this.plane.geometry.attributes.position.needsUpdate = true;
    }

    async handleDelete() {
        try {
            let res = await fetch(`/api/projects/${this.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(res);
            res = await res.json();
            if (!res.success) console.log('Another Something went wrong');
        } catch {
            console.log('Something went wrong!');
        }
    }

    stop() {
        if (this.deleteButton) {
            this.deleteButton.removeEventListener(
                'click',
                this.handleDelete.bind(this)
            );
        }
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
        if (this.plane) this.updatePlane();
        gsap.to(this.setup.camera.rotation, {
            x: this.setup.mouse.y * 0.1,
            y: this.setup.mouse.x * 0.1,
        });
    }
}

export default Projects;
