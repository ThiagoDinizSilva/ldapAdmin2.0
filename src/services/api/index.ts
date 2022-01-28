import axios from 'axios';

const api = axios.create({
 baseURL: 'http://api.dryad.tld:3001',
 headers: {

 }
});

export default api;