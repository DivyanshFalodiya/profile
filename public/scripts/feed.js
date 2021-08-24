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
                console.log('1');
                let res = await fetch(`/api/feedback/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log(res);
                res = await res.json();
                console.log('3');
                if (!res.success) {
                    console.log('Something went wrong.');
                    console.log('4');
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
