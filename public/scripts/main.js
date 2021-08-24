// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
// import { AfterimagePass } from './three/examples/jsm/postprocessing/AfterimagePass.js';
import Setup from './threeSetup.js';
import Index from './index.js';
import Projects from './projects.js';
import Login from './login.js';
import Edit from './edit.js';
import Add from './add.js';
import Feed from './feed.js';
import FeedAdd from './feedadd.js';

// Initialize
let script = null;
const pageLoader = document.querySelector('#page-loader');
const navLinks = document.getElementsByClassName('nav-links')[0];
const anchors = navLinks.querySelectorAll('a');
const ham = document.querySelector('.ham-container');
const canvas = document.getElementById('canvas');
const setup = new Setup(canvas);

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
    setup.render();
    if (script && typeof script.render === 'function') {
        script.render();
    }
    window.requestAnimationFrame(render);
};
render();

// Page load
(() => {
    gsap.to(pageLoader, {
        pointerEvents: 'none',
        // opacity: '0',
        x: '-100%',
        duration: '1',
        onComplete: () => {
            document.body.style.overflowY = 'auto';
            pageLoader.querySelector('#page-loader-svg').style.visibility =
                'hidden';
        },
    });
})();

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
                script = new Index();
            },
            beforeLeave(data) {
                script = null;
            },
        },
        {
            namespace: 'projects',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {},
            beforeLeave(data) {
                script = null;
            },
        },
        {
            namespace: 'login',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                script = new Login();
            },
            beforeLeave(data) {
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
                script = new Edit();
            },
            beforeLeave(data) {
                script.stop();
                script = null;
            },
        },
        {
            namespace: 'add',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                script = new Add();
            },
            beforeLeave(data) {
                script.stop();
                script = null;
            },
        },
        {
            namespace: 'project',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                script = new Projects(setup);
            },
            beforeLeave(data) {
                script.stop();
                script = null;
            },
        },
        {
            namespace: 'feed',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                script = new Feed();
            },
            beforeLeave(data) {
                script.stop();
                script = null;
            },
        },
        {
            namespace: 'feedadd',
            beforeEnter() {
                updateAnchors();
            },
            afterEnter(data) {
                script = new FeedAdd();
            },
            beforeLeave(data) {
                script.stop();
                script = null;
            },
        },
    ],
});
