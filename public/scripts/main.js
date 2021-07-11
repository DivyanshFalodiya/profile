// Imports
import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.130.1-bsY6rEPcA1ZYyZeKdbHd/mode=imports/optimized/three.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';
import Setup from './threeSetup.js';

// Initialize
var mouse = {
    x: 0,
    y: 0,
};
const canvas = document.getElementById('canvas');
const setup = new Setup(canvas);

// Set up eveything
setup.scene.background = '#000';
setup.camera.position.set(0, 0, 10);

// Set up stars
const nStars = 10000; // 500 to 1000
setup.addStars(3000, '#ffffff');
setup.addStars(2000, '#ffff00');
setup.addStars(3000, '#ff00ff');

// On mouve move
window.addEventListener('mousemove', (e) => {
    mouse = {
        x: -(e.clientX - canvas.width / 2) / canvas.width,
        y: -(e.clientY - canvas.height / 2) / canvas.height,
    };
});

// On window resize
window.addEventListener('resize', () => {
    // Canvas resize
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    // Camera update
    setup.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    setup.camera.updateProjectionMatrix();

    // Renderer update
    setup.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    setup.renderer.setPixelRatio(window.devicePixelRatio);
});

// Render everything
const render = () => {
    gsap.to(setup.camera.rotation, {
        y: mouse.x * 0.5,
        x: mouse.y * 0.5,
        delay: 0.1,
        duration: 0.5,
    });
    setup.render();
    window.requestAnimationFrame(render);
};
render();
