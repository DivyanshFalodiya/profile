// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

class Projects {
    constructor() {
        // DOM setup
        this.canvas = document.querySelector('#projects-canvas');
        this.canvas.style.visibility = 'hidden';
        this.canvasContainer = document.querySelector(
            '#project-canvas-container'
        );
        this.canvasParent = document.querySelector('.container');
        this.canvasParent.style.minHeight = '100vh';
        this.projectContainer = document.querySelector('#project-content');
        this.projectTitle = document.querySelector('#project-title');
        this.projectDetails = document.querySelector('#project-details');
        this.projectLink = document.querySelector('#project-link');
        this.projectTech = document.querySelector('#project-tech');
        this.editProject = document.querySelector('#edit-project-link');
        this.deleteProject = document.querySelector('#project-delete');
        this.next = document.querySelector('#project-next');
        this.prev = document.querySelector('#project-prev');
        this.loader = document.querySelector('#loader');

        // THREE setup
        this.setup = new Setup(this.canvas, false, null, false);

        // Meshes
        this.meshes = [];
        this.group = new THREE.Group();

        // Other important variables
        this.pointerPosition = undefined;
        this.position = 0;
        this.circleRadius = 0;
        this.planeSize = this.getPlaneSize();
        this.data = [];

        // Fetch projects and add event listeners
        this.fetchProjects();
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
        this.loader.style.display = 'block';
        fetch('/api/projects')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                this.data = res;
                this.circleRadius =
                    (this.data.length * this.planeSize) / (2 * Math.PI);
                return this.addObjects();
            })
            .then(() => {
                this.addEventListeners();
                this.canvas.style.visibility = 'visible';
                this.loader.style.display = 'none';
            });
    }

    async addObjects() {
        let arcAngle = this.planeSize / this.circleRadius;
        this.data.forEach((project, index) => {
            let planeObject = this.addPlane(project);
            let rotAngle = arcAngle * index;
            planeObject.rotation.y = rotAngle;
            this.group.add(planeObject);
        });
        this.setup.scene.add(this.group);
        this.updateDom();
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
                distanceFront: {
                    type: 'f',
                    value: 0,
                },
                u_time: {
                    type: 'f',
                    value: 0,
                },
            },
            side: THREE.DoubleSide,
            transparent: true,
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0, 0, this.circleRadius + 2);

        parentObject.add(plane);
        parentObject.position.set(circleX, 0, circleZ);

        this.meshes.push(parentObject);

        return parentObject;
    }

    updateMeshes() {
        let time = this.setup.clock.getElapsedTime();
        let arcAngleDeg =
            ((this.planeSize / this.circleRadius) * 180) / Math.PI;
        this.meshes.forEach((mesh, index) => {
            // Shader uniforms
            let curAngle = mesh.rotation.y;
            if (curAngle < 0) {
                curAngle = curAngle + Math.PI * 2;
            }
            curAngle = Math.round((curAngle * 180) / Math.PI);
            curAngle = curAngle % 360;
            if (curAngle > 180) {
                curAngle = 360 - curAngle;
            }
            if (curAngle >= arcAngleDeg) {
                curAngle = 180;
            }
            let dist = curAngle / 180;
            mesh.children[0].material.uniforms.distanceFront.value = 1 - dist;
            mesh.children[0].material.uniforms.u_time.value = time;
        });
    }

    // Update html
    updateDom() {
        let project = this.data[this.position];
        this.projectTitle.textContent = project.title;
        this.projectDetails.textContent = project.about;
        this.projectLink.href = project.link;
        if (this.editProject)
            this.editProject.href = `/work/edit/${project._id}`;

        while (this.projectTech.firstChild)
            this.projectTech.removeChild(this.projectTech.firstChild);
        project.tech.forEach((tech) => {
            let listEl = document.createElement('li');
            listEl.classList.add('devicon');
            let icon = document.createElement('i');
            icon.classList.add(`devicon-${tech}-plain`);
            if (tech !== 'nextjs') icon.classList.add(`colored`);
            listEl.appendChild(icon);
            this.projectTech.appendChild(listEl);
        });

        // Animate
        gsap.fromTo(
            this.projectContainer,
            {
                opacity: 0,
            },
            {
                opacity: 1,
                duration: 1,
            }
        );
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
        e.preventDefault();
        // If the pointer is down and moving
        if (this.pointerPosition) {
            let direction = {
                x: e.clientX - this.pointerPosition.x,
                y: e.clientY - this.pointerPosition.y,
            };
            this.meshes.forEach((obj, index) => {
                let dir = direction.x * 0.015 + obj.rotation.y;
                gsap.to(obj.rotation, {
                    y: dir,
                    duration: 0.2,
                });
            });
            this.pointerPosition = {
                x: e.clientX,
                y: e.clientY,
            };
        }
    }
    handlePointerUp(e) {
        this.pointerPosition = undefined;
        let arcAngle = this.planeSize / this.circleRadius;
        let originalRotation = this.meshes[this.position].rotation.y;
        if (originalRotation < 0)
            originalRotation = 2 * Math.PI + originalRotation;
        let curRotation = originalRotation + arcAngle / 2;
        curRotation = curRotation - (curRotation % arcAngle);
        let diff = curRotation - originalRotation;
        this.meshes.forEach((obj, index) => {
            let rot = obj.rotation.y;
            let newRot = rot + diff;
            gsap.to(obj.rotation, {
                y: newRot,
                duration: 0.5,
            });
            let angleDeg = Math.round((newRot * 180) / Math.PI);
            angleDeg = angleDeg % 360;
            if (angleDeg == 0 && this.position != index) {
                this.position = index;
                this.updateDom();
            }
        });
    }

    handleNext(e) {
        let arcAngle = this.planeSize / this.circleRadius;
        this.meshes.forEach((obj, index) => {
            let newRot = obj.rotation.y - arcAngle;
            gsap.to(obj.rotation, {
                y: newRot,
                duration: 0.5,
            });
            let angleDeg = Math.round((newRot * 180) / Math.PI);
            angleDeg = angleDeg % 360;
            if (angleDeg == 0 && this.position != index) {
                this.position = index;
                this.updateDom();
            }
        });
    }

    handlePrev(e) {
        let arcAngle = this.planeSize / this.circleRadius;
        this.meshes.forEach((obj, index) => {
            let newRot = obj.rotation.y + arcAngle;
            gsap.to(obj.rotation, {
                y: newRot,
                duration: 0.5,
            });
            let angleDeg = Math.round((newRot * 180) / Math.PI);
            angleDeg = angleDeg % 360;
            if (angleDeg == 0 && this.position != index) {
                this.position = index;
                this.updateDom();
            }
        });
    }

    async handleDelete(e) {
        const project = this.data[this.position];
        try {
            let result = await fetch(`/api/projects/${project._id}`, {
                method: 'DELeTE',
                headers: { 'Content-Type': 'application/json' },
            });
            result = await result.json();
            if (result.success === true) location.reload();
        } catch {}
    }

    addEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.canvasContainer.addEventListener(
            'pointerdown',
            this.handlePointerDown.bind(this)
        );
        this.canvasContainer.addEventListener(
            'pointermove',
            this.handlePointerMove.bind(this)
        );
        this.canvasContainer.addEventListener(
            'pointerup',
            this.handlePointerUp.bind(this)
        );
        this.canvasContainer.addEventListener(
            'pointercancel',
            this.handlePointerUp.bind(this)
        );
        this.canvasContainer.addEventListener(
            'pointerleave',
            this.handlePointerUp.bind(this)
        );
        this.next.addEventListener('click', this.handleNext.bind(this));
        this.prev.addEventListener('click', this.handlePrev.bind(this));
        if (this.deleteProject) {
            this.deleteProject.addEventListener(
                'click',
                this.handleDelete.bind(this)
            );
        }
    }

    removeEventListeners() {
        window.removeEventListener('resize', this.handleResize.bind(this));
        this.canvasContainer.removeEventListener(
            'pointerdown',
            this.handlePointerDown.bind(this)
        );
        this.canvasContainer.removeEventListener(
            'pointermove',
            this.handlePointerMove.bind(this)
        );
        this.canvasContainer.removeEventListener(
            'pointerup',
            this.handlePointerUp.bind(this)
        );
        this.canvasContainer.removeEventListener(
            'pointercancel',
            this.handlePointerUp.bind(this)
        );
        this.canvasContainer.removeEventListener(
            'pointerleave',
            this.handlePointerUp.bind(this)
        );
        this.next.removeEventListener('click', this.handleNext.bind(this));
        this.prev.removeEventListener('click', this.handlePrev.bind(this));
        if (this.deleteProject) {
            this.deleteProject.removeEventListener(
                'click',
                this.handleDelete.bind(this)
            );
        }
    }

    stop() {
        this.setup.scene.remove(this.group);
        this.group.children.forEach((mesh) => {
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
    }
    render() {
        this.updateMeshes();
        this.setup.render();
    }
}

export default Projects;
