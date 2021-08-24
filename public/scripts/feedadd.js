class FeedAdd {
    constructor() {
        this.rating = 0;
        this.form = document.querySelector('#edit-form');
        this.loader = document.querySelector('#loader');
        this.button = document.querySelector('#button-update');
        this.ratingContainer = document.querySelector('#rating-container');
        this.stars = Array.from(document.getElementsByClassName('rating-star'));
        this.error = document.querySelector('.error p');
        this.success = document.querySelector('.success p');
        this.form.addEventListener('submit', this.handleFormSubmit.bind(this));
        this.ratingContainer.addEventListener(
            'click',
            this.handleRatingChange.bind(this)
        );
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const feed = {
            rating: this.rating,
            detail: this.form.detail.value,
            username: this.form.username.value,
        };
        this.error.textContent = '';
        this.success.textContent = '';
        this.button.style.display = 'none';
        this.loader.style.display = 'block';

        try {
            if (this.rating === 0) throw 'Rating cannot be 0.';
            const res = await fetch(`/api/feedback/`, {
                method: 'POST',
                body: JSON.stringify(feed),
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (data.error) {
                this.error.textContent = data.error;
            }

            if (data.success) {
                this.success.textContent = data.success;
                location.href = '/feedback';
            }
        } catch (ex) {
            this.error.textContent = ex
                ? ex
                : 'Something went wrong. Please try later.';
        }
        this.button.style.display = 'block';
        this.loader.style.display = 'none';
    }

    setRating(rating) {
        this.rating = parseInt(rating);
        let i = 0;
        for (; i < rating; i++) {
            this.stars[i].style.color = 'gold';
        }
        for (; i < 5; i++) {
            this.stars[i].style.color = 'white';
        }
    }

    handleRatingChange(e) {
        let targetId = e.target.id;
        targetId = targetId.split('-');
        if (targetId[0] === 'star') {
            this.setRating(targetId[1]);
        }
    }

    stop() {
        this.form.removeEventListener(this.handleFormSubmit.bind(this));
        this.ratingContainer.removeEventListener(
            this.handleRatingChange.bind(this)
        );
    }
}

export default FeedAdd;
