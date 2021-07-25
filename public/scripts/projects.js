// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';

class Projects {
    constructor(setup) {
        this.setup = setup;
        this.meshes = [];
        this.group = new THREE.Group();
        this.circleRadius = 0;
        this.planeSize = 20;
        this.data = [];
        this.fetchProjects();
    }

    fetchProjects() {
        fetch('/api/projects')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.data = res;
                this.circleRadius =
                    (this.data.length * this.planeSize) / (2 * Math.PI);
                this.addObjects();
            });
    }

    addObjects() {
        let arcAngle = this.planeSize / this.circleRadius;
        this.data.forEach((project, index) => {
            let plane = this.addPlane(project);
            let rotAngle = arcAngle * index;
            this.group.add(plane);
        });
        this.setup.scene.add(this.group);
    }

    addPlane(project) {
        let posZ = -15;
        let circleX = 0;
        let circleZ = posZ - this.circleRadius;
        const planeGeometry = new THREE.PlaneBufferGeometry(
            this.planeSize,
            this.planeSize,
            10,
            10
        );

        const vCount = planeGeometry.attributes.position.count;
        const vPositions = planeGeometry.attributes.position.array;
        for (let i = 2; i < 3 * vCount; i += 3) {
            vPositions[i] =
                circleZ +
                Math.sqrt(
                    this.circleRadius * this.circleRadius -
                        Math.pow(vPositions[i - 2] - circleX, 2)
                );
        }

        const planeMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                imgTexture: {
                    value: new THREE.TextureLoader().load(project.image),
                },
                u_time: {
                    type: 'f',
                    value: 0,
                },
            },
            side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = posZ;

        // this.setup.scene.add(plane);
        this.meshes.push(plane);

        return plane;
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
