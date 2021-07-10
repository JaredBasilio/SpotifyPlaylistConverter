import axios from 'axios';
const KEY = 'AIzaSyC9tCWYCOXArXv5MgPXiAg4IemtJ0kw_Gw'; // mention your youtube API key here

export default axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
        part: 'snippet',
        maxResults: 100,
        key: KEY
    }
})