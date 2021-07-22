import * as THREE from './three/build/three.module.js';
import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from './three/examples/jsm/postprocessing/BloomPass.js';
import vertexShader from './shaders/vertexParticles.js';
import fragmentShader from './shaders/fragment.js';

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

        // Set up stars
        if (stars) {
            this.starDensity = 5;
            this.starZ = -200;
            this.stars = [];
            this.stars.push(
                this.addStars(this.starDensity, 0xffffff, 5000, 5000)
            );
            this.stars.push(
                this.addStars(this.starDensity, 0xf9fe97, 5000, 5000)
            );
            this.stars.push(
                this.addStars(this.starDensity, 0x97f3fe, 5000, 5000)
            );
        }
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

    // Add stars in background
    addStars(density, color, xRange, yRange) {
        let threeColor = new THREE.Color(color);
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            vertexColors: THREE.VertexColors,
            uniforms: {
                time: {
                    type: 'f',
                    value: 0,
                },
            },
        });

        let nStars = (density * window.innerWidth) / 50;

        const starVertices = [];
        const starColors = [];
        starGeometry.velocity = [];
        for (let i = 0; i < nStars; i++) {
            const x = (Math.random() - 0.5) * window.innerWidth * 2;
            const y = (Math.random() - 0.5) * window.innerHeight * 2;
            const z = Math.random() * this.starZ - 500;
            starVertices.push(x, y, z);
            starColors.push(threeColor.r, threeColor.g, threeColor.b);
            starGeometry.velocity.push(Math.random() * 50 + 10);
        }
        starGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starVertices, 3)
        );
        starGeometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(starColors, 3)
        );

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);

        return stars;
    }

    // Update stars
    updateStars(animate) {
        this.stars.forEach((star) => {
            star.material.uniforms.time.value = this.clock.getElapsedTime();
            if (animate) {
                const positions = star.geometry.attributes.position.array;
                const count = star.geometry.attributes.position.count;

                for (let i = 2, j = 0; i < count * 3; i += 3, j += 1) {
                    if (positions[i] > 0) {
                        positions[i] = Math.random() * this.starZ - 500;
                    } else {
                        positions[i] += star.geometry.velocity[j];
                        star.geometry.velocity[j]--;
                        if (star.geometry.velocity[j] < 0) {
                            star.geometry.velocity[j] = Math.random() * 50 + 10;
                        }
                    }
                }
                star.geometry.attributes.position.needsUpdate = true;
            }
        });
    }

    resetStarPositions() {
        this.stars.forEach((star) => {
            this.scene.remove(star);
            star.geometry.dispose();
            star.material.dispose();
        });
        this.stars.push(this.addStars(this.starDensity, 0xffffff, 5000, 5000));
        this.stars.push(this.addStars(this.starDensity, 0xf9fe97, 5000, 5000));
        this.stars.push(this.addStars(this.starDensity, 0x97f3fe, 5000, 5000));
    }

    // Render
    render(animate = false) {
        if (this.stars) {
            this.updateStars(animate);
        }
        if (this.rotCamera) {
            gsap.to(this.camera.rotation, {
                y: this.mouse.x * 0.2,
                x: this.mouse.y * 0.2,
                delay: 0.1,
                duration: 0.5,
            });
        }
        this.composer.render();
    }
}
