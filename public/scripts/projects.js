// Imports
import * as THREE from './three/build/three.module.js';
// import { EffectComposer } from './three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from './three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from './three/examples/jsm/postprocessing/GlitchPass.js';
// import { UnrealBloomPass } from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
// import { FilmPass } from './three/examples/jsm/postprocessing/FilmPass.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';

class Projects {
    constructor(setup) {
        this.setup = setup;
        this.projects = document.querySelectorAll('.project');
        this.stripContent();
    }

    stripContent() {
        for (let i = 0; i < this.projects.length; i++) {
            let contentEl = this.projects[i].childNodes[3];
            let titleEl = contentEl.childNodes[1];
            let detailEl = contentEl.childNodes[3];

            let title = titleEl.textContent;
            if (title.length > 55) {
                title = title.slice(0, 55) + '...';
                titleEl.textContent = title;
            }

            let detail = detailEl.textContent;
            if (detail.length > 100) {
                detail = detail.slice(0, 100) + '...';
                detailEl.textContent = detail;
            }
        }
    }

    stop() {
        // this.removeListeners();
        // this.meshes.forEach((mesh) => {
        //     this.setup.scene.remove(mesh);
        //     mesh.geometry.dispose();
        //     mesh.material.dispose();
        // });
    }
    render() {}
}

export default Projects;
