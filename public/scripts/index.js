// Imports
import * as THREE from './three/build/three.module.js';
import vertexShader from './shaders/vertex.js';
import fragmentShader from './shaders/fragmentPlane.js';
import Setup from './threeSetup.js';

class Index {
    constructor() {
        this.roles = [
            'STUDENT',
            'WEB DEVELOPER',
            'ANDROID DEVELOPER',
            'PROGRAMMER',
        ];
        this.index = 0;
        this.interval = 150;
        this.timeGap = 50;
        this.rolesContainer = document.querySelector('#roles');
        this.animateRoles();
    }

    changeIndex() {
        this.index = this.index + 1 == this.roles.length ? 0 : this.index + 1;
    }

    animateRoles() {
        let cur = this.roles[this.index];
        this.displayRole(cur);
        setTimeout(() => {
            this.removeRole(cur);
        }, this.interval * cur.length + this.timeGap);
        setTimeout(() => {
            this.animateRoles();
        }, this.interval * cur.length * 2 + 3 * this.timeGap);
    }

    displayRole(cur) {
        let charIndex = 0;
        let id = setInterval(() => {
            this.rolesContainer.textContent =
                this.rolesContainer.textContent + cur[charIndex];
            charIndex++;
        }, this.interval);
        setTimeout(() => {
            clearInterval(id);
        }, this.interval * cur.length);
    }
    removeRole(cur) {
        let charIndex = cur.length - 1;
        let id = setInterval(() => {
            this.rolesContainer.textContent =
                this.rolesContainer.textContent.slice(0, charIndex);
            charIndex--;
        }, this.interval);
        setTimeout(() => {
            clearInterval(id);
            this.changeIndex();
        }, this.interval * cur.length + this.timeGap);
    }

    stopRender() {}

    render() {}
}

export default Index;
