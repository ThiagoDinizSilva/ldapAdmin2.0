import axios from 'axios';

const api = axios.create({
 baseURL: 'http://10.1.113.242:3001',
 headers: {

 }
});

export default api;
