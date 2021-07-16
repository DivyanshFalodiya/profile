// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
// import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { FilmPass } from './three/examples/jsm/postprocessing/FilmPass.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

// Initialize
const imageCanvas = document.getElementById('image-canvas');
const orthCamera = new THREE.OrthographicCamera(
    imageCanvas.clientWidth / -2,
    imageCanvas.clientWidth / 2,
    imageCanvas.clientHeight / 2,
    imageCanvas.clientHeight / -2,
    0.1,
    1000
);
const setupImage = new Setup(imageCanvas, false, orthCamera, false);
const mainLight = new THREE.AmbientLight(0xffffff, 1);
setupImage.scene.add(mainLight);

// Image plane
const planeGeom = new THREE.PlaneBufferGeometry(
    imageCanvas.clientWidth,
    imageCanvas.clientHeight,
    50,
    50
);
const planeMat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        imgTexture: {
            value: new THREE.TextureLoader().load('../images/index_back.jpg'),
        },
        u_time: {
            type: 'f',
            value: 0,
        },
    },
    wireframe: true,
});
// const planeMat = new THREE.MeshStandardMaterial({
//     map: new THREE.TextureLoader().load('../images/index_back.jpg'),
// });
const plane = new THREE.Mesh(planeGeom, planeMat);
plane.position.set(0, 0, -1);
setupImage.scene.add(plane);

// Canvas hover
imageCanvas.addEventListener('mouseenter', (e) => {
    let pos3d = setupImage.convertClientToWorld(e.offsetX, e.offsetY);
    // updatePlane(pos3d);
});

console.log('index2');

// Mousemove
// window.addEventListener('pointermove', (e) => {
//     setup.mouse = {
//         x: -(e.clientX - canvas.width / 2) / canvas.width,
//         y: -(e.clientY - canvas.height / 2) / canvas.height,
//     };
// });

// Resize
window.addEventListener('resize', () => {
    // Canvas resize
    // imageCanvas.width = window.innerWidth;
    // imageCanvas.height = window.innerHeight;
    // imageCanvas.style.width = window.innerWidth + 'px';
    // imageCanvas.style.height = window.innerHeight + 'px';

    // Camera update
    setupImage.camera.aspect =
        imageCanvas.clientWidth / imageCanvas.clientHeight;
    setupImage.camera.updateProjectionMatrix();

    // Renderer update
    setupImage.renderer.setSize(
        imageCanvas.clientWidth,
        imageCanvas.clientHeight
    );
    setupImage.renderer.setPixelRatio(window.devicePixelRatio);
});

// Update plane
const updatePlane = (pos = { x: 0, y: 0 }) => {
    const elapsedTime = setupImage.clock.getElapsedTime();
    const count = plane.geometry.attributes.position.count * 3;
    const positions = plane.geometry.attributes.position.array;

    for (let i = 2; i < count; i += 3) {
        let waveX = Math.sin(positions[i - 2] + elapsedTime) * 0.2;
        let waveY = Math.sin(positions[i - 1] + elapsedTime) * 0.2;
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
        positions[i] = waveX + waveY;
    }

    plane.geometry.attributes.position.needsUpdate = true;
};

// Render everything
const render = () => {
    updatePlane();
    setupImage.render();
    window.requestAnimationFrame(render);
};
render();
