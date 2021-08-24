class Feed {
    constructor() {
        document.addEventListener('click', this.handleDelete.bind(this));
    }

    async handleDelete(e) {
        if (
            (e.target.tag === 'BUTTON' || e.target.tagName === 'BUTTON') &&
            e.target.classList[1] === 'feed-delete'
        ) {
            let id = e.target.getAttribute('data-feed-id');

            try {
                let res = await fetch(`/api/feedback/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                res = await res.json();
                if (!res.success) {
                    console.log('Something went wrong again.');
                }
            } catch {
                console.log('Something went wrong');
            }
        }
    }

    stop() {
        document.removeEventListener('click', this.handleDelete.bind(this));
    }
}

export default Feed;
