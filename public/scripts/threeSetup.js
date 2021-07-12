import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.1-bsY6rEPcA1ZYyZeKdbHd/mode=imports/optimized/three.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

export default class Setup {
    constructor(canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            10000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Set up stars
        const nStars = 10000; // 500 to 1000
        this.addStars(3000, '#ffffff', 5000, 5000);
        this.addStars(2000, '#ffff00', 5000, 5000);
        this.addStars(3000, '#ff00ff', 5000, 5000);
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
    addStars(nStars, color, xRange, yRange) {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color,
        });

        const starVertices = [];
        for (let i = 0; i < nStars; i++) {
            const x = (Math.random() - 0.5) * xRange * 2;
            const y = (Math.random() - 0.5) * yRange * 2;
            const z = -(Math.random() * 200) - 500;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starVertices, 3)
        );

        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    // Render
    render(mouse) {
        gsap.to(this.camera.rotation, {
            y: mouse.x * 0.2,
            x: mouse.y * 0.2,
            delay: 0.1,
            duration: 0.5,
        });
        this.renderer.render(this.scene, this.camera);
    }
}
