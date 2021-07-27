// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

class Projects {
    constructor() {
        // Canvas and other setup
        this.canvas = document.querySelector('#projects-canvas');
        this.canvasParent = document.querySelector('.container');
        this.canvasParent.style.minHeight = '100vh';
        this.setup = new Setup(this.canvas, false, null, false);

        // Meshes
        this.meshes = [];
        this.group = new THREE.Group();

        // Other important variables
        this.pointerPosition = undefined;
        this.circleRadius = 0;
        this.planeSize = this.getPlaneSize();
        this.data = [];

        // Fetch projects and add event listeners
        this.fetchProjects();
        this.addEventListeners();
    }

    getPlaneSize() {
        // let smaller =
        //     this.canvas.clientWidth > this.canvas.clientWidth
        //         ? this.canvas.clientWidth
        //         : this.canvas.clientHeight;
        // console.log(this.canvas.clientWidth, this.canvas.clientHeight);
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

    // Handle window resize
    handleResize() {
        // Update canvas
        this.canvas.width = this.canvasParent.clientWidth;
        this.canvas.height = (this.canvasParent.clientWidth * 720) / 1280;
        if (window.innerWidth <= 450) {
            this.canvas.height = this.canvasParent.clientHeight / 2;
        }

        this.canvas.style.width = this.canvas.width + 'px';
        this.canvas.style.height = this.canvas.height + 'px';

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

    // Handle pointer movements on the canvas for rotating the group
    handlePointerDown(e) {
        this.pointerPosition = {
            x: e.clientX,
            y: e.clientY,
        };
    }
    handlePointerMove(e) {
        // If the pointer is down and moving
        if (this.pointerPosition) {
            let curPointerPosition = {
                x: e.clientX,
                y: e.clientY,
            };
            let direction = {
                x: curPointerPosition.x - this.pointerPosition.x,
                y: curPointerPosition.y - this.pointerPosition.y,
            };
            let arcAngle = this.planeSize / this.circleRadius;
            this.meshes.forEach((obj) => {
                let dir =
                    (direction.x < 0 ? -1 : 1) * arcAngle + obj.rotation.y;
                gsap.to(obj.rotation, {
                    y: dir,
                    duration: 1,
                });
            });
        }
    }
    handlePointerUp(e) {
        this.pointerPosition = undefined;
    }

    addEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.canvas.addEventListener(
            'pointerdown',
            this.handlePointerDown.bind(this)
        );
        this.canvas.addEventListener(
            'pointermove',
            this.handlePointerMove.bind(this)
        );
        this.canvas.addEventListener(
            'pointerup',
            this.handlePointerUp.bind(this)
        );
        this.canvas.addEventListener(
            'pointercancel',
            this.handlePointerUp.bind(this)
        );
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
