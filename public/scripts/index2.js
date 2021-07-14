// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
// import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { FilmPass } from './three/examples/jsm/postprocessing/FilmPass.js';
import setup from './main.js';
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
const setupImage = new Setup(imageCanvas, false, orthCamera);
const mainLight = new THREE.AmbientLight(0xffffff, 1);
setupImage.scene.add(mainLight);

// Image plane
const planeGeom = new THREE.PlaneBufferGeometry(
    imageCanvas.clientWidth,
    imageCanvas.clientHeight,
    10,
    10
);
// const planeMat = new THREE.ShaderMaterial({
//     vertexShader,
//     fragmentShader,
//     uniforms: {
//         imgTexture: {
//             value: new THREE.TextureLoader().load('../images/index_back.jpg'),
//         },
//         u_time: {
//             type: 'f',
//             value: 0,
//         },
//     },
// });
const planeMat = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('../images/index_back.jpg'),
});
const plane = new THREE.Mesh(planeGeom, planeMat);
plane.position.set(0, 0, -15);
// plane.scale.set(2, 2, 2);
setupImage.scene.add(plane);

// Mousemove
window.addEventListener('mousemove', (e) => {
    setup.mouse = {
        x: -(e.clientX - canvas.width / 2) / canvas.width,
        y: -(e.clientY - canvas.height / 2) / canvas.height,
    };
});

// Render everything
const render = () => {
    setup.render();
    setupImage.render();
    window.requestAnimationFrame(render);
};
render();
