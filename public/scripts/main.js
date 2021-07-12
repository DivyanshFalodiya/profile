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

// On device orientation for sensors
const handleOrientation = (e) => {
    mouse = {
        x: e.gamma / 180,
        y: e.beta / 360,
    };
};
window.addEventListener('deviceorientation', handleOrientation, true);

// Render everything
const render = () => {
    setup.render(mouse);
    window.requestAnimationFrame(render);
};
render();
