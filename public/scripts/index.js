// Imports
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
        this.dispTimer = null;
        this.removeTimer = null;
        this.resetTimer = null;
        this.animateRoles();

        window.onfocus = () => {
            this.animateRoles();
        };
        window.onblur = () => {
            this.rolesContainer.textContent = '';
            clearTimeout(this.dispTimer);
            clearTimeout(this.removeTimer);
            clearTimeout(this.resetTimer);
        };
    }

    animateRoles() {
        let cur = this.roles[this.index];
        this.displayRole(cur);
        this.removeTimer = setTimeout(() => {
            this.removeRole(cur);
        }, this.interval * (cur.length + 1) + 3 * this.timeGap);
        this.resetTimer = setTimeout(() => {
            this.index =
                this.index + 1 == this.roles.length ? 0 : this.index + 1;
            this.animateRoles();
        }, this.interval * (cur.length + 1) * 2 + 3 * this.timeGap);
    }

    displayRole(cur) {
        let charIndex = 0;
        this.dispTimer = setInterval(() => {
            this.rolesContainer.textContent =
                this.rolesContainer.textContent +
                (cur[charIndex] ? cur[charIndex] : '');
            charIndex++;
        }, this.interval);
        setTimeout(() => {
            clearInterval(this.dispTimer);
        }, this.interval * (cur.length + 1));
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
        }, this.interval * (cur.length + 1) + this.timeGap);
    }

    stopRender() {}

    render() {}
}

export default Index;
