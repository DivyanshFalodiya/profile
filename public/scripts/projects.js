// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
// import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { FilmPass } from './three/examples/jsm/postprocessing/FilmPass.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragment.js';

// Image plane
const planeGeom = new THREE.PlaneBufferGeometry(8, 10, 10, 10);
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
});
const plane = new THREE.Mesh(planeGeom, planeMat);
plane.position.set(0, 0, -10);
// setup.scene.add(plane);

// Mousemove
// window.addEventListener('pointer', (e) => {
//     setup.mouse = {
//         x: -(e.clientX - canvas.width / 2) / canvas.width,
//         y: -(e.clientY - canvas.height / 2) / canvas.height,
//     };
// });

// Render everything
const render = () => {
    // plane.material.uniforms.u_time.value = setup.clock.getElapsedTime();
    // setup.render();
    window.requestAnimationFrame(render);
};
export default render;
