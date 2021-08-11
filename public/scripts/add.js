class Add {
    constructor() {
        this.form = document.querySelector('#edit-form');
        this.loader = document.querySelector('#loader');
        this.button = document.querySelector('#button-update');
        this.error = document.querySelector('.error p');
        this.success = document.querySelector('.success p');
        this.image = document.querySelector('#edit-project-image');
        this.imageUrl = document.querySelector('#input-project-image');
        this.imageUrl.addEventListener(
            'keyup',
            (e) => (this.image.src = e.target.value)
        );
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        let tech = this.form.tech.value.split(',');
        tech = tech.map((l) => l.trim());

        const project = {
            title: this.form.title.value,
            image: this.form.image.value,
            about: this.form.about.value,
            link: this.form.link.value,
            tech: tech,
        };
        const id = this.form.id.value;

        this.error.textContent = '';
        this.success.textContent = '';
        this.button.style.display = 'none';
        this.loader.style.display = 'block';

        try {
            const res = await fetch(`/api/projects/`, {
                method: 'POST',
                body: JSON.stringify(project),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.error) {
                this.error.textContent = data.error;
            }

            if (data.success) {
                this.success.textContent = data.success;
            }
            this.button.style.display = 'block';
            this.loader.style.display = 'none';
        } catch {
            this.error.textContent = 'Something went wrong. Please try later.';
            this.loader.style.display = 'none';
        }
    }

    stop() {
        this.form.removeEventListener(this.handleFormSubmit.bind(this));
    }
}

export default Add;
