import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from './three/examples/jsm/postprocessing/BloomPass.js';
import vertexShader from './shaders/vertexParticles.js';
import fragmentShader from './shaders/fragment.js';
import vertexShaderPlane from './shaders/vertex.js';
import fragmentShaderPlane from './shaders/fragmentPlane.js';

export default class Setup {
    constructor(canvas, stars = true, camera = null, rotCamera = true) {
        // noise.seed(Math.random());

        // Mouse
        this.mouse = {
            x: 0,
            y: 0,
        };

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        if (!camera) {
            this.camera = new THREE.PerspectiveCamera(
                75,
                canvas.clientWidth / canvas.clientHeight,
                0.1,
                10000
            );
        } else {
            this.camera = camera;
        }
        this.rotCamera = rotCamera;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Composer and passes
        this.composer = new EffectComposer(this.renderer);

        // Render pass
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.addPass(this.renderPass);

        // Clock
        this.clock = new THREE.Clock();
    }

    // Add point light
    addPointLight(color, x, y, z) {
        let light = new THREE.PointLight(color, 1);
        light.position.set(x, y, z);
        this.scene.add(light);
        return light;
    }

    // Add pass
    addPass(pass) {
        this.composer.addPass(pass);
    }

    // Convert 2d to 3d space
    convertClientToWorld(x, y) {
        var vec = new THREE.Vector3();
        var pos = new THREE.Vector3();

        vec.set(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1,
            0.5
        );
        vec.unproject(this.camera);
        vec.sub(this.camera.position).normalize();

        var distance = -this.camera.position.z / vec.z;
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));

        return pos;
    }

    testScene() {
        let mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.ShaderMaterial({
                vertexShader: vertexShaderPlane,
                fragmentShader: fragmentShaderPlane,
                uniforms: {
                    imgTexture: {
                        value: new THREE.TextureLoader().load(
                            '../images/divyansh.png'
                        ),
                    },
                    u_time: {
                        type: 'f',
                        value: 0,
                    },
                },
                side: THREE.DoubleSide,
            })
        );
        mesh.position.set(0, 0, -20);
        this.scene.add(mesh);
    }

    // Render
    render(animate = false) {
        if (this.rotCamera) {
            gsap.to(this.camera.rotation, {
                y: this.mouse.x * 0.1,
                x: this.mouse.y * 0.1,
                delay: 0.1,
                duration: 0.5,
            });
        }
        this.composer.render();
    }
}
