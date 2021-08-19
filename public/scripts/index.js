// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

class Index {
    constructor() {
        this.requestId = null;
        this.canvas = document.getElementById('image-canvas');
        this.camera = new THREE.OrthographicCamera(
            this.canvas.clientWidth / -2,
            this.canvas.clientWidth / 2,
            this.canvas.clientHeight / 2,
            this.canvas.clientHeight / -2,
            0.1,
            1000
        );
        this.setupImage = new Setup(this.canvas, false, this.camera, false);
        this.light = new THREE.AmbientLight(0xffffff, 1);
        this.setupImage.scene.add(this.light);

        // this.setupImage.composer.addPass(new GlitchPass());

        this.plane = this.addImagePlane();
    }

    addImagePlane() {
        const planeGeom = new THREE.PlaneBufferGeometry(
            this.canvas.clientWidth,
            this.canvas.clientHeight,
            50,
            50
        );
        const planeMat = new THREE.ShaderMaterial({
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
            // wireframe: true,
        });
        // const planeMat = new THREE.MeshStandardMaterial({
        //     map: new THREE.TextureLoader().load('../images/index_back.jpg'),
        // });
        const plane = new THREE.Mesh(planeGeom, planeMat);
        plane.position.set(0, 0, -1);
        this.setupImage.scene.add(plane);
        return plane;
    }

    addListeners() {
        this.canvas.addEventListener('mouseenter', (e) => {
            let pos3d = this.setupImage.convertClientToWorld(
                e.offsetX,
                e.offsetY
            );
        });
        this.canvas.addEventListener('resize', () => {
            // Canvas resize
            // imageCanvas.width = window.innerWidth;
            // imageCanvas.height = window.innerHeight;
            // imageCanvas.style.width = window.innerWidth + 'px';
            // imageCanvas.style.height = window.innerHeight + 'px';

            // Camera update
            this.setupImage.camera.aspect =
                this.canvas.clientWidth / this.canvas.clientHeight;
            this.setupImage.camera.updateProjectionMatrix();

            // Renderer update
            this.setupImage.renderer.setSize(
                this.canvas.clientWidth,
                this.canvas.clientHeight
            );
            this.setupImage.renderer.setPixelRatio(window.devicePixelRatio);
        });
    }

    updatePlane(pos = { x: 0, y: 0 }) {
        const elapsedTime = this.setupImage.clock.getElapsedTime();
        const count = this.plane.geometry.attributes.position.count * 3;
        const positions = this.plane.geometry.attributes.position.array;

        for (let i = 2; i < count; i += 3) {
            let waveX = Math.sin(positions[i - 2] + elapsedTime) * 0.2;
            let waveY = Math.sin(positions[i - 1] + elapsedTime) * 0.2;
            let waveZ = Math.sin(positions[i] + elapsedTime) * 0.2;
            // waveXY =
            //     Math.sin(positions[i - 2] + positions[i - 1] + elapsedTime) * 0.2;
            // waveMix =
            //     Math.sin(positions[i - 2] - positions[i - 1] + elapsedTime) * 0.2;
            // var waveMix2 =
            //     Math.sin(
            //         -Math.sqrt(
            //             Math.pow(positions[i - 2] - pos.x, 2) +
            //                 Math.pow(positions[i - 1] - pos.y, 2)
            //         ) +
            //             elapsedTime * 5
            //     ) * 0.5;
            positions[i] = waveX + waveY + waveZ;
        }

        this.plane.geometry.attributes.position.needsUpdate = true;
    }

    render() {
        this.updatePlane();
        this.setupImage.render();
    }

    stopRender() {
        if (this.requestId) window.cancelAnimationFrame(this.requestId);
    }

    setUp() {
        this.addListeners();
        this.render();
    }
}

export default Index;
