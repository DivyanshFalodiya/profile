// action = '/auth';
// method = 'POST';
// enctype = 'application/json';

class Login {
    constructor() {
        this.loginForm = document.querySelector('#auth-form');
        this.loginButton = document.querySelector('#button-login');
        this.loader = document.querySelector('#loader');
        this.error = document.querySelector('.error p');
        this.success = document.querySelector('.success p');
        this.loginForm.addEventListener(
            'submit',
            this.handleFormSubmit.bind(this)
        );
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const email = this.loginForm.email.value;

        this.error.textContent = '';
        this.success.textContent = '';
        this.loginButton.style.display = 'none';
        this.loader.style.display = 'block';

        try {
            const res = await fetch('/auth', {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.error) {
                this.error.textContent = data.error;
            }

            if (data.success) {
                this.success.textContent = data.success;
            }
            this.loginButton.style.display = 'block';
            this.loader.style.display = 'none';
        } catch {}
    }

    stop() {
        this.loginForm.removeEventListener(this.handleFormSubmit.bind(this));
    }
}

export default Login;
