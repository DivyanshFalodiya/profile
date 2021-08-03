// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
import { AfterimagePass } from './three/examples/jsm/postprocessing/AfterimagePass.js';
import Setup from './threeSetup.js';
import Index from './index2.js';
import Projects from './projects.js';
import Login from './login.js';

// Initialize
let requestId = null;
let animate = false;
let forceAnimate = false;
let script = null;
const navLinks = document.getElementsByClassName('nav-links')[0];
const anchors = navLinks.querySelectorAll('a');
const ham = document.querySelector('.ham-container');
const animCircle = document.querySelector('#animation-circle');
const animInnerCircle = document.querySelector('#inner-circle');
const canvas = document.getElementById('canvas');
const setup = new Setup(canvas);

// Set up eveything
setup.scene.background = '#000';

// Passes
// let bloomPass = new UnrealBloomPass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     1.5,
//     0.4
// );
// setup.addPass(bloomPass);

const afterImagePass = new AfterimagePass();
afterImagePass.uniforms['damp'].value = 0.4;
setup.composer.addPass(afterImagePass);

// On mouve move
window.addEventListener('pointermove', (e) => {
    setup.mouse = {
        x: -(e.clientX - canvas.width / 2) / canvas.width,
        y: -(e.clientY - canvas.height / 2) / canvas.height,
    };
});

// On mouse click
window.addEventListener('click', (e) => {
    let pos = setup.convertClientToWorld(e.clientX, e.clientY);
});

// On window resize
window.addEventListener('resize', () => {
    // Camera update
    setup.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    setup.camera.updateProjectionMatrix();

    // Update stars
    setup.resetStarPositions();

    // Renderer update
    setup.renderer.setPixelRatio(window.devicePixelRatio);
    setup.renderer.setSize(window.innerWidth, window.innerHeight);

    setup.composer.setPixelRatio(window.devicePixelRatio);
    setup.composer.setSize(window.innerWidth, window.innerHeight);
});

// Handling page transitions
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName == 'A' || e.target.nodeName == 'A') {
        if (e.target.href === window.location.href) e.preventDefault();
        if (window.innerWidth < 768) {
            ham.click();
        }
    }
});

// Ham click
ham.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links-active');
    ham.classList.toggle('ham-active');
});

// Animate SVG circle
animCircle.addEventListener('click', () => {
    forceAnimate = !forceAnimate;
    animInnerCircle.classList.toggle('anim-circle-active');
    if (forceAnimate) {
        animate = true;
    } else {
        animate = false;
    }
});

// On device orientation for sensors
const handleOrientation = (e) => {
    setup.mouse = {
        x: e.gamma / 180,
        y: e.beta / 360,
    };
};
window.addEventListener('deviceorientation', handleOrientation, true);

// Background Render
const render = () => {
    setup.render(animate);
    switch (window.location.pathname) {
        case '/':
            if (script) script.render();
            break;
        case '/work':
            if (script) script.render();
            break;
        default:
            break;
    }
    window.requestAnimationFrame(render);
};
render();

// Update anchors
const updateAnchors = () => {
    anchors.forEach((a) => {
        if (a.href == window.location.href) {
            a.style.color = 'skyblue';
        } else {
            a.style.color = 'white';
        }
    });
};

// BARBA CONTENT
barba.use(barbaCss);

barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                if (!forceAnimate) {
                    animate = false;
                }
                script = new Index();
            },
            beforeLeave(data) {
                if (!forceAnimate) {
                    animate = true;
                }
                script = null;
            },
        },
        {
            namespace: 'projects',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                if (!forceAnimate) {
                    animate = false;
                }
                script = new Projects();
            },
            beforeLeave(data) {
                if (!forceAnimate) {
                    animate = true;
                }
                script.stop();
                script = null;
            },
        },
        {
            namespace: 'login',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                if (!forceAnimate) animate = false;
                script = new Login();
            },
            beforeLeave(data) {
                if (!forceAnimate) animate = true;
                script.stop();
                script = null;
            },
        },
        {
            namespace: 'edit',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                if (!forceAnimate) animate = false;
                // script = new Login();
            },
            beforeLeave(data) {
                if (!forceAnimate) animate = true;
                // script.stop();
                // script = null;
            },
        },
    ],
});
