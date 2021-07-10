import youtube from './youtube.js'

export default function YoutubeEquivalent({ name }) {
    async function handleSubmit(name) {
        await youtube.get('/search', {
            params: {
                q: name
            }
        })
        .then(res => console.log(res.data.etag))
        .catch(error => console.log(error));
    };
    handleSubmit(name);
}