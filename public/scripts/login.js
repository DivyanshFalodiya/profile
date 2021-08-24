// action = '/auth';
// method = 'POST';
// enctype = 'application/json';

class Login {
    constructor() {
        this.loginForm = document.querySelector('#auth-form');
        this.loginButton = document.querySelector('#button-login');
        this.logoutButton = document.querySelector('#logout-button');
        this.loader = document.querySelector('#loader');
        this.error = document.querySelector('.error p');
        this.success = document.querySelector('.success p');
        if (this.loginForm)
            this.loginForm.addEventListener(
                'submit',
                this.handleFormSubmit.bind(this)
            );
        if (this.logoutButton)
            this.logoutButton.addEventListener(
                'click',
                () => (location.href = '/auth/logout')
            );
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const email = this.loginForm.email.value;
        const secret = this.loginForm.secret.value;

        this.error.textContent = '';
        this.success.textContent = '';
        this.loginButton.style.display = 'none';
        this.loader.style.display = 'block';

        try {
            const res = await fetch('/auth', {
                method: 'POST',
                body: JSON.stringify({ email, secret }),
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
        } catch {
            this.error.textContent = 'Something went wrong. Please try later.';
        }
    }

    stop() {
        if (this.loginForm)
            this.loginForm.removeEventListener(
                this.handleFormSubmit.bind(this)
            );
        if (this.logoutButton)
            this.logoutButton.removeEventListener(
                'click',
                () => (location.href = '/auth/logout')
            );
    }
}

export default Login;
