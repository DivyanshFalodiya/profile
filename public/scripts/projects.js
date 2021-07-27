// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

class Projects {
    constructor() {
        this.canvas = document.querySelector('#projects-canvas');
        this.canvasParent = document.querySelector('.container');
        this.canvasParent.style.minHeight = '100vh';
        this.setup = new Setup(this.canvas, false, null, false);
        this.meshes = [];
        this.group = new THREE.Group();
        this.circleRadius = 0;
        this.planeSize = this.getPlaneSize();
        this.data = [];
        this.fetchProjects();
        this.addEventListeners();
    }

    getPlaneSize() {
        let smaller =
            this.canvas.clientWidth > this.canvas.clientWidth
                ? this.canvas.clientWidth
                : this.canvas.clientHeight;
        console.log(this.canvas.clientWidth, this.canvas.clientHeight);
        // console.log(smaller / 8);
        return 20;
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
            let planeObject = this.addPlane(project);
            let rotAngle = arcAngle * index;
            planeObject.rotation.y = rotAngle;
            this.group.add(planeObject);
        });
        this.setup.scene.add(this.group);
    }

    addPlane(project) {
        let posZ = -15;
        let circleX = 0;
        let circleZ = posZ - this.circleRadius;

        const parentObject = new THREE.Object3D();

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
                vPositions[i] -
                this.circleRadius +
                Math.sqrt(
                    this.circleRadius * this.circleRadius -
                        Math.pow(vPositions[i - 2], 2)
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
        plane.position.set(0, 0, this.circleRadius + 2);

        parentObject.add(plane);
        parentObject.position.set(circleX, 0, circleZ);

        this.meshes.push(parentObject);

        return parentObject;
    }

    handleResize() {
        this.canvas.width = this.canvasParent.clientWidth;
        this.canvas.height = (this.canvasParent.clientWidth * 720) / 1280;
        if (window.innerWidth <= 450) {
            this.canvas.height = this.canvasParent.clientHeight / 2;
        }

        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';

        console.log(this.canvas.width, this.canvas.height);

        // Update camera
        this.setup.camera.aspect =
            this.canvas.clientWidth / this.canvas.clientHeight;
        this.setup.camera.updateProjectionMatrix();

        // Update renderer
        this.setup.renderer.setPixelRatio(window.devicePixelRatio);
        this.setup.renderer.setSize(
            this.canvas.clientWidth,
            this.canvas.clientHeight
        );

        // Update composer
        this.setup.composer.setPixelRatio(window.devicePixelRatio);
        this.setup.composer.setSize(
            this.canvas.clientWidth,
            this.canvas.clientHeight
        );
    }

    addEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    stop() {
        this.setup.scene.remove(this.group);
        this.group.children.forEach((mesh) => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
    }
    render() {
        this.setup.render();
    }
}

export default Projects;
